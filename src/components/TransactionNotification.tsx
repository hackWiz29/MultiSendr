"use client"

import React, { useState, useEffect } from 'react'
import { IoCheckmarkCircle, IoClose } from 'react-icons/io5'

interface TransactionNotificationProps {
  show: boolean
  message: string
  type: 'success' | 'error'
  onClose: () => void
  duration?: number
}

const TransactionNotification: React.FC<TransactionNotificationProps> = ({
  show,
  message,
  type,
  onClose,
  duration = 5000
}) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (show) {
      setIsVisible(true)
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(onClose, 300) // Wait for animation to complete
      }, duration)

      return () => clearTimeout(timer)
    } else {
      setIsVisible(false)
    }
  }, [show, duration, onClose])

  if (!show && !isVisible) return null

  return (
    <div className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
      isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    }`}>
      <div className={`flex items-center space-x-3 px-6 py-4 rounded-lg shadow-lg border backdrop-blur-sm ${
        type === 'success' 
          ? 'bg-green-900/20 border-green-500/50 text-green-400' 
          : 'bg-red-900/20 border-red-500/50 text-red-400'
      }`}>
        {type === 'success' ? (
          <IoCheckmarkCircle className="w-6 h-6 text-green-400" />
        ) : (
          <IoCheckmarkCircle className="w-6 h-6 text-red-400" />
        )}
        
        <div className="flex-1">
          <p className="font-medium">{message}</p>
        </div>
        
        <button
          onClick={() => {
            setIsVisible(false)
            setTimeout(onClose, 300)
          }}
          className="ml-2 p-1 hover:bg-white/10 rounded transition-colors"
        >
          <IoClose className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export default TransactionNotification
