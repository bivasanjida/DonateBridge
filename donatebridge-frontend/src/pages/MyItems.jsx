/**
 * MyItems - Donor listing history and status view.
 * Part of DonateBridge - Community Item Donation & Pickup Platform
 * Provides edit access only while a listing remains available.
 */
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { fetchMyDonationPosts } from "../api/client";

const MyItems = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => { fetchMyDonationPosts().then(({ posts: result }) => setPosts(result || [])).catch((err) => setError(err.message)); }, []);

  return <div className="browse-page"><div className="page-heading-row"><div><p className="eyebrow">Donor Workspace</p><h1>My Items</h1></div><Link className="btn" to="/create-item">List an Item</Link></div>{error && <p className="form-error">{error}</p>}{!error && posts.length === 0 ? <div className="empty-state"><h3>You haven't listed any items yet.</h3><Link to="/create-item">List your first item</Link></div> : <div className="item-grid">{posts.map((post) => <div className="item-card" key={post._id}><span className={`status-pill status-${post.status.toLowerCase()}`}>{post.status}</span><span className="item-badge">{post.category}</span><h3>{post.title}</h3><p className="item-condition">Condition: {post.itemCondition}</p><p>Pickup: {post.pickupLocation}</p>{post.status === "Listed" && <Link className="btn-outline" to={`/edit-item/${post._id}`}>Edit</Link>}</div>)}</div>}</div>;
};

export default MyItems;