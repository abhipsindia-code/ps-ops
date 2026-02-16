import { useNavigate } from "react-router-dom";
import "../assets/auth.css";

export default function Terms() {
  const navigate = useNavigate();

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ maxWidth: 700 }}>
        <h2>Terms & Conditions</h2>

        <div style={{ maxHeight: 400, overflowY: "auto", textAlign: "left" }}>
          <h4>1. Acceptance</h4>
          <p>
            By accessing or using this platform, you agree to comply with these
            Terms & Conditions.
          </p>

          <h4>2. User Responsibilities</h4>
          <p>
            Users must provide accurate information and are responsible for
            maintaining the confidentiality of their credentials.
          </p>

          <h4>3. Account Security</h4>
          <p>
            You are responsible for all activity under your account. Any misuse
            may result in suspension or termination.
          </p>

          <h4>4. Data Usage</h4>
          <p>
            The platform may store operational and contact information required
            for service delivery.
          </p>

          <h4>5. Limitation of Liability</h4>
          <p>
            The company is not liable for indirect or incidental damages arising
            from platform use.
          </p>

          <h4>6. Modifications</h4>
          <p>
            Terms may be updated periodically. Continued use constitutes
            acceptance of revised terms.
          </p>
        </div>

        <div style={{ marginTop: 20 }}>
          <button onClick={() => navigate(-1)}>
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
