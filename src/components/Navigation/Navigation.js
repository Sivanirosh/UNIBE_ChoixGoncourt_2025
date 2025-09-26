import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';

const Navigation = ({ isAuthenticated, currentUser, onLogout }) => {
  const location = useLocation();

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-brand">
          <Link to="/">Choix Goncourt 2025</Link>
        </div>
        
        <div className="nav-links">
          <Link 
            to="/" 
            className={location.pathname === '/' ? 'active' : ''}
          >
            Livres
          </Link>
          
          <Link 
            to="/results" 
            className={location.pathname === '/results' ? 'active' : ''}
          >
            Résultats
          </Link>
          
          {!isAuthenticated ? (
            <Link 
              to="/vote" 
              className={`vote-link ${location.pathname === '/vote' ? 'active' : ''}`}
            >
              Voter
            </Link>
          ) : (
            <div className="user-info">
              <span className="current-user">👤 {currentUser}</span>
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