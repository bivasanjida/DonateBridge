/**
 * ItemDetail - shows full donation item details for public browsing.
 * Part of DonateBridge - Community Item Donation & Pickup Platform
 *
 * Anyone can view an item here, while NGOs may request pickup and donors
 * may edit their own listed item if it is still available.
 */
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { createPickupRequest, fetchDonationPostById } from "../api/client";
import { useAuth } from "../context/AuthContext";
import Button from "../components/Button";

const statusColours = {
  Listed: "status-pill listed",
  Requested: "status-pill requested",
  Scheduled: "status-pill scheduled",
  Collected: "status-pill collected",
};

const ItemDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [requestError, setRequestError] = useState("");
  const [requestSuccess, setRequestSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadPost = async () => {
    try {
      setError("");
      const response = await fetchDonationPostById(id);
      setPost(response.post);
    } catch (err) {
      setError(err.message || "Unable to load this item.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPost();
  }, [id]);

  const handleRequestPickup = async () => {
    try {
      setRequestError("");
      setRequestSuccess("");
      setIsSubmitting(true);
      const response = await createPickupRequest({ itemId: post._id, message: "" });
      setRequestSuccess("Pickup request sent successfully.");
      setPost((current) => ({ ...current, status: "Requested" }));
      return response;
    } catch (err) {
      setRequestError(err.message || "We could not create this pickup request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <p className="route-loading">Loading item details...</p>;
  }

  if (error || !post) {
    return <div className="page-shell"><p className="form-error">{error || "Item not found."}</p></div>;
  }

  const canRequestPickup = user?.role === "NGO" && post.status === "Listed";
  const canEditItem =
    user?.role === "Donor" && user.id === post.donor?._id && post.status === "Listed";

  return (
    <div className="page-shell item-detail-page">
      <div className="item-detail-card">
        <div className="item-detail-image">
          {post.imageUrl ? (
            <img src={post.imageUrl} alt={post.title} />
          ) : (
            <div className="image-placeholder">No image available</div>
          )}
        </div>

        <div className="item-detail-content">
          <div className="item-detail-header">
            <div>
              <p className="eyebrow">Donated item</p>
              <h1>{post.title}</h1>
            </div>
            <span className={statusColours[post.status] || "status-pill"}>{post.status}</span>
          </div>

          <div className="item-detail-meta-row">
            <span className="item-badge">{post.category}</span>
            <span className="item-detail-condition">Condition: {post.itemCondition}</span>
          </div>

          <p className="item-detail-description">{post.description}</p>

          <div className="detail-grid">
            <div>
              <label>Quantity</label>
              <p>{post.quantity}</p>
            </div>
            <div>
              <label>Pickup location</label>
              <p>{post.pickupLocation}</p>
            </div>
            <div>
              <label>Donor</label>
              <p>{post.donor?.name || "Unknown donor"}</p>
            </div>
            <div>
              <label>Posted</label>
              <p>{new Date(post.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          {user && user.role === "Admin" && post.donor && (
            <div className="detail-grid secondary-grid">
              <div>
                <label>Email</label>
                <p>{post.donor.email}</p>
              </div>
              <div>
                <label>Phone</label>
                <p>{post.donor.phone}</p>
              </div>
            </div>
          )}

          {requestError && <p className="form-error">{requestError}</p>}
          {requestSuccess && <p className="form-success">{requestSuccess}</p>}

          <div className="item-detail-actions">
            {canRequestPickup && (
              <Button
                btnText={isSubmitting ? "Sending request..." : "Request Pickup"}
                onClick={handleRequestPickup}
                disabled={isSubmitting}
              />
            )}

            {canEditItem && (
              <Link to={`/edit-item/${post._id}`} className="btn-outline inline-link-btn">
                Edit Item
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;
