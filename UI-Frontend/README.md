# UI Frontend Application

This is the frontend application built with React, TypeScript, and Vite.

## Development Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Run the development server:
   ```
   npm run dev
   ```

3. The application will start on `http://localhost:3000`.

## Production Build

1. Create production build:
   ```
   npm run build
   ```

2. Preview the production build locally:
   ```
   npm run preview
   ```

## Deployment to Vercel

### Prerequisites

- Vercel account
- Vercel CLI installed (`npm install -g vercel`)

### Steps for Deployment

1. Update the `.env.production` file with your backend API URL:
   ```
   VITE_API_URL=https://your-backend-api-url.com/api
   ```

2. Login to Vercel:
   ```
   vercel login
   ```

3. Deploy to Vercel:
   ```
   vercel
   ```

4. For production deployment:
   ```
   vercel --prod
   ```

5. Your application will be deployed to a URL provided by Vercel.

## Environment Variables

- `.env.development`: Used during development
  ```
  VITE_API_URL=http://localhost:8080/api
  ```

- `.env.production`: Used for production builds
  ```
  VITE_API_URL=https://your-backend-api-url.com/api
  ```

## API Configuration

The application uses centralized API endpoints defined in `src/config/api-config.ts`. If you need to add or modify API endpoints, update this file.
   ```
   npm run build
   ```

2. The build files will be in the `dist` directory.

## Deployment

### Local Deployment

Run the deployment script:

```powershell
./deploy.ps1
```

This will:
1. Stop any running processes on port 8080
2. Build and package the backend
3. Build the frontend
4. Start the backend server on port 8080
5. Start the frontend development server on port 3000

### Vercel Deployment

1. Make sure you have the Vercel CLI installed:
   ```
   npm install -g vercel
   ```

2. Login to Vercel (if you haven't already):
   ```
   vercel login
   ```

3. Update the `.env.production` file with your backend API URL:
   ```
   VITE_API_URL=https://your-backend-api-url.com/api
   ```

4. Deploy using the deployment script with the Vercel flag:
   ```powershell
   ./deploy.ps1 -deploy-to-vercel
   ```

5. Alternatively, deploy manually:
   ```
   vercel --prod
   ```

## Environment Configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
