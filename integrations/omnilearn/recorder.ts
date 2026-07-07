/**
 * Knowledge Recording Utilities for Canton RWA
 * 
 * Helper functions to record Canton events to OmniLearn
 */

import { omnilearnClient } from './client';

/**
 * Record asset issuance to OmniLearn
 */
export async function recordAssetIssuance(data: {
  assetId: string;
  assetType: string;
  totalValue: number;
  issuer: string;
  currency?: string;
  jurisdiction?: string;
  userId?: string;
}) {
  try {
    await omnilearnClient.record({
      type: 'asset_issued',
      data,
      metadata: {
        userId: data.userId,
        timestamp: new Date().toISOString(),
      },
    });
    console.log(`✅ Recorded asset issuance: ${data.assetId}`);
  } catch (error) {
    console.error('❌ Failed to record asset issuance:', error);
    // Don't fail business logic - just log error
  }
}

/**
 * Record trade execution to OmniLearn
 */
export async function recordTradeExecution(data: {
  tradeId: string;
  assetId: string;
  price: number;
  quantity: number;
  side: 'buy' | 'sell';
  userId?: string;
}) {
  try {
    await omnilearnClient.recordAndWait({
      type: 'trade_executed',
      data,
      metadata: {
        userId: data.userId,
        timestamp: new Date().toISOString(),
      },
    });
    console.log(`✅ Recorded trade execution: ${data.tradeId}`);
  } catch (error) {
    console.error('❌ Failed to record trade execution:', error);
  }
}

/**
 * Record treasury operation to OmniLearn
 */
export async function recordTreasuryOperation(data: {
  operationId: string;
  type: 'rebalance' | 'distribution' | 'collection';
  amount: number;
  assetId?: string;
  userId?: string;
}) {
  try {
    await omnilearnClient.record({
      type: 'treasury_operation',
      data,
      metadata: {
        userId: data.userId,
        timestamp: new Date().toISOString(),
      },
    });
    console.log(`✅ Recorded treasury operation: ${data.operationId}`);
  } catch (error) {
    console.error('❌ Failed to record treasury operation:', error);
  }
}
