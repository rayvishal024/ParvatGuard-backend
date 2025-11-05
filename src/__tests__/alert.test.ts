import request from 'supertest';
import app from '../server';
import { db } from '../config/database';
import { generateAccessToken } from '../config/jwt';

describe('Alert API', () => {
  let accessToken: string;

  beforeAll(async () => {
    // Run migrations and seeds
    await db.migrate.latest();
    await db.seed.run();

    // Generate token for test user
    const tokenPayload = {
      userId: '00000000-0000-0000-0000-000000000001',
      email: 'admin@parvatguard.com',
    };
    accessToken = generateAccessToken(tokenPayload);
  });

  afterAll(async () => {
    await db.destroy();
  });

  describe('POST /api/alert/log', () => {
    it('should log an alert successfully', async () => {
      const response = await request(app)
        .post('/api/alert/log')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          type: 'SOS',
          payload: {
            lat: 27.7172,
            lng: 86.7274,
            message: 'Need immediate help',
            timestamp: new Date().toISOString(),
          },
          delivery_method: 'sms',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('alert');
      expect(response.body.alert.type).toBe('SOS');
      expect(response.body.alert.status).toBe('pending');
    });

    it('should require authentication', async () => {
      const response = await request(app).post('/api/alert/log').send({
        type: 'SOS',
        payload: {
          lat: 27.7172,
          lng: 86.7274,
        },
      });

      expect(response.status).toBe(401);
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/alert/log')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          type: 'SOS',
          payload: {
            lat: 27.7172,
            // Missing lng
          },
        });

      expect(response.status).toBe(400);
    });

    it('should log LOW_BATTERY alert', async () => {
      const response = await request(app)
        .post('/api/alert/log')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          type: 'LOW_BATTERY',
          payload: {
            lat: 28.2638,
            lng: 84.0016,
            battery_level: 15,
            timestamp: new Date().toISOString(),
          },
        });

      expect(response.status).toBe(201);
      expect(response.body.alert.type).toBe('LOW_BATTERY');
    });
  });

  describe('GET /api/alert/history', () => {
    it('should get alert history for authenticated user', async () => {
      const response = await request(app)
        .get('/api/alert/history')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('alerts');
      expect(Array.isArray(response.body.alerts)).toBe(true);
    });

    it('should require authentication', async () => {
      const response = await request(app).get('/api/alert/history');

      expect(response.status).toBe(401);
    });
  });
});

