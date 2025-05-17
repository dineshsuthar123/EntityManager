# Deployment script for Java Spring Boot + React application

Write-Host "Starting deployment process..." -ForegroundColor Green

# Stop any running processes on port 8080
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

# Build frontend
Write-Host "Building frontend..." -ForegroundColor Cyan
Set-Location -Path "D:\Majar Projects\java-only\UI-Frontend"
npm install
npm run build

# Deploy to Vercel (if parameter is provided)
if ($args[0] -eq "-deploy-to-vercel") {
    Write-Host "Deploying frontend to Vercel..." -ForegroundColor Cyan
    
    # Check if Vercel CLI is installed
    $vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue
    if (-not $vercelInstalled) {
        Write-Host "Installing Vercel CLI..." -ForegroundColor Yellow
        npm install -g vercel
    }
    
    # Deploy to Vercel
    vercel --prod
    
    Write-Host "Frontend deployed to Vercel!" -ForegroundColor Green
}

# Start backend server
Write-Host "Starting backend server..." -ForegroundColor Cyan
Set-Location -Path "D:\Majar Projects\java-only\project1\project1"
Start-Process -FilePath "java" -ArgumentList "-jar target\project1-1.0-SNAPSHOT.jar" -WindowStyle Hidden

Write-Host "Backend server started on http://localhost:8080" -ForegroundColor Green

# Wait for backend to start
Write-Host "Waiting for backend to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# Display deployment information
Write-Host "`nDeployment Information:" -ForegroundColor Green
Write-Host "--------------------" -ForegroundColor Green
Write-Host "Backend API: http://localhost:8080/api" -ForegroundColor Cyan

if ($args[0] -eq "-deploy-to-vercel") {
    Write-Host "Frontend: Your Vercel deployment URL (see above)" -ForegroundColor Cyan
} else {
    Write-Host "Frontend (local): http://localhost:3000" -ForegroundColor Cyan
    Write-Host "`nTo start the frontend locally:" -ForegroundColor Yellow
    Write-Host "cd 'D:\Majar Projects\java-only\UI-Frontend'" -ForegroundColor Yellow
    Write-Host "npm start" -ForegroundColor Yellow
}

Write-Host "`nTo deploy frontend to Vercel:" -ForegroundColor Yellow
Write-Host ".\deploy.ps1 -deploy-to-vercel" -ForegroundColor Yellow

Write-Host "`nSee DEPLOYMENT_GUIDE.md for more deployment options" -ForegroundColor Green

# Start frontend in development mode
Write-Host "Starting frontend server..." -ForegroundColor Cyan
Set-Location -Path "D:\Majar Projects\java-only\UI-Frontend"
Start-Process -FilePath "npm" -ArgumentList "start" -WindowStyle Hidden

Write-Host "Deployment completed!" -ForegroundColor Green
Write-Host "Backend API: http://localhost:8080" -ForegroundColor Cyan
Write-Host "Frontend (Dev): http://localhost:3000" -ForegroundColor Cyan

if ($args[0] -eq "-deploy-to-vercel") {
    Write-Host "Your application is now deployed to Vercel." -ForegroundColor Green
    Write-Host "IMPORTANT: Don't forget to update the production API URL in .env.production" -ForegroundColor Yellow
}
Write-Host "Application is running at: http://localhost:5173" -ForegroundColor Green
