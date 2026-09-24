import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { createPickupRequest, fetchDonationPosts } from "../api/client";

const statusColors = {
  Listed: "status-pill listed",
  Requested: "status-pill requested",
  Scheduled: "status-pill scheduled",
  Collected: "status-pill collected",
};

const categoryOptions = [
  "All",
  "Clothes",
  "Books",
  "Furniture",
  "Food",
  "Electronics",
  "Medical Supplies",
  "Education",
  "Other",
];

const conditionOptions = ["All", "New", "Good", "Used"];
const statusOptions = ["All", "Listed", "Requested", "Scheduled", "Collected"];

const NgoDashboard = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [requestError, setRequestError] = useState("");
  const [requestMessage, setRequestMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [conditionFilter, setConditionFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

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

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesQuery =
        post.title.toLowerCase().includes(searchTerm.trim().toLowerCase());
      const matchesCategory =
        categoryFilter === "All" || post.category === categoryFilter;
      const matchesCondition =
        conditionFilter === "All" || post.itemCondition === conditionFilter;
      const matchesStatus = statusFilter === "All" || post.status === statusFilter;

      return matchesQuery && matchesCategory && matchesCondition && matchesStatus;
    });
  }, [posts, searchTerm, categoryFilter, conditionFilter, statusFilter]);

  const handleRequestPickup = async (itemId, message) => {
    try {
      setRequestError("");
      setSuccessMessage("");
      await createPickupRequest({ itemId, message });
      setRequestMessage("Pickup request created successfully.");
      await loadPosts();
    } catch (err) {
      setRequestError(err.message || "Unable to request this item.");
    }
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <p className="eyebrow">NGO Workspace</p>
          <h1>Donation Requests Dashboard</h1>
        </div>
      </div>

      {successMessage && <p className="form-success">{successMessage}</p>}
      {error && <p className="form-error">{error}</p>}
      {requestMessage && <p className="form-success">{requestMessage}</p>}
      {requestError && <p className="form-error">{requestError}</p>}

      <div className="dashboard-filters">
        <input
          type="text"
          placeholder="Search by title"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />

        <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
          {categoryOptions.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <select value={conditionFilter} onChange={(event) => setConditionFilter(event.target.value)}>
          {conditionOptions.map((condition) => (
            <option key={condition} value={condition}>
              {condition}
            </option>
          ))}
        </select>

        <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="route-loading">Loading donation posts...</p>
      ) : filteredPosts.length === 0 ? (
        <div className="empty-state">
          <h3>No donation posts match your filters.</h3>
          <p>Try changing your search or category settings.</p>
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
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredPosts.map((post) => (
                <tr key={post._id || post.id}>
                  <td>
                    <div className="post-title-wrap">
                      <Link to={`/items/${post._id}`} className="item-link-title">
                        {post.title}
                      </Link>
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
                  <td>
                    {post.status === "Listed" ? (
                      <RequestPickupButton
                        onSubmit={(message) => handleRequestPickup(post._id, message)}
                      />
                    ) : (
                      <span className="status-pill muted">{post.status}</span>
                    )}
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

const RequestPickupButton = ({ onSubmit }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  const submit = async () => {
    await onSubmit(message);
    setMessage("");
    setIsOpen(false);
  };

  return (
    <div className="pickup-action-wrap">
      {!isOpen ? (
        <button className="btn" onClick={() => setIsOpen(true)}>
          Request Pickup
        </button>
      ) : (
        <div className="pickup-request-box">
          <textarea
            rows="3"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Optional message to the admin"
          />
          <div className="pickup-action-row">
            <button className="btn" onClick={submit}>Send Request</button>
            <button className="btn-outline" onClick={() => setIsOpen(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NgoDashboard;
