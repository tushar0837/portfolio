#!/bin/bash

# Portfolio Setup Script
# This script sets up the portfolio project from scratch

set -e  # Exit on error

echo "🚀 Starting portfolio setup..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install
echo ""

# Check if Firebase CLI is installed globally
if ! command -v firebase &> /dev/null; then
    echo "⚠️  Firebase CLI not found globally. Installing..."
    npm install -g firebase-tools
    echo ""
fi

echo "✅ Firebase CLI version: $(firebase --version)"
echo ""

# Firebase login check
echo "🔐 Checking Firebase authentication..."
if firebase projects:list &> /dev/null; then
    echo "✅ Already logged in to Firebase"
else
    echo "⚠️  Not logged in to Firebase. Please login..."
    firebase login
fi
echo ""

echo "✨ Setup complete!"
echo ""
echo "Available commands:"
echo "  npm start        - Start development server"
echo "  npm run build    - Build for production"
echo "  npm run deploy   - Build and deploy to Firebase"
echo ""
