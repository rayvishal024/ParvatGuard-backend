# API Examples

This document provides example cURL requests for all API endpoints.

## Base URL

```
http://localhost:3000/api
```

## Authentication

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
    "email": "admin@parvatguard.com",
    "password": "admin123"
  }'
```

Response:
```json
{
  "message": "Login successful",
  "user": {
    "id": "...",
    "email": "admin@parvatguard.com",
    "name": "Admin User"
  },
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Refresh Token

```bash
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }'
```

## Profile

### Get Profile

```bash
curl -X GET http://localhost:3000/api/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Update Profile

```bash
curl -X PUT http://localhost:3000/api/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Name",
    "phone": "+1234567890",
    "default_sos_message": "Custom SOS message"
  }'
```

## Emergency Contacts

### List Contacts

```bash
curl -X GET http://localhost:3000/api/profile/contact \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Create Contact

```bash
curl -X POST http://localhost:3000/api/profile/contact \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Emergency Contact",
    "phone": "+1234567890",
    "relationship": "Family",
    "is_primary": true
  }'
```

### Update Contact

```bash
curl -X PUT http://localhost:3000/api/profile/contact/CONTACT_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Contact",
    "phone": "+0987654321",
    "is_primary": false
  }'
```

### Delete Contact

```bash
curl -X DELETE http://localhost:3000/api/profile/contact/CONTACT_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Trips

### List All Trips

```bash
curl -X GET http://localhost:3000/api/trips
```

### Get Trip Details

```bash
curl -X GET http://localhost:3000/api/trips/TRIP_ID
```

## Alerts

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

### Log Low Battery Alert

```bash
curl -X POST http://localhost:3000/api/alert/log \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "LOW_BATTERY",
    "payload": {
      "lat": 28.2638,
      "lng": 84.0016,
      "battery_level": 15,
      "timestamp": "2024-01-01T12:00:00Z"
    }
  }'
```

### Get Alert History

```bash
curl -X GET http://localhost:3000/api/alert/history \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Health Check

```bash
curl -X GET http://localhost:3000/health
```

