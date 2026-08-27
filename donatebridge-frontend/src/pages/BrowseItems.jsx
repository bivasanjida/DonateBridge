import { useState } from "react";
import items from "../data/items";

const categories = ["All", "Clothes", "Books", "Furniture", "Other"];

const BrowseItems = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const visibleItems =
    selectedCategory === "All"
      ? items
      : items.filter((item) => item.category === selectedCategory);

  return (
    <div className="browse-page">
      <h1>Browse Donated Items</h1>
      <p>These items are sample data for now — no backend is connected yet.</p>

      <div className="filter-row">
        <label htmlFor="category">Filter by category:</label>
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
      </div>

      {visibleItems.length === 0 ? (
        <p className="no-items">No items in this category.</p>
      ) : (
        <div className="item-grid">
          {visibleItems.map((item) => (
            <div className="item-card" key={item.id}>
              <span className="item-badge">{item.category}</span>
              <h3>{item.title}</h3>
              <p className="item-condition">Condition: {item.condition}</p>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BrowseItems;
