import { useState } from "react";
import API from "../services/api";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      return alert("Email is required");
    }

    try {
      setLoading(true);

      const res = await API.post("/auth/forgot-password", {
        email,
      });

      setSent(true);
      alert(res.data.message);
    } catch (error) {
      alert(error.response?.data?.message || "Error sending reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="transfer-page">
      <div className="transfer-content">
        <h1>Forgot Password</h1>

        {!sent ? (
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="transfer-input"
            />

            <button className="transfer-btn" disabled={loading}>
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        ) : (
          <p style={{ color: "green", marginTop: "20px" }}>
            If the email exists, a reset link has been sent.
          </p>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;