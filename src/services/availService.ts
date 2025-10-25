import { createPublicClient, createWalletClient, http, formatEther, parseEther } from 'viem'
import { mainnet, sepolia } from 'viem/chains'

// Dynamic import for Avail SDK to avoid SSR issues
let NexusSDK: any = null

export interface BatchTransfer {
  recipient: string
  amount: string
  token?: string // Optional token address for ERC20 transfers
}

export interface BatchSwapData {
  fromToken: string
  toToken: string
  fromAmount: string
  toAmount: string
  rate: number
}

export interface AvailConfig {
  network: 'testnet' | 'mainnet'
  rpcUrl?: string
}

class AvailService {
  private nexusClient: any
  private publicClient: any
  private walletClient: any
  private config: AvailConfig

  constructor(config: AvailConfig) {
    this.config = config
    // Initialize clients asynchronously
    this.initializeClients().catch(console.error)
  }

  private async initializeClients() {
    try {
      // Initialize Viem clients first
      const chain = this.config.network === 'mainnet' ? mainnet : sepolia
      const rpcUrl = this.config.rpcUrl || chain.rpcUrls.default.http[0]

      this.publicClient = createPublicClient({
        chain,
        transport: http(rpcUrl)
      })

      // Initialize Nexus client only in browser environment
      if (typeof window !== 'undefined') {
        try {
          const { NexusSDK: NexusSDKClass } = await import('@avail-project/nexus')
          this.nexusClient = new NexusSDKClass({
            network: this.config.network,
            debug: this.config.network === 'testnet'
          })
          console.log('Avail SDK initialized successfully')
        } catch (nexusError) {
          console.warn('Avail SDK not available in browser environment:', nexusError)
          this.nexusClient = null
        }
      } else {
        console.log('Avail SDK skipped in SSR environment')
        this.nexusClient = null
      }
    } catch (error) {
      console.error('Failed to initialize clients:', error)
      throw error
    }
  }

  /**
   * Set wallet client for transaction signing
   */
  async setWalletClient(walletClient: any) {
    this.walletClient = walletClient
  }

  /**
   * Execute batch transfers on Avail
   */
  async executeBatchTransfers(transfers: BatchTransfer[]): Promise<string> {
    if (!this.walletClient) {
      throw new Error('Wallet client not set. Please connect wallet first.')
    }

    try {
      console.log('Executing batch transfers:', transfers)

      // For now, simulate batch transfer execution
      // In a real implementation, this would use the Nexus SDK
      const totalAmount = transfers.reduce((sum, transfer) => {
        return sum + parseFloat(transfer.amount)
      }, 0)

      console.log('Total transfer amount:', totalAmount)

      // Simulate transaction hash
      const hash = `0x${Math.random().toString(16).substr(2, 64)}`
      
      console.log('Batch transfer transaction hash:', hash)
      return hash

    } catch (error) {
      console.error('Batch transfer failed:', error)
      throw new Error(`Batch transfer failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Execute batch swaps using Avail SDK
   */
  async executeBatchSwaps(swaps: BatchSwapData[]): Promise<string> {
    if (!this.walletClient) {
      throw new Error('Wallet client not set. Please connect wallet first.')
    }

    try {
      console.log('Executing batch swaps:', swaps)

      // For now, simulate batch swap execution
      // In a real implementation, this would interact with a DEX contract
      const totalValue = swaps.reduce((sum, swap) => {
        return sum + parseFloat(swap.fromAmount)
      }, 0)

      console.log('Total swap value:', totalValue)

      // Simulate transaction hash
      const hash = `0x${Math.random().toString(16).substr(2, 64)}`
      
      console.log('Batch swap transaction hash:', hash)
      return hash

    } catch (error) {
      console.error('Batch swap failed:', error)
      throw new Error(`Batch swap failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Get account balance
   */
  async getBalance(address: string): Promise<string> {
    try {
      const balance = await this.publicClient.getBalance({
        address: address as `0x${string}`
      })
      return formatEther(balance)
    } catch (error) {
      console.error('Failed to get balance:', error)
      throw error
    }
  }

  /**
   * Estimate gas for batch transaction
   */
  async estimateBatchGas(transfers: BatchTransfer[]): Promise<bigint> {
    try {
      // This is a simplified gas estimation
      // In a real implementation, you'd calculate based on the actual batch contract
      const baseGas = BigInt(21000) // Base transaction gas
      const transferGas = BigInt(21000) * BigInt(transfers.length) // Gas per transfer
      return baseGas + transferGas
    } catch (error) {
      console.error('Gas estimation failed:', error)
      throw error
    }
  }

  /**
   * Get transaction status
   */
  async getTransactionStatus(hash: string): Promise<'pending' | 'confirmed' | 'failed'> {
    try {
      const receipt = await this.publicClient.getTransactionReceipt({
        hash: hash as `0x${string}`
      })
      
      if (!receipt) return 'pending'
      return receipt.status === 'success' ? 'confirmed' : 'failed'
    } catch (error) {
      console.error('Failed to get transaction status:', error)
      return 'pending'
    }
  }

  /**
   * Get network information
   */
  getNetworkInfo() {
    return {
      network: this.config.network,
      chainId: this.config.network === 'mainnet' ? 1 : 11155111,
      name: this.config.network === 'mainnet' ? 'Avail Mainnet' : 'Avail Testnet'
    }
  }
}

// Export singleton instance
export const availService = new AvailService({
  network: 'testnet' // Change to 'mainnet' for production
})

export default AvailService
