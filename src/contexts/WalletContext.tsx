"use client"

import React, { createContext, useContext, ReactNode } from 'react'
import { useAvailWallet } from '../hooks/useAvailWallet'

interface WalletContextType {
  isConnected: boolean
  address: string | null
  balance: string | null
  isLoading: boolean
  error: string | null
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
  refreshBalance: () => Promise<void>
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

interface WalletProviderProps {
  children: ReactNode
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const walletState = useAvailWallet()

  return (
    <WalletContext.Provider value={walletState}>
      {children}
    </WalletContext.Provider>
  )
}

export const useWallet = () => {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
}
