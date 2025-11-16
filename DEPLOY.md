# Portfolio Setup & Deployment Guide

## Prerequisites
- Node.js (v14 or higher)
- npm
- Firebase account

## Setup (First Time)

Run the setup script to install dependencies and configure Firebase:

```bash
./setup.sh
```

Or using npm:

```bash
npm run setup
```

This script will:
- ✅ Check Node.js and npm installation
- ✅ Install project dependencies
- ✅ Install Firebase CLI (if not already installed)
- ✅ Authenticate with Firebase

## Deploy to Production

Run the deploy script to build and deploy to Firebase:

```bash
./deploy.sh
```

Or using npm:

```bash
npm run deploy
```

This script will:
- ✅ Clean previous build
- ✅ Build the production bundle
- ✅ Deploy to Firebase Hosting

## Available Commands

### Development
```bash
npm start          # Start development server (http://localhost:3000)
```

### Build
```bash
npm run build      # Create production build
```

### Testing
```bash
npm test           # Run tests
```

### Setup & Deploy
```bash
npm run setup      # Initial project setup
npm run deploy     # Build and deploy to Firebase
```

## Manual Deployment

If you prefer to deploy manually:

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy to Firebase:
   ```bash
   npx firebase deploy
   ```

## Notes
- Always test changes locally before deploying
- The deploy script automatically builds before deploying
- Firebase hosting configuration is in `firebase.json`
