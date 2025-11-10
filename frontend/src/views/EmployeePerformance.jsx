import React, { useEffect, useState } from "react";
import API from "../api/axiosConfig";
import { useAuth } from "../context/AuthContext";
import "./EmployeePerformance.css";

export default function EmployeePerformance() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const initial = { userId: "", skills: "", projects: "", achievements: "" };
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    load();
    if (user?.role === "admin") loadEmployees();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      if (user?.role === "admin") {
        const res = await API.get("/performance");
        setItems(res.data);
      } else {
        const res = await API.get("/performance/me");
        setItems(res.data ? [res.data] : []);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to load performance data");
    } finally {
      setLoading(false);
    }
  };

  const loadEmployees = async () => {
    try {
      const res = await API.get("/users");
      setEmployees(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const startEdit = (p) => {
    setEditingId(p._id);
    setForm({
      userId: p.user?._id || "",
      skills: (p.skills || []).join(", "),
      projects: (p.projects || []).join(", "),
      achievements: (p.achievements || []).join(", "),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(initial);
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
      projects: form.projects.split(",").map((s) => s.trim()).filter(Boolean),
      achievements: form.achievements.split(",").map((s) => s.trim()).filter(Boolean),
    };

    if (user?.role === "admin" && form.userId) {
      payload.user = form.userId;
    } else {
      payload.user = user._id; 
    }

    try {
      if (editingId) {
        await API.put(`/performance/${editingId}`, payload);
      } else {
        await API.post("/performance", payload);
      }
      setForm(initial);
      setEditingId(null);
      await load();
    } catch (err) {
      console.error(err);
      alert("Save failed");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this record?")) return;
    try {
      await API.delete(`/performance/${id}`);
      await load();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  return (
    <div className="performance-page">
      <div className="home-header">
        <h2 style={{ textDecoration: "underline" }}>Employee Performance</h2>
        <div className="small muted">
          {user?.role === "admin" ? "Admin view of all employees" : "Your performance overview"}
        </div>
      </div>

      {/* Performance Table */}
      <div className="table-container">
        {loading ? (
          <p className="muted">Loading...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Employee Name</th>
                <th>Skills</th>
                <th>Projects</th>
                <th>Achievements</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="muted">No records</td>
                </tr>
              ) : (
                items.map((p) => (
                  <tr key={p._id}>
                    <td>{p.user?.name || "N/A"}</td>
                    <td>{(p.skills || []).join(", ")}</td>
                    <td>{(p.projects || []).join(", ")}</td>
                    <td>{(p.achievements || []).join(", ")}</td>
                    <td>
                      {(user?.role === "admin" || String(p.user?._id) === String(user._id)) && (
                        <button className="btn-action" onClick={() => startEdit(p)}>Edit</button>
                      )}
                      {user?.role === "admin" && (
                        <button className="btn-delete" onClick={() => remove(p._id)}>Delete</button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
      {(user?.role === "admin" || editingId) && (
        <div className="card" style={{ marginTop: 18 }}>
          <h3>{editingId ? "Edit Performance" : "Create Performance"}</h3>
          <form onSubmit={submit} className="form-grid">
            {user?.role === "admin" && (
              <select
                value={form.userId}
                onChange={(e) => setForm({ ...form, userId: e.target.value })}
                required
              >
                <option value="">Select Employee</option>
                  {employees
                  .map((emp) => (
                    <option key={emp._id} value={emp._id}>
                     {emp.name} ({emp.email}) - {emp.role}
                    </option>
                    ))}
              </select>
            )}
            <input
              placeholder="Skills (comma separated)"
              value={form.skills}
              onChange={(e) => setForm({ ...form, skills: e.target.value })}
            />
            <input
              placeholder="Projects (comma separated)"
              value={form.projects}
              onChange={(e) => setForm({ ...form, projects: e.target.value })}
            />
            <input
              placeholder="Achievements (comma separated)"
              value={form.achievements}
              onChange={(e) => setForm({ ...form, achievements: e.target.value })}
            />

            <div className="form-actions">
              {editingId && (
                <button
                  type="button"
                  className="btn-action btn-secondary"
                  onClick={cancelEdit}
                >
                  Cancel
                </button>
              )}
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