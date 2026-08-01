import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/client";

export default function CreateRecord() {
  const [studentUsername, setStudentUsername] = useState("");
  const [course, setCourse] = useState("");
  const [examScore, setExamScore] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      await api.post("/records", { studentUsername, course, examScore: Number(examScore) });
      setMessage("Record created successfully.");
      setStudentUsername("");
      setCourse("");
      setExamScore("");
      setTimeout(() => navigate("/records"), 1000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create record");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <h2>Create a new record</h2>
      <p className="subtitle">
        This action is gated by the Access Control Layer (staff role required), the same
        as any other write action in the system.
      </p>

      <form className="auth-card" onSubmit={handleSubmit}>
        <label>Student username</label>
        <input value={studentUsername} onChange={(e) => setStudentUsername(e.target.value)} required />

        <label>Course</label>
        <input value={course} onChange={(e) => setCourse(e.target.value)} required />

        <label>Exam score</label>
        <input type="number" value={examScore} onChange={(e) => setExamScore(e.target.value)} required />

        {error && <p className="error">{error}</p>}
        {message && <p className="success">{message}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create record"}
        </button>
      </form>

      <p style={{ marginTop: 12 }}>
        <Link to="/records">View all records</Link>
      </p>
    </div>
  );
}