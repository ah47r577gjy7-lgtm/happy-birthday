import React, { useState } from 'react';
import { sounds } from '../utils/audio';

interface Screen1WhyHereProps {
  onNext: () => void;
}

export const Screen1WhyHere: React.FC<Screen1WhyHereProps> = ({ onNext }) => {
  const [clickedBtn, setClickedBtn] = useState<'btn1' | 'btn2' | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleClick = (btnKey: 'btn1' | 'btn2') => {
    if (isTransitioning) return;
    sounds.playSubtleClick();
    setClickedBtn(btnKey);
    setIsTransitioning(true);

    setTimeout(() => {
      onNext();
    }, 650);
  };

  return (
    <div
      className={`fixed inset-0 w-full h-[100dvh] flex flex-col items-center justify-center p-6 text-center select-none transition-all duration-700 ease-out ${
        isTransitioning ? 'filter blur-md scale-95 opacity-0' : 'filter blur-0 scale-100 opacity-100'
      }`}
    >
      {/* Subtle center ambient blush glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none rounded-full"
        style={{
          width: '520px',
          height: '520px',
          background: 'radial-gradient(circle, rgba(255, 182, 213, 0.28) 0%, rgba(248, 200, 220, 0.1) 45%, transparent 70%)',
          filter: 'blur(75px)',
        }}
      />

      <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center w-full px-2">
        {/* Mysterious intro kicker */}
        <span className="text-[11px] sm:text-xs uppercase tracking-[0.28em] text-[#FFB6D5]/80 font-medium mb-3 sm:mb-4">
          A Curious Little Question
        </span>

        {/* Large elegant question */}
        <h1 className="text-3xl min-[360px]:text-4xl sm:text-6xl md:text-7xl font-serif font-normal text-[#FFF4F8] tracking-tight leading-tight mb-8 sm:mb-12 drop-shadow-[0_2px_20px_rgba(255,182,213,0.3)]">
          Why are you here?
        </h1>

        {/* TWO large tempting glassmorphism buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full max-w-sm sm:max-w-md justify-center">
          {/* Button 1: "Time Waste" */}
          <button
            onClick={() => handleClick('btn1')}
            data-interactive="true"
            className={`group relative w-full sm:w-56 py-3.5 sm:py-4 px-5 sm:px-6 rounded-2xl glass-panel-elevated text-base sm:text-lg font-serif tracking-wide text-[#FFF4F8] hover:text-white transition-all duration-300 cursor-pointer overflow-hidden touch-manipulation ${
              clickedBtn === 'btn1' ? 'scale-95 opacity-80' : 'hover:scale-105 active:scale-95'
            }`}
            style={{
              boxShadow: '0 10px 30px -5px rgba(255, 182, 213, 0.2), 0 0 20px rgba(255, 214, 229, 0.1)',
            }}
          >
            {/* Soft pink glow border highlight */}
            <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-[#FFB6D5]/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <span className="relative z-10 font-medium">Time Waste</span>
          </button>

          {/* Button 2: "Really Time Waste" */}
          <button
            onClick={() => handleClick('btn2')}
            data-interactive="true"
            className={`group relative w-full sm:w-56 py-3.5 sm:py-4 px-5 sm:px-6 rounded-2xl glass-panel-elevated text-base sm:text-lg font-serif tracking-wide text-[#FFF4F8] hover:text-white transition-all duration-300 cursor-pointer overflow-hidden touch-manipulation ${
              clickedBtn === 'btn2' ? 'scale-95 opacity-80' : 'hover:scale-105 active:scale-95'
            }`}
            style={{
              boxShadow: '0 10px 30px -5px rgba(255, 182, 213, 0.25), 0 0 25px rgba(255, 182, 213, 0.15)',
            }}
          >
            {/* Soft pink glow border highlight */}
            <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-[#FFD6E5]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <span className="relative z-10 font-medium">Really Time Waste</span>
          </button>
        </div>

        <p className="mt-8 sm:mt-10 text-xs text-[#FFD6E5]/50 tracking-widest font-light">
          Choose either to proceed
        </p>
      </div>
    </div>
  );
};
