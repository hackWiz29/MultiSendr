"use client"

import React, { useState, useEffect } from "react"
import { IoChevronDown, IoCheckmark, IoWallet } from "react-icons/io5"
import { useWallet } from "../../contexts/WalletContext"

interface TokenSelectorProps {
  value: string
  onChange: (token: string) => void
  className?: string
}

const STABLECOINS = [
  { 
    symbol: "AVAI", 
    name: "Avail Token", 
    icon: "https://cryptologos.cc/logos/avail-avail-logo.png",
    address: "0x0000000000000000000000000000000000000000",
    decimals: 18,
    coingeckoId: "avail"
  },
  { 
    symbol: "USDC", 
    name: "USD Coin", 
    icon: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png",
    address: "0xA0b86a33E6441b8C4C8C0C4C8C0C4C8C0C4C8C0C",
    decimals: 6,
    coingeckoId: "usd-coin"
  },
  { 
    symbol: "USDT", 
    name: "Tether USD", 
    icon: "https://cryptologos.cc/logos/tether-usdt-logo.png",
    address: "0xB0b86a33E6441b8C4C8C0C4C8C0C4C8C0C4C8C0C",
    decimals: 6,
    coingeckoId: "tether"
  },
  { 
    symbol: "DAI", 
    name: "Dai Stablecoin", 
    icon: "https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png",
    address: "0xC0b86a33E6441b8C4C8C0C4C8C0C4C8C0C4C8C0C",
    decimals: 18,
    coingeckoId: "dai"
  },
  { 
    symbol: "BUSD", 
    name: "Binance USD", 
    icon: "https://cryptologos.cc/logos/binance-usd-busd-logo.png",
    address: "0xD0b86a33E6441b8C4C8C0C4C8C0C4C8C0C4C8C0C",
    decimals: 18,
    coingeckoId: "binance-usd"
  },
  { 
    symbol: "TUSD", 
    name: "TrueUSD", 
    icon: "https://cryptologos.cc/logos/trueusd-tusd-logo.png",
    address: "0xE0b86a33E6441b8C4C8C0C4C8C0C4C8C0C4C8C0C",
    decimals: 18,
    coingeckoId: "true-usd"
  },
  { 
    symbol: "FRAX", 
    name: "Frax", 
    icon: "https://cryptologos.cc/logos/frax-frax-logo.png",
    address: "0xF0b86a33E6441b8C4C8C0C4C8C0C4C8C0C4C8C0C",
    decimals: 18,
    coingeckoId: "frax"
  },
  { 
    symbol: "LUSD", 
    name: "Liquity USD", 
    icon: "https://cryptologos.cc/logos/liquity-usd-lusd-logo.png",
    address: "0x10b86a33E6441b8C4C8C0C4C8C0C4C8C0C4C8C0C",
    decimals: 18,
    coingeckoId: "liquity-usd"
  }
]

const TokenSelector: React.FC<TokenSelectorProps> = ({ value, onChange, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [tokenBalances, setTokenBalances] = useState<Record<string, string>>({})
  const { isConnected, address } = useWallet()

  const selectedToken = STABLECOINS.find(token => token.symbol === value) || STABLECOINS[0]

  // Helper function to check if token has balance
  const hasBalance = (tokenSymbol: string): boolean => {
    const balance = parseFloat(tokenBalances[tokenSymbol] || '0')
    return balance > 0
  }

  // Fetch real token balances from blockchain
  useEffect(() => {
    const fetchTokenData = async () => {
      if (isConnected && address) {
        try {
          // Fetch token balances from blockchain
          const balances: Record<string, string> = {}
          
          for (const token of STABLECOINS) {
            try {
              const response = await fetch(`/api/token-balance?address=${address}&token=${token.symbol}`)
              if (response.ok) {
                const data = await response.json()
                balances[token.symbol] = data.balance || '0.0'
              } else {
                // No balance available
                balances[token.symbol] = '0.0'
              }
            } catch (error) {
              console.warn(`Failed to fetch balance for ${token.symbol}:`, error)
              balances[token.symbol] = '0.0'
            }
          }
          
          setTokenBalances(balances)
        } catch (error) {
          console.error('Failed to fetch token balances:', error)
          // Set all balances to 0 if there's an error
          const zeroBalances: Record<string, string> = {}
          STABLECOINS.forEach(token => {
            zeroBalances[token.symbol] = '0.0'
          })
          setTokenBalances(zeroBalances)
        }
      } else {
        // Not connected, set all balances to 0
        const zeroBalances: Record<string, string> = {}
        STABLECOINS.forEach(token => {
          zeroBalances[token.symbol] = '0.0'
        })
        setTokenBalances(zeroBalances)
      }
    }

    fetchTokenData()
  }, [isConnected, address])

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-black border border-[#290038]/50 rounded-lg px-3 py-2 text-white/95 hover:bg-[#290038]/10 hover:border-[#290038] transition-all duration-200"
      >
        <div className="flex items-center space-x-2">
          <img 
            src={selectedToken.icon} 
            alt={selectedToken.symbol}
            className="w-5 h-5 rounded-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
              e.currentTarget.nextElementSibling?.classList.remove('hidden')
            }}
          />
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#723680] to-[#461561] flex items-center justify-center hidden">
            <span className="text-xs font-bold text-white">{selectedToken.symbol.charAt(0)}</span>
          </div>
          <div>
            <div className="font-medium text-white/95 text-sm">{selectedToken.symbol}</div>
          </div>
        </div>
        <IoChevronDown className={`w-3 h-3 text-white/70 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 right-0 mt-1 bg-black border border-[#290038] rounded-lg shadow-2xl z-20 max-h-60 overflow-y-auto min-w-[280px] scrollbar-thin scrollbar-track-black scrollbar-thumb-[#723680] hover:scrollbar-thumb-[#8A4A9A] backdrop-blur-sm">
            {STABLECOINS.map((token) => (
              <button
                key={token.symbol}
                onClick={() => {
                  onChange(token.symbol)
                  setIsOpen(false)
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-[#290038]/20 hover:border-l-2 hover:border-l-[#723680] transition-all duration-200 min-w-0"
              >
                <div className="flex items-center space-x-2 min-w-0 flex-1">
                  <img 
                    src={token.icon} 
                    alt={token.symbol}
                    className="w-5 h-5 rounded-full object-cover flex-shrink-0"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                      e.currentTarget.nextElementSibling?.classList.remove('hidden')
                    }}
                  />
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#723680] to-[#461561] flex items-center justify-center hidden flex-shrink-0">
                    <span className="text-xs font-bold text-white">{token.symbol.charAt(0)}</span>
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <div className="font-medium text-white/95 truncate text-sm">{token.symbol}</div>
                    <div className="text-xs text-white/70 truncate">{token.name}</div>
                  </div>
                </div>
                {value === token.symbol && (
                  <IoCheckmark className="w-3 h-3 text-[#723680] flex-shrink-0 ml-2" />
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

