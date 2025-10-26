"use client"

import React, { useState } from "react"
import SwapPair from "./SwapPair"
import BatchSummary from "./BatchSummary"
import Button from "../ui/Button"
import { IoAdd, IoSwapHorizontal } from "react-icons/io5"
import { useWallet } from "../../contexts/WalletContext"
import { useTransactions } from "../../contexts/TransactionContext"
import { availService, BatchSwapData } from "../../services/availService"
import { SwapContractService } from "../../services/swapContractService"
import SuccessAnimation from "../SuccessAnimation"

export interface SwapPairData {
  id: string
  fromToken: string
  toToken: string
  fromAmount: string
  toAmount: string
}

const BatchSwapInterface: React.FC = () => {
  const { isConnected, address, connectWallet } = useWallet()
  const { addTransaction, updateTransaction } = useTransactions()
  
  // Initialize contract service for real wallet signing
  React.useEffect(() => {
    if (isConnected) {
      const contractService = new SwapContractService()
      availService.setSwapContractService(contractService)
      console.log('✅ Contract service initialized for real wallet signing')
    }
  }, [isConnected])
  const [swapPairs, setSwapPairs] = useState<SwapPairData[]>([
    {
      id: "1",
      fromToken: "AVAI",
      toToken: "USDC",
      fromAmount: "",
      toAmount: ""
    }
  ])
  const [isExecuting, setIsExecuting] = useState(false)
  const [txHash, setTxHash] = useState<string | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)

  const addSwapPair = () => {
    const newPair: SwapPairData = {
      id: Date.now().toString(),
      fromToken: "AVAI",
      toToken: "USDC",
      fromAmount: "",
      toAmount: ""
    }
    setSwapPairs([...swapPairs, newPair])
  }

  const removeSwapPair = (id: string) => {
    if (swapPairs.length > 1) {
      setSwapPairs(swapPairs.filter(pair => pair.id !== id))
    }
  }

  const updateSwapPair = (id: string, updates: Partial<SwapPairData>) => {
    setSwapPairs(swapPairs.map(pair => 
      pair.id === id ? { ...pair, ...updates } : pair
    ))
  }

  const executeBatchSwap = async () => {
    if (!isConnected) {
      await connectWallet()
      return
    }

    setIsExecuting(true)
    setTxHash(null)
    let transactionId: string | null = null

    try {
      // Validate swap pairs
      const validPairs = swapPairs.filter(pair => 
        pair.fromAmount && 
        pair.toAmount && 
        parseFloat(pair.fromAmount) > 0 &&
        pair.fromToken !== pair.toToken
      )

      if (validPairs.length === 0) {
        throw new Error('No valid swap pairs to execute')
      }

      // Convert swap pairs to batch swap data
      const batchSwapData: BatchSwapData[] = validPairs.map(pair => {
        // Calculate the actual rate from the amounts
        const rate = pair.fromAmount && pair.toAmount ? 
          parseFloat(pair.toAmount) / parseFloat(pair.fromAmount) : 1.0
        
        return {
          fromToken: pair.fromToken,
          toToken: pair.toToken,
          fromAmount: pair.fromAmount,
          toAmount: pair.toAmount,
          rate: rate
        }
      })

      console.log("Executing batch swap with real data:", batchSwapData)
      
      // Calculate total value for display
      const totalValue = batchSwapData.reduce((sum, swap) => {
        return sum + parseFloat(swap.fromAmount)
      }, 0)
      
      console.log(`Total swap value: $${totalValue.toFixed(2)}`)
      
      // Create transaction record
      transactionId = addTransaction({
        hash: '', // Will be updated after execution
        type: 'batch_swap',
        status: 'pending',
        fromToken: validPairs[0].fromToken,
        toToken: validPairs[validPairs.length - 1].toToken,
        fromAmount: totalValue.toString(),
        toAmount: batchSwapData.reduce((sum, swap) => sum + parseFloat(swap.toAmount), 0).toString(),
        description: `Batch swap ${validPairs.length} pairs`
      })
      
      // Execute batch swap using Avail SDK
      const hash = await availService.executeBatchSwaps(batchSwapData)
      setTxHash(hash)
      setShowSuccess(true)
      
      // Update transaction with hash and mark as confirmed
      updateTransaction(transactionId, {
        hash,
        status: 'confirmed'
      })
      
      console.log("Batch swap executed successfully:", hash)
    } catch (error) {
      console.error("Batch swap failed:", error)
      
      // Update transaction status to failed
      if (transactionId) {
        updateTransaction(transactionId, {
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
      
      // Show user-friendly error message
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      console.error(`Batch swap failed: ${errorMessage}`)
      
      // Don't show alert for simulation errors in development
      if (!errorMessage.includes('simulation')) {
        alert(`Batch swap failed: ${errorMessage}`)
      }
    } finally {
      setIsExecuting(false)
    }
  }

  const totalValue = swapPairs.reduce((sum, pair) => {
    const amount = parseFloat(pair.fromAmount) || 0
    return sum + amount
  }, 0)

  return (
    <div className="space-y-6">
      {/* Main Swap Interface */}
      <div className="bg-[#000000] border border-white/10 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="space-y-4">
          {swapPairs.map((pair, index) => (
            <div key={pair.id} className="relative">
              <SwapPair
                pair={pair}
                onUpdate={(updates) => updateSwapPair(pair.id, updates)}
                onRemove={() => removeSwapPair(pair.id)}
                canRemove={swapPairs.length > 1}
              />
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={addSwapPair}
            className="group relative overflow-hidden bg-gradient-to-r from-[#723680] to-[#461561] hover:from-[#290038] hover:to-[#723680] rounded-lg px-6 py-3 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-[#723680]/25"
          >
            <div className="flex items-center space-x-2 relative z-10">
              <IoAdd className="w-4 h-4 text-white" />
              <span className="text-white font-medium">Add Pair</span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#290038] to-[#723680] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>
      </div>

      {/* Batch Summary */}
      <BatchSummary 
        swapPairs={swapPairs}
        totalValue={totalValue}
        onExecute={executeBatchSwap}
        isConnected={isConnected}
        isExecuting={isExecuting}
        txHash={txHash}
        address={address}
      />

      {/* Success Animation */}
      <SuccessAnimation 
        isVisible={showSuccess}
        onComplete={() => setShowSuccess(false)}
      />
    </div>
  )
}

export default BatchSwapInterface

