import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import "../styles/transactions.css";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =========================
     GET TOKEN SAFELY
  ========================= */
  const getToken = () => {
    try {
      const stored = localStorage.getItem("bank_user");
      if (!stored) return null;

      const parsed = JSON.parse(stored);
      return parsed?.accessToken || null;
    } catch (err) {
      console.log("Token parse error:", err);
      return null;
    }
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = getToken();

        if (!token) {
          console.log("No access token found");
          setLoading(false);
          return;
        }

        const res = await axios.get(
          "https://bank-server-blcj.onrender.com/api/transactions",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("TRANSACTIONS RESPONSE:", res.data);

        const data = Array.isArray(res.data)
          ? res.data
          : res.data?.data || [];

        setTransactions(data);
      } catch (error) {
        console.log(
          "Error fetching transactions:",
          error.response?.data || error.message
        );

        if (error.response?.status === 401) {
          localStorage.removeItem("bank_user");
        }

        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  /* =========================
     LOADING STATE
  ========================= */
  if (loading) {
    return <p className="loading-text">Loading transactions...</p>;
  }

  return (
    <div className="transactions-content">
      <Sidebar />

      <div className="transactions-main">
        <h2 className="transactions-title">My Transactions</h2>

        {transactions.length === 0 ? (
          <div className="empty-state">No transactions found</div>
        ) : (
          <div className="table-wrapper">
            <table className="transactions-table">
              <thead>
                <tr>
                  <th>Reference</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id}>
                    <td>{tx.reference || "N/A"}</td>
                    <td>{tx.transaction_type || "transfer"}</td>

                    <td className="amount">
                      ₦{Number(tx.amount || 0).toLocaleString()}
                    </td>

                    <td>
                      {tx.flagged ? (
                        <span className="flagged">⚠ Flagged</span>
                      ) : (
                        <span className="ok">Successful</span>
                      )}
                    </td>

                    <td className="date">
                      {tx.created_at
                        ? new Date(tx.created_at).toLocaleString()
                        : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Transactions;