"use client";

import React, { useState, useEffect, useRef } from "react";
import Button from "../ui/Button";
import Image from "next/image";
import logo from "../../assets/logo.svg";
import Link from "next/link";
import { useWallet } from "../../contexts/WalletContext";
import {
  IoCopy,
  IoCheckmark,
  IoWallet,
  IoRefresh,
  IoClose,
  IoChevronDown,
} from "react-icons/io5";

const HeaderSection: React.FC = () => {
  const {
    isConnected,
    address,
    balance,
    isLoading,
    error,
    connectWallet,
    disconnectWallet,
    refreshBalance,
  } = useWallet();
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const formatAddress = (address: string) =>
    `${address.slice(0, 6)}...${address.slice(-4)}`;

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if click is outside modal and not on the button
      const target = event.target as Node;
      const isModal = modalRef.current && modalRef.current.contains(target);
      const isButton = (target as Element)?.closest('button');
      
      if (!isModal && !isButton && showWalletModal) {
        console.log('Clicking outside, closing modal');
        setShowWalletModal(false);
      }
    };

    if (showWalletModal) {
      // Add a small delay to prevent immediate closing
      setTimeout(() => {
        document.addEventListener("mousedown", handleClickOutside);
      }, 100);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showWalletModal]);

  // Debug modal state changes
  useEffect(() => {
    console.log('Modal state changed to:', showWalletModal);
  }, [showWalletModal]);

  return (
    <>
      {/* Row 1: 3 columns - 100px height */}
      <div className="grid grid-cols-3 gap-0 rounded-2xl h-[100px] relative">
        {/* Logo Section */}
        <div className="bg-[#000000] flex items-center justify-start border-r border-white/10">
          <Link href="/" className="h-[50px] w-max ml-[40px]">
            <Image
              src={logo}
              alt="logo"
              width={80}
              height={80}
              className="h-full w-auto"
            />
          </Link>
        </div>

        {/* Network Info Section */}
        <div className="bg-[#000000] flex items-center justify-center border-r border-white/10"></div>

        {/* Wallet Section */}
        <div className="bg-[#000000] flex items-center justify-center p-3">
          {isConnected && address ? (
            <div className="w-full">
              {/* Wallet Address Button */}
              <Button
                onClick={() => {
                  console.log('Button clicked, current modal state:', showWalletModal);
                  
                  // Use functional update to ensure we get the latest state
                  setShowWalletModal(prevState => {
                    const newState = !prevState;
                    console.log('Modal state toggled from', prevState, 'to', newState);
                    return newState;
                  });
                }}
                className="w-full flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="text-sm font-mono">
                    {formatAddress(address)}
                  </div>
                  {balance && (
                    <div className="text-xs text-white/80">{balance}</div>
                  )}
                </div>
                <IoChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    showWalletModal ? "rotate-180" : ""
                  }`}
                />
              </Button>
            </div>
          ) : (
            <div className="w-full">
              <Button
                onClick={connectWallet}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? "Connecting..." : "Connect Wallet"}
              </Button>
              {error && (
                <div className="mt-1 text-xs text-red-400 text-center">
                  {error}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Wallet Details Modal */}
        {showWalletModal && isConnected && address && (
          <div
            ref={modalRef}
            className="absolute top-[90%] right-10 mt-0 w-[360px] bg-black shadow-2xl z-9999 p-5 backdrop-blur-sm border-2 border-[#290038] rounded-lg"
          >
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[#290038]/50 pb-3">
                <div className="flex items-center gap-2">
                  <IoWallet className="w-5 h-5 text-[#723680]" />
                  <h3 className="text-lg font-semibold text-white">
                    Wallet Details
                  </h3>
                </div>
                <button
                  onClick={() => setShowWalletModal(false)}
                  className="p-1 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded transition-all"
                >
                  <IoClose className="w-5 h-5" />
                </button>
              </div>

              {/* Connection Status */}
              <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-[#461561]/30 to-[#723680]/30 border border-[#461561]/50 rounded-lg">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                <span className="text-sm text-white font-medium">
                  Connected to Avail Network
                </span>
              </div>

              {/* Address */}
              <div className="bg-gradient-to-r from-[#461561]/30 to-[#723680]/30 border border-[#461561]/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <IoWallet className="w-4 h-4 text-white" />
                  <div className="text-xs text-white font-medium">
                    Wallet Address
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm font-mono text-white break-all bg-black/20 rounded px-2 py-1">
                    {address}
                  </div>
                  <button
                    onClick={() => copyAddress(address)}
                    className="p-2 text-white hover:text-white hover:bg-white/10 rounded-lg transition-all ml-2 flex-shrink-0"
                    title="Copy address"
                  >
                    {copied ? (
                      <IoCheckmark className="w-4 h-4" />
                    ) : (
                      <IoCopy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Balance */}
              {balance && (
                <div className="bg-gradient-to-r from-[#461561]/30 to-[#723680]/30 border border-[#461561]/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-gradient-to-r from-[#723680] to-[#461561] rounded-full"></div>
                      <div className="text-xs text-white font-medium">
                        Available Balance
                      </div>
                    </div>
                    <button
                      onClick={refreshBalance}
                      className="p-1 text-white hover:text-white hover:bg-white/10 rounded transition-all"
                      title="Refresh balance"
                    >
                      <IoRefresh className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">
                    {balance}
                  </div>
                  <div className="text-xs text-gray-400">
                    Native AVAIL tokens
                  </div>
                </div>
              )}

              {/* Network Info */}
              <div className="bg-gradient-to-r from-[#461561]/30 to-[#723680]/30 border border-[#461561]/50 rounded-lg p-4">
                <div className="text-xs text-gray-400 mb-2">
                  Network Information
                </div>
                <div className="text-sm font-semibold text-white mb-1">
                  Avail Turing Testnet
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <Button
                  onClick={disconnectWallet}
                  className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-sm py-2.5 rounded-lg font-medium transition-all"
                >
                  Disconnect
                </Button>
                <Button
                  onClick={() => setShowWalletModal(false)}
                  className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white text-sm py-2.5 rounded-lg font-medium transition-all"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default HeaderSection;
