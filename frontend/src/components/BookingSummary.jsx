import { useEffect, useState } from "react";
import { apiFetch } from "../api";
import "./BookingSummary.css";
import { useNavigate } from "react-router-dom";



export default function BookingSummary() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const [data, setData] = useState(null);

  useEffect(() => {

    async function loadSummary() {
      try {
        const res = await apiFetch("/api/dashboard/summary");
        const raw = await res.json();

        const parsed = {
          today: raw?.calendar?.today ?? 0,
          residential: raw?.customerType?.residential ?? 0,
          commercial: raw?.customerType?.corporate ?? 0,
          total: raw?.totalBookings ?? 0
        };

        setData(parsed);
      } catch (err) {
        console.error("Summary load failed", err);
      }
    }

    loadSummary();

  }, []);

  if (!data) return <div className="card">Loading...</div>;

  return (
    <div className="booking-card">
      <div className="booking-header">
        <h3>Booking Summary</h3>

      </div>

      <div className="booking-section">
        <div className="section-title">Details</div>
        <div className="summary-row">
          <span> Today's Bookings</span>
          <span className="value">{data.today}</span>
        </div>
        <div className="summary-row">

          <span>Residential Jobs</span>
          <span className="value">{data.residential}</span>
        </div>

        <div className="summary-row">
          <span>Commercial Jobs</span>
          <span className="value">{data.commercial}</span>
        </div>
      </div>



      <div className="summary-row">
        <span>Total Bookings</span>
        <span className="value">{data.total}</span>
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
