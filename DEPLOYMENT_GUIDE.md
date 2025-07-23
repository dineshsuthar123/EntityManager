# Entity Management System - Deployment Guide

A comprehensive guide for deploying the Entity Management System (Spring Boot backend + React frontend) to various platforms.

## 📋 Overview

This system consists of:
- **Backend**: Spring Boot REST API with JWT authentication
- **Frontend**: React + TypeScript application with Material-UI
- **Database**: H2 (development) / PostgreSQL (production)

## 🛠️ Prerequisites

- Node.js 18.x or higher
- Java 17 or higher
- Maven 3.6+
- Git
- Docker (optional, for containerized deployment)

## 🚀 Quick Start

### 1. Local Development Setup

```bash
# Clone the repository
git clone <repository-url>
cd java-only

# Backend setup
cd project1/project1
./mvnw spring-boot:run

# Frontend setup (new terminal)
cd ../../UI-Frontend
npm install
npm run dev
```

Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080

### 2. Production Deployment

Choose your deployment platform:

#### Option A: Vercel (Frontend) + Railway/Heroku (Backend)
```bash
# Deploy frontend to Vercel
./deploy-vercel.sh

# Deploy backend to Railway/Heroku
./deploy-backend.sh
```

#### Option B: Docker Deployment
```bash
# Build and run with Docker
./deploy-docker.sh
```

## 📁 Available Deployment Scripts

### `deploy-vercel.sh` / `deploy-vercel.ps1`
Deploys the React frontend to Vercel with optimized build settings.

**Features:**
- Automatic Vercel CLI installation
- Environment variable configuration
- Production-optimized build
- CORS setup guidance

**Usage:**
```bash
# Linux/Mac
chmod +x deploy-vercel.sh
./deploy-vercel.sh

# Windows
./deploy-vercel.ps1
```

### `deploy-backend.ps1`
Deploys the Spring Boot backend to cloud platforms (Railway, Heroku, etc.).

**Features:**
- JAR file packaging
- Environment configuration
- Database setup
- Cloud platform deployment

**Usage:**
```powershell
./deploy-backend.ps1
```

### `deploy.ps1`
Complete full-stack deployment script for both frontend and backend.

**Features:**
- Sequential deployment of backend and frontend
- Environment synchronization
- Health checks
- Rollback capabilities

**Usage:**
```powershell
./deploy.ps1
```

## 🌐 Platform-Specific Deployment

### Vercel (Frontend)

1. **Prepare for deployment:**
   ```bash
   cd UI-Frontend
   npm run build:vercel
   ```

### Railway (Backend)

1. **Prepare Spring Boot application:**
   ```bash
   cd project1/project1
   ./mvnw clean package -DskipTests
   ```

2. **Create `railway.toml`:**
   ```toml
   [build]
   builder = "NIXPACKS"
   
   [deploy]
   startCommand = "java -jar target/project1-1.0-SNAPSHOT.jar"
   
   [env]
   PORT = "8080"
   ```

3. **Deploy:**
   ```bash
   railway login
   railway link
   railway up
   ```

### Heroku (Backend)

1. **Create `Procfile`:**
   ```
   web: java -jar target/project1-1.0-SNAPSHOT.jar --server.port=$PORT
   ```

2. **Create `system.properties`:**
   ```
   java.runtime.version=17
   ```

3. **Deploy:**
   ```bash
   heroku create your-app-name
   git push heroku main
   ```

## 🔧 Environment Configuration

### Backend Environment Variables

```env
# Database
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/entitydb
SPRING_DATASOURCE_USERNAME=username
SPRING_DATASOURCE_PASSWORD=password

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRATION=86400

# Server
SERVER_PORT=8080
SPRING_PROFILES_ACTIVE=prod
```

### Frontend Environment Variables

```env
# API Configuration
VITE_API_URL=https://your-backend-api-url.com/api

# Optional: Debug mode
VITE_DEBUG=false
```

## 🔐 Security Configuration

### CORS Setup (Backend)
```java
@CrossOrigin(origins = {
    "http://localhost:3000",
    "https://your-frontend-domain.vercel.app"
})
```

### JWT Configuration
- Use strong secret keys (minimum 256 bits)
- Set appropriate expiration times
- Implement refresh token mechanism

## 🚨 Troubleshooting

### Common Deployment Issues

1. **CORS Errors**
   ```java
   // Add allowed origins in SecurityConfig
   .antMatchers("/api/**").permitAll()
   ```

2. **Environment Variable Issues**
   ```bash
   # Check if variables are set
   echo $VITE_API_URL
   ```

3. **Build Failures**
   ```bash
   # Clear caches
   npm run clean
   ./mvnw clean
   ```

4. **Database Connection Issues**
   ```properties
   # Check database URL format
   spring.datasource.url=jdbc:postgresql://host:port/database
   ```

### Debug Commands

```bash
# Check backend logs
heroku logs --tail -a your-backend-app

# Check frontend deployment
vercel logs

# Test API endpoints
curl -X GET https://your-api-url.com/api/health
```

## 📞 Support

For deployment issues:
1. Check the troubleshooting section
2. Review platform-specific documentation
3. Create an issue in the repository
4. Contact the development team

## 📄 License

This deployment guide is part of the Entity Management System project and follows the same license terms.
   # On Windows
   .\deploy-vercel.ps1
   
   # On Linux/Mac
   ./deploy-vercel.sh
   ```
   
   This script will:
   - Guide you through the deployment process
   - Help you set up environment variables correctly
   - Provide options for testing with local or deployed backends
   - Handle TypeScript build issues

3. Testing with a local backend:
   ```
   # After deploying to Vercel
   .\test-with-local-backend.ps1
   ```
   
   This script will:
   - Create a tunnel to expose your local backend to the internet
   - Guide you through updating your Vercel environment variables
   - Allow you to test your deployed frontend with your local backend

## CORS Configuration

If your frontend and backend are hosted on different domains, make sure the CORS configuration in the backend allows requests from your frontend domain:

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
            .allowedOrigins("https://your-vercel-app.vercel.app")
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            .allowedHeaders("*")
            .allowCredentials(true);
    }
}
```

## Troubleshooting

### "Access Denied" Issues
- Check that your JWT token is being properly passed in HTTP requests
- Verify that the roles in the token match the required roles in the endpoints
- Ensure that the CORS configuration allows your frontend origin

### API Connection Issues
- Verify the API URL in the frontend configuration
- Check that the backend server is running and accessible
- Check for network restrictions or firewall issues

### Build Issues
- Clear npm cache: `npm cache clean --force`
- Delete node_modules and reinstall: `rm -rf node_modules && npm install`
- Update dependencies to compatible versions

### TypeScript Errors with Material UI v7
The project has TypeScript errors related to Material UI v7 Grid components requiring a "component" prop. A workaround has been implemented:

1. Created a custom GridItem and GridContainer component in `src/components/utils/` that adds the required component="div" prop
2. Added a build script that bypasses TypeScript checking for Vercel deployment

To deploy with the workaround:
```bash
# Use the specialized Vercel deployment script
./deploy-vercel.ps1  # Windows PowerShell
# or
./deploy-vercel.sh   # Linux/Mac
```
   cd UI-Frontend
   npm install -g vercel
   vercel login
   vercel --prod
   ```

3. Alternative: Use the deployment script:
   ```
   ./deploy.ps1 -deploy-to-vercel
   ```

## CORS Configuration

Make sure your backend allows requests from your Vercel domain:

1. If using a specific domain, add it to the `@CrossOrigin` annotation in your controllers
2. For production, update all `@CrossOrigin` annotations with your Vercel domain

## Testing the Deployment

1. After deployment, test the following features:
   - User authentication
   - Entity listing and filtering
   - Advanced search
   - Import/Export functionality
   
2. Check network requests to ensure proper communication between frontend and backend

3. Verify authentication tokens are being properly passed and refreshed
