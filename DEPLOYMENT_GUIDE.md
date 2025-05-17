# Deployment Guide

This document provides guidance on deploying the application to production environments.

## Application Structure
- Backend: Spring Boot application located in `project1/project1`
- Frontend: React application located in `UI-Frontend`

## Changes Made for Deployment

1. **Environment Configuration**
   - Created `.env.development` and `.env.production` files
   - Added `src/config/api-config.ts` to centralize API URLs

2. **API URL References**
   - Updated hardcoded URLs in `auth.service.ts`, `App.tsx`, and `ImportExportTools.tsx`
   - All API URLs now come from environment variables

3. **Vite Configuration**
   - Updated `vite.config.ts` for production builds
   - Added proper port configuration

4. **Vercel Configuration**
   - Added `vercel.json` for Vercel deployment
   - Configured SPA routing

5. **Deployment Script**
   - Enhanced `deploy.ps1` with Vercel deployment options

## Deployment Steps

### Backend Deployment

1. Build the backend:
   ```
   cd project1/project1
   mvn clean package
   ```

2. Deploy the resulting JAR file to your server
   - The JAR is located at `project1/project1/target/project1-1.0-SNAPSHOT.jar`
   - Run with: `java -jar project1-1.0-SNAPSHOT.jar`

### Frontend Deployment to Vercel

1. Update the production API URL in `.env.production`:
   ```
   VITE_API_URL=https://your-backend-api-url.com/api
   ```

2. Deploy to Vercel:
   ```
   cd UI-Frontend
   vercel
   ```
   
   For production deployment:
   ```
   vercel --prod
   ```
   
3. Alternative: Use the deployment script:
   ```
   ./deploy.ps1
   ```

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
