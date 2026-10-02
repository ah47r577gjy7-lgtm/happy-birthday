import React from 'react';
import { Volume2, VolumeX, Sparkles, Edit3 } from 'lucide-react';
import { sounds } from '../utils/audio';

interface TopBarProps {
  personName: string;
  onOpenNameModal: () => void;
  onTriggerCelebration: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  personName,
  onOpenNameModal,
  onTriggerCelebration,
  isMuted,
  onToggleMute,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full backdrop-blur-md bg-[#0c080d]/60 border-b border-[#FFD6E5]/10 px-4 sm:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Zone 1: Single text element wordmark in display face */}
        <a
          href="#top"
          className="text-lg md:text-xl font-serif font-medium tracking-wide text-[#FFF4F8] hover:text-[#FFB6D5] transition-colors whitespace-nowrap shrink-0"
        >
          Luminary
        </a>

        {/* Zone 2: 4-6 clean text navigation links (single line, no pills) */}
        <nav className="hidden md:flex items-center gap-7 text-xs tracking-wider uppercase font-medium text-[#FFD6E5]/80">
          <a href="#reveal" className="hover:text-white transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#FFB6D5] hover:after:w-full after:transition-all">
            Dedication
          </a>
          <a href="#memories" className="hover:text-white transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#FFB6D5] hover:after:w-full after:transition-all">
            Memories
          </a>
          <a href="#messages" className="hover:text-white transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#FFB6D5] hover:after:w-full after:transition-all">
            Secret Cards
          </a>
          <a href="#surprise" className="hover:text-white transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#FFB6D5] hover:after:w-full after:transition-all">
            Final Surprise
          </a>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Audio toggle button */}
          <button
            onClick={() => {
              sounds.playSoftClick();
              onToggleMute();
            }}
            data-interactive="true"
            aria-label={isMuted ? 'Unmute sounds' : 'Mute sounds'}
            className="p-2 rounded-full text-[#FFD6E5]/70 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            title={isMuted ? 'Enable ethereal audio chimes' : 'Mute audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#FFB6D5]" />}
          </button>

          {/* Name customizer button */}
          <button
            onClick={() => {
              sounds.playSoftClick();
              onOpenNameModal();
            }}
            data-interactive="true"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-[#FFD6E5]/90 hover:text-white bg-white/5 hover:bg-white/10 border border-[#FFD6E5]/15 transition-all cursor-pointer whitespace-nowrap"
            title="Change recipient name"
          >
            <Edit3 className="w-3.5 h-3.5 text-[#FFB6D5]" />
            <span className="hidden sm:inline">For:</span>
            <span className="max-w-[85px] truncate font-semibold text-[#FFF4F8]">{personName}</span>
          </button>

          {/* Dedicated Celebration Trigger */}
          <button
            onClick={() => {
              sounds.playCelebrationChord();
              onTriggerCelebration();
            }}
            data-interactive="true"
            className="group relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#0c080d] bg-gradient-to-r from-[#FFD6E5] to-[#FFB6D5] hover:shadow-[0_0_20px_rgba(255,182,213,0.6)] hover:scale-105 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#831843] group-hover:rotate-12 transition-transform" />
            <span>Celebrate</span>
          </button>
        </div>
      </div>
    </header>
  );
};
