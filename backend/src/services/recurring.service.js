const { v4: uuid } = require("uuid");

const DEFAULT_LOOKAHEAD_DAYS = 14;
const DEFAULT_MIN_LEAD_DAYS = 7;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

function normalizeRecurrenceInput(recurrence, fallbackStartDate) {
  if (!recurrence) return null;

  const frequency = recurrence.frequency;
  const allowed = ["WEEKLY", "MONTHLY", "CUSTOM_DAYS"];
  if (!allowed.includes(frequency)) {
    throw new Error("Invalid recurrence frequency");
  }

  const intervalValue = Number.isFinite(Number(recurrence.interval_value))
    ? Math.max(1, Number(recurrence.interval_value))
    : 1;

  const startDate = recurrence.start_date || fallbackStartDate;
  if (!startDate) {
    throw new Error("recurrence.start_date is required");
  }

  const endDate = recurrence.end_date || null;
  if (endDate && new Date(endDate) < new Date(startDate)) {
    throw new Error("recurrence.end_date cannot be before start_date");
  }

  let dayOfWeek = recurrence.day_of_week;
  let dayOfMonth = recurrence.day_of_month;
  let daysOfWeek = normalizeDaysOfWeek(recurrence.days_of_week);

  if (frequency === "WEEKLY") {
    const fallbackDow = (dayOfWeek === undefined || dayOfWeek === null || dayOfWeek === "")
      ? toUtcDateOnly(startDate).getUTCDay()
      : Number(dayOfWeek);
    daysOfWeek = normalizeDaysOfWeek(daysOfWeek && daysOfWeek.length ? daysOfWeek : [fallbackDow], fallbackDow);
    if (!daysOfWeek || daysOfWeek.length === 0) {
      throw new Error("recurrence.days_of_week must include at least one day");
    }
    dayOfWeek = daysOfWeek[0];
    dayOfMonth = null;
  } else if (frequency === "MONTHLY") {
    if (dayOfMonth === undefined || dayOfMonth === null || dayOfMonth === "") {
      dayOfMonth = toUtcDateOnly(startDate).getUTCDate();
    }
    if (dayOfMonth < 1 || dayOfMonth > 31) {
      throw new Error("recurrence.day_of_month must be between 1 and 31");
    }
    dayOfWeek = null;
    daysOfWeek = null;
  } else {
    dayOfWeek = null;
    dayOfMonth = null;
    daysOfWeek = null;
  }

  return {
    frequency,
    interval_value: intervalValue,
    day_of_week: dayOfWeek,
    days_of_week: daysOfWeek,
    day_of_month: dayOfMonth,
    start_date: startDate,
    end_date: endDate,
  };
}

function startRecurringScheduler(pool, options = {}) {
  const scheduleAt = options.scheduleAt || { hour: 2, minute: 0 };
  let running = false;

  const run = async () => {
    if (running) return;
    running = true;
    try {
      await generateRecurringJobs(pool, options);
    } catch (err) {
      console.error("Recurring scheduler failed:", err);
    } finally {
      running = false;
    }
  };

  const scheduleNext = () => {
    const delay = msUntilNextRun(scheduleAt);
    setTimeout(async () => {
      await run();
      scheduleNext();
    }, delay);
  };

  // Run once shortly after boot, then daily.
  setTimeout(run, 5000);
  scheduleNext();
}

async function generateRecurringJobs(pool, options = {}) {
  const lookaheadDays = Math.max(
    1,
    Number(options.lookaheadDays ?? DEFAULT_LOOKAHEAD_DAYS)
  );
  const minLeadDays = Math.max(
    0,
    Number(options.minLeadDays ?? DEFAULT_MIN_LEAD_DAYS)
  );
  const today = startOfUtcDay(new Date());
  const windowStart = addDays(today, Math.min(minLeadDays, lookaheadDays));
  const windowEnd = addDays(today, lookaheadDays);

  const connection = await pool.getConnection();

  try {
    const [rules] = await connection.query(
      `
      SELECT
        r.id AS rule_id,
        r.booking_id,
        r.frequency,
        r.interval_value,
        r.day_of_week,
        r.day_of_month,
        r.days_of_week,
        r.start_date AS rule_start_date,
        r.end_date AS rule_end_date,
        r.last_generated_until,
        b.sub_services,
        b.service_type,
        b.company_id,
        b.contact_id,
        b.created_by_user_id,
        b.status
      FROM recurring_rules r
      INNER JOIN bookings b ON b.id = r.booking_id
      WHERE b.status = 'ACTIVE'
      `
    );

    for (const rule of rules) {
      try {
        await processRule(connection, rule, windowStart, windowEnd);
      } catch (err) {
        console.error(
          `Recurring processing failed for booking ${rule.booking_id}:`,
          err
        );
      }
    }
  } finally {
    connection.release();
  }
}

async function processRule(connection, rule, windowStart, windowEnd) {
  const subServices = parseSubServices(rule.sub_services);
  if (subServices.length === 0) return;

  const ruleStart = toUtcDateOnly(rule.rule_start_date);
  if (!ruleStart) return;

  const ruleEnd = rule.rule_end_date ? toUtcDateOnly(rule.rule_end_date) : null;
  if (ruleEnd && ruleEnd < windowStart) return;

  const lastGenerated = rule.last_generated_until
    ? toUtcDateOnly(rule.last_generated_until)
    : null;

  const cursor = maxDate(
    ruleStart,
    windowStart,
    lastGenerated ? addDays(lastGenerated, 1) : null
  );

  if (cursor > windowEnd) return;

  const occurrences = getOccurrencesInWindow(rule, cursor, windowEnd, ruleStart, ruleEnd);
  if (occurrences.length === 0) return;

  const [existingRows] = await connection.query(
    `
    SELECT id, sub_service, DATE(start_date) AS start_date
    FROM jobs
    WHERE booking_id = ?
      AND start_date IS NOT NULL
      AND DATE(start_date) BETWEEN ? AND ?
    `,
    [rule.booking_id, formatDate(windowStart), formatDate(windowEnd)]
  );

  const existingKeys = new Set(
    existingRows.map(row => `${row.sub_service}::${formatDate(toUtcDateOnly(row.start_date))}`)
  );

  const jobsToCreate = [];
  for (const occ of occurrences) {
    const occKeyDate = formatDate(occ);
    for (const service of subServices) {
      const key = `${service}::${occKeyDate}`;
      if (!existingKeys.has(key)) {
        jobsToCreate.push({ date: occ, sub_service: service });
      }
    }
  }

  const lastOccurrence = occurrences[occurrences.length - 1];
  const lastOccurrenceStr = formatDate(lastOccurrence);
  const currentLast = rule.last_generated_until
    ? formatDate(toUtcDateOnly(rule.last_generated_until))
    : null;
  const shouldUpdateLast = !currentLast || currentLast < lastOccurrenceStr;

  if (jobsToCreate.length === 0) {
    if (shouldUpdateLast) {
      await connection.query(
        `UPDATE recurring_rules SET last_generated_until = ? WHERE id = ?`,
        [lastOccurrenceStr, rule.rule_id]
      );
    }
    return;
  }

  await connection.beginTransaction();
  try {
    let companyCode = null;
    if (rule.company_id) {
      const [[company]] = await connection.query(
        `SELECT code FROM companies WHERE id = ?`,
        [rule.company_id]
      );
      companyCode = company?.code || null;
    }

    const [[seqRow]] = await connection.query(
      `SELECT value FROM sequences WHERE name = 'job_code' FOR UPDATE`
    );
    let sequenceValue = seqRow.value;

    for (const job of jobsToCreate) {
      sequenceValue += 1;
      const jobId = uuid();
      const jobDate = formatDate(job.date);
      const jobCode = companyCode
        ? `${companyCode} ${sequenceValue}`
        : `${new Date().getFullYear()}-${sequenceValue}`;

      await connection.query(
        `INSERT INTO jobs (
          id,
          code,
          booking_id,
          service_type,
          sub_service,
          status,
          supervisor_id,
          team,
          company_id,
          requested_by_contact_id,
          created_by_user_id,
          approval_status,
          start_date,
          due_date,
          created_at,
          updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          jobId,
          jobCode,
          rule.booking_id,
          rule.service_type,
          job.sub_service,
          "NOT_STARTED",
          null,
          JSON.stringify([]),
          rule.company_id || null,
          rule.contact_id || null,
          rule.created_by_user_id || null,
          null,
          jobDate,
          jobDate
        ]
      );

      await connection.query(
        `INSERT INTO job_history (
          id, job_id, action, message, created_by_user_id, created_at
        ) VALUES (?, ?, ?, ?, ?, NOW())`,
        [
          uuid(),
          jobId,
          "AUTO_CREATED_RECURRING_VISIT",
          `Recurring visit auto-created for ${jobDate}`,
          rule.created_by_user_id || null
        ]
      );
    }

    await connection.query(
      `UPDATE sequences SET value = ? WHERE name = 'job_code'`,
      [sequenceValue]
    );

    if (shouldUpdateLast) {
      await connection.query(
        `UPDATE recurring_rules SET last_generated_until = ? WHERE id = ?`,
        [lastOccurrenceStr, rule.rule_id]
      );
    }

    await connection.commit();
  } catch (err) {
    await connection.rollback();
    console.error(
      `Failed generating recurring jobs for booking ${rule.booking_id}:`,
      err
    );
  }
}

function getOccurrencesInWindow(rule, cursor, windowEnd, ruleStart, ruleEnd) {
  const occurrences = [];
  const interval = Math.max(1, Number(rule.interval_value || 1));
  const windowLimit = ruleEnd && ruleEnd < windowEnd ? ruleEnd : windowEnd;

  if (rule.frequency === "CUSTOM_DAYS") {
    const diffDays = daysBetween(ruleStart, cursor);
    const steps = diffDays <= 0 ? 0 : Math.ceil(diffDays / interval);
    let next = addDays(ruleStart, steps * interval);
    while (next <= windowLimit) {
      occurrences.push(next);
      next = addDays(next, interval);
    }
  } else if (rule.frequency === "WEEKLY") {
    const daysOfWeek = normalizeDaysOfWeek(
      rule.days_of_week,
      Number.isFinite(Number(rule.day_of_week))
        ? Number(rule.day_of_week)
        : ruleStart.getUTCDay()
    );
    const weeklyOccurrences = getWeeklyOccurrences({
      daysOfWeek,
      interval,
      cursor,
      windowLimit,
      ruleStart,
    });
    occurrences.push(...weeklyOccurrences);
  } else if (rule.frequency === "MONTHLY") {
    const targetDom = Number.isFinite(Number(rule.day_of_month))
      ? Number(rule.day_of_month)
      : ruleStart.getUTCDate();
    let next = alignMonthly(ruleStart, targetDom, interval);
    while (next < cursor) {
      next = addMonths(next, interval, targetDom);
    }
    while (next <= windowLimit) {
      occurrences.push(next);
      next = addMonths(next, interval, targetDom);
    }
  }

  return occurrences;
}

function normalizeDaysOfWeek(value, fallbackDay) {
  let days = [];

  if (Array.isArray(value)) {
    days = value;
  } else if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        days = parsed;
      } else if (value.includes(",")) {
        days = value.split(",");
      } else if (value.trim() !== "") {
        days = [value];
      }
    } catch {
      if (value.includes(",")) {
        days = value.split(",");
      } else if (value.trim() !== "") {
        days = [value];
      }
    }
  } else if (value !== undefined && value !== null && value !== "") {
    days = [value];
  }

  const normalized = Array.from(new Set(
    days
      .map(item => Number(item))
      .filter(item => Number.isInteger(item) && item >= 0 && item <= 6)
  ));

  if (normalized.length === 0 && Number.isInteger(fallbackDay) && fallbackDay >= 0 && fallbackDay <= 6) {
    return [fallbackDay];
  }

  return normalized;
}

function getWeeklyOccurrences({ daysOfWeek, interval, cursor, windowLimit, ruleStart }) {
  if (!daysOfWeek || daysOfWeek.length === 0) return [];
  const anchorWeekStart = startOfWeekSunday(ruleStart);
  const startWeekStart = startOfWeekSunday(cursor);
  const endWeekStart = startOfWeekSunday(windowLimit);
  const startWeekIndex = Math.max(0, Math.floor(daysBetween(anchorWeekStart, startWeekStart) / 7));
  const endWeekIndex = Math.max(0, Math.floor(daysBetween(anchorWeekStart, endWeekStart) / 7));
  const occurrences = [];

  for (let weekIndex = startWeekIndex; weekIndex <= endWeekIndex; weekIndex += 1) {
    if (weekIndex % interval !== 0) continue;

    for (const dow of daysOfWeek) {
      const candidate = addDays(anchorWeekStart, weekIndex * 7 + dow);
      if (candidate < ruleStart) continue;
      if (candidate < cursor) continue;
      if (candidate > windowLimit) continue;
      occurrences.push(candidate);
    }
  }

  occurrences.sort((a, b) => a.getTime() - b.getTime());
  return Array.from(new Map(occurrences.map(date => [formatDate(date), date])).values());
}

function parseSubServices(value) {
  if (!value) return [];
  if (Array.isArray(value)) {
    const normalized = value
      .map(item => (item === null || item === undefined ? "" : String(item).trim()))
      .filter(Boolean);
    return Array.from(new Set(normalized));
  }
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    const normalized = parsed
      .map(item => (item === null || item === undefined ? "" : String(item).trim()))
      .filter(Boolean);
    return Array.from(new Set(normalized));
  } catch {
    return [];
  }
}

function startOfUtcDay(date) {
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
}

function toUtcDateOnly(value) {
  if (!value) return null;
  if (value instanceof Date) {
    return startOfUtcDay(value);
  }
  if (typeof value === "string") {
    const parts = value.slice(0, 10).split("-");
    if (parts.length === 3) {
      const year = Number(parts[0]);
      const month = Number(parts[1]) - 1;
      const day = Number(parts[2]);
      return new Date(Date.UTC(year, month, day));
    }
  }
  return null;
}

function formatDate(date) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDays(date, days) {
  return new Date(date.getTime() + days * MS_PER_DAY);
}

function daysBetween(start, end) {
  return Math.round((end.getTime() - start.getTime()) / MS_PER_DAY);
}

function maxDate(...dates) {
  return dates.reduce((max, date) => {
    if (!date) return max;
    if (!max) return date;
    return date > max ? date : max;
  }, null);
}

function startOfWeekSunday(date) {
  const day = date.getUTCDay();
  return addDays(date, -day);
}

function alignMonthly(startDate, targetDom, intervalMonths) {
  const initial = setDayOfMonth(startDate, targetDom);
  if (initial < startDate) {
    return addMonths(initial, intervalMonths, targetDom);
  }
  return initial;
}

function setDayOfMonth(date, targetDom) {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  const daysIn = daysInMonth(year, month);
  const day = Math.min(targetDom, daysIn);
  return new Date(Date.UTC(year, month, day));
}

function addMonths(date, months, targetDom) {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  const total = month + months;
  const newYear = year + Math.floor(total / 12);
  const newMonth = ((total % 12) + 12) % 12;
  const daysIn = daysInMonth(newYear, newMonth);
  const day = Math.min(targetDom, daysIn);
  return new Date(Date.UTC(newYear, newMonth, day));
}

function daysInMonth(year, month) {
  return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
}

function msUntilNextRun({ hour = 2, minute = 0 } = {}) {
  const now = new Date();
  const next = new Date(now);
  next.setHours(hour, minute, 0, 0);
  if (next <= now) {
    next.setDate(next.getDate() + 1);
  }
  return next.getTime() - now.getTime();
}

module.exports = {
  normalizeRecurrenceInput,
  startRecurringScheduler,
  generateRecurringJobs,
};
