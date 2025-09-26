import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Components
import Authentication from './components/Authentication/Authentication';
import BookSelector from './components/BookSelector/BookSelector';
import EvaluationForm from '../components/EvaluationForm/EvaluationForm';
import ResultsDashboard from './components/ResultsDashboard/ResultsDashboard';
import Navigation from '../components/Navigation/Navigation';

// Data and utilities
import { books } from '../data/books';
import { evaluators } from '../data/evaluators';
import { getStoredData, saveData } from '../utils/storage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState('');
  const [evaluations, setEvaluations] = useState({});

  useEffect(() => {
    // Load stored data on app start
    const storedEvaluations = getStoredData('evaluations') || {};
    setEvaluations(storedEvaluations);

    // Check if user is already authenticated
    const storedAuth = getStoredData('isAuthenticated');
    const storedUser = getStoredData('currentUser');
    if (storedAuth && storedUser) {
      setIsAuthenticated(true);
      setCurrentUser(storedUser);
    }
  }, []);

  const handleLogin = (username) => {
    setIsAuthenticated(true);
    setCurrentUser(username);
    saveData('isAuthenticated', true);
    saveData('currentUser', username);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser('');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('currentUser');
  };

  const updateEvaluation = (bookId, evaluation) => {
    const newEvaluations = {
      ...evaluations,
      [`${currentUser}_${bookId}`]: {
        user: currentUser,
        bookId,
        evaluation,
        timestamp: new Date().toISOString()
      }
    };
    setEvaluations(newEvaluations);
    saveData('evaluations', newEvaluations);
  };

  const getUserEvaluation = (bookId) => {
    return evaluations[`${currentUser}_${bookId}`]?.evaluation || null;
  };

  const getAllEvaluations = () => {
    return evaluations;
  };

  return (
    <Router basename="/choix-goncourt-2025">
      <div className="App">
        <Navigation 
          isAuthenticated={isAuthenticated}
          currentUser={currentUser}
          onLogout={handleLogout}
        />
        
        <main className="main-content">
          <Routes>
            <Route 
              path="/" 
              element={<BookSelector books={books} />} 
            />
            
            <Route 
              path="/evaluate/:bookId" 
              element={
                isAuthenticated ? (
                  <EvaluationForm 
                    books={books}
                    currentUser={currentUser}
                    getUserEvaluation={getUserEvaluation}
                    updateEvaluation={updateEvaluation}
                  />
                ) : (
                  <Authentication onLogin={handleLogin} />
                )
              } 
            />
            
            <Route 
              path="/results" 
              element={
                <ResultsDashboard 
                  books={books}
                  evaluators={evaluators}
                  getAllEvaluations={getAllEvaluations}
                />
              } 
            />
            
            <Route 
              path="/vote" 
              element={
                isAuthenticated ? (
                  <Navigate to="/" replace />
                ) : (
                  <Authentication onLogin={handleLogin} />
                )
              } 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;