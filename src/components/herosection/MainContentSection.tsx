"use client";

import React from "react";
import Button from "../ui/Button";
import { FaArrowRight } from "react-icons/fa";
import Link from "next/link";

const MainContentSection: React.FC = () => {
  return (
    <div className="grid gap-1" style={{ gridTemplateColumns: '25% 1fr 25%' }}>
      <div className="bg-[#000000] p-8 flex flex-col justify-between items-start h-full">
        <div className="flex justify-start w-full">
          <svg viewBox="0 0 120 120" fill="none" className="w-[clamp(4rem,1.975rem+8.642vw,7.5rem)] lg:w-[clamp(4rem,0rem+6.25vw,7.5rem)] stroke-[1rem] text-white">
            <path d="M60 120V82.0388L82.5962 58.8235H120M60 0L60 37.9612L37.4038 61.1765L0 61.1765" stroke="currentcolor" fill="none"></path>
          </svg>
        </div>
        <div className="text-left relative w-full">
          <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-white rounded-tl-md"></div>
          <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-white rounded-br-md"></div>
          <p className="text-white text-sm text-center leading-relaxed pl-6 pr-6 pt-2 pb-2 w-full">
            Built on Avail's cutting-edge SDK.
          </p>
        </div>
      </div>
      <div
        className="bg-[#000000] p-6 flex items-center justify-center relative isolation-isolate"
        style={{
          clipPath:
            "polygon(0% 3.5em, 3.5em 0, 100% 0, 100% calc(100% - 3.5em), calc(100% - 3.5em) 100%, 0 100%)",
          boxShadow: "10px 10px 20px rgba(0, 0, 0, 0.6)",
        }}
      >
        {/* Background video - top left */}
        <video
          className="absolute top-0 left-0 w-[250px] aspect-auto z-0 opacity-80"
          autoPlay
          muted
          loop
          playsInline
        >
          <source
            src="https://atk2comacjoao5mp.public.blob.vercel-storage.com/hud_dark.mp4"
            type="video/mp4"
          />
        </video>

        {/* Background video - bottom right */}
        <video
          className="absolute bottom-0 right-0 w-[200px] aspect-auto z-0 opacity-80 rotate-180"
          autoPlay
          muted
          loop
          playsInline
        >
          <source
            src="https://atk2comacjoao5mp.public.blob.vercel-storage.com/hud_dark.mp4"
            type="video/mp4"
          />
        </video>

        <div className="text-left relative z-10 flex flex-col items-start justify-center h-full w-full px-16">
          <h3 className="text-4xl font-bold mb-4 leading-tight drop-shadow-lg">
            <span className="text-white/95 text-start">
              MultiSendr <br /> Send more. Spend less
            </span>
          </h3>
          <p className="text-white/90 text-sm mb-8 leading-relaxed max-w-md drop-shadow-md">
            Swap all your stablecoins together — simple, fast, and low-cost.
          </p>
          <Link href="/swap" className="w-[80%]">
            <Button className="flex items-center gap-8 w-full">
              <span>Start Swapping</span>
              <FaArrowRight />
            </Button>
          </Link>
        </div>
      </div>
      <div className="bg-[#000000] p-8 flex flex-col justify-between items-end">
        <div className="text-left">
          <p className="text-white text-sm text-right leading-relaxed">
            MultiSendr is a revolutionary stablecoin swapping platform that allows you to exchange multiple cryptocurrencies simultaneously in a single transaction. Built on the Avail blockchain, it offers lightning-fast swaps with minimal fees, making it the most efficient way to manage your digital assets.
          </p>
        </div>
        <div className="mt-4">
          <svg viewBox="0 0 120 120" fill="none" className="w-[clamp(4rem,1.975rem+8.642vw,7.5rem)] lg:w-[clamp(4rem,0rem+6.25vw,7.5rem)] stroke-[1rem] text-white">
            <path id="Vector 82" d="M61.25 55.3594L6.25001 114M6.25 6L43.1843 45.6563" fill="none" stroke="currentcolor"></path>
            <path id="Vector 83" d="M61.25 6L109.25 60L61.25 114" fill="none" stroke="currentcolor"></path>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default MainContentSection;
