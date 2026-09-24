import { useEffect, useState } from "react";
import { Link } from "react-router";
import { fetchDonationPosts } from "../api/client";

const categories = [
  "All", "Clothes", "Books", "Furniture", "Food", "Electronics",
  "Medical Supplies", "Education", "Other",
];
const conditions = ["All", "New", "Good", "Used"];

const BrowseItems = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedCondition, setSelectedCondition] = useState("All");
  const [search, setSearch] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDonationPosts()
      .then((response) => setItems(response.posts || []))
      .catch((err) => setError(err.message || "Unable to load items."))
      .finally(() => setLoading(false));
  }, []);

  const visibleItems =
    items.filter((item) =>
      (selectedCategory === "All" || item.category === selectedCategory) &&
      (selectedCondition === "All" || item.itemCondition === selectedCondition) &&
      item.title.toLowerCase().includes(search.toLowerCase()),
    );

  return (
    <div className="browse-page">
      <h1>Browse Donated Items</h1>
      <p>Find useful items donated by people in your community.</p>

      <div className="filter-row">
        <label htmlFor="category">Category:</label>
        <select
          id="category"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <label htmlFor="condition">Condition:</label>
        <select id="condition" value={selectedCondition} onChange={(e) => setSelectedCondition(e.target.value)}>
          {conditions.map((condition) => <option key={condition} value={condition}>{condition}</option>)}
        </select>
        <label htmlFor="search">Search:</label>
        <input id="search" type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search titles" />
      </div>

      {loading ? <p className="route-loading">Loading items...</p> : error ? <p className="form-error">{error}</p> : visibleItems.length === 0 ? (
        <p className="no-items">No items in this category.</p>
      ) : (
        <div className="item-grid">
          {visibleItems.map((item) => (
            <div className="item-card" key={item._id}>
              {item.imageUrl && <img className="item-image" src={item.imageUrl} alt={item.title} />}
              <span className="item-badge">{item.category}</span>
              <h3>
                <Link to={`/items/${item._id}`} className="item-link-title">
                  {item.title}
                </Link>
              </h3>
              <p className="item-condition">Condition: {item.itemCondition}</p>
              <p>{item.description}</p>
              <p className="item-location">Pickup: {item.pickupLocation}</p>
              <p className="item-donor">Donated by: {item.donor?.name || "Community donor"}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BrowseItems;
