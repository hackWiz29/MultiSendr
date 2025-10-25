import { useState, useEffect } from 'react'
import { createWalletClient, custom } from 'viem'
import { availService } from '../services/availService'

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
      // Check if wallet is available
      if (typeof window === 'undefined' || !window.ethereum) {
        throw new Error('No wallet found. Please install MetaMask or another Web3 wallet.')
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      })

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found')
      }

      const address = accounts[0]
      
      // Create wallet client
      const walletClient = createWalletClient({
        account: address as `0x${string}`,
        transport: custom(window.ethereum)
      })

      // Set wallet client in Avail service
      await availService.setWalletClient(walletClient)

      // Get balance
      const balance = await availService.getBalance(address)

      setWalletState({
        isConnected: true,
        address,
        balance,
        isLoading: false,
        error: null
      })

      console.log('Wallet connected successfully:', address)

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
      if (typeof window === 'undefined' || !window.ethereum) return

      try {
        const accounts = await window.ethereum.request({
          method: 'eth_accounts'
        })

        if (accounts && accounts.length > 0) {
          const address = accounts[0]
          const walletClient = createWalletClient({
            account: address as `0x${string}`,
            transport: custom(window.ethereum)
          })

          await availService.setWalletClient(walletClient)
          const balance = await availService.getBalance(address)

          setWalletState({
            isConnected: true,
            address,
            balance,
            isLoading: false,
            error: null
          })
        }
      } catch (error) {
        console.error('Auto-connection failed:', error)
      }
    }

    checkConnection()
  }, [])

  // Listen for account changes
  useEffect(() => {
    if (typeof window === 'undefined' || !window.ethereum) return

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet()
      } else if (accounts[0] !== walletState.address) {
        connectWallet()
      }
    }

    const handleChainChanged = () => {
      // Refresh wallet state when chain changes
      if (walletState.isConnected) {
        connectWallet()
      }
    }

    window.ethereum.on('accountsChanged', handleAccountsChanged)
    window.ethereum.on('chainChanged', handleChainChanged)

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
      window.ethereum.removeListener('chainChanged', handleChainChanged)
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
