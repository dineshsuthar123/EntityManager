# Entity Management System

A comprehensive full-stack application for managing entities with CRUD operations, authentication, reporting, and data visualization. Built with Spring Boot (backend) and React + TypeScript (frontend).

## 🚀 Features

### Core Functionality
- **Entity Management** - Complete CRUD operations with custom columns
- **User Authentication** - JWT-based secure login and registration
- **Advanced Search** - Powerful filtering and search capabilities
- **Dashboard** - Analytics and data visualization
- **Reports** - PDF report generation with custom templates
- **Import/Export** - CSV and Excel data management
- **Responsive Design** - Mobile-friendly interface

### Technical Features
- **RESTful API** - Clean API architecture
- **JWT Security** - Token-based authentication
- **File Handling** - Upload and download capabilities
- **Data Validation** - Frontend and backend validation
- **Error Handling** - Comprehensive error management
- **Logging** - Detailed application logging

## 🛠️ Technology Stack

### Backend
- **Spring Boot 3.x** - Main framework
- **Spring Security** - Authentication and authorization
- **Spring Data JPA** - Data persistence
- **H2 Database** - Development database
- **JWT** - Token-based authentication
- **Maven** - Build tool
- **Java 17** - Programming language

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type-safe development
- **Material-UI (MUI)** - Component library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Chart.js** - Data visualization

## 📋 Prerequisites

- Java 17 or higher
- Node.js 18.x or higher
- Maven 3.6+
- Git

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/dineshsuthar123/EntityManager.git
cd EntityManager
```

### 2. Backend Setup
```bash
cd project1/project1
./mvnw spring-boot:run
```
Backend will be available at: http://localhost:8080

### 3. Frontend Setup
```bash
cd ../../UI-Frontend
npm install
npm run dev
```
Frontend will be available at: http://localhost:3000

### 4. Access the Application
- Open your browser and navigate to http://localhost:3000
- Create a new account or use the default credentials
- Start managing your entities!

## 📁 Project Structure

```
├── project1/project1/          # Spring Boot Backend
│   ├── src/main/java/          # Java source code
│   │   └── com/example/project1/
│   │       ├── controller/     # REST controllers
│   │       ├── model/          # Entity models
│   │       ├── repository/     # Data repositories
│   │       ├── service/        # Business logic
│   │       ├── security/       # Security configuration
│   │       └── dto/            # Data transfer objects
│   ├── src/main/resources/     # Configuration files
│   │   ├── application.properties
│   │   ├── reports/            # Report templates
│   │   └── static/             # Static files
│   └── pom.xml                 # Maven configuration
├── UI-Frontend/                # React Frontend
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── services/           # API services
│   │   ├── types/              # TypeScript types
│   │   └── config/             # Configuration
│   ├── package.json
│   └── vite.config.ts
├── deploy-*.sh/ps1             # Deployment scripts
├── DEPLOYMENT_GUIDE.md         # Deployment documentation
└── README.md                   # This file
```

## 🔧 Configuration

### Backend Configuration
Edit `project1/project1/src/main/resources/application.properties`:

```properties
# Server configuration
server.port=8080

# Database configuration (H2 for development)
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=password

# JWT configuration
app.jwtSecret=mySecretKey
app.jwtExpirationMs=86400000

# File upload configuration
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB
```

### Frontend Configuration
Create environment files in `UI-Frontend/`:

**Development** (`.env.development`):
```env
VITE_API_URL=http://localhost:8080/api
```

**Production** (`.env.production`):
```env
VITE_API_URL=https://your-production-api-url.com/api
```

## 🔐 Authentication

The application uses JWT-based authentication:

1. **Register** a new account at `/signup`
2. **Login** with credentials at `/login`
3. **JWT token** is stored in localStorage
4. **Automatic logout** on token expiration

### Default User Roles
- `ROLE_USER` - Standard user access
- `ROLE_ADMIN` - Administrative access (if implemented)

## 📊 API Endpoints

### Authentication
- `POST /api/auth/signin` - User login
- `POST /api/auth/signup` - User registration

### Entity Management
- `GET /api/entities` - Get all entities
- `POST /api/entities` - Create new entity
- `GET /api/entities/{id}` - Get entity by ID
- `PUT /api/entities/{id}` - Update entity
- `DELETE /api/entities/{id}` - Delete entity

### Data Operations
- `GET /api/data/export` - Export data as CSV
- `POST /api/data/import` - Import data from CSV
- `GET /api/reports/{type}` - Generate reports

## 🚀 Deployment

### Quick Deployment

#### Vercel (Frontend)
```bash
./deploy-vercel.sh
```

#### Railway/Heroku (Backend)
```bash
./deploy-backend.ps1
```

#### Full Stack Deployment
```bash
./deploy.ps1
```

### Manual Deployment

See the comprehensive [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed deployment instructions including:
- Platform-specific deployments (Vercel, Railway, Heroku, Netlify)
- Docker containerization
- Environment configuration
- Security setup
- Monitoring and logging

## 🧪 Testing

### Backend Tests
```bash
cd project1/project1
./mvnw test
```

### Frontend Tests
```bash
cd UI-Frontend
npm test
```

### Integration Testing
```bash
./test-with-local-backend.ps1
```

## 🛠️ Development

### Adding New Features

1. **Backend**: Create controller, service, and repository
2. **Frontend**: Add components and API service calls
3. **Update types**: Add TypeScript definitions
4. **Test**: Write tests for new functionality

### Code Style
- Backend: Follow Spring Boot conventions
- Frontend: Use ESLint and Prettier
- Database: Use meaningful table and column names

## 🐛 Troubleshooting

### Common Issues

1. **Port conflicts**: Change ports in configuration files
2. **CORS errors**: Update CORS configuration in backend
3. **Database issues**: Check H2 console at http://localhost:8080/h2-console
4. **JWT errors**: Verify secret key and expiration settings

### Debug Mode
- Backend: Add `--debug` flag to spring-boot:run
- Frontend: Set `VITE_DEBUG=true` in environment

## 📚 Documentation

- [Frontend README](UI-Frontend/README.md) - Detailed frontend documentation
- [Deployment Guide](DEPLOYMENT_GUIDE.md) - Comprehensive deployment instructions
- [API Documentation](http://localhost:8080/swagger-ui.html) - Interactive API docs (if Swagger is enabled)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow existing code style
- Add tests for new features
- Update documentation
- Ensure all tests pass

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Dinesh Suthar** - *Initial work* - [dineshsuthar123](https://github.com/dineshsuthar123)

## 🙏 Acknowledgments

- Spring Boot community for excellent documentation
- React community for innovative frontend solutions
- Material-UI team for beautiful components
- All contributors and testers

## 📞 Support

If you encounter any issues or have questions:

1. Check the [troubleshooting section](#troubleshooting)
2. Review the [documentation](#documentation)
3. Create an issue on GitHub
4. Contact the development team

## 🔄 Changelog

### Version 1.0.0
- Initial release with core functionality
- Entity CRUD operations
- JWT authentication
- Dashboard and reporting
- Import/export capabilities

---

**Happy coding! 🚀**
