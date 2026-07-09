/**
 * Integration Tests - OmniLearn Recorder
 * 
 * Tests for recording events to OmniLearn
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  recordAssetIssuance,
  recordTradeExecution,
  recordTreasuryOperation,
} from './recorder';
import { omnilearnClient } from './client';

// Mock the OmniLearn client
vi.mock('./client', () => ({
  omnilearnClient: {
    record: vi.fn().mockResolvedValue(undefined),
    recordAndWait: vi.fn().mockResolvedValue(undefined),
  },
}));

describe('recordAssetIssuance', () => {
  const mockAssetData = {
    assetId: 'asset_123',
    assetType: 'treasury_bond',
    totalValue: 1000000,
    issuer: 'US_Treasury',
    currency: 'USD',
    jurisdiction: 'US',
    userId: 'user_456',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should record asset issuance to OmniLearn', async () => {
    await recordAssetIssuance(mockAssetData);

    expect(omnilearnClient.record).toHaveBeenCalledTimes(1);
    expect(omnilearnClient.record).toHaveBeenCalledWith({
      type: 'asset_issued',
      data: mockAssetData,
      metadata: {
        userId: mockAssetData.userId,
        timestamp: expect.any(String),
      },
    });
  });

  it('should handle optional fields', async () => {
    const minimalData = {
      assetId: 'asset_789',
      assetType: 'corporate_bond',
      totalValue: 500000,
      issuer: 'Corp_Inc',
    };

    await recordAssetIssuance(minimalData);

    expect(omnilearnClient.record).toHaveBeenCalledWith({
      type: 'asset_issued',
      data: minimalData,
      metadata: {
        userId: undefined,
        timestamp: expect.any(String),
      },
    });
  });

  it('should not throw on OmniLearn errors', async () => {
    vi.mocked(omnilearnClient.record).mockRejectedValueOnce(
      new Error('OmniLearn API error')
    );

    await expect(recordAssetIssuance(mockAssetData)).resolves.not.toThrow();
  });

  it('should log error on failure', async () => {
    const error = new Error('Recording failed');
    vi.mocked(omnilearnClient.record).mockRejectedValueOnce(error);

    await recordAssetIssuance(mockAssetData);

    expect(console.error).toHaveBeenCalledWith(
      '❌ Failed to record asset issuance:',
      error
    );
  });
});

describe('recordTradeExecution', () => {
  const mockTradeData = {
    tradeId: 'trade_123',
    assetId: 'asset_456',
    price: 1000,
    quantity: 10,
    side: 'buy' as const,
    userId: 'user_789',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should record trade execution using recordAndWait', async () => {
    await recordTradeExecution(mockTradeData);

    expect(omnilearnClient.recordAndWait).toHaveBeenCalledTimes(1);
    expect(omnilearnClient.recordAndWait).toHaveBeenCalledWith({
      type: 'trade_executed',
      data: mockTradeData,
      metadata: {
        userId: mockTradeData.userId,
        timestamp: expect.any(String),
      },
    });
  });

  it('should handle different trade sides', async () => {
    const sellData = { ...mockTradeData, side: 'sell' as const };

    await recordTradeExecution(sellData);

    expect(omnilearnClient.recordAndWait).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ side: 'sell' }),
      })
    );
  });

  it('should not throw on OmniLearn errors', async () => {
    vi.mocked(omnilearnClient.recordAndWait).mockRejectedValueOnce(
      new Error('OmniLearn API error')
    );

    await expect(recordTradeExecution(mockTradeData)).resolves.not.toThrow();
  });
});

describe('recordTreasuryOperation', () => {
  const mockTreasuryData = {
    operationId: 'op_123',
    type: 'rebalance' as const,
    amount: 500000,
    assetId: 'asset_456',
    userId: 'user_789',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should record treasury rebalance operation', async () => {
    await recordTreasuryOperation(mockTreasuryData);

    expect(omnilearnClient.record).toHaveBeenCalledTimes(1);
    expect(omnilearnClient.record).toHaveBeenCalledWith({
      type: 'treasury_operation',
      data: mockTreasuryData,
      metadata: {
        userId: mockTreasuryData.userId,
        timestamp: expect.any(String),
      },
    });
  });

  it('should handle distribution operations', async () => {
    const distributionData = {
      ...mockTreasuryData,
      type: 'distribution' as const,
    };

    await recordTreasuryOperation(distributionData);

    expect(omnilearnClient.record).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ type: 'distribution' }),
      })
    );
  });

  it('should handle collection operations', async () => {
    const collectionData = {
      ...mockTreasuryData,
      type: 'collection' as const,
    };

    await recordTreasuryOperation(collectionData);

    expect(omnilearnClient.record).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ type: 'collection' }),
      })
    );
  });

  it('should handle operations without assetId', async () => {
    const dataWithoutAsset = {
      operationId: 'op_456',
      type: 'rebalance' as const,
      amount: 250000,
    };

    await recordTreasuryOperation(dataWithoutAsset);

    expect(omnilearnClient.record).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'treasury_operation',
        data: expect.objectContaining({
          operationId: 'op_456',
          type: 'rebalance',
          amount: 250000,
        }),
      })
    );
  });

  it('should not throw on OmniLearn errors', async () => {
    vi.mocked(omnilearnClient.record).mockRejectedValueOnce(
      new Error('OmniLearn API error')
    );

    await expect(recordTreasuryOperation(mockTreasuryData)).resolves.not.toThrow();
  });
});
