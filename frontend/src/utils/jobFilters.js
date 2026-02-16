const toStringSafe = (value) => (value == null ? "" : String(value));

const resolveDisplayName = (obj, fallback) =>
  obj?.name || obj?.full_name || obj?.email || fallback;

const resolveId = (obj, fallback) =>
  obj?.id || obj?.user_id || obj?._id || fallback;

export const STATUS_OPTIONS = [
  { value: "", label: "All statuses" },
  { value: "CREATED", label: "Created" },
  { value: "NOT_STARTED", label: "Not Started" },
  { value: "PENDING", label: "Pending" },
  { value: "LOST", label: "Lost" },
  { value: "AWAITING_APPROVAL", label: "Awaiting Approval" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "PAUSED", label: "Paused" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELED", label: "Canceled" },
];

export function getSupervisorOptions(jobs) {
  const map = new Map();
  jobs.forEach((job) => {
    const sup = job?.supervisor;
    if (!sup) return;

    if (typeof sup === "object") {
      const id = resolveId(sup, resolveDisplayName(sup, ""));
      const label = resolveDisplayName(sup, toStringSafe(id));
      if (!id) return;
      map.set(toStringSafe(id), { value: toStringSafe(id), label });
      return;
    }

    const value = toStringSafe(sup);
    if (!value) return;
    map.set(value, { value, label: value });
  });

  return Array.from(map.values()).sort((a, b) =>
    a.label.localeCompare(b.label)
  );
}

export function getTechnicianOptions(jobs) {
  const map = new Map();
  jobs.forEach((job) => {
    const team = Array.isArray(job?.team) ? job.team : [];
    team.forEach((member) => {
      if (member == null) return;
      if (typeof member === "object") {
        const id = resolveId(member, resolveDisplayName(member, ""));
        const label = resolveDisplayName(member, toStringSafe(id));
        if (!id) return;
        map.set(toStringSafe(id), { value: toStringSafe(id), label });
        return;
      }

      const value = toStringSafe(member);
      if (!value) return;
      map.set(value, { value, label: value });
    });
  });

  return Array.from(map.values()).sort((a, b) =>
    a.label.localeCompare(b.label)
  );
}

function matchesSupervisor(job, supervisorId) {
  if (!supervisorId) return true;
  const sup = job?.supervisor;
  if (!sup) return false;
  if (typeof sup === "object") {
    const id = resolveId(sup, resolveDisplayName(sup, ""));
    return toStringSafe(id) === supervisorId;
  }
  return toStringSafe(sup) === supervisorId;
}

function matchesTechnician(job, technicianId) {
  if (!technicianId) return true;
  const team = Array.isArray(job?.team) ? job.team : [];
  return team.some((member) => {
    if (member == null) return false;
    if (typeof member === "object") {
      const id = resolveId(member, resolveDisplayName(member, ""));
      return toStringSafe(id) === technicianId;
    }
    return toStringSafe(member) === technicianId;
  });
}

function getJobDate(job) {
  return (
    job?.start_date ||
    job?.startDate ||
    job?.dueDate ||
    job?.end_date ||
    job?.endDate ||
    job?.created_at ||
    job?.createdAt
  );
}

function matchesDateRange(job, startDate, endDate) {
  if (!startDate && !endDate) return true;
  const jobDateValue = getJobDate(job);
  if (!jobDateValue) return false;
  const jobDate = new Date(jobDateValue);
  if (Number.isNaN(jobDate.getTime())) return false;

  if (startDate) {
    const start = new Date(`${startDate}T00:00:00`);
    if (jobDate < start) return false;
  }

  if (endDate) {
    const end = new Date(`${endDate}T23:59:59.999`);
    if (jobDate > end) return false;
  }

  return true;
}

export function filterJobs(jobs, filters) {
  return jobs.filter((job) => {
    const status = job?.display_status || job?.status || "";
    if (filters.status && status !== filters.status) return false;
    if (!matchesSupervisor(job, filters.supervisorId)) return false;
    if (!matchesTechnician(job, filters.technicianId)) return false;
    if (!matchesDateRange(job, filters.startDate, filters.endDate)) return false;
    return true;
  });
}
