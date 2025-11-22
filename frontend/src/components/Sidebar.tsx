import React from "react";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="logo">🐄</div>
        <div className="title">CHMI</div>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
          <span className="icon">📝</span>
          Register
        </NavLink>

        <NavLink to="/login" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
          <span className="icon">🔐</span>
          Login
        </NavLink>
      </nav>

      <div className="sidebar-footer">v1.0 • CHMI</div>
    </aside>
  );
}
