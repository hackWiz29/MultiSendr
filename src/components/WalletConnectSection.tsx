"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useWallet } from "../contexts/WalletContext"

const WalletConnectSection: React.FC = () => {
  const { 
    isConnected, 
    address, 
    balance, 
    isLoading, 
    error, 
    connectWallet, 
    disconnectWallet,
    refreshBalance
  } = useWallet()
  
  const [copied, setCopied] = useState(false)

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const formatAddress = (address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`

  return (
    <div className="py-8">
      <div className="max-w-md mx-auto">
        {/* Avail Substrate Wallet Card */}
        <div className="bg-card border border-border rounded-xl p-6 hover:border-accent/50 transition-all">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Avail Network</h3>
            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
              <span className="text-lg">◆</span>
            </div>
          </div>

          {isConnected && address ? (
            <div className="space-y-4">
              {/* Connection Status */}
              <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-400 font-medium">Connected to Avail</span>
              </div>
              
              {/* Address */}
              <div className="bg-muted/50 rounded-lg p-3">
                <div className="text-xs text-muted-foreground mb-1">Wallet Address</div>
                <button
                  onClick={() => copyAddress(address)}
                  className="text-sm font-mono text-left w-full hover:text-primary transition-colors"
                >
                  {copied ? "✓ Copied!" : formatAddress(address)}
                </button>
              </div>
              
              {/* Balance */}
              {balance && (
                <div className="bg-muted/50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-xs text-muted-foreground">Available Balance</div>
                    <button
                      onClick={refreshBalance}
                      className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      Refresh
                    </button>
                  </div>
                  <div className="text-lg font-semibold text-primary">{balance}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Native AVAIL tokens
                  </div>
                </div>
              )}
              
              {/* Network Info */}
              <div className="bg-muted/50 rounded-lg p-3">
                <div className="text-xs text-muted-foreground mb-1">Network</div>
                <div className="text-sm font-medium">Avail Turing Testnet</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Substrate-based blockchain
                </div>
              </div>
              
              <button
                onClick={disconnectWallet}
                className="w-full bg-secondary text-secondary-foreground border border-border px-4 py-2 rounded-lg font-medium hover:bg-destructive hover:text-destructive-foreground transition-all"
              >
                Disconnect Wallet
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <button
                onClick={connectWallet}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-accent to-primary text-accent-foreground px-4 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-accent/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Connecting..." : "Connect Substrate Wallet"}
              </button>
              
              <div className="text-xs text-muted-foreground text-center">
                Requires: Talisman, SubWallet, or Polkadot.js extension
              </div>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-6 max-w-md mx-auto bg-destructive/10 border border-destructive/30 rounded-lg p-4 text-destructive text-sm">
          {error}
        </div>
      )}
    </div>
  )
}

export default WalletConnectSection
