'use client';

import React from 'react';
import HeaderSection from './herosection/HeaderSection';
import MainContentSection from './herosection/MainContentSection';
import FeaturesSection from './herosection/FeaturesSection';

const HeroSection: React.FC = () => {
  return (
    <section className="w-screen h-screen bg-[#2E2E2E] p-1">
      <div className="h-full grid grid-rows-[100px_1fr_130px] gap-1">
        <HeaderSection />
        <MainContentSection />
        <FeaturesSection />
      </div>
    </section>
  );
};

export default HeroSection;
