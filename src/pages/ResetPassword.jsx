import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password) {
      return alert("Password is required");
    }

    try {
      setLoading(true);

      const res = await API.post(
        `/auth/reset-password/${token}`,
        { password }
      );

      alert(res.data.message);

      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || "Error resetting password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="transfer-page">
      <div className="transfer-content">
        <h1>Reset Password</h1>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="transfer-input"
          />

          <button className="transfer-btn" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;