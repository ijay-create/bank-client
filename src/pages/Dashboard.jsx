import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import API from "../services/api";
import socket from "../services/socket";
import { useAuth } from "../context/AuthContext";

import Sidebar from "../components/Sidebar";
import BalanceCard from "../components/BalanceCard";
import TransactionTable from "../components/TransactionTable";
import Notification from "../components/Notification";

import "../styles/dashboard.css";

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [notification, setNotification] = useState(null);

  /* =========================
     TOKEN FIX (SAFE)
  ========================= */
  const token = useMemo(() => {
    return user?.accessToken || user?.token;
  }, [user]);

  /* =========================
     DISPLAY NAME
  ========================= */
  const displayName = useMemo(() => {
    return profile?.full_name || user?.full_name || "User";
  }, [profile, user]);

  /* =========================
     FETCH PROFILE
  ========================= */
  const fetchProfile = async () => {
    try {
      const res = await API.get("/users/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProfile(res.data);
    } catch (err) {
      console.log("Profile error:", err.response?.data || err.message);
    }
  };

  /* =========================
     FETCH TRANSACTIONS (FIXED)
  ========================= */
  const fetchTransactions = async () => {
    try {
      const res = await API.get("/transactions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("RAW TRANSACTIONS:", res.data);

      const data = Array.isArray(res.data)
        ? res.data
        : res.data?.data || [];

      setTransactions(data);
    } catch (err) {
      console.log("Transactions error:", err.message);
      setTransactions([]);
    }
  };

  /* =========================
     INIT
  ========================= */
  useEffect(() => {
    if (!user || !token) return;

    fetchProfile();
    fetchTransactions();

    const userId = profile?.id || user?.id;
    if (!userId) return;

    socket.emit("joinRoom", String(userId));

    const handleNotification = () => {
      fetchProfile();
      fetchTransactions();
    };

    socket.on("notification", handleNotification);

    return () => socket.off("notification", handleNotification);
  }, [user, token, profile?.id]);

  /* =========================
     LOGOUT
  ========================= */
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="dashboard">
      <Notification notification={notification} />
      <Sidebar />

      <div className="dashboard-content">

        {/* NAVBAR */}
        <motion.div
          className="dashboard-navbar"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div>
            <h2>Welcome back, {displayName}</h2>
            <p>Manage your banking activities</p>
          </div>

          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </motion.div>

        {/* BALANCE */}
        <div className="balance-grid">
          <BalanceCard
            title="Available Balance"
            amount={`₦${Number(profile?.balance || 0).toLocaleString()}`}
          />

          <BalanceCard
            title="Account Number"
            amount={profile?.account_number || "N/A"}
          />

          <BalanceCard
            title="Transactions"
            amount={transactions.length}
          />
        </div>

        {/* TABLE */}
        <TransactionTable
          transactions={transactions}
          currentUserId={profile?.id || user?.id}
        />
      </div>
    </div>
  );
}

export default Dashboard;