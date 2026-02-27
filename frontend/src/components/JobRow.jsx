import "./JobRow.css";

const isCorporateJob = (code) => /^[A-Z]{2,}[\s-]\d+/.test(code);
const getInitials = (code) => code.split(/[\s-]/)[0];

export default function JobRow({
  job,
  isSelected,
  isExpanded,
  onToggleSelect,
  onToggleExpand,
}) {
  const companyLabel =
    job.companyname ||
    job.company_name ||
    job.company?.name ||
    job.company_code ||
    "";
  const requestedByName =
    job.requestedBy?.name ||
    job.requestedBy?.full_name ||
    job.contact_name ||
    "";
  const requestedById =
    job.requestedBy?.id ||
    job.contact_id ||
    "";
  const requestedByIdText =
    requestedById && /^\d+$/.test(String(requestedById))
      ? ` #${requestedById}`
      : "";
  const title = companyLabel
    ? companyLabel
    : requestedByName || requestedById
      ? `Requested by: ${requestedByName || "Contact"}${requestedByIdText}`
      : "—";
  const service = job.title;
  const displayStatus = job.display_status || job.status || "";

  function formatDueDate(date) {
    if (!date) return "Unscheduled";

    const d = new Date(date);

    // catches Invalid Date and epoch
    if (isNaN(d.getTime()) || d.getFullYear() === 1970) {
      return "Unscheduled";
    }

    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  }

  const scheduleDate = job.dueDate || job.start_date;

  return (
  <div
    className={`job-row ${isExpanded ? "expanded" : ""}`}
    onClick={onToggleExpand}
  >

    {/* 1 — Checkbox */}
    <input
      type="checkbox"
      checked={isSelected}
      onChange={onToggleSelect}
      className="job-checkbox"
      onClick={(e) => e.stopPropagation()}
    />

    {/* 2 — Identity (company + code) */}
    <div className="job-identity">
      <div className="job-companyname">
        {title}
      </div>

      <div className="job-identity-text">
        <div className="job-code">{job.site}</div>
        <div className="job-customer-type">
          {isCorporateJob(job.code)
            ? "Corporate Work Order"
            : "Individual Customer"}
        </div>
      </div>
    </div>

    {/* 3 — Service */}
    <div className="job-title">
      {service}   
    </div>

    {/* 4 — Supervisor */}
    <div className="job-supervisor-block">
      <div className="job-supervisor-label">Supervisor</div>
      <div className="job-supervisor-name">
        {job.supervisor ? job.supervisor.name : "Unassigned"}
      </div>
    </div>

    {/* 5 — Status + Due (RIGHT PANEL) */}
    <div className="job-right">
      <div className={`job-status ${displayStatus}`}>
        {displayStatus.replace("_", " ")}
      </div>

      <div className="job-due">
        {formatDueDate(scheduleDate)}
      </div>
    </div>

  </div>
);
}
