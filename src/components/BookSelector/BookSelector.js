import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './BookSelector.css';

const BookSelector = ({ books }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [imageErrors, setImageErrors] = useState(new Set());

  // Auto-play slider
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % books.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [books.length, isAutoPlaying]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % books.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + books.length) % books.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  const handleImageError = (bookId) => {
    setImageErrors(prev => new Set([...prev, bookId]));
  };

  const ImageWithFallback = ({ book, className, alt }) => {
    const hasError = imageErrors.has(book.id);
    
    if (hasError) {
      return (
        <div className={`${className} image-placeholder`}>
          <div className="placeholder-content">
            <div className="placeholder-icon">📚</div>
            <div className="placeholder-text">Image non disponible</div>
          </div>
        </div>
      );
    }

    return (
      <img 
        src={book.cover} 
        alt={alt}
        className={className}
        onError={() => handleImageError(book.id)}
      />
    );
  };

  return (
    <div className="book-selector">
      {/* Hero Section */}
      <div className="hero-section gradient-bg">
        <div className="hero-content">
          <h1 className="hero-title">Sélection Goncourt 2025 - UniBe</h1>
          <p className="hero-subtitle">
            Découvrez et évaluez les œuvres littéraires en compétition.<br />
            Plateforme prévue pour le jury du Choix Goncourt 2025 UniBe.
          </p>
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">{books.length}</span>
              <span className="stat-label">Livres</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">15</span>
              <span className="stat-label">Jurés</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">2025</span>
              <span className="stat-label">Prix Goncourt</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Book Slider */}
      <div className="book-slider-container">
        <div className="slider-header">
          <h2>Explorez les œuvres</h2>
          <p>Cliquez sur un livre pour commencer votre évaluation</p>
        </div>

        <div 
          className="book-slider"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Navigation Arrows */}
          <button className="slider-nav prev" onClick={prevSlide}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="m15 18-6-6 6-6"/>
            </svg>
          </button>
          
          <button className="slider-nav next" onClick={nextSlide}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </button>

          {/* Slides Container */}
          <div className="slides-container">
            <div 
              className="slides-track"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {books.map((book, index) => (
                <div key={book.id} className="slide">
                  <div className="book-showcase">
                    <div className="book-cover-container">
                      <div className="book-cover-wrapper">
                        <ImageWithFallback 
                          book={book}
                          className="book-cover-image"
                          alt={`Couverture de ${book.title}`}
                        />
                        <div className="book-overlay">
                          <Link 
                            to={`/evaluate/${book.id}`} 
                            className="evaluate-btn"
                          >
                            Évaluer ce livre
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <path d="m9 18 6-6-6-6"/>
                            </svg>
                          </Link>
                        </div>
                      </div>
                    </div>
                    
                    <div className="book-details">
                      <h3 className="book-title">{book.title}</h3>
                      {book.author && (
                        <p className="book-author">par {book.author}</p>
                      )}
                      <p className="book-description">
                        Séléction Prix Goncourt 2025
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Slider Indicators */}
          <div className="slider-indicators">
            {books.map((_, index) => (
              <button
                key={index}
                className={`indicator ${index === currentSlide ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        </div>

        {/* All Books Grid */}
        <div className="books-grid-section">
          <div className="section-header">
            <h3>Tous les livres</h3>
            <p>Vue d'ensemble de la sélection</p>
          </div>
          
          <div className="books-grid">
            {books.map((book, index) => (
              <div 
                key={book.id} 
                className="book-card glass-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="card-cover">
                  <ImageWithFallback 
                    book={book}
                    className="card-cover-image"
                    alt={`Couverture de ${book.title}`}
                  />
                </div>
                
                <div className="card-content">
                  <h4 className="card-title">{book.title}</h4>
                  {book.author && (
                    <p className="card-author">{book.author}</p>
                  )}
                  <Link 
                    to={`/evaluate/${book.id}`} 
                    className="card-button btn-primary"
                  >
                    Évaluer
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Section */}
      <div className="action-section">
        <div className="action-content glass-card">
          <h3>Prêt à commencer ?</h3>
          <p>
            Vous devez être connecté pour évaluer les livres. 
            <Link to="/vote" className="login-link"> Se connecter</Link>
          </p>
          <div className="action-buttons">
            <Link to="/results" className="btn-secondary">
              Voir les résultats actuels
            </Link>
            <Link to="/vote" className="btn-primary">
              Commencer à voter
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookSelector;