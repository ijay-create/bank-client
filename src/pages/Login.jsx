import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import API from "../services/api";
import { useAuth } from "../context/AuthContext";

import "../styles/auth.css";

function Login() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  /* =========================
     HANDLE INPUTS
  ========================= */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =========================
     LOGIN
  ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await API.post(
        "/auth/login",
        formData
      );

      /* =========================
         SAVE USER VIA CONTEXT
      ========================= */
      login(res.data);

      navigate("/dashboard");
    } catch (err) {
      console.log(
        "LOGIN ERROR:",
        err.response?.data || err.message
      );

      alert(
        err.response?.data?.message ||
        "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="auth-title">
          Welcome Back
        </h1>

        <p className="auth-subtitle">
          Login to your banking account
        </p>

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            className="auth-input"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="auth-input"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account?{" "}
            <Link to="/register">
              Register
            </Link>
          </p>

          <Link
            to="/forgot-password"
            className="forgot-link"
          >
            Forgot Password?
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default Login;