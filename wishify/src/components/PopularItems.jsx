import React from "react";
import { FaStar } from "react-icons/fa";
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import "./PopularItems.css";
import Loading from "./Loading";

const PopularItems = ({ loading, items, bgColor="#e8e8e8", title="", subtitle="", maxItems=0, tagsEnabled, wishlistCountEnabled, addButtonsEnabled, onAdd = () => {} }) => {
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
    <div className="popular-items-section" style={{ backgroundColor: bgColor }}>
      {title && <h2>{title}</h2>}
      {subtitle && <p className="section-subtitle">{subtitle}</p>}
      {loading ? (
          <Loading />
        ) :
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
                    <span>{item.uses.toLocaleString()}+</span>
                  </div>
                  : null}
              </div>
              <div className="item-details">
                <h3 className="item-name">{item.name}</h3>
                <div className="item-price-rating">
                  <span className="item-price">${item.price.toFixed(2)}</span>
                  <span className="item-rating">
                    <FaStar className="star-icon" />
                    {item.rating}
                  </span>
                </div>
              </div>
              {tagsEnabled && item.categories && item.categories.length > 0 && (
                <ul className="flex flex-wrap items-start absolute bottom-0 left-0 p-2">
                  {item.categories.map((tag, index) => (
                    <li
                      key={index}
                      className={`text-xs font-medium py-1 px-2 rounded-md mb-1 mr-1 ${
                        tag.love === null ? "bg-gray-500" : 
                        tag.love ? "bg-green-600" : "bg-red-600"
                      }`}
                      style={{
                        color: "white",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                        textTransform: "capitalize"
                      }}
                    >
                      {tag.name}
                    </li>
                  ))}
                </ul>
              )}
              {addButtonsEnabled && (
                <Fab 
                  className="-top-2 -right-2" 
                  sx={{
                    top: -2, 
                    right: -2, 
                    zIndex: 500, 
                    position: "absolute", 
                    width: "40px", 
                    height: "40px",
                    backgroundColor: "#5651e5",
                    '&:hover': {
                      backgroundColor: "#4540d4",
                    }
                  }} 
                  onClick={() => onAdd(item)} 
                  aria-label="add"
                >
                  <AddIcon sx={{ color: "white" }} />
                </Fab>
              )}            
            </div>
          ))}
      </div>}
    </div>
  );
};

export default PopularItems;