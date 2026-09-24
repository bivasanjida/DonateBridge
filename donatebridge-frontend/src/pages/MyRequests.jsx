/**
 * MyRequests - displays pickup requests made by the current NGO.
 * Part of DonateBridge - Community Item Donation & Pickup Platform
 *
 * NGOs can review the items they requested, see admin decisions, and
 * cancel any pending request before collection is scheduled.
 */
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { cancelPickupRequest, fetchMyPickupRequests } from "../api/client";

const requestStatusStyles = {
  Pending: "status-pill pending",
  Approved: "status-pill approved",
  Rejected: "status-pill rejected",
  Scheduled: "status-pill scheduled",
  Collected: "status-pill collected",
};

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const loadRequests = async () => {
    try {
      setError("");
      const response = await fetchMyPickupRequests();
      setRequests(response.requests || []);
    } catch (err) {
      setError(err.message || "Unable to load your requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleCancel = async (requestId) => {
    try {
      setSuccessMessage("");
      await cancelPickupRequest(requestId);
      setSuccessMessage("Pickup request cancelled successfully.");
      await loadRequests();
    } catch (err) {
      setError(err.message || "Could not cancel this request.");
    }
  };

  return (
    <div className="page-shell my-requests-page">
      <div className="section-header-row">
        <div>
          <p className="eyebrow">NGO Activity</p>
          <h1>My Pickup Requests</h1>
        </div>
        <Link to="/ngo-dashboard" className="btn-outline inline-link-btn">
          Browse items
        </Link>
      </div>

      {successMessage && <p className="form-success">{successMessage}</p>}
      {error && <p className="form-error">{error}</p>}

      {loading ? (
        <p className="route-loading">Loading your pickup requests...</p>
      ) : requests.length === 0 ? (
        <div className="empty-state">
          <h3>You haven't made any pickup requests yet.</h3>
          <p>Browse items to find donations you need.</p>
        </div>
      ) : (
        <div className="request-card-grid">
          {requests.map((request) => (
            <div className="request-card" key={request._id}>
              <div className="request-card-header">
                <div>
                  <p className="request-label">Request</p>
                  <h3>{request.item?.title || "Donation item"}</h3>
                </div>
                <span className={requestStatusStyles[request.status] || "status-pill"}>
                  {request.status}
                </span>
              </div>

              <div className="request-meta">
                <p>
                  <strong>Category:</strong> {request.item?.category || "Unknown"}
                </p>
                <p>
                  <strong>Pickup location:</strong> {request.item?.pickupLocation || "Not available"}
                </p>
              </div>

              {request.message && (
                <div className="request-note">
                  <strong>NGO message:</strong>
                  <p>{request.message}</p>
                </div>
              )}

              {request.scheduledDate && (
                <div className="request-note">
                  <strong>Scheduled:</strong>
                  <p>
                    {new Date(request.scheduledDate).toLocaleDateString()} {request.scheduledTime || ""}
                  </p>
                </div>
              )}

              {request.collectionAddress && (
                <div className="request-note">
                  <strong>Collection address:</strong>
                  <p>{request.collectionAddress}</p>
                </div>
              )}

              {request.adminNotes && (
                <div className="request-note">
                  <strong>Admin notes:</strong>
                  <p>{request.adminNotes}</p>
                </div>
              )}

              {request.status === "Pending" && (
                <button className="btn btn-danger" onClick={() => handleCancel(request._id)}>
                  Cancel Request
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyRequests;
