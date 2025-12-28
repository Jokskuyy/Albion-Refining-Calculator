import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="h-16 border-b border-albion-border bg-albion-panel/90 backdrop-blur-md sticky top-0 z-50 flex items-center justify-between px-6 lg:px-8 shadow-md">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded bg-gradient-to-br from-[#17cf54] to-[#12a341] flex items-center justify-center text-albion-dark shadow-lg shadow-[#17cf54]/50 ring-2 ring-[#17cf54]/30">
          <span className="material-symbols-outlined font-bold text-[#0b0e0c]">savings</span>
        </div>
        <h1 className="text-xl font-display font-bold tracking-tight text-white">
          Albion Profit <span className="text-[#17cf54]">Calc</span>
        </h1>
      </div>

      <div className="hidden md:flex items-center gap-1 bg-albion-dark rounded-lg p-1 border border-albion-border shadow-inner">
        <button className="flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium bg-albion-card text-white shadow-sm border border-albion-border transition-all">
          <span className="material-symbols-outlined text-[18px] text-[#17cf54]">handyman</span>
          Crafting
        </button>
        <button className="flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium text-albion-muted hover:text-white hover:bg-white/5 transition-all">
          <span className="material-symbols-outlined text-[18px]">recycling</span>
          Refining
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-albion-muted border border-albion-border rounded-lg pl-3 pr-2 py-1.5 bg-albion-dark/50 hover:border-albion-border-light transition-colors group cursor-pointer">
          <span className="material-symbols-outlined text-[18px] text-[#17cf54]/80 group-hover:text-[#17cf54] transition-colors">location_on</span>
          <span className="font-medium group-hover:text-white transition-colors">Thetford</span>
          <span className="material-symbols-outlined text-[16px]">expand_more</span>
        </div>

        <div className="h-6 w-px bg-albion-border"></div>

        <div className="flex items-center gap-3">
          <button className="text-albion-muted hover:text-white transition-colors">
            <span className="material-symbols-outlined">settings</span>
          </button>
          <div className="w-9 h-9 rounded-full bg-albion-card border border-albion-border overflow-hidden ring-2 ring-transparent hover:ring-[#17cf54]/50 transition-all cursor-pointer">
            <div className="w-full h-full bg-gradient-to-br from-[#17cf54]/20 to-albion-border flex items-center justify-center text-albion-text">
              <span className="material-symbols-outlined">person</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
