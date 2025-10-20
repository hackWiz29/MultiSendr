"use client"

import type React from "react"
import { useState } from "react"

const BatchSection: React.FC = () => {
  const [batchTransfers, setBatchTransfers] = useState([{ recipient: "", amount: "" }])

  const addBatchTransfer = () => {
    setBatchTransfers([...batchTransfers, { recipient: "", amount: "" }])
  }

  const removeBatchTransfer = (index: number) => {
    setBatchTransfers(batchTransfers.filter((_, i) => i !== index))
  }

  const executeBatch = async () => {
    console.log("Batch transfers:", batchTransfers)
    alert("Batch executed (simulation)")
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

        <div className="flex gap-3 pt-4">
          <button
            onClick={addBatchTransfer}
            className="flex-1 bg-secondary/20 border border-secondary text-secondary-foreground rounded-lg py-2 font-medium hover:bg-secondary/30 transition-all"
          >
            + Add Transfer
          </button>
          <button
            onClick={executeBatch}
            className="flex-1 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-lg py-2 font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all active:scale-95"
          >
            Execute Batch
          </button>
        </div>
      </div>
    </section>
  )
}

export default BatchSection
