/**
 * EditItem - Form for changing or deleting a donor's listed item.
 * Part of DonateBridge - Community Item Donation & Pickup Platform
 * Loads the item by route ID and delegates ownership checks to the API.
 */
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { deleteDonationPost, fetchDonationPost, updateDonationPost } from "../api/client";
import { ItemForm } from "./CreateItem";

const categories = ["Clothes", "Books", "Furniture", "Food", "Electronics", "Medical Supplies", "Education", "Other"];

const EditItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDonationPost(id).then(({ post }) => {
      if (post.status !== "Listed") return navigate("/my-items", { replace: true });
      setForm({ title: post.title, category: post.category, itemCondition: post.itemCondition, quantity: post.quantity, pickupLocation: post.pickupLocation, description: post.description, imageUrl: post.imageUrl || "" });
    }).catch(() => navigate("/", { replace: true }));
  }, [id, navigate]);

  if (!form) return <p className="route-loading">Loading item...</p>;
  const updateField = (event) => setForm({ ...form, [event.target.name]: event.target.value });
  const handleSubmit = async (event) => {
    event.preventDefault();
    try { await updateDonationPost(id, { ...form, quantity: Number(form.quantity) }); navigate("/my-items"); } catch (err) { setError(err.message); }
  };
  const handleDelete = async () => {
    if (!window.confirm("Delete this item?")) return;
    try { await deleteDonationPost(id); navigate("/my-items"); } catch (err) { setError(err.message); }
  };

  return <div className="form-page"><div className="form-card item-form-card"><h1>Edit Item</h1>{error && <p className="form-error">{error}</p>}<ItemForm form={form} updateField={updateField} categories={categories} onSubmit={handleSubmit} submitText="Save Changes" /><button className="btn-danger" onClick={handleDelete}>Delete Item</button></div></div>;
};

export default EditItem;