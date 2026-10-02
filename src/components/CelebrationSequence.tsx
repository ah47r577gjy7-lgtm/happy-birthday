import React, { useEffect, useRef, useState } from 'react';
import { X, Sparkles, Heart, RotateCcw } from 'lucide-react';
import { sounds } from '../utils/audio';

interface CelebrationSequenceProps {
  isOpen: boolean;
  onClose: () => void;
  personName: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  rotation: number;
  rotationSpeed: number;
  type: 'confetti' | 'heart' | 'sparkle' | 'firework';
  life?: number;
  maxLife?: number;
}

interface FireworkBurst {
  x: number;
  y: number;
  particles: Particle[];
}

export const CelebrationSequence: React.FC<CelebrationSequenceProps> = ({
  isOpen,
  onClose,
  personName,
}) => {
  const [step, setStep] = useState<number>(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const fireworksRef = useRef<FireworkBurst[]>([]);
  const animFrameRef = useRef<number | null>(null);

  const elegantColors = ['#FFD6E5', '#FFB6D5', '#F8C8DC', '#FFF4F8', '#E8C882', '#FFFFFF'];

  const startSequence = () => {
    setStep(0);
    particlesRef.current = [];
    fireworksRef.current = [];

    sounds.playCelebrationChord();

    // 0.0 sec: Background becomes slightly darker
    setStep(1);

    // 0.3 sec: Soft pink glow expands from center
    const t1 = setTimeout(() => {
      setStep(2);
    }, 300);

    // 0.6 sec: Large birthday heading appears
    const t2 = setTimeout(() => {
      setStep(3);
    }, 600);

    // 1.0 sec: Confetti begins falling
    const t3 = setTimeout(() => {
      setStep(4);
      spawnConfetti();
    }, 1000);

    // 1.2 sec: Small hearts float upward
    const t4 = setTimeout(() => {
      setStep(5);
      spawnHearts();
    }, 1200);

    // 1.5 sec: Pastel fireworks appear in background
    const t5 = setTimeout(() => {
      setStep(6);
      launchFireworks();
    }, 1500);

    // 2.0 sec: Gold and pink sparkles spread across screen
    const t6 = setTimeout(() => {
      setStep(7);
      spawnSparkles();
    }, 2000);

    // 3.0 sec: The celebration slowly settles
    const t7 = setTimeout(() => {
      setStep(8);
    }, 3000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
      clearTimeout(t7);
    };
  };

  useEffect(() => {
    if (isOpen) {
      const cleanup = startSequence();
      return cleanup;
    } else {
      setStep(0);
      particlesRef.current = [];
      fireworksRef.current = [];
    }
  }, [isOpen]);

  const spawnConfetti = () => {
    const width = window.innerWidth;
    for (let i = 0; i < 90; i++) {
      particlesRef.current.push({
        x: Math.random() * width,
        y: -20 - Math.random() * 100,
        vx: (Math.random() - 0.5) * 2.5,
        vy: Math.random() * 3 + 2.5,
        size: Math.random() * 7 + 5,
        color: elegantColors[Math.floor(Math.random() * elegantColors.length)],
        alpha: 0.95,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.12,
        type: 'confetti',
      });
    }
  };

  const spawnHearts = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    for (let i = 0; i < 35; i++) {
      particlesRef.current.push({
        x: Math.random() * width,
        y: height + 20 + Math.random() * 100,
        vx: (Math.random() - 0.5) * 1.5,
        vy: -(Math.random() * 2.5 + 1.5),
        size: Math.random() * 10 + 8,
        color: '#FFB6D5',
        alpha: 0.9,
        rotation: Math.random() * 0.4 - 0.2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        type: 'heart',
      });
    }
  };

  const launchFireworks = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    const burstLocations = [
      { x: width * 0.25, y: height * 0.32 },
      { x: width * 0.75, y: height * 0.28 },
      { x: width * 0.5, y: height * 0.22 },
    ];

    burstLocations.forEach((loc, bIdx) => {
      setTimeout(() => {
        sounds.playChime(600 + bIdx * 150, 1.8, 'sine');
        const burstParticles: Particle[] = [];
        for (let i = 0; i < 55; i++) {
          const angle = (Math.PI * 2 * i) / 55 + (Math.random() - 0.5) * 0.3;
          const speed = Math.random() * 4.5 + 2;
          burstParticles.push({
            x: loc.x,
            y: loc.y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size: Math.random() * 3 + 1.5,
            color: elegantColors[Math.floor(Math.random() * elegantColors.length)],
            alpha: 1,
            rotation: 0,
            rotationSpeed: 0,
            type: 'firework',
            life: 0,
            maxLife: Math.random() * 40 + 45,
          });
        }
        fireworksRef.current.push({ x: loc.x, y: loc.y, particles: burstParticles });
      }, bIdx * 250);
    });
  };

  const spawnSparkles = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    for (let i = 0; i < 60; i++) {
      particlesRef.current.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        size: Math.random() * 3 + 2,
        color: Math.random() > 0.4 ? '#E8C882' : '#FFD6E5',
        alpha: 0.9,
        rotation: 0,
        rotationSpeed: 0.05,
        type: 'sparkle',
        life: 0,
        maxLife: 90,
      });
    }
  };

  // Canvas render loop for continuous, GPU-friendly animations
  useEffect(() => {
    if (!isOpen) return;

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

    const drawHeart = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string, alpha: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(size / 14, size / 14);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-5, -6, -10, 0, 0, 10);
      ctx.bezierCurveTo(10, 0, 5, -6, 0, 0);
      ctx.fillStyle = color;
      ctx.globalAlpha = alpha;
      ctx.shadowColor = '#FFB6D5';
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.restore();
    };

    const loop = () => {
      ctx.clearRect(0, 0, width, height);

      // Render & update active general particles
      particlesRef.current = particlesRef.current.filter((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;

        if (p.type === 'confetti') {
          p.vy += 0.035; // gentle gravity
          p.vx *= 0.99;
          // Render fluttering confetti ribbon
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
          ctx.restore();
          return p.y < height + 50;
        }

        if (p.type === 'heart') {
          p.x += Math.sin(p.y * 0.02) * 0.6;
          drawHeart(ctx, p.x, p.y, p.size, p.color, p.alpha);
          return p.y > -50;
        }

        if (p.type === 'sparkle') {
          if (p.life !== undefined && p.maxLife !== undefined) {
            p.life++;
            const progress = p.life / p.maxLife;
            p.alpha = Math.sin(progress * Math.PI) * 0.9;
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = Math.max(0, p.alpha);
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.arc(0, 0, p.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
            return p.life < p.maxLife;
          }
        }

        return true;
      });

      // Render fireworks bursts
      fireworksRef.current.forEach((burst) => {
        burst.particles = burst.particles.filter((p) => {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.04; // gravity
          p.vx *= 0.97;
          p.vy *= 0.97;

          if (p.life !== undefined && p.maxLife !== undefined) {
            p.life++;
            p.alpha = 1 - p.life / p.maxLife;

            ctx.save();
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = Math.max(0, p.alpha);
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 8;
            ctx.fill();
            ctx.restore();

            return p.life < p.maxLife;
          }
          return false;
        });
      });

      fireworksRef.current = fireworksRef.current.filter((b) => b.particles.length > 0);

      animFrameRef.current = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-6 select-none transition-all duration-700 ${
        step >= 1 ? 'bg-black/90' : 'bg-black/40'
      }`}
    >
      {/* Background celebration canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-10" />

      {/* 0.3 sec: Soft pink glow expands from center */}
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-1000 ease-out ${
          step >= 2 ? 'scale-125 opacity-75' : 'scale-0 opacity-0'
        }`}
        style={{
          width: '720px',
          height: '720px',
          background: 'radial-gradient(circle, rgba(255, 182, 213, 0.5) 0%, rgba(248, 200, 220, 0.25) 45%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />

      {/* Close button */}
      <button
        onClick={onClose}
        data-interactive="true"
        className="absolute top-6 right-6 z-30 p-2.5 rounded-full glass-panel hover:bg-white/20 text-[#FFF4F8] transition-colors cursor-pointer"
        aria-label="Close celebration"
      >
        <X className="w-5 h-5" />
      </button>

      {/* 0.6 sec: Large Birthday Heading and Settling Content */}
      <div
        className={`relative z-20 max-w-2xl w-full text-center transition-all duration-1000 ease-out ${
          step >= 3 ? 'opacity-100 scale-100 translate-y-0 filter blur-0' : 'opacity-0 scale-95 translate-y-8 filter blur-sm'
        }`}
      >
        <div className="flex items-center justify-center gap-2 mb-4 text-[#FFB6D5]">
          <Sparkles className="w-5 h-5 animate-spin" style={{ animationDuration: '6s' }} />
          <span className="text-xs uppercase tracking-[0.3em] font-medium text-[#F8C8DC]">A Moment of Joy</span>
          <Heart className="w-4 h-4 fill-[#FFB6D5]" />
        </div>

        <h2 className="text-4xl sm:text-6xl md:text-7xl font-serif text-[#FFF4F8] tracking-tight leading-tight mb-4 drop-shadow-[0_4px_25px_rgba(255,182,213,0.5)]">
          Happy Birthday,
          <span className="block text-[#FFD6E5] font-light italic mt-1">{personName}</span>
        </h2>

        <p
          className={`text-base sm:text-lg text-[#F8C8DC]/90 font-light max-w-md mx-auto leading-relaxed transition-all duration-700 ${
            step >= 8 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          May this universe whisper peace to your thoughts, fill your heart with light, and celebrate everything you are.
        </p>

        {/* Action controls when settled (3.0s) */}
        <div
          className={`mt-10 flex items-center justify-center gap-4 transition-all duration-700 ${
            step >= 8 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
          }`}
        >
          <button
            onClick={startSequence}
            data-interactive="true"
            className="flex items-center gap-2 px-6 py-3 rounded-full text-xs font-semibold text-[#0c080d] bg-gradient-to-r from-[#FFD6E5] to-[#FFB6D5] hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-lg shadow-[#FFB6D5]/30"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Replay Climax</span>
          </button>

          <button
            onClick={onClose}
            data-interactive="true"
            className="px-6 py-3 rounded-full text-xs font-medium text-[#FFF4F8] glass-pill hover:bg-white/10 transition-all cursor-pointer"
          >
            Continue Journey
          </button>
        </div>
      </div>
    </div>
  );
};
