# deploy-vercel.ps1 - Script to deploy to Vercel

Write-Host "Preparing for Vercel deployment..." -ForegroundColor Cyan
Write-Host "Installing Vercel CLI..." -ForegroundColor Cyan
npm install -g vercel

Write-Host "Preparing .env.production with proper API URL..." -ForegroundColor Cyan
if (-not $env:API_URL) {
  $API_URL = Read-Host "Enter your backend API URL (e.g., https://your-api-url.com/api)"
  
  # If still empty, use a default value
  if (-not $API_URL) {
    $API_URL = "https://your-backend-api-url.com/api"
    Write-Host "Using default API URL. You will need to update this later." -ForegroundColor Yellow
  }
}
else {
  $API_URL = $env:API_URL
}

# Create or update .env.production
"VITE_API_URL=$API_URL" | Out-File -FilePath ".\UI-Frontend\.env.production" -Encoding utf8 -Force

Write-Host "Deploying to Vercel..." -ForegroundColor Cyan
Set-Location -Path ".\UI-Frontend"
vercel --prod

Write-Host "Deployment complete!" -ForegroundColor Green
Write-Host "Visit your Vercel dashboard to see the deployed site." -ForegroundColor Cyan
Write-Host "Remember to set up CORS in your backend to allow requests from your Vercel domain." -ForegroundColor Yellow
