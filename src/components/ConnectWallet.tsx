"use client"

import type React from "react"
import SwapSection from "./SwapSection"
import BatchSection from "./BatchSection"
import WalletConnectSection from "./WalletConnectSection"

const ConnectWallet: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
      {/* Header Section */}
      <div className="relative overflow-hidden px-4 py-16 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Avail Batch & Cross-Chain Swaps
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Seamlessly swap stablecoins across chains and execute batch transactions on Avail
          </p>
        </div>
      </div>

      {/* Wallet Connection */}
      <div className="px-4 sm:px-6 lg:px-8">
        <WalletConnectSection />
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <SwapSection />
        <BatchSection />
      </div>

      {/* Footer */}
      <div className="border-t border-border mt-16 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center text-sm text-muted-foreground">
          <p>Powered by Avail • Secure • Fast • Decentralized</p>
        </div>
      </div>
    </div>
  )
}

export default ConnectWallet
