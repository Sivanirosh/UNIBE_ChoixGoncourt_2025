import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Components - Fixed import paths
import Authentication from './components/Authentificator/Authentificator';
import BookSelector from './components/BookSelector/BookSelector';
import EvaluationForm from './components/EvaluationForm/EvaluationForm';
import ResultsDashboard from './components/ResultsDashboard/ResultsDashBoard';
import Navigation from './components/Navigation/Navigation';

// Data and utilities
import { books } from './data/books';
import { evaluators } from './data/evaluators';
import { getStoredData, saveData } from './utils/storage';
import { 
  saveEvaluationToFirebase, 
  getUserEvaluationFromFirebase, 
  getAllEvaluationsFromFirebase 
} from './utils/firebaseStorage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState('');
  const [evaluations, setEvaluations] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      // Load stored authentication
      const storedAuth = getStoredData('isAuthenticated');
      const storedUser = getStoredData('currentUser');
      if (storedAuth && storedUser) {
        setIsAuthenticated(true);
        setCurrentUser(storedUser);
      }

      // Load evaluations from Firebase (with localStorage fallback)
      try {
        const allEvaluations = await getAllEvaluationsFromFirebase();
        setEvaluations(allEvaluations);
      } catch (error) {
        console.error('Error loading evaluations:', error);
        // Fallback to localStorage only
        const storedEvaluations = getStoredData('evaluations') || {};
        setEvaluations(storedEvaluations);
      }
      
      setIsLoading(false);
    };

    loadData();
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

  const updateEvaluation = async (bookId, evaluation) => {
    const evaluationKey = `${currentUser}_${bookId}`;
    const evaluationData = {
      user: currentUser,
      bookId,
      evaluation,
      timestamp: new Date().toISOString()
    };

    // Update local state immediately for responsive UI
    const newEvaluations = {
      ...evaluations,
      [evaluationKey]: evaluationData
    };
    setEvaluations(newEvaluations);

    // Save to localStorage as backup
    saveData('evaluations', newEvaluations);

    // Save to Firebase (async)
    try {
      const success = await saveEvaluationToFirebase(currentUser, bookId, evaluation);
      if (!success && isOnline) {
        console.warn('Failed to save to Firebase, using localStorage backup');
      }
    } catch (error) {
      console.error('Error saving to Firebase:', error);
    }
  };

  const getUserEvaluation = async (bookId) => {
    // First check local state (fastest)
    const localKey = `${currentUser}_${bookId}`;
    if (evaluations[localKey]) {
      return evaluations[localKey].evaluation;
    }

    // Then try Firebase
    try {
      const evaluation = await getUserEvaluationFromFirebase(currentUser, bookId);
      return evaluation;
    } catch (error) {
      console.error('Error getting user evaluation:', error);
      return null;
    }
  };

  const getAllEvaluations = () => {
    return evaluations;
  };

  // Show loading screen while initializing
  if (isLoading) {
    return (
      <div className="App">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <div className="loading"></div>
          <p>Chargement des évaluations...</p>
          {!isOnline && (
            <p style={{ color: '#ff6b6b', fontSize: '0.9rem' }}>
              Mode hors ligne - certaines fonctionnalités peuvent être limitées
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <Router basename="/UNIBE_ChoixGoncourt_2025">
      <div className="App">
        <Navigation 
          isAuthenticated={isAuthenticated}
          currentUser={currentUser}
          onLogout={handleLogout}
        />
        
        {/* Offline indicator */}
        {!isOnline && (
          <div style={{
            background: '#ff6b6b',
            color: 'white',
            padding: '0.5rem',
            textAlign: 'center',
            fontSize: '0.9rem',
            position: 'fixed',
            top: '80px',
            left: 0,
            right: 0,
            zIndex: 999
          }}>
            Mode hors ligne - les modifications seront synchronisées à la reconnexion
          </div>
        )}
        
        <main className="main-content" style={{ paddingTop: !isOnline ? '40px' : '0' }}>
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
                    getAllEvaluations={getAllEvaluations}
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