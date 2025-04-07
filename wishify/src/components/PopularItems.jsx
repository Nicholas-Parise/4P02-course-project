import React from "react";
import { FaStar } from "react-icons/fa";
import "./PopularItems.css";

const PopularItems = ({ items, title, subtitle, maxItems }) => {
  // If maxItems is specified, slice the array
  const displayedItems = maxItems ? items.slice(0, maxItems) : items;

  return (
    <div className="popular-items-section">
      {title && <h2>{title}</h2>}
      {subtitle && <p className="section-subtitle">{subtitle}</p>}
      
      <div className="popular-items-grid">
        {displayedItems.map((item) => (
          <div key={item.id} className="popular-item-card">
            <div className="item-image-container">
              <img src={item.image} alt={item.name} className="item-image" />
              <div className="wishlist-count">
                <FaStar className="star-icon" />
                <span>{item.wishlistCount.toLocaleString()}+</span>
              </div>
            </div>
            <div className="item-details">
              <h3 className="item-name">{item.name}</h3>
              <div className="item-price-rating">
                <span className="item-price">{item.price}</span>
                <span className="item-rating">
                  <FaStar className="star-icon" />
                  {item.rating}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularItems;