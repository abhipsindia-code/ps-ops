import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../api";
import "./AdminTeamManagement.css";

export default function AdminTeamManagement() {
  const [supervisors, setSupervisors] = useState([]);
  const [unassigned, setUnassigned] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingSupervisorId, setSavingSupervisorId] = useState(null);
  const [activeSupervisorId, setActiveSupervisorId] = useState(null);
  const [selectedTechs, setSelectedTechs] = useState([]);
  const [error, setError] = useState(null);

  const loadOverview = async () => {
    try {
      setLoading(true);
      const res = await apiFetch("/api/teams/overview");
      if (!res?.ok) throw new Error("Failed to load team overview");
      const data = await res.json();
      setSupervisors(Array.isArray(data.supervisors) ? data.supervisors : []);
      setUnassigned(Array.isArray(data.unassignedTechnicians) ? data.unassignedTechnicians : []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load team overview");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOverview();
  }, []);

  const technicianIndex = useMemo(() => {
    const map = new Map();
    supervisors.forEach((sup) => {
      (sup.technicians || []).forEach((tech) => {
        map.set(Number(tech.id), Number(sup.id));
      });
    });
    return map;
  }, [supervisors]);

  const allTechnicians = useMemo(() => {
    const fromSup = supervisors.flatMap(s => s.technicians || []);
    const map = new Map(fromSup.map(t => [Number(t.id), t]));
    unassigned.forEach(t => {
      if (!map.has(Number(t.id))) map.set(Number(t.id), t);
    });
    return Array.from(map.values());
  }, [supervisors, unassigned]);

  const activeSupervisor = supervisors.find(s => Number(s.id) === Number(activeSupervisorId));

  function openSupervisor(supervisorId) {
    setActiveSupervisorId(supervisorId);
    const sup = supervisors.find(s => Number(s.id) === Number(supervisorId));
    const selected = (sup?.technicians || []).map(t => Number(t.id));
    setSelectedTechs(selected);
  }

  function toggleTech(techId) {
    setSelectedTechs(prev => {
      if (prev.includes(techId)) {
        return prev.filter(id => id !== techId);
      }
      return [...prev, techId];
    });
  }

  async function saveTeam() {
    if (!activeSupervisor) return;
    try {
      setSavingSupervisorId(activeSupervisor.id);
      const res = await apiFetch("/api/teams", {
        method: "POST",
        body: JSON.stringify({
          supervisorId: activeSupervisor.id,
          technicianIds: selectedTechs
        }),
      });
      if (!res?.ok) throw new Error("Failed to save team");
      await loadOverview();
      setActiveSupervisorId(null);
      setSelectedTechs([]);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to save team");
    } finally {
      setSavingSupervisorId(null);
    }
  }

  if (loading) {
    return <div className="team-page">Loading team overview...</div>;
  }

  if (error) {
    return <div className="team-page">Error: {error}</div>;
  }

  return (
    <div className="team-page">
      <div className="team-page-header">
        <div>
          <h2>Team Management</h2>
          <p>Select a supervisor and add technicians under them.</p>
        </div>
      </div>

      <div className="team-supervisor-grid">
        {supervisors.map((supervisor) => (
          <div key={supervisor.id} className="team-card">
            <div className="team-card-header">
              <div>
                <div className="team-card-title">{supervisor.name || "Supervisor"}</div>
                <div className="team-card-subtitle">{supervisor.email || `ID ${supervisor.id}`}</div>
              </div>
              <div className="team-card-count">{supervisor.technicians?.length || 0}</div>
            </div>

            <div className="team-card-body">
              {(supervisor.technicians || []).length === 0 && (
                <div className="team-empty">No technicians assigned yet.</div>
              )}
              {(supervisor.technicians || []).map((tech) => (
                <div key={tech.id} className="team-tech-row compact">
                  <div className="team-tech-info">
                    <div className="team-tech-name">{tech.name || "Unnamed technician"}</div>
                    <div className="team-tech-email">{tech.email || `ID ${tech.id}`}</div>
                  </div>
                </div>
              ))}
            </div>

            <button
              className="team-manage-btn"
              onClick={() => openSupervisor(supervisor.id)}
            >
              Manage Technicians
            </button>
          </div>
        ))}
      </div>

      {activeSupervisor && (
        <div className="team-card team-edit-card">
          <div className="team-card-header">
            <div>
              <div className="team-card-title">
                Edit Team · {activeSupervisor.name || "Supervisor"}
              </div>
              <div className="team-card-subtitle">
                Select technicians to assign under this supervisor.
              </div>
            </div>
          </div>

          <div className="team-card-body">
            {allTechnicians.map((tech) => {
              const assignedSupervisorId = technicianIndex.get(Number(tech.id));
              const assignedSupervisor = supervisors.find(
                s => Number(s.id) === Number(assignedSupervisorId)
              );
              const isSelected = selectedTechs.includes(Number(tech.id));
              return (
                <label key={tech.id} className="team-tech-select">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleTech(Number(tech.id))}
                  />
                  <div>
                    <div className="team-tech-name">{tech.name || "Unnamed technician"}</div>
                    <div className="team-tech-email">{tech.email || `ID ${tech.id}`}</div>
                    {assignedSupervisor && assignedSupervisorId !== Number(activeSupervisor.id) && (
                      <div className="team-tech-assigned">
                        Currently under {assignedSupervisor.name || `Supervisor ${assignedSupervisor.id}`}
                      </div>
                    )}
                  </div>
                </label>
              );
            })}
          </div>

          <div className="team-edit-actions">
            <button
              className="team-cancel-btn"
              onClick={() => {
                setActiveSupervisorId(null);
                setSelectedTechs([]);
              }}
            >
              Cancel
            </button>
            <button
              className="team-save-btn"
              onClick={saveTeam}
              disabled={savingSupervisorId === activeSupervisor.id}
            >
              {savingSupervisorId === activeSupervisor.id ? "Saving..." : "Save Team"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
