import { useEffect, useState } from "react";
import api from "../api/client";

interface LogEntry {
  _id: string;
  username: string;
  action: string;
  ipAddress: string;
  device: string;
  details: string;
  createdAt: string;
}

export default function AuditLog() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/records/audit-log/all")
      .then((res) => setLogs(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page">
      <h2>Audit log</h2>
      <p className="subtitle">
        Every login attempt, OTP check, and sensitive action is recorded here by the
        Continuous Monitoring and Policy Enforcement Layer.
      </p>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Time</th>
              <th>User</th>
              <th>Action</th>
              <th>IP address</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log._id}>
                <td>{new Date(log.createdAt).toLocaleString()}</td>
                <td>{log.username}</td>
                <td>{log.action}</td>
                <td>{log.ipAddress}</td>
                <td>{log.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
