import React from 'react';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero" id="home">
      <div className="hero-background">
        <div className="hero-image" style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&h=600&fit=crop)',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundAttachment: 'fixed'
        }}></div>
        <div className="hero-overlay"></div>
      </div>
      
      <div className="container hero-content">
        <div className="hero-text animate-fade-in-up">
          <h1>Elite Luxury Experiences</h1>
          <p className="hero-subtitle">Exclusive access to the world's finest moments</p>
          <button className="cta-button">Explore Now</button>
        </div>
        
        <div className="hero-features">
          <div className="feature-card">
            <div className="feature-icon">🏁</div>
            <h3>F1 Events</h3>
            <p>VIP access to prestigious Formula 1 races</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🏎️</div>
            <h3>Hypercars</h3>
            <p>Curated collection of the world's fastest vehicles</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">✨</div>
            <h3>Luxury</h3>
            <p>Uncompromising elegance and sophistication</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
