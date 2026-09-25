/**
 * AdminUsers - Lists all platform users for admin review.
 * Part of DonateBridge - Community Item Donation & Pickup Platform
 *
 * This view is read-only and offers role filtering and quick search across the
 * platform user directory.
 */
import { useEffect, useMemo, useState } from "react";
import { fetchAllUsers } from "../api/client";

const formatDate = (value) => {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const roleBadgeMap = {
  Donor: "role-badge donor",
  NGO: "role-badge ngo",
  Admin: "role-badge admin",
};

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await fetchAllUsers();
        setUsers(data.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const trimmed = search.trim().toLowerCase();
    return users.filter((user) => {
      const matchesRole = roleFilter === "All" || user.role === roleFilter;
      if (!matchesRole) return false;
      if (!trimmed) return true;
      const searchable = `${user.name} ${user.email}`.toLowerCase();
      return searchable.includes(trimmed);
    });
  }, [users, roleFilter, search]);

  return (
    <div className="admin-dashboard">
      <h1>User Management</h1>
      <p className="admin-subtitle">View the registered community users on the platform.</p>

      {error && <p className="form-error">{error}</p>}

      <div className="history-toolbar">
        <input
          type="search"
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
          <option value="All">All</option>
          <option value="Donor">Donor</option>
          <option value="NGO">NGO</option>
          <option value="Admin">Admin</option>
        </select>
      </div>

      {loading ? (
        <p>Loading users...</p>
      ) : (
        <div className="dashboard-table-wrap">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Organization</th>
                <th>Registered</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="empty-table">No users found.</td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td>
                      <span className={roleBadgeMap[user.role] || "role-badge donor"}>{user.role}</span>
                    </td>
                    <td>{user.organizationName || "—"}</td>
                    <td>{formatDate(user.createdAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
