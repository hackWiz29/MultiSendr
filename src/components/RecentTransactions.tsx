"use client"

import React, { useState } from "react"
import { useTransactions, Transaction } from "../contexts/TransactionContext"
import { IoTime, IoCheckmarkCircle, IoCloseCircle, IoSwapHorizontal, IoCash, IoRefresh, IoTrash } from "react-icons/io5"

const RecentTransactions: React.FC = () => {
  const { getRecentTransactions, updateTransaction, clearTransactions } = useTransactions()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  
  const recentTransactions = getRecentTransactions(5)

  const getStatusIcon = (status: Transaction['status']) => {
    switch (status) {
      case 'confirmed':
        return <IoCheckmarkCircle className="w-4 h-4 text-green-400" />
      case 'failed':
        return <IoCloseCircle className="w-4 h-4 text-red-400" />
      case 'pending':
        return <IoTime className="w-4 h-4 text-yellow-400 animate-pulse" />
      default:
        return <IoTime className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: Transaction['status']) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-400'
      case 'failed':
        return 'text-red-400'
      case 'pending':
        return 'text-yellow-400'
      default:
        return 'text-gray-400'
    }
  }

  const getTypeIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'swap':
      case 'batch_swap':
        return <IoSwapHorizontal className="w-4 h-4 text-[#723680]" />
      case 'faucet':
        return <IoCash className="w-4 h-4 text-[#723680]" />
      default:
        return <IoSwapHorizontal className="w-4 h-4 text-[#723680]" />
    }
  }

  const formatTime = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  const formatHash = (hash: string) => {
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`
  }

  const refreshTransactions = async () => {
    setIsRefreshing(true)
    
    // TODO: Implement actual transaction status checking from blockchain
    // For now, just refresh the UI
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  const handleClearTransactions = () => {
    if (showClearConfirm) {
      clearTransactions()
      setShowClearConfirm(false)
    } else {
      setShowClearConfirm(true)
      // Auto-hide confirmation after 3 seconds
      setTimeout(() => setShowClearConfirm(false), 3000)
    }
  }

  if (recentTransactions.length === 0) {
    return (
      <div className="bg-black border-2 border-[#290038] rounded-xl p-6 shadow-2xl backdrop-blur-sm">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <IoTime className="w-5 h-5 mr-2 text-[#723680]" />
          Recent Transactions
        </h3>
        
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-[#290038]/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <IoSwapHorizontal className="w-8 h-8 text-[#723680]/50" />
          </div>
          <p className="text-white/60 text-sm">
            Transaction history cleared. New transactions will appear here.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-black border-2 border-[#290038] rounded-xl p-6 shadow-2xl backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <IoTime className="w-5 h-5 mr-2 text-[#723680]" />
          Recent Transactions
        </h3>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handleClearTransactions}
            className={`p-2 rounded-lg transition-colors ${
              showClearConfirm 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-[#290038] hover:bg-[#723680] text-white'
            }`}
            title={showClearConfirm ? "Click again to confirm clear" : "Clear all transactions"}
          >
            <IoTrash className="w-4 h-4" />
          </button>
          
          <button
            onClick={refreshTransactions}
            disabled={isRefreshing}
            className="p-2 bg-[#290038] hover:bg-[#723680] rounded-lg transition-colors disabled:opacity-50"
            title="Refresh transactions"
          >
            <IoRefresh className={`w-4 h-4 text-white ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>
      
      {showClearConfirm && (
        <div className="mb-4 p-3 bg-red-600/10 border border-red-600/30 rounded-lg">
          <p className="text-red-400 text-sm text-center">
            Click the trash icon again to clear all transaction history
          </p>
        </div>
      )}
      
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {recentTransactions.map((tx) => (
          <div
            key={tx.id}
            className="bg-gradient-to-r from-[#461561]/20 to-[#723680]/20 border border-[#290038] rounded-lg p-4 hover:from-[#461561]/30 hover:to-[#723680]/30 transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                {getTypeIcon(tx.type)}
                <span className="text-white font-medium text-sm">
                  {tx.description}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusIcon(tx.status)}
                <span className={`text-xs font-medium ${getStatusColor(tx.status)}`}>
                  {tx.status.toUpperCase()}
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-xs text-white/60">
              <div className="flex items-center space-x-4">
                <span className="font-mono">
                  {formatHash(tx.hash)}
                </span>
                {tx.fromToken && tx.toToken && (
                  <span>
                    {tx.fromAmount} {tx.fromToken} → {tx.toAmount} {tx.toToken}
                  </span>
                )}
              </div>
              <span>{formatTime(tx.timestamp)}</span>
            </div>
            
            {tx.blockNumber && (
              <div className="mt-2 text-xs text-white/40">
                Block #{tx.blockNumber}
              </div>
            )}
          </div>
        ))}
      </div>
      
      {recentTransactions.length >= 5 && (
        <div className="mt-4 text-center">
          <button className="text-[#723680] hover:text-[#8A4A9A] text-sm font-medium transition-colors">
            View All Transactions
          </button>
        </div>
      )}
    </div>
  )
}

export default RecentTransactions
