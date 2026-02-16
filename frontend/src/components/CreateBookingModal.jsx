import { useState, useEffect } from "react";
import { apiFetch } from "../api";
import CreateContactModal from "./CreateContactModal";


export default function CreateBookingModal({ isOpen, onClose, onCreate, }) {
  if (!isOpen) return null;
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [form, setForm] = useState({
    contactId: "",
    serviceType: "BOTH",
    subServices: [],
    start_date: "",
    end_date: "",
    notes: "",
    recurrenceEnabled: false,
    recurrenceType: "WEEKLY",
    recurrenceInterval: 1,
    recurrenceDaysOfWeek: [],
  });

  const [contacts, setContacts] = useState([]);
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    async function loadContacts() {
      try {
        const res = await apiFetch(`/api/contacts`);
        if (!res?.ok) throw new Error("Failed to load contacts");
        const data = await res.json();
        setContacts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load contacts", err);
      } finally {
        setLoadingContacts(false);
      }
    }

    async function loadCompanies() {
      try {
        const res = await apiFetch(`/api/companies`);
        if (!res?.ok) throw new Error("Failed to load companies");
        const data = await res.json();
        setCompanies(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load companies", err);
      }
    }

    loadContacts();
    loadCompanies();
  }, []);

  async function reloadContacts() {
    try {
      const res = await apiFetch(`/api/contacts`);
      if (!res?.ok) throw new Error("Failed to load contacts");
      const data = await res.json();
      setContacts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load contacts", err);
    }
  }




  const pestServices = [
    "Cockroach Control",
    "Bed Bug Control",
    "Termite Control",
    "Rodent Control",
    "Ant Control",
    "Mosquito Control",
  ];

  const deepCleaningServices = [
    "Kitchen Cleaning",
    "Bathroom Cleaning",
    "Sofa Cleaning",
    "Bathroom Cleaning",
    "Full Home Cleaning",
  ];

  const visibleSubServices =
    form.serviceType === "PEST"
      ? pestServices
      : form.serviceType === "DEEP"
        ? deepCleaningServices
        : [...pestServices, ...deepCleaningServices];

  function update(key, value) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  function toggleSubService(service) {
    setForm(prev => ({
      ...prev,
      subServices: prev.subServices.includes(service)
        ? prev.subServices.filter(s => s !== service)
        : [...prev.subServices, service],
    }));
  }

  function toggleRecurrenceDay(day) {
    setForm(prev => {
      const existing = new Set(prev.recurrenceDaysOfWeek || []);
      if (existing.has(day)) {
        existing.delete(day);
      } else {
        existing.add(day);
      }
      const nextDays = Array.from(existing).sort((a, b) => a - b);
      return { ...prev, recurrenceDaysOfWeek: nextDays };
    });
  }

  async function handleSubmit() {
    if (!form.contactId) {
      alert("Please select who is requesting this booking");
      return;
    }

    if (!form.subServices.length) {
      alert("Please select at least one service");
      return;
    }
    if (form.start_date && form.end_date) {
      const start = new Date(form.start_date);
      const end = new Date(form.end_date);
      if (end < start) {
        alert("End date cannot be before start date");
        return;
      }
    }

    let recurrence = null;
    if (recurrenceActive) {
      if (!form.start_date) {
        alert("Start date is required for recurring bookings");
        return;
      }

      let frequency = "WEEKLY";
      let intervalValue = 1;
      let daysOfWeek = [];

      switch (form.recurrenceType) {
        case "DAILY":
          frequency = "CUSTOM_DAYS";
          intervalValue = 1;
          break;
        case "WEEKLY":
          frequency = "WEEKLY";
          intervalValue = 1;
          daysOfWeek = form.recurrenceDaysOfWeek || [];
          break;
        case "CUSTOM_DAYS":
          frequency = "CUSTOM_DAYS";
          intervalValue = Number(form.recurrenceInterval) || 1;
          break;
        case "CUSTOM_WEEKS":
          frequency = "WEEKLY";
          intervalValue = Number(form.recurrenceInterval) || 1;
          daysOfWeek = form.recurrenceDaysOfWeek || [];
          break;
        case "CUSTOM_MONTHS":
          frequency = "MONTHLY";
          intervalValue = Number(form.recurrenceInterval) || 1;
          break;
        default:
          frequency = "WEEKLY";
          intervalValue = 1;
          daysOfWeek = form.recurrenceDaysOfWeek || [];
      }

      if ((form.recurrenceType === "WEEKLY" || form.recurrenceType === "CUSTOM_WEEKS") && daysOfWeek.length === 0) {
        const startDay = new Date(`${form.start_date}T00:00:00`).getDay();
        daysOfWeek = [startDay];
      }

      recurrence = {
        frequency,
        interval_value: intervalValue,
        days_of_week: daysOfWeek.length ? daysOfWeek : null,
      };
    }

    try {
      await onCreate({
        contact_id: form.contactId,
        serviceType: form.serviceType,
        subServices: form.subServices,
        start_date: form.start_date,
        end_date: form.end_date,
        notes: form.notes,
        recurrence,
      });
    } catch (err) {
      console.error("Create booking failed", err);
      alert("Failed to create booking");
    }
  }

  /* ---------- STYLES ---------- */

  const overlay = {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.45)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1200,
  };

  const modal = {
    width: "600px",
    maxWidth: "90vw",
    maxHeight: "90vh",
    background: "#ffffff",
    borderRadius: "12px",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
  };

  const body = {
    flex: 1,
    overflowY: "auto",
    padding: "24px",
  };

  const section = { marginBottom: "28px" };

  const input = {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    fontSize: "14px",
    width: "100%",
  };

  const pillRow = {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  };

  const pill = active => ({
    padding: "8px 14px",
    borderRadius: "999px",
    border: active ? "1px solid #2563eb" : "1px solid #d1d5db",
    background: active ? "#eff6ff" : "#ffffff",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 500,
  });

  const dayPill = active => ({
    ...pill(active),
    padding: "6px 10px",
    fontSize: "12px",
  });

  const subGrid = {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "10px",
    maxHeight: "160px",
    overflowY: "auto",
  };

  const subItem = active => ({
    padding: "10px",
    borderRadius: "8px",
    border: active ? "1px solid #2563eb" : "1px solid #d1d5db",
    background: active ? "#eff6ff" : "#ffffff",
    fontSize: "13px",
    cursor: "pointer",
    textAlign: "center",
  });

  const daysOfWeek = [
    { value: 0, label: "Sunday" },
    { value: 1, label: "Monday" },
    { value: 2, label: "Tuesday" },
    { value: 3, label: "Wednesday" },
    { value: 4, label: "Thursday" },
    { value: 5, label: "Friday" },
    { value: 6, label: "Saturday" },
  ];

  const recurrenceActive = form.recurrenceEnabled;
  const recurrenceUsesWeekdays = form.recurrenceType === "WEEKLY" || form.recurrenceType === "CUSTOM_WEEKS";
  const recurrenceNeedsInterval = form.recurrenceType === "CUSTOM_DAYS"
    || form.recurrenceType === "CUSTOM_WEEKS"
    || form.recurrenceType === "CUSTOM_MONTHS";

  /* ---------- RENDER ---------- */

  return (
    <div style={overlay}>
      <div style={modal}>
        {/* HEADER */}
        <div style={{ padding: "20px 24px", borderBottom: "1px solid #e5e7eb" }}>
          <h3>Create Booking</h3>
        </div>

        {/* BODY */}
        <div style={body}>
          {/* REQUESTED BY */}
          <div style={section}>
            <h4>Requested By</h4>

            <select
              value={form.contactId}
              onChange={e =>
                setForm(prev => ({
                  ...prev,
                  contactId: e.target.value,
                }))
              }
              style={input}
            >
              <option value="">
                {loadingContacts ? "Loading contacts…" : "Select requester"}
              </option>

              {contacts.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name}
                  {c.company_name || c.company_code ? " - " : ""}
                  {c.company_name || ""}
                  {c.company_code ? ` (${c.company_code})` : ""}
                </option>
              ))}
            </select>




            <button onClick={() => setIsContactModalOpen(true)}>
              + Create Contact
            </button>
          </div>

          {isContactModalOpen && (
            <CreateContactModal
              onClose={() => setIsContactModalOpen(false)}
              onCreated={(newContact) => {
                if (newContact?.id) {
                  setContacts(prev => {
                    const exists = prev.some(c => c.id === newContact.id);
                    if (exists) return prev;
                    return [newContact, ...prev];
                  });
                  setForm(prev => ({ ...prev, contactId: newContact.id }));
                } else {
                  reloadContacts();
                }
                setIsContactModalOpen(false);
              }}
              companies={companies}
            />
          )}


          {/* SERVICE TYPE */}
          <div style={section}>
            <h4>Service Type</h4>
            <div style={pillRow}>
              {[
                { key: "PEST", label: "Pest Control" },
                { key: "DEEP", label: "Deep Cleaning" },
                { key: "BOTH", label: "Both" },
              ].map(s => (
                <div
                  key={s.key}
                  style={pill(form.serviceType === s.key)}
                  onClick={() => update("serviceType", s.key)}
                >
                  {s.label}
                </div>
              ))}
            </div>
          </div>

          {/* SUB SERVICES */}
          <div style={section}>
            <h4>Sub Services</h4>
            <div style={subGrid}>
              {visibleSubServices.map(service => (
                <div
                  key={service}
                  style={subItem(form.subServices.includes(service))}
                  onClick={() => toggleSubService(service)}
                >
                  {service}
                </div>
              ))}
            </div>
          </div>

          {/* SCHEDULE */}
          <div style={section}>
            <h4>Schedule</h4>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div>
                <div style={{ fontSize: "12px", color: "#6b7280", marginBottom: "6px" }}>
                  Start Date
                </div>
                <input
                  type="date"
                  value={form.start_date}
                  onChange={e => update("start_date", e.target.value)}
                  max={form.end_date || undefined}
                  style={input}
                />
              </div>
              <div>
                <div style={{ fontSize: "12px", color: "#6b7280", marginBottom: "6px" }}>
                  End Date
                </div>
                <input
                  type="date"
                  value={form.end_date}
                  onChange={e => update("end_date", e.target.value)}
                  min={form.start_date || undefined}
                  style={input}
                />
              </div>
            </div>
          </div>

          {/* RECURRENCE */}
          <div style={section}>
            <h4>Recurring</h4>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px" }}>
              <input
                type="checkbox"
                checked={form.recurrenceEnabled}
                onChange={e => update("recurrenceEnabled", e.target.checked)}
              />
              Repeat this booking
            </label>

            {recurrenceActive && (
              <div style={{ marginTop: "12px" }}>
                <div style={{ fontSize: "12px", color: "#6b7280", marginBottom: "6px" }}>
                  Frequency
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                  {[
                    { value: "DAILY", label: "Daily" },
                    { value: "WEEKLY", label: "Weekly" },
                    { value: "CUSTOM_DAYS", label: "Every X Days" },
                    { value: "CUSTOM_WEEKS", label: "Every X Weeks" },
                    { value: "CUSTOM_MONTHS", label: "Every X Months" },
                  ].map(option => (
                    <label
                      key={option.value}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "8px 10px",
                        border: "1px solid #d1d5db",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontSize: "13px",
                      }}
                    >
                      <input
                        type="radio"
                        name="recurrenceType"
                        value={option.value}
                        checked={form.recurrenceType === option.value}
                        onChange={() => update("recurrenceType", option.value)}
                      />
                      {option.label}
                    </label>
                  ))}
                </div>

                {recurrenceNeedsInterval && (
                  <div style={{ marginTop: "12px" }}>
                    <div style={{ fontSize: "12px", color: "#6b7280", marginBottom: "6px" }}>
                      Interval
                    </div>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <input
                        type="number"
                        min="1"
                        value={form.recurrenceInterval}
                        onChange={e => update("recurrenceInterval", e.target.value)}
                        style={{ ...input, width: "120px" }}
                      />
                      <div style={{ fontSize: "12px", color: "#6b7280" }}>
                        {form.recurrenceType === "CUSTOM_DAYS"
                          ? "days"
                          : form.recurrenceType === "CUSTOM_WEEKS"
                            ? "weeks"
                            : "months"}
                      </div>
                    </div>
                  </div>
                )}

                {recurrenceUsesWeekdays && (
                  <div style={{ marginTop: "12px" }}>
                    <div style={{ fontSize: "12px", color: "#6b7280", marginBottom: "6px" }}>
                      Days of Week
                    </div>
                    <div style={pillRow}>
                      {daysOfWeek.map(day => (
                        <div
                          key={day.value}
                          style={dayPill(form.recurrenceDaysOfWeek.includes(day.value))}
                          onClick={() => toggleRecurrenceDay(day.value)}
                        >
                          {day.label}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* NOTES */}
          <div style={section}>
            <h4>Notes</h4>
            <textarea
              style={{ ...input, minHeight: "80px" }}
              placeholder="Optional notes"
              onChange={e => update("notes", e.target.value)}
            />
          </div>
        </div>

        {/* FOOTER */}
        <div
          style={{
            padding: "16px 24px",
            borderTop: "1px solid #e5e7eb",
            display: "flex",
            justifyContent: "flex-end",
            gap: "12px",
          }}
        >
          <button onClick={onClose}>Cancel</button>
          <button className="primary" onClick={handleSubmit}>
            Create Booking
          </button>
        </div>
      </div>
    </div>
  );
}



