"use client"

import type React from "react"
import { useState } from "react"
import { useAvailWallet } from "../hooks/useAvailWallet"
import { availService, BatchTransfer } from "../services/availService"

const BatchSection: React.FC = () => {
  const { isConnected, address, connectWallet } = useAvailWallet()
  const [batchTransfers, setBatchTransfers] = useState([{ recipient: "", amount: "" }])
  const [isExecuting, setIsExecuting] = useState(false)
  const [txHash, setTxHash] = useState<string | null>(null)

  const addBatchTransfer = () => {
    setBatchTransfers([...batchTransfers, { recipient: "", amount: "" }])
  }

  const removeBatchTransfer = (index: number) => {
    setBatchTransfers(batchTransfers.filter((_, i) => i !== index))
  }

  const executeBatch = async () => {
    if (!isConnected) {
      await connectWallet()
      return
    }

    setIsExecuting(true)
    setTxHash(null)

    try {
      // Filter valid transfers
      const validTransfers = batchTransfers.filter(
        transfer => transfer.recipient && transfer.amount && parseFloat(transfer.amount) > 0
      )

      if (validTransfers.length === 0) {
        throw new Error('No valid transfers to execute')
      }

      // Convert to BatchTransfer format
      const batchTransferData: BatchTransfer[] = validTransfers.map(transfer => ({
        recipient: transfer.recipient,
        amount: transfer.amount
      }))

      console.log("Executing batch transfers with Avail SDK:", batchTransferData)
      
      // Execute batch transfers using Avail SDK
      const hash = await availService.executeBatchTransfers(batchTransferData)
      setTxHash(hash)
      
      console.log("Batch transfers executed successfully:", hash)
    } catch (error) {
      console.error("Batch transfer failed:", error)
      alert(`Batch transfer failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsExecuting(false)
    }
  }

  return (
    <section className="bg-card border border-border rounded-xl p-8 shadow-lg hover:border-accent/30 transition-all">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Batch Transactions</h2>
        <p className="text-sm text-muted-foreground">Execute multiple transfers on Avail in one transaction</p>
      </div>

      <div className="space-y-4">
        {batchTransfers.map((transfer, index) => (
          <div key={index} className="flex gap-3 items-end">
            <div className="flex-1">
              <label className="block text-xs font-medium text-muted-foreground mb-1">Recipient Address</label>
              <input
                type="text"
                placeholder="0x..."
                value={transfer.recipient}
                onChange={(e) => {
                  const newTransfers = [...batchTransfers]
                  newTransfers[index].recipient = e.target.value
                  setBatchTransfers(newTransfers)
                }}
                className="w-full bg-input border border-border rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all text-sm"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-muted-foreground mb-1">Amount (AVAIL)</label>
              <input
                type="number"
                placeholder="0.00"
                value={transfer.amount}
                onChange={(e) => {
                  const newTransfers = [...batchTransfers]
                  newTransfers[index].amount = e.target.value
                  setBatchTransfers(newTransfers)
                }}
                className="w-full bg-input border border-border rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all text-sm"
              />
            </div>
            {batchTransfers.length > 1 && (
              <button
                onClick={() => removeBatchTransfer(index)}
                className="px-3 py-2 text-destructive hover:bg-destructive/10 rounded-lg transition-all"
              >
                ✕
              </button>
            )}
          </div>
        ))}

        {/* Wallet Status */}
        {address && (
          <div className="bg-[#1A1A1A] border border-white/10 rounded-lg p-4 mb-4">
            <h4 className="font-medium text-white/95 mb-2">Wallet Connected</h4>
            <div className="text-sm text-white/70">
              <div>Address: {address.slice(0, 6)}...{address.slice(-4)}</div>
            </div>
          </div>
        )}

        {/* Transaction Status */}
        {txHash && (
          <div className="bg-[#723680]/10 border border-[#723680]/20 rounded-lg p-4 mb-4">
            <h4 className="font-medium text-[#723680] mb-2">Transaction Submitted</h4>
            <div className="text-sm text-white/80">
              <div>Hash: {txHash.slice(0, 10)}...{txHash.slice(-8)}</div>
              <div className="text-[#723680] mt-1">✓ Transaction submitted to Avail network</div>
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <button
            onClick={addBatchTransfer}
            className="flex-1 bg-secondary/20 border border-secondary text-secondary-foreground rounded-lg py-2 font-medium hover:bg-secondary/30 transition-all"
          >
            + Add Transfer
          </button>
          <button
            onClick={executeBatch}
            disabled={!isConnected || isExecuting}
            className={`flex-1 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-lg py-2 font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all active:scale-95 ${!isConnected || isExecuting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isExecuting 
              ? "Executing Batch..." 
              : !isConnected 
              ? "Connect Wallet" 
              : "Execute Batch"
            }
          </button>
        </div>
      </div>
    </section>
  )
}

export default BatchSection
