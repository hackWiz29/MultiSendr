import { useState, useEffect } from 'react'
import { availService } from '../services/availService'

export interface TransactionStatus {
  hash: string
  status: 'pending' | 'confirmed' | 'failed'
  confirmations: number
  blockNumber?: number
  gasUsed?: string
  error?: string
}

export const useTransactionStatus = (txHash: string | null) => {
  const [status, setStatus] = useState<TransactionStatus | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!txHash) {
      setStatus(null)
      return
    }

    const checkStatus = async () => {
      setIsLoading(true)
      try {
        const txStatus = await availService.getTransactionStatus(txHash)
        setStatus({
          hash: txHash,
          status: txStatus,
          confirmations: txStatus === 'confirmed' ? 1 : 0
        })
      } catch (error) {
        setStatus({
          hash: txHash,
          status: 'failed',
          confirmations: 0,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      } finally {
        setIsLoading(false)
      }
    }

    checkStatus()

    // Poll for status updates every 3 seconds
    const interval = setInterval(checkStatus, 3000)

    return () => clearInterval(interval)
  }, [txHash])

  return { status, isLoading }
}
