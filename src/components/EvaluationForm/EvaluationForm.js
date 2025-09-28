import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { evaluationCriteria, ratingScale } from '../../data/evaluators';
import { calculateTotalScore, isEvaluationComplete, getSimpleStats } from '../../utils/scoring';
import './EvaluationForm.css';

// Simple stats display component (replaces violin plots)
const SimpleStats = ({ ratings, label }) => {
  if (!ratings || ratings.length === 0) {
    return (
      <div className="simple-stats empty">
        <span className="stats-label">Autres votes</span>
        <span className="stats-value">Aucun</span>
      </div>
    );
  }

  const stats = getSimpleStats(ratings);
  const mostCommonLabel = ratingScale.find(r => r.value === stats.most_common)?.label || 'N/A';

  return (
    <div className="simple-stats">
      <span className="stats-label">Autres votes ({stats.count})</span>
      <span className="stats-value">
        Moy: {stats.average} • Plus fréquent: {mostCommonLabel}
      </span>
    </div>
  );
};

// Simplified rating option component
const RatingOption = ({ option, isSelected, onSelect, disabled }) => (
  <button
    type="button"
    className={`rating-btn ${isSelected ? 'selected' : ''} ${disabled ? 'disabled' : ''}`}
    onClick={() => onSelect(option.value)}
    disabled={disabled}
    title={option.description}
  >
    <span className="rating-value">{option.value}</span>
    <span className="rating-label">{option.label}</span>
  </button>
);

const EvaluationForm = ({ books, currentUser, getUserEvaluation, updateEvaluation, getAllEvaluations }) => {
  const { bookId } = useParams();
  const [evaluation, setEvaluation] = useState({
    fond: {},
    forme: {},
    experience: {}
  });
  const [totalScore, setTotalScore] = useState(0);
  const [showOthersVotes, setShowOthersVotes] = useState(false);
  const [lastSaved, setLastSaved] = useState(new Date());
  
  const book = books.find(b => b.id === bookId);
  const allEvaluations = getAllEvaluations ? getAllEvaluations() : {};
  
  // Get other users' ratings for simple stats
  const getOtherRatings = (criteriaKey, subKey) => {
    const otherEvaluations = Object.values(allEvaluations).filter(
      evalData => evalData.bookId === bookId && evalData.user !== currentUser
    );
    
    return otherEvaluations
      .map(evalData => evalData.evaluation[criteriaKey]?.[subKey])
      .filter(rating => rating !== undefined && rating !== null && rating > 0);
  };
  
  useEffect(() => {
    // Load existing evaluation if it exists (async)
    const loadExistingEvaluation = async () => {
      try {
        const existingEvaluation = await getUserEvaluation(bookId);
        if (existingEvaluation) {
          setEvaluation(existingEvaluation);
        }
      } catch (error) {
        console.error('Error loading existing evaluation:', error);
      }
    };
    
    loadExistingEvaluation();
  }, [bookId]); // Remove getUserEvaluation from dependencies
  
  // Debounced auto-save to prevent rapid re-renders
  useEffect(() => {
    const total = calculateTotalScore(evaluation);
    setTotalScore(total);
    
    // Debounce the save operation
    const timeoutId = setTimeout(() => {
      const evaluationWithTotal = {
        ...evaluation,
        totalScore: total
      };
      updateEvaluation(bookId, evaluationWithTotal);
      setLastSaved(new Date());
    }, 300); // 300ms delay
    
    return () => clearTimeout(timeoutId);
  }, [evaluation, bookId, updateEvaluation]);
  
  const handleScoreChange = (criteriaKey, subcriteriaKey, value) => {
    setEvaluation(prev => ({
      ...prev,
      [criteriaKey]: {
        ...prev[criteriaKey],
        [subcriteriaKey]: parseInt(value) || 0
      }
    }));
  };
  
  const getCompletionPercentage = () => {
    const totalCriteria = Object.values(evaluationCriteria)
      .reduce((sum, criteria) => sum + Object.keys(criteria.subcriteria).length, 0);
    
    const completedCriteria = Object.values(evaluationCriteria)
      .reduce((sum, criteria) => {
        const criteriaKey = Object.keys(evaluationCriteria).find(
          key => evaluationCriteria[key] === criteria
        );
        return sum + Object.keys(criteria.subcriteria).filter(
          subKey => evaluation[criteriaKey]?.[subKey] > 0
        ).length;
      }, 0);
    
    return Math.round((completedCriteria / totalCriteria) * 100);
  };
  
  const getScoreColor = (score) => {
    if (score >= 8) return '#00d4aa';
    if (score >= 6) return '#4facfe';
    if (score >= 4) return '#ffc107';
    return '#ff6b6b';
  };

  const isComplete = isEvaluationComplete(evaluation);
  
  if (!book) {
    return (
      <div className="evaluation-form">
        <div className="error-message">
          <div className="error-icon">📚</div>
          <h2>Livre non trouvé</h2>
          <p>Le livre demandé n'existe pas dans notre sélection.</p>
          <Link to="/" className="back-button">
            Retour à la sélection
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="evaluation-form streamlined">
      {/* Compact Header */}
      <div className="form-header compact">
        <Link to="/" className="back-link">
          ← Retour aux livres
        </Link>
        
        <div className="book-info">
          <div className="book-meta">
            <h1>{book.title}</h1>
            {book.author && <p className="author">{book.author}</p>}
          </div>
          
          <div className="progress-info">
            <div className="score-display">
              <span className="score-value" style={{ color: getScoreColor(totalScore) }}>
                {totalScore.toFixed(1)}/10
              </span>
            </div>
            <div className="completion-badge">
              <span className="completion-text">
                {getCompletionPercentage()}% complété
              </span>
              {isComplete && <span className="complete-icon">✓</span>}
            </div>
          </div>
        </div>
        
        <div className="quick-controls">
          <button 
            className="toggle-btn"
            onClick={() => setShowOthersVotes(!showOthersVotes)}
          >
            {showOthersVotes ? 'Masquer' : 'Voir'} les autres votes
          </button>
        </div>
      </div>
      
      {/* Streamlined Form Content */}
      <div className="form-content compact">
        {Object.entries(evaluationCriteria).map(([criteriaKey, criteria]) => (
          <div key={criteriaKey} className="criteria-section compact">
            <div className="criteria-header compact">
              <h2>
                <span className="criteria-icon">{criteria.icon}</span>
                {criteria.label}
                <span className="criteria-weight">{Math.round(criteria.weight * 100)}%</span>
              </h2>
            </div>
            
            <div className="subcriteria-list">
              {Object.entries(criteria.subcriteria).map(([subKey, subcriteria]) => {
                const otherRatings = getOtherRatings(criteriaKey, subKey);
                const currentValue = evaluation[criteriaKey]?.[subKey];
                
                return (
                  <div key={subKey} className="subcriteria-item">
                    <div className="subcriteria-header">
                      <div className="subcriteria-info">
                        <h3>{subcriteria.label}</h3>
                        <p className="subcriteria-description">{subcriteria.description}</p>
                      </div>
                      
                      {showOthersVotes && (
                        <SimpleStats 
                          ratings={otherRatings}
                          label={subcriteria.label}
                        />
                      )}
                    </div>
                    
                    <div className="rating-buttons">
                      {ratingScale.map((option) => (
                        <RatingOption
                          key={option.value}
                          option={option}
                          isSelected={currentValue === option.value}
                          onSelect={(value) => handleScoreChange(criteriaKey, subKey, value)}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      
      {/* Compact Footer */}
      <div className="form-footer compact">
        <div className="save-status">
          <span className="save-icon">💾</span>
          <span className="save-text">
            Sauvegardé automatiquement à {lastSaved.toLocaleTimeString()}
          </span>
        </div>
        
        <div className="navigation-buttons">
          <Link to="/" className="btn secondary">
            Continuer plus tard
          </Link>
          <Link to="/results" className="btn primary">
            Voir les résultats
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EvaluationForm;