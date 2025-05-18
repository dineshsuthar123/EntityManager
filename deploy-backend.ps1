# deploy-backend.ps1 - Script to deploy the Spring Boot backend to Render.com

Write-Host "Preparing for backend deployment..." -ForegroundColor Cyan

# Navigate to the backend directory
Set-Location -Path ".\project1\project1"

Write-Host "Building the backend application..." -ForegroundColor Cyan
mvn clean package -DskipTests

Write-Host "Backend JAR file created successfully!" -ForegroundColor Green
Write-Host "The JAR file is located at: project1\project1\target\project1-1.0-SNAPSHOT.jar" -ForegroundColor Cyan

Write-Host "Deployment instructions for Render.com:" -ForegroundColor Yellow
Write-Host "1. Create a new Web Service on Render.com" -ForegroundColor White
Write-Host "2. Connect your GitHub repository" -ForegroundColor White
Write-Host "3. Configure the following settings:" -ForegroundColor White
Write-Host "   - Build Command: mvn clean package -DskipTests" -ForegroundColor White
Write-Host "   - Start Command: java -jar target/project1-1.0-SNAPSHOT.jar" -ForegroundColor White
Write-Host "   - Root Directory: project1/project1" -ForegroundColor White
Write-Host "4. Add environment variables if needed" -ForegroundColor White
Write-Host "5. Deploy the service" -ForegroundColor White

Write-Host ""
Write-Host "After deployment, update your frontend .env.production file with the new backend URL." -ForegroundColor Cyan
Write-Host "Example: VITE_API_URL=https://your-render-app.onrender.com/api" -ForegroundColor Cyan

# Return to the root directory
Set-Location -Path "..\.."
