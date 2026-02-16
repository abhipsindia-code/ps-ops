import { STATUS_OPTIONS } from "../utils/jobFilters";

export default function JobFilters({
  filters,
  setFilters,
  supervisorOptions = [],
  technicianOptions = [],
  showSupervisor = false,
  showTechnician = false,
  onReset,
}) {
  function update(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="job-filters">
      <div className="job-filter-field">
        <label>Status</label>
        <select
          value={filters.status}
          onChange={(e) => update("status", e.target.value)}
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value || "all"} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="job-filter-field">
        <label>Start Date</label>
        <input
          type="date"
          value={filters.startDate}
          onChange={(e) => update("startDate", e.target.value)}
        />
      </div>

      <div className="job-filter-field">
        <label>End Date</label>
        <input
          type="date"
          value={filters.endDate}
          onChange={(e) => update("endDate", e.target.value)}
        />
      </div>

      {showSupervisor && (
        <div className="job-filter-field">
          <label>Supervisor</label>
          <select
            value={filters.supervisorId}
            onChange={(e) => update("supervisorId", e.target.value)}
          >
            <option value="">All supervisors</option>
            {supervisorOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {showTechnician && (
        <div className="job-filter-field">
          <label>Technician</label>
          <select
            value={filters.technicianId}
            onChange={(e) => update("technicianId", e.target.value)}
          >
            <option value="">All technicians</option>
            {technicianOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="job-filter-actions">
        <button
          type="button"
          onClick={onReset}
          className="job-filter-reset"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
