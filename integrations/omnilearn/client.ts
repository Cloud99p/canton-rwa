/**
 * OmniLearn SDK Client for Canton RWA
 * 
 * Connects Canton to the OmniLearn knowledge layer
 */

import { OmniLearnClient } from '@omnilearn/sdk';

export const omnilearnClient = new OmniLearnClient({
  apiKey: process.env.OMNILEARN_API_KEY!,
  apiBaseUrl: process.env.OMNILEARN_API_URL || 'https://api.omnilearn.ai',
  serviceName: 'canton-rwa',
  serviceVersion: process.env.npm_package_version || '1.0.0',
  domain: 'blockchain',
  enableLogging: process.env.NODE_ENV === 'development',
});

console.log('✅ OmniLearn client initialized for canton-rwa');
