"use client"

import React, { useState } from "react"
import Button from "./ui/Button"
import { IoCash } from "react-icons/io5"
import { useWallet } from "../contexts/WalletContext"

const TestnetFaucet: React.FC = () => {
  const { isConnected, address } = useWallet()
  const [isRedirecting, setIsRedirecting] = useState(false)

  const openFaucet = () => {
    if (!isConnected || !address) return

    setIsRedirecting(true)
    
    // Open the official Avail faucet in a new tab
    const faucetUrl = `https://faucet.avail.tools/`
    window.open(faucetUrl, '_blank', 'noopener,noreferrer')
    
    // Reset loading state after a short delay
    setTimeout(() => {
      setIsRedirecting(false)
    }, 1000)
  }

  // Always show the faucet component

  return (
    <div className="bg-black border-2 border-[#290038] rounded-xl p-6 shadow-2xl backdrop-blur-sm">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
        <IoCash className="w-5 h-5 mr-2 text-[#723680]" />
        Avail Testnet Faucet
      </h3>
      
      <div className="space-y-4">
        <div className="bg-gradient-to-r from-[#461561]/30 to-[#723680]/30 border-2 border-[#461561] rounded-lg p-4">
          <h4 className="font-medium text-white mb-2">Get Test Tokens</h4>
          <p className="text-sm text-white/80 mb-4">
            Get test AVAIL tokens from the official Avail faucet to try batch swaps.
          </p>
          
          <div className="w-full">
            <Button
              onClick={openFaucet}
              disabled={!isConnected || isRedirecting}
              className={`w-full bg-gradient-to-r from-[#723680] to-[#461561] hover:from-[#290038] hover:to-[#723680] transition-all duration-300 ${
                !isConnected || isRedirecting ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
              }`}
            >
              {isRedirecting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Opening Faucet...
                </>
              ) : !isConnected ? (
                <>
                  Connect Wallet to get test tokens
                </>
              ) : (
                <>
                  Open Official Faucet
                </>
              )}
            </Button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default TestnetFaucet
