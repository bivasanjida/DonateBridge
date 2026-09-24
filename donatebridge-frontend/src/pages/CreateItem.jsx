/**
 * CreateItem - Form for listing a new donation.
 * Part of DonateBridge - Community Item Donation & Pickup Platform
 * Sends donor-provided item details to the donation posts API.
 */
import { useState } from "react";
import { useNavigate } from "react-router";
import Button from "../components/Button";
import { createDonationPost } from "../api/client";

const categories = ["Clothes", "Books", "Furniture", "Food", "Electronics", "Medical Supplies", "Education", "Other"];

const CreateItem = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", category: "Clothes", itemCondition: "Good", quantity: 1, pickupLocation: "", description: "", imageUrl: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (event) => setForm({ ...form, [event.target.name]: event.target.value });
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await createDonationPost({ ...form, quantity: Number(form.quantity) });
      navigate("/my-items");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return <div className="form-page"><div className="form-card item-form-card"><h1>List an Item</h1>{error && <p className="form-error">{error}</p>}<ItemForm form={form} updateField={updateField} categories={categories} onSubmit={handleSubmit} submitText={isSubmitting ? "Listing..." : "List Item"} disabled={isSubmitting} /></div></div>;
};

export const ItemForm = ({ form, updateField, categories, onSubmit, submitText, disabled }) => <form onSubmit={onSubmit}>
  <div className="form-group"><label htmlFor="title">Title</label><input id="title" name="title" value={form.title} onChange={updateField} required /></div>
  <div className="form-group"><label htmlFor="category">Category</label><select id="category" name="category" value={form.category} onChange={updateField}>{categories.map((category) => <option key={category}>{category}</option>)}</select></div>
  <div className="form-group"><label htmlFor="itemCondition">Item Condition</label><select id="itemCondition" name="itemCondition" value={form.itemCondition} onChange={updateField}><option>New</option><option>Good</option><option>Used</option></select></div>
  <div className="form-group"><label htmlFor="quantity">Quantity</label><input id="quantity" name="quantity" type="number" min="1" value={form.quantity} onChange={updateField} required /></div>
  <div className="form-group"><label htmlFor="pickupLocation">Pickup Location</label><input id="pickupLocation" name="pickupLocation" value={form.pickupLocation} onChange={updateField} required /></div>
  <div className="form-group"><label htmlFor="description">Description</label><textarea id="description" name="description" value={form.description} onChange={updateField} required rows="4" /></div>
  <div className="form-group"><label htmlFor="imageUrl">Image URL</label><input id="imageUrl" name="imageUrl" value={form.imageUrl} onChange={updateField} placeholder="Paste an image link (optional)" /></div>
  <Button btnText={submitText} type="submit" disabled={disabled} />
</form>;

export default CreateItem;