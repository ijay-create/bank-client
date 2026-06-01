import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import API from "../services/api";
import { useAuth } from "../context/AuthContext";

import "../styles/auth.css";

function Register() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.full_name || !formData.email || !formData.password) {
      return alert("All fields are required");
    }

    try {
      setLoading(true);

      const response = await API.post("/auth/register", formData);

      // save session
      localStorage.setItem(
        "bank_user",
        JSON.stringify(response.data)
      );

      setUser(response.data);

      navigate("/dashboard");
    } catch (error) {
      alert(
        error.response?.data?.message || "Registration failed"
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
      >
        <h1 className="auth-title">Create Account</h1>

        <p className="auth-subtitle">
          Open your digital banking account
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="full_name"
            placeholder="Full Name"
            className="auth-input"
            value={formData.full_name}
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            className="auth-input"
            value={formData.email}
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="auth-input"
            value={formData.password}
            onChange={handleChange}
          />

          <button className="auth-button" disabled={loading}>
            {loading ? "Creating..." : "Register"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{" "}
            <Link to="/">
              <span>Login</span>
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default Register;