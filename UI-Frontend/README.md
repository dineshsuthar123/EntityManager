# Entity Management System - Frontend

A modern React application built with TypeScript, Vite, and Material-UI for managing entities with full CRUD operations, authentication, reporting, and data visualization.

## 🚀 Features

- **User Authentication** - Secure login and registration with JWT tokens
- **Entity Management** - Complete CRUD operations for entities
- **Dashboard** - Visual analytics and statistics
- **Advanced Search** - Powerful filtering and search capabilities
- **Reports** - Generate and download PDF reports
- **Import/Export** - CSV and Excel data management
- **Custom Columns** - Dynamic field management
- **Responsive Design** - Mobile-friendly interface
- **Real-time Updates** - Live data synchronization

## 🛠️ Tech Stack

- **React 19** - Frontend framework
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Material-UI (MUI)** - UI component library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Chart.js** - Data visualization
- **JWT** - Authentication tokens
- **File-saver** - File download utilities

## 📋 Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager
- Backend API server running (Spring Boot application)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd UI-Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   
## 🚀 Development

### Start Development Server
```bash
npm run dev
```
The application will be available at `http://localhost:3000`

### Other Available Scripts

- `npm run build` - Build for production
- `npm run build:vercel` - Build with Vercel optimizations
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🏗️ Project Structure

```
src/
├── components/           # React components
│   ├── AdvancedSearch.tsx
│   ├── Dashboard.tsx
│   ├── ImportExportTools.tsx
│   ├── Login.tsx
│   ├── MyEntityForm.tsx
│   ├── MyEntityList.tsx
│   ├── Reports.tsx
│   ├── Signup.tsx
│   └── utils/           # Utility components
│       ├── GridContainer.tsx
│       └── GridItem.tsx
├── config/              # Configuration files
│   └── api-config.ts    # API endpoints configuration
├── services/            # API services
│   └── auth.service.ts  # Authentication service
├── types/               # TypeScript type definitions
│   └── MyEntityDTO.ts   # Entity type definitions
├── App.tsx              # Main application component
├── main.tsx            # Application entry point
└── index.css           # Global styles
```

## 🔐 Authentication

The application uses JWT-based authentication:

- **Login**: Users can sign in with username/password
- **Registration**: New users can create accounts
- **Token Management**: Automatic token refresh and storage
- **Protected Routes**: Secure access to authenticated features

### Authentication Flow
1. User logs in with credentials
2. Backend returns JWT token
3. Token stored in localStorage
4. Token included in API requests
5. Automatic logout on token expiration

## 📱 Features Overview

### Entity Management
- Create, read, update, delete entities
- Custom column support
- Bulk operations
- Advanced filtering

### Dashboard
- Entity statistics
- Data visualizations
- Quick actions
- Recent activities

### Reports
- PDF report generation
- Custom report templates
- Entity statistics reports
- Custom columns reports

### Import/Export
- CSV file import/export
- Excel file support
- Data validation
- Error handling

## 🌐 API Integration

The frontend communicates with a Spring Boot backend API:

```typescript
// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export const API_URLS = {
    AUTH: `${API_BASE_URL}/auth`,
    ENTITIES: `${API_BASE_URL}/entities`,
    IMPORT_EXPORT: `${API_BASE_URL}/data`
};
```

### API Endpoints Used
- `POST /api/auth/signin` - User authentication
- `POST /api/auth/signup` - User registration
- `GET /api/entities` - Fetch entities
- `POST /api/entities` - Create entity
- `PUT /api/entities/{id}` - Update entity
- `DELETE /api/entities/{id}` - Delete entity
- `GET /api/data/export` - Export data
- `POST /api/data/import` - Import data

## 🚀 Deployment

### Local Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

### Vercel Deployment

#### Using Deployment Script
```bash
# Make script executable (Linux/Mac)
chmod +x deploy-vercel.sh
./deploy-vercel.sh

# Windows PowerShell
./deploy-vercel.ps1
```

#### Manual Deployment
1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Set environment variables:
   ```bash
   # Create .env.production
   echo "VITE_API_URL=https://your-backend-api-url.com/api" > .env.production
   ```

4. Deploy:
   ```bash
   cd UI-Frontend
   vercel --prod
   ```

### Environment Variables for Production
Make sure to set these environment variables in your deployment platform:
- `VITE_API_URL` - Your production API URL

## 🎨 UI Components

### Material-UI Theme
The application uses Material-UI with a custom theme:
- Primary color scheme
- Responsive breakpoints
- Consistent typography
- Accessible design

### Key Components
- **MyEntityList**: Data grid with sorting and filtering
- **MyEntityForm**: Entity creation/editing form
- **Dashboard**: Analytics and charts
- **AdvancedSearch**: Complex search interface
- **Reports**: Report generation interface

## 🔧 Configuration

### API Configuration
Edit `src/config/api-config.ts` to configure API endpoints:

```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
```

### Vite Configuration
The `vite.config.ts` file contains build and development server settings:

```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
```

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Issues**
   - Check `VITE_API_URL` environment variable
   - Ensure backend server is running
   - Verify CORS configuration

2. **Authentication Problems**
   - Clear localStorage if tokens are corrupted
   - Check token expiration
   - Verify backend authentication endpoints

3. **Build Issues**
   - Run `npm install` to ensure dependencies are installed
   - Clear node_modules and reinstall if needed
   - Check for TypeScript errors

### Debug Mode
Enable debug logging by setting environment variables:
```env
VITE_DEBUG=true
```

## 📚 Dependencies

### Core Dependencies
- React 19.1.0
- TypeScript 5.x
- Vite 6.x
- Material-UI 7.x
- React Router 7.x
- Axios 1.x

### Development Dependencies
- ESLint - Code linting
- TypeScript - Type checking
- Vite plugins - Build optimization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review the API documentation

## 🔄 Updates

Keep the application updated:
```bash
npm update
```

Check for security vulnerabilities:
```bash
npm audit
npm audit fix
```
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
