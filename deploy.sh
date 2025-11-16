#!/bin/bash

# Portfolio Deploy Script
# This script builds and deploys the portfolio to Firebase

set -e  # Exit on error

echo "🚀 Starting deployment process..."
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "❌ node_modules not found. Please run ./setup.sh first."
    exit 1
fi

# Check if Firebase CLI is available
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found. Please run ./setup.sh first."
    exit 1
fi

# Clean previous build
if [ -d "build" ]; then
    echo "🧹 Cleaning previous build..."
    rm -rf build
    echo ""
fi

# Build the project
echo "🔨 Building project..."
npm run build
echo ""

# Check if build was successful
if [ ! -d "build" ]; then
    echo "❌ Build failed. build directory not found."
    exit 1
fi

echo "✅ Build successful!"
echo ""

# Deploy to Firebase
echo "🚀 Deploying to Firebase..."
npx firebase deploy
echo ""

echo "✨ Deployment complete!"
echo ""
