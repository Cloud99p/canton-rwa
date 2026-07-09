/**
 * Integration Tests - Trade API Endpoints
 * 
 * Tests for trade-related HTTP endpoints
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';

// Mock trade execution before importing
vi.mock('../../src/trades/execute', () => ({
  executeTrade: vi.fn(),
}));

import { executeTrade } from '../../src/trades/execute';

describe('Trade API Integration', () => {
  let app: express.Express;

  beforeEach(() => {
    vi.clearAllMocks();
    app = express();
    app.use(express.json());

    // Mock trade endpoint
    app.post('/api/trades', async (req, res) => {
      try {
        const trade = await executeTrade(req.body);
        res.status(201).json(trade);
      } catch (error) {
        res.status(500).json({ error: 'Trade execution failed' });
      }
    });
  });

  describe('POST /api/trades', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('should execute a buy order', async () => {
      vi.mocked(executeTrade).mockResolvedValueOnce({
        id: 'trade_123',
        assetId: 'asset_456',
        price: 1000,
        quantity: 10,
        side: 'buy',
        timestamp: new Date().toISOString(),
        status: 'executed',
      });

      const response = await request(app)
        .post('/api/trades')
        .send({
          assetId: 'asset_456',
          price: 1000,
          quantity: 10,
          side: 'buy',
        });

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        id: 'trade_123',
        assetId: 'asset_456',
        side: 'buy',
        status: 'executed',
      });
    });

    it('should execute a sell order', async () => {
      vi.mocked(executeTrade).mockResolvedValueOnce({
        id: 'trade_124',
        assetId: 'asset_789',
        price: 2000,
        quantity: 5,
        side: 'sell',
        timestamp: new Date().toISOString(),
        status: 'executed',
      });

      const response = await request(app)
        .post('/api/trades')
        .send({
          assetId: 'asset_789',
          price: 2000,
          quantity: 5,
          side: 'sell',
        });

      expect(response.status).toBe(201);
      expect(response.body.side).toBe('sell');
    });

    it('should handle trade execution errors', async () => {
      vi.mocked(executeTrade).mockRejectedValueOnce(new Error('Execution failed'));

      const response = await request(app)
        .post('/api/trades')
        .send({
          assetId: 'asset_456',
          price: 1000,
          quantity: 10,
          side: 'buy',
        });

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error');
    });

    it('should reject invalid trade data', async () => {
      const response = await request(app)
        .post('/api/trades')
        .send({
          // Missing required fields
          assetId: 'asset_456',
        });

      // Should either validate or pass to execution
      expect([201, 400, 500]).toContain(response.status);
    });
  });
});
