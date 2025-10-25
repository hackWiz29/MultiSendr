# Avail SDK Integration

This document describes the integration of the Avail SDK for batch transactions in the stable coin swap application.

## Overview

The application now supports batch transactions using the Avail SDK, allowing users to:
- Execute multiple token swaps in a single transaction
- Perform batch transfers to multiple addresses
- Reduce gas fees through batch processing
- Ensure atomic execution (all or nothing)

## Components Added

### 1. AvailService (`src/services/availService.ts`)
Core service that handles:
- Avail SDK initialization
- Batch transaction execution
- Wallet client management
- Gas estimation
- Transaction status tracking

### 2. useAvailWallet Hook (`src/hooks/useAvailWallet.ts`)
React hook for wallet management:
- Wallet connection/disconnection
- Balance tracking
- Account change detection
- Auto-reconnection

### 3. Updated Components
- **BatchSwapInterface**: Now integrates with Avail SDK for batch swaps
- **BatchSummary**: Shows wallet status and transaction details
- **BatchSection**: Updated for Avail SDK batch transfers
- **AvailIntegrationTest**: Test component to validate SDK integration

## Features

### Batch Swaps
- Multiple token pairs in a single transaction
- Real-time rate calculation
- Gas estimation
- Transaction status tracking

### Batch Transfers
- Send to multiple addresses simultaneously
- Gas optimization
- Atomic execution

### Wallet Integration
- MetaMask and other Web3 wallet support
- Automatic wallet detection
- Account change handling
- Balance monitoring

## Usage

### 1. Connect Wallet
```typescript
const { connectWallet, isConnected, address } = useAvailWallet()
```

### 2. Execute Batch Swaps
```typescript
const batchSwapData = [
  { fromToken: "USDC", toToken: "USDT", fromAmount: "100", toAmount: "100", rate: 1.0 },
  { fromToken: "USDT", toToken: "DAI", fromAmount: "50", toAmount: "50", rate: 1.0 }
]

const txHash = await availService.executeBatchSwaps(batchSwapData)
```

### 3. Execute Batch Transfers
```typescript
const batchTransfers = [
  { recipient: "0x...", amount: "1.0" },
  { recipient: "0x...", amount: "2.0" }
]

const txHash = await availService.executeBatchTransfers(batchTransfers)
```

## Configuration

The Avail SDK is configured for testnet by default. To switch to mainnet:

```typescript
// In src/services/availService.ts
export const availService = new AvailService({
  network: 'mainnet' // Change from 'testnet'
})
```

## Dependencies

- `@avail-project/nexus`: Core Avail SDK
- `@avail-project/nexus-widgets`: UI components
- `viem`: Ethereum library for wallet interactions

## Testing

Use the `AvailIntegrationTest` component to:
- Test wallet connection
- Validate SDK initialization
- Check balance retrieval
- Test gas estimation
- Verify transaction execution

## Network Support

- **Testnet**: Development and testing
- **Mainnet**: Production transactions

## Error Handling

The integration includes comprehensive error handling for:
- Wallet connection failures
- Transaction execution errors
- Network connectivity issues
- Invalid transaction parameters

## Security Considerations

- All transactions require wallet approval
- Private keys are never exposed
- Transaction data is validated before execution
- Gas limits are estimated to prevent failed transactions

## Future Enhancements

- Support for more token types
- Advanced routing algorithms
- MEV protection
- Cross-chain batch transactions
- Transaction scheduling
