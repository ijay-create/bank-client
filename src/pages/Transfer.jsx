import { useState } from "react";
import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import "../styles/transfer.css";

function Transfer() {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    receiverAccountNumber: "",
    amount: "",
    otp: "",
  });

  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /* ---------------- REQUEST OTP ---------------- */
  const requestOTP = async () => {
    try {
      if (!formData.receiverAccountNumber || !formData.amount) {
        return alert("Enter account number and amount first");
      }

      await API.post(
        "/transactions/request-otp",
        {
          receiverAccountNumber: formData.receiverAccountNumber,
          amount: Number(formData.amount),
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setOtpSent(true);
      alert("OTP sent to your email");
    } catch (error) {
      alert(error.response?.data?.message || "OTP request failed");
    }
  };

  /* ---------------- TRANSFER MONEY ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (!otpSent) {
        return alert("Request OTP first");
      }

      if (!formData.otp) {
        return alert("Enter OTP");
      }

      const payload = {
        receiverAccountNumber: formData.receiverAccountNumber,
        amount: Number(formData.amount),
        otp: formData.otp,
      };

      const response = await API.post(
        "/transactions/transfer",
        payload,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      alert(response.data.message);

      window.location.href = "/dashboard";
    } catch (error) {
      alert(error.response?.data?.message || "Transfer failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="transfer-page">
      <Sidebar />

      <div className="transfer-content">
        <motion.div
          className="transfer-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1>Secure Transfer</h1>

          <form className="transfer-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="receiverAccountNumber"
              placeholder="Recipient Account Number"
              className="transfer-input"
              value={formData.receiverAccountNumber}
              onChange={handleChange}
            />

            <input
              type="number"
              name="amount"
              placeholder="Amount"
              className="transfer-input"
              value={formData.amount}
              onChange={handleChange}
            />

            {otpSent && (
              <input
                type="text"
                name="otp"
                placeholder="Enter OTP"
                className="transfer-input"
                value={formData.otp}
                onChange={handleChange}
              />
            )}

            {!otpSent ? (
              <button
                type="button"
                className="transfer-btn"
                onClick={requestOTP}
              >
                Request OTP
              </button>
            ) : (
              <button type="submit" className="transfer-btn">
                {loading ? "Processing..." : "Complete Transfer"}
              </button>
            )}
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export default Transfer;