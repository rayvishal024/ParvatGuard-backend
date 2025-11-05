# ParvatGuard Backend API

Node.js + TypeScript + Express backend API for the ParvatGuard mobile safety app.

## Tech Stack

- **Runtime**: Node.js 20+
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Knex.js migrations
- **Auth**: JWT (access + refresh tokens)
- **Validation**: Celebrate (Joi)
- **Logging**: Pino
- **Security**: Helmet, CORS, Rate Limiting
- **Testing**: Jest + Supertest
- **Optional**: Twilio (for server-side SMS)

## Project Structure

```
backend-api/
├── src/
│   ├── config/          # Configuration (database, JWT, logger)
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Auth, error handling, rate limiting
│   ├── models/          # Database models (Knex queries)
│   ├── routes/          # API route definitions
│   ├── __tests__/       # Test files
│   └── server.ts        # Express app entry point
├── migrations/          # Knex database migrations
├── seeds/               # Database seed files
├── knexfile.ts          # Knex configuration
├── docker-compose.yml   # Local Postgres + API setup
├── Dockerfile           # Production Docker image
└── package.json
```

## Quick Start

### Prerequisites

- Node.js 20+
- PostgreSQL 15+
- npm or yarn

### Local Development

1. **Clone and install dependencies:**

```bash
cd backend-api
npm install
```

2. **Set up environment variables:**

```bash
cp .env.sample .env
# Edit .env with your configuration
```

3. **Start PostgreSQL (using Docker):**

```bash
docker-compose up -d postgres
```

4. **Run migrations:**

```bash
npm run migrate:latest
```

5. **Seed database (optional):**

```bash
npm run seed:run
```

6. **Start development server:**

```bash
npm run dev
```

The API will be available at `http://localhost:3000`

### Using Docker Compose (Recommended for Local Dev)

Run everything (Postgres + API) in one command:

```bash
docker-compose up
```

This will:
- Start PostgreSQL container
- Wait for DB to be healthy
- Run migrations
- Seed database
- Start the API server in development mode

## Database Migrations

```bash
# Run all pending migrations
npm run migrate:latest

# Rollback last migration
npm run migrate:rollback

# Create new migration
npm run migrate:make migration_name

# Reset database (rollback + migrate + seed)
npm run db:reset
```

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

**Note**: Tests require a running PostgreSQL instance (or use Docker Compose).

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token

### Profile

- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile

### Emergency Contacts

- `GET /api/profile/contact` - List user's emergency contacts
- `POST /api/profile/contact` - Create emergency contact
- `PUT /api/profile/contact/:id` - Update emergency contact
- `DELETE /api/profile/contact/:id` - Delete emergency contact

### Trips (Treks)

- `GET /api/trips` - List all trips
- `GET /api/trips/:id` - Get trip details with pack metadata

### Alerts

- `POST /api/alert/log` - Log an alert (SOS, LOW_BATTERY, MANUAL)
- `GET /api/alert/history` - Get user's alert history

### Health Check

- `GET /health` - API health status

## Example cURL Requests

### Register

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Get Profile (with token)

```bash
curl -X GET http://localhost:3000/api/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Log Alert

```bash
curl -X POST http://localhost:3000/api/alert/log \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "SOS",
    "payload": {
      "lat": 27.7172,
      "lng": 86.7274,
      "message": "Need immediate help",
      "timestamp": "2024-01-01T12:00:00Z"
    },
    "delivery_method": "sms"
  }'
```

## Environment Variables

See `.env.sample` for all available options. Key variables:

- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` - Database connection
- `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET` - JWT signing secrets
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER` - Optional Twilio config
- `CORS_ORIGIN` - Allowed CORS origin (e.g., `http://localhost:19006` for Expo)

## Optional Twilio Integration

To enable server-side SMS sending via Twilio:

1. Sign up for a Twilio account
2. Get your Account SID, Auth Token, and phone number
3. Add to `.env`:

```
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```

**Note**: The mobile app primarily uses the device's SMS composer. Twilio serves as an optional server-side backup.

## Security Notes

- Passwords are hashed with bcrypt (10 rounds)
- JWT tokens have short expiry (15m access, 7d refresh)
- Rate limiting on all endpoints (stricter on auth)
- CORS configured for frontend origin
- Security headers via Helmet
- Input validation with Celebrate/Joi
- SQL injection protection via Knex parameterized queries

## Privacy & GDPR

- Minimal PII stored (email, name, phone)
- User can delete account and all associated data
- Alert logs retained for safety/audit purposes (configurable retention)
- No tracking or analytics by default
- See frontend README for local data encryption notes

## License

MIT

