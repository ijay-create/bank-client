import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/sidebar.css";

function Sidebar() {
  const { user } = useAuth();

  // ✅ SAFE ROLE EXTRACTION (prevents undefined bugs)
  const role =
    user?.role ||
    user?.user?.role ||
    null;

  const isAdmin = role === "admin";

  return (
    <div className="sidebar">
      <h1 className="logo">NeoBank</h1>

      <div className="sidebar-links">
        <Link to="/dashboard" className="sidebar-link">
          Dashboard
        </Link>

        <Link to="/transfer" className="sidebar-link">
          Transfers
        </Link>

        <Link to="/transactions" className="sidebar-link">
          Transactions
        </Link>

        {/* ✅ ONLY ADMINS SEE THIS */}
        {isAdmin && (
          <Link to="/admin" className="sidebar-link">
            Admin
          </Link>
        )}
      </div>
    </div>
  );
}

export default Sidebar;