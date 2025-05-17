#!/bin/bash
# deploy-vercel.sh - Script to deploy to Vercel

echo "Preparing for Vercel deployment..."
echo "Installing Vercel CLI..."
npm install -g vercel

echo "Preparing .env.production with proper API URL..."
if [ -z "$API_URL" ]; then
  read -p "Enter your backend API URL (e.g., https://your-api-url.com/api): " API_URL
  
  # If still empty, use a default value
  if [ -z "$API_URL" ]; then
    API_URL="https://your-backend-api-url.com/api"
    echo "Using default API URL. You will need to update this later."
  fi
fi

# Create or update .env.production
echo "VITE_API_URL=$API_URL" > .env.production

echo "Deploying to Vercel..."
cd UI-Frontend
vercel --prod

echo "Deployment complete!"
echo "Visit your Vercel dashboard to see the deployed site."
echo "Remember to set up CORS in your backend to allow requests from your Vercel domain."
