import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Heart } from 'lucide-react';
import { sounds } from '../utils/audio';

interface OpeningScreenProps {
  onEnter: () => void;
  personName: string;
}

export const OpeningScreen: React.FC<OpeningScreenProps> = ({ onEnter, personName }) => {
  const [displayText, setDisplayText] = useState('');
  const [showButton, setShowButton] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const fullSentence = "Something special was made for you.";

  // Typewriter letter-by-letter reveal
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < fullSentence.length) {
        setDisplayText(fullSentence.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
        setTimeout(() => setShowButton(true), 350);
      }
    }, 55);

    return () => clearInterval(interval);
  }, []);

  // Small pink particles appearing and bursting on click
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      alpha: number;
      color: string;
      bursting?: boolean;
    }> = [];

    const colors = ['#FFD6E5', '#FFB6D5', '#F8C8DC', '#FFF4F8', '#E8C882'];

    // Generate center-oriented floating particles
    for (let i = 0; i < 45; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * 220 + 20;
      particles.push({
        x: width / 2 + Math.cos(angle) * dist,
        y: height / 2 + Math.sin(angle) * dist,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -(Math.random() * 0.4 + 0.1),
        radius: Math.random() * 2.5 + 1.2,
        alpha: Math.random() * 0.5 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    let raf: number;
    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (isExiting) {
          // Particles move outward aggressively in all directions during exit
          const dx = p.x - width / 2;
          const dy = p.y - height / 2;
          const angle = Math.atan2(dy, dx);
          const speed = Math.hypot(dx, dy) * 0.08 + 6;
          p.vx = Math.cos(angle) * speed;
          p.vy = Math.sin(angle) * speed;
          p.alpha *= 0.94;
        } else {
          // Gentle ambient float
          if (p.y < height / 2 - 250) p.y = height / 2 + 250;
          if (p.x < width / 2 - 300) p.x = width / 2 + 300;
          if (p.x > width / 2 + 300) p.x = width / 2 - 300;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.restore();
      });

      raf = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(raf);
    };
  }, [isExiting]);

  const handleEnterClick = () => {
    if (isExiting) return;
    sounds.playArpeggio();
    setShowFlash(true);
    setIsExiting(true);

    // Brief white/pink flash duration and card transition
    setTimeout(() => {
      setShowFlash(false);
    }, 450);

    setTimeout(() => {
      onEnter();
    }, 950);
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-6 select-none overflow-hidden">
      {/* Canvas for particle burst */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-10" />

      {/* Brief white/pink flash when user clicks Enter */}
      <div
        className={`fixed inset-0 z-50 pointer-events-none transition-opacity duration-500 ease-out bg-gradient-to-tr from-[#FFF4F8] via-[#FFD6E5] to-white ${
          showFlash ? 'opacity-95' : 'opacity-0'
        }`}
      />

      {/* Soft glowing light in center */}
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-1000 ${
          isExiting ? 'scale-150 opacity-0' : 'scale-100 opacity-60'
        }`}
        style={{
          width: '520px',
          height: '520px',
          background: 'radial-gradient(circle, rgba(255, 182, 213, 0.45) 0%, rgba(248, 200, 220, 0.2) 40%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Glass card with fade-in and scale-down exit */}
      <div
        className={`relative z-20 max-w-lg w-full glass-panel-elevated rounded-3xl p-10 md:p-14 text-center transition-all duration-700 ease-out ${
          isExiting
            ? 'scale-75 opacity-0 -translate-y-6 filter blur-md'
            : 'scale-100 opacity-100 translate-y-0 filter blur-0'
        }`}
        style={{
          animation: 'fadeInCard 1.1s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        }}
      >
        <div className="flex items-center justify-center mb-6 text-[#FFB6D5]/80">
          <Sparkles className="w-5 h-5 animate-pulse" />
          <span className="mx-2 text-xs tracking-[0.25em] uppercase text-[#F8C8DC] font-medium">A Keepsake For</span>
          <Heart className="w-4 h-4 text-[#FFB6D5] fill-[#FFB6D5]/30 animate-pulse-subtle" />
        </div>

        <h2 className="text-3xl md:text-4xl font-serif text-[#FFF4F8] tracking-tight mb-4 drop-shadow-[0_2px_15px_rgba(255,182,213,0.3)]">
          {personName}
        </h2>

        {/* Letter by letter text */}
        <div className="min-h-[56px] flex items-center justify-center mb-8">
          <p className="text-lg md:text-xl font-light text-[#FFD6E5]/90 tracking-wide font-serif italic">
            &ldquo;{displayText}&rdquo;
            {displayText.length < fullSentence.length && (
              <span className="inline-block w-1.5 h-4 ml-1 bg-[#FFB6D5] animate-pulse" />
            )}
          </p>
        </div>

        {/* Softly pulsing Enter Button */}
        <div
          className={`transition-all duration-700 ${
            showButton ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95 pointer-events-none'
          }`}
        >
          <button
            onClick={handleEnterClick}
            data-interactive="true"
            className="group relative inline-flex items-center justify-center px-8 py-3.5 rounded-full overflow-hidden text-sm font-medium tracking-wider text-[#0c080d] bg-gradient-to-r from-[#FFD6E5] via-[#FFB6D5] to-[#F8C8DC] shadow-[0_0_25px_rgba(255,182,213,0.5)] hover:shadow-[0_0_40px_rgba(255,182,213,0.85)] hover:scale-105 active:scale-95 transition-all duration-300 animate-pulse-subtle cursor-pointer"
          >
            {/* Shimmer reflection sweep */}
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />

            <span className="relative flex items-center gap-2 font-semibold">
              <span>Open Invitation</span>
              <span className="text-xs transition-transform duration-300 group-hover:translate-x-1">→</span>
            </span>
          </button>

          <p className="mt-4 text-xs text-[#FFD6E5]/60 tracking-wider">
            Sound and animations recommended
          </p>
        </div>
      </div>
    </div>
  );
};
