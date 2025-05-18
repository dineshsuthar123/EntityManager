# Test your deployed frontend with your local backend
#
# This script helps you test your Vercel-deployed frontend
# with your local backend by setting up a tunnel

Write-Host "Creating a tunnel to your local backend..." -ForegroundColor Cyan
Write-Host "This will allow your Vercel-deployed frontend to communicate with your local backend." -ForegroundColor Yellow
Write-Host "First, let's make sure your backend is running..." -ForegroundColor Cyan

# Check if port 8080 is in use
$portInUse = Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue

if (-not $portInUse) {
    Write-Host "Backend not detected on port 8080. Starting backend..." -ForegroundColor Yellow
    # Start the backend in a new window
    Start-Process powershell -ArgumentList "-NoExit -Command `"cd '$PWD\project1\project1'; java -jar target\project1-1.0-SNAPSHOT.jar`""
    
    Write-Host "Waiting for backend to start..." -ForegroundColor Yellow
    Start-Sleep -Seconds 15
}
else {
    Write-Host "Backend detected on port 8080" -ForegroundColor Green
}

# Install ngrok if not already installed
if (-not (Test-Path -Path ".\ngrok.exe")) {
    Write-Host "Installing ngrok..." -ForegroundColor Cyan
    Invoke-WebRequest -Uri "https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-windows-amd64.zip" -OutFile "ngrok.zip"
    Expand-Archive -Path "ngrok.zip" -DestinationPath "."
    Remove-Item -Path "ngrok.zip"
}

# Start ngrok tunnel
Write-Host "Starting ngrok tunnel to your local backend..." -ForegroundColor Cyan
Write-Host "This will create a public URL that forwards to your local backend." -ForegroundColor Yellow

# Start ngrok in a new window
Start-Process powershell -ArgumentList "-NoExit -Command `".\ngrok.exe http 8080`""

Write-Host "Tunnel started! You need to:" -ForegroundColor Green
Write-Host "1. Sign up for a free ngrok account at https://ngrok.com and get your authtoken" -ForegroundColor Yellow
Write-Host "2. Run 'ngrok config add-authtoken YOUR_TOKEN' in the ngrok window if prompted" -ForegroundColor Yellow
Write-Host "3. Copy the HTTPS URL (e.g., https://something.ngrok-free.app) from the ngrok window" -ForegroundColor Yellow
Write-Host "4. Update your Vercel environment variables with this URL + '/api' as the backend API URL" -ForegroundColor Yellow
Write-Host "   Go to: https://vercel.com/dashboard → Your Project → Settings → Environment Variables" -ForegroundColor Yellow
Write-Host "   Add: VITE_API_URL=https://your-ngrok-url/api" -ForegroundColor Yellow
Write-Host "5. Redeploy your frontend or trigger a deployment from the Vercel dashboard" -ForegroundColor Yellow

Write-Host "`nKeep this window and the ngrok window open while testing." -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop when done." -ForegroundColor Cyan
