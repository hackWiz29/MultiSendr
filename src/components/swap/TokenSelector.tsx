"use client"

import React, { useState } from "react"
import { IoChevronDown, IoCheckmark } from "react-icons/io5"

interface TokenSelectorProps {
  value: string
  onChange: (token: string) => void
  className?: string
}

const STABLECOINS = [
  { symbol: "USDC", name: "USD Coin", icon: "💵" },
  { symbol: "USDT", name: "Tether USD", icon: "🪙" },
  { symbol: "DAI", name: "Dai Stablecoin", icon: "🔷" },
  { symbol: "BUSD", name: "Binance USD", icon: "🟡" },
  { symbol: "TUSD", name: "TrueUSD", icon: "🔵" },
  { symbol: "FRAX", name: "Frax", icon: "⚡" },
  { symbol: "LUSD", name: "Liquity USD", icon: "🔒" },
  { symbol: "SUSD", name: "Synthetix USD", icon: "📊" }
]

const TokenSelector: React.FC<TokenSelectorProps> = ({ value, onChange, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false)

  const selectedToken = STABLECOINS.find(token => token.symbol === value) || STABLECOINS[0]

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-input border border-border rounded-lg px-4 py-3 text-foreground hover:bg-accent transition-colors"
      >
        <div className="flex items-center space-x-2">
          <span className="text-lg">{selectedToken.icon}</span>
          <span className="font-medium">{selectedToken.symbol}</span>
        </div>
        <IoChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto">
            {STABLECOINS.map((token) => (
              <button
                key={token.symbol}
                onClick={() => {
                  onChange(token.symbol)
                  setIsOpen(false)
                }}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-accent transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{token.icon}</span>
                  <div className="text-left">
                    <div className="font-medium text-foreground">{token.symbol}</div>
                    <div className="text-sm text-muted-foreground">{token.name}</div>
                  </div>
                </div>
                {value === token.symbol && (
                  <IoCheckmark className="w-4 h-4 text-primary" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default TokenSelector

