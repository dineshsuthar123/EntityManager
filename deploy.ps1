# Deployment script for Java Spring Boot + React application

Write-Host "Starting deployment process..." -ForegroundColor Green

# Check deployment type
if ($args[0] -eq "-deploy-to-vercel") {
    Write-Host "Deploying to Vercel (Frontend only)..." -ForegroundColor Cyan
    Write-Host "Note: Backend needs to be deployed separately to a cloud platform that supports Java" -ForegroundColor Yellow
    
    # Build frontend for Vercel
    Write-Host "Building frontend for Vercel..." -ForegroundColor Cyan
    Set-Location -Path "D:\Majar Projects\java-only\UI-Frontend"
    
    # Ensure .env.production exists
    if (-not (Test-Path ".env.production")) {
        Write-Host "Creating .env.production file..." -ForegroundColor Yellow
        $productionApiUrl = Read-Host "Enter your production backend API URL (e.g., https://your-backend.railway.app/api)"
        if ([string]::IsNullOrWhiteSpace($productionApiUrl)) {
            $productionApiUrl = "https://your-backend-api-url.com/api"
            Write-Host "Using placeholder API URL. You'll need to update this later." -ForegroundColor Yellow
        }
        "VITE_API_URL=$productionApiUrl" | Out-File -FilePath ".env.production" -Encoding UTF8
    }
    
    npm install
    npm run build:vercel
    
    # Check if Vercel CLI is installed
    $vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue
    if (-not $vercelInstalled) {
        Write-Host "Installing Vercel CLI..." -ForegroundColor Yellow
        npm install -g vercel
    }
    
    # Deploy to Vercel
    vercel --prod
    
    Write-Host "`nFrontend deployed to Vercel successfully!" -ForegroundColor Green
    Write-Host "Important Notes:" -ForegroundColor Yellow
    Write-Host "1. Update the backend API URL in .env.production if needed" -ForegroundColor Yellow
    Write-Host "2. Deploy your backend to Railway, Heroku, or another Java-compatible platform" -ForegroundColor Yellow
    Write-Host "3. Update CORS settings in your backend to allow your Vercel domain" -ForegroundColor Yellow
    exit
}

# Local deployment process
Write-Host "Starting local deployment..." -ForegroundColor Cyan

# Stop any running processes on port 8080
Write-Host "Checking for existing backend processes..." -ForegroundColor Yellow
Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue | ForEach-Object {
    $process = Get-Process -Id $_.OwningProcess -ErrorAction SilentlyContinue
    if ($process) {
        Write-Host "Stopping process: $($process.ProcessName) (PID: $($process.Id))" -ForegroundColor Yellow
        Stop-Process -Id $process.Id -Force
    }
}

# Build and package backend
Write-Host "Building backend..." -ForegroundColor Cyan
Set-Location -Path "D:\Majar Projects\java-only\project1\project1"
mvn clean package -DskipTests

# Build frontend for local development
Write-Host "Building frontend..." -ForegroundColor Cyan
Set-Location -Path "D:\Majar Projects\java-only\UI-Frontend"

# Ensure .env.development exists
if (-not (Test-Path ".env.development")) {
    Write-Host "Creating .env.development file..." -ForegroundColor Yellow
    "VITE_API_URL=http://localhost:8080/api" | Out-File -FilePath ".env.development" -Encoding UTF8
}

npm install
npm run build

# Start backend server
Write-Host "Starting backend server..." -ForegroundColor Cyan
Set-Location -Path "D:\Majar Projects\java-only\project1\project1"
Start-Process -FilePath "java" -ArgumentList "-jar target\project1-1.0-SNAPSHOT.jar" -WindowStyle Hidden

Write-Host "Backend server started on http://localhost:8080" -ForegroundColor Green

# Wait for backend to start
Write-Host "Waiting for backend to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# Start frontend in development mode
Write-Host "Starting frontend development server..." -ForegroundColor Cyan
Set-Location -Path "D:\Majar Projects\java-only\UI-Frontend"
Start-Process -FilePath "npm" -ArgumentList "run dev" -WindowStyle Hidden

# Display deployment information
Write-Host "`nLocal Deployment Completed!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host "Backend API: http://localhost:8080/api" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "H2 Database Console: http://localhost:8080/h2-console" -ForegroundColor Cyan

Write-Host "`nDeployment Options:" -ForegroundColor Yellow
Write-Host "- For Vercel (Frontend only): .\deploy.ps1 -deploy-to-vercel" -ForegroundColor Yellow
Write-Host "- For backend deployment: Use .\deploy-backend.ps1" -ForegroundColor Yellow
Write-Host "- Full deployment guide: See DEPLOYMENT_GUIDE.md" -ForegroundColor Yellow

Write-Host "`nApplication is ready!" -ForegroundColor Green
