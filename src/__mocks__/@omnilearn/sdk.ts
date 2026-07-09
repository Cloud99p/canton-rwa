/**
 * Mock OmniLearn SDK for Testing
 * 
 * This mock is used during testing to avoid dependency on the actual SDK
 */

export interface OmniLearnRecordParams {
  type: string;
  data: Record<string, any>;
  metadata?: Record<string, any>;
}

export interface OmniLearnClientConfig {
  apiKey: string;
  apiBaseUrl?: string;
  serviceName: string;
  serviceVersion?: string;
  domain?: string;
  enableLogging?: boolean;
}

export class OmniLearnClient {
  private config: OmniLearnClientConfig;

  constructor(config: OmniLearnClientConfig) {
    this.config = config;
    if (config.enableLogging) {
      console.log('[Mock OmniLearn] Client initialized for', config.serviceName);
    }
  }

  async record(params: OmniLearnRecordParams): Promise<void> {
    // Mock implementation - just log in test mode
    if (this.config.enableLogging) {
      console.log('[Mock OmniLearn] Recorded:', params.type);
    }
    return Promise.resolve();
  }

  async recordAndWait(params: OmniLearnRecordParams): Promise<void> {
    // Mock implementation with slight delay to simulate network
    await new Promise(resolve => setTimeout(resolve, 10));
    if (this.config.enableLogging) {
      console.log('[Mock OmniLearn] Recorded and waited:', params.type);
    }
    return Promise.resolve();
  }
}

export default OmniLearnClient;
