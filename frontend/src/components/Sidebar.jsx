import React from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar() {
  return (
    <aside className="side-bar">
      <nav>
        <NavLink className={({isActive}) => isActive ? "side-link active" : "side-link"} to="/dashboard/home">Home</NavLink>
        <NavLink className={({isActive}) => isActive ? "side-link active" : "side-link"} to="/dashboard/employee-performance">EmployeePerformance</NavLink>
      </nav>
    </aside>
  );
}