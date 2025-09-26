import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';

const Navigation = ({ isAuthenticated, currentUser, onLogout }) => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest('.navigation')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navLinks = [
    { to: '/', label: 'Livres', icon: '📚' },
    { to: '/results', label: 'Résultats', icon: '📊' }
  ];

  return (
    <nav className={`navigation ${isScrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        <div className="nav-brand">
          <Link to="/">Choix Goncourt 2025 - Nirosh Sivanesan</Link>
        </div>
        
        {/* Desktop Navigation */}
        <div className="nav-links">
          {navLinks.map((link) => (
            <Link 
              key={link.to}
              to={link.to} 
              className={location.pathname === link.to ? 'active' : ''}
            >
              {link.label}
            </Link>
          ))}
          
          {!isAuthenticated ? (
            <Link 
              to="/vote" 
              className={`vote-link ${location.pathname === '/vote' ? 'active' : ''}`}
            >
              Voter
            </Link>
          ) : (
            <div className="user-info">
              <span className="current-user">{currentUser}</span>
              <button onClick={onLogout} className="logout-button">
                Déconnexion
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="mobile-menu-button"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M3 12h18M3 6h18M3 18h18"/>
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-nav-links">
          {navLinks.map((link) => (
            <Link 
              key={link.to}
              to={link.to} 
              className={location.pathname === link.to ? 'active' : ''}
            >
              <span style={{ marginRight: '0.5rem' }}>{link.icon}</span>
              {link.label}
            </Link>
          ))}
          
          {!isAuthenticated ? (
            <Link 
              to="/vote" 
              className={`vote-link ${location.pathname === '/vote' ? 'active' : ''}`}
            >
              🗳️ Voter
            </Link>
          ) : (
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '1rem', 
              marginTop: '1rem',
              padding: '1rem',
              background: 'rgba(102, 126, 234, 0.1)',
              borderRadius: '12px'
            }}>
              <span className="current-user">Connecté: {currentUser}</span>
              <button onClick={onLogout} className="logout-button">
                Déconnexion
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;