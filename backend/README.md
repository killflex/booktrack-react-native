# BookTrack Backend

Personal book collection manager API built with Express.js, PostgreSQL, and Docker.

## Quick Start

### Prerequisites

- Docker & Docker Compose
- Node.js 18+ (for local development)

### Running with Docker

1. **Start the services:**

```bash
docker-compose up -d
```

2. **View logs:**

```bash
docker-compose logs -f api
```

3. **Stop services:**

```bash
docker-compose down
```

4. **Reset database (deletes all data):**

```bash
docker-compose down -v
docker-compose up -d
```

### Running Locally (Development)

1. **Install dependencies:**

```bash
cd backend
npm install
```

2. **Create `.env` file:**

```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Start PostgreSQL (with Docker):**

```bash
docker run -d \
  --name booktrack-db \
  -e POSTGRES_DB=booktrack_db \
  -e POSTGRES_USER=booktrack_user \
  -e POSTGRES_PASSWORD=secure_password_123 \
  -p 5432:5432 \
  postgres:15-alpine
```

4. **Run database schema:**

```bash
psql -h localhost -U booktrack_user -d booktrack_db -f database/init.sql
```

5. **Start development server:**

```bash
npm run dev
```

The API will be available at `http://localhost:3000`

## Project Structure

```
backend/
├── server.js              # Entry point
├── package.json           # Dependencies
├── Dockerfile            # Docker configuration
├── .env.example          # Environment variables template
├── database/
│   └── init.sql          # Database schema
├── config/
│   └── db.js             # Database connection
├── middleware/
│   ├── auth.js           # JWT authentication (Phase 2)
│   └── errorHandler.js   # Error handling
├── routes/
│   ├── auth.routes.js    # Auth endpoints (Phase 2)
│   └── books.routes.js   # Book endpoints (Phase 3)
├── controllers/
│   ├── auth.controller.js   # Auth logic (Phase 2)
│   └── books.controller.js  # Books logic (Phase 3)
├── models/
│   ├── user.model.js     # User queries (Phase 2)
│   └── book.model.js     # Book queries (Phase 3)
└── utils/
    ├── validation.js     # Input validation (Phase 2)
    └── jwt.js           # JWT utilities (Phase 2)
```

## API Endpoints

### Health Check

- `GET /health` - Check if API is running

### Authentication (Phase 2)

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify` - Verify JWT token

### Books (Phase 3)

- `POST /api/books` - Create book
- `GET /api/books` - Get all user's books
- `GET /api/books/:bookId` - Get single book
- `PUT /api/books/:bookId` - Update book
- `DELETE /api/books/:bookId` - Delete book
- `GET /api/books/statistics` - Get user statistics

## Environment Variables

See `.env.example` for all required variables:

- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port (default: 3000)
- `DB_HOST` - PostgreSQL host
- `DB_PORT` - PostgreSQL port
- `DB_NAME` - Database name
- `DB_USER` - Database user
- `DB_PASSWORD` - Database password
- `JWT_SECRET` - Secret key for JWT (min 32 chars)
- `JWT_EXPIRATION` - Token expiration (e.g., 24h)
- `CORS_ORIGIN` - CORS allowed origin

## Testing

**Test health endpoint:**

```bash
curl http://localhost:3000/health
```

**Expected response:**

```json
{
  "success": true,
  "message": "BookTrack API is running",
  "timestamp": "2025-12-18T10:30:00.000Z"
}
```

## Next Steps

- **Phase 2:** Implement authentication system (JWT, user registration/login)
- **Phase 3:** Implement book CRUD operations
- **Phase 4-8:** Build React Native mobile app

## Troubleshooting

**Port already in use:**

```bash
# Change PORT in .env or docker-compose.yml
```

**Database connection failed:**

```bash
# Check if PostgreSQL is running
docker ps
# Check logs
docker-compose logs db
```

**Container won't start:**

```bash
# Rebuild containers
docker-compose up -d --build
```
