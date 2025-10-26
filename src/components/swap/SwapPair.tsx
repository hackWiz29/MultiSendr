"use client"

import React, { useState, useEffect } from "react"
import TokenSelector from "./TokenSelector"
import { IoClose, IoSwapVertical, IoWarning } from "react-icons/io5"
import { SwapPairData } from "./BatchSwapInterface"
import { useWallet } from "../../contexts/WalletContext"

interface SwapPairProps {
  pair: SwapPairData
  onUpdate: (updates: Partial<SwapPairData>) => void
  onRemove: () => void
  canRemove: boolean
}

const SwapPair: React.FC<SwapPairProps> = ({ pair, onUpdate, onRemove, canRemove }) => {
  const [isAnimating, setIsAnimating] = useState(false)
  const [isValid, setIsValid] = useState(true)
  const [tokenBalances, setTokenBalances] = useState<Record<string, string>>({})
  const [currentRate, setCurrentRate] = useState<number>(1)
  const [isLoadingRate, setIsLoadingRate] = useState(false)
  const [rateError, setRateError] = useState<string | null>(null)
  const { isConnected, address, balance } = useWallet()

  // Helper function to check if token has balance
  const hasBalance = (tokenSymbol: string): boolean => {
    const balance = parseFloat(tokenBalances[tokenSymbol] || '0')
    console.log(`🔍 Checking balance for ${tokenSymbol}: ${tokenBalances[tokenSymbol]} (numeric: ${balance})`)
    return balance > 0
  }

  // Fetch exchange rate
  const fetchExchangeRate = async (fromToken: string, toToken: string) => {
    if (fromToken === toToken) {
      setCurrentRate(1)
      setRateError(null)
      return
    }

    setIsLoadingRate(true)
    setRateError(null)

    try {
      const response = await fetch(`/api/exchange-rate?fromToken=${fromToken}&toToken=${toToken}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      // Validate the rate
      if (!data.rate || data.rate <= 0 || !isFinite(data.rate)) {
        throw new Error('Invalid rate received from API')
      }
      
      setCurrentRate(data.rate)
      console.log(`📊 Exchange rate ${fromToken}/${toToken}: ${data.rate} (fromPrice: ${data.fromPrice}, toPrice: ${data.toPrice})`)
    } catch (error) {
      console.error('Error fetching exchange rate:', error)
      setRateError('Failed to fetch rate')
      setCurrentRate(1) // Fallback to 1:1
    } finally {
      setIsLoadingRate(false)
    }
  }

  // Fetch token balances
  useEffect(() => {
    const fetchTokenBalances = async () => {
      if (isConnected && address) {
        try {
          const balances: Record<string, string> = {}
          
          // Fetch balance for fromToken
          if (pair.fromToken) {
            console.log(`🔄 Fetching balance for ${pair.fromToken} for address: ${address}`)
            
            if (pair.fromToken === 'AVAI') {
              // For AVAIL, use the balance from wallet context
              console.log(`📊 Using wallet balance for AVAI: ${balance}`)
              
              if (balance) {
                // Extract numeric value from balance string (e.g., "1.5 AVAIL" -> "1.5")
                let numericBalance = balance
                  .replace(' AVAIL', '') // Remove AVAIL suffix
                  .replace(/,/g, '') // Remove commas
                  .trim() // Remove whitespace
                
                const parsedBalance = parseFloat(numericBalance)
                if (isNaN(parsedBalance)) {
                  console.warn(`⚠️ Invalid wallet balance format: ${balance}`)
                  balances[pair.fromToken] = '0.0'
                } else {
                  balances[pair.fromToken] = parsedBalance.toString()
                  console.log(`✅ Parsed AVAI balance: ${parsedBalance}`)
                }
              } else {
                console.warn(`⚠️ No wallet balance available`)
                balances[pair.fromToken] = '0.0'
              }
            } else {
              // For other tokens, use API
              const response = await fetch(`/api/token-balance?address=${address}&token=${pair.fromToken}`)
              if (response.ok) {
                const data = await response.json()
                console.log(`✅ API response for ${pair.fromToken}:`, data)
                balances[pair.fromToken] = data.balance || '0.0'
              } else {
                console.error(`❌ Failed to fetch balance for ${pair.fromToken}:`, response.status)
                balances[pair.fromToken] = '0.0'
              }
            }
          }
          
          console.log(`📊 Setting token balances:`, balances)
          setTokenBalances(balances)
        } catch (error) {
          console.warn('Failed to fetch token balances:', error)
          setTokenBalances({})
        }
      }
    }

    fetchTokenBalances()
  }, [isConnected, address, pair.fromToken])

  // Debug function to verify rate calculations
  const debugRateCalculation = () => {
    console.log('🔍 Rate Debug Info:')
    console.log(`- From Token: ${pair.fromToken}`)
    console.log(`- To Token: ${pair.toToken}`)
    console.log(`- Current Rate: ${currentRate}`)
    console.log(`- From Amount: ${pair.fromAmount}`)
    console.log(`- To Amount: ${pair.toAmount}`)
    if (pair.fromAmount && pair.toAmount) {
      const calculatedRate = parseFloat(pair.toAmount) / parseFloat(pair.fromAmount)
      console.log(`- Calculated Rate from amounts: ${calculatedRate}`)
      console.log(`- Rate difference: ${Math.abs(currentRate - calculatedRate)}`)
    }
  }

  // Debug when amounts change
  useEffect(() => {
    if (pair.fromAmount && pair.toAmount && currentRate > 0) {
      debugRateCalculation()
    }
  }, [pair.fromAmount, pair.toAmount, currentRate])

  // Fetch exchange rate when tokens change
  useEffect(() => {
    if (pair.fromToken && pair.toToken) {
      fetchExchangeRate(pair.fromToken, pair.toToken)
    }
  }, [pair.fromToken, pair.toToken])

  const getTokenId = (symbol: string): string => {
    const tokenMap: Record<string, string> = {
      'AVAI': 'avail',
      'USDC': 'usd-coin',
      'USDT': 'tether',
      'DAI': 'dai',
      'BUSD': 'binance-usd',
      'TUSD': 'true-usd',
      'FRAX': 'frax',
      'LUSD': 'liquity-usd'
    }
    return tokenMap[symbol] || 'usd-coin'
  }

  const handleFromAmountChange = (amount: string) => {
    // Use real exchange rate with validation
    let toAmount = ""
    if (amount && currentRate > 0 && isFinite(currentRate)) {
      const calculatedAmount = parseFloat(amount) * currentRate
      toAmount = calculatedAmount.toFixed(6)
    }
    onUpdate({ fromAmount: amount, toAmount })
    
    // Only validate if amount is entered
    if (!amount || parseFloat(amount) === 0) {
      setIsValid(true) // No red border when empty or zero
      return
    }
    
    // Check if user has sufficient balance
    const userBalance = parseFloat(tokenBalances[pair.fromToken] || '0')
    const requestedAmount = parseFloat(amount)
    const hasSufficientBalance = userBalance >= requestedAmount
    
    setIsValid(hasSufficientBalance)
  }

  const handleToAmountChange = (amount: string) => {
    // Use real exchange rate with validation
    let fromAmount = ""
    if (amount && currentRate > 0 && isFinite(currentRate)) {
      const calculatedAmount = parseFloat(amount) / currentRate
      fromAmount = calculatedAmount.toFixed(6)
    }
    onUpdate({ toAmount: amount, fromAmount })
    
    // Only validate if amount is entered
    if (!amount || parseFloat(amount) === 0) {
      setIsValid(true) // No red border when empty or zero
      return
    }
    
    // Check if user has sufficient balance for the calculated fromAmount
    const userBalance = parseFloat(tokenBalances[pair.fromToken] || '0')
    const calculatedFromAmount = parseFloat(fromAmount)
    const hasSufficientBalance = userBalance >= calculatedFromAmount
    
    setIsValid(hasSufficientBalance)
  }

  const swapTokens = () => {
    setIsAnimating(true)
    setTimeout(() => {
      onUpdate({
        fromToken: pair.toToken,
        toToken: pair.fromToken,
        fromAmount: pair.toAmount,
        toAmount: pair.fromAmount
      })
      setIsAnimating(false)
    }, 300)
  }

  return (
    <div className="space-y-3 relative border border-[#290038] rounded-lg p-3">
      {canRemove && (
        <button
          onClick={onRemove}
          className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 z-10 shadow-lg hover:shadow-red-500/30 border border-red-400/50"
          title="Remove this swap pair"
        >
          <IoClose className="w-3 h-3 text-white" />
        </button>
      )}
        {/* Pay Token */}
        <div className="relative">
          <label className="block text-xs font-medium text-white/95 mb-1">
            Pay
          </label>
          <div className="flex space-x-2">
            <TokenSelector
              value={pair.fromToken}
              onChange={(token) => onUpdate({ fromToken: token })}
              className="w-32"
            />
            <div className="flex-1 relative">
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="0.0"
                  value={pair.fromAmount}
                  onChange={(e) => {
                    const value = e.target.value
                    // Only allow numbers and decimal point
                    if (value === '' || /^\d*\.?\d*$/.test(value)) {
                      handleFromAmountChange(value)
                    }
                  }}
                  className={`flex-1 bg-black border rounded-lg px-3 py-2 text-white/95 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#723680]/50 focus:border-transparent transition-all ${
                    isValid 
                      ? 'border-[#290038]' 
                      : 'border-red-500/50'
                  }`}
                />
                {hasBalance(pair.fromToken) && (
                  <button
                    onClick={() => {
                      const maxBalance = tokenBalances[pair.fromToken] || '0'
                      handleFromAmountChange(maxBalance)
                    }}
                    className="px-3 py-1 border border-[#723680] hover:border-[#8A4A9A] text-[#723680] hover:text-[#8A4A9A] text-xs rounded-lg transition-colors bg-transparent hover:bg-[#723680]/10"
                  >
                    MAX
                  </button>
                )}
              </div>
              {/* Balance display */}
              {isConnected && (
                <div className={`mt-1 text-xs ${
                  hasBalance(pair.fromToken) ? 'text-white/60' : 'text-red-400'
                }`}>
                  {(() => {
                    const balance = tokenBalances[pair.fromToken] || '0'
                    const numericBalance = parseFloat(balance)
                    console.log(`Displaying balance for ${pair.fromToken}: ${balance} (numeric: ${numericBalance})`)
                    
                    if (numericBalance > 0) {
                      return `Balance: ${numericBalance.toFixed(2)} ${pair.fromToken}`
                    } else {
                      return `No ${pair.fromToken} balance`
                    }
                  })()}
                </div>
              )}
              {pair.fromAmount && parseFloat(pair.fromAmount) > parseFloat(tokenBalances[pair.fromToken] || '0') && (
                <div className="absolute -bottom-6 left-0 flex items-center text-xs text-red-400">
                  <IoWarning className="w-3 h-3 mr-1" />
                  <span>Insufficient balance</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <button
            onClick={swapTokens}
            disabled={isAnimating}
            className={`p-1.5 bg-gradient-to-r from-[#723680] to-[#461561] hover:from-[#290038] hover:to-[#723680] rounded-lg transition-all duration-300 ${
              isAnimating ? 'animate-spin' : 'hover:scale-110'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <IoSwapVertical className={`w-3 h-3 text-white ${isAnimating ? 'animate-bounce' : ''}`} />
          </button>
        </div>

        {/* Exchange Rate Display */}
        <div className="text-center">
          <div className="text-xs text-white/60">
            {isLoadingRate ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-3 w-3 border-b border-[#723680] mr-1"></div>
                Loading rate...
              </span>
            ) : rateError ? (
              <span className="text-red-400">Rate unavailable</span>
            ) : (
              `Rate: 1 ${pair.fromToken} = ${currentRate.toFixed(4)} ${pair.toToken}`
            )}
          </div>
        </div>

        {/* Receive Token */}
        <div className="relative">
          <label className="block text-xs font-medium text-white/95 mb-1">
            Receive
          </label>
          <div className="flex space-x-2">
            <TokenSelector
              value={pair.toToken}
              onChange={(token) => onUpdate({ toToken: token })}
              className="w-32"
            />
            <input
              type="text"
              placeholder="0.0"
              value={pair.toAmount}
              onChange={(e) => {
                const value = e.target.value
                // Only allow numbers and decimal point
                if (value === '' || /^\d*\.?\d*$/.test(value)) {
                  handleToAmountChange(value)
                }
              }}
              className={`flex-1 bg-black border rounded-lg px-3 py-2 text-white/95 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#723680]/50 focus:border-transparent transition-all ${
                isValid ? 'border-[#290038]' : 'border-[#290038]/50'
              }`}
            />
          </div>
        </div>

    </div>
  )
}

export default SwapPair

