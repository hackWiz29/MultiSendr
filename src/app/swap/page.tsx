"use client";

import React from "react";
import BatchSwapInterface from "../../components/swap/BatchSwapInterface";
import HeaderSection from "@/src/components/herosection/HeaderSection";
import AvailIntegrationTest from "../../components/AvailIntegrationTest";

export default function SwapPage() {
  return (
    <main className="w-full min-h-screen bg-[#2E2E2E] p-1">
      <div className="h-full grid grid-rows-[100px_1fr] gap-1">
        <HeaderSection />
        <div
          className="bg-[#000000] p-6 flex items-center justify-center relative isolation-isolate"
          style={{
            clipPath:
              "polygon(0% 3.5em, 3.5em 0, 100% 0, 100% calc(100% - 3.5em), calc(100% - 3.5em) 100%, 0 100%)",
            boxShadow: "10px 10px 20px rgba(0, 0, 0, 0.6)",
          }}
        >
          <div className="w-full max-w-4xl space-y-6">
            <AvailIntegrationTest />
            <BatchSwapInterface />
          </div>
        </div>
      </div>
    </main>
  );
}
