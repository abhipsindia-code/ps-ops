import { useState } from "react";
import { API_BASE } from "../api";
import "./contacts.css";

export default function CreateContactModal({ onClose, onCreated, companies = [] }) {

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [role, setRole] = useState("");
  const [isPrimary, setIsPrimary] = useState(false);
  const [contactType, setContactType] = useState("individual");

  const handleCreate = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_BASE}/api/contacts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        name,
        phone,
        email,
        company_id: contactType === "company" ? companyId : null,
        role,
        is_primary: isPrimary
      })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Failed to create contact");
      return;
    }

    onCreated?.(data.contact || null);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h4>Create Contact</h4>

<div className="contact-grid">
  <input
    placeholder="Full Name *"
    value={name}
    onChange={(e) => setName(e.target.value)}
  />

  <input
    placeholder="Phone *"
    value={phone}
    onChange={(e) => setPhone(e.target.value)}
  />

  <input
    placeholder="Email (optional)"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
  />

  <select
    value={contactType}
    onChange={(e) => setContactType(e.target.value)}
  >
    <option value="individual">Individual Customer</option>
    <option value="company">Company Contact</option>
  </select>

  {contactType === "company" && (
    <select
      value={companyId}
      onChange={(e) => setCompanyId(e.target.value)}
    >
      <option value="">Select Company</option>
      {companies.map(c => (
        <option key={c.id} value={c.id}>
          {c.name ? `${c.name}${c.Name ? ` (${c.name})` : ""}` : c.code}
        </option>
      ))}
    </select>
  )}

  <input
    placeholder="Role (e.g. Facility Manager)"
    value={role}
    onChange={(e) => setRole(e.target.value)}
  />

  <label className="checkbox-row">
    <input
      type="checkbox"
      checked={isPrimary}
      onChange={(e) => setIsPrimary(e.target.checked)}
    />
    Primary Contact
  </label>
</div>

          <div className="contact-actions">
            <button className="secondary" onClick={onClose}>
              Cancel
            </button>
            <button className="primary" onClick={handleCreate}>
              Create Contact
            </button>
          </div>
        </div>
      </div>
    
  );
}
