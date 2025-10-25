"use client";

import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import Button from "../ui/Button";
import Image from "next/image";
import logo from "../../assets/logo.svg";
import Link from "next/link";

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
      if (window.ethereum)
        window.ethereum.removeListener(
          "accountsChanged",
          handleEthAccountsChanged
        );
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

  const formatAddress = (address: string) =>
    `${address.slice(0, 6)}...${address.slice(-4)}`;

  return (
    <>
      {/* Row 1: 3 columns - 100px height */}
      <div className="grid grid-cols-3 gap-0 rounded-2xl h-[100px]">
        <div className="bg-[#000000] flex items-center justify-start border-r border-white/10">
          <Link href="/" className="h-[60px] w-max ml-[60px]">
            <Image src={logo} alt="logo" width={100} height={100} className="h-full w-auto" />
          </Link>
        </div>
        <div className="bg-[#000000] flex items-center justify-center border-r border-white/10"></div>
        <div className="bg-[#000000] flex items-center justify-center">
          {ethWalletAddress ? (
            <div className="flex flex-col items-center gap-2 w-4/5">
              <Button onClick={disconnectEthWallet} className="w-full">
                {formatAddress(ethWalletAddress)}
              </Button>
              <span className="text-xs">Click to disconnect</span>
            </div>
          ) : (
            <div className="w-4/5">
              <Button
                onClick={connectEthWallet}
                disabled={isConnectingEth}
                className="w-full"
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
