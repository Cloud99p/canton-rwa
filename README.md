# Canton RWA

**Real World Asset Tokenization on Canton Network**

Canton RWA is a platform for tokenizing and trading real-world assets (RWAs) on the Canton Network, integrated with OmniLearn for cross-service intelligence.

---

## 🌟 Features

- 🏛️ **Treasury Bond Tokenization** - Issue and trade government bonds
- 📊 **Corporate Bond Issuance** - Tokenize corporate debt instruments
- 🏢 **Real Estate Tokenization** - Fractional property ownership
- 💱 **Secondary Market Trading** - Trade tokenized assets
- 📈 **Treasury Management** - Manage asset portfolios
- 🧠 **OmniLearn Integration** - Cross-service intelligence and insights

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm 8+
- Canton Network account
- OmniLearn API key (optional)

### Installation

```bash
# Clone repository
git clone https://github.com/Cloud99p/canton-rwa.git
cd canton-rwa

# Install dependencies
pnpm install

# Set environment variables
cp .env.example .env
# Edit .env with your configuration

# Run development server
pnpm run dev
```

### Environment Variables

```bash
# Canton Network
CANTON_RPC_URL=https://rpc.canton.network
CANTON_NETWORK_ID=mainnet
CANTON_PRIVATE_KEY=your_private_key_here

# OmniLearn Integration
OMNILEARN_API_KEY=omni_sk_your_key_here
OMNILEARN_API_URL=https://api.omnilearn.ai
OMNILEARN_ENABLE_LOGGING=false

# Server
PORT=3000
NODE_ENV=development
```

---

## 📦 Usage

### Issue an Asset

```typescript
import { issueAsset } from './src/assets/issue';

const asset = await issueAsset({
  assetType: 'treasury-bond',
  totalValue: 1000000,
  issuer: 'US Treasury',
  currency: 'USD',
  jurisdiction: 'United States',
});

console.log('Asset issued:', asset);
```

### Execute a Trade

```typescript
import { executeTrade } from './src/trades/execute';

const trade = await executeTrade({
  assetId: 'asset_123',
  price: 98.5,
  quantity: 10000,
  side: 'buy',
});

console.log('Trade executed:', trade);
```

### Query OmniLearn Insights

```typescript
import { omnilearnClient } from './integrations/omnilearn/client';

const insights = await omnilearnClient.search({
  query: 'treasury bond issuance trends',
  limit: 20,
});

console.log('Insights:', insights.nodes);
```

---

## 🧠 OmniLearn Integration

Canton RWA integrates with OmniLearn to:

- **Record Knowledge**: Every asset issuance and trade is recorded
- **Search Insights**: Query cross-service patterns
- **Real-time Streaming**: Monitor market activity
- **Cross-Domain Analysis**: Find patterns across blockchain, finance, etc.

### Setup OmniLearn

1. Get API key from OmniLearn dashboard
2. Add to `.env`:
   ```bash
   OMNILEARN_API_KEY=omni_sk_your_key_here
   ```
3. Schemas auto-register on startup

### Knowledge Types

| Type | Description | Schema |
|------|-------------|--------|
| `asset_issued` | New asset tokenization | assetId, assetType, totalValue, issuer |
| `trade_executed` | Asset trade | tradeId, assetId, price, quantity, side |
| `treasury_operation` | Treasury management | operationId, type, amount |

---

## 📁 Project Structure

```
canton-rwa/
├── src/
│   ├── index.ts              # Main entry point
│   ├── assets/               # Asset issuance
│   │   └── issue.ts
│   ├── trades/               # Trade execution
│   │   └── execute.ts
│   └── treasury/             # Treasury management
├── integrations/
│   └── omnilearn/            # OmniLearn integration
│       ├── client.ts         # SDK client
│       ├── schemas.ts        # Knowledge schemas
│       └── recorder.ts       # Recording utilities
├── tests/
├── docs/
├── package.json
└── README.md
```

---

## 🧪 Testing

Comprehensive test suite with 30+ tests covering unit and integration tests.

```bash
# Install dependencies (include dev dependencies)
NODE_ENV=development npm install

# Run all tests
npm test

# Watch mode (auto-rerun on changes)
npm run test:watch

# Run with coverage report
npm run test:coverage

# Run unit tests only
npm run test:unit

# Run integration tests only
npm run test:integration

# Open interactive test UI
npm run test:ui
```

📖 See [TESTING.md](TESTING.md) for complete testing guide including:
- Test structure and organization
- Writing new tests
- Mocking external dependencies
- Coverage reports
- CI/CD integration
- Troubleshooting

---

## 📚 Documentation

- [API Reference](docs/API.md)
- [Architecture](docs/ARCHITECTURE.md)
- [OmniLearn Integration](docs/INTEGRATION.md)
- [Canton Network Docs](https://docs.canton.network)

---

## 🤝 Contributing

Contributions welcome! Please see our contributing guidelines.

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📄 License

AGPL-3.0-or-later - see [LICENSE](LICENSE) file for details.

Commercial licensing available - contact emmanuelhosea09@gmail.com

---

## 📞 Contact

**Emmanuel Nenpan Hosea**
- Email: emmanuelhosea09@gmail.com
- GitHub: https://github.com/Cloud99p
- Twitter: @Cloud99p

---

**Built on Canton Network + OmniLearn** 🧠☁️🚀
