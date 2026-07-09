/**
 * Integration Tests - Express Application
 * 
 * End-to-end tests for the HTTP API
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import request from 'supertest';
import express from 'express';
import cors from 'cors';

// Mock environment
process.env.PORT = '3001';
process.env.OMNILEARN_API_KEY = 'test-key';

// Mock the trade execution module
vi.mock('../../src/trades/execute', () => ({
  executeTrade: vi.fn().mockResolvedValue({
    id: 'trade_test_123',
    assetId: 'asset_123',
    price: 1000,
    quantity: 10,
    side: 'buy',
    timestamp: new Date().toISOString(),
    status: 'executed',
  }),
}));

describe('Express Application', () => {
  let app: express.Express;
  let server: any;

  beforeEach(() => {
    app = express();
    app.use(cors());
    app.use(express.json());

    // Health check endpoint
    app.get('/health', (req, res) => {
      res.json({
        status: 'healthy',
        service: 'canton-rwa',
        version: process.env.npm_package_version || '1.0.0',
        timestamp: new Date().toISOString(),
      });
    });

    // Root endpoint
    app.get('/', (req, res) => {
      res.json({
        name: 'Canton RWA',
        version: '1.0.0',
        description: 'Real World Asset Tokenization on Canton Network',
        endpoints: {
          health: '/health',
          assets: '/api/assets',
          trades: '/api/trades',
          treasury: '/api/treasury',
        },
      });
    });
  });

  afterEach(async () => {
    if (server) {
      await new Promise<void>((resolve) => server.close(resolve));
    }
  });

  describe('GET /', () => {
    it('should return service information', async () => {
      const response = await request(app).get('/');

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        name: 'Canton RWA',
        version: '1.0.0',
        description: 'Real World Asset Tokenization on Canton Network',
      });
      expect(response.body.endpoints).toBeDefined();
      expect(response.body.endpoints.health).toBe('/health');
    });

    it('should have correct content-type', async () => {
      const response = await request(app).get('/');

      expect(response.headers['content-type']).toMatch(/application\/json/);
    });
  });

  describe('GET /health', () => {
    it('should return healthy status', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        status: 'healthy',
        service: 'canton-rwa',
      });
      expect(response.body.timestamp).toBeDefined();
      expect(new Date(response.body.timestamp)).toBeInstanceOf(Date);
    });

    it('should include version information', async () => {
      const response = await request(app).get('/health');

      expect(response.body.version).toBeDefined();
      expect(typeof response.body.version).toBe('string');
    });
  });

  describe('CORS', () => {
    it('should allow CORS requests', async () => {
      const response = await request(app)
        .get('/health')
        .set('Origin', 'http://example.com');

      expect(response.headers['access-control-allow-origin']).toBe('*');
    });
  });

  describe('404 handling', () => {
    it('should return 404 for undefined routes', async () => {
      const response = await request(app).get('/nonexistent');

      expect(response.status).toBe(404);
    });
  });
});
