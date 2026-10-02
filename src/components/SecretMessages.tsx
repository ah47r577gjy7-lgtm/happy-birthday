import React, { useState, useEffect, useRef } from 'react';
import { Mail, Sparkles, X, Heart, Feather } from 'lucide-react';
import { sounds } from '../utils/audio';

interface SecretCardData {
  id: string;
  tag: string;
  previewTitle: string;
  previewSubtitle: string;
  message: string;
  author: string;
  accent: string;
}

interface SecretMessagesProps {
  personName: string;
}

export const SecretMessages: React.FC<SecretMessagesProps> = ({ personName }) => {
  const [activeCard, setActiveCard] = useState<SecretCardData | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);
  const particleCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const secretCards: SecretCardData[] = [
    {
      id: 'msg-1',
      tag: 'Cherished Memory',
      previewTitle: 'The Quiet Constancy',
      previewSubtitle: 'A note on how you bring peace without even trying.',
      message: `Dearest ${personName},\n\nIn a world that is often loud and moving too fast, you possess an unspoken grace that grounds everything around you. Your laughter isn't just joyous—it is reassuring. Thank you for simply being the constant light in so many lives.`,
      author: 'With all our affection',
      accent: '#FFB6D5',
    },
    {
      id: 'msg-2',
      tag: 'A Birthday Promise',
      previewTitle: 'A Year of Radiance',
      previewSubtitle: 'A gentle vow for the chapters waiting ahead.',
      message: `May this coming year unfurl with boundless kindness for you. May your dreams find courage, your days be filled with quiet wonder, and whenever you doubt yourself, may you remember how deeply you are celebrated today and every day.`,
      author: 'Holding you close',
      accent: '#F8C8DC',
    },
    {
      id: 'msg-3',
      tag: 'From The Heart',
      previewTitle: 'The Art of Being You',
      previewSubtitle: 'A tiny celebration of your rare sincerity.',
      message: `What makes you so truly exceptional is never something practiced or posed; it is your instinctive generosity, the way your eyes light up when someone speaks of their passions, and your relentless warmth. Never let the world change that gentle spirit.`,
      author: 'Forever grateful',
      accent: '#FFD6E5',
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Glowing particles floating around the open message
  useEffect(() => {
    if (!activeCard) return;
    const canvas = particleCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      color: string;
    }> = [];

    const colors = ['#FFD6E5', '#FFB6D5', '#F8C8DC', '#E8C882', '#FFF4F8'];

    for (let i = 0; i < 40; i++) {
      particles.push({
        x: width / 2 + (Math.random() - 0.5) * 450,
        y: height / 2 + (Math.random() - 0.5) * 400,
        vx: (Math.random() - 0.5) * 0.8,
        vy: -(Math.random() * 0.5 + 0.2),
        size: Math.random() * 3 + 1.5,
        alpha: Math.random() * 0.6 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    let rafId: number;
    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.y < height / 2 - 250) p.y = height / 2 + 250;
        if (p.x < width / 2 - 250) p.x = width / 2 + 250;
        if (p.x > width / 2 + 250) p.x = width / 2 - 250;

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.restore();
      });

      rafId = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(rafId);
  }, [activeCard]);

  const handleOpenCard = (card: SecretCardData) => {
    sounds.playArpeggio();
    setActiveCard(card);
    setIsClosing(false);
  };

  const handleCloseCard = () => {
    sounds.playSoftClick();
    setIsClosing(true);
    setTimeout(() => {
      setActiveCard(null);
      setIsClosing(false);
    }, 450);
  };

  return (
    <section id="messages" ref={sectionRef} className="py-28 px-6 sm:px-10 relative">
      <div className="max-w-6xl mx-auto">
        {/* Section Title */}
        <div
          className={`text-center max-w-2xl mx-auto mb-16 transition-all duration-1000 ${
            isInView ? 'opacity-100 translate-y-0 filter blur-0' : 'opacity-0 translate-y-8 filter blur-sm'
          }`}
        >
          <div className="flex items-center justify-center gap-2 mb-3 text-xs uppercase tracking-[0.25em] text-[#FFB6D5]">
            <Heart className="w-3.5 h-3.5 fill-[#FFB6D5]/40" />
            <span>Unspoken Letters</span>
            <span aria-hidden="true">·</span>
            <span>Made to be Opened</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-normal text-[#FFF4F8] tracking-tight">
            Secret Keepsake Notes
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#F8C8DC]/80 font-light">
            Click any letter to reveal what rests inside the folded envelopes.
          </p>
        </div>

        {/* 3 Interactive "Open Me" Glass Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {secretCards.map((card, idx) => (
            <div
              key={card.id}
              className="perspective-1000"
              style={{
                transition: 'all 0.9s cubic-bezier(0.16, 1, 0.3, 1)',
                transitionDelay: `${idx * 160}ms`,
                opacity: isInView ? 1 : 0,
                transform: isInView ? 'translateY(0) scale(1)' : 'translateY(35px) scale(0.96)',
                filter: isInView ? 'blur(0px)' : 'blur(8px)',
              }}
            >
              <div
                onClick={() => handleOpenCard(card)}
                data-interactive="true"
                className="group relative rounded-3xl p-8 glass-panel text-left cursor-pointer select-none transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-[0_20px_45px_rgba(255,182,213,0.25)] hover:border-[#FFD6E5]/40"
              >
                {/* Envelope Seal / Icon */}
                <div className="w-12 h-12 rounded-2xl glass-pill flex items-center justify-center text-[#FFB6D5] mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                  <Mail className="w-5 h-5 text-[#FFB6D5]" />
                </div>

                <div className="text-xs uppercase tracking-widest text-[#FFD6E5]/70 font-medium mb-2">
                  {card.tag}
                </div>

                <h3 className="text-2xl font-serif text-[#FFF4F8] mb-2 group-hover:text-[#FFD6E5] transition-colors">
                  {card.previewTitle}
                </h3>

                <p className="text-sm text-[#F8C8DC]/80 font-light leading-relaxed mb-6">
                  {card.previewSubtitle}
                </p>

                {/* Open Me Button */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <span className="text-xs font-semibold text-[#FFB6D5] tracking-wider uppercase flex items-center gap-1.5 group-hover:text-white transition-colors">
                    <span>Open Note</span>
                    <Sparkles className="w-3.5 h-3.5" />
                  </span>
                  <span className="text-xs text-[#FFD6E5]/50 group-hover:translate-x-1 transition-transform">
                    Read 3D →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3D Secret Message Reveal Modal */}
      {activeCard && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/85 backdrop-blur-2xl transition-opacity duration-500 ${
            isClosing ? 'opacity-0' : 'opacity-100'
          }`}
          onClick={handleCloseCard}
        >
          {/* Canvas for floating glowing particles */}
          <canvas ref={particleCanvasRef} className="absolute inset-0 pointer-events-none" />

          {/* Glowing Aura behind modal */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none rounded-full"
            style={{
              width: '550px',
              height: '550px',
              background: 'radial-gradient(circle, rgba(255, 182, 213, 0.4) 0%, rgba(248, 200, 220, 0.15) 50%, transparent 70%)',
              filter: 'blur(70px)',
            }}
          />

          {/* 3D Rotating & Lifting Glass Letter Container */}
          <div
            className="relative max-w-xl w-full glass-panel-elevated rounded-3xl p-8 sm:p-12 text-left overflow-hidden transform-style-3d cursor-default"
            style={{
              animation: isClosing
                ? 'closeLetter 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards'
                : 'openLetter 0.65s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={handleCloseCard}
              data-interactive="true"
              className="absolute top-6 right-6 p-2 rounded-full glass-panel hover:bg-white/20 text-[#FFF4F8] transition-colors cursor-pointer"
              aria-label="Close message"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header info */}
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#FFB6D5] mb-4 font-medium">
              <Feather className="w-4 h-4 text-[#FFB6D5]" />
              <span>{activeCard.tag}</span>
              <span aria-hidden="true">·</span>
              <span>Personal Dedication</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-serif text-[#FFF4F8] mb-6">
              {activeCard.previewTitle}
            </h3>

            {/* Full Message Body */}
            <div className="text-base sm:text-lg text-[#F8C8DC]/95 font-serif italic leading-relaxed whitespace-pre-line mb-8">
              {activeCard.message}
            </div>

            {/* Signature row */}
            <div className="flex items-center justify-between pt-6 border-t border-white/10">
              <div className="flex items-center gap-2 text-sm text-[#FFD6E5]">
                <Heart className="w-4 h-4 fill-[#FFB6D5] text-[#FFB6D5]" />
                <span className="font-serif italic">{activeCard.author}</span>
              </div>
              <button
                onClick={handleCloseCard}
                data-interactive="true"
                className="px-5 py-2 rounded-full text-xs font-medium text-[#FFF4F8] glass-pill hover:bg-white/10 transition-all cursor-pointer"
              >
                Close & Return
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
