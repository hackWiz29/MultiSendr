"use client"

import React, { useState, useEffect } from "react"
import { IoCheckmarkCircle, IoRocket, IoFlash } from "react-icons/io5"

interface SuccessAnimationProps {
  isVisible: boolean
  onComplete?: () => void
}

const SuccessAnimation: React.FC<SuccessAnimationProps> = ({ isVisible, onComplete }) => {
  const [stage, setStage] = useState(0)

  useEffect(() => {
    if (isVisible) {
      const timer1 = setTimeout(() => setStage(1), 300)
      const timer2 = setTimeout(() => setStage(2), 600)
      const timer3 = setTimeout(() => {
        setStage(3)
        onComplete?.()
      }, 1200)

      return () => {
        clearTimeout(timer1)
        clearTimeout(timer2)
        clearTimeout(timer3)
      }
    } else {
      setStage(0)
    }
  }, [isVisible, onComplete])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#000000] border border-[#723680]/50 rounded-2xl p-8 max-w-md mx-4 text-center">
        <div className="relative mb-6">
          {/* Animated Icons */}
          <div className="flex justify-center items-center h-24">
            {stage >= 1 && (
              <div className="absolute animate-bounce">
                <IoFlash className="w-12 h-12 text-[#723680]" />
              </div>
            )}
            {stage >= 2 && (
              <div className="absolute animate-pulse">
                <IoRocket className="w-12 h-12 text-[#461561]" />
              </div>
            )}
            {stage >= 3 && (
              <div className="absolute animate-ping">
                <IoCheckmarkCircle className="w-12 h-12 text-green-500" />
              </div>
            )}
          </div>
        </div>

        <h3 className="text-2xl font-bold text-white/95 mb-2">
          {stage === 1 && "Processing..."}
          {stage === 2 && "Executing..."}
          {stage === 3 && "Success!"}
        </h3>

        <p className="text-white/70 mb-6">
          {stage === 1 && "Your batch transaction is being processed"}
          {stage === 2 && "Multiple swaps are being executed"}
          {stage === 3 && "All swaps completed successfully!"}
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-white/10 rounded-full h-2 mb-4">
          <div 
            className="bg-gradient-to-r from-[#723680] to-[#461561] h-2 rounded-full transition-all duration-500"
            style={{ width: `${(stage / 3) * 100}%` }}
          />
        </div>

        {stage >= 3 && (
          <div className="text-sm text-white/60">
            Transaction confirmed on Avail network
          </div>
        )}
      </div>
    </div>
  )
}

export default SuccessAnimation
