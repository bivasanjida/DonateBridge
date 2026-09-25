/**
 * AdminDashboard - Shows summary metrics for the admin overview screen.
 * Part of DonateBridge - Community Item Donation & Pickup Platform
 *
 * This page displays item counts, request counts, and recent pending actions
 * that help administrators review the health of the donation workflow.
 */
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { fetchAdminStats } from "../api/client";

const formatDate = (dateValue) => {
  if (!dateValue) return "—";
  return new Date(dateValue).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalItems: 0,
    listedItems: 0,
    pendingRequests: 0,
    scheduledPickups: 0,
    completedDonations: 0,
    totalUsers: 0,
  });
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await fetchAdminStats();
        setStats(data.stats);
        setRecentRequests(data.recentRequests || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const statCards = [
    { label: "Total Items", value: stats.totalItems },
    { label: "Listed Items", value: stats.listedItems },
    { label: "Pending Requests", value: stats.pendingRequests },
    { label: "Scheduled Pickups", value: stats.scheduledPickups },
    { label: "Completed Donations", value: stats.completedDonations },
    { label: "Total Users", value: stats.totalUsers },
  ];

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <p className="admin-subtitle">Track donations, approvals and platform activity.</p>

      {error && <p className="form-error">{error}</p>}

      {loading ? (
        <p>Loading dashboard...</p>
      ) : (
        <>
          <div className="stats-grid">
            {statCards.map((card) => (
              <div key={card.label} className="stat-card">
                <span className="stat-number">{card.value}</span>
                <span className="stat-label">{card.label}</span>
              </div>
            ))}
          </div>

          <section className="dashboard-section">
            <div className="section-header">
              <h2>Recent Pickup Requests</h2>
            </div>

            {recentRequests.length === 0 ? (
              <p className="empty-state">No pending requests right now.</p>
            ) : (
              <div className="dashboard-table-wrap">
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>NGO</th>
                      <th>Requested</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentRequests.map((request) => (
                      <tr key={request._id}>
                        <td>{request.itemTitle}</td>
                        <td>
                          {request.ngoName}
                          <div className="table-subtext">Pending review</div>
                        </td>
                        <td>{formatDate(request.createdAt)}</td>
                        <td>
                          <Link to="/admin/verification" className="table-link">
                            Review
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
