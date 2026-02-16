import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api";
import "./BookingsPage.css";

function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function BookingsPage() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadBookings() {
      try {
        setLoading(true);
        const res = await apiFetch("/api/bookings?include_unbooked=1");
        if (!res?.ok) throw new Error("Failed to load bookings");
        const list = await res.json();
        if (isMounted) {
          setBookings(Array.isArray(list) ? list : []);
        }
      } catch (err) {
        console.error("Bookings load failed", err);
        if (isMounted) {
          setError(err.message || "Failed to load bookings");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadBookings();
    return () => {
      isMounted = false;
    };
  }, []);

  const totalBookings = useMemo(() => bookings.length, [bookings.length]);

  if (loading) {
    return <div className="bookings-page">Loading bookings...</div>;
  }

  if (error) {
    return <div className="bookings-page">Error: {error}</div>;
  }

  return (
    <div className="bookings-page">
      <div className="bookings-header">
        <div>
          <h2>Bookings</h2>
          <div className="bookings-subtitle">{totalBookings} total</div>
        </div>
      </div>

      <div className="bookings-list">
        {bookings.map(booking => (
          <div key={booking.id} className="booking-list-card">
            <div className="booking-card-top">
              <div>
                <div className="booking-code">
                  {booking.is_unbooked ? "Unbooked Jobs" : booking.code}
                </div>
                <div className="booking-created">
                  Created {formatDate(booking.created_at)}
                </div>
                {booking.service_type && (
                  <div className="booking-type">{booking.service_type}</div>
                )}
                {booking.is_unbooked && (
                  <div className="booking-type booking-type-muted">No booking record</div>
                )}
              </div>
            </div>

            <div className="booking-sections">
              <div className="booking-section-card">
                <div className="booking-section-title">Client</div>
                <div className="booking-client-grid">
                  <div>
                    <div className="booking-client-label">Contact</div>
                    <div className="booking-client-value">
                      {booking.contact_name || "Unknown contact"}
                    </div>
                  </div>
                  <div>
                    <div className="booking-client-label">Phone</div>
                    <div className="booking-client-value">
                      {booking.contact_phone || "-"}
                    </div>
                  </div>
                  <div>
                    <div className="booking-client-label">Email</div>
                    <div className="booking-client-value">
                      {booking.contact_email || "-"}
                    </div>
                  </div>
                  <div>
                    <div className="booking-client-label">Company</div>
                    <div className="booking-client-value">
                      {booking.company_name || booking.company_code
                        ? `${booking.company_name || "Company"}${booking.company_code ? ` (${booking.company_code})` : ""}`
                        : "Residential"}
                    </div>
                  </div>
                  {booking.company_type && (
                    <div>
                      <div className="booking-client-label">Company Type</div>
                      <div className="booking-client-value">
                        {booking.company_type}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="booking-section-card">
                <div className="booking-section-title">Tasks</div>
                <div className="booking-job-list">
                  {(booking.jobs || []).map(job => (
                    <div
                      key={job.id}
                      className="booking-job-row"
                      onClick={() => navigate(`/${role}/jobs/${job.id}`)}
                    >
                      <div className="job-service">{job.sub_service}</div>
                      <div className="job-date">{formatDate(job.start_date)}</div>
                      <div className={`job-status status-${job.status}`}>
                        {job.status}
                      </div>
                    </div>
                  ))}
                  {(booking.jobs || []).length === 0 && (
                    <div className="booking-job-empty">No jobs yet</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
