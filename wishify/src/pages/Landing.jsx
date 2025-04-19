import React, { useState, useEffect } from "react";
import { FaGithub, FaGoogleDrive, FaArrowDown, FaStar } from "react-icons/fa";
import { SiJira } from "react-icons/si";
import "../Landing.css";
import PopularItems from "../components/PopularItems.jsx";

const Landing = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [currentFeature, setCurrentFeature] = useState(0);
  const [popularItems, setPopularItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  useEffect(() => {
    const fetchPopularItems = async () => {
      const trendingUrl = "https://api.wishify.ca/ideas/trending";
      
      try {
        const response = await fetch(trendingUrl, {
          method: 'get',
          headers: new Headers({
            'Authorization': "Bearer " + token,
          }),
        });
        
        const trendingData = await response.json();
        setPopularItems((trendingData.trending || []).slice(0, 4));
        console.log("Trending:", trendingData.trending);
      } catch (error) {
        console.error("Error fetching trending items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularItems();
  }, [token]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % herohighlights.length);
    }, 6000);
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

  const herohighlights = [
    {
      title: "Create Wishlists",
      description: "Easily create and manage wishlists for any occasion, from birthdays to weddings.",
      highlight: "Real-time collaboration"
    },
    {
      title: "Create Events",
      description: "Organize events and link wishlists to them, making gift-giving for birthdays, weddings, or holidays effortless.",
      highlight: "Seamless event planning"
    },
    {
      title: "Collaboration",
      description: "Invite friends and family to contribute to your wishlist, making it a collaborative experience.",
      highlight: "Teamwork made easy"
    },
    {
      title: "ALL-IN-ONE APPLICATION",
      description: "Get all these features in one application, making it the ultimate gift-giving tool.",
      highlight: "All-in-one solution"
    },
  ];

  const faqs = [
    {
      question: "I want to create a wishlist, how do I do that for my son christmas?",
      answer: "Click on Create New Wishlist and then click on 'On behalf of' to create a wishlist for your son. You can then add items and share the wishlist with family and friends."
    },
    {
      question: "How can I add my dad into my wishlist?",
      answer: "Go to the wishlist settings and click on 'Add Collaborator'. Enter your dad's email address, and he will receive an invitation to join your wishlist."
    },
    {
      question: "How do I delete a wishlist?",
      answer: "Go to your wishlist page and click on 'Edit Wishlist' and within the edit wishlist dialog box you have an option to delete the page and carefully following the instructions given. Please note this action cannot be undone."
    },
    {
      question: "How to share my wishlist with my friends?",
      answer: "You can share your wishlist by clicking on the 'Share' button on the wishlist page. You can copy the link or send it directly via email or social media."
    },
    {
      question: "Is there a mobile app available?",
      answer: "Currently we only have a web application, but a mobile app is in development and will be released soon."
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
      price: "$1.99",
      period: "per month",
      features: [
        "Unlimited wishlists",
        "Exclusive Pro Badge",
        "Priority Support",
        "Early access to new features"
      ],
      cta: "Upgrade Now",
      featured: true
    }
  ];

  return (
    <div className="landing-page">
      <div className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Wishify</h1>
            <p className="hero-tagline">The ultimate collaborative wishlist platform that makes gift-giving effortless. Create, share, and manage wishlists for any occasion while keeping surprises intact with our unique blind contribution feature. Perfect for holidays, birthdays, weddings, and more.</p>
            
            <div className="feature-highlight">
              <div className="highlight-badge">{herohighlights[currentFeature].highlight}</div>
              <h2>{herohighlights[currentFeature].title}</h2>
              <p>{herohighlights[currentFeature].description}</p>
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

      {(!loading || popularItems.length > 0) && (
        <PopularItems 
          loading={loading}
          items={popularItems} 
          title="Most Wishlisted Items" 
          subtitle="Discover what people are loving right now"
          wishlistCountEnabled={true}
          addButtonsEnabled={false}
        />
      )}

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
              <a href={plan.featured ? "/upgrade-redirect" : "/Register"}>
                <button className={`plan-button ${plan.featured ? 'featured-button' : ''}`}>
                  {plan.cta}
                </button>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Landing;