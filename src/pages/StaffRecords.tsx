import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";

interface RecordItem {
  _id: string;
  course: string;
  examScore: number;
  student: { _id: string; name: string; username: string } | null;
  updatedBy: { _id: string; name: string; username: string } | null;
  updatedAt: string;
}

export default function StaffRecords() {
  const [records, setRecords] = useState<RecordItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/records")
      .then((res) => setRecords(res.data))
      .catch((err) => setError(err.response?.data?.message || "Failed to load records"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page">
      <div className="topbar">
        <div>
          <h2>All records</h2>
          <p className="subtitle">Every academic record currently in the system</p>
        </div>
        <div className="topbar-actions">
          <Link to="/create-record" className="button-link">Create a record</Link>
          <Link to="/dashboard">Back to dashboard</Link>
        </div>
      </div>

      {error && <p className="error">{error}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Course</th>
              <th>Exam score</th>
              <th>Last updated by</th>
              <th>Last updated</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r._id}>
                <td>{r.student ? `${r.student.name} (${r.student.username})` : "Unknown"}</td>
                <td>{r.course}</td>
                <td>{r.examScore}</td>
                <td>{r.updatedBy ? r.updatedBy.name : "—"}</td>
                <td>{new Date(r.updatedAt).toLocaleString()}</td>
                <td>
                  <Link to={`/edit-record?recordId=${r._id}`}>Edit</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}