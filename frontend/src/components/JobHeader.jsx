import "./jobrow.css";
import { useState } from "react";
import RequesterPopover from "./RequesterPopover";

export default function JobHeader({ job, setIsAssignOpen }) {

  const [showRequester, setShowRequester] = useState(false);
  if (!job) return null;
  const role = localStorage.getItem("role");
  const canAssign = role !== "technician";
  const canShowRequester = role !== "technician";

  const {
    title,
    code,
    status,
    requestedBy,
    supervisor,
    team = []
  } = job;

  const jobTitle =
    title ||
    job.name ||
    job.serviceType ||
    job.service_type ||
    (Array.isArray(job.subServices) && job.subServices.length
      ? job.subServices.join(", ")
      : "") ||
    "Service Job";
  const displayStatus = job.display_status || status || "";

  return (
    <div className="job-header">

      {/* LEFT */}
      <div className="job-header-left">
        <h1 className="job-title">{jobTitle}</h1>

        <div className="job-meta">
          <span className="job-code">{code}</span>
        </div>

        {canShowRequester && (
          <div className="job-people">
            <div style={{ position: "relative" }}>

              <div className="requester-wrap">
                <strong>Requested By :</strong>{" "}

                {!showRequester && requestedBy && (
                  <button
                    className="link-button"
                    onClick={() => setShowRequester(true)}
                  >
                    {requestedBy.name}
                  </button>
                )}

                {showRequester && requestedBy && (
                  <RequesterPopover
                    contact={requestedBy}
                    onClose={() => setShowRequester(false)}
                  />
                )}

              </div>
            </div>
          </div>
        )}
      </div>


      {/* RIGHT */}
      <div className="job-header-right">

        <div className="team-details">
          <strong>Supervisor:</strong>{" "}
          {canAssign && setIsAssignOpen ? (
            <button
              style={{ color: "#2563eb", cursor: "pointer" }}
              onClick={() => setIsAssignOpen(true)}
            >
              {supervisor?.name ?? "Unassigned"}
            </button>
          ) : (
            <span>{supervisor?.name ?? "Unassigned"}</span>
          )}
        </div>

        {/* TEAM */}
        {Array.isArray(team) && team.length > 0 && (
          <div className="team-line">
            <strong>Team:</strong>{" "}
            {team.map(member => member.name).join(", ")}
          </div>
        )}

        <button className={`job-status ${displayStatus.toLowerCase()}`}>
          {displayStatus}
        </button>

      </div>
    </div>
  );
}
