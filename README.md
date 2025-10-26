# MultiSendr

<div align="center">
  <img src="src/assets/logo.svg" alt="MultiSendr Logo" width="200" height="200">
  
  **A Next.js-based platform for efficient stablecoin swapping with batch transaction support**
  
  [![Next.js](https://img.shields.io/badge/Next.js-15.5.6-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![React](https://img.shields.io/badge/React-19.1.0-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
  [![Solidity](https://img.shields.io/badge/Solidity-^0.8.19-purple?style=for-the-badge&logo=solidity)](https://soliditylang.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
</div>

---

## Table of Contents

- [Features](#features)
- [Quick Start](#quick-start)
- [Smart Contracts](#smart-contracts)
- [Avail SDK Integration](#avail-sdk-integration)
- [Supported Networks](#supported-networks)
- [Supported Tokens](#supported-tokens)
- [API Endpoints](#api-endpoints)
- [Development](#development)
- [Deployment](#deployment)
- [Key Features](#key-features)
- [Links](#links)

---

## Features

### Batch Token Swapping
- Execute multiple token swaps in a single transaction
- Reduce gas costs and improve efficiency
- Support for multiple simultaneous swaps

### Multi-Stablecoin Support
- **USDC** (USD Coin)
- **USDT** (Tether USD)
- **DAI** (Dai Stablecoin)
- **AVAI** (Avail Native Token)

### Cross-Chain Compatibility
- **Polygon Mumbai Testnet** (Primary)
- **Avail Network** integration
- **Hardhat Local Network** for development

---

## Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **MetaMask** or compatible Web3 wallet
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/hackWiz29/MultiSendr.git
   cd multisendr
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
    ```bash
    npm run dev
    # or
    yarn dev
    ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## Smart Contracts

### StableCoinSwapContract

The main smart contract that handles stablecoin swapping with the following features:

- **Batch Swapping**: Execute multiple swaps in a single transaction
- **Liquidity Management**: Add/remove liquidity for supported tokens
- **Security**: ReentrancyGuard, Pausable, and Ownable patterns
- **Events**: Comprehensive logging for all operations

#### Key Functions

```solidity
function executeBatchSwap(SwapData[] memory swaps) external nonReentrant
function addLiquidity(address token, uint256 amount) external
function removeLiquidity(address token, uint256 amount) external
function pause() external onlyOwner
function unpause() external onlyOwner
```

#### Contract Addresses

| Network | Contract Address | Status |
|---------|------------------|--------|
| Mumbai Testnet | `0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6` | Active |
| Hardhat Local | `0x5FbDB2315678afecb367f032d93F642f64180aa3` | Development |

---

## Avail SDK Integration

MultiSendr leverages the **Avail SDK** and **Polkadot.js API** for cross-chain functionality and Substrate-based blockchain interactions.

### Avail SDK Components

#### @avail-project/nexus (^1.1.0)
- Core SDK for Avail blockchain integration
- Cross-chain bridge functionality
- Data availability verification
- Transaction submission and monitoring

#### @avail-project/nexus-widgets (^0.0.6)
- Pre-built UI components for Avail integration
- Wallet connection widgets
- Transaction status indicators
- Network switching components

### Polkadot.js Integration

#### Core Dependencies
```json
{
  "@polkadot/api": "^16.4.9",           // Polkadot.js API client
  "@polkadot/extension-dapp": "^0.62.3", // Browser extension integration
  "@polkadot/keyring": "^13.5.7",       // Key management
  "@polkadot/util": "^13.5.7",          // Utility functions
  "@polkadot/util-crypto": "^13.5.7"    // Cryptographic utilities
}
```

### Avail Service Features

#### Multi-Chain Support
- **Avail Turing Testnet**: Primary testnet environment
- **Avail Mainnet**: Production network (when available)
- **Custom RPC**: Support for custom Avail nodes

#### Wallet Integration
```typescript
// Avail wallet connection
const { connectWallet, disconnectWallet, getBalance } = useAvailWallet()

// Connect to Avail network
await connectWallet()
```

#### Transaction Management
```typescript
// Batch transaction execution
const batchSwapData: BatchSwapData[] = [
  {
    fromToken: 'AVAI',
    toToken: 'USDC',
    fromAmount: '1000000000000000000', // 1 AVAI
    toAmount: '1000000', // 1 USDC
    rate: 1.0
  }
]

// Execute batch swap on Avail
const txHash = await availService.executeBatchSwap(batchSwapData)
```

### Cross-Chain Functionality

#### Bridge Operations
- **EVM ↔ Avail**: Seamless token transfers
- **Data Availability**: Verify transaction data on Avail
- **Batch Processing**: Execute multiple operations atomically

#### Network Configuration
```typescript
const availConfig: AvailConfig = {
  network: 'testnet', // 'testnet' | 'mainnet' | 'turing'
  rpcUrl: 'wss://turing-rpc.avail.so/ws',
  chainId: 80001
}
```

### Development with Avail SDK

#### Initialization
```typescript
import { availService } from './services/availService'

// Initialize Avail service
const service = new AvailService({
  network: 'testnet',
  rpcUrl: 'wss://turing-rpc.avail.so/ws'
})

await service.initialize()
```

#### Transaction Execution
```typescript
// Execute batch swap with Avail integration
const result = await availService.executeBatchSwap([
  {
    fromToken: 'AVAI',
    toToken: 'USDC',
    fromAmount: '1000000000000000000',
    toAmount: '1000000',
    rate: 1.0
  }
])
```

#### Balance Queries
```typescript
// Get AVAI balance
const balance = await availService.getBalance(address)

// Get token balance
const tokenBalance = await availService.getTokenBalance(address, 'USDC')
```

---

## Supported Networks

### Polygon Mumbai Testnet
- **Chain ID**: `80001`
- **RPC URL**: `https://rpc-mumbai.maticvigil.com`
- **Explorer**: [mumbai.polygonscan.com](https://mumbai.polygonscan.com)
- **Status**: Production Ready

### Avail Network
- **Integration**: Via Avail Nexus SDK and Polkadot.js API
- **Features**: Cross-chain token support, data availability proofs
- **RPC URL**: `wss://turing-rpc.avail.so/ws`
- **Status**: Active Development

### Hardhat Local Network
- **Chain ID**: `1337`
- **RPC URL**: `http://127.0.0.1:8545`
- **Status**: Development Only

---

## Supported Tokens

| Token | Symbol | Contract Address | Decimals | Network |
|-------|--------|------------------|----------|---------|
| USD Coin | USDC | `0x2058A9D7613eEE744279e3856E0C5DEd6e0c2b0c` | 6 | Mumbai |
| Tether USD | USDT | `0xBD21A10F619BE90d6066c941b04e9c3a4b9c4a0` | 6 | Mumbai |
| Dai Stablecoin | DAI | `0x001B3B4d0F3714Ca98ba10F6042DaEbF0B1B7b6F` | 18 | Mumbai |
| Avail Token | AVAI | Native | 18 | Avail |

---

## API Endpoints

### Exchange Rate API
```
GET /api/exchange-rate
```
Returns current exchange rates between supported tokens.

### Token Balance API
```
GET /api/token-balance?address={walletAddress}&token={tokenSymbol}
```
Returns token balance for a specific wallet address.

---

## Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server

# Smart Contracts
npx hardhat compile  # Compile smart contracts
npx hardhat test     # Run contract tests
npx hardhat deploy   # Deploy contracts
```

### Development Workflow

1. **Smart Contract Development**
   ```bash
   cd contracts/stablecoin_swap
   cargo build
   ```

2. **Frontend Development**
   ```bash
   npm run dev
   ```

3. **Testing**
   ```bash
   npm run test
   npx hardhat test
   ```

---

## Deployment

### Frontend Deployment (Vercel)

1. **Connect your repository to Vercel**
2. **Deploy**:
   ```bash
   vercel --prod
   ```

### Smart Contract Deployment

1. **Deploy to Mumbai Testnet**:
   ```bash
   npx hardhat run scripts/deploy.ts --network mumbai
   ```

2. **Deploy to Avail**:
   ```bash
   node scripts/deploy-avail.js
   ```

---

## Key Features

### Batch Swapping
Execute multiple token swaps efficiently:
- Add multiple swap pairs
- Real-time rate calculations
- Gas optimization
- Transaction batching

### Wallet Integration
- Polkadot.js extension
- Avail wallet integration

### Real-time Updates
- Live transaction status
- Exchange rate updates

---

## Links

- **Live Demo**: [https://multi-sendr.vercel.app/](https://multi-sendr.vercel.app/)
---

<div align="center">
  <p>Powered by <strong>Avail SDK</strong> for cross-chain functionality</p>
</div>