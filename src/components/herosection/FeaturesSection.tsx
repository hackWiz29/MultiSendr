'use client';

import React from 'react';
import Image from 'next/image';
import img1 from '../../assets/1.png';
import img2 from '../../assets/2.png';
import img3 from '../../assets/3.png';
import img4 from '../../assets/4.png';
import img5 from '../../assets/5.png';
import img6 from '../../assets/6.png';
import img7 from '../../assets/7.png';
import img8 from '../../assets/8.png';

const FeaturesSection: React.FC = () => {
  const hackathonFeatures = [
    { image: img1 },
    { image: img2 },
    { image: img3 },
    { image: img4 },
    { image: img5 },
    { image: img6 },
    { image: img7 },
    { image: img8 }
  ];

  return (
    <div className="overflow-hidden relative h-full">
      <div className="flex gap-1 animate-scroll h-full">
        {/* First set of features */}
        {hackathonFeatures.map((feature, index) => (
          <div key={`first-${index}`} className="bg-[#000000] p-2 flex items-center justify-center rounded-lg w-[130px] h-[130px] shrink-0 relative group">
            <Image 
              src={feature.image} 
              alt={`Feature ${index + 1}`}
              width={146}
              height={146}
              className="absolute inset-0 w-full h-full object-cover rounded-lg opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800/30 to-black/30 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
          </div>
        ))}
        {/* Duplicate set for seamless loop */}
        {hackathonFeatures.map((feature, index) => (
          <div key={`second-${index}`} className="bg-[#000000] p-2 flex items-center justify-center rounded-lg w-[130px] h-[130px] shrink-0 relative group">
            <Image 
              src={feature.image} 
              alt={`Feature ${index + 1}`}
              width={146}
              height={146}
              className="absolute inset-0 w-full h-full object-cover rounded-lg opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800/30 to-black/30 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
          </div>
        ))}
        {/* Third set to ensure no gaps */}
        {hackathonFeatures.map((feature, index) => (
          <div key={`third-${index}`} className="bg-[#000000] p-2 flex items-center justify-center rounded-lg w-[130px] h-[130px] shrink-0 relative group">
            <Image 
              src={feature.image} 
              alt={`Feature ${index + 1}`}
              width={146}
              height={146}
              className="absolute inset-0 w-full h-full object-cover rounded-lg opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800/30 to-black/30 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturesSection;
