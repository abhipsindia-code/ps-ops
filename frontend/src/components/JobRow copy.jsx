import "./JobRow.css";

const isCorporateJob = (code) => {
  return /^[A-Z]{2,}[\s-]\d+/.test(code);
};

const getInitials = (code) => {
  return code.split(/[\s-]/)[0];
};



export default function JobRow({
  job,
  isSelected,
  isExpanded,
  onToggleSelect,
  onToggleExpand
}) {
  return (
    <div className={`job-row ${isExpanded ? "expanded" : ""}`}>
      {/* Checkbox */}
      <input
        type="checkbox"
        checked={isSelected}
        onChange={onToggleSelect}
        className="job-checkbox"
      />

      {/* Clickable area */}
      <div className="job-main" onClick={onToggleExpand}>
        
        {/* LEFT COLUMN */}
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

        {/* RIGHT COLUMN */}
        <div className="job-details">
          <div className="job-title">{job.title}</div>

          <div className="job-people">
            {job.supervisor ? (
              <span className="job-supervisor">
                {job.supervisor.name}
              </span>
            ) : (
              <span className="job-unassigned">Unassigned</span>
            )}
          </div>
        </div>
      </div>

      {/* Status */}
      <div className={`job-status ${job.status}`}>
        {job.status.replace("_", " ")}
      </div>

      {/* Due */}
      <div className="job-due">
        Due {job.dueDate}
      </div>
    </div>
  );
}
