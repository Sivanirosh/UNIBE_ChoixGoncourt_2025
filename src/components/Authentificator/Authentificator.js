import React, { useState } from 'react';
import { evaluators } from '../../data/evaluators';
import './Authentication.css';

const Authentication = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [error, setError] = useState('');
  
  const VOTING_PASSWORD = 'goncourt2025'; // You can change this

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (password !== VOTING_PASSWORD) {
      setError('Mot de passe incorrect');
      return;
    }
    
    if (!selectedUser) {
      setError('Veuillez sélectionner votre nom');
      return;
    }
    
    onLogin(selectedUser);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Accès au vote - Choix Goncourt 2025</h2>
        <p>Connectez-vous pour évaluer les livres</p>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="user-select">Sélectionnez votre nom :</label>
            <select
              id="user-select"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              required
            >
              <option value="">-- Choisir un nom --</option>
              {evaluators.map(evaluator => (
                <option key={evaluator.id} value={evaluator.name}>
                  {evaluator.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Mot de passe :</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Entrez le mot de passe"
              required
            />
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <button type="submit" className="login-button">
            Se connecter
          </button>
        </form>
        
        <div className="auth-info">
          <p>
            <small>
              Vous pouvez consulter les résultats sans vous connecter.
              <br />
              La connexion n'est nécessaire que pour voter.
            </small>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Authentication;