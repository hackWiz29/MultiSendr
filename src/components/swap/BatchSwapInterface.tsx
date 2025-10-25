"use client"

import React, { useState } from "react"
import SwapPair from "./SwapPair"
import BatchSummary from "./BatchSummary"
import Button from "../ui/Button"
import { IoAdd, IoSwapHorizontal } from "react-icons/io5"
import { useAvailWallet } from "../../hooks/useAvailWallet"
import { availService, BatchSwapData } from "../../services/availService"

export interface SwapPairData {
  id: string
  fromToken: string
  toToken: string
  fromAmount: string
  toAmount: string
  rate: number
}

const BatchSwapInterface: React.FC = () => {
  const { isConnected, address, connectWallet } = useAvailWallet()
  const [swapPairs, setSwapPairs] = useState<SwapPairData[]>([
    {
      id: "1",
      fromToken: "USDC",
      toToken: "USDT",
      fromAmount: "",
      toAmount: "",
      rate: 1.0
    }
  ])
  const [isExecuting, setIsExecuting] = useState(false)
  const [txHash, setTxHash] = useState<string | null>(null)

  const addSwapPair = () => {
    const newPair: SwapPairData = {
      id: Date.now().toString(),
      fromToken: "USDC",
      toToken: "USDT",
      fromAmount: "",
      toAmount: "",
      rate: 1.0
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

    try {
      // Convert swap pairs to batch swap data
      const batchSwapData: BatchSwapData[] = swapPairs
        .filter(pair => pair.fromAmount && pair.toAmount && parseFloat(pair.fromAmount) > 0)
        .map(pair => ({
          fromToken: pair.fromToken,
          toToken: pair.toToken,
          fromAmount: pair.fromAmount,
          toAmount: pair.toAmount,
          rate: pair.rate
        }))

      if (batchSwapData.length === 0) {
        throw new Error('No valid swap pairs to execute')
      }

      console.log("Executing batch swap with Avail SDK:", batchSwapData)
      
      // Execute batch swap using Avail SDK
      const hash = await availService.executeBatchSwaps(batchSwapData)
      setTxHash(hash)
      
      console.log("Batch swap executed successfully:", hash)
    } catch (error) {
      console.error("Batch swap failed:", error)
      alert(`Batch swap failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
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
      <div className="bg-[#000000] border border-white/10 rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white/95">Swap Pairs</h2>
          <Button
            onClick={addSwapPair}
            className="flex items-center space-x-2 bg-gradient-to-r from-[#723680] to-[#461561] hover:from-[#290038] hover:to-[#723680]"
          >
            <IoAdd className="w-4 h-4" />
            <span>Add Pair</span>
          </Button>
        </div>

        <div className="space-y-4">
          {swapPairs.map((pair, index) => (
            <div key={pair.id} className="relative">
              {index > 0 && (
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="bg-[#000000] border border-white/10 rounded-full p-1">
                    <IoSwapHorizontal className="w-4 h-4 text-[#723680]" />
                  </div>
                </div>
              )}
              <SwapPair
                pair={pair}
                onUpdate={(updates) => updateSwapPair(pair.id, updates)}
                onRemove={() => removeSwapPair(pair.id)}
                canRemove={swapPairs.length > 1}
              />
            </div>
          ))}
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
    </div>
  )
}

export default BatchSwapInterface

