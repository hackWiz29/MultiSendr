'use client';

import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Button from '../ui/Button';

// Extend Window interface to include ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}

const HeaderSection: React.FC = () => {
  const [ethWalletAddress, setEthWalletAddress] = useState<string | null>(null);
  const [isConnectingEth, setIsConnectingEth] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (window.ethereum) {
      checkEthWalletConnection();
      window.ethereum.on("accountsChanged", handleEthAccountsChanged);
    }
    return () => {
      if (window.ethereum) window.ethereum.removeListener("accountsChanged", handleEthAccountsChanged);
    };
  }, []);

  const handleEthAccountsChanged = (accounts: string[]) => {
    setEthWalletAddress(accounts.length > 0 ? accounts[0] : null);
  };

  const checkEthWalletConnection = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.listAccounts();
      if (accounts.length > 0) setEthWalletAddress(accounts[0].address);
    } catch (err) {
      console.error(err);
    }
  };

  const connectEthWallet = async () => {
    if (!window.ethereum) return setError("Install MetaMask");
    setIsConnectingEth(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      setEthWalletAddress(accounts[0]);
      setError(null);
    } catch (err: any) {
      setError("ETH connection failed: " + err.message);
    } finally {
      setIsConnectingEth(false);
    }
  };

  const disconnectEthWallet = () => {
    setEthWalletAddress(null);
  };

  const formatAddress = (address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`;

  return (
    <>
      {/* Row 1: 3 columns - 100px height */}
      <div className="grid grid-cols-3 gap-0 border-b border-white/10 rounded-2xl">
        <div className="bg-white/5 p-6 border-r border-white/10 flex items-center justify-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#9ed9d4' }}>
              <span className="font-bold text-sm" style={{ color: 'black' }}>S</span>
            </div>
            <span className="text-white text-lg font-medium">StableSwap</span>
          </div>
        </div>
        <div className="bg-white/5 p-6 flex items-center justify-center">
        </div>
        <div className="bg-white/5 p-6 border-l border-white/10 flex items-center justify-center">
          {ethWalletAddress ? (
            <div className="flex flex-col items-center gap-2 w-4/5">
              <Button onClick={disconnectEthWallet} className="w-full py-4">
                {formatAddress(ethWalletAddress)}
              </Button>
              <span className="text-xs text-white/60">Click to disconnect</span>
            </div>
          ) : (
            <div className="w-4/5">
              <Button 
                onClick={connectEthWallet}
                disabled={isConnectingEth}
                className="w-full py-4"
              >
                {isConnectingEth ? "Connecting..." : "Connect Wallet"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default HeaderSection;
