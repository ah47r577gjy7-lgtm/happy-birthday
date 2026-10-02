import React, { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  maxOpacity: number;
  pulseSpeed: number;
  type: 'bokeh' | 'star' | 'heart';
  color: string;
  angle: number;
}

export const GlobalBackground: React.FC<{ blurHeavy?: boolean }> = ({ blurHeavy = false }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [mouseParallax, setMouseParallax] = useState({ x: 0, y: 0 });
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(media.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    media.addEventListener('change', handler);
    return () => media.removeEventListener('change', handler);
  }, []);

  // Subtle parallax effect tracking
  useEffect(() => {
    if (reducedMotion) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let animFrame: number;

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      targetX = ((e.clientX / innerWidth) - 0.5) * 30;
      targetY = ((e.clientY / innerHeight) - 0.5) * 30;
    };

    const updateParallax = () => {
      currentX += (targetX - currentX) * 0.04;
      currentY += (targetY - currentY) * 0.04;
      setMouseParallax({ x: currentX, y: currentY });
      animFrame = requestAnimationFrame(updateParallax);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    animFrame = requestAnimationFrame(updateParallax);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animFrame);
    };
  }, [reducedMotion]);

  // Canvas floating bokeh, tiny glowing stars, and occasional floating hearts
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const particleCount = reducedMotion ? 18 : 55;
    const particles: Particle[] = [];

    const palette = ['#FFD6E5', '#FFB6D5', '#F8C8DC', '#FFF4F8', '#E8C882'];

    for (let i = 0; i < particleCount; i++) {
      const typeRand = Math.random();
      let type: 'bokeh' | 'star' | 'heart' = 'bokeh';
      let size = Math.random() * 8 + 4;

      if (typeRand > 0.82) {
        type = 'heart';
        size = Math.random() * 6 + 6;
      } else if (typeRand > 0.5) {
        type = 'star';
        size = Math.random() * 2 + 1.2;
      }

      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size,
        speedY: -(Math.random() * 0.25 + 0.08),
        speedX: (Math.random() - 0.5) * 0.15,
        opacity: Math.random() * 0.4 + 0.1,
        maxOpacity: Math.random() * 0.4 + 0.35,
        pulseSpeed: Math.random() * 0.02 + 0.008,
        type,
        color: palette[Math.floor(Math.random() * palette.length)],
        angle: Math.random() * Math.PI * 2,
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

    const drawStar = (ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string, alpha: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.fillStyle = color;
      ctx.globalAlpha = alpha;
      ctx.shadowColor = color;
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();

      // Delicate 4-point twinkle sparkle
      ctx.strokeStyle = color;
      ctx.lineWidth = 0.6;
      ctx.globalAlpha = alpha * 0.8;
      ctx.beginPath();
      ctx.moveTo(-r * 2.5, 0);
      ctx.lineTo(r * 2.5, 0);
      ctx.moveTo(0, -r * 2.5);
      ctx.lineTo(0, r * 2.5);
      ctx.stroke();
      ctx.restore();
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (!reducedMotion) {
          p.y += p.speedY;
          p.x += p.speedX;
          p.angle += p.pulseSpeed;

          // Wrap around screen
          if (p.y < -20) {
            p.y = height + 10;
            p.x = Math.random() * width;
          }
          if (p.x < -20) p.x = width + 10;
          if (p.x > width + 20) p.x = -10;
        }

        const currentOpacity = p.opacity + Math.sin(p.angle) * 0.15;
        const clampedOpacity = Math.max(0.05, Math.min(p.maxOpacity, currentOpacity));

        if (p.type === 'heart') {
          drawHeart(ctx, p.x, p.y, p.size, p.color, clampedOpacity);
        } else if (p.type === 'star') {
          drawStar(ctx, p.x, p.y, p.size, p.color, clampedOpacity);
        } else {
          // Floating soft bokeh orb
          ctx.save();
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = clampedOpacity * 0.35;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = p.size * 2;
          ctx.fill();
          ctx.restore();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [reducedMotion]);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden select-none z-0"
      style={{
        transition: 'filter 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
        filter: blurHeavy ? 'blur(36px)' : 'none',
      }}
    >
      {/* Base deep background */}
      <div className="absolute inset-0 bg-[#0c080d]" />

      {/* Parallax Organic Pink Gradient Blobs */}
      <div
        className="absolute inset-0 w-full h-full transition-transform duration-700 ease-out"
        style={{
          transform: `translate3d(${mouseParallax.x * -0.5}px, ${mouseParallax.y * -0.5}px, 0)`,
        }}
      >
        {/* Top-center soft blush blob */}
        <div
          className="absolute -top-[15%] left-[20%] w-[650px] h-[650px] rounded-full opacity-35 mix-blend-screen filter blur-[110px] animate-blob-1"
          style={{
            background: 'radial-gradient(circle, rgba(255, 182, 213, 0.6) 0%, rgba(248, 200, 220, 0.25) 50%, rgba(131, 24, 67, 0) 75%)',
          }}
        />

        {/* Bottom-right rose warmth blob */}
        <div
          className="absolute top-[45%] -right-[10%] w-[750px] h-[750px] rounded-full opacity-30 mix-blend-screen filter blur-[130px] animate-blob-2"
          style={{
            background: 'radial-gradient(circle, rgba(255, 214, 229, 0.5) 0%, rgba(190, 24, 93, 0.2) 55%, transparent 75%)',
          }}
        />

        {/* Bottom-left subtle gold/champagne glow blob */}
        <div
          className="absolute top-[65%] -left-[10%] w-[600px] h-[600px] rounded-full opacity-20 mix-blend-screen filter blur-[120px] animate-blob-1"
          style={{
            background: 'radial-gradient(circle, rgba(232, 200, 130, 0.45) 0%, rgba(255, 182, 213, 0.15) 60%, transparent 80%)',
          }}
        />

        {/* Center ambient glow */}
        <div
          className="absolute top-[25%] left-[30%] w-[500px] h-[500px] rounded-full opacity-25 mix-blend-screen filter blur-[100px] animate-blob-2"
          style={{
            background: 'radial-gradient(circle, rgba(255, 244, 248, 0.5) 0%, rgba(255, 182, 213, 0.2) 50%, transparent 70%)',
          }}
        />
      </div>

      {/* Very Subtle Light Rays */}
      <div
        className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1200px] h-[1000px] pointer-events-none opacity-20 mix-blend-screen animate-rays"
        style={{
          background: 'conic-gradient(from 220deg at 50% 0%, transparent 0deg, rgba(255, 214, 229, 0.18) 25deg, transparent 40deg, rgba(248, 200, 220, 0.14) 75deg, transparent 95deg, rgba(232, 200, 130, 0.12) 130deg, transparent 155deg)',
          filter: 'blur(45px)',
        }}
      />

      {/* Fine-grain noise texture overlay to eliminate color banding */}
      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Bokeh particles, stars, and floating hearts canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
    </div>
  );
};
