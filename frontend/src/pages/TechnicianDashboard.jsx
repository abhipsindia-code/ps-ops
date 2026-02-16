import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../api";
import JobCard from "../components/JobCard";
import JobFilters from "../components/JobFilters";
import { filterJobs } from "../utils/jobFilters";

export default function TechnicianDashboard() {
  const [jobs, setJobs] = useState([]);
  const [expandedJobId, setExpandedJobId] = useState(null);
  const [loading, setLoading] = useState(true);
  const defaultFilters = {
    status: "",
    startDate: "",
    endDate: "",
    supervisorId: "",
    technicianId: "",
  };
  const [filters, setFilters] = useState(defaultFilters);

  async function fetchMyJobs() {
    setLoading(true);
    try {
      const res = await apiFetch("/api/jobs");

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

  function toggleExpand(jobId) {
    setExpandedJobId(prev => (prev === jobId ? null : jobId));
  }

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

  const filteredJobs = useMemo(() => filterJobs(jobs, filters), [jobs, filters]);

  return (
    <div className="tech-dashboard">

      <JobFilters
        filters={filters}
        setFilters={setFilters}
        onReset={() => setFilters(defaultFilters)}
      />

      {loading && <div>Loading jobs...</div>}

      {!loading && jobs.length === 0 && (
        <div className="empty-state">
          No assigned jobs.
        </div>
      )}

      {!loading && jobs.length > 0 && filteredJobs.length === 0 && (
        <div className="empty-state">
          No jobs match the current filters.
        </div>
      )}

{filteredJobs.map((job) => (
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
