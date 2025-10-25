"use client";

import React from "react";
import Button from "../ui/Button";
import { FaArrowRight } from "react-icons/fa";
import Link from "next/link";

const MainContentSection: React.FC = () => {
  return (
    <div className="grid grid-cols-2 gap-1">
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
      <div className="bg-[#000000]">
        <div className="h-full grid grid-cols-2 gap-0">
          {/* First column with 2 rows */}
          <div className="grid grid-rows-2 gap-0 border-r border-white/10">
            <div className="flex items-center justify-center border-b border-white/10 p-3"></div>
            <div className="flex items-center justify-center p-3"></div>
          </div>
          {/* Second column with 3 rows */}
          <div className="grid grid-rows-3 gap-0">
            <div className="flex items-center justify-center border-b border-white/10 p-3"></div>
            <div className="flex items-center justify-center border-b border-white/10 p-3"></div>
            <div className="flex items-center justify-center p-3"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContentSection;
