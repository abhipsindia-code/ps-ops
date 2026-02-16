import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/auth.css";

export default function Signup() {
    const navigate = useNavigate();

    const [step, setStep] = useState("form"); // "form" | "otp"
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        name: "",
        phone: "",
        email: "",
        password: "",
        designation: "",
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    // =============================
    // STEP 1 — SEND OTP
    // =============================
    const handleSendOtp = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch(
                `${import.meta.env.VITE_API_BASE}/api/auth/signup/send-otp`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(form),
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to send OTP");
            }

            setStep("otp");
        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    // =============================
    // STEP 2 — VERIFY OTP + CREATE USER
    // =============================
    const handleVerifyOtp = async () => {
        try {
            const res = await fetch(
                `${import.meta.env.VITE_API_BASE}/api/auth/signup/verify-otp`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name: form.name,
                        phone: form.phone,
                        email: form.email,
                        password: form.password,
                        otp: otp,
                    }),
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "OTP verification failed");
            }

            alert("Account created successfully");
            window.location.href = "/login";

        } catch (err) {
            alert(err.message);
        }
    };

    const [acceptTerms, setAcceptTerms] = useState(false); // Add this state for terms acceptance


    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Sign Up</h2>

                {step === "form" && (
                    <form onSubmit={handleSendOtp}>
                        <input
                            name="name"
                            placeholder="Full Name"
                            value={form.name}
                            onChange={handleChange}
                            required
                        />

                        <input
                            name="phone"
                            placeholder="Mobile Number"
                            value={form.phone}
                            onChange={handleChange}
                            required
                        />

                        <input
                            name="email"
                            type="email"
                            placeholder="Email"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />

                        <input
                            name="password"
                            type="password"
                            placeholder="Password"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />

                        <input
                            name="designation"
                            placeholder="Designation (e.g. Field Technician)"
                            value={form.designation}
                            onChange={handleChange}
                        />

                        <label>
                            <input
                                type="checkbox"
                                style={{ width: "auto" }}
                                checked={acceptTerms}
                                onChange={(e) => setAcceptTerms(e.target.checked)}
                            />
                            I agree to the <span
                                style={{ color: "#4f46e5", cursor: "pointer" }}
                                onClick={() => navigate("/terms")}
                            >
                                Terms & Conditions
                            </span>

                        </label>

                        <button type="submit" disabled={loading || !acceptTerms}>
                            {loading ? "Sending..." : "Send OTP"}
                        </button>
                    </form>
                )}

                {step === "otp" && (
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleVerifyOtp();
                        }}
                    >
                        <p style={{ fontSize: 14, marginBottom: 8 }}>
                            OTP sent to <b>{form.email}</b>
                        </p>

                        <input
                            type="text"
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                        />

                        <button type="submit">
                            Verify & Create Account
                        </button>



                    </form>
                )}


                <div className="auth-footer">
                    Already have an account?{" "}
                    <span
                        style={{ cursor: "pointer", color: "#4f46e5" }}
                        onClick={() => navigate("/login")}
                    >
                        Login
                    </span>
                </div>
            </div>
        </div>
    );
}
