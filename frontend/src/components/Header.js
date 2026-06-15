import React, { useState } from 'react';
import './Header.css';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="container flex-between">
        <div className="logo">
          <h1 className="text-gold">PHANTOM</h1>
          <p className="text-sm">Luxury Experiences</p>
        </div>
        
        <nav className={`nav ${mobileMenuOpen ? 'open' : ''}`}>
          <a href="#home">Home</a>
          <a href="#services">Services</a>
          <a href="#portfolio">Portfolio</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>

        <button 
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
};

export default Header;
