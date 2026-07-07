/**
 * Canton RWA - Main Entry Point
 * 
 * Real World Asset Tokenization on Canton Network
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'canton-rwa',
    version: process.env.npm_package_version || '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
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

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Canton RWA server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});

export default app;
