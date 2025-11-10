import React, { useEffect, useState } from "react";
import API from "../api/axiosConfig";
import { useAuth } from "../context/AuthContext";
import "./Home.css";

export default function Home() {
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  const initialForm = {
    name: "",
    email: "",
    phone: "",
    department: "",
    designation: "",
    salary: "",
    role: "employee",
    dateOfJoining: "",
  };

  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      if (user?.role === "admin") {
        const res = await API.get("/users");
        setEmployees(res.data);
      } else {
        const res = await API.get("/users/me");
        setEmployees([res.data]);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClick = () => {
    setForm(initialForm);
    setEditingId(null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const startEdit = (emp) => {
    setEditingId(emp._id);
    setForm({
      name: emp.name || "",
      email: emp.email || "",
      phone: emp.phone || "",
      department: emp.department || "",
      designation: emp.designation || "",
      salary: emp.salary || "",
      role: emp.role || "employee",
      dateOfJoining: emp.dateOfJoining
        ? new Date(emp.dateOfJoining).toISOString().slice(0, 10)
        : "",
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setShowForm(false);
    setForm(initialForm);
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await API.delete(`/users/${id}`);
      await load();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        const res = await API.put(`/users/${editingId}`, form);
        if (user._id === editingId) {
          localStorage.setItem("user", JSON.stringify(res.data));
        }
      } else {
        await API.post("/auth/register", form);
        alert("Employee created (default password = phone)");
      }
      setForm(initialForm);
      setEditingId(null);
      setShowForm(false);
      await load();
    } catch (err) {
      console.error(err);
      alert("Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="home-page">
      <div className="home-header">
        <h2 style={{ textDecoration: "underline" }}>Employee Details</h2>

        {user?.role === "admin" && (
          <button className="btn-create" onClick={handleCreateClick}>
            + Create Employee
          </button>
        )}
      </div>

      <div className="table-container">
        {loading ? (
          <p className="muted">Loading...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Department</th>
                <th>Designation</th>
                <th>Salary</th>
                <th>Role</th>
                <th>DOJ</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp._id}>
                  <td>{emp.name}</td>
                  <td>{emp.email}</td>
                  <td>{emp.phone}</td>
                  <td>{emp.department}</td>
                  <td>{emp.designation}</td>
                  <td>{emp.salary}</td>
                  <td>{emp.role}</td>
                  <td>
                    {emp.dateOfJoining
                      ? new Date(emp.dateOfJoining).toLocaleDateString()
                      : ""}
                  </td>
                  <td>
                    {(user?.role === "admin" || user._id === emp._id) && (
                      <button
                        className="btn-action"
                        onClick={() => startEdit(emp)}
                      >
                        Edit
                      </button>
                    )}
                    {user?.role === "admin" && (
                      <button
                        className="btn-delete"
                        onClick={() => remove(emp._id)}
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {employees.length === 0 && (
                <tr>
                  <td colSpan={9} className="muted">
                    No records
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
      {showForm && (
        <div className="card" style={{ marginTop: 18 }}>
          <h3>{editingId ? "Edit Employee" : "Create Employee"}</h3>
          <form onSubmit={submit} className="form-grid">
            <input
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <input
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <input
              placeholder="Phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              required
            />
            <input
              placeholder="Department"
              value={form.department}
              onChange={(e) =>
                setForm({ ...form, department: e.target.value })
              }
            />
            <input
              placeholder="Designation"
              value={form.designation}
              onChange={(e) =>
                setForm({ ...form, designation: e.target.value })
              }
            />
            <input
              placeholder="Salary"
              value={form.salary}
              onChange={(e) => setForm({ ...form, salary: e.target.value })}
            />
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              disabled={user?.role !== "admin"}
            >
              <option value="employee">Employee</option>
              <option value="admin">Admin</option>
            </select>
            <input
              type="date"
              value={form.dateOfJoining}
              onChange={(e) =>
                setForm({ ...form, dateOfJoining: e.target.value })
              }
            />
            <div className="form-actions">
              <button
                type="button"
                className="btn-action btn-secondary"
                onClick={cancelEdit}
              >
                Cancel
              </button>
              <button type="submit" className="btn-action" disabled={saving}>
                {saving ? "Saving..." : editingId ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}