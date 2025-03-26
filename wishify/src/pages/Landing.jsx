import React, { useState, useEffect } from "react";
import { FaGithub, FaGoogleDrive, FaArrowDown } from "react-icons/fa";
import { SiJira } from "react-icons/si";
import "../Landing.css";

const Landing = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [currentFeature, setCurrentFeature] = useState(0);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  // Auto-rotate features in hero section
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      imgSrc: "/assets/Collaborations.jpg",
      imgAlt: "Collaborative Wishlists",
      title: "Collaborative Wishlists",
      description: "Create and manage wishlists with friends and family. Everyone can contribute, view, and track items in real-time.",
      highlight: "Real-time collaboration"
    },
    {
      imgSrc: "/assets/Blinds.jpg",
      imgAlt: "Blind Contributions",
      title: "Blind Contributions",
      description: "Enable blind mode to hide contributor identities for surprise gifts while still seeing what's been purchased.",
      highlight: "Perfect for secret gifts"
    },
    {
      imgSrc: "/assets/Event.jpg",
      imgAlt: "Event Linking",
      title: "Event Linking",
      description: "Create special events and link wishlists to them, making gift-giving for birthdays, weddings, or holidays effortless.",
      highlight: "Seamless event planning"
    },
    {
      imgSrc: "/assets/Sharing.jpg",
      imgAlt: "Instant Sharing",
      title: "One-Click Sharing",
      description: "Share wishlists via link—recipients automatically join as members with appropriate permissions.",
      highlight: "Easy sharing"
    },
  ];

  const faqs = [
    {
      question: "How do I create a wishlist?",
      answer: "Click on the 'Create New Wishlist' button and fill in the required details. You can then add items to your wishlist."
    },
    {
      question: "Can I collaborate with others on a wishlist?",
      answer: "Yes! You can invite friends or family members to collaborate on your wishlist by sharing a link or sending an invitation."
    },
    {
      question: "Is there a mobile app available?",
      answer: "Currently we only have a web application, but a mobile app is in development and will be released soon."
    },
    {
      question: "How do I delete a wishlist?",
      answer: "Go to your wishlist settings and click on 'Delete Wishlist'. Please note this action cannot be undone."
    }
  ];

  const pricingPlans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      features: [
        "Create up to 3 wishlists",
        "Add unlimited items",
        "Basic collaboration",
        "Email support"
      ],
      cta: "Get Started",
      featured: false
    },
    {
      name: "Pro",
      price: "$9.99",
      period: "per month",
      features: [
        "Unlimited wishlists",
        "Priority support",
        "Advanced collaboration tools",
        "Custom themes",
        "Analytics dashboard",
        "Early access to new features"
      ],
      cta: "Upgrade Now",
      featured: true
    }
  ];

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <div className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Wishify</h1>
            <p className="hero-tagline">The ultimate collaborative wishlist platform that makes gift-giving effortless. Create, share, and manage wishlists for any occasion while keeping surprises intact with our unique blind contribution feature. Perfect for holidays, birthdays, weddings, and more.</p>
            
            <div className="feature-highlight">
              <div className="highlight-badge">{features[currentFeature].highlight}</div>
              <h2>{features[currentFeature].title}</h2>
              <p>{features[currentFeature].description}</p>
            </div>
            
            <div className="cta-buttons">
              <a href ="/Register"><button className="primary-cta">Get Started</button></a>
              <a href ="/Login"><button className="secondary-cta">Login</button></a>
            </div>
          </div>
          
          <div className="hero-image">
            <img src="/assets/Wishify-Interface.png" alt="Wishify app interface" />
          </div>
        </div>
        
        <div className="scroll-indicator">
          <FaArrowDown className="bounce" />
        </div>
      </div>

      {/* Features Section */}
      <div className="features-section">
        <h2>Powerful Features for Every Occasion</h2>
        <div className="card-wrapper">
          {features.map((feature, index) => (
            <div key={index} className="card-container">
              <img src={feature.imgSrc} alt={feature.imgAlt} className="card-img" />
              <h2 className="card-title">{feature.title}</h2>
              <p className="card-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Use Cases Section */}
      <div className="use-cases">
        <h2>Perfect For Any Occasion</h2>
        <div className="case-studies">
          <div className="case-study">
            <h3>Wedding Registries</h3>
            <p>Manage your gift registry with multiple contributors while keeping some surprises intact.</p>
          </div>
          <div className="case-study">
            <h3>Secret Santa</h3>
            <p>Organize gift exchanges with our special Blind Mode to maintain the surprise.</p>
          </div>
          <div className="case-study">
            <h3>Group Events</h3>
            <p>Coordinate supplies for camping trips, parties, or office events with ease.</p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="faq-section">
        <h2 className="faq-title">Frequently Asked Questions</h2>
        <div className="faq-container">
          {faqs.map((faq, index) => (
            <div key={index} className="faq-item">
              <div 
                className="faq-question" 
                onClick={() => toggleFAQ(index)}
              >
                <h3>{faq.question}</h3>
                <span className="faq-toggle">
                  {activeIndex === index ? '−' : '+'}
                </span>
              </div>
              <div 
                className={`faq-answer ${activeIndex === index ? 'active' : ''}`}
              >
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing Section */}
      <div className="pricing-section">
        <h2 className="pricing-title">Simple, Transparent Pricing</h2>
        <p className="pricing-subtitle">Choose the plan that's right for you</p>
        
        <div className="pricing-container">
          {pricingPlans.map((plan, index) => (
            <div 
              key={index} 
              className={`pricing-card ${plan.featured ? 'featured' : ''}`}
            >
              {plan.featured && <div className="popular-badge">Most Popular</div>}
              <h3 className="plan-name">{plan.name}</h3>
              <div className="plan-price">
                <span className="price">{plan.price}</span>
                <span className="period">/{plan.period}</span>
              </div>
              <ul className="plan-features">
                {plan.features.map((feature, i) => (
                  <li key={i} className="feature-item">
                    <span className="feature-icon">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <a href={plan.featured ? "/Login" : "/Register"}>
                <button className={`plan-button ${plan.featured ? 'featured-button' : ''}`}>
                  {plan.cta}
                </button>
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Section */}
      <div className="footer">
        <div className="social">
          <a href="https://github.com/Nicholas-Parise/4P02-course-project" target="_blank" rel="noopener noreferrer">
            <FaGithub className="icon" />
          </a>
          <a href="https://nicholasparise.atlassian.net/jira/software/projects/COSC/summary" target="_blank" rel="noopener noreferrer">
            <SiJira className="icon" />
          </a>
          <a href="https://drive.google.com/drive/folders/1H5uFw_031SYkvf21KdLdkOzGt67i78vZ" target="_blank" rel="noopener noreferrer">
            <FaGoogleDrive className="icon" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Landing;