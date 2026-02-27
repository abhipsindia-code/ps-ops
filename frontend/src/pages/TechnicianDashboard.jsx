import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../api";
import JobCard from "../components/JobCard";

export default function TechnicianDashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [statusFilter, setStatusFilter] = useState("");

  async function fetchMyJobs() {
    setLoading(true);
    try {
      const res = await apiFetch("/api/jobs?scope=all");

      // backend should return jobs assigned to logged-in technician
      if (!res.ok) throw new Error("Failed to fetch jobs");
      const data = await res.json();
      setJobs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMyJobs();
  }, []);

  async function updateStatus(jobId, status) {
    const res = await apiFetch(`/api/jobs/${jobId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });

    if (!res.ok) {
      console.error("Status update failed");
      return;
    }

    fetchMyJobs();
  }

  async function submitForApproval(jobId) {
    const res = await apiFetch(`/api/jobs/${jobId}/submit-approval`, {
      method: "POST",
    });

    if (!res.ok) {
      console.error("Submit for approval failed");
      return;
    }

    fetchMyJobs();
  }

  const statusOptions = [
    { value: "", label: "All statuses" },
    { value: "NOT_STARTED", label: "Not Started" },
    { value: "IN_PROGRESS", label: "In Progress" },
    { value: "AWAITING_APPROVAL", label: "Waiting for approval" },
  ];

  const isTodayJob = (job) => {
    const dateValue = job?.start_date || job?.startDate || job?.dueDate || job?.due_date;
    if (!dateValue) return false;
    const jobDate = new Date(dateValue);
    if (Number.isNaN(jobDate.getTime())) return false;
    const now = new Date();
    return (
      jobDate.getFullYear() === now.getFullYear()
      && jobDate.getMonth() === now.getMonth()
      && jobDate.getDate() === now.getDate()
    );
  };

  const getDisplayStatus = (job) => job?.display_status || job?.status || "";

  const todayJobs = useMemo(() => {
    return jobs.filter((job) => {
      const status = getDisplayStatus(job);
      if (status === "PENDING") return true;
      return isTodayJob(job);
    });
  }, [jobs]);

  const allJobs = useMemo(() => {
    if (!statusFilter) return jobs;
    return jobs.filter((job) => getDisplayStatus(job) === statusFilter);
  }, [jobs, statusFilter]);

  return (
    <div className="tech-dashboard">

      <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
        <button
          type="button"
          onClick={() => setActiveTab("today")}
          style={tabButtonStyle(activeTab === "today")}
        >
          Today's Jobs
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("all")}
          style={tabButtonStyle(activeTab === "all")}
        >
          All Jobs
        </button>
      </div>

      {activeTab === "all" && (
        <div style={{ marginBottom: "12px" }}>
          <label style={filterLabelStyle}>Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={filterSelectStyle}
          >
            {statusOptions.map((opt) => (
              <option key={opt.value || "all"} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {loading && <div>Loading jobs...</div>}

      {!loading && jobs.length === 0 && (
        <div className="empty-state">
          No assigned jobs.
        </div>
      )}

      {!loading && jobs.length > 0 && activeTab === "today" && todayJobs.length === 0 && (
        <div className="empty-state">
          No jobs scheduled for today.
        </div>
      )}

      {!loading && jobs.length > 0 && activeTab === "all" && allJobs.length === 0 && (
        <div className="empty-state">
          No jobs match the current status filter.
        </div>
      )}

      {activeTab === "today" && todayJobs.map((job) => (
        <JobCard
          key={job.id}
          job={job}
          updateStatus={updateStatus}
          onSubmitApproval={submitForApproval}
          basePath="/technician"
        />
      ))}

      {activeTab === "all" && allJobs.map((job) => (
        <JobCard
          key={job.id}
          job={job}
          updateStatus={updateStatus}
          onSubmitApproval={submitForApproval}
          basePath="/technician"
        />
      ))}

    </div>
  );
}

const tabButtonStyle = (active) => ({
  padding: "8px 12px",
  borderRadius: "999px",
  border: active ? "1px solid #2563eb" : "1px solid #d1d5db",
  background: active ? "#eff6ff" : "#ffffff",
  color: "#111827",
  fontWeight: 600,
  cursor: "pointer",
});

const filterLabelStyle = {
  display: "block",
  marginBottom: "6px",
  fontSize: "12px",
  color: "#6b7280",
  fontWeight: 600,
};

const filterSelectStyle = {
  width: "100%",
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
  fontSize: "14px",
};
