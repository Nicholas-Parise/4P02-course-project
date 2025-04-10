import React from "react";
import { FaStar } from "react-icons/fa";
import "./PopularItems.css";

const PopularItems = ({ items, title="", subtitle="", maxItems=0, tagsEnabled, wishlistCountEnabled }) => {
  // If maxItems is specified, slice the array
  const displayedItems = maxItems ? items.slice(0, maxItems) : items;

  const getColor = (love) => {
    if (love === null) {
        return "#808080"; // Default color for null
    } else if (love) {
        return "#056517"; // Green for true
    } else {
        return "#de1a24"; // Red for false
    }
  };

  return (
    <div className="popular-items-section">
      {title && <h2>{title}</h2>}
      {subtitle && <p className="section-subtitle">{subtitle}</p>}
      
      <div className="popular-items-grid">
        {displayedItems.map((item) => (
          <div key={item.id} className={`popular-item-card  ${tagsEnabled ? "min-h-[400px]" : ""}`}> {/* Make room for tags if enabled */}
            {item.sponsor ? (
                <div className="text-left pl-2 pt-1 pb-2 text-gray-600 text-sm">Sponsored</div>
            ) : <div className="text-left pl-2 pt-1 pb-2 text-gray-600 text-sm">&nbsp;</div>}
            <div className="item-image-container ">
              <img src={item.image} alt={item.name} className="item-image" />
              {wishlistCountEnabled ?
                <div className="wishlist-count">
                  <FaStar className="star-icon" />
                  <span>{item.wishlistCount.toLocaleString()}+</span>
                </div>
                : null}
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
            {tagsEnabled && item.tags && item.tags.length > 0 && (
              <ul className="flex flex-wrap items-start absolute bottom-0 left-0">
              {item.tags.map((tag, index) => (
                  <li
                      key={index}
                      className="text-white text-xs font-medium py-1 px-2 rounded-md mb-1 mr-1"
                      //style={{ backgroundColor: item.gradients[index % item.gradients.length] }}
                      style={{ backgroundColor: getColor(item.tags[index % item.tags.length].love) }}
                  >
                      {tag.name}
                  </li>
              ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularItems;