import { useEffect, useState } from "react";
import { apiFetch } from "../api";

export default function TeamView() {

  const [supervisors, setSupervisors] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [selectedSupervisor, setSelectedSupervisor] = useState(null);
  const [selectedTechs, setSelectedTechs] = useState([]);

  // load supervisors + technicians
  useEffect(() => {
    async function loadUsers() {
      const sRes = await apiFetch("/users?role=supervisor");
      const sData = await sRes.json();
      setSupervisors(sData);

      const tRes = await apiFetch("/users?role=technician");
      const tData = await tRes.json();
      setTechnicians(tData);
    }

    loadUsers();
  }, []);

  // load selected supervisor team
  useEffect(() => {
    if (!selectedSupervisor) return;

    async function loadTeam() {
      const res = await apiFetch(`/teams/${selectedSupervisor.id}`);
      const team = await res.json();
      setSelectedTechs(team.map(t => t.id));
    }

    loadTeam();
  }, [selectedSupervisor]);

  const toggleTech = (id) => {
    setSelectedTechs(prev =>
      prev.includes(id)
        ? prev.filter(t => t !== id)
        : [...prev, id]
    );
  };

  const saveTeam = async () => {
    await apiFetch("/teams", {
      method: "POST",
      body: JSON.stringify({
        supervisorId: selectedSupervisor.id,
        technicianIds: selectedTechs
      })
    });

    alert("Team saved");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Team Management</h2>

      <h3>Supervisors</h3>
      {supervisors.map(s => (
        <div key={s.id}>
          <button onClick={() => setSelectedSupervisor(s)}>
            {s.name}
          </button>
        </div>
      ))}

      {selectedSupervisor && (
        <>
          <h3>Technicians under {selectedSupervisor.name}</h3>

          {technicians.map(t => (
            <label key={t.id} style={{ display: "block" }}>
              <input
                type="checkbox"
                checked={selectedTechs.includes(t.id)}
                onChange={() => toggleTech(t.id)}
              />
              {t.name}
            </label>
          ))}

          <button onClick={saveTeam}>Save Team</button>
        </>
      )}
    </div>
  );
}
