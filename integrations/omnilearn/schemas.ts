/**
 * Canton Knowledge Schemas for OmniLearn
 * 
 * Register these schemas to enable structured knowledge recording
 */

import { omnilearnClient } from './client';

export async function registerCantonSchemas() {
  try {
    // Asset Issuance Schema
    await omnilearnClient.registerSchema({
      typeName: 'asset_issued',
      domain: 'blockchain',
      schema: {
        type: 'object',
        required: ['assetId', 'assetType', 'totalValue', 'issuer'],
        properties: {
          assetId: { type: 'string' },
          assetType: {
            type: 'string',
            enum: ['treasury-bond', 'corporate-bond', 'equity', 'real-estate'],
          },
          totalValue: { type: 'number', minimum: 0 },
          currency: { type: 'string', default: 'USD' },
          issuer: { type: 'string' },
          jurisdiction: { type: 'string' },
        },
      },
    });

    // Trade Execution Schema
    await omnilearnClient.registerSchema({
      typeName: 'trade_executed',
      domain: 'blockchain',
      schema: {
        type: 'object',
        required: ['tradeId', 'assetId', 'price', 'quantity'],
        properties: {
          tradeId: { type: 'string' },
          assetId: { type: 'string' },
          price: { type: 'number' },
          quantity: { type: 'number' },
          side: { type: 'string', enum: ['buy', 'sell'] },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    });

    // Treasury Operation Schema
    await omnilearnClient.registerSchema({
      typeName: 'treasury_operation',
      domain: 'blockchain',
      schema: {
        type: 'object',
        required: ['operationId', 'type', 'amount'],
        properties: {
          operationId: { type: 'string' },
          type: {
            type: 'string',
            enum: ['rebalance', 'distribution', 'collection'],
          },
          amount: { type: 'number' },
          assetId: { type: 'string' },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    });

    console.log('✅ Canton schemas registered with OmniLearn');
  } catch (error) {
    console.error('❌ Failed to register schemas:', error);
  }
}
