import React from "react";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <header className="nav-bar">
      <div className="nav-left">
        <h1 className="project-title">RoleWise Employee Portal</h1>
      </div>
      <div className="nav-right">
        <div className="username">{user?.name}</div>
        <button className="btn-logout" onClick={handleLogout}>Logout</button>
      </div>
    </header>
  );
}
