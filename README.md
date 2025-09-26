# Choix Goncourt 2025 - Outil d'Évaluation

Outil d'évaluation pour le jury étudiant du Choix Goncourt 2025. Cette application permet aux jurés d'évaluer les livres selon des critères pondérés et de consulter les résultats en temps réel.

## 🚀 Déploiement rapide

### 1. Créer le repository GitHub
1. Créez un nouveau repository sur GitHub (ex: `choix-goncourt-2025`)
2. Rendez-le public (nécessaire pour GitHub Pages gratuit)
3. Clonez le repository localement

### 2. Configuration initiale
```bash
# Cloner le repository
git clone https://github.com/votreusername/choix-goncourt-2025.git
cd choix-goncourt-2025

# Copier tous les fichiers fournis dans le repository
# (package.json, src/, public/, etc.)

# Installer les dépendances
npm install

# Installer gh-pages pour le déploiement
npm install --save-dev gh-pages
```

### 3. Configuration du déploiement
Dans `package.json`, modifiez la ligne `homepage` :
```json
"homepage": "https://votreusername.github.io/choix-goncourt-2025"
```

### 4. Déploiement
```bash
# Construire et déployer
npm run deploy
```

### 5. Activation de GitHub Pages
1. Allez dans les paramètres de votre repository GitHub
2. Scrollez jusqu'à "Pages"
3. Sélectionnez la branche `gh-pages` comme source
4. Votre app sera disponible à : `https://votreusername.github.io/choix-goncourt-2025`

## 🎯 Fonctionnalités

### ✅ Authentification
- Mot de passe partagé pour l'accès au vote
- Sélection du nom de l'évaluateur
- Consultation libre des résultats

### ✅ Évaluation des livres
- 14 livres de la sélection Goncourt 2025
- Système de notation sur 20 avec pondération :
  - **Fond (40%)** : Message, Universalité, Impact mémoriel, Actualité
  - **Forme (40%)** : Style, Originalité, Construction, Prise de risque
  - **Expérience (20%)** : Émotions, Fluidité, Identification
- Sauvegarde automatique des évaluations
- Une seule évaluation par utilisateur par livre (modifiable)

### ✅ Résultats en temps réel
- Classement des livres par score total
- Scores détaillés par critère
- Progression des jurés
- Statistiques globales

### ✅ Export des données
- Export JSON complet
- Export CSV pour analyse
- Données anonymisées dans les résultats

## 🔧 Configuration

### Mot de passe
Par défaut : `goncourt2025`
Modifiable dans `src/components/Authentication/Authentication.js`

### Jurés
Liste modifiable dans `src/data/evaluators.js`

### Livres
Liste modifiable dans `src/data/books.js`
Ajoutez les auteurs réels et les couvertures si disponibles

## 📱 Utilisation

### Pour les jurés
1. Aller sur l'URL de l'application
2. Cliquer sur "Voter" ou sur "Évaluer" pour un livre
3. Se connecter avec le mot de passe et sélectionner son nom
4. Évaluer les livres (sauvegarde automatique)
5. Consulter les résultats

### Pour consulter les résultats
- Accès libre à l'onglet "Résultats"
- Classement en temps réel
- Progression des évaluations

## 🛠️ Développement local

```bash
# Installer les dépendances
npm install

# Lancer en mode développement
npm start

# Construire pour la production
npm run build
```

## 📊 Structure des données

Les évaluations sont stockées localement dans le navigateur et peuvent être exportées :

```json
{
  "user_bookId": {
    "user": "NomDuJuré",
    "bookId": "id-du-livre",
    "evaluation": {
      "fond": { "message": 15, "universalite": 12, ... },
      "forme": { "style": 18, "originalite": 14, ... },
      "experience": { "emotions": 16, "fluidite": 13, ... },
      "totalScore": 16.2
    },
    "timestamp": "2025-09-26T..."
  }
}
```

## 🎨 Personnalisation

### Couleurs et styles
Modifiez les fichiers CSS dans chaque composant

### Critères d'évaluation
Modifiez `src/data/evaluators.js` pour ajuster les critères et pondérations

### Interface
Personnalisez les textes dans les composants React

## 🚨 Notes importantes

- Les données sont stockées localement (localStorage)
- Pas de backend nécessaire
- Fonctionne entièrement côté client
- Compatible mobile et desktop
- Accès simultané de tous les jurés

## 📞 Support

Pour toute question technique, référez-vous à la documentation React ou GitHub Pages.

Bon Choix Goncourt 2025 ! 📚