import React, { useState } from 'react';
import './HelpAccordion.css'; // External stylesheet

const HelpAccordion = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="accordion-item">
      <button className="accordion" onClick={() => setIsOpen(!isOpen)}>
        {title}
      </button>
      {isOpen && (
        <div className="panel">
          {children}
        </div>
      )}
    </div>
  );
};

export default HelpAccordion;