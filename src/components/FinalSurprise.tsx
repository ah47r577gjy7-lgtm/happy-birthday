import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Heart, RotateCcw } from 'lucide-react';
import { sounds } from '../utils/audio';
import surprisePhoto from '../assets/images/birthday_surprise_portrait_1790957312199.jpg';

interface FinalSurpriseProps {
  personName: string;
}

export const FinalSurprise: React.FC<FinalSurpriseProps> = ({ personName }) => {
  const [stage, setStage] = useState<'anticipation' | 'cinematic'>('anticipation');
  const [anticipationStep, setAnticipationStep] = useState<number>(0);
  const [revealPhase, setRevealPhase] = useState<number>(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Anticipation choreography: "Wait..." -> "There's still one more thing." -> "Ready?" -> Button "Reveal it ♡"
  useEffect(() => {
    // Step 0: "Wait..."
    const t1 = setTimeout(() => setAnticipationStep(1), 800);
    // Step 1: "There's still one more thing."
    const t2 = setTimeout(() => setAnticipationStep(2), 2400);
    // Step 2: "Ready?"
    const t3 = setTimeout(() => setAnticipationStep(3), 4200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const handleRevealClick = () => {
    sounds.playArpeggio();
    setStage('cinematic');
    setRevealPhase(1); // Screen fades toward deep blush pink

    // Point expands
    setTimeout(() => {
      setRevealPhase(2);
      sounds.playChime(587.33, 3, 'triangle');
    }, 1200);

    // Final photo appears from glow and slowly zooms in
    setTimeout(() => {
      setRevealPhase(3);
    }, 2400);

    // Floating hearts and soft fireworks appear behind photo
    setTimeout(() => {
      setRevealPhase(4);
      sounds.playCelebrationChord();
    }, 3800);

    // Birthday message fades in: "Happy Birthday, [BIRTHDAY_PERSON] ♡"
    setTimeout(() => {
      setRevealPhase(5);
    }, 5200);

    // Final signature appears: "Made especially for you."
    setTimeout(() => {
      setRevealPhase(6);
      sounds.playChime(880, 4, 'sine');
    }, 6600);
  };

  const handleReset = () => {
    setStage('anticipation');
    setRevealPhase(0);
    setAnticipationStep(3);
  };

  // Canvas floating hearts and gentle fireworks behind photo during cinematic reveal
  useEffect(() => {
    if (stage !== 'cinematic' || revealPhase < 4) return;

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

    const hearts: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      color: string;
    }> = [];

    const sparkColors = ['#FFD6E5', '#FFB6D5', '#F8C8DC', '#FFF4F8', '#E8C882'];

    for (let i = 0; i < 40; i++) {
      hearts.push({
        x: Math.random() * width,
        y: height + Math.random() * 200,
        vx: (Math.random() - 0.5) * 1.2,
        vy: -(Math.random() * 2 + 1),
        size: Math.random() * 8 + 6,
        alpha: Math.random() * 0.7 + 0.3,
        color: sparkColors[Math.floor(Math.random() * sparkColors.length)],
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
      ctx.globalAlpha = alpha;
      ctx.shadowColor = '#FFB6D5';
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.restore();
    };

    let raf: number;
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      hearts.forEach((h) => {
        h.x += h.vx;
        h.y += h.vy;

        if (h.y < -30) {
          h.y = height + 20;
          h.x = Math.random() * width;
        }

        drawHeart(ctx, h.x, h.y, h.size, h.color, h.alpha);
      });

      raf = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(raf);
    };
  }, [stage, revealPhase]);

  return (
    <section id="surprise" className="min-h-screen py-28 px-6 flex items-center justify-center relative overflow-hidden">
      {stage === 'anticipation' ? (
        <div className="max-w-xl w-full mx-auto text-center z-10">
          {/* Step 0 / 1: "Wait..." */}
          <div
            className={`transition-all duration-1000 ${
              anticipationStep >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <p className="text-xl sm:text-2xl font-serif text-[#FFB6D5] italic mb-4">
              Wait...
            </p>
          </div>

          {/* Step 2: "There's still one more thing." */}
          <div
            className={`transition-all duration-1000 delay-300 ${
              anticipationStep >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <h2 className="text-3xl sm:text-5xl font-serif text-[#FFF4F8] tracking-tight mb-6">
              There&apos;s still one more thing.
            </h2>
          </div>

          {/* Step 3: "Ready?" and Button "Reveal it ♡" */}
          <div
            className={`transition-all duration-1000 delay-500 ${
              anticipationStep >= 3 ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95 pointer-events-none'
            }`}
          >
            <p className="text-lg font-light text-[#F8C8DC]/90 mb-8">
              Ready?
            </p>

            <button
              onClick={handleRevealClick}
              data-interactive="true"
              className="group relative inline-flex items-center gap-2 px-10 py-4 rounded-full text-base font-medium text-[#0c080d] bg-gradient-to-r from-[#FFD6E5] via-[#FFB6D5] to-[#F8C8DC] shadow-[0_0_35px_rgba(255,182,213,0.5)] hover:shadow-[0_0_55px_rgba(255,182,213,0.9)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer animate-pulse-subtle"
            >
              <Heart className="w-4 h-4 fill-[#831843] text-[#831843]" />
              <span>Reveal it ♡</span>
            </button>
          </div>
        </div>
      ) : (
        /* Cinematic Fullscreen Reveal */
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 select-none overflow-hidden bg-[#240c19]">
          {/* Background Canvas for fireworks and hearts */}
          <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-10" />

          {/* Screen slowly fades toward deep blush pink */}
          <div
            className={`absolute inset-0 transition-opacity duration-1500 pointer-events-none ${
              revealPhase >= 1 ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              background: 'radial-gradient(ellipse at center, #381227 0%, #200816 70%, #12040d 100%)',
            }}
          />

          {/* Tiny glowing point in center expanding */}
          <div
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none rounded-full transition-all duration-2000 ease-out ${
              revealPhase >= 2 ? 'scale-[20] opacity-80' : 'scale-0 opacity-100'
            }`}
            style={{
              width: '40px',
              height: '40px',
              background: 'radial-gradient(circle, #FFF4F8 0%, #FFB6D5 60%, transparent 100%)',
              filter: 'blur(10px)',
            }}
          />

          {/* Content container */}
          <div className="relative z-20 max-w-2xl w-full flex flex-col items-center text-center">
            {/* Final Photo appears from glow, zooms in slowly with soft aura */}
            <div
              className={`relative mb-8 transition-all duration-2500 ease-out ${
                revealPhase >= 3
                  ? 'opacity-100 scale-100 filter blur-0'
                  : 'opacity-0 scale-75 filter blur-xl'
              }`}
            >
              {/* Soft glow halo around image */}
              <div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, rgba(255, 182, 213, 0.6) 0%, transparent 70%)',
                  transform: 'scale(1.25)',
                  filter: 'blur(30px)',
                }}
              />

              <div className="relative w-56 h-56 sm:w-72 sm:h-72 rounded-full overflow-hidden p-2 glass-panel-elevated border-2 border-[#FFD6E5]/40 shadow-[0_0_60px_rgba(255,182,213,0.4)]">
                <img
                  src={surprisePhoto}
                  alt={`Final surprise celebration for ${personName}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-full transition-transform duration-10000 ease-out"
                  style={{
                    transform: revealPhase >= 3 ? 'scale(1.08)' : 'scale(1)',
                  }}
                />
              </div>
            </div>

            {/* Birthday message fades in */}
            <div
              className={`transition-all duration-1200 ease-out ${
                revealPhase >= 5
                  ? 'opacity-100 translate-y-0 filter blur-0'
                  : 'opacity-0 translate-y-8 filter blur-sm'
              }`}
            >
              <div className="flex items-center justify-center gap-2 mb-3 text-xs uppercase tracking-[0.3em] text-[#FFB6D5]">
                <Sparkles className="w-4 h-4 text-[#E8C882]" />
                <span>The Greatest Gift Is You</span>
                <Sparkles className="w-4 h-4 text-[#E8C882]" />
              </div>

              <h2 className="text-3xl sm:text-5xl md:text-6xl font-serif text-[#FFF4F8] tracking-tight leading-tight mb-3 drop-shadow-[0_2px_20px_rgba(255,182,213,0.5)]">
                Happy Birthday, {personName} ♡
              </h2>
            </div>

            {/* Final signature appears last */}
            <div
              className={`mt-4 transition-all duration-1200 ease-out ${
                revealPhase >= 6
                  ? 'opacity-100 translate-y-0 filter blur-0'
                  : 'opacity-0 translate-y-6 filter blur-sm'
              }`}
            >
              <p className="text-lg sm:text-xl font-serif italic text-[#FFD6E5]/90 mb-8">
                “Made especially for you.”
              </p>

              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={handleReset}
                  data-interactive="true"
                  className="flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold text-[#0c080d] bg-gradient-to-r from-[#FFD6E5] to-[#FFB6D5] hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-lg"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Replay Surprise</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
