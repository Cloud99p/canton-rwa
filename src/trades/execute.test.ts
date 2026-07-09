/**
 * Unit Tests - Trade Execution
 * 
 * Tests for the trade execution module
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { executeTrade, type ExecuteTradeParams, type Trade } from './execute';

// Mock the recorder module
vi.mock('../integrations/omnilearn/recorder', () => ({
  recordTradeExecution: vi.fn().mockResolvedValue(undefined),
}));

import { recordTradeExecution } from '../integrations/omnilearn/recorder';

describe('executeTrade', () => {
  const mockParams: ExecuteTradeParams = {
    assetId: 'asset_123',
    price: 1000,
    quantity: 10,
    side: 'buy',
    userId: 'user_456',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should execute a trade successfully', async () => {
    const trade = await executeTrade(mockParams);

    expect(trade).toBeDefined();
    expect(trade.assetId).toBe(mockParams.assetId);
    expect(trade.price).toBe(mockParams.price);
    expect(trade.quantity).toBe(mockParams.quantity);
    expect(trade.side).toBe(mockParams.side);
    expect(trade.status).toBe('executed');
    expect(trade.id).toMatch(/^trade_\d+$/);
    expect(trade.timestamp).toBeDefined();
  });

  it('should record trade to OmniLearn', async () => {
    await executeTrade(mockParams);

    expect(recordTradeExecution).toHaveBeenCalledTimes(1);
    expect(recordTradeExecution).toHaveBeenCalledWith({
      tradeId: expect.stringMatching(/^trade_\d+$/),
      assetId: mockParams.assetId,
      price: mockParams.price,
      quantity: mockParams.quantity,
      side: mockParams.side,
      userId: mockParams.userId,
    });
  });

  it('should handle sell orders', async () => {
    const sellParams: ExecuteTradeParams = {
      ...mockParams,
      side: 'sell',
    };

    const trade = await executeTrade(sellParams);

    expect(trade.side).toBe('sell');
    expect(recordTradeExecution).toHaveBeenCalledWith(
      expect.objectContaining({ side: 'sell' })
    );
  });

  it('should handle trades without userId', async () => {
    const paramsWithoutUser: ExecuteTradeParams = {
      assetId: mockParams.assetId,
      price: mockParams.price,
      quantity: mockParams.quantity,
      side: mockParams.side,
    };

    const trade = await executeTrade(paramsWithoutUser);

    expect(trade).toBeDefined();
    expect(recordTradeExecution).toHaveBeenCalledWith(
      expect.objectContaining({ userId: undefined })
    );
  });

  it('should generate unique trade IDs for consecutive trades', async () => {
    const trade1 = await executeTrade(mockParams);
    // Add small delay to ensure different timestamps
    await new Promise(resolve => setTimeout(resolve, 2));
    const trade2 = await executeTrade(mockParams);

    expect(trade1.id).not.toBe(trade2.id);
  });

  it('should include valid timestamp', async () => {
    const beforeTrade = Date.now();
    const trade = await executeTrade(mockParams);
    const afterTrade = Date.now();

    const tradeTimestamp = new Date(trade.timestamp).getTime();
    
    expect(tradeTimestamp).toBeGreaterThanOrEqual(beforeTrade);
    expect(tradeTimestamp).toBeLessThanOrEqual(afterTrade);
  });
});

describe('Trade interface', () => {
  it('should have all required fields', () => {
    const mockTrade: Trade = {
      id: 'trade_123',
      assetId: 'asset_456',
      price: 1000,
      quantity: 10,
      side: 'buy',
      timestamp: new Date().toISOString(),
      status: 'executed',
    };

    expect(mockTrade.id).toBeDefined();
    expect(mockTrade.assetId).toBeDefined();
    expect(mockTrade.price).toBeDefined();
    expect(mockTrade.quantity).toBeDefined();
    expect(mockTrade.side).toBeDefined();
    expect(mockTrade.timestamp).toBeDefined();
    expect(mockTrade.status).toBeDefined();
  });

  it('should accept all valid status values', () => {
    const statuses: Array<'pending' | 'executed' | 'failed'> = [
      'pending',
      'executed',
      'failed',
    ];

    statuses.forEach((status) => {
      const trade: Trade = {
        id: 'trade_123',
        assetId: 'asset_456',
        price: 1000,
        quantity: 10,
        side: 'buy',
        timestamp: new Date().toISOString(),
        status,
      };
      expect(trade.status).toBe(status);
    });
  });
});
