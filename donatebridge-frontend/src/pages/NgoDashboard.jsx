import { useEffect, useState } from "react";
import { fetchDonationPosts, seedDonationPosts } from "../api/client";

const statusColors = {
  Listed: "status-pill listed",
  Requested: "status-pill requested",
  Scheduled: "status-pill scheduled",
  Collected: "status-pill collected",
};

const NgoDashboard = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [seedMessage, setSeedMessage] = useState("");

  const loadPosts = async () => {
    try {
      setError("");
      const response = await fetchDonationPosts();
      setPosts(response.posts || []);
    } catch (err) {
      setError(err.message || "Unable to load donation posts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleSeed = async () => {
    try {
      setSeedMessage("");
      const response = await seedDonationPosts();
      setSeedMessage(response.message || "Dummy posts loaded.");
      await loadPosts();
    } catch (err) {
      setSeedMessage(err.message || "Unable to load sample posts.");
    }
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <p className="eyebrow">NGO Workspace</p>
          <h1>Donation Requests Dashboard</h1>
        </div>
        <button className="btn" onClick={handleSeed}>Refresh sample data</button>
      </div>

      {seedMessage && <p className="form-success">{seedMessage}</p>}
      {error && <p className="form-error">{error}</p>}

      {loading ? (
        <p className="route-loading">Loading donation posts...</p>
      ) : posts.length === 0 ? (
        <div className="empty-state">
          <h3>No donation posts available yet.</h3>
          <p>Use the sample seed button to populate the NGO dashboard.</p>
        </div>
      ) : (
        <div className="dashboard-table-wrap">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Donor</th>
                <th>Quantity</th>
                <th>Condition</th>
                <th>Location</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post._id || post.id}>
                  <td>
                    <div className="post-title-wrap">
                      <strong>{post.title}</strong>
                      <span>{post.description}</span>
                    </div>
                  </td>
                  <td>{post.category}</td>
                  <td>
                    <div className="donor-meta">
                      <strong>{post.donor?.name || "Unknown donor"}</strong>
                      <span>{post.donor?.email || ""}</span>
                    </div>
                  </td>
                  <td>{post.quantity}</td>
                  <td>{post.itemCondition}</td>
                  <td>{post.pickupLocation}</td>
                  <td>
                    <span className={statusColors[post.status] || "status-pill"}>
                      {post.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default NgoDashboard;
