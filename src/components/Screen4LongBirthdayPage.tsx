import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Heart, RotateCcw, Calendar, ArrowUp } from 'lucide-react';
import { BirthdayConfig } from '../types/celebration';

interface Screen4LongBirthdayPageProps {
  config: BirthdayConfig;
  onRestart: () => void;
  onOpenCustomizer: () => void;
}

export const Screen4LongBirthdayPage: React.FC<Screen4LongBirthdayPageProps> = ({
  config,
  onRestart,
  onOpenCustomizer,
}) => {
  const [heroInView, setHeroInView] = useState(false);
  const heroRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHeroInView(true);
        }
      },
      { threshold: 0.2 }
    );
    if (heroRef.current) observer.observe(heroRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative w-full min-h-screen text-[#FFF4F8] selection:bg-[#FFB6D5]/30">
      {/* ==============================================================
          1. FIRST VIEWPORT: HERO BIRTHDAY WISH & HERO PHOTO
         ============================================================== */}
      <section
        ref={heroRef}
        className="min-h-[100dvh] flex flex-col items-center justify-center px-4 sm:px-12 py-12 pt-[calc(4.5rem+env(safe-area-inset-top,0px))] relative overflow-hidden"
      >
        {/* Soft centered ambient glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none rounded-full"
          style={{
            width: '650px',
            height: '650px',
            background: 'radial-gradient(circle, rgba(255, 182, 213, 0.35) 0%, rgba(248, 200, 220, 0.12) 45%, transparent 70%)',
            filter: 'blur(90px)',
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          {/* Left Column: Heading and Personal Birthday Message */}
          <div className="lg:col-span-7 flex flex-col items-start text-left w-full">
            <div
              className={`flex items-center gap-2 mb-2.5 sm:mb-3 text-[11px] sm:text-xs uppercase tracking-[0.28em] text-[#FFB6D5] transition-all duration-700 ${
                heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#E8C882]" />
              <span>A Special Keepsake</span>
              <span aria-hidden="true">·</span>
              <span>For Sonia</span>
            </div>

            <h1
              className={`text-3xl min-[360px]:text-4xl sm:text-6xl md:text-7xl font-serif text-[#FFF4F8] tracking-tight leading-[1.08] mb-2.5 sm:mb-3 transition-all duration-1000 break-words ${
                heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              Happy Birthday,{' '}
              <span className="text-[#FFD6E5] font-light italic">
                {config.personName} ♡
              </span>
            </h1>

            <p
              className={`text-base sm:text-xl font-serif italic text-[#F8C8DC] mb-4 sm:mb-5 transition-all duration-1000 delay-200 ${
                heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              Today isn&apos;t just another day.
            </p>

            <div
              className={`p-5 sm:p-8 rounded-3xl glass-panel text-sm sm:text-lg text-[#F8C8DC]/95 font-light leading-relaxed max-w-xl transition-all duration-1000 delay-400 ${
                heroInView ? 'opacity-100 translate-y-0 filter blur-0' : 'opacity-0 translate-y-8 filter blur-sm'
              }`}
            >
              <p>{config.mainBirthdayMessage}</p>
            </div>

            <div
              className={`mt-5 sm:mt-6 flex items-center gap-4 text-xs text-[#FFD6E5]/70 transition-all duration-1000 delay-600 ${
                heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <a
                href="#memories-section"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold text-[#0c080d] bg-gradient-to-r from-[#FFD6E5] to-[#FFB6D5] hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-md touch-manipulation"
              >
                <span>Scroll Down for Memories</span>
                <span>↓</span>
              </a>
            </div>
          </div>

          {/* Right Column: Hero Photo with blur -> sharp, scale 0.95 -> 1, soft glow */}
          <div className="lg:col-span-5 flex justify-center w-full">
            <div
              className="relative w-full max-w-[280px] sm:max-w-sm"
              style={{
                transition: 'all 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
                opacity: heroInView ? 1 : 0,
                transform: heroInView ? 'scale(1)' : 'scale(0.95)',
                filter: heroInView ? 'blur(0px)' : 'blur(16px)',
              }}
            >
              {/* Soft glow halo */}
              <div
                className="absolute inset-0 rounded-3xl pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, rgba(255, 182, 213, 0.5) 0%, transparent 70%)',
                  transform: 'scale(1.15)',
                  filter: 'blur(30px)',
                }}
              />

              <div className="relative aspect-[3/4] w-full rounded-3xl p-2.5 sm:p-3 glass-panel-elevated shadow-[0_25px_60px_rgba(255,182,213,0.35)] border border-[#FFD6E5]/30 overflow-hidden group">
                <img
                  src={config.soniaHeroPhoto}
                  alt={`${config.personName} hero portrait`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center rounded-2xl group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 p-3 sm:p-4 rounded-xl glass-panel text-left pointer-events-none">
                  <p className="text-[11px] sm:text-xs uppercase tracking-widest text-[#FFB6D5] font-semibold flex items-center gap-1.5">
                    <Heart className="w-3 h-3 fill-[#FFB6D5]" />
                    <span>Radiant & True</span>
                  </p>
                  <p className="text-[11px] sm:text-xs text-[#FFF4F8]/85 font-serif italic mt-0.5">
                    “The world is brighter with you in it.”
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==============================================================
          2. SCROLL DOWN — THREE MEMORY CARDS
         ============================================================== */}
      <section id="memories-section" className="py-16 sm:py-24 px-4 sm:px-12 max-w-6xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-12 sm:mb-16">
          <span className="text-[11px] sm:text-xs uppercase tracking-[0.25em] text-[#FFB6D5] font-medium block mb-2">
            Cherished Keepsakes
          </span>
          <h2 className="text-2.5xl min-[360px]:text-3xl sm:text-5xl font-serif text-[#FFF4F8]">
            Three Moments in Time
          </h2>
          <p className="text-xs sm:text-sm text-[#F8C8DC]/80 font-light mt-1.5 sm:mt-2">
            Moments that made life sweeter, preserved especially for your birthday.
          </p>
        </div>

        <div className="space-y-16 sm:space-y-28">
          {/* Card 1 */}
          <ScrollMemoryCard
            index={1}
            photo={config.soniaPhoto1}
            title={config.memory1Title}
            text={config.memory1Text}
            align="left"
            personName={config.personName}
          />

          {/* Card 2 */}
          <ScrollMemoryCard
            index={2}
            photo={config.soniaPhoto2}
            title={config.memory2Title}
            text={config.memory2Text}
            align="right"
            personName={config.personName}
          />

          {/* Card 3 */}
          <ScrollMemoryCard
            index={3}
            photo={config.soniaPhoto3}
            title={config.memory3Title}
            text={config.memory3Text}
            align="left"
            personName={config.personName}
          />
        </div>
      </section>

      {/* ==============================================================
          3. FINAL EMOTIONAL MESSAGE
         ============================================================== */}
      <FinalClosingSection
        config={config}
        onRestart={onRestart}
        onOpenCustomizer={onOpenCustomizer}
      />
    </div>
  );
};

/* -------------------------------------------------------------
   Scroll-Triggered Memory Card Component
   ------------------------------------------------------------- */
interface ScrollMemoryCardProps {
  index: number;
  photo: string;
  title: string;
  text: string;
  align: 'left' | 'right';
  personName: string;
}

const ScrollMemoryCard: React.FC<ScrollMemoryCardProps> = ({
  index,
  photo,
  title,
  text,
  align,
  personName,
}) => {
  const [isInView, setIsInView] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.25 }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  const isReversed = align === 'right';

  return (
    <div
      ref={cardRef}
      className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center ${
        isReversed ? 'lg:flex-row-reverse' : ''
      }`}
    >
      {/* Photo Column */}
      <div
        className={`lg:col-span-6 ${isReversed ? 'lg:order-2' : 'lg:order-1'}`}
        style={{
          transition: 'all 1.1s cubic-bezier(0.16, 1, 0.3, 1)',
          opacity: isInView ? 1 : 0,
          transform: isInView ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.96)',
          filter: isInView ? 'blur(0px)' : 'blur(14px)',
        }}
      >
        <div className="relative aspect-[4/3] rounded-3xl p-3 glass-panel-elevated shadow-[0_20px_50px_rgba(255,182,213,0.25)] border border-[#FFD6E5]/25 overflow-hidden group">
          <img
            src={photo}
            alt={`${personName} memory ${index}`}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center rounded-2xl group-hover:scale-104 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none rounded-2xl" />
        </div>
      </div>

      {/* Narrative Column */}
      <div
        className={`lg:col-span-6 flex flex-col justify-center text-left ${
          isReversed ? 'lg:order-1' : 'lg:order-2'
        }`}
        style={{
          transition: 'all 1.0s cubic-bezier(0.16, 1, 0.3, 1)',
          transitionDelay: '180ms',
          opacity: isInView ? 1 : 0,
          transform: isInView ? 'translateY(0)' : 'translateY(30px)',
          filter: isInView ? 'blur(0px)' : 'blur(6px)',
        }}
      >
        <span className="text-[11px] sm:text-xs uppercase tracking-[0.25em] text-[#FFB6D5] font-semibold mb-1.5 sm:mb-2">
          Memory #{index}
        </span>
        <h3 className="text-xl min-[360px]:text-2xl sm:text-4xl font-serif text-[#FFF4F8] mb-2 sm:mb-4 break-words">
          {title}
        </h3>
        <p className="text-sm sm:text-lg text-[#F8C8DC]/90 font-light leading-relaxed mb-4 sm:mb-6">
          {text}
        </p>
        <div className="flex items-center gap-2 text-xs text-[#FFD6E5]/60 pt-3 sm:pt-4 border-t border-white/10">
          <Heart className="w-3.5 h-3.5 fill-[#FFB6D5] text-[#FFB6D5]" />
          <span>Held close in heart</span>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------
   Final Closing Section Component
   ------------------------------------------------------------- */
const FinalClosingSection: React.FC<{
  config: BirthdayConfig;
  onRestart: () => void;
  onOpenCustomizer: () => void;
}> = ({ config, onRestart, onOpenCustomizer }) => {
  const [isInView, setIsInView] = useState(false);
  const closingRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.3 }
    );
    if (closingRef.current) observer.observe(closingRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={closingRef}
      className="min-h-screen py-20 sm:py-28 px-4 sm:px-6 flex flex-col items-center justify-center text-center relative overflow-hidden"
    >
      {/* Background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none rounded-full"
        style={{
          width: '700px',
          height: '700px',
          background: 'radial-gradient(circle, rgba(255, 182, 213, 0.4) 0%, rgba(248, 200, 220, 0.15) 50%, transparent 70%)',
          filter: 'blur(100px)',
        }}
      />

      <div
        className="relative z-10 max-w-2xl mx-auto flex flex-col items-center w-full px-2"
        style={{
          transition: 'all 1.4s cubic-bezier(0.16, 1, 0.3, 1)',
          opacity: isInView ? 1 : 0,
          transform: isInView ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.96)',
          filter: isInView ? 'blur(0px)' : 'blur(12px)',
        }}
      >
        <span className="text-[11px] sm:text-xs uppercase tracking-[0.3em] text-[#FFB6D5] font-semibold mb-3 sm:mb-4">
          A Parting Note
        </span>

        <p className="text-lg sm:text-2xl font-serif italic text-[#FFD6E5] mb-3 sm:mb-4">
          One last thing, {config.personName}...
        </p>

        <h2 className="text-2.5xl min-[360px]:text-3xl sm:text-5xl md:text-6xl font-serif text-[#FFF4F8] tracking-tight leading-snug mb-6 sm:mb-8 break-words px-2">
          {config.finalMessage}
        </h2>

        <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#FFB6D5] to-transparent mb-6 sm:mb-8" />

        <h3 className="text-xl sm:text-3xl font-serif text-[#FFD6E5] italic mb-2 sm:mb-3">
          Happy Birthday ♡
        </h3>

        <p className="text-xs sm:text-base text-[#F8C8DC]/90 font-light mb-1">
          {config.finalSignature}
        </p>

        <p className="text-[11px] sm:text-xs text-[#FFB6D5] tracking-widest uppercase mb-8 sm:mb-12">
          {config.senderName}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <button
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            data-interactive="true"
            className="flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs font-semibold text-[#FFF4F8] glass-pill hover:bg-white/10 transition-all cursor-pointer touch-manipulation"
          >
            <ArrowUp className="w-3.5 h-3.5 text-[#FFB6D5]" />
            <span>Back to Top</span>
          </button>

          <button
            onClick={onRestart}
            data-interactive="true"
            className="flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs font-semibold text-[#0c080d] bg-gradient-to-r from-[#FFD6E5] to-[#FFB6D5] hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-lg shadow-[#FFB6D5]/30 touch-manipulation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Replay Experience</span>
          </button>
        </div>

        {/* Small subtle creator credit at bottom of the last page */}
        <p className="mt-12 sm:mt-14 mb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] text-[11px] text-[#FFD6E5]/45 tracking-widest font-light select-none">
          created by Shzzzzz
        </p>
      </div>
    </section>
  );
};
