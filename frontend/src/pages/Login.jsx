import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../api";
import "../assets/auth.css";
import logo from "../assets/logo.png";

export default function Login() {
  const navigate = useNavigate();
  console.log(import.meta.env.VITE_API_BASE);

  const [mode, setMode] = useState("login");
  // login | forgot-email | forgot-verify

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);

  // ---------------- LOGIN ----------------
  const handleLogin = async () => {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Login failed");
      return;
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.role);

    navigate("/");
  };



  // ---------------- SEND RESET OTP ----------------
  const handleSendResetOtp = async () => {
    const res = await fetch(
      `${API_BASE}/api/auth/forgot-password/send-otp`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Failed to send OTP");
      return;
    }

    setMode("forgot-verify");
  };

  // ---------------- VERIFY + RESET ----------------
  const handleResetPassword = async () => {
    const res = await fetch(
      `${API_BASE}/api/auth/forgot-password/verify-otp`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          otp,
          newPassword,
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Reset failed");
      return;
    }

    alert("Password updated. Please login.");
    setMode("login");
  };

  return (
    <div className="auth-container">
      <div className="auth-card">

        {/* ---------------- LOGIN MODE ---------------- */}
        {mode === "login" && (
          <>
            <img src={logo} alt="BestServe Logo" style={{
              display: "block",
              margin: "0 auto 18px",
              width: "80px"
            }} />
            <h2>Login</h2>

            <input
              type="username"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />

            <label className="terms">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={e => setAcceptTerms(e.target.checked)}
              />
              I agree to the Terms & Conditions
            </label>

            <button
              onClick={handleLogin}
              disabled={!acceptTerms}
            >
              Login
            </button>

            <p
              style={{ cursor: "pointer", marginTop: 10 }}
              onClick={() => setMode("forgot-email")}
            >
              Forgot password?
            </p>
          </>
        )}

        {/* ---------------- ENTER EMAIL ---------------- */}
        {mode === "forgot-email" && (
          <>
            <h2>Reset Password</h2>

            <input
            type="username"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />

            <button onClick={handleSendResetOtp}>
              Send OTP
            </button>

            <p
              style={{ cursor: "pointer", marginTop: 10 }}
              onClick={() => setMode("login")}
            >
              Back to login
            </p>
          </>
        )}

        {/* ---------------- VERIFY OTP ---------------- */}
        {mode === "forgot-verify" && (
          <>
            <h2>Enter OTP</h2>

            <input
              placeholder="OTP"
              value={otp}
              onChange={e => setOtp(e.target.value)}
            />

            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
            />

            <button onClick={handleResetPassword}>
              Reset Password
            </button>
          </>
        )}

      </div>
    </div>
  );
}
