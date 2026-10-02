import React, { useState, useRef, useEffect } from 'react';
import { sounds } from '../utils/audio';

interface Screen2MagicProps {
  onUnlockBirthday: () => void;
}

export const Screen2Magic: React.FC<Screen2MagicProps> = ({ onUnlockBirthday }) => {
  const [tapCount, setTapCount] = useState<number>(0);
  const [isShaking, setIsShaking] = useState<boolean>(false);
  const [isBursting, setIsBursting] = useState<boolean>(false);
  const [transitioning, setTransitioning] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Tiny particle bursts on tap
  const spawnBurst = (x: number, y: number, count: number = 25, isBig: boolean = false) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const colors = ['#FFD6E5', '#FFB6D5', '#F8C8DC', '#FFF4F8', '#E8C882'];
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      color: string;
    }> = [];

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = isBig ? Math.random() * 8 + 3 : Math.random() * 4 + 1.5;
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * (isBig ? 6 : 3) + 2,
        alpha: 1,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    let raf: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha *= 0.93;
        if (p.alpha > 0.05) alive = true;

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.restore();
      });

      if (alive) {
        raf = requestAnimationFrame(animate);
      }
    };

    animate();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const onResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const handleNoClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (tapCount >= 4 || isBursting) return;

    const nextCount = tapCount + 1;
    setTapCount(nextCount);

    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    if (nextCount === 1) {
      sounds.playNoTap(1);
      spawnBurst(centerX, centerY, 18, false);
    } else if (nextCount === 2) {
      sounds.playNoTap(2);
      spawnBurst(centerX, centerY, 28, false);
    } else if (nextCount === 3) {
      sounds.playNoTap(3);
      setIsShaking(true);
      spawnBurst(centerX, centerY, 38, false);
      setTimeout(() => setIsShaking(false), 500);
    } else if (nextCount === 4) {
      // Tap 4: Soft, premium celebratory chime effect to enhance the 'unlocked' experience
      sounds.playCelebratoryUnlockChime();
      setIsBursting(true);
      spawnBurst(centerX, centerY, 90, true);

      // Transition to Screen 3
      setTimeout(() => {
        setTransitioning(true);
      }, 700);

      setTimeout(() => {
        sounds.startBackgroundMusic();
        sounds.playCelebrationChime();
        onUnlockBirthday();
      }, 1600);
    }
  };

  // Button sizing scale based on exact tap count
  const getButtonScaleClasses = () => {
    switch (tapCount) {
      case 0:
        return 'scale-100 py-3.5 px-8 text-base';
      case 1:
        return 'scale-110 py-3.5 px-9 text-lg';
      case 2:
        return 'scale-125 py-4 px-10 text-xl';
      case 3:
        return 'scale-145 py-4.5 px-11 text-2xl font-bold';
      case 4:
        return 'scale-165 sm:scale-185 py-5 px-12 sm:px-14 text-2xl sm:text-3xl font-extrabold animate-pulse';
      default:
        return 'scale-100';
    }
  };

  return (
    <div
      className={`fixed inset-0 w-full h-[100dvh] flex flex-col items-center justify-center p-4 sm:p-6 text-center select-none overflow-hidden transition-all duration-1000 ${
        transitioning
          ? 'bg-[#180814] filter blur-md opacity-0 scale-95'
          : 'bg-[#0c080d] filter blur-0 opacity-100 scale-100'
      }`}
    >
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-30" />

      {/* Center expanding pink glow aura */}
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none rounded-full transition-all duration-1000 ease-out ${
          isBursting ? 'scale-[6] opacity-90' : 'scale-100 opacity-30'
        }`}
        style={{
          width: '320px',
          height: '320px',
          background: 'radial-gradient(circle, rgba(255, 182, 213, 0.6) 0%, rgba(248, 200, 220, 0.2) 50%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center w-full px-2">
        {/* Playful prompt tag */}
        <span className="text-[11px] sm:text-xs uppercase tracking-[0.28em] text-[#FFB6D5]/80 font-medium mb-3 sm:mb-4">
          One Simple Question
        </span>

        {/* Question: "Do you like to see a little magic?" */}
        <h2 className="text-2.5xl min-[360px]:text-3xl sm:text-5xl md:text-6xl font-serif font-normal text-[#FFF4F8] tracking-tight leading-snug mb-6 sm:mb-10 drop-shadow-[0_2px_20px_rgba(255,182,213,0.3)]">
          Do you like to see a little magic?
        </h2>

        {/* Dynamic sub-message for Taps 2 and 3 */}
        <div className="h-8 mb-4 sm:mb-6 flex items-center justify-center">
          {tapCount === 2 && (
            <p className="text-sm sm:text-base font-serif italic text-[#FFB6D5] animate-fadeIn">
              Are you sure?
            </p>
          )}
          {tapCount === 3 && (
            <p className="text-base sm:text-lg font-serif italic text-[#FFF4F8] animate-bounce">
              Really?
            </p>
          )}
          {tapCount === 4 && (
            <p className="text-base sm:text-lg font-serif italic text-[#FFD6E5] animate-pulse">
              Unlocking something special...
            </p>
          )}
        </div>

        {/* ONE Growing "NO" Button */}
        <div className="relative min-h-[130px] sm:min-h-[150px] flex items-center justify-center w-full">
          <button
            onClick={handleNoClick}
            data-interactive="true"
            className={`transform origin-center transition-all duration-300 ease-out rounded-2xl glass-panel-elevated font-serif tracking-wider text-[#FFF4F8] hover:text-white cursor-pointer select-none touch-manipulation ${getButtonScaleClasses()} ${
              isShaking ? 'animate-[shake_0.4s_ease-in-out_infinite]' : ''
            } ${
              isBursting
                ? 'shadow-[0_0_60px_rgba(255,182,213,0.9)] bg-gradient-to-r from-[#FFD6E5] to-[#FFB6D5] text-[#0c080d]'
                : 'shadow-[0_10px_35px_rgba(255,182,213,0.25)] hover:shadow-[0_12px_45px_rgba(255,182,213,0.45)]'
            }`}
            style={{
              maxWidth: '82vw',
            }}
          >
            NO
          </button>
        </div>

        <p className="mt-6 sm:mt-8 text-xs text-[#FFD6E5]/40 tracking-wider">
          Tap the button to test your decision
        </p>
      </div>
    </div>
  );
};
