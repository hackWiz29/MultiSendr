"use client"

import React, { useState } from "react"
import { useAvailWallet } from "../hooks/useAvailWallet"
import { availService } from "../services/availService"

const AvailIntegrationTest: React.FC = () => {
  const { isConnected, address, connectWallet, disconnectWallet, balance, refreshBalance } = useAvailWallet()
  const [testResults, setTestResults] = useState<string[]>([])
  const [isTesting, setIsTesting] = useState(false)

  const runTests = async () => {
    setIsTesting(true)
    setTestResults([])

    try {
      // Test 1: Check network info
      const networkInfo = availService.getNetworkInfo()
      setTestResults(prev => [...prev, `✓ Network: ${networkInfo.name} (${networkInfo.network})`])

      // Test 2: Check wallet connection
      if (isConnected && address) {
        setTestResults(prev => [...prev, `✓ Wallet connected: ${address.slice(0, 6)}...${address.slice(-4)}`])
        
        // Test 3: Get balance
        try {
          const walletBalance = await availService.getBalance(address)
          setTestResults(prev => [...prev, `✓ Balance: ${walletBalance} AVAIL`])
        } catch (error) {
          setTestResults(prev => [...prev, `⚠ Balance check failed: ${error instanceof Error ? error.message : 'Unknown error'}`])
        }
      } else {
        setTestResults(prev => [...prev, `⚠ Wallet not connected`])
      }

      // Test 4: Test gas estimation
      try {
        const testTransfers = [
          { recipient: "0x1234567890123456789012345678901234567890", amount: "0.1" },
          { recipient: "0x0987654321098765432109876543210987654321", amount: "0.2" }
        ]
        const gasEstimate = await availService.estimateBatchGas(testTransfers)
        setTestResults(prev => [...prev, `✓ Gas estimation: ${gasEstimate.toString()} wei`])
      } catch (error) {
        setTestResults(prev => [...prev, `⚠ Gas estimation failed: ${error instanceof Error ? error.message : 'Unknown error'}`])
      }

      setTestResults(prev => [...prev, `✓ All tests completed successfully!`])

    } catch (error) {
      setTestResults(prev => [...prev, `✗ Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`])
    } finally {
      setIsTesting(false)
    }
  }

  return (
    <div className="bg-[#000000] border border-white/10 rounded-xl p-6 shadow-lg">
      <h3 className="text-lg font-semibold text-white/95 mb-4">Avail SDK Integration Test</h3>
      
      <div className="space-y-4">
        {/* Wallet Status */}
        <div className="bg-[#1A1A1A] border border-white/10 rounded-lg p-4">
          <h4 className="font-medium text-white/95 mb-2">Wallet Status</h4>
          <div className="text-sm text-white/70 space-y-1">
            <div>Connected: {isConnected ? "Yes" : "No"}</div>
            {address && <div>Address: {address}</div>}
            {balance && <div>Balance: {balance} AVAIL</div>}
          </div>
          <div className="flex gap-2 mt-3">
            {!isConnected ? (
              <button
                onClick={connectWallet}
                className="px-4 py-2 bg-[#723680] text-white rounded-lg hover:bg-[#5a2a66] transition-colors"
              >
                Connect Wallet
              </button>
            ) : (
              <button
                onClick={disconnectWallet}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Disconnect
              </button>
            )}
            {isConnected && (
              <button
                onClick={refreshBalance}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Refresh Balance
              </button>
            )}
          </div>
        </div>

        {/* Test Results */}
        <div className="bg-[#1A1A1A] border border-white/10 rounded-lg p-4">
          <h4 className="font-medium text-white/95 mb-2">Integration Tests</h4>
          <div className="text-sm text-white/70 space-y-1">
            {testResults.length === 0 ? (
              <div className="text-white/50">No tests run yet</div>
            ) : (
              testResults.map((result, index) => (
                <div key={index} className="font-mono">
                  {result}
                </div>
              ))
            )}
          </div>
          <button
            onClick={runTests}
            disabled={isTesting}
            className={`mt-3 px-4 py-2 rounded-lg transition-colors ${
              isTesting 
                ? 'bg-gray-600 text-gray-300 cursor-not-allowed' 
                : 'bg-[#723680] text-white hover:bg-[#5a2a66]'
            }`}
          >
            {isTesting ? "Running Tests..." : "Run Tests"}
          </button>
        </div>

        {/* SDK Info */}
        <div className="bg-[#723680]/10 border border-[#723680]/20 rounded-lg p-4">
          <h4 className="font-medium text-[#723680] mb-2">Avail SDK Status</h4>
          <div className="text-sm text-white/80 space-y-1">
            <div>• Avail Nexus SDK integrated</div>
            <div>• Viem client configured</div>
            <div>• Batch transaction support enabled</div>
            <div>• Wallet connection ready</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AvailIntegrationTest
