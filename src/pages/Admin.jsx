import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import "../styles/dashboard.css";

function Admin() {
  const { user } = useAuth();

  const [users, setUsers] = useState([]);
  const [flaggedTransactions, setFlaggedTransactions] = useState([]);
  const [logs, setLogs] = useState([]);
  const [sessions, setSessions] = useState([]);

  /* ---------------- FETCH ADMIN DATA ---------------- */
  const fetchData = async () => {
    try {
      const headers = {
        headers: {
          Authorization: `Bearer ${user?.accessToken || user?.token}`,
        },
      };

      const [usersRes, flaggedRes, logsRes, sessionRes] =
        await Promise.all([
          API.get("/admin/users", headers),
          API.get("/admin/flagged-transactions", headers),
          API.get("/admin/audit-logs", headers),
          API.get("/admin/login-sessions", headers),
        ]);

      setUsers(usersRes.data || []);
      setFlaggedTransactions(flaggedRes.data || []);
      setLogs(logsRes.data || []);
      setSessions(sessionRes.data || []);
    } catch (error) {
      console.log("Admin fetch error:", error);
    }
  };

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  /* ---------------- FREEZE USER ---------------- */
  const handleFreeze = async (id) => {
    try {
      await API.put(
        `/admin/freeze/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user?.accessToken || user?.token}`,
          },
        }
      );

      fetchData();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="dashboard">
      <Sidebar />

      <div className="dashboard-content">
        <h1>Admin Dashboard</h1>

        {/* ================= USERS ================= */}
        <div className="transaction-section">
          <h2>Users</h2>

          <table className="transaction-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Balance</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.full_name}</td>
                  <td>₦{u.balance}</td>
                  <td>{u.status}</td>
                  <td>
                    <button
                      className="logout-btn"
                      onClick={() => handleFreeze(u.id)}
                    >
                      {u.status === "active" ? "Freeze" : "Unfreeze"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ================= LOGIN SESSIONS ================= */}
        <div className="transaction-section">
          <h2>Login Sessions</h2>

          <table className="transaction-table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>IP Address</th>
                <th>Device</th>
                <th>Risk</th>
                <th>Time</th>
              </tr>
            </thead>

            <tbody>
              {sessions.map((s) => (
                <tr key={s.id}>
                  <td>{s.user_id}</td>
                  <td>{s.ip_address}</td>
                  <td>{s.user_agent?.slice(0, 35)}...</td>
                  <td style={{ color: s.is_suspicious ? "red" : "green" }}>
                    {s.is_suspicious ? "Suspicious" : "Normal"}
                  </td>
                  <td>
                    {new Date(s.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ================= FLAGGED TRANSACTIONS ================= */}
        <div className="transaction-section">
          <h2>Flagged Transactions</h2>

          <table className="transaction-table">
            <thead>
              <tr>
                <th>Reference</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {flaggedTransactions.map((t) => (
                <tr key={t.id}>
                  <td>{t.reference}</td>
                  <td>₦{t.amount}</td>
                  <td className="debit">Flagged</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ================= AUDIT LOGS (FIXED) ================= */}
        <div className="transaction-section">
          <h2>Audit Logs</h2>

          <table className="transaction-table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Action</th>
                <th>Time</th>
              </tr>
            </thead>

            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td>{log.user_id}</td>

                  <td>
                    <span
                      style={{
                        color:
                          log.type === "debit"
                            ? "red"
                            : log.type === "credit"
                            ? "green"
                            : "black",
                        fontWeight: "bold",
                        marginRight: "8px",
                        textTransform: "uppercase",
                      }}
                    >
                      {log.type || "UNKNOWN"}
                    </span>

                    {log.action}
                  </td>

                  <td>
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Admin;