// Real Avail Contract Service - Production Ready
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
  private availService: any = null;
  private isInitialized: boolean = false;

  constructor() {
    this.initializeAvailService();
  }

  private async initializeAvailService() {
    try {
      // Import AvailService dynamically
      const { availService } = await import('./availService');
      this.availService = availService;
      
      console.log('✅ Real Avail service initialized');
      console.log('🔗 Ready for real Avail transactions');
      this.isInitialized = true;
    } catch (error) {
      console.error('❌ Failed to initialize Avail service:', error);
      throw error;
    }
  }

  /**
   * Connect to real Avail wallet
   */
  async connectWallet(): Promise<boolean> {
    if (!this.isInitialized) {
      throw new Error('Service not initialized');
    }

    try {
      const connected = await this.availService.connectWallet();
      console.log('✅ Real Avail wallet connected');
      return connected;
    } catch (error) {
      console.error('❌ Failed to connect wallet:', error);
      throw error;
    }
  }

  /**
   * Execute a single swap with REAL Avail transaction
   */
  async executeSwap(swapData: SwapData): Promise<string> {
    if (!this.isInitialized || !this.availService) {
      throw new Error('Avail service not initialized');
    }

    if (!this.availService.isWalletConnected()) {
      throw new Error('Wallet not connected. Please connect wallet first.');
    }

    try {
      console.log('🔐 Executing REAL single swap on Avail...');
      
      // Convert single swap to batch format for Avail service
      const batchSwaps = [{
        fromToken: swapData.fromToken,
        toToken: swapData.toToken,
        fromAmount: swapData.fromAmount,
        toAmount: swapData.toAmount,
        rate: swapData.rate
      }];

      const txHash = await this.availService.executeBatchSwaps(batchSwaps);
      console.log('✅ REAL swap transaction completed:', txHash);
      return txHash;

    } catch (error) {
      console.error('❌ Real swap execution failed:', error);
      throw new Error(`Real swap failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Execute batch swaps with REAL Avail transactions
   */
  async executeBatchSwap(swaps: BatchSwapData[]): Promise<string> {
    if (!this.isInitialized || !this.availService) {
      throw new Error('Avail service not initialized');
    }

    if (!this.availService.isWalletConnected()) {
      throw new Error('Wallet not connected. Please connect wallet first.');
    }

    try {
      console.log('🔐 Executing REAL batch swap on Avail...');
      
      // Convert BatchSwapData to format expected by Avail service
      const batchSwaps = swaps.map(batchSwap => batchSwap.swaps).flat();
      
      const txHash = await this.availService.executeBatchSwaps(batchSwaps);
      console.log('✅ REAL batch swap transaction completed:', txHash);
      return txHash;

    } catch (error) {
      console.error('❌ Real batch swap execution failed:', error);
      throw new Error(`Real batch swap failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get REAL account balance from Avail blockchain
   */
  async getBalance(address: string): Promise<string> {
    if (!this.isInitialized || !this.availService) {
      throw new Error('Avail service not initialized');
    }

    try {
      const balance = await this.availService.getBalance(address);
      console.log('✅ Real balance retrieved:', balance);
      return balance;
    } catch (error) {
      console.error('❌ Failed to get real balance:', error);
      throw error;
    }
  }

  /**
   * Get REAL transaction status from Avail blockchain
   */
  async getTransactionStatus(hash: string): Promise<'pending' | 'confirmed' | 'failed'> {
    if (!this.isInitialized || !this.availService) {
      throw new Error('Avail service not initialized');
    }

    try {
      const status = await this.availService.getTransactionStatus(hash);
      console.log('✅ Real transaction status:', status);
      return status;
    } catch (error) {
      console.error('❌ Failed to get transaction status:', error);
      return 'pending';
    }
  }

  /**
   * Request REAL test tokens from Avail faucet
   */
  async requestTestTokens(address: string): Promise<string> {
    if (!this.isInitialized || !this.availService) {
      throw new Error('Avail service not initialized');
    }

    try {
      const result = await this.availService.requestTestTokens(address);
      console.log('✅ Real test tokens requested:', result);
      return result;
    } catch (error) {
      console.error('❌ Failed to request test tokens:', error);
      throw error;
    }
  }

  /**
   * Get the current REAL Avail account address
   */
  async getCurrentAddress(): Promise<string> {
    if (!this.isInitialized || !this.availService) {
      throw new Error('Avail service not initialized');
    }

    const address = this.availService.getCurrentAddress();
    if (!address) {
      throw new Error('No wallet connected');
    }
    return address;
  }

  /**
   * Check if REAL Avail wallet is connected
   */
  isConnected(): boolean {
    return this.isInitialized && this.availService && this.availService.isWalletConnected();
  }

  /**
   * Get Avail network information
   */
  getNetworkInfo() {
    return {
      network: 'Avail Turing Testnet',
      chainId: 2024,
      rpcUrl: 'wss://turing-rpc.avail.so/ws',
      explorer: 'https://turing.avail.so',
      addressFormat: 'Substrate (5... format)'
    };
  }

  /**
   * Get REAL service status
   */
  getServiceStatus() {
    if (!this.isInitialized || !this.availService) {
      return {
        initialized: false,
        wallet: false,
        status: 'not_initialized'
      };
    }

    return this.availService.getServiceStatus();
  }

  /**
   * Disconnect wallet
   */
  disconnectWallet() {
    if (this.availService) {
      this.availService.disconnectWallet();
    }
  }
}