# Backend Deployment Script for Cloud Platforms
# Supports Railway, Heroku, Render, and other Java-compatible platforms

param(
    [string]$Platform = "render",
    [string]$AppName = "entity-manager-backend"
)

Write-Host "Backend Deployment Script" -ForegroundColor Green
Write-Host "========================" -ForegroundColor Green
Write-Host "Platform: $Platform" -ForegroundColor Cyan
Write-Host "App Name: $AppName" -ForegroundColor Cyan

# Navigate to the backend directory
Write-Host "`nNavigating to backend directory..." -ForegroundColor Yellow
Set-Location -Path ".\project1\project1"

# Build the backend
Write-Host "`nBuilding Spring Boot application..." -ForegroundColor Yellow
mvn clean package -DskipTests

if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed! Please check the errors above." -ForegroundColor Red
    Set-Location -Path "..\.."
    exit 1
}

Write-Host "Build successful!" -ForegroundColor Green

# Platform-specific deployment
switch ($Platform.ToLower()) {
    "railway" {
        Write-Host "`nDeploying to Railway..." -ForegroundColor Cyan
        
        # Check if Railway CLI is installed
        $railwayInstalled = Get-Command railway -ErrorAction SilentlyContinue
        if (-not $railwayInstalled) {
            Write-Host "Railway CLI not found. Installing..." -ForegroundColor Yellow
            Write-Host "Please install Railway CLI from: https://railway.app/cli" -ForegroundColor Yellow
            Write-Host "Or run: npm install -g @railway/cli" -ForegroundColor Yellow
            
            $install = Read-Host "Install Railway CLI now? (y/n)"
            if ($install -eq "y") {
                npm install -g @railway/cli
            } else {
                Write-Host "Please install Railway CLI and run this script again." -ForegroundColor Red
                Set-Location -Path "..\.."
                exit 1
            }
        }
        
        # Create railway.toml if it doesn't exist
        if (-not (Test-Path "railway.toml")) {
            Write-Host "Creating railway.toml configuration..." -ForegroundColor Yellow
            @"
[build]
builder = "NIXPACKS"

[deploy]
startCommand = "java -jar target/project1-1.0-SNAPSHOT.jar"

[env]
PORT = "8080"
SPRING_PROFILES_ACTIVE = "prod"
"@ | Out-File -FilePath "railway.toml" -Encoding UTF8
        }
        
        Write-Host "Logging into Railway..." -ForegroundColor Yellow
        railway login
        
        Write-Host "Creating new Railway project..." -ForegroundColor Yellow
        railway link --name $AppName
        
        Write-Host "Deploying to Railway..." -ForegroundColor Yellow
        railway up
        
        Write-Host "`nDeployment to Railway completed!" -ForegroundColor Green
        Write-Host "Your backend will be available at: https://$AppName.railway.app" -ForegroundColor Cyan
    }
    
    "heroku" {
        Write-Host "`nDeploying to Heroku..." -ForegroundColor Cyan
        
        # Check if Heroku CLI is installed
        $herokuInstalled = Get-Command heroku -ErrorAction SilentlyContinue
        if (-not $herokuInstalled) {
            Write-Host "Heroku CLI not found. Please install from: https://devcenter.heroku.com/articles/heroku-cli" -ForegroundColor Red
            Set-Location -Path "..\.."
            exit 1
        }
        
        # Create Procfile if it doesn't exist
        if (-not (Test-Path "Procfile")) {
            Write-Host "Creating Procfile..." -ForegroundColor Yellow
            "web: java -jar target/project1-1.0-SNAPSHOT.jar --server.port=`$PORT" | Out-File -FilePath "Procfile" -Encoding UTF8
        }
        
        # Create system.properties if it doesn't exist
        if (-not (Test-Path "system.properties")) {
            Write-Host "Creating system.properties..." -ForegroundColor Yellow
            "java.runtime.version=17" | Out-File -FilePath "system.properties" -Encoding UTF8
        }
        
        Write-Host "Logging into Heroku..." -ForegroundColor Yellow
        heroku login
        
        Write-Host "Creating Heroku app..." -ForegroundColor Yellow
        heroku create $AppName
        
        # Initialize git if not already initialized
        if (-not (Test-Path ".git")) {
            git init
            git add .
            git commit -m "Initial commit"
        }
        
        Write-Host "Deploying to Heroku..." -ForegroundColor Yellow
        git push heroku main
        
        Write-Host "`nDeployment to Heroku completed!" -ForegroundColor Green
        Write-Host "Your backend will be available at: https://$AppName.herokuapp.com" -ForegroundColor Cyan
    }
    
    "render" {
        Write-Host "`nPreparing for Render.com deployment..." -ForegroundColor Cyan
        
        Write-Host "Backend JAR file created successfully!" -ForegroundColor Green
        Write-Host "The JAR file is located at: project1\project1\target\project1-1.0-SNAPSHOT.jar" -ForegroundColor Cyan

        Write-Host "`nDeployment instructions for Render.com:" -ForegroundColor Yellow
        Write-Host "1. Create a new Web Service on Render.com" -ForegroundColor White
        Write-Host "2. Connect your GitHub repository" -ForegroundColor White
        Write-Host "3. Configure the following settings:" -ForegroundColor White
        Write-Host "   - Build Command: mvn clean package -DskipTests" -ForegroundColor White
        Write-Host "   - Start Command: java -jar target/project1-1.0-SNAPSHOT.jar" -ForegroundColor White
        Write-Host "   - Root Directory: project1/project1" -ForegroundColor White
        Write-Host "4. Add environment variables if needed:" -ForegroundColor White
        Write-Host "   - SPRING_PROFILES_ACTIVE=prod" -ForegroundColor White
        Write-Host "5. Deploy the service" -ForegroundColor White
        
        Write-Host "`nYour backend will be available at: https://$AppName.onrender.com" -ForegroundColor Cyan
    }
    
    default {
        Write-Host "Unsupported platform: $Platform" -ForegroundColor Red
        Write-Host "Supported platforms: railway, heroku, render" -ForegroundColor Yellow
        Set-Location -Path "..\.."
        exit 1
    }
}

Write-Host "`nPost-Deployment Steps:" -ForegroundColor Yellow
Write-Host "1. Update your frontend's .env.production with the backend URL" -ForegroundColor White
Write-Host "2. Configure CORS in your backend to allow your frontend domain" -ForegroundColor White
Write-Host "3. Set up environment variables for production database if needed" -ForegroundColor White
Write-Host "4. Deploy your frontend using: .\deploy.ps1 -deploy-to-vercel" -ForegroundColor White

Write-Host "`nExample .env.production update:" -ForegroundColor Cyan
switch ($Platform.ToLower()) {
    "railway" { Write-Host "VITE_API_URL=https://$AppName.railway.app/api" -ForegroundColor White }
    "heroku" { Write-Host "VITE_API_URL=https://$AppName.herokuapp.com/api" -ForegroundColor White }
    "render" { Write-Host "VITE_API_URL=https://$AppName.onrender.com/api" -ForegroundColor White }
}

# Return to the root directory
Set-Location -Path "..\.."

Write-Host "`nBackend deployment process completed!" -ForegroundColor Green
