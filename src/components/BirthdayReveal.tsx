import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Heart } from 'lucide-react';
import heroPortrait from '../assets/images/birthday_hero_portrait_1790957273166.jpg';

interface BirthdayRevealProps {
  personName: string;
  onCelebrate: () => void;
}

export const BirthdayReveal: React.FC<BirthdayRevealProps> = ({ personName, onCelebrate }) => {
  const [isInView, setIsInView] = useState(false);
  const [isPhotoActive, setIsPhotoActive] = useState(false);
  const [mouseTilt, setMouseTilt] = useState({ x: 0, y: 0 });
  const sectionRef = useRef<HTMLElement | null>(null);

  // IntersectionObserver for deliberate entrance timing
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
          }
        });
      },
      { threshold: 0.25 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setMouseTilt({
      x: (y / rect.height) * -12,
      y: (x / rect.width) * 12,
    });
  };

  const handleMouseLeave = () => {
    setMouseTilt({ x: 0, y: 0 });
    setIsPhotoActive(false);
  };

  return (
    <section
      id="reveal"
      ref={sectionRef}
      className="relative min-h-[90vh] flex items-center justify-center py-20 px-6 sm:px-10 overflow-hidden"
    >
      {/* Soft pink glow expanding behind the heading and photo */}
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-1000 ease-out ${
          isInView ? 'scale-110 opacity-70' : 'scale-50 opacity-0'
        }`}
        style={{
          width: '750px',
          height: '750px',
          background: 'radial-gradient(circle, rgba(255, 182, 213, 0.35) 0%, rgba(248, 200, 220, 0.15) 45%, transparent 70%)',
          filter: 'blur(90px)',
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left Column: Heading and Narrative */}
        <div className="lg:col-span-7 flex flex-col items-start text-left">
          {/* Subtle kicker */}
          <div
            className={`flex items-center gap-2 mb-4 text-xs uppercase tracking-[0.25em] text-[#FFB6D5]/90 transition-all duration-700 delay-100 ${
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#E8C882]" />
            <span>Honoring an Exceptional Soul</span>
            <span aria-hidden="true">·</span>
            <span>A Day to Celebrate You</span>
          </div>

          {/* Large birthday title with letters animated individually */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-normal text-[#FFF4F8] leading-[1.08] tracking-tight mb-4">
            <span className="block text-2xl sm:text-3xl md:text-4xl text-[#FFD6E5]/80 font-light italic mb-2">
              Happy Birthday,
            </span>
            <span className="inline-block relative">
              {personName.split('').map((char, index) => (
                <span
                  key={index}
                  className="inline-block transition-all duration-700 ease-out"
                  style={{
                    opacity: isInView ? 1 : 0,
                    transform: isInView ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.9)',
                    filter: isInView ? 'blur(0px)' : 'blur(8px)',
                    transitionDelay: `${350 + index * 45}ms`,
                    textShadow: '0 0 30px rgba(255, 182, 213, 0.45)',
                  }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
              <span
                className="inline-block ml-3 text-[#FFB6D5] transition-all duration-700 delay-700"
                style={{
                  opacity: isInView ? 1 : 0,
                  transform: isInView ? 'scale(1)' : 'scale(0)',
                }}
              >
                ♡
              </span>
            </span>
          </h1>

          {/* Narrative description */}
          <p
            className={`mt-4 text-base sm:text-lg text-[#F8C8DC]/90 leading-relaxed font-light max-w-xl transition-all duration-1000 delay-500 ${
              isInView ? 'opacity-100 translate-y-0 filter blur-0' : 'opacity-0 translate-y-6 filter blur-sm'
            }`}
          >
            May your day be painted with the softest hues of joy, surrounded by warmth, quiet wonder, and all the people who treasure your presence in their lives.
          </p>

          {/* Staggered action row */}
          <div
            className={`mt-8 flex flex-wrap items-center gap-4 transition-all duration-1000 delay-700 ${
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <button
              onClick={onCelebrate}
              data-interactive="true"
              className="group relative inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold text-[#0c080d] bg-gradient-to-r from-[#FFD6E5] via-[#FFB6D5] to-[#F8C8DC] shadow-[0_0_25px_rgba(255,182,213,0.4)] hover:shadow-[0_0_40px_rgba(255,182,213,0.8)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#831843]" />
              <span>Begin Celebration</span>
            </button>

            <a
              href="#memories"
              data-interactive="true"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-sm font-medium text-[#FFF4F8] glass-pill hover:bg-white/10 hover:border-[#FFD6E5]/40 transition-all cursor-pointer"
            >
              <span>Explore Memories</span>
              <span className="text-xs text-[#FFB6D5]">↓</span>
            </a>
          </div>
        </div>

        {/* Right Column: Hero Portrait Photo with scale 0.92 -> 1.0, blur -> sharp, glow & 3D tilt */}
        <div className="lg:col-span-5 flex justify-center">
          <div
            className="perspective-1000 w-full max-w-md"
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsPhotoActive(true)}
            onMouseLeave={handleMouseLeave}
            onClick={() => setIsPhotoActive((prev) => !prev)}
          >
            <div
              className="relative rounded-3xl p-3 glass-panel-elevated transform-style-3d cursor-pointer select-none transition-all duration-300 ease-out"
              style={{
                transform: `rotateX(${mouseTilt.x}deg) rotateY(${mouseTilt.y}deg) ${
                  isPhotoActive ? 'scale(1.035)' : 'scale(1)'
                }`,
                boxShadow: isPhotoActive
                  ? '0 30px 70px -10px rgba(0, 0, 0, 0.7), 0 0 50px 10px rgba(255, 182, 213, 0.45)'
                  : '0 20px 50px -10px rgba(0, 0, 0, 0.6), 0 0 30px rgba(255, 182, 213, 0.2)',
              }}
            >
              {/* Outer soft glow border ring */}
              <div
                className={`absolute inset-0 rounded-3xl pointer-events-none transition-opacity duration-700 ${
                  isInView ? 'opacity-100' : 'opacity-0'
                }`}
                style={{
                  background: 'radial-gradient(circle at top right, rgba(255, 214, 229, 0.35), transparent 70%)',
                }}
              />

              {/* Photo Frame */}
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-[#1a0f19]">
                <img
                  src={heroPortrait}
                  alt={`Portrait celebration for ${personName}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center transition-all duration-1000 ease-out"
                  style={{
                    transform: isInView ? (isPhotoActive ? 'scale(1.06)' : 'scale(1.0)') : 'scale(0.92)',
                    filter: isInView ? 'blur(0px)' : 'blur(16px)',
                    transitionDelay: '300ms',
                  }}
                />

                {/* Soft reflection sheen */}
                <div
                  className={`absolute inset-0 pointer-events-none transition-opacity duration-700 bg-gradient-to-tr from-transparent via-white/10 to-transparent ${
                    isPhotoActive ? 'opacity-100' : 'opacity-0'
                  }`}
                />

                {/* Delicate gradient vignette for text legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

                {/* Overlay Caption (Revealed smoothly on hover/tap) */}
                <div
                  className={`absolute bottom-0 inset-x-0 p-6 transition-all duration-500 ease-out ${
                    isPhotoActive ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-85'
                  }`}
                >
                  <p className="text-xs uppercase tracking-widest text-[#FFB6D5] font-medium flex items-center gap-1.5">
                    <Heart className="w-3 h-3 fill-[#FFB6D5]" />
                    <span>Cherished Edition</span>
                  </p>
                  <p className="text-sm text-[#FFF4F8] font-serif italic mt-1">
                    “May every step of this journey reflect the elegance you carry so naturally.”
                  </p>
                </div>
              </div>

              {/* Tiny floating heart indicator */}
              <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full glass-panel flex items-center justify-center text-[#FFB6D5] animate-bounce shadow-md">
                <Heart className="w-4 h-4 fill-[#FFB6D5]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
