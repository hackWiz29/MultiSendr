#!/usr/bin/env node

// Avail Contract Deployment Script
import { ApiPromise, WsProvider, Keyring } from '@polkadot/api';
import { ContractPromise } from '@polkadot/api-contract';
import { cryptoWaitReady } from '@polkadot/util-crypto';

async function deployToAvail() {
  console.log('🚀 Starting Avail contract deployment...');

  try {
    // Initialize crypto
    await cryptoWaitReady();
    console.log('✅ Crypto initialized');

    // Connect to Avail Turing testnet
    const wsProvider = new WsProvider('wss://turing-rpc.avail.so/ws');
    const api = await ApiPromise.create({ provider: wsProvider });
    console.log('✅ Connected to Avail Turing testnet');

    // Create keyring
    const keyring = new Keyring({ type: 'sr25519' });
    
    // You need to add your account here
    // Option 1: Use existing account
    // const account = keyring.addFromUri('your_seed_phrase_here');
    
    // Option 2: Create new account for testing
    const account = keyring.addFromUri('//Alice'); // For testing only!
    console.log('✅ Account created:', account.address);

    // Load the contract metadata and WASM
    const contractMetadata = require('./contracts/stablecoin_swap/metadata.json');
    const contractWasm = require('./contracts/stablecoin_swap/stablecoin_swap.wasm');

    console.log('📋 Contract metadata loaded');
    console.log('📦 Contract WASM loaded');

    // Create contract instance
    const contract = new ContractPromise(api, contractMetadata, contractWasm);

    // Deploy the contract
    console.log('🔨 Deploying contract...');
    
    const deployTx = contract.tx.new(
      { gasLimit: 1000000000000 }, // Gas limit
      {} // Constructor arguments (none for this contract)
    );

    // Sign and send the transaction
    const hash = await deployTx.signAndSend(account, (result) => {
      if (result.status.isInBlock) {
        console.log('✅ Contract deployed in block:', result.status.asInBlock.toString());
      }
      if (result.status.isFinalized) {
        console.log('🎉 Contract deployment finalized!');
        console.log('📋 Contract address:', result.contractAddress?.toString());
        console.log('🔗 View on explorer: https://turing.avail.so/contract/' + result.contractAddress?.toString());
        
        // Save contract address for frontend
        const contractInfo = {
          address: result.contractAddress?.toString(),
          network: 'avail-turing',
          deployedAt: new Date().toISOString(),
          metadata: contractMetadata
        };
        
        require('fs').writeFileSync('./avail-contract-address.json', JSON.stringify(contractInfo, null, 2));
        console.log('💾 Contract info saved to avail-contract-address.json');
        
        process.exit(0);
      }
    });

    console.log('📤 Deployment transaction hash:', hash.toString());

  } catch (error) {
    console.error('❌ Deployment failed:', error);
    process.exit(1);
  }
}

// Run deployment
deployToAvail().catch(console.error);
