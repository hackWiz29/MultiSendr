"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { ethers } from "ethers"
import { ApiPromise, WsProvider } from "@polkadot/api"

const WalletConnectSection: React.FC = () => {
  const [ethWalletAddress, setEthWalletAddress] = useState<string | null>(null)
  const [availWalletAddress, setAvailWalletAddress] = useState<string | null>(null)
  const [isConnectingEth, setIsConnectingEth] = useState(false)
  const [isConnectingAvail, setIsConnectingAvail] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (window.ethereum) {
      checkEthWalletConnection()
      window.ethereum.on("accountsChanged", handleEthAccountsChanged)
    }
    return () => {
      if (window.ethereum) window.ethereum.removeListener("accountsChanged", handleEthAccountsChanged)
    }
  }, [])

  const handleEthAccountsChanged = (accounts: string[]) => {
    setEthWalletAddress(accounts.length > 0 ? accounts[0] : null)
  }

  const checkEthWalletConnection = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const accounts = await provider.listAccounts()
      if (accounts.length > 0) setEthWalletAddress(accounts[0].address)
    } catch (err) {
      console.error(err)
    }
  }

  const connectEthWallet = async () => {
    if (!window.ethereum) return setError("Install MetaMask")
    setIsConnectingEth(true)
    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const accounts = await provider.send("eth_requestAccounts", [])
      setEthWalletAddress(accounts[0])
    } catch (err: any) {
      setError("ETH connection failed: " + err.message)
    } finally {
      setIsConnectingEth(false)
    }
  }

  const disconnectEthWallet = () => {
    setEthWalletAddress(null)
  }

  const connectAvailWallet = async () => {
    setIsConnectingAvail(true)
    try {
      const provider = new WsProvider("wss://turing-rpc.avail.tools/ws")
      await ApiPromise.create({ provider })
      const extensions = await (window as any).injectedWeb3?.["talisman"]?.enable("Avail App")
      const injector = await extensions?.accounts.get()
      if (injector?.length > 0) setAvailWalletAddress(injector[0].address)
    } catch (err: any) {
      setError("Avail connection failed: " + err.message)
    } finally {
      setIsConnectingAvail(false)
    }
  }

  const disconnectAvailWallet = () => {
    setAvailWalletAddress(null)
  }

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const formatAddress = (address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`

  return (
    <div className="py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
        {/* ETH Wallet Card */}
        <div className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Ethereum</h3>
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-lg">⟠</span>
            </div>
          </div>

          {ethWalletAddress ? (
            <div className="flex flex-col gap-3">
              <button
                onClick={() => copyAddress(ethWalletAddress)}
                className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground px-4 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-primary/20 transition-all"
              >
                {copied ? "✓ Copied!" : formatAddress(ethWalletAddress)}
              </button>
              <button
                onClick={disconnectEthWallet}
                className="w-full bg-secondary text-secondary-foreground border border-border px-4 py-2 rounded-lg font-medium hover:bg-destructive hover:text-destructive-foreground transition-all"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={connectEthWallet}
              disabled={isConnectingEth}
              className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground px-4 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isConnectingEth ? "Connecting..." : "Connect Wallet"}
            </button>
          )}
        </div>

        {/* Avail Wallet Card */}
        {/* Uncomment if needed */}
        {/* <div className="bg-card border border-border rounded-xl p-6 hover:border-accent/50 transition-all">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Avail</h3>
            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
              <span className="text-lg">◆</span>
            </div>
          </div>

          {availWalletAddress ? (
            <div className="flex flex-col gap-3">
              <button
                onClick={() => copyAddress(availWalletAddress)}
                className="w-full bg-gradient-to-r from-accent to-primary text-accent-foreground px-4 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-accent/20 transition-all"
              >
                {copied ? "✓ Copied!" : formatAddress(availWalletAddress)}
              </button>
              <button
                onClick={disconnectAvailWallet}
                className="w-full bg-secondary text-secondary-foreground border border-border px-4 py-2 rounded-lg font-medium hover:bg-destructive hover:text-destructive-foreground transition-all"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={connectAvailWallet}
              disabled={isConnectingAvail}
              className="w-full bg-gradient-to-r from-accent to-primary text-accent-foreground px-4 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-accent/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isConnectingAvail ? "Connecting..." : "Connect Wallet"}
            </button>
          )}
        </div> */}
      </div>

      {error && (
        <div className="mt-6 max-w-2xl mx-auto bg-destructive/10 border border-destructive/30 rounded-lg p-4 text-destructive text-sm">
          {error}
        </div>
      )}
    </div>
  )
}

export default WalletConnectSection
