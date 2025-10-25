"use client"

import React from "react"
import { SwapPairData } from "./BatchSwapInterface"
import Button from "../ui/Button"
import { IoArrowForward, IoFlash, IoShieldCheckmark, IoTime } from "react-icons/io5"

interface BatchSummaryProps {
  swapPairs: SwapPairData[]
  totalValue: number
  onExecute: () => void
  isConnected: boolean
  isExecuting: boolean
  txHash: string | null
  address: string | null
}

const BatchSummary: React.FC<BatchSummaryProps> = ({ 
  swapPairs, 
  totalValue, 
  onExecute, 
  isConnected, 
  isExecuting, 
  txHash, 
  address 
}) => {
  const validPairs = swapPairs.filter(pair => 
    pair.fromAmount && pair.toAmount && parseFloat(pair.fromAmount) > 0
  )

  const isReadyToExecute = validPairs.length > 0 && validPairs.length === swapPairs.length && isConnected

  return (
    <div className="bg-[#000000] border border-white/10 rounded-xl p-6 shadow-lg">
      <h3 className="text-lg font-semibold text-white/95 mb-4">Batch Summary</h3>
      
      <div className="space-y-4">
        {/* Transaction Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#1A1A1A] border border-white/10 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <IoFlash className="w-4 h-4 text-[#723680]" />
              <span className="text-sm font-medium text-white/95">Total Pairs</span>
            </div>
            <div className="text-2xl font-bold text-white/95">{swapPairs.length}</div>
          </div>
          
          <div className="bg-[#1A1A1A] border border-white/10 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <IoShieldCheckmark className="w-4 h-4 text-[#723680]" />
              <span className="text-sm font-medium text-white/95">Estimated Gas</span>
            </div>
            <div className="text-2xl font-bold text-white/95">~$2.50</div>
          </div>
          
          <div className="bg-[#1A1A1A] border border-white/10 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <IoTime className="w-4 h-4 text-[#723680]" />
              <span className="text-sm font-medium text-white/95">Est. Time</span>
            </div>
            <div className="text-2xl font-bold text-white/95">~30s</div>
          </div>
        </div>

        {/* Swap Details */}
        <div className="space-y-3">
          <h4 className="font-medium text-white/95">Swap Details</h4>
          {swapPairs.map((pair, index) => (
            <div key={pair.id} className="flex items-center justify-between bg-[#1A1A1A] border border-white/10 rounded-lg p-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-[#723680]/20 border border-[#723680]/30 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-[#723680]">{index + 1}</span>
                </div>
                <div>
                  <div className="font-medium text-white/95">
                    {pair.fromAmount} {pair.fromToken}
                  </div>
                  <div className="text-sm text-white/70">
                    Rate: 1 {pair.fromToken} = {pair.rate} {pair.toToken}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <IoArrowForward className="w-4 h-4 text-white/70" />
                <div className="text-right">
                  <div className="font-medium text-white/95">
                    {pair.toAmount} {pair.toToken}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Wallet Status */}
        {address && (
          <div className="bg-[#1A1A1A] border border-white/10 rounded-lg p-4">
            <h4 className="font-medium text-white/95 mb-2">Wallet Connected</h4>
            <div className="text-sm text-white/70">
              <div>Address: {address.slice(0, 6)}...{address.slice(-4)}</div>
            </div>
          </div>
        )}

        {/* Transaction Status */}
        {txHash && (
          <div className="bg-[#723680]/10 border border-[#723680]/20 rounded-lg p-4">
            <h4 className="font-medium text-[#723680] mb-2">Transaction Submitted</h4>
            <div className="text-sm text-white/80">
              <div>Hash: {txHash.slice(0, 10)}...{txHash.slice(-8)}</div>
              <div className="text-[#723680] mt-1">✓ Transaction submitted to Avail network</div>
            </div>
          </div>
        )}

        {/* Benefits */}
        <div className="bg-[#723680]/10 border border-[#723680]/20 rounded-lg p-4">
          <h4 className="font-medium text-[#723680] mb-2">Batch Benefits</h4>
          <ul className="text-sm text-white/80 space-y-1">
            <li>• Single transaction for all swaps</li>
            <li>• Reduced gas fees compared to individual swaps</li>
            <li>• Atomic execution - all or nothing</li>
            <li>• Better price execution through batch routing</li>
          </ul>
        </div>

        {/* Execute Button */}
        <Button
          onClick={onExecute}
          disabled={!isReadyToExecute || isExecuting}
          className={`w-full py-4 bg-gradient-to-r from-[#723680] to-[#461561] hover:from-[#290038] hover:to-[#723680] ${!isReadyToExecute || isExecuting ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isExecuting 
            ? "Executing Batch Swap..." 
            : !isConnected 
            ? "Connect Wallet to Continue"
            : isReadyToExecute 
            ? `Execute Batch Swap (${validPairs.length} pairs)` 
            : "Complete all swap pairs to continue"
          }
        </Button>
      </div>
    </div>
  )
}

export default BatchSummary

