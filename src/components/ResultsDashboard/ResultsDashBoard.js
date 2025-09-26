import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getBookRankings, getUserProgress } from '../../utils/scoring';
import { exportToJSON, exportToCSV } from '../../utils/storage';
import './ResultsDashboard.css';

const ResultsDashboard = ({ books, evaluators, getAllEvaluations }) => {
  const [activeTab, setActiveTab] = useState('rankings');
  
  const allEvaluations = getAllEvaluations();
  const bookRankings = getBookRankings(books, allEvaluations);
  const userProgress = getUserProgress(evaluators, books, allEvaluations);
  
  const totalEvaluations = Object.keys(allEvaluations).length;
  const maxPossibleEvaluations = books.length * evaluators.length;
  const completionPercentage = Math.round((totalEvaluations / maxPossibleEvaluations) * 100);
  
  const handleExportJSON = () => {
    exportToJSON(allEvaluations, `goncourt-evaluations-${new Date().toISOString().split('T')[0]}.json`);
  };
  
  const handleExportCSV = () => {
    exportToCSV(allEvaluations, `goncourt-evaluations-${new Date().toISOString().split('T')[0]}.csv`);
  };
  
  const getRankMedal = (rank) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${rank}`;
    }
  };
  
  return (
    <div className="results-dashboard">
      <div className="dashboard-header">
        <h1>Résultats - Choix Goncourt 2025</h1>
        <div className="overview-stats">
          <div className="stat-card">
            <div className="stat-value">{totalEvaluations}</div>
            <div className="stat-label">Évaluations</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{completionPercentage}%</div>
            <div className="stat-label">Complété</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{books.length}</div>
            <div className="stat-label">Livres</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{evaluators.length}</div>
            <div className="stat-label">Jurés</div>
          </div>
        </div>
      </div>
      
      <div className="dashboard-controls">
        <div className="tab-buttons">
          <button
            className={activeTab === 'rankings' ? 'active' : ''}
            onClick={() => setActiveTab('rankings')}
          >
            Classement des livres
          </button>
          <button
            className={activeTab === 'progress' ? 'active' : ''}
            onClick={() => setActiveTab('progress')}
          >
            Progrès des jurés
          </button>
        </div>
        
        <div className="export-buttons">
          <button onClick={handleExportJSON} className="export-btn">
            📄 Exporter JSON
          </button>
          <button onClick={handleExportCSV} className="export-btn">
            📊 Exporter CSV
          </button>
        </div>
      </div>
      
      {activeTab === 'rankings' && (
        <div className="rankings-section">
          <div className="rankings-list">
            {bookRankings.map((book, index) => (
              <div key={book.id} className="ranking-item">
                <div className="rank-position">
                  {getRankMedal(index + 1)}
                </div>
                
                <div className="book-details">
                  <h3 className="book-title">{book.title}</h3>
                  {book.author && <p className="book-author">{book.author}</p>}
                </div>
                
                <div className="score-details">
                  <div className="total-score">
                    <span className="score-value">{book.totalScore.toFixed(2)}</span>
                    <span className="score-max">/20</span>
                  </div>
                  <div className="evaluation-count">
                    {book.evaluationCount} évaluation{book.evaluationCount !== 1 ? 's' : ''}
                  </div>
                </div>
                
                <div className="criteria-breakdown">
                  <div className="criteria-scores">
                    <div className="criteria-score">
                      <span className="criteria-name">Fond</span>
                      <span className="criteria-value">
                        {book.criteriaScores.fond ? 
                          Object.values(book.criteriaScores.fond)
                            .reduce((sum, score) => sum + score, 0).toFixed(1)
                          : '0.0'
                        }
                      </span>
                    </div>
                    <div className="criteria-score">
                      <span className="criteria-name">Forme</span>
                      <span className="criteria-value">
                        {book.criteriaScores.forme ? 
                          Object.values(book.criteriaScores.forme)
                            .reduce((sum, score) => sum + score, 0).toFixed(1)
                          : '0.0'
                        }
                      </span>
                    </div>
                    <div className="criteria-score">
                      <span className="criteria-name">Expérience</span>
                      <span className="criteria-value">
                        {book.criteriaScores.experience ? 
                          Object.values(book.criteriaScores.experience)
                            .reduce((sum, score) => sum + score, 0).toFixed(1)
                          : '0.0'
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {activeTab === 'progress' && (
        <div className="progress-section">
          <div className="progress-list">
            {userProgress.map(user => (
              <div key={user.id} className="progress-item">
                <div className="user-info">
                  <h3 className="user-name">{user.name}</h3>
                </div>
                
                <div className="progress-stats">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${user.completionPercentage}%` }}
                    ></div>
                  </div>
                  <div className="progress-text">
                    {user.completedBooks}/{user.totalBooks} livres ({user.completionPercentage}%)
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {totalEvaluations === 0 && (
        <div className="no-data-message">
          <h2>Aucune évaluation pour le moment</h2>
          <p>Les résultats apparaîtront dès qu'un juré aura commencé à évaluer les livres.</p>
          <Link to="/" className="start-evaluating-btn">
            Commencer les évaluations
          </Link>
        </div>
      )}
    </div>
  );
};

export default ResultsDashboard;