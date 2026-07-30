import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

interface RecordItem {
  _id: string;
  course: string;
  examScore: number;
  student: string;
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [records, setRecords] = useState<RecordItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRecords() {
      try {
        if (user?.role === "student") {
          const res = await api.get("/records/my-record");
          setRecords(res.data);
        }
        // staff view student records by searching/selecting a student in a
        // fuller build - kept simple here since this is a prototype
      } catch {
        // interceptor already redirects on 401
      } finally {
        setLoading(false);
      }
    }
    loadRecords();
  }, [user]);

  async function handleLogout() {
    await api.post("/auth/logout");
    logout();
    navigate("/login");
  }

  return (
    <div className="page">
      <header className="topbar">
        <div>
          <h2>Welcome, {user?.name}</h2>
          <p className="subtitle">Role: {user?.role}</p>
        </div>
        <div className="topbar-actions">
          {user?.role === "staff" && <Link to="/audit-log">View audit log</Link>}
          <button onClick={handleLogout}>Log out</button>
        </div>
      </header>

      {user?.role === "student" && (
        <section>
          <h3>Your academic record</h3>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Exam score</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r) => (
                  <tr key={r._id}>
                    <td>{r.course}</td>
                    <td>{r.examScore}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      )}

      {user?.role === "staff" && (
        <section>
          <h3>Staff actions</h3>
          <p className="subtitle">
            To edit a student's exam score, open the record edit page directly with the
            record ID (kept simple for this prototype). Editing requires re-entering your
            password even though you are already logged in.
          </p>
          <Link to="/edit-record" className="button-link">Edit a record</Link>
        </section>
      )}
    </div>
  );
}
