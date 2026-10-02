import React, { useState, useEffect } from 'react';
import { Settings, Volume2, VolumeX, Play, Pause, X } from 'lucide-react';
import { sounds } from '../utils/audio';

interface ControlDrawerProps {
  onOpenSettings: () => void;
}

export const ControlDrawer: React.FC<ControlDrawerProps> = ({ onOpenSettings }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(sounds.getIsMuted());
  const [isMusicPlaying, setIsMusicPlaying] = useState(sounds.getIsMusicPlaying());

  // Support Shift+C shortcut as well
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && (e.key === 'C' || e.key === 'c')) {
        onOpenSettings();
      } else if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onOpenSettings]);

  const toggleSound = () => {
    sounds.playSubtleClick();
    const nextMuted = sounds.toggleMute();
    setIsMuted(nextMuted);
    setIsMusicPlaying(sounds.getIsMusicPlaying());
  };

  const toggleMusic = () => {
    sounds.playSubtleClick();
    const nextPlaying = sounds.toggleBackgroundMusic();
    setIsMusicPlaying(nextPlaying);
  };

  const handleOpenSettingsFromDrawer = () => {
    sounds.playSubtleClick();
    setIsOpen(false);
    // Open the existing CustomizationModal
    setTimeout(() => {
      onOpenSettings();
    }, 200);
  };

  return (
    <>
      {/* 1. MINIMAL THREE-DOT MENU BUTTON (Fixed Top-Right in Safe Area) */}
      <div
        className="fixed z-50 pointer-events-auto"
        style={{
          top: 'calc(14px + env(safe-area-inset-top, 0px))',
          right: '14px',
        }}
      >
        <button
          onClick={() => {
            sounds.playSubtleClick();
            setIsOpen(!isOpen);
          }}
          data-interactive="true"
          aria-label="Toggle controls menu"
          aria-expanded={isOpen}
          className={`w-11 h-11 rounded-full glass-panel-elevated flex items-center justify-center text-[#FFF4F8] hover:text-white cursor-pointer transition-all duration-300 shadow-[0_0_20px_rgba(255,182,213,0.3)] hover:shadow-[0_0_28px_rgba(255,182,213,0.6)] touch-manipulation ${
            isOpen ? 'rotate-90 bg-white/20' : 'hover:scale-105 active:scale-95'
          }`}
          title="Controls & Settings"
        >
          {/* Vertical Three-Dots (⋮) */}
          <span className="text-2xl leading-none font-bold text-[#FFD6E5] select-none">
            ⋮
          </span>
        </button>
      </div>

      {/* 2. TRANSLUCENT BACKDROP (Blur 8px, Closes on Click) */}
      <div
        onClick={() => {
          sounds.playSubtleClick();
          setIsOpen(false);
        }}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-black/45 transition-all duration-300 ease-out ${
          isOpen
            ? 'opacity-100 pointer-events-auto backdrop-blur-[8px]'
            : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* 3. CONTROL DRAWER SLIDING FROM RIGHT */}
      <div
        className="fixed top-0 right-0 h-[100dvh] z-50 flex flex-col justify-between p-5 sm:p-7 select-none transition-transform duration-350 ease-out rounded-l-3xl border-l border-[#FFD6E5]/25 shadow-[-20px_0_60px_rgba(0,0,0,0.6),0_0_40px_rgba(255,182,213,0.15)] overflow-y-auto"
        style={{
          width: 'min(360px, 82vw)',
          maxWidth: '380px',
          background: 'linear-gradient(135deg, rgba(255, 244, 248, 0.08) 0%, rgba(255, 182, 213, 0.06) 100%)',
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          paddingTop: 'calc(1.25rem + env(safe-area-inset-top, 0px))',
          paddingBottom: 'calc(1.25rem + env(safe-area-inset-bottom, 0px))',
        }}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#FFB6D5] font-semibold block">
              Experience
            </span>
            <h3 className="text-xl font-serif text-[#FFF4F8] tracking-tight">
              Controls
            </h3>
          </div>

          <button
            onClick={() => {
              sounds.playSubtleClick();
              setIsOpen(false);
            }}
            data-interactive="true"
            aria-label="Close drawer"
            className="w-8 h-8 rounded-full glass-pill hover:bg-white/20 text-[#FFF4F8] flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Drawer Controls List (Exact 3 items: Settings, Sound, Music) */}
        <div className="flex-1 py-6 flex flex-col justify-center gap-4">
          {/* ITEM 1: SETTINGS (⚙) */}
          <button
            onClick={handleOpenSettingsFromDrawer}
            data-interactive="true"
            className={`w-full p-4 rounded-2xl glass-panel text-left flex items-center justify-between group hover:border-[#FFD6E5]/40 hover:bg-white/10 transition-all cursor-pointer shadow-sm ${
              isOpen ? 'translate-y-0 opacity-100 transition-all duration-300 delay-100' : 'translate-y-2 opacity-0'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl glass-pill flex items-center justify-center text-[#FFB6D5] group-hover:rotate-45 transition-transform duration-300">
                <Settings className="w-5 h-5 text-[#FFB6D5]" />
              </div>
              <div>
                <p className="text-sm font-serif font-medium text-[#FFF4F8] group-hover:text-[#FFD6E5] transition-colors">
                  Settings
                </p>
                <p className="text-[11px] text-[#F8C8DC]/70 font-light">
                  Edit photos, messages & names
                </p>
              </div>
            </div>

            <span className="text-xs text-[#FFD6E5]/60 group-hover:translate-x-1 transition-transform">
              →
            </span>
          </button>

          {/* ITEM 2: SOUND (🔊) */}
          <button
            onClick={toggleSound}
            data-interactive="true"
            className={`w-full p-4 rounded-2xl glass-panel text-left flex items-center justify-between group hover:border-[#FFD6E5]/40 hover:bg-white/10 transition-all cursor-pointer shadow-sm ${
              isOpen ? 'translate-y-0 opacity-100 transition-all duration-300 delay-150' : 'translate-y-2 opacity-0'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl glass-pill flex items-center justify-center text-[#FFB6D5]">
                {isMuted ? (
                  <VolumeX className="w-5 h-5 text-white/50" />
                ) : (
                  <Volume2 className="w-5 h-5 text-[#FFB6D5]" />
                )}
              </div>
              <div>
                <p className="text-sm font-serif font-medium text-[#FFF4F8]">
                  Sound
                </p>
                <p className="text-[11px] text-[#F8C8DC]/70 font-light">
                  Effects & celebrations
                </p>
              </div>
            </div>

            {/* State Pill Toggle */}
            <span
              className={`px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase transition-all duration-300 ${
                !isMuted
                  ? 'bg-[#FFD6E5] text-[#0c080d] shadow-[0_0_12px_rgba(255,182,213,0.5)]'
                  : 'bg-white/10 text-white/60'
              }`}
            >
              {!isMuted ? 'Sound On' : 'Sound Off'}
            </span>
          </button>

          {/* ITEM 3: PLAY / MUSIC (▶ / ⏸) */}
          <button
            onClick={toggleMusic}
            data-interactive="true"
            className={`w-full p-4 rounded-2xl glass-panel text-left flex items-center justify-between group hover:border-[#FFD6E5]/40 hover:bg-white/10 transition-all cursor-pointer shadow-sm ${
              isOpen ? 'translate-y-0 opacity-100 transition-all duration-300 delay-200' : 'translate-y-2 opacity-0'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl glass-pill flex items-center justify-center text-[#FFB6D5]">
                {isMusicPlaying ? (
                  <Pause className="w-5 h-5 text-[#FFB6D5]" />
                ) : (
                  <Play className="w-5 h-5 text-[#F8C8DC]" />
                )}
              </div>
              <div>
                <p className="text-sm font-serif font-medium text-[#FFF4F8]">
                  Music
                </p>
                <p className="text-[11px] text-[#F8C8DC]/70 font-light">
                  Background ambient melody
                </p>
              </div>
            </div>

            {/* Music Indicator / State */}
            <div className="flex items-center gap-2">
              {isMusicPlaying && (
                <div className="flex items-end gap-1 h-4 px-1" aria-hidden="true">
                  <span className="w-1 bg-[#FFB6D5] rounded-full animate-music-bar-1" />
                  <span className="w-1 bg-[#FFD6E5] rounded-full animate-music-bar-2" />
                  <span className="w-1 bg-[#FFB6D5] rounded-full animate-music-bar-3" />
                </div>
              )}
              <span
                className={`px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase transition-all duration-300 ${
                  isMusicPlaying
                    ? 'bg-[#FFD6E5] text-[#0c080d] shadow-[0_0_12px_rgba(255,182,213,0.5)]'
                    : 'bg-white/10 text-white/60'
                }`}
              >
                {isMusicPlaying ? 'Pause Music' : 'Play Music'}
              </span>
            </div>
          </button>
        </div>

        {/* Drawer Footer with subtle close hint */}
        <div className="pt-4 border-t border-white/10 text-center">
          <p className="text-[11px] text-[#FFD6E5]/50 tracking-wider">
            Tap outside or × to close
          </p>
        </div>
      </div>
    </>
  );
};
