/**
 * AdminVerification - Review and manage pickup requests submitted by NGOs.
 * Part of DonateBridge - Community Item Donation & Pickup Platform
 *
 * This page lets admin users approve, reject, schedule, and confirm pickups
 * for each item request in the donation workflow.
 */
import { useEffect, useMemo, useState } from "react";
import { fetchAdminPickupRequests, approvePickupRequest, rejectPickupRequest, schedulePickup, confirmCollection } from "../api/client";

const FILTERS = ["All", "Pending", "Approved", "Scheduled", "Rejected", "Collected"];

const formatDate = (value) => {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const statusClassMap = {
  Pending: "pending",
  Approved: "approved",
  Scheduled: "scheduled",
  Rejected: "rejected",
  Collected: "collected",
};

const AdminVerification = () => {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [scheduleForm, setScheduleForm] = useState({});
  const [rejectReason, setRejectReason] = useState({});
  const [activeSchedulingId, setActiveSchedulingId] = useState(null);

  const loadRequests = async () => {
    try {
      const data = await fetchAdminPickupRequests();
      setRequests(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const visibleRequests = useMemo(() => {
    if (filter === "All") return requests;
    return requests.filter((request) => request.status === filter);
  }, [requests, filter]);

  const handleApprove = async (id) => {
    try {
      setError("");
      await approvePickupRequest(id, { adminNotes: "Approved by admin" });
      await loadRequests();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleReject = async (id) => {
    try {
      setError("");
      await rejectPickupRequest(id, { adminNotes: rejectReason[id] || "Rejected by admin" });
      setRejectReason((prev) => ({ ...prev, [id]: "" }));
      await loadRequests();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleScheduleSubmit = async (id) => {
    try {
      setError("");
      const form = scheduleForm[id] || {};
      const requestToSchedule = requests.find((r) => r._id === id);
      
      await schedulePickup(id, {
        scheduledDate: form.date,
        scheduledTime: form.time,
        collectionAddress: form.address || requestToSchedule?.item?.pickupLocation || "",
        adminNotes: form.notes,
      });
      setActiveSchedulingId(null);
      await loadRequests();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCollect = async (id) => {
    try {
      setError("");
      await confirmCollection(id);
      await loadRequests();
    } catch (err) {
      setError(err.message);
    }
  };

  const renderActions = (request) => {
    if (request.status === "Pending") {
      return (
        <div className="action-stack">
          <button className="btn btn-small" onClick={() => handleApprove(request._id)}>
            Approve
          </button>
          <div className="reject-inline">
            <input
              type="text"
              placeholder="Reason"
              value={rejectReason[request._id] || ""}
              onChange={(e) =>
                setRejectReason((prev) => ({ ...prev, [request._id]: e.target.value }))
              }
            />
            <button className="btn btn-danger btn-small" onClick={() => handleReject(request._id)}>
              Reject
            </button>
          </div>
        </div>
      );
    }

    if (request.status === "Approved") {
      return (
        <div className="action-stack">
          <button
            className="btn btn-small"
            onClick={() => setActiveSchedulingId(request._id)}
          >
            Schedule Pickup
          </button>
        </div>
      );
    }

    if (request.status === "Scheduled") {
      return (
        <button className="btn btn-small" onClick={() => handleCollect(request._id)}>
          Mark Collected
        </button>
      );
    }

    return null;
  };

  return (
    <div className="admin-dashboard">
      <h1>Pickup Verification</h1>
      <p className="admin-subtitle">Review NGO requests and manage the collection workflow.</p>

      {error && <p className="form-error">{error}</p>}

      <div className="filter-tabs">
        {FILTERS.map((option) => (
          <button
            key={option}
            className={filter === option ? "filter-tab active" : "filter-tab"}
            onClick={() => setFilter(option)}
          >
            {option}
          </button>
        ))}
      </div>

      {loading ? (
        <p>Loading requests...</p>
      ) : (
        <div className="dashboard-table-wrap">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>NGO</th>
                <th>Message</th>
                <th>Requested</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visibleRequests.length === 0 ? (
                <tr>
                  <td colSpan="6" className="empty-table">No requests found.</td>
                </tr>
              ) : (
                visibleRequests.map((request) => (
                  <tr key={request._id}>
                    <td>
                      {request.item?.title || "Unknown item"}
                      <div className="table-subtext">{request.item?.category || "—"}</div>
                    </td>
                    <td>
                      {request.ngo?.name || "Unknown NGO"}
                      <div className="table-subtext">{request.ngo?.organizationName || "—"}</div>
                    </td>
                    <td>{request.message || "—"}</td>
                    <td>{formatDate(request.createdAt)}</td>
                    <td>
                      <span className={`status-badge ${statusClassMap[request.status] || "pending"}`}>
                        {request.status}
                      </span>
                    </td>
                    <td>
                      {renderActions(request)}
                      {activeSchedulingId === request._id && (
                        <div className="schedule-box">
                          <input
                            type="date"
                            value={scheduleForm[request._id]?.date || ""}
                            onChange={(e) =>
                              setScheduleForm((prev) => ({
                                ...prev,
                                [request._id]: {
                                  ...(prev[request._id] || {}),
                                  date: e.target.value,
                                },
                              }))
                            }
                          />
                          <input
                            type="text"
                            placeholder="10:00 AM - 12:00 PM"
                            value={scheduleForm[request._id]?.time || ""}
                            onChange={(e) =>
                              setScheduleForm((prev) => ({
                                ...prev,
                                [request._id]: {
                                  ...(prev[request._id] || {}),
                                  time: e.target.value,
                                },
                              }))
                            }
                          />
                          <input
                            type="text"
                            placeholder="Collection address"
                            value={scheduleForm[request._id]?.address || request.item?.pickupLocation || ""}
                            onChange={(e) =>
                              setScheduleForm((prev) => ({
                                ...prev,
                                [request._id]: {
                                  ...(prev[request._id] || {}),
                                  address: e.target.value,
                                },
                              }))
                            }
                          />
                          <textarea
                            rows="2"
                            placeholder="Admin notes"
                            value={scheduleForm[request._id]?.notes || ""}
                            onChange={(e) =>
                              setScheduleForm((prev) => ({
                                ...prev,
                                [request._id]: {
                                  ...(prev[request._id] || {}),
                                  notes: e.target.value,
                                },
                              }))
                            }
                          />
                          <div className="schedule-actions">
                            <button className="btn btn-small" onClick={() => handleScheduleSubmit(request._id)}>
                              Save Schedule
                            </button>
                            <button className="btn btn-outline btn-small" onClick={() => setActiveSchedulingId(null)}>
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </td>
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

export default AdminVerification;
