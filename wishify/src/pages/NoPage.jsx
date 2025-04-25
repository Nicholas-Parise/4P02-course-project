import React from 'react'
import { useNavigate } from 'react-router-dom';

import "./NotFound.css";

const NoPage = () => {
  const navigate = useNavigate();


  function goHome(){
    navigate('/home');
  }

  return (
    <>
      <div className="notfound-container">
        <h1 className="notfound-status">404</h1>
        <h2 className="notfound-title">Oops! Page not found.</h2>
        <p className="notfound-text">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <button type="button" onClick={goHome} className="notfound btn">
          Go back home
        </button>
      </div>
    </>
  );
};

export default NoPage;