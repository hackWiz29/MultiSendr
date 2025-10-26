import { ethers } from 'ethers';

export interface SwapData {
  fromToken: string;
  toToken: string;
  fromAmount: string;
  toAmount: string;
  rate: number;
}

export interface BatchSwapData {
  swaps: SwapData[];
  user: string;
  deadline: number;
}

export class SwapContractService {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.JsonRpcSigner | null = null;
  private contract: ethers.Contract | null = null;
  
  // Mock contract ABI for stablecoin swaps
  private contractABI = [
    {
      "inputs": [
        {
          "components": [
            {"internalType": "address", "name": "fromToken", "type": "address"},
            {"internalType": "address", "name": "toToken", "type": "address"},
            {"internalType": "uint256", "name": "fromAmount", "type": "uint256"},
            {"internalType": "uint256", "name": "minToAmount", "type": "uint256"},
            {"internalType": "uint256", "name": "rate", "type": "uint256"}
          ],
          "internalType": "struct StableCoinSwapContract.SwapData",
          "name": "swapData",
          "type": "tuple"
        }
      ],
      "name": "executeSwap",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "components": [
            {
              "components": [
                {"internalType": "address", "name": "fromToken", "type": "address"},
                {"internalType": "address", "name": "toToken", "type": "address"},
                {"internalType": "uint256", "name": "fromAmount", "type": "uint256"},
                {"internalType": "uint256", "name": "minToAmount", "type": "uint256"},
                {"internalType": "uint256", "name": "rate", "type": "uint256"}
              ],
              "internalType": "struct StableCoinSwapContract.SwapData[]",
              "name": "swaps",
              "type": "tuple[]"
            },
            {"internalType": "address", "name": "user", "type": "address"},
            {"internalType": "uint256", "name": "deadline", "type": "uint256"}
          ],
          "internalType": "struct StableCoinSwapContract.BatchSwapData",
          "name": "batchData",
          "type": "tuple"
        }
      ],
      "name": "executeBatchSwap",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];

  // Mock contract address (this would be your deployed contract address)
  private contractAddress = "0x1234567890123456789012345678901234567890";

  constructor() {
    this.initializeProvider();
  }

  private async initializeProvider() {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        this.provider = new ethers.BrowserProvider(window.ethereum);
        this.signer = await this.provider.getSigner();
        
        // Create contract instance
        this.contract = new ethers.Contract(
          this.contractAddress,
          this.contractABI,
          this.signer
        );
        
        console.log('✅ Contract service initialized');
      } catch (error) {
        console.error('❌ Failed to initialize contract service:', error);
      }
    }
  }

  /**
   * Execute a single swap with real wallet signing
   */
  async executeSwap(swapData: SwapData): Promise<string> {
    if (!this.contract || !this.signer) {
      throw new Error('Contract not initialized. Please connect wallet first.');
    }

    try {
      console.log('🔐 Executing single swap with real wallet signing...');
      
      // Prepare transaction data
      const swapDataStruct = {
        fromToken: swapData.fromToken,
        toToken: swapData.toToken,
        fromAmount: ethers.parseUnits(swapData.fromAmount, 18), // Assuming 18 decimals
        minToAmount: ethers.parseUnits(swapData.toAmount, 18),
        rate: Math.floor(swapData.rate * 10000) // Convert to basis points
      };

      console.log('📝 Transaction data:', swapDataStruct);

      // Estimate gas
      const gasEstimate = await this.contract.executeSwap.estimateGas(swapDataStruct);
      console.log('⛽ Gas estimate:', gasEstimate.toString());

      // Execute transaction with real wallet signing
      const tx = await this.contract.executeSwap(swapDataStruct, {
        gasLimit: gasEstimate * BigInt(120) / BigInt(100), // Add 20% buffer
      });

      console.log('📤 Transaction sent:', tx.hash);
      console.log('⏳ Waiting for confirmation...');

      // Wait for transaction confirmation
      const receipt = await tx.wait();
      console.log('✅ Transaction confirmed:', receipt?.hash);

      return receipt?.hash || tx.hash;

    } catch (error) {
      console.error('❌ Swap execution failed:', error);
      throw new Error(`Swap failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Execute batch swaps with real wallet signing
   */
  async executeBatchSwap(swaps: BatchSwapData[]): Promise<string> {
    if (!this.contract || !this.signer) {
      throw new Error('Contract not initialized. Please connect wallet first.');
    }

    try {
      console.log('🔐 Executing batch swap with real wallet signing...');
      
      // Prepare batch data
      const batchData = {
        swaps: swaps.map(batchSwap => batchSwap.swaps.map(swap => ({
          fromToken: swap.fromToken,
          toToken: swap.toToken,
          fromAmount: ethers.parseUnits(swap.fromAmount, 18),
          minToAmount: ethers.parseUnits(swap.toAmount, 18),
          rate: Math.floor(swap.rate * 10000)
        }))).flat(),
        user: await this.signer.getAddress(),
        deadline: Math.floor(Date.now() / 1000) + 300 // 5 minutes from now
      };

      console.log('📝 Batch transaction data:', batchData);

      // Estimate gas
      const gasEstimate = await this.contract.executeBatchSwap.estimateGas(batchData);
      console.log('⛽ Gas estimate:', gasEstimate.toString());

      // Execute transaction with real wallet signing
      const tx = await this.contract.executeBatchSwap(batchData, {
        gasLimit: gasEstimate * BigInt(120) / BigInt(100), // Add 20% buffer
      });

      console.log('📤 Batch transaction sent:', tx.hash);
      console.log('⏳ Waiting for confirmation...');

      // Wait for transaction confirmation
      const receipt = await tx.wait();
      console.log('✅ Batch transaction confirmed:', receipt?.hash);

      return receipt?.hash || tx.hash;

    } catch (error) {
      console.error('❌ Batch swap execution failed:', error);
      throw new Error(`Batch swap failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get the current account address
   */
  async getCurrentAddress(): Promise<string> {
    if (!this.signer) {
      throw new Error('Wallet not connected');
    }
    return await this.signer.getAddress();
  }

  /**
   * Check if wallet is connected
   */
  isConnected(): boolean {
    return this.signer !== null;
  }

  /**
   * Get contract address
   */
  getContractAddress(): string {
    return this.contractAddress;
  }
}