import { useEffect, useState } from "react";
import { apiFetch } from "../api";
import JobCard from "../components/JobCard";

export default function TechnicianDashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchMyJobs() {
    setLoading(true);
    try {
      const res = await apiFetch("/api/jobs?scope=all");

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

  return (
    <div className="tech-dashboard">

      {loading && <div>Loading jobs...</div>}

      {!loading && jobs.length === 0 && (
        <div className="empty-state">
          No work assigned right now.
        </div>
      )}

      {!loading && jobs.length > 0 && jobs.map((job) => (
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