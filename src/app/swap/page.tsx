"use client";

import React from "react";
import BatchSwapInterface from "../../components/swap/BatchSwapInterface";
import HeaderSection from "@/src/components/herosection/HeaderSection";
import TestnetFaucet from "../../components/TestnetFaucet";
import RecentTransactions from "../../components/RecentTransactions";

export default function SwapPage() {
  return (
    <main className="w-full min-h-screen bg-gradient-to-br from-[#2E2E2E] via-[#1A1A1A] to-[#000000] p-1">
      <div className="h-full grid grid-rows-[100px_1fr] gap-1">
        <HeaderSection />
        <div
          className="bg-[#000000] p-6 flex items-center justify-center relative isolation-isolate overflow-hidden"
          style={{
            clipPath:
              "polygon(0% 3.5em, 3.5em 0, 100% 0, 100% calc(100% - 3.5em), calc(100% - 3.5em) 100%, 0 100%)",
            boxShadow: "10px 10px 20px rgba(0, 0, 0, 0.6)",
          }}
        >
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#723680]/5 to-[#461561]/5 pointer-events-none" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#723680]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#461561]/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="w-full max-w-6xl space-y-8 relative z-10">

            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <BatchSwapInterface />
              </div>
              <div className="lg:col-span-1 space-y-6">
                <TestnetFaucet />
                <RecentTransactions />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
