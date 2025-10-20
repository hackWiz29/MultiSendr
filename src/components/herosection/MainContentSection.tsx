"use client";

import React from "react";

const MainContentSection: React.FC = () => {
  return (
    <div className="grid grid-cols-2 gap-1.5">
      <div
        className="bg-white/5 p-6 flex items-center justify-center relative isolation-isolate rounded-2xl"
        style={{
          clipPath:
            "polygon(0% 3.5em, 3.5em 0, 100% 0, 100% calc(100% - 3.5em), calc(100% - 3.5em) 100%, 0 100%)",
          boxShadow: "10px 10px 20px rgba(0, 0, 0, 0.6)",
        }}
      >
        <div className="text-left">
          <div className="mb-4">
            <h3 className="text-white text-3xl font-bold mb-3 leading-tight">
              Batch Swap
              <span className="block text-2xl" style={{ color: "#9ed9d4" }}>
                Multiple Tokens
              </span>
            </h3>
            <p className="text-white/80 text-lg mb-6 leading-relaxed">
              Execute multiple stablecoin swaps in a single transaction.
              <span className="font-semibold" style={{ color: "#cce8ca" }}>
                {" "}
                Save up to 60% on gas fees
              </span>{" "}
              while swapping between USDC, USDT, DAI, and more.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <button
              className="text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              style={{ backgroundColor: "#9ed9d4", color: "black" }}
            >
              🚀 Start Swapping Now
            </button>
          </div>
        </div>
      </div>
      <div className="bg-white/5 border border-white/10 rounded-2xl">
        <div className="h-full grid grid-cols-2 gap-0">
          {/* First column with 2 rows */}
          <div className="grid grid-rows-2 gap-0 border-r border-white/10">
            <div className="flex items-center justify-center border-b border-white/10 p-3">
            </div>
            <div className="flex items-center justify-center p-3">
            </div>
          </div>
          {/* Second column with 3 rows */}
          <div className="grid grid-rows-3 gap-0">
            <div className="flex items-center justify-center border-b border-white/10 p-3">
            </div>
            <div className="flex items-center justify-center border-b border-white/10 p-3">
            </div>
            <div className="flex items-center justify-center p-3">
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContentSection;
