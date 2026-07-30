import { useState, FormEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const userId = (location.state as { userId?: string } | null)?.userId;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!userId) {
      setError("Session expired, please log in again.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/verify-otp", { userId, otp });
      login(res.data.token, res.data.user);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  }

  if (!userId) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <p className="error">No login in progress. Please start from the login page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Enter verification code</h1>
        <p className="subtitle">We sent a 6-digit code to your registered email</p>

        <label>OTP</label>
        <input value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={6} required />

        {error && <p className="error">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Verifying..." : "Verify and sign in"}
        </button>
      </form>
    </div>
  );
}
