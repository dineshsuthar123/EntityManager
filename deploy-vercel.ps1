# deploy-vercel.ps1 - Script to deploy to Vercel

Write-Host "Preparing for Vercel deployment..." -ForegroundColor Cyan
Write-Host "Installing Vercel CLI..." -ForegroundColor Cyan
npm install -g vercel

# Helper function to validate URL
function Test-ValidURL {
    param (
        [Parameter(Mandatory=$true)]
        [string]$URL
    )

    if ($URL -match "^https?://[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]$") {
        return $true
    } else {
        return $false
    }
}

Write-Host "Preparing for deployment..." -ForegroundColor Cyan
Write-Host "Please choose how to handle backend API URL:" -ForegroundColor Yellow
Write-Host "1. I already have a deployed backend (provide URL)" -ForegroundColor White
Write-Host "2. I want to test with my local backend (we'll help set this up)" -ForegroundColor White
Write-Host "3. Use a placeholder URL (you'll need to update later)" -ForegroundColor White

$choice = Read-Host "Enter your choice (1-3)"

switch ($choice) {
    "1" {
        $API_URL = Read-Host "Enter your deployed backend API URL (e.g., https://my-backend.com/api)"
        
        # Validate URL format
        if (-not (Test-ValidURL -URL $API_URL)) {
            Write-Host "Invalid URL format. Using placeholder URL." -ForegroundColor Red
            $API_URL = "https://your-backend-api-url.com/api"
            Write-Host "You'll need to update this later in your Vercel environment variables." -ForegroundColor Yellow
        }
    }
    "2" {
        Write-Host "We'll set you up with the local backend workflow." -ForegroundColor Cyan
        Write-Host "After deployment, you'll need to run the test-with-local-backend.ps1 script." -ForegroundColor Yellow
        $API_URL = "https://placeholder-will-be-updated-later.com/api"
    }
    "3" {
        $API_URL = "https://your-backend-api-url.com/api"
        Write-Host "Using placeholder URL. You'll need to update this later." -ForegroundColor Yellow
    }
    default {
        $API_URL = "https://your-backend-api-url.com/api"
        Write-Host "Invalid choice. Using placeholder URL." -ForegroundColor Red
    }
}

# Create or update .env.production
"VITE_API_URL=$API_URL" | Out-File -FilePath ".\UI-Frontend\.env.production" -Encoding utf8 -Force

Write-Host "Logging in to Vercel..." -ForegroundColor Cyan
Set-Location -Path ".\UI-Frontend"
vercel login

Write-Host "Deploying to Vercel..." -ForegroundColor Cyan
vercel --prod

Write-Host "Deployment complete!" -ForegroundColor Green

# Show post-deployment instructions
Write-Host "`n=============== NEXT STEPS ===============`n" -ForegroundColor Cyan

if ($choice -eq "2") {
    Write-Host "To test with your local backend:" -ForegroundColor Yellow
    Write-Host "1. Run the test-with-local-backend.ps1 script" -ForegroundColor White
    Write-Host "2. Follow the instructions to set up an ngrok tunnel" -ForegroundColor White
    Write-Host "3. Update your Vercel environment variables with the ngrok URL" -ForegroundColor White
    Write-Host "4. Trigger a redeployment from the Vercel dashboard" -ForegroundColor White
}
else {
    Write-Host "Your application is now deployed to Vercel." -ForegroundColor Yellow
    Write-Host "Vercel Environment Variables:" -ForegroundColor White
    Write-Host "- If you need to update your backend URL, go to:" -ForegroundColor White
    Write-Host "  https://vercel.com → Your project → Settings → Environment Variables" -ForegroundColor White
    Write-Host "- Add/Update: VITE_API_URL with your backend URL" -ForegroundColor White
}

Write-Host "`nRemember to set up CORS in your backend to allow requests from your Vercel domain!" -ForegroundColor Yellow

Write-Host "Deployment complete!" -ForegroundColor Green
Write-Host "Visit your Vercel dashboard to see the deployed site." -ForegroundColor Cyan
Write-Host "Remember to set up CORS in your backend to allow requests from your Vercel domain." -ForegroundColor Yellow
