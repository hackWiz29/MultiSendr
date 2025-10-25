"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import Button from "./ui/Button"
import { IoArrowForward } from "react-icons/io5"

const SwapSection: React.FC = () => {
  const [swapFromAmount, setSwapFromAmount] = useState("")
  const [swapToChain, setSwapToChain] = useState("arbitrum")

  const executeSwap = async () => {
    alert(`Swapping ${swapFromAmount} USDC to ${swapToChain}`)
  }

  return (
    <section className="bg-card border border-border rounded-xl p-8 shadow-lg hover:border-primary/30 transition-all">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Cross-Chain Token Swap</h2>
        <p className="text-sm text-muted-foreground">Swap USDC across multiple blockchain networks</p>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Amount to Swap</label>
          <input
            type="number"
            placeholder="Enter amount (e.g., 100 USDC)"
            value={swapFromAmount}
            onChange={(e) => setSwapFromAmount(e.target.value)}
            className="w-full bg-input border border-border rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Destination Chain</label>
          <select
            value={swapToChain}
            onChange={(e) => setSwapToChain(e.target.value)}
            className="w-full bg-input border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all appearance-none cursor-pointer"
          >
            <option value="arbitrum">Arbitrum (USDT)</option>
            <option value="polygon">Polygon (USDC)</option>
            <option value="optimism">Optimism (USDC)</option>
          </select>
        </div>

        <Link href="/swap" className="w-full">
          <Button className="w-full flex items-center justify-center space-x-2">
            <span>Go to Batch Swap</span>
            <IoArrowForward className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </section>
  )
}

export default SwapSection
