'use client';

import React from 'react';

const FeaturesSection: React.FC = () => {
  return (
    <div className="grid grid-cols-4 gap-1.5">
      <div className="bg-white/5 p-6 rounded-2xl flex items-center justify-center">
        <div className="text-center">
          <div className="text-white text-2xl mb-2 font-bold">S</div>
          <span className="text-white text-sm font-medium">Secure</span>
        </div>
      </div>
      <div className="bg-white/5 p-6 rounded-2xl flex items-center justify-center">
        <div className="text-center">
          <div className="text-white text-2xl mb-2 font-bold">F</div>
          <span className="text-white text-sm font-medium">Fast</span>
        </div>
      </div>
      <div className="bg-white/5 rounded-2xl p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="text-white text-2xl mb-2 font-bold">$</div>
          <span className="text-white text-sm font-medium">Low Fees</span>
        </div>
      </div>
      <div className="bg-white/5 rounded-2xl p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="text-white text-2xl mb-2 font-bold">A</div>
          <span className="text-white text-sm font-medium">Avail SDK</span>
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;
