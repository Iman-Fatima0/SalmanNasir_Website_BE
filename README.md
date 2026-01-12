# Elcandi Website Backend

## Project Structure

```
├── src/                    # Source code
│   ├── app.js             # Express app configuration
│   ├── server.js          # Server entry point
│   ├── config/            # Configuration files
│   │   ├── database.js    # Database configuration
│   │   ├── env.js         # Environment variables
│   │   ├── constants.js   # Application constants
│   │   └── passport.js    # Passport OAuth strategies
│   ├── controllers/       # Request handlers
│   │   └── authController.js
│   ├── services/          # Business logic layer
│   │   ├── authService.js
│   │   └── emailService.js
│   ├── models/            # Data models
│   │   └── User.js
│   ├── routes/            # API routes
│   │   └── authRoutes.js
│   ├── middleware/        # Custom middleware
│   │   ├── auth.js        # Authentication
│   │   ├── errorHandler.js # Error handling
│   │   ├── validation.js  # Request validation
│   │   └── logger.js      # Request logging
│   ├── utils/             # Utility functions
│   │   ├── logger.js      # Logger utility
│   │   ├── response.js    # API response helpers
│   │   ├── errors.js      # Custom errors
│   │   ├── helpers.js      # General helpers
│   │   └── validators.js  # Validation utilities
│   ├── validators/        # Validation schemas
│   │   └── authSchemas.js # Joi schemas
│   ├── repositories/      # Data access layer
│   │   └── userRepository.js
│   ├── dto/               # Data Transfer Objects
│   ├── types/             # TypeScript types (if using TS)
│   ├── migrations/        # Database migrations
│   │   └── 001_create_users_table.js
│   └── seeders/           # Database seeders
├── tests/                 # Test files
│   ├── unit/              # Unit tests
│   ├── integration/       # Integration tests
│   ├── e2e/               # End-to-end tests
│   ├── fixtures/          # Test data
│   └── mocks/             # Mock objects
├── docs/                  # Documentation
│   ├── api.md             # API documentation
│   └── architecture.md   # Architecture docs
├── scripts/               # Utility scripts
│   ├── migrate.js         # Migration script
│   ├── seed.js            # Seeding script
│   └── test.js            # Test runner
├── .env.example           # Environment variables template
└── .gitignore             # Git ignore rules
```

## Features

- ✅ User Registration & Login
- ✅ OAuth Authentication (Google, Facebook, LinkedIn, Apple)
- ✅ Password Reset via Email
- ✅ JWT Token Authentication
- ✅ PostgreSQL Database
- ✅ Input Validation
- ✅ Error Handling
- ✅ Security Best Practices

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Elcandi_Website_BE
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy `.env.example` to `.env` and fill in your configuration:
   ```bash
   cp .env.example .env
   ```

   Required environment variables:
   ```env
   # Server
   PORT=3000
   NODE_ENV=development

   # Database
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=elcandi_db
   DB_USER=postgres
   DB_PASSWORD=your_password

   # JWT
   JWT_SECRET=your_super_secret_jwt_key
   JWT_EXPIRES_IN=7d

   # OAuth - Google
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_CALLBACK_URL=/api/auth/google/callback

   # OAuth - Facebook
   FACEBOOK_APP_ID=your_facebook_app_id
   FACEBOOK_APP_SECRET=your_facebook_app_secret
   FACEBOOK_CALLBACK_URL=/api/auth/facebook/callback

   # OAuth - LinkedIn
   LINKEDIN_CLIENT_ID=your_linkedin_client_id
   LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
   LINKEDIN_CALLBACK_URL=/api/auth/linkedin/callback

   # OAuth - Apple
   APPLE_CLIENT_ID=your_apple_client_id
   APPLE_TEAM_ID=your_apple_team_id
   APPLE_KEY_ID=your_apple_key_id
   APPLE_PRIVATE_KEY=your_apple_private_key
   APPLE_CALLBACK_URL=/api/auth/apple/callback

   # Email (for password reset)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASSWORD=your_app_password
   SMTP_FROM=noreply@elcandi.com

   # Frontend URL
   FRONTEND_URL=http://localhost:3000

   # CORS
   CORS_ORIGIN=http://localhost:3000
   ```

4. **Set up PostgreSQL database**
   ```bash
   # Create database
   createdb elcandi_db

   # Or using psql
   psql -U postgres
   CREATE DATABASE elcandi_db;
   ```

5. **Run migrations** (optional - Sequelize will auto-sync in development)
   ```bash
   npm run migrate
   ```

6. **Start the server**
   ```bash
   # Development mode with auto-reload
   npm run dev

   # Production mode
   npm start
   ```

## API Endpoints

See [docs/API.md](./docs/API.md) for detailed API documentation.

### Authentication Endpoints

- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/google` - Google OAuth login
- `GET /api/auth/facebook` - Facebook OAuth login
- `GET /api/auth/linkedin` - LinkedIn OAuth login
- `GET /api/auth/apple` - Apple OAuth login
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token
- `GET /api/auth/me` - Get current user (requires authentication)

## OAuth Setup

### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/google/callback`

### Facebook OAuth
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app
3. Add Facebook Login product
4. Set OAuth redirect URI: `http://localhost:3000/api/auth/facebook/callback`

### LinkedIn OAuth
1. Go to [LinkedIn Developers](https://www.linkedin.com/developers/)
2. Create a new app
3. Add redirect URL: `http://localhost:3000/api/auth/linkedin/callback`
4. Request access to `r_emailaddress` and `r_liteprofile` scopes

### Apple OAuth
1. Go to [Apple Developer Portal](https://developer.apple.com/)
2. Create a new App ID
3. Create a Service ID
4. Generate a private key
5. Configure redirect URI: `http://localhost:3000/api/auth/apple/callback`

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run migrate` - Run database migrations
- `npm run seed` - Seed database

## Architecture

This backend follows a layered architecture:
- **Routes**: Define API endpoints
- **Controllers**: Handle HTTP requests/responses
- **Services**: Contain business logic
- **Repositories**: Handle data access
- **Models**: Define data structures

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Input validation with Joi
- SQL injection protection (Sequelize ORM)
- XSS protection (Helmet)
- CORS configuration
- Rate limiting ready
- Secure password reset tokens

## License

ISC
