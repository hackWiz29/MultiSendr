'use client';

import React from 'react';

const FeaturesSection: React.FC = () => {
  const features = [
    { icon: "S", label: "Secure" },
    { icon: "F", label: "Fast" },
    { icon: "$", label: "Low Fees" },
    { icon: "A", label: "Avail SDK" },
    { icon: "B", label: "Batch" },
    { icon: "D", label: "Decentralized" }
  ];

  return (
    <div className="overflow-hidden relative h-full">
      <div className="flex gap-1 animate-scroll h-full">
        {/* First set of features */}
        {features.map((feature, index) => (
          <div key={`first-${index}`} className="bg-[#000000] p-6 flex items-center justify-center rounded-lg w-[150px] shrink-0">
            <div className="text-center">
              <div className="text-white text-2xl mb-2 font-bold">{feature.icon}</div>
              <span className="text-white text-sm font-medium">{feature.label}</span>
            </div>
          </div>
        ))}
        {/* Duplicate set for seamless loop */}
        {features.map((feature, index) => (
          <div key={`second-${index}`} className="bg-[#000000] p-6 flex items-center justify-center rounded-lg w-[150px] shrink-0">
            <div className="text-center">
              <div className="text-white text-2xl mb-2 font-bold">{feature.icon}</div>
              <span className="text-white text-sm font-medium">{feature.label}</span>
            </div>
          </div>
        ))}
        {/* Third set to ensure no gaps */}
        {features.map((feature, index) => (
          <div key={`third-${index}`} className="bg-[#000000] p-6 flex items-center justify-center rounded-lg w-[150px] shrink-0">
            <div className="text-center">
              <div className="text-white text-2xl mb-2 font-bold">{feature.icon}</div>
              <span className="text-white text-sm font-medium">{feature.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturesSection;
