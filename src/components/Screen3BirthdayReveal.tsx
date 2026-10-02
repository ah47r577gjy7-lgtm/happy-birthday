import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Heart, ChevronDown } from 'lucide-react';
import { BirthdayConfig } from '../types/celebration';

interface Screen3BirthdayRevealProps {
  config: BirthdayConfig;
  onProceedToLongPage: () => void;
}

export const Screen3BirthdayReveal: React.FC<Screen3BirthdayRevealProps> = ({
  config,
  onProceedToLongPage,
}) => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [textAnimStage, setTextAnimStage] = useState<'visible' | 'fading'>('visible');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const photos = [
    config.soniaPhoto1,
    config.soniaPhoto2,
    config.soniaPhoto3,
    config.soniaPhoto4,
    config.soniaPhoto5,
  ];

  const wishes = [
    'May your smile never fade.',
    'May this year bring you beautiful memories.',
    'May you always find reasons to be happy.',
    'You deserve all the beautiful things.',
    `Keep shining, ${config.personName}.`,
    `Happy Birthday, ${config.personName} ♡`,
  ];

  // Auto advance photos and wishes every 3.8s
  useEffect(() => {
    const timer = setInterval(() => {
      setTextAnimStage('fading');
      setTimeout(() => {
        setCurrentIdx((prev) => (prev + 1) % photos.length);
        setTextAnimStage('visible');
      }, 450);
    }, 3800);

    return () => clearInterval(timer);
  }, [photos.length]);

  // Subtle celebration canvas (floating hearts, confetti, tiny stars, gentle fireworks)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const onResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      alpha: number;
      type: 'heart' | 'confetti' | 'star' | 'sparkle';
      rotation: number;
      rotationSpeed: number;
    }> = [];

    const palette = ['#FFD6E5', '#FFB6D5', '#F8C8DC', '#FFF4F8', '#E8C882', '#FFFFFF'];

    for (let i = 0; i < 40; i++) {
      const type = i % 4 === 0 ? 'heart' : i % 3 === 0 ? 'star' : 'confetti';
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 1.0,
        vy: type === 'heart' ? -(Math.random() * 1.2 + 0.6) : Math.random() * 1.4 + 0.8,
        size: type === 'heart' ? 9 : Math.random() * 4 + 2,
        color: palette[Math.floor(Math.random() * palette.length)],
        alpha: Math.random() * 0.6 + 0.3,
        type,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.05,
      });
    }

    const drawHeart = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string, alpha: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(size / 14, size / 14);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-5, -6, -10, 0, 0, 10);
      ctx.bezierCurveTo(10, 0, 5, -6, 0, 0);
      ctx.fillStyle = color;
      ctx.globalAlpha = alpha * 0.65;
      ctx.shadowColor = '#FFB6D5';
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.restore();
    };

    let rafId: number;
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;

        if (p.type === 'heart') {
          if (p.y < -20) {
            p.y = height + 10;
            p.x = Math.random() * width;
          }
          drawHeart(ctx, p.x, p.y, p.size, p.color, p.alpha);
        } else {
          if (p.y > height + 20) {
            p.y = -10;
            p.x = Math.random() * width;
          }
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 6;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          ctx.restore();
        }
      });

      rafId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(rafId);
    };
  }, []);

  // Distinct transitions per index:
  // Photo 0: blur → sharp → slight zoom
  // Photo 1: crossfade + scale
  // Photo 2: slide + blur
  // Photo 3: soft rotation + fade
  // Photo 4: zoom-out + crossfade
  const getTransitionStyle = (index: number) => {
    const isActive = index === currentIdx;
    if (!isActive) {
      return {
        opacity: 0,
        pointerEvents: 'none' as const,
        transform: 'scale(0.96)',
        filter: 'blur(8px)',
        transition: 'all 0.9s cubic-bezier(0.16, 1, 0.3, 1)',
      };
    }

    switch (index) {
      case 0:
        return {
          opacity: 1,
          transform: 'scale(1.03)',
          filter: 'blur(0px)',
          transition: 'all 1.1s cubic-bezier(0.16, 1, 0.3, 1)',
        };
      case 1:
        return {
          opacity: 1,
          transform: 'scale(1.0)',
          filter: 'blur(0px)',
          transition: 'all 1.0s ease-out',
        };
      case 2:
        return {
          opacity: 1,
          transform: 'translateX(0px)',
          filter: 'blur(0px)',
          transition: 'all 0.95s cubic-bezier(0.2, 0.8, 0.2, 1)',
        };
      case 3:
        return {
          opacity: 1,
          transform: 'rotate(0deg) scale(1)',
          filter: 'blur(0px)',
          transition: 'all 1.0s cubic-bezier(0.16, 1, 0.3, 1)',
        };
      case 4:
        return {
          opacity: 1,
          transform: 'scale(1.0)',
          filter: 'blur(0px)',
          transition: 'all 1.1s ease-out',
        };
      default:
        return {
          opacity: 1,
          transform: 'scale(1)',
          filter: 'blur(0px)',
          transition: 'all 0.9s ease-out',
        };
    }
  };

  return (
    <div className="fixed inset-0 w-full h-[100dvh] flex flex-col items-center justify-between p-3 min-[360px]:p-4 sm:p-8 select-none overflow-hidden text-center z-10">
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />

      {/* Center soft pink glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none rounded-full"
        style={{
          width: '580px',
          height: '580px',
          background: 'radial-gradient(circle, rgba(255, 182, 213, 0.4) 0%, rgba(248, 200, 220, 0.15) 50%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />

      {/* Top Header: "Happy Birthday SONIA" */}
      <div className="relative z-10 pt-[calc(8px+env(safe-area-inset-top,0px))] sm:pt-4 max-w-full">
        <div className="flex items-center justify-center gap-2 mb-1 text-[11px] sm:text-xs uppercase tracking-[0.28em] text-[#FFB6D5]">
          <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#E8C882]" />
          <span>A Celebration of You</span>
          <Heart className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-[#FFB6D5]" />
        </div>

        <h1 className="text-2xl min-[360px]:text-3xl sm:text-5xl md:text-6xl font-serif text-[#FFF4F8] tracking-tight leading-tight px-2 break-words">
          Happy Birthday,{' '}
          <span className="text-[#FFD6E5] font-normal drop-shadow-[0_0_25px_rgba(255,182,213,0.6)]">
            {config.personName}
          </span>
        </h1>

        <p className="text-[11px] sm:text-sm text-[#F8C8DC]/85 font-light tracking-wide mt-0.5 sm:mt-1">
          Today is all about you.
        </p>
      </div>

      {/* Center: Animated Single-Photo Slideshow (Height bounded for short mobile screens) */}
      <div className="relative z-10 w-full max-w-[270px] min-[390px]:max-w-[310px] sm:max-w-sm max-h-[44dvh] my-auto flex items-center justify-center">
        <div className="relative aspect-[4/5] w-full max-h-[44dvh] rounded-3xl p-2 sm:p-2.5 glass-panel-elevated shadow-[0_20px_50px_rgba(255,182,213,0.3)] border border-[#FFD6E5]/30 flex items-center justify-center overflow-hidden">
          <div className="relative w-full h-full rounded-2xl overflow-hidden bg-[#160a15]">
            {photos.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`${config.personName} moment ${i + 1}`}
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover object-center"
                style={getTransitionStyle(i)}
              />
            ))}

            {/* Gradient bottom overlay for subtle depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

            {/* Slide indicators */}
            <div className="absolute bottom-2.5 left-0 right-0 flex items-center justify-center gap-1.5 z-20 pointer-events-none">
              {photos.map((_, dotIdx) => (
                <span
                  key={dotIdx}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    dotIdx === currentIdx
                      ? 'w-5 sm:w-6 bg-[#FFB6D5]'
                      : 'w-1.5 bg-white/40'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Area: Synchronized Changing Wishes & Continue Button */}
      <div className="relative z-10 w-full max-w-lg pb-[calc(10px+env(safe-area-inset-bottom,0px))] sm:pb-6 flex flex-col items-center">
        {/* Animated Wish Text: fade out → blur → new text → sharp focus */}
        <div className="min-h-[44px] sm:min-h-[50px] flex items-center justify-center text-center px-4">
          <p
            className="text-sm min-[360px]:text-base sm:text-lg font-serif italic text-[#FFF4F8] tracking-wide drop-shadow-sm transition-all duration-500 line-clamp-2"
            style={{
              opacity: textAnimStage === 'visible' ? 1 : 0,
              filter: textAnimStage === 'visible' ? 'blur(0px)' : 'blur(8px)',
              transform: textAnimStage === 'visible' ? 'translateY(0px)' : 'translateY(6px)',
            }}
          >
            &ldquo;{wishes[currentIdx % wishes.length]}&rdquo;
          </p>
        </div>

        {/* Button to unlock Screen 4 (the long scrollable page) */}
        <button
          onClick={onProceedToLongPage}
          data-interactive="true"
          className="mt-2 sm:mt-3 group inline-flex items-center gap-2 px-5 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs font-semibold text-[#0c080d] bg-gradient-to-r from-[#FFD6E5] via-[#FFB6D5] to-[#F8C8DC] shadow-[0_0_20px_rgba(255,182,213,0.4)] hover:shadow-[0_0_35px_rgba(255,182,213,0.7)] hover:scale-105 active:scale-95 transition-all cursor-pointer touch-manipulation"
        >
          <span>See Your Memories & Story</span>
          <ChevronDown className="w-3.5 h-3.5 text-[#831843] group-hover:translate-y-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};
