"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface Transaction {
  id: string
  hash: string
  type: 'swap' | 'batch_swap' | 'transfer' | 'faucet'
  status: 'pending' | 'confirmed' | 'failed'
  fromToken?: string
  toToken?: string
  fromAmount?: string
  toAmount?: string
  timestamp: number
  blockNumber?: number
  gasUsed?: string
  value?: string
  description: string
  error?: string
}

interface TransactionContextType {
  transactions: Transaction[]
  addTransaction: (transaction: Omit<Transaction, 'id' | 'timestamp'>) => string
  updateTransaction: (id: string, updates: Partial<Transaction>) => void
  clearTransactions: () => void
  getRecentTransactions: (limit?: number) => Transaction[]
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined)

export const useTransactions = () => {
  const context = useContext(TransactionContext)
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionProvider')
  }
  return context
}

interface TransactionProviderProps {
  children: ReactNode
}

export const TransactionProvider: React.FC<TransactionProviderProps> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([])

  // Load transactions from localStorage on mount
  useEffect(() => {
    const savedTransactions = localStorage.getItem('avail-transactions')
    if (savedTransactions) {
      try {
        const parsed = JSON.parse(savedTransactions)
        setTransactions(parsed)
      } catch (error) {
        console.error('Failed to load transactions from localStorage:', error)
      }
    }
  }, [])

  // Save transactions to localStorage whenever transactions change
  useEffect(() => {
    localStorage.setItem('avail-transactions', JSON.stringify(transactions))
  }, [transactions])

  const addTransaction = (transactionData: Omit<Transaction, 'id' | 'timestamp'>): string => {
    const id = `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const transaction: Transaction = {
      ...transactionData,
      id,
      timestamp: Date.now()
    }
    
    setTransactions(prev => [transaction, ...prev])
    return id
  }

  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    setTransactions(prev => 
      prev.map(tx => 
        tx.id === id ? { ...tx, ...updates } : tx
      )
    )
  }

  const clearTransactions = () => {
    setTransactions([])
  }

  const getRecentTransactions = (limit: number = 10): Transaction[] => {
    return transactions
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit)
  }

  const value: TransactionContextType = {
    transactions,
    addTransaction,
    updateTransaction,
    clearTransactions,
    getRecentTransactions
  }

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  )
}
