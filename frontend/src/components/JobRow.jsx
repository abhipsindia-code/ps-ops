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
  const title =
    job.title ||
    job.name ||
    job.serviceType ||
    job.service_type ||
    (Array.isArray(job.subServices) && job.subServices.length
      ? job.subServices.join(", ")
      : "") ||
    "Service Job";
  const displayStatus = job.display_status || job.status || "";

  return (
    <div className={`job-row ${isExpanded ? "expanded" : ""}`}>
      
      {/* Checkbox (NOT clickable) */}
      <input
        type="checkbox"
        checked={isSelected}
        onChange={onToggleSelect}
        className="job-checkbox"
        onClick={(e) => e.stopPropagation()}
      />

      {/* CLICKABLE AREA (this is key) */}
      <div className="job-main" onClick={onToggleExpand}>
        
        {/* Identity */}
        <div className="job-identity">
          <div
            className={`job-badge ${
              isCorporateJob(job.code) ? "corp" : "ind"
            }`}
          >
            {isCorporateJob(job.code) ? getInitials(job.code) : "#"}
          </div>

          <div className="job-identity-text">
            <div className="job-code">{job.code}</div>
            <div className="job-customer-type">
              {isCorporateJob(job.code)
                ? "Corporate Work Order"
                : "Individual Customer"}
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="job-title">{title}</div>
      </div>

      {/* Name + Status (NOT clickable) */}
      <div className="job-assignee-status">
        <div className="job-people">
          {job.supervisor ? job.supervisor.name : "Unassigned"}
        </div>
        <div className={`job-status ${displayStatus}`}>
          {displayStatus.replace("_", " ")}
        </div>
      </div>

      {/* Due */}
      <div className="job-due">
   {new Date(job.dueDate).toLocaleDateString()}
</div>
    </div>
  );
}
