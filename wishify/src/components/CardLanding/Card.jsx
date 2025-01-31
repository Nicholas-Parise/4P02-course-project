import React from "react";
import "../CardLanding/Card.css";

const Card = () => {
  const features = [
    {
      imgSrc: "https://via.placeholder.com/150",
      imgAlt: "Feature 1",
      title: "Feature One",
      description: "This is the first amazing feature of our application.",
    },
    {
      imgSrc: "https://via.placeholder.com/150",
      imgAlt: "Feature 2",
      title: "Feature Two",
      description: "This feature helps you save time and effort.",
    },
    {
      imgSrc: "https://via.placeholder.com/150",
      imgAlt: "Feature 3",
      title: "Feature Three",
      description: "Experience a seamless workflow with this feature.",
    },
  ];

  return (
    <div className="card-wrapper">
      {features.map((feature, index) => (
        <div key={index} className="card-container">
          <img src={feature.imgSrc} alt={feature.imgAlt} className="card-img" />
          <h2 className="card-title">{feature.title}</h2>
          <p className="card-description">{feature.description}</p>
        </div>
      ))}
    </div>
  );
};

export default Card;
