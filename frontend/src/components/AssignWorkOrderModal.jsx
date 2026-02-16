import { useState, useEffect } from "react";
import { apiFetch } from "../api";

export default function AssignWorkOrderModal({
  isOpen,
  jobCount,
  onClose,
  onAssign,
}) {
  if (!isOpen) return null;

  // Selection state (IDs only)
  const [selectedSupervisorId, setSelectedSupervisorId] = useState("");
  const [selectedTechnicianIds, setSelectedTechnicianIds] = useState([]);

  // Loaded users
  const [supervisors, setSupervisors] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Fetch supervisors & technicians when modal opens
  useEffect(() => {
    if (!isOpen) return;

    setLoadingUsers(true);

    Promise.all([
      apiFetch(`/api/users?role=supervisor`).then((r) => r.json()),
      apiFetch(`/api/users?role=technician`).then((r) => r.json()),
    ])
      .then(([supervisorData, technicianData]) => {
        setSupervisors(supervisorData);
        setTechnicians(technicianData);
      })
      .catch((err) => {
        console.error("Failed to load users", err);
      })
      .finally(() => {
        setLoadingUsers(false);
      });
  }, [isOpen]);

  function toggleTechnician(id) {
    setSelectedTechnicianIds((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  }

  function handleAssign() {
    if (!selectedSupervisorId) {
      alert("Supervisor is required");
      return;
    }

    onAssign({
      supervisorId: Number(selectedSupervisorId),
      technicianIds: selectedTechnicianIds,
    });
  }
  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h2 style={{ marginBottom: "8px" }}>
          Assign Work Order ({jobCount} jobs)
        </h2>

        {/* Supervisor select */}
        <label style={labelStyle}>Supervisor</label>
        <select
          value={selectedSupervisorId}
          onChange={(e) => setSelectedSupervisorId(e.target.value)}
          disabled={loadingUsers}
          style={inputStyle}
        >
          <option value="">Select supervisor</option>
          {supervisors.map((sup) => (
            <option key={sup.id} value={sup.id}>
              {sup.name}
            </option>
          ))}
        </select>

        {/* Technicians */}
        <label style={labelStyle}>Technicians</label>
        <div style={{ maxHeight: "160px", overflowY: "auto" }}>
          {technicians.map((tech) => (
            <label key={tech.id} style={checkboxRow}>
              <input
                type="checkbox"
                checked={selectedTechnicianIds.includes(tech.id)}
                onChange={() => toggleTechnician(tech.id)}
              />
              <span style={{ marginLeft: "8px" }}>{tech.name}</span>
            </label>
          ))}
        </div>

        {/* Actions */}
        <div style={actionsStyle}>
          <button onClick={onClose} style={secondaryBtn}>
            Cancel
          </button>
          <button onClick={handleAssign} style={primaryBtn}>
            Assign
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- styles ---------- */

const overlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1200,
};

const modalStyle = {
  background: "#fff",
  padding: "24px",
  borderRadius: "12px",
  width: "420px",
};

const labelStyle = {
  display: "block",
  marginTop: "16px",
  marginBottom: "6px",
  fontWeight: 600,
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
  fontSize: "14px",
};

const checkboxRow = {
  display: "flex",
  alignItems: "center",
  marginBottom: "6px",
};

const actionsStyle = {
  display: "flex",
  justifyContent: "flex-end",
  gap: "12px",
  marginTop: "24px",
};

const primaryBtn = {
  padding: "10px 16px",
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};

const secondaryBtn = {
  padding: "10px 16px",
  background: "#e5e7eb",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};

