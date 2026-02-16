import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import JobHeader from "../components/JobHeader";
import JobUpdateComposer from "../components/JobUpdateComposer";
import JobTimeline from "../components/JobTimeline";
import "./jobpage.css";
import AssignWorkOrderModal from "../components/AssignWorkOrderModal";
import { apiFetch } from "../api";






export default function JobPage() {
  const { jobId } = useParams();
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [job, setJob] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [dateForm, setDateForm] = useState({ start_date: "", end_date: "" });
  const [savingDates, setSavingDates] = useState(false);
  const role = localStorage.getItem("role");
  const canAssign = role !== "technician";


  // ✅ Fetch job history (reusable)
  const reloadHistory = async () => {
    try {
      setLoadingHistory(true);
      const res = await apiFetch(`/api/jobs/${jobId}/history`);
      const data = await res.json();
      setHistory(data);
    } catch (err) {
      console.error("Failed to reload history", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  // ✅ Initial load
  useEffect(() => {
    async function load() {
      try {
        const jobRes = await apiFetch(`/api/jobs/${jobId}`);

        if (!jobRes.ok) {
          throw new Error("Job fetch failed");
        }

        const jobData = await jobRes.json();
        setJob(jobData);
        setDateForm({
          start_date: jobData.start_date
            ? new Date(jobData.start_date).toISOString().slice(0, 10)
            : "",
          end_date: jobData.dueDate
            ? new Date(jobData.dueDate).toISOString().slice(0, 10)
            : "",
        });

        await reloadHistory();
      } catch (err) {
        console.error("Failed to load job", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [jobId]);

  if (loading) return <div>Loading…</div>;
  if (!job) return <div>Job not found</div>;
  const jobstatus = job.status;
  const approvalStatus = job.approval_status;
  const awaitingApproval = approvalStatus === "PENDING" && ["IN_PROGRESS", "PAUSED"].includes(jobstatus);
  async function updateStatus(newStatus) {
    try {
      const token = localStorage.getItem("token");

      const res = await apiFetch(`/api/jobs/${jobId}/status`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Status update failed");

      const jobRes = await apiFetch(`/api/jobs/${jobId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setJob(await jobRes.json());
      await reloadHistory();
    } catch (err) {
      console.error(err);
    }
  }

  async function submitForApproval() {
    try {
      const res = await apiFetch(`/api/jobs/${jobId}/submit-approval`, {
        method: "POST",
      });

      if (!res.ok) throw new Error("Submit for approval failed");

      const jobRes = await apiFetch(`/api/jobs/${jobId}`);
      setJob(await jobRes.json());
      await reloadHistory();
    } catch (err) {
      console.error(err);
    }
  }

  async function handleSaveDates() {
    if (dateForm.start_date && dateForm.end_date) {
      const start = new Date(dateForm.start_date);
      const end = new Date(dateForm.end_date);
      if (end < start) {
        console.error("End date cannot be before start date");
        return;
      }
    }
    try {
      setSavingDates(true);
      const res = await apiFetch(`/api/jobs/${jobId}/dates`, {
        method: "PATCH",
        body: JSON.stringify({
          start_date: dateForm.start_date || null,
          end_date: dateForm.end_date || null,
        }),
      });

      if (!res.ok) throw new Error("Date update failed");

      const jobRes = await apiFetch(`/api/jobs/${jobId}`);
      setJob(await jobRes.json());
    } catch (err) {
      console.error("Failed to update dates", err);
    } finally {
      setSavingDates(false);
    }
  }

  async function handleAssignSingle({ supervisorId, technicianIds }) {
    try {
      const res = await apiFetch(`/api/jobs/assign`, {
        method: "POST",
        body: JSON.stringify({
          jobIds: [job.id],
          supervisorId,
          technicianIds,
        }),
      });

      if (!res.ok) throw new Error("Assign failed");

      // refresh job + timeline
      const jobRes = await apiFetch(`/api/jobs/${job.id}`);
      setJob(await jobRes.json());

      await reloadHistory();
      setIsAssignOpen(false);
    } catch (err) {
      console.error("Assignment failed", err);
    }



  }

  return (
    <div className="job-page">
      <div className="job-page-layout">


        {/* LEFT COLUMN */}
        <div className="job-left">
          <JobHeader job={job} setIsAssignOpen={canAssign ? setIsAssignOpen : null} />
          <div className="job-schedule-card">
            <div className="job-schedule-title">Schedule</div>
            <div className="job-schedule-grid">
              <label className="job-schedule-field">
                <span>Start date</span>
                <input
                  type="date"
                  value={dateForm.start_date}
                  onChange={(e) =>
                    setDateForm((prev) => ({ ...prev, start_date: e.target.value }))
                  }
                  max={dateForm.end_date || undefined}
                />
              </label>
              <label className="job-schedule-field">
                <span>End date</span>
                <input
                  type="date"
                  value={dateForm.end_date}
                  onChange={(e) =>
                    setDateForm((prev) => ({ ...prev, end_date: e.target.value }))
                  }
                  min={dateForm.start_date || undefined}
                />
              </label>
            </div>
            <button
              className="job-schedule-save"
              onClick={handleSaveDates}
              disabled={savingDates}
            >
              {savingDates ? "Saving..." : "Save Dates"}
            </button>
          </div>
                  

<div className="job-actions">

  {jobstatus === "CREATED" && (
    <div className="job-actions-info">
      Waiting for assignment
    </div>
  )}

  {jobstatus === "NOT_STARTED" && (
    <button
      className="job-btn job-btn-start"
      onClick={() => updateStatus("IN_PROGRESS")}
    >
      Start Job
    </button>
  )}

  {jobstatus === "IN_PROGRESS" && !awaitingApproval && (
    <div className="job-actions-row">
      <button
        className="job-btn job-btn-pause"
        onClick={() => updateStatus("PAUSED")}
      >
        Pause
      </button>

      {role === "technician" ? (
        <button
          className="job-btn job-btn-complete"
          onClick={submitForApproval}
        >
          Submit for Approval
        </button>
      ) : (
        <div className="job-actions-info">
          Waiting for technician submission
        </div>
      )}
    </div>
  )}

  {jobstatus === "PAUSED" && !awaitingApproval && (
    <div className="job-actions-row">
      <button
        className="job-btn job-btn-resume"
        onClick={() => updateStatus("IN_PROGRESS")}
      >
        Resume
      </button>
      {role === "technician" && (
        <button
          className="job-btn job-btn-complete"
          onClick={submitForApproval}
        >
          Submit for Approval
        </button>
      )}
    </div>
  )}

  {awaitingApproval && (
    role === "technician" ? (
      <div className="job-actions-info">
        Awaiting supervisor approval
      </div>
    ) : (
      <button
        className="job-btn job-btn-complete"
        onClick={() => updateStatus("COMPLETED")}
      >
        Approve & Complete
      </button>
    )
  )}

  {jobstatus === "COMPLETED" && (
    <div className="job-actions-success">
      Completed
    </div>
  )}

  {jobstatus === "CANCELED" && (
    <div className="job-actions-cancel">
      Canceled
    </div>
  )}

</div>


          {/* Add comments and files  */}
          <JobUpdateComposer
            onSubmit={async ({ message, files }) => {
              try {
                // 1. Create comment
                const commentRes = await apiFetch(
                  `/api/jobs/${jobId}/comments`,
                  {
                    method: "POST",
                    body: JSON.stringify({
                      message,
                      created_by_user_id: 101, // TEMP
                    }),
                  }
                );

                const commentData = await commentRes.json();
                const history_id = commentData.history_id;

                // 2. Upload real files (MinIO + DB)
                for (const file of files) {
                  const formData = new FormData();
                  formData.append("file", file);
                  formData.append("history_id", history_id);
                  formData.append(
                    "type",
                    file.type.startsWith("image") ? "IMAGE" : "FILE"
                  );

                  await apiFetch(`/api/jobs/${jobId}/attachments/upload`, {
                    method: "POST",
                    body: formData, // no headers
                  });
                }

                await reloadHistory();
              } catch (err) {
                console.error("Failed to submit update", err);
              }
            }}
          />


          <JobTimeline history={history} />
        </div>

        {/* RIGHT COLUMN */}
        <div className="job-right">
          <h4>Files & Documents</h4>
          <p>No files yet</p>
        </div>
        {canAssign && (
          <AssignWorkOrderModal
            isOpen={isAssignOpen}
            jobCount={1}
            onClose={() => setIsAssignOpen(false)}
            onAssign={handleAssignSingle}
          />
        )}



      </div>
    </div>
  );

}




