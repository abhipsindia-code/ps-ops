const { pool } = require("../../db");
const { v4: uuid } = require("uuid");
const { normalizeRecurrenceInput } = require("../services/recurring.service");

async function createBooking(req, res) {
  const { subServices, client, start_date, end_date, recurrence } = req.body;
  const created_by_user_id = req.user?.id;

  if (!subServices?.length) {
    return res.status(400).json({ error: "No services selected" });
  }
  if (start_date && end_date) {
    const start = new Date(start_date);
    const end = new Date(end_date);
    if (end < start) {
      return res.status(400).json({ error: "End date cannot be before start date" });
    }
  }
  if (!created_by_user_id) {
    return res.status(401).json({ error: "Unauthorized user" });
  }

  let recurrenceRule = null;
  if (recurrence) {
    try {
      recurrenceRule = normalizeRecurrenceInput(recurrence, start_date);
    } catch (err) {
      return res.status(400).json({ error: err.message || "Invalid recurrence" });
    }
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const { contact_id } = client || {};

    if (!contact_id) {
      throw new Error("requested_by_contact_id is required");
    }

    // 1) Fetch contact (source of truth)
    const [[contact]] = await connection.query(
      `SELECT id, company_id FROM contacts WHERE id = ?`,
      [contact_id]
    );

    if (!contact) {
      throw new Error("Invalid contact");
    }

    const jobCompanyId = contact.company_id || null;
    const serviceType = client?.serviceType || "BOTH";

    // 2) Resolve company code ONCE (if corporate / RWA)
    let companyCode = null;

    if (jobCompanyId) {
      const [[company]] = await connection.query(
        `SELECT code FROM companies WHERE id = ?`,
        [jobCompanyId]
      );

      if (!company) {
        throw new Error("Invalid company");
      }

      companyCode = company.code;
    }

    // 3) Create booking (lightweight, execution lives in jobs)
    const bookingId = uuid();
    const bookingCode = `B-${Date.now()}`;

    await connection.query(
      `INSERT INTO bookings (
        id,
        code,
        contact_id,
        company_id,
        service_type,
        sub_services,
        notes,
        created_by_user_id,
        created_at,
        status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), 'ACTIVE')`,
      [
        bookingId,
        bookingCode,
        contact.id,
        jobCompanyId,
        serviceType,
        JSON.stringify(subServices),
        client?.notes || null,
        created_by_user_id
      ]
    );

    if (recurrenceRule) {
      await connection.query(
        `INSERT INTO recurring_rules (
          id,
          booking_id,
          frequency,
          interval_value,
          day_of_week,
          days_of_week,
          day_of_month,
          start_date,
          end_date,
          last_generated_until
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NULL)`,
        [
          uuid(),
          bookingId,
          recurrenceRule.frequency,
          recurrenceRule.interval_value,
          recurrenceRule.day_of_week,
          recurrenceRule.days_of_week ? JSON.stringify(recurrenceRule.days_of_week) : null,
          recurrenceRule.day_of_month,
          recurrenceRule.start_date,
          recurrenceRule.end_date
        ]
      );
    }

    // 4) Create jobs
    const createdJobs = [];

    for (const service of subServices) {
      const jobId = uuid();

      const [[row]] = await connection.query(
        `SELECT value FROM sequences WHERE name = 'job_code' FOR UPDATE`
      );

      const nextValue = row.value + 1;

      await connection.query(
        `UPDATE sequences SET value = ? WHERE name = 'job_code'`,
        [nextValue]
      );

      // Job code logic
      const jobCode = companyCode
        ? `${companyCode} ${nextValue}`
        : `${new Date().getFullYear()}-${nextValue}`;

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
          approved_at,
          start_date,
          due_date,
          created_at,
          updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          jobId,
          jobCode,
          bookingId,
          serviceType,
          service,
          "CREATED",
          null,
          JSON.stringify([]),
          jobCompanyId,
          contact.id,
          created_by_user_id,
          null,
          null,
          start_date || null,
          end_date || null
        ]
      );

      await connection.query(
        `INSERT INTO job_history (
          id, job_id, action, message, created_by_user_id, created_at
        ) VALUES (?, ?, ?, ?, ?, NOW())`,
        [uuid(), jobId, "CREATED", "Job created", created_by_user_id]
      );

      createdJobs.push({
        id: jobId,
        code: jobCode,
        booking_id: bookingId,
        service_type: client?.serviceType || null,
        sub_service: service,
        status: "CREATED",
        team: [],
        start_date: start_date || null,
        dueDate: end_date || null,
      });
    }

    await connection.commit();

    res.json({
      success: true,
      jobs: createdJobs,
    });

  } catch (err) {
    await connection.rollback();
    console.error("Error creating jobs:", err);
    res.status(500).json({ error: err.message || "Failed to create jobs" });
  } finally {
    connection.release();
  }
}

module.exports = { createBooking };
