import React, { useState } from 'react';
import { FaStar, FaCheck, FaArrowRight, FaCopy, FaAward, FaInfinity, FaCreditCard, FaTimes } from 'react-icons/fa';
import { CheckoutProvider } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import '../Landing.css';

const UpgradePage = () => {

  // this is the public key, so it doesn't have to be in the .env file
  const stripePromise = loadStripe('pk_test_51RDYNcRAn3aH2VOgUOLi7IWb1xIGEC4ab6dMBztTnka81mO0k7wpUct6qbcLpIJ4yCMqGabdnvP2XVE6k3NmPa6600DpD8aTgu');
  const [token] = useState(localStorage.getItem('token') || '');

  const [activeFaqIndex, setActiveFaqIndex] = useState(null);
 
  const handleSubscribe = async () => {
    //console.log(token);
    const res = await fetch('https://api.wishify.ca/payments/create-subscription-session', {
      method: 'POST',
      headers: {
        'Authorization': "Bearer "+token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ priceId: 'price_1RDYS9RAn3aH2VOg7t2vQ7N5' }) // actual Stripe Price ID
    });
  
    const data = await res.json();
  
    const stripe = await stripePromise;
    //stripe.redirectToCheckout({ url: data.url });
    stripe.redirectToCheckout({ sessionId: data.sessionId });
  };


  const toggleFAQ = (index) => {
    setActiveFaqIndex(activeFaqIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "How does billing work?",
      answer: "You'll be charged immediately when you upgrade, and then monthly on the same date. You can cancel anytime."
    },
    {
      question: "Can I switch between monthly and yearly?",
      answer: "Yes! You can change your subscription plan at any time from your account settings."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards through Stripe's secure payment system."
    },
    {
      question: "Is there a free trial for Pro?",
      answer: "We don't currently offer a free trial, but we have a 30-day money-back guarantee if you're not satisfied."
    }
  ];

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <div className="hero" style={{ minHeight: '60vh' }}>
        <div className="hero-content">
          <div className="hero-text" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <h1>Unlock Wishify Pro</h1>
            <p className="hero-tagline">
              Elevate your wishlist experience with premium features designed to make gift-giving even more magical.
            </p>

            <div className="feature-highlight" style={{ maxWidth: '600px', margin: '2rem auto' }}>
              <div className="highlight-badge">Premium Features</div>
              <h2>Get More With Pro</h2>
              <p>Unlimited wishlists, priority support, and an exclusive Pro badge to showcase your status.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="pricing-section">
        <h2 className="pricing-title">Simple, Transparent Pricing</h2>
        <p className="pricing-subtitle">Choose the plan that's right for you</p>

        <div className="pricing-container">
          {/* Free Plan Card */}
          <div className="pricing-card">
            <h3 className="plan-name">Free</h3>
            <div className="plan-price">
              <span className="price">$0</span>
              <span className="period">/forever</span>
            </div>
            <ul className="plan-features">
              <li className="feature-item">
                <span className="feature-icon"><FaCheck /></span>
                Create up to 3 wishlists
              </li>
              <li className="feature-item">
                <span className="feature-icon"><FaCheck /></span>
                Basic collaboration
              </li>
              <li className="feature-item">
                <span className="feature-icon"><FaCheck /></span>
                Email support
              </li>
              <li className="feature-item" style={{ opacity: 0.5 }}>
                <span className="feature-icon">✗</span>
                <span style={{ textDecoration: 'line-through' }}>Pro badge</span>
              </li>
            </ul>
            <a href='/wishlists'>
              <button className="plan-button">
                Continue with your Current Plan
              </button>
            </a>
          </div>

          {/* Pro Plan Card - Featured */}
          <div className="pricing-card featured">
            <div className="popular-badge">Most Popular</div>
            <h3 className="plan-name">Pro</h3>
            <div className="plan-price">
              <span className="price">$1.99</span>
              <span className="period">/month</span>
            </div>
            <ul className="plan-features">
              <li className="feature-item">
                <span className="feature-icon"><FaCheck /></span>
                Unlimited wishlists
              </li>
              <li className="feature-item">
                <span className="feature-icon"><FaCheck /></span>
                Exclusive Pro badge
              </li>
              <li className="feature-item">
                <span className="feature-icon"><FaCheck /></span>
                Priority support
              </li>
              <li className="feature-item">
                <span className="feature-icon"><FaCheck /></span>
                Early access to new features
              </li>
            </ul>
            <button
              className="plan-button featured-button"
              onClick={() => handleSubscribe()}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <span>Upgrade to Pro</span>
              <FaArrowRight style={{ marginLeft: '8px' }} />
            </button>
          </div>
        </div>
      </div>

      {/* Pro Features Grid */}
      <div className="features-section">
        <h2>Pro Features You'll Love</h2>
        <div className="card-wrapper">
          {/* Feature 1 - Unlimited Wishlists */}
          <div className="card-container">
            <div style={{
              width: '60px',
              height: '60px',
              background: 'linear-gradient(135deg,rgb(255, 40, 40) 0%,rgb(255, 141, 141) 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem'
            }}>
              <FaInfinity size={30} color="#fff" />
            </div>
            <h2 className="card-title">Unlimited Wishlists</h2>
            <p className="card-description">
              Create as many wishlists as you need for every occasion - birthdays, holidays, weddings, and more.
            </p>
          </div>

          {/* Feature 2 - Duplicate Wishlists*/}
          <div className="card-container">
            <div style={{
              width: '60px',
              height: '60px',
              background: 'linear-gradient(135deg, #5651e5 0%,rgb(136, 132, 255) 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem'
            }}>
              <FaCopy size={30} color="#fff" />
            </div>
            <h2 className="card-title">Duplicate Wishlists</h2>
            <p className="card-description">
              Able to duplicate wishlists to save time and effort when creating similar lists for different occasions with just a simple click.
            </p>
          </div>

          {/* Feature 3 - Pro Badge */}
          <div className="card-container">
            <div style={{
              width: '60px',
              height: '60px',
              background: 'linear-gradient(135deg, #ffd700 0%,rgb(250, 220, 98) 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem'
            }}>
              <FaStar size={30} color="#fff" />
            </div>
            <h2 className="card-title">Exclusive Pro Badge</h2>
            <p className="card-description">
              Stand out with a special badge that shows you're a premium member of the Wishify community.
            </p>
          </div>

          {/* Feature 4 - Priority Support */}
          <div className="card-container">
            <div style={{
              width: '60px',
              height: '60px',
              background: 'linear-gradient(135deg, #2ecc71 0%,rgb(94, 255, 161) 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem'
            }}>
              <FaAward size={30} color="#fff" />
            </div>
            <h2 className="card-title">Priority Support</h2>
            <p className="card-description">
              Get faster responses and dedicated help from our support team whenever you need assistance.
            </p>
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="pricing-section" style={{ paddingBottom: '6rem' }}>
        <h2 className="pricing-title">Ready to Upgrade?</h2>
        <p className="pricing-subtitle">Join thousands of happy Pro users today</p>

        <div style={{
          maxWidth: '400px',
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <button
            className="plan-button featured-button"
            onClick={() => handleSubscribe()}
            style={{
              padding: '1rem 2rem',
              fontSize: '1.2rem',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <span>Get Wishify Pro Now</span>
            <FaArrowRight style={{ marginLeft: '8px' }} />
          </button>
          <p style={{ marginTop: '1rem', color: '#666' }}>
            Only $1.99/month or $9.99/year
          </p>
        </div>
      </div>

     
    </div>
  );
};

export default UpgradePage;