#!/bin/bash

# GitHub Pages deployment script for Choix Goncourt 2025

echo "🚀 Starting deployment to GitHub Pages..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building the project..."
npm run build

# Deploy to GitHub Pages
echo "🌐 Deploying to GitHub Pages..."
npm run deploy

echo "✅ Deployment completed!"
echo "Your app should be available at: https://sivanirosh.github.io/UNIBE_ChoixGoncourt_2025/"