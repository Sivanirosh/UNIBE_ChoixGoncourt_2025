import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { evaluationCriteria } from '../../data/evaluators';
import { calculateTotalScore } from '../../utils/scoring';
import './EvaluationForm.css';

const EvaluationForm = ({ books, currentUser, getUserEvaluation, updateEvaluation }) => {
  const { bookId } = useParams();
  const [evaluation, setEvaluation] = useState({
    fond: {},
    forme: {},
    experience: {}
  });
  const [totalScore, setTotalScore] = useState(0);
  
  const book = books.find(b => b.id === bookId);
  
  useEffect(() => {
    // Load existing evaluation if it exists
    const existingEvaluation = getUserEvaluation(bookId);
    if (existingEvaluation) {
      setEvaluation(existingEvaluation);
    }
  }, [bookId, getUserEvaluation]);
  
  useEffect(() => {
    // Recalculate total score whenever evaluation changes
    const total = calculateTotalScore(evaluation);
    setTotalScore(total);
    
    // Auto-save with total score
    const evaluationWithTotal = {
      ...evaluation,
      totalScore: total
    };
    updateEvaluation(bookId, evaluationWithTotal);
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
  
  if (!book) {
    return (
      <div className="evaluation-form">
        <div className="error-message">
          Livre non trouvé. <Link to="/">Retour à la sélection</Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="evaluation-form">
      <div className="form-header">
        <Link to="/" className="back-link">← Retour aux livres</Link>
        <div className="book-info">
          <h1>Évaluation: {book.title}</h1>
          {book.author && <p className="author">par {book.author}</p>}
        </div>
        <div className="progress-info">
          <div className="completion-badge">
            {getCompletionPercentage()}% complété
          </div>
          <div className="current-score">
            Score actuel: <strong>{totalScore}/20</strong>
          </div>
        </div>
      </div>
      
      <div className="form-content">
        {Object.entries(evaluationCriteria).map(([criteriaKey, criteria]) => (
          <div key={criteriaKey} className="criteria-section">
            <h2 className="criteria-title">
              {criteria.label}
              <span className="criteria-weight">({Math.round(criteria.weight * 100)}%)</span>
            </h2>
            
            <div className="subcriteria-grid">
              {Object.entries(criteria.subcriteria).map(([subKey, subcriteria]) => (
                <div key={subKey} className="subcriteria-item">
                  <label className="subcriteria-label">
                    {subcriteria.label}
                    <span className="subcriteria-weight">
                      ({Math.round(subcriteria.weight * 100)}%)
                    </span>
                  </label>
                  
                  <div className="rating-scale">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map(score => (
                      <label key={score} className="rating-option">
                        <input
                          type="radio"
                          name={`${criteriaKey}-${subKey}`}
                          value={score}
                          checked={evaluation[criteriaKey]?.[subKey] === score}
                          onChange={(e) => handleScoreChange(criteriaKey, subKey, e.target.value)}
                        />
                        <span className="rating-value">{score}</span>
                      </label>
                    ))}
                  </div>
                  
                  <div className="rating-labels">
                    <span>Très faible</span>
                    <span>Moyen</span>
                    <span>Excellent</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className="form-footer">
        <div className="save-status">
          ✅ Évaluation sauvegardée automatiquement
        </div>
        <div className="navigation-buttons">
          <Link to="/" className="button secondary">
            Terminer plus tard
          </Link>
          <Link to="/results" className="button primary">
            Voir les résultats
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EvaluationForm;