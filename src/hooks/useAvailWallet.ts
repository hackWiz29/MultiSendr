import { useState, useEffect } from 'react'
import { availService } from '../services/availService'

// Note: Avail is a Substrate-based blockchain, not EVM-compatible
// This uses Polkadot.js extension for wallet integration

// Dynamic imports to avoid SSR issues
let web3Accounts: any = null
let web3Enable: any = null
let web3FromAddress: any = null
let stringToHex: any = null

// Initialize Polkadot.js functions only in browser
const initializePolkadot = async () => {
  if (typeof window !== 'undefined') {
    try {
      const extensionDapp = await import('@polkadot/extension-dapp')
      const util = await import('@polkadot/util')
      
      web3Accounts = extensionDapp.web3Accounts
      web3Enable = extensionDapp.web3Enable
      web3FromAddress = extensionDapp.web3FromAddress
      stringToHex = util.stringToHex
    } catch (error) {
      console.warn('Failed to load Polkadot.js extensions:', error)
    }
  }
}

export interface WalletState {
  isConnected: boolean
  address: string | null
  balance: string | null
  isLoading: boolean
  error: string | null
}

export const useAvailWallet = () => {
  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false,
    address: null,
    balance: null,
    isLoading: false,
    error: null
  })

  const connectWallet = async () => {
    setWalletState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      // Check if we're in browser environment
      if (typeof window === 'undefined') {
        throw new Error('Wallet connection requires browser environment')
      }

      // Initialize Polkadot.js functions
      await initializePolkadot()

      if (!web3Enable || !web3Accounts || !web3FromAddress) {
        throw new Error('Polkadot.js extensions not available. Please refresh the page.')
      }

      // Enable Polkadot.js extension
      const extensions = await web3Enable('Avail StableCoin Swap')
      
      if (extensions.length === 0) {
        throw new Error('No Polkadot.js compatible wallet found. Please install Talisman, SubWallet, or Polkadot.js extension.')
      }

      // Get all accounts from all extensions
      const allAccounts = await web3Accounts()
      
      if (allAccounts.length === 0) {
        throw new Error('No accounts found. Please create an account in your Polkadot.js compatible wallet.')
      }

      // Use the first account
      const account = allAccounts[0]
      const address = account.address

      // Validate Avail address format (should start with '5')
      if (!address.startsWith('5')) {
        throw new Error('Invalid Avail address format. Please ensure you\'re using an Avail-compatible account.')
      }

      // Get the injector for signing transactions
      const injector = await web3FromAddress(address)

      // Connect wallet using the new real Avail service
      await availService.connectWallet()

      // Get balance
      const balance = await availService.getBalance(address)

      setWalletState({
        isConnected: true,
        address,
        balance,
        isLoading: false,
        error: null
      })

      console.log('Substrate wallet connected successfully to Avail:', address)

    } catch (error) {
      console.error('Wallet connection failed:', error)
      setWalletState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to connect wallet'
      }))
    }
  }

  const disconnectWallet = () => {
    setWalletState({
      isConnected: false,
      address: null,
      balance: null,
      isLoading: false,
      error: null
    })
    console.log('Wallet disconnected')
  }

  const refreshBalance = async () => {
    if (!walletState.address) return

    try {
      const balance = await availService.getBalance(walletState.address)
      setWalletState(prev => ({ ...prev, balance }))
    } catch (error) {
      console.error('Failed to refresh balance:', error)
    }
  }

  // Auto-connect wallet if previously connected
  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window === 'undefined') return

      try {
        // Initialize Polkadot.js functions
        await initializePolkadot()

        if (!web3Enable || !web3Accounts || !web3FromAddress) {
          return
        }

        // Check if extensions are available
        const extensions = await web3Enable('Avail StableCoin Swap')
        
        if (extensions.length > 0) {
          const allAccounts = await web3Accounts()
          
          if (allAccounts.length > 0) {
            const account = allAccounts[0]
            const address = account.address

            if (address.startsWith('5')) {
              // Connect wallet using the new real Avail service
              await availService.connectWallet()
              
              const balance = await availService.getBalance(address)

              setWalletState({
                isConnected: true,
                address,
                balance,
                isLoading: false,
                error: null
              })
            }
          }
        }
      } catch (error) {
        console.error('Auto-connection failed:', error)
      }
    }

    checkConnection()
  }, [])

  // Listen for account changes
  useEffect(() => {
    if (typeof window === 'undefined') return

    // For Substrate wallets, we need to listen to extension events
    const handleAccountsChanged = () => {
      if (walletState.isConnected) {
        connectWallet()
      }
    }

    // Note: Substrate wallet events are handled differently
    // This is a simplified approach - in production you'd want more robust event handling
    if (walletState.isConnected && walletState.address) {
      console.log('Substrate wallet connected successfully to Avail:', walletState.address)
    }
  }, [walletState.address, walletState.isConnected])

  return {
    ...walletState,
    connectWallet,
    disconnectWallet,
    refreshBalance
  }
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>
      on: (event: string, callback: (...args: any[]) => void) => void
      removeListener: (event: string, callback: (...args: any[]) => void) => void
    }
  }
}
