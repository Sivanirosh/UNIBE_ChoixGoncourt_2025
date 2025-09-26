import React from 'react';
import { Link } from 'react-router-dom';
import './BookSelector.css';

const BookSelector = ({ books }) => {
  return (
    <div className="book-selector">
      <div className="selector-header">
        <h1>Sélection Goncourt 2025</h1>
        <p>Cliquez sur un livre pour l'évaluer ou consulter ses résultats</p>
      </div>
      
      <div className="books-grid">
        {books.map(book => (
          <div key={book.id} className="book-card">
            <div className="book-cover">
              <img 
                src={book.cover} 
                alt={`Couverture de ${book.title}`}
                onError={(e) => {
                  e.target.src = '/placeholder-book.png'; // Fallback image
                }}
              />
            </div>
            
            <div className="book-info">
              <h3 className="book-title">{book.title}</h3>
              {book.author && (
                <p className="book-author">{book.author}</p>
              )}
            </div>
            
            <div className="book-actions">
              <Link 
                to={`/evaluate/${book.id}`} 
                className="evaluate-button"
              >
                Évaluer
              </Link>
            </div>
          </div>
        ))}
      </div>
      
      <div className="selector-footer">
        <p>
          Vous devez être connecté pour évaluer les livres. 
          <Link to="/vote" className="login-link"> Se connecter</Link>
        </p>
        <p>
          <Link to="/results" className="results-link">
            Voir les résultats actuels →
          </Link>
        </p>
      </div>
    </div>
  );
};

export default BookSelector;