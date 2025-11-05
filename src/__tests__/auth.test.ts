import request from 'supertest';
import app from '../server';
import { db } from '../config/database';

describe('Auth API', () => {
  beforeAll(async () => {
    // Run migrations
    await db.migrate.latest();
    // Seed test data
    await db.seed.run();
  });

  afterAll(async () => {
    await db.destroy();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const response = await request(app).post('/api/auth/register').send({
        email: 'newuser@test.com',
        password: 'password123',
        name: 'New User',
      });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('tokens');
      expect(response.body.user.email).toBe('newuser@test.com');
      expect(response.body.tokens).toHaveProperty('accessToken');
      expect(response.body.tokens).toHaveProperty('refreshToken');
    });

    it('should not register with existing email', async () => {
      const response = await request(app).post('/api/auth/register').send({
        email: 'admin@parvatguard.com',
        password: 'password123',
        name: 'Duplicate',
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('already exists');
    });

    it('should validate required fields', async () => {
      const response = await request(app).post('/api/auth/register').send({
        email: 'invalid-email',
        password: 'short',
      });

      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      const response = await request(app).post('/api/auth/login').send({
        email: 'admin@parvatguard.com',
        password: 'admin123',
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('tokens');
      expect(response.body.tokens).toHaveProperty('accessToken');
    });

    it('should not login with invalid credentials', async () => {
      const response = await request(app).post('/api/auth/login').send({
        email: 'admin@parvatguard.com',
        password: 'wrongpassword',
      });

      expect(response.status).toBe(401);
      expect(response.body.error).toContain('Invalid');
    });
  });

  describe('POST /api/auth/refresh', () => {
    it('should refresh access token with valid refresh token', async () => {
      // First login to get tokens
      const loginResponse = await request(app).post('/api/auth/login').send({
        email: 'admin@parvatguard.com',
        password: 'admin123',
      });

      const refreshToken = loginResponse.body.tokens.refreshToken;

      // Use refresh token
      const response = await request(app).post('/api/auth/refresh').send({
        refreshToken,
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('accessToken');
    });
  });
});

