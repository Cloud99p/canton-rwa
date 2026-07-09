/**
 * Test Setup - Canton RWA
 * 
 * Global test configuration and mocks
 */

import { vi } from 'vitest';

// Mock environment variables
process.env.OMNILEARN_API_KEY = 'test-api-key';
process.env.OMNILEARN_API_URL = 'http://localhost:4000';
process.env.NODE_ENV = 'test';

// Mock console.error to reduce noise in tests
vi.spyOn(console, 'error').mockImplementation(() => {});

// Global test utilities
export const mockTradeData = {
  assetId: 'asset_123',
  price: 1000,
  quantity: 10,
  side: 'buy' as const,
  userId: 'user_456',
};

export const mockAssetData = {
  assetId: 'asset_789',
  assetType: 'treasury_bond',
  totalValue: 1000000,
  issuer: 'US_Treasury',
  currency: 'USD',
  jurisdiction: 'US',
};
