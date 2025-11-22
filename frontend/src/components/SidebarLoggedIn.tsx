import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

export default function SidebarLoggedIn() {
  const nav = useNavigate();

  const logout = () => {
    sessionStorage.removeItem("chmi_user");
    sessionStorage.removeItem("chmi_verified");
    // optionally clear other session items
    nav("/login");
    // also trigger cross-tab sync if desired (not implemented here)
    window.location.reload(); // ensures all components using sessionStorage refresh (optional)
  };

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="logo">🐄</div>
        <div className="title">CHMI</div>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
          <span className="icon">📊</span>
          Dashboard
        </NavLink>

        <NavLink to="/profile" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
          <span className="icon">👤</span>
          Profile
        </NavLink>

        <button className="nav-item" onClick={logout} style={{ textAlign: "left" }}>
          <span className="icon">🚪</span>
          Logout
        </button>
      </nav>

      <div className="sidebar-footer">Logged In</div>
    </aside>
  );
}
