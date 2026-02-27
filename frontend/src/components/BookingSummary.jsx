import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../api";
import "./BookingSummary.css";
import { useNavigate } from "react-router-dom";



export default function BookingSummary() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {

    async function loadSummary() {
      try {
        setLoading(true);
        const res = await apiFetch("/api/bookings?include_unbooked=1");
        const list = await res.json();
        setBookings(Array.isArray(list) ? list : []);
      } catch (err) {
        console.error("Summary load failed", err);
      } finally {
        setLoading(false);
      }
    }

    loadSummary();

  }, []);

  const statusOptions = [
    { value: "", label: "All statuses" },
    { value: "CREATED", label: "Created" },
    { value: "NOT_STARTED", label: "Not Started" },
    { value: "PENDING", label: "Pending" },
    { value: "IN_PROGRESS", label: "In Progress" },
    { value: "PAUSED", label: "Paused" },
    { value: "COMPLETED", label: "Completed" },
    { value: "CANCELED", label: "Canceled" },
  ];

  const hasFilters = Boolean(filters.status || filters.startDate || filters.endDate);

  const filteredBookings = useMemo(() => {
    if (!hasFilters) return bookings;
    const start = filters.startDate ? new Date(`${filters.startDate}T00:00:00`) : null;
    const end = filters.endDate ? new Date(`${filters.endDate}T23:59:59.999`) : null;

    const matchesJob = (job) => {
      if (filters.status && job.status !== filters.status) return false;
      if (!start && !end) return true;
      if (!job.start_date) return false;
      const jobDate = new Date(job.start_date);
      if (Number.isNaN(jobDate.getTime())) return false;
      if (start && jobDate < start) return false;
      if (end && jobDate > end) return false;
      return true;
    };

    return bookings.reduce((acc, booking) => {
      const jobs = Array.isArray(booking.jobs) ? booking.jobs : [];
      const filteredJobs = jobs.filter(matchesJob);
      if (filteredJobs.length === 0) return acc;
      acc.push({ ...booking, jobs: filteredJobs });
      return acc;
    }, []);
  }, [bookings, filters, hasFilters]);

  const summaryData = useMemo(() => {
    const list = filteredBookings;
    const today = new Date();
    const todayCount = list
      .flatMap(b => b.jobs || [])
      .filter((job) => {
        if (!job.start_date) return false;
        const jobDate = new Date(job.start_date);
        return (
          jobDate.getFullYear() === today.getFullYear()
          && jobDate.getMonth() === today.getMonth()
          && jobDate.getDate() === today.getDate()
        );
      }).length;

    let residentialJobs = 0;
    let commercialJobs = 0;
    for (const booking of list) {
      const isCommercial = Boolean(booking.company_name || booking.company_code);
      const jobs = booking.jobs || [];
      if (isCommercial) {
        commercialJobs += jobs.length;
      } else {
        residentialJobs += jobs.length;
      }
    }

    return {
      today: todayCount,
      residential: residentialJobs,
      commercial: commercialJobs,
      total: list.length,
    };
  }, [filteredBookings]);

  if (loading) return <div className="card">Loading...</div>;

  return (
    <div className="booking-card">
      <div className="booking-header">
        <h3>Booking Summary</h3>

      </div>

      <div className="booking-filters">
        <div className="booking-filter-field">
          <label>Status</label>
          <select
            value={filters.status}
            onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
          >
            {statusOptions.map((opt) => (
              <option key={opt.value || "all"} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div className="booking-filter-field">
          <label>Start Date</label>
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => setFilters((prev) => ({ ...prev, startDate: e.target.value }))}
          />
        </div>
        <div className="booking-filter-field">
          <label>End Date</label>
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => setFilters((prev) => ({ ...prev, endDate: e.target.value }))}
          />
        </div>
        <button
          type="button"
          className="booking-filter-reset"
          onClick={() => setFilters({ status: "", startDate: "", endDate: "" })}
        >
          Reset
        </button>
      </div>

      <div className="booking-section">
        <div className="section-title">Details</div>
        <div className="summary-row">
          <span> Today's Bookings</span>
          <span className="value">{summaryData.today}</span>
        </div>
        <div className="summary-row">

          <span>Residential Jobs</span>
          <span className="value">{summaryData.residential}</span>
        </div>

        <div className="summary-row">
          <span>Commercial Jobs</span>
          <span className="value">{summaryData.commercial}</span>
        </div>
      </div>



      <div className="summary-row">
        <span>Total Bookings</span>
        <span className="value">{summaryData.total}</span>
      </div>

      <div className="divider" />
      {role !== "technician" && (
        <button
          className="primary booking-view-btn"
          onClick={() => navigate(`/${role}/bookings`)}
        >
          View All Bookings
        </button>
      )}



    </div>
  );

}
