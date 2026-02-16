import { useNavigate } from "react-router-dom";

export default function JobCard({
  job,
  updateStatus,
  onSubmitApproval,
  basePath = "/technician"
}) {
  const navigate = useNavigate();

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
  const awaitingApproval =
    job.approval_status === "PENDING" &&
    ["IN_PROGRESS", "PAUSED"].includes(job.status);

  function openJob() {
    navigate(`${basePath}/jobs/${job.id}`);
  }

  return (
    <div className="job-card">

      {/* top section */}
      <div className="job-card-header" onClick={openJob}>
        <div className="job-card-title">
          {title}
        </div>

        <div className={`job-card-status status-${displayStatus}`}>
          {displayStatus.replace("_", " ")}
        </div>
      </div>

      <div className="job-card-body" onClick={openJob}>
        <div className="job-card-address">
          {job.address || "No address"}
        </div>
      </div>

      {/* actions */}
      <div className="job-card-actions">

        {awaitingApproval && (
          <button className="btn-complete" disabled>
            Awaiting Approval
          </button>
        )}

        {!awaitingApproval && job.status === "NOT_STARTED" && (
          <button className="btn-start" onClick={() => updateStatus(job.id, "IN_PROGRESS")}>
            Start
          </button>
        )}

        {!awaitingApproval && job.status === "IN_PROGRESS" && (
          <>
            <button className="btn-pause" onClick={() => updateStatus(job.id, "PAUSED")}>
              Pause
            </button>

            {onSubmitApproval ? (
              <button className="btn-complete" onClick={() => onSubmitApproval(job.id)}>
                Submit for Approval
              </button>
            ) : (
              <button className="btn-complete" onClick={() => updateStatus(job.id, "COMPLETED")}>
                Complete
              </button>
            )}
          </>
        )}

        {!awaitingApproval && job.status === "PAUSED" && (
          <>
            <button className="btn-start" onClick={() => updateStatus(job.id, "IN_PROGRESS")}>
              Resume
            </button>
            {onSubmitApproval && (
              <button className="btn-complete" onClick={() => onSubmitApproval(job.id)}>
                Submit for Approval
              </button>
            )}
          </>
        )}

      </div>
    </div>
  );
}
