import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const LandingPage: React.FC = () => {
  return (
    <div className="landing-page">
      
      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome to EventTick</h1>
          <p className="hero-subtitle">Your one-stop solution for event ticketing</p>
          <div className="cta-buttons">
            <Link to="/signup" className="cta-button primary">Get Started</Link>
            <Link to="/login" className="cta-button secondary">Login</Link>
          </div>
        </div>
      </section>

      
      <section className="features-section">
        <h2>Why Choose EventTick?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <i className="feature-icon">🎫</i>
            <h3>Easy Ticketing</h3>
            <p>Simple and secure ticket purchasing process</p>
          </div>
          <div className="feature-card">
            <i className="feature-icon">🔒</i>
            <h3>Secure Transactions</h3>
            <p>Your security is our top priority</p>
          </div>
          <div className="feature-card">
            <i className="feature-icon">📱</i>
            <h3>Mobile Friendly</h3>
            <p>Access your tickets anywhere, anytime</p>
          </div>
        </div>
      </section>

     
      <section className="cta-section">
        <h2>Ready to Get Started?</h2>
        <p>Join thousands of event organizers and attendees</p>
        <Link to="/signup" className="cta-button primary">Create Account</Link>
      </section>
    </div>
  );
};

export default LandingPage; 