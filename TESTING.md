# Testing Guide - Canton RWA

Complete guide for testing the Canton RWA package.

## 📋 Test Overview

| Test Type | Count | Location | Purpose |
|-----------|-------|----------|---------|
| **Unit Tests** | 20 | `src/**/*.test.ts`, `integrations/**/*.test.ts` | Test individual functions/modules |
| **Integration Tests** | 10 | `tests/integration/**/*.test.ts` | Test HTTP endpoints and API |
| **Total** | **30** | - | Full test coverage |

## 🚀 Quick Start

### Install Dependencies

```bash
# First time setup
npm install

# Or with dev dependencies explicitly
NODE_ENV=development npm install
```

### Run All Tests

```bash
# Run all tests once
npm test

# Run with coverage report
npm run test:coverage

# Run in watch mode (auto-rerun on changes)
npm run test:watch
```

## 📝 Test Commands

| Command | Description |
|---------|-------------|
| `npm test` | Run all tests once |
| `npm run test:watch` | Watch mode - auto-rerun on file changes |
| `npm run test:unit` | Run only unit tests |
| `npm run test:integration` | Run only integration tests |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run test:ui` | Open interactive test UI |

## 🧪 Test Structure

### Unit Tests

**Location:** `src/**/*.test.ts`, `integrations/**/*.test.ts`

Test individual functions and modules in isolation:

```bash
# Run unit tests only
npm run test:unit
```

**Test Files:**
- `src/trades/execute.test.ts` - Trade execution logic (8 tests)
- `integrations/omnilearn/recorder.test.ts` - OmniLearn recording (12 tests)

### Integration Tests

**Location:** `tests/integration/**/*.test.ts`

Test HTTP endpoints and full request/response cycles:

```bash
# Run integration tests only
npm run test:integration
```

**Test Files:**
- `tests/integration/app.test.ts` - Express app endpoints (6 tests)
- `tests/integration/trades.test.ts` - Trade API endpoints (4 tests)

## 📊 Coverage Report

Generate HTML coverage report:

```bash
npm run test:coverage
```

Open the report:
```bash
open coverage/index.html  # Mac
xdg-open coverage/index.html  # Linux
start coverage/index.html  # Windows
```

**Coverage Thresholds:**
- Branches: 70%
- Functions: 70%
- Lines: 70%
- Statements: 70%

## 🔧 Test Configuration

### Vitest Config (`vitest.config.ts`)

```typescript
{
  test: {
    globals: true,
    environment: 'node',
    include: [
      'src/**/*.test.ts',
      'integrations/**/*.test.ts',
      'tests/**/*.test.ts'
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      thresholds: { global: { branches: 70, functions: 70, lines: 70, statements: 70 } }
    }
  }
}
```

### Test Setup (`tests/setup.ts`)

Global test configuration:
- Mock environment variables
- Mock console.error to reduce noise
- Export test utilities and mock data

### Mocking

**OmniLearn SDK:** Mocked in `src/__mocks__/@omnilearn/sdk.ts`

The mock client is automatically used in test mode:
```typescript
if (process.env.NODE_ENV === 'test') {
  // Use mock
} else {
  // Use real SDK
}
```

## ✍️ Writing New Tests

### Unit Test Example

```typescript
import { describe, it, expect, vi } from 'vitest';
import { executeTrade } from './execute';

// Mock dependencies
vi.mock('../integrations/omnilearn/recorder', () => ({
  recordTradeExecution: vi.fn().mockResolvedValue(undefined),
}));

describe('executeTrade', () => {
  it('should execute a trade successfully', async () => {
    const trade = await executeTrade({
      assetId: 'asset_123',
      price: 1000,
      quantity: 10,
      side: 'buy',
    });

    expect(trade).toBeDefined();
    expect(trade.status).toBe('executed');
  });
});
```

### Integration Test Example

```typescript
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import express from 'express';

describe('GET /health', () => {
  let app: express.Express;

  beforeEach(() => {
    app = express();
    app.get('/health', (req, res) => {
      res.json({ status: 'healthy' });
    });
  });

  it('should return healthy status', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ status: 'healthy' });
  });
});
```

## 🐛 Troubleshooting

### Tests Not Running

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
NODE_ENV=development npm install
```

### Mock Issues

```bash
# Ensure NODE_ENV is set
NODE_ENV=test npm test
```

### Coverage Not Generating

```bash
# Install coverage provider
npm install @vitest/coverage-v8 --save-dev
npm run test:coverage
```

### Import Errors

Make sure you're using `.ts` extension in imports and that all dependencies are installed:

```bash
npm install
```

## 🎯 Best Practices

1. **Name tests descriptively** - Use `should do X when Y` pattern
2. **Test one thing per test** - Keep tests focused and atomic
3. **Use mocks for external dependencies** - Don't call real APIs in tests
4. **Arrange-Act-Assert pattern** - Structure tests clearly
5. **Test edge cases** - Null, undefined, empty arrays, errors
6. **Keep tests fast** - Avoid unnecessary delays
7. **Run tests frequently** - Use watch mode during development

## 📈 CI/CD Integration

Add to your CI pipeline:

```yaml
# Example GitHub Actions
- name: Install dependencies
  run: NODE_ENV=development npm install

- name: Run tests
  run: npm test

- name: Upload coverage
  uses: codecov/codecov-action@v3
  with:
    files: ./coverage/coverage-final.json
```

## 🎭 Test Environment Variables

Set in `tests/setup.ts` or `.env.test`:

```bash
NODE_ENV=test
OMNILEARN_API_KEY=test-api-key
OMNILEARN_API_URL=http://localhost:4000
PORT=3001
```

---

**Current Status:** ✅ All 30 tests passing

**Last Updated:** 2026-07-09
