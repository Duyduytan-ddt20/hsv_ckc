import React from 'react';

interface HeaderBannerProps {
  topBannerUrl: string;
}

export const HeaderBanner: React.FC<HeaderBannerProps> = ({ topBannerUrl }) => {
  return (
    <header className="bg-white shadow-sm border-b border-slate-100">
      <div className="max-w-[1240px] mx-auto">
        <img 
          src={topBannerUrl || "https://i.ibb.co/Xxd9T6F/top-banner-demo.jpg"} 
          alt="HSV Banner" 
          className="w-full h-auto object-cover"
        />
      </div>
    </header>
  );
};
