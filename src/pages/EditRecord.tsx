import { useState, FormEvent } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "../api/client";

export default function EditRecord() {
  const [searchParams] = useSearchParams();
  const [recordId, setRecordId] = useState(searchParams.get("recordId") || "");
  const [examScore, setExamScore] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      // Sensitive action: even though this staff member is already logged
      // in, the Access Control Layer requires their password again before
      // committing the change - this is the framework's step-up
      // re-verification described in Chapter 3.
      const res = await api.put(`/records/${recordId}`, {
        examScore: Number(examScore),
        password,
      });
      setMessage(res.data.message);
      setPassword("");
    } catch (err: any) {
      if (err.response?.status === 423) {
        setError(err.response.data.message + " You will be redirected to log in again.");
        setTimeout(() => {
          window.location.href = "/login";
        }, 3000);
      } else {
        setError(err.response?.data?.message || "Update failed");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <h2>Edit exam record</h2>
      <p className="subtitle">
        This is a sensitive action. You must re-enter your password to confirm the change,
        even though you are already signed in.
      </p>

      <form className="auth-card" onSubmit={handleSubmit}>
        <label>Record ID</label>
        <input value={recordId} onChange={(e) => setRecordId(e.target.value)} required />

        <label>New exam score</label>
        <input
          type="number"
          value={examScore}
          onChange={(e) => setExamScore(e.target.value)}
          required
        />

        <label>Re-enter your password to confirm</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

        {error && <p className="error">{error}</p>}
        {message && <p className="success">{message}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Confirming..." : "Confirm and save"}
        </button>
      </form>

      <p style={{ marginTop: 12 }}>
        <Link to="/records">Back to all records</Link>
      </p>
    </div>
  );
}