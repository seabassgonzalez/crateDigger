# Discogs Clone - Phase 1

## Setup Instructions

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Database Setup

1. Create a PostgreSQL database:

```bash
createdb discogs_clone
```

2. Update the DATABASE_URL in `backend/.env` if needed:

```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/discogs_clone
```

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Start the backend server
npm run dev
```

The backend will run on http://localhost:3001

### Frontend Setup

In a new terminal:

```bash
cd frontend

# Install dependencies
npm install

# Start the frontend
npm run dev
```

The frontend will run on http://localhost:5173

## Testing the Application

1. **Health Check**: Visit http://localhost:3001/health to verify the backend is running

2. **Register a New User**:
   - Open http://localhost:5173
   - Enter an email and password
   - Click "Register"
   - You should see a success message

3. **Login**:
   - Use the same email and password
   - Click "Sign In"
   - You should see a welcome message

4. **Database Verification**:
   - Run `cd backend && npm run prisma:studio`
   - This opens Prisma Studio where you can see the created users

## Features Implemented

- ✅ React frontend with TypeScript and Material-UI
- ✅ Express backend with TypeScript
- ✅ PostgreSQL database with Prisma ORM
- ✅ JWT authentication (register, login, refresh tokens)
- ✅ Basic UI component library
- ✅ ESLint and Prettier configuration
- ✅ Git hooks with Husky

## API Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user (requires auth)

## Next Steps

Phase 2 will implement the core data models for artists, releases, and labels.
