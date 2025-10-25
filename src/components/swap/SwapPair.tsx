"use client"

import React from "react"
import TokenSelector from "./TokenSelector"
import Button from "../ui/Button"
import { IoClose, IoSwapVertical } from "react-icons/io5"
import { SwapPairData } from "./BatchSwapInterface"

interface SwapPairProps {
  pair: SwapPairData
  onUpdate: (updates: Partial<SwapPairData>) => void
  onRemove: () => void
  canRemove: boolean
}

const SwapPair: React.FC<SwapPairProps> = ({ pair, onUpdate, onRemove, canRemove }) => {
  const handleFromAmountChange = (amount: string) => {
    const rate = pair.rate
    const toAmount = amount ? (parseFloat(amount) * rate).toFixed(6) : ""
    onUpdate({ fromAmount: amount, toAmount })
  }

  const handleToAmountChange = (amount: string) => {
    const rate = pair.rate
    const fromAmount = amount ? (parseFloat(amount) / rate).toFixed(6) : ""
    onUpdate({ toAmount: amount, fromAmount })
  }

  const swapTokens = () => {
    onUpdate({
      fromToken: pair.toToken,
      toToken: pair.fromToken,
      fromAmount: pair.toAmount,
      toAmount: pair.fromAmount
    })
  }

  return (
    <div className="bg-[#000000] border border-white/10 rounded-lg p-4 relative">
      {canRemove && (
        <Button
          onClick={onRemove}
          className="absolute -top-2 -right-2 w-6 h-6 !p-0 !min-w-0 bg-[#290038] hover:bg-[#461561]"
        >
          <IoClose className="w-3 h-3" />
        </Button>
      )}

      <div className="space-y-4">
        {/* From Token */}
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">From</label>
          <div className="flex space-x-2">
            <TokenSelector
              value={pair.fromToken}
              onChange={(token) => onUpdate({ fromToken: token })}
              className="w-32"
            />
            <input
              type="number"
              placeholder="0.0"
              value={pair.fromAmount}
              onChange={(e) => handleFromAmountChange(e.target.value)}
              className="flex-1 bg-[#1A1A1A] border border-white/10 rounded-lg px-4 py-3 text-white/95 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#723680]/50 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <Button
            onClick={swapTokens}
            className="p-2 !px-3 !py-2 bg-gradient-to-r from-[#723680] to-[#461561] hover:from-[#290038] hover:to-[#723680]"
          >
            <IoSwapVertical className="w-4 h-4" />
          </Button>
        </div>

        {/* To Token */}
        <div>
          <label className="block text-sm font-medium text-white/95 mb-2">To</label>
          <div className="flex space-x-2">
            <TokenSelector
              value={pair.toToken}
              onChange={(token) => onUpdate({ toToken: token })}
              className="w-32"
            />
            <input
              type="number"
              placeholder="0.0"
              value={pair.toAmount}
              onChange={(e) => handleToAmountChange(e.target.value)}
              className="flex-1 bg-[#1A1A1A] border border-white/10 rounded-lg px-4 py-3 text-white/95 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#723680]/50 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Rate Display */}
        <div className="text-sm text-white/70 text-center">
          Rate: 1 {pair.fromToken} = {pair.rate} {pair.toToken}
        </div>
      </div>
    </div>
  )
}

export default SwapPair

