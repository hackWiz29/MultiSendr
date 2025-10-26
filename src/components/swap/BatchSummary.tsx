"use client"

import React, { useState, useEffect } from "react"
import { SwapPairData } from "./BatchSwapInterface"
import Button from "../ui/Button"
import { 
  IoArrowForward, 
  IoFlash, 
  IoShieldCheckmark, 
  IoTime, 
  IoCheckmarkCircle, 
  IoRocket, 
  IoWallet, 
  IoCloseCircle,
  IoTrendingUp,
  IoCalculator,
  IoInformationCircle
} from "react-icons/io5"
import { useTransactionStatus } from "../../hooks/useTransactionStatus"

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
  const [showSuccess, setShowSuccess] = useState(false)
  const [progress, setProgress] = useState(0)
  const [showSavings, setShowSavings] = useState(false)
  const { status, isLoading: statusLoading } = useTransactionStatus(txHash)

  const validPairs = swapPairs.filter(pair => 
    pair.fromAmount && pair.toAmount && parseFloat(pair.fromAmount) > 0
  )

  const isReadyToExecute = validPairs.length > 0 && validPairs.length === swapPairs.length && isConnected

  // Calculate total input value
  const totalInputValue = validPairs.reduce((sum, pair) => {
    const amount = parseFloat(pair.fromAmount) || 0
    return sum + amount
  }, 0)

  // Calculate individual vs batch gas costs
  const individualGasCost = validPairs.length * 2.50 // $2.50 per individual swap
  const batchGasCost = 2.50 // Single batch transaction
  const gasSavings = individualGasCost - batchGasCost
  const savingsPercentage = individualGasCost > 0 ? ((gasSavings / individualGasCost) * 100) : 0

  useEffect(() => {
    if (status?.status === 'confirmed') {
      setShowSuccess(true)
      setProgress(100)
    } else if (status?.status === 'failed') {
      setShowSuccess(false)
      setProgress(0)
    }
  }, [status])

  useEffect(() => {
    if (isExecuting) {
      const interval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90))
      }, 200)
      return () => clearInterval(interval)
    } else {
      setProgress(0)
    }
  }, [isExecuting])

  return (
    <div className={`bg-black border rounded-lg p-6 shadow-lg transition-all duration-500 ${
      showSuccess 
        ? 'border-[#723680]/60 shadow-[#723680]/30' 
        : 'border-[#290038] hover:border-[#290038]/80'
    }`}>
      {/* Header Section */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white/95 flex items-center">
          <IoRocket className="w-5 h-5 mr-2 text-[#723680]" />
          Batch Summary
        </h3>
        {showSuccess && (
          <div className="flex items-center text-[#723680] animate-pulse">
            <IoCheckmarkCircle className="w-5 h-5 mr-1" />
            <span className="text-sm font-medium">Success!</span>
          </div>
        )}
      </div>
      
      <div className="space-y-4">
        {/* Enhanced Transaction Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-black border border-[#290038] rounded-lg p-4 hover:border-[#290038]/80 transition-all duration-300">
            <div className="flex items-center space-x-2 mb-2">
              <IoFlash className="w-4 h-4 text-[#723680]" />
              <span className="text-sm font-medium text-white/95">Swap Pairs</span>
            </div>
            <div className="text-2xl font-bold text-white/95">{validPairs.length}</div>
            <div className="text-xs text-white/60 mt-1">of {swapPairs.length} configured</div>
          </div>
          
          <div className="bg-black border border-[#290038] rounded-lg p-4 hover:border-[#290038]/80 transition-all duration-300">
            <div className="flex items-center space-x-2 mb-2">
              <IoTrendingUp className="w-4 h-4 text-[#723680]" />
              <span className="text-sm font-medium text-white/95">Total Value</span>
            </div>
            <div className="text-2xl font-bold text-white/95">{totalInputValue.toFixed(2)}</div>
            <div className="text-xs text-white/60 mt-1">tokens to swap</div>
          </div>
          
          <div className="bg-black border border-[#290038] rounded-lg p-4 hover:border-[#290038]/80 transition-all duration-300">
            <div className="flex items-center space-x-2 mb-2">
              <IoShieldCheckmark className="w-4 h-4 text-[#723680]" />
              <span className="text-sm font-medium text-white/95">Gas Cost</span>
            </div>
            <div className="text-2xl font-bold text-white/95">${batchGasCost.toFixed(2)}</div>
            <div className="text-xs text-white/60 mt-1">batch transaction</div>
          </div>
          
          <div className="bg-black border border-[#290038] rounded-lg p-4 hover:border-[#290038]/80 transition-all duration-300">
            <div className="flex items-center space-x-2 mb-2">
              <IoTime className="w-4 h-4 text-[#723680]" />
              <span className="text-sm font-medium text-white/95">Est. Time</span>
            </div>
            <div className="text-2xl font-bold text-white/95">~30s</div>
            <div className="text-xs text-white/60 mt-1">confirmation time</div>
          </div>
        </div>

        {/* Enhanced Swap Details */}
        <div className="space-y-3">
          <h4 className="font-medium text-white/95">Swap Details</h4>
          {swapPairs.map((pair, index) => {
            const isValid = pair.fromAmount && pair.toAmount && parseFloat(pair.fromAmount) > 0
            return (
              <div key={pair.id} className={`flex items-center justify-between bg-black border rounded-lg p-3 ${
                isValid 
                  ? 'border-[#290038] hover:border-[#290038]/80' 
                  : 'border-[#290038]/50'
              }`}>
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 border rounded-full flex items-center justify-center ${
                    isValid 
                      ? 'bg-[#723680]/20 border-[#723680]/30' 
                      : 'bg-white/5 border-white/20'
                  }`}>
                    <span className={`text-sm font-medium ${isValid ? 'text-[#723680]' : 'text-white/40'}`}>
                      {index + 1}
                    </span>
                  </div>
                  <div>
                    <div className={`font-medium ${isValid ? 'text-white/95' : 'text-white/50'}`}>
                      {pair.fromAmount || '0'} {pair.fromToken}
                    </div>
                    <div className="text-sm text-white/70">
                      {pair.fromAmount && pair.toAmount ? 
                        `Rate: 1 ${pair.fromToken} = ${(parseFloat(pair.toAmount) / parseFloat(pair.fromAmount)).toFixed(4)} ${pair.toToken}` :
                        `Rate: Loading...`
                      }
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <IoArrowForward className={`w-4 h-4 ${isValid ? 'text-white/70' : 'text-white/30'}`} />
                  <div className="text-right">
                    <div className={`font-medium ${isValid ? 'text-white/95' : 'text-white/50'}`}>
                      {pair.toAmount || '0'} {pair.toToken}
                    </div>
                    {isValid && (
                      <div className="text-xs text-green-400 flex items-center justify-end">
                        <IoCheckmarkCircle className="w-3 h-3 mr-1" />
                        Ready
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Gas Savings Calculator */}
        {validPairs.length > 1 && (
          <div className="bg-black border border-[#290038] rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-[#723680] flex items-center">
                <IoCalculator className="w-4 h-4 mr-2" />
                Gas Savings Calculator
              </h4>
              <button 
                onClick={() => setShowSavings(!showSavings)}
                className="text-sm text-[#723680] hover:text-white/80 transition-colors"
              >
                {showSavings ? 'Hide Details' : 'Show Details'}
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-xl font-bold text-white/95">${individualGasCost.toFixed(2)}</div>
                <div className="text-sm text-white/70">Individual Swaps</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-white/95">${batchGasCost.toFixed(2)}</div>
                <div className="text-sm text-white/70">Batch Swap</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-green-400">${gasSavings.toFixed(2)}</div>
                <div className="text-sm text-green-400">You Save ({savingsPercentage.toFixed(0)}%)</div>
              </div>
            </div>
            
            {showSavings && (
              <div className="mt-3 pt-3 border-t border-[#290038]">
                <div className="text-sm text-white/80 space-y-1">
                  <div>• Individual swaps: {validPairs.length} × $2.50 = ${individualGasCost.toFixed(2)}</div>
                  <div>• Batch transaction: 1 × $2.50 = ${batchGasCost.toFixed(2)}</div>
                  <div className="text-green-400 font-semibold">• Total savings: ${gasSavings.toFixed(2)} ({savingsPercentage.toFixed(0)}% reduction)</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Enhanced Wallet Status */}
        {address && (
          <div className="bg-black border border-[#290038] rounded-lg p-4">
            <h4 className="font-medium text-white/95 mb-2 flex items-center">
              <IoWallet className="w-4 h-4 mr-2 text-[#723680]" />
              Wallet Connected
            </h4>
            <div className="flex items-center justify-between">
              <div className="text-sm text-white/70">
                <div>Address: {address.slice(0, 8)}...{address.slice(-6)}</div>
                <div className="text-xs text-white/60 mt-1">Ready to execute batch swap</div>
              </div>
              <div className="flex items-center text-green-400">
                <IoCheckmarkCircle className="w-4 h-4 mr-1" />
                <span className="text-sm font-medium">Connected</span>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Transaction Status */}
        {txHash && status && (
          <div className={`border rounded-lg p-4 transition-all duration-500 ${
            status.status === 'confirmed' 
              ? 'bg-green-600/10 border-green-600/20' 
              : status.status === 'failed'
              ? 'bg-red-600/10 border-red-600/20'
              : 'bg-[#723680]/10 border-[#723680]/20'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <h4 className={`font-medium flex items-center ${
                status.status === 'confirmed' 
                  ? 'text-green-400' 
                  : status.status === 'failed'
                  ? 'text-red-400'
                  : 'text-[#723680]'
              }`}>
                {status.status === 'confirmed' && <IoCheckmarkCircle className="w-4 h-4 mr-2" />}
                {status.status === 'failed' && <IoCloseCircle className="w-4 h-4 mr-2" />}
                {status.status === 'pending' && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#723680] mr-2"></div>}
                {status.status === 'confirmed' && 'Transaction Confirmed'}
                {status.status === 'failed' && 'Transaction Failed'}
                {status.status === 'pending' && 'Transaction Pending'}
              </h4>
              <div className={`text-xs px-2 py-1 rounded-full ${
                status.status === 'confirmed' 
                  ? 'bg-green-600/20 text-green-400' 
                  : status.status === 'failed'
                  ? 'bg-red-600/20 text-red-400'
                  : 'bg-[#723680]/20 text-[#723680]'
              }`}>
                {status.status.toUpperCase()}
              </div>
            </div>
            
            <div className="text-sm text-white/80 space-y-1">
              <div className="font-mono text-xs bg-black/30 rounded px-2 py-1 inline-block">
                {txHash.slice(0, 12)}...{txHash.slice(-10)}
              </div>
              {status.status === 'confirmed' && (
                <div className="text-green-400 flex items-center">
                  <IoCheckmarkCircle className="w-4 h-4 mr-2" />
                  Transaction confirmed on Avail testnet
                </div>
              )}
              {status.status === 'failed' && (
                <div className="text-red-400 flex items-center">
                  <IoCloseCircle className="w-4 h-4 mr-2" />
                  {status.error || 'Transaction failed'}
                </div>
              )}
              {status.status === 'pending' && (
                <div className="text-[#723680] flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#723680] mr-2"></div>
                  Waiting for confirmation...
                </div>
              )}
            </div>
          </div>
        )}


        {/* Enhanced Progress Bar */}
        {isExecuting && (
          <div className="bg-black border border-[#290038] rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-white/95 flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#723680] mr-2"></div>
                Processing Transaction
              </span>
              <span className="text-sm font-bold text-[#723680]">{progress}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-[#723680] to-[#461561] h-2 rounded-full transition-all duration-500 ease-out relative"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
              </div>
            </div>
            <div className="text-xs text-white/60 mt-2">
              Broadcasting transaction to Avail network...
            </div>
          </div>
        )}

        {/* Enhanced Execute Button */}
        <Button
          onClick={onExecute}
          disabled={!isReadyToExecute || isExecuting}
          className={`w-full py-4 transition-all duration-300 ${
            showSuccess 
              ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800' 
              : 'bg-gradient-to-r from-[#723680] to-[#461561] hover:from-[#290038] hover:to-[#723680]'
          } ${!isReadyToExecute || isExecuting ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'} rounded-lg font-semibold`}
        >
          <div className="flex items-center justify-center">
            {isExecuting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                <span>Executing Batch Swap...</span>
              </>
            ) : showSuccess ? (
              <>
                <IoCheckmarkCircle className="w-5 h-5 mr-2" />
                <span>Transaction Successful!</span>
              </>
            ) : !isConnected ? (
              <>
                <IoWallet className="w-5 h-5 mr-2" />
                <span>Connect Wallet to Continue</span>
              </>
            ) : isReadyToExecute ? (
              <>
                <IoRocket className="w-5 h-5 mr-2" />
                <span>Execute Batch Swap ({validPairs.length} pairs)</span>
              </>
            ) : (
              <span>Complete all swap pairs to continue</span>
            )}
          </div>
        </Button>
      </div>
    </div>
  )
}

export default BatchSummary

