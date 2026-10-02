import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Maximize2, X, Heart, Calendar, MapPin } from 'lucide-react';
import { sounds } from '../utils/audio';
import stargazeImg from '../assets/images/birthday_memory_stargaze_1790957287633.jpg';
import sunsetImg from '../assets/images/birthday_memory_sunset_1790957300280.jpg';
import heroPortrait from '../assets/images/birthday_hero_portrait_1790957273166.jpg';

interface PhotoItem {
  id: string;
  img: string;
  title: string;
  caption: string;
  date: string;
  location: string;
  aspect: string;
  animationType: 'blur-focus' | 'slide-rotate' | 'floating-glass';
}

export const PhotoGallery: React.FC = () => {
  const [activePhoto, setActivePhoto] = useState<PhotoItem | null>(null);
  const [tappedId, setTappedId] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isInView, setIsInView] = useState(false);

  const photos: PhotoItem[] = [
    {
      id: 'p1',
      img: stargazeImg,
      title: 'Starlight Whispers',
      caption: 'The night the sky echoed with laughter and unending conversations beneath the fairy lights.',
      date: 'Late August Twilight',
      location: 'The Garden Veranda',
      aspect: 'aspect-[4/3]',
      animationType: 'blur-focus',
    },
    {
      id: 'p2',
      img: sunsetImg,
      title: 'Golden Horizon',
      caption: 'When sparklers chased the dusky blush clouds into the shimmering evening tide.',
      date: 'Midsummer Solstice',
      location: 'Seaside Sanctuary',
      aspect: 'aspect-[4/3]',
      animationType: 'slide-rotate',
    },
    {
      id: 'p3',
      img: heroPortrait,
      title: 'Ethereal Grace',
      caption: 'A quiet pause in time, reflecting the calm warmth you effortlessly bring to every room.',
      date: 'A Cherished Afternoon',
      location: 'Rose Pavilion',
      aspect: 'aspect-[3/4]',
      animationType: 'floating-glass',
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

  return (
    <section id="memories" ref={sectionRef} className="py-28 px-6 sm:px-10 relative">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div
          className={`text-center max-w-2xl mx-auto mb-16 transition-all duration-1000 ${
            isInView ? 'opacity-100 translate-y-0 filter blur-0' : 'opacity-0 translate-y-8 filter blur-sm'
          }`}
        >
          <div className="flex items-center justify-center gap-2 mb-3 text-xs uppercase tracking-[0.25em] text-[#FFB6D5]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Timeless Snapshots</span>
            <span aria-hidden="true">·</span>
            <span>A Life in Radiance</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-normal text-[#FFF4F8] tracking-tight">
            Memories in Motion
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#F8C8DC]/80 font-light">
            Each frame captured with gentle emotion, holding the warmth of moments that never truly fade.
          </p>
        </div>

        {/* Gallery Grid with Staggered Entrance and 3D Tilt */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {photos.map((item, idx) => {
            const isTapped = tappedId === item.id;
            return (
              <div
                key={item.id}
                className="perspective-1000"
                style={{
                  transition: 'all 0.9s cubic-bezier(0.16, 1, 0.3, 1)',
                  transitionDelay: `${idx * 180}ms`,
                  opacity: isInView ? 1 : 0,
                  transform: isInView
                    ? 'translateY(0) scale(1)'
                    : item.animationType === 'slide-rotate'
                    ? 'translateY(40px) rotate(2deg) scale(0.95)'
                    : 'translateY(35px) scale(0.94)',
                  filter: isInView ? 'blur(0px)' : 'blur(10px)',
                }}
              >
                <PhotoCard
                  item={item}
                  isTapped={isTapped}
                  onTap={() => {
                    sounds.playSoftClick();
                    setTappedId(isTapped ? null : item.id);
                  }}
                  onOpenLightbox={() => {
                    sounds.playArpeggio();
                    setActivePhoto(item);
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {activePhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/85 backdrop-blur-xl animate-fadeIn"
          onClick={() => setActivePhoto(null)}
        >
          <div
            className="relative max-w-4xl w-full glass-panel-elevated rounded-3xl p-4 sm:p-6 overflow-hidden flex flex-col md:flex-row gap-6 items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActivePhoto(null)}
              className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-[#FFF4F8] transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative w-full md:w-3/5 overflow-hidden rounded-2xl bg-black">
              <img
                src={activePhoto.img}
                alt={activePhoto.title}
                referrerPolicy="no-referrer"
                className="w-full h-auto max-h-[75vh] object-contain mx-auto"
              />
            </div>

            <div className="w-full md:w-2/5 flex flex-col justify-center text-left p-2 sm:p-4">
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#FFB6D5] mb-2 font-medium">
                <Heart className="w-3.5 h-3.5 fill-[#FFB6D5]" />
                <span>Memory Fragment</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-serif text-[#FFF4F8] mb-3">
                {activePhoto.title}
              </h3>
              <p className="text-sm text-[#F8C8DC]/90 leading-relaxed font-light mb-6">
                {activePhoto.caption}
              </p>
              <div className="text-xs text-[#FFD6E5]/70 space-y-1 pt-4 border-t border-white/10">
                <p className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-[#FFB6D5]" />
                  <span>{activePhoto.date}</span>
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#FFB6D5]" />
                  <span>{activePhoto.location}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

interface PhotoCardProps {
  item: PhotoItem;
  isTapped: boolean;
  onTap: () => void;
  onOpenLightbox: () => void;
}

const PhotoCard: React.FC<PhotoCardProps> = ({ item, isTapped, onTap, onOpenLightbox }) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setTilt({
      x: (y / rect.height) * -10,
      y: (x / rect.width) * 10,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const active = isHovered || isTapped;

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onTap}
      data-interactive="true"
      className="group relative rounded-3xl p-3 glass-panel transform-style-3d cursor-pointer select-none transition-all duration-300 ease-out"
      style={{
        transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) ${active ? 'scale(1.035)' : 'scale(1)'}`,
        boxShadow: active
          ? '0 25px 60px -10px rgba(0, 0, 0, 0.7), 0 0 35px rgba(255, 182, 213, 0.35)'
          : '0 15px 40px -10px rgba(0, 0, 0, 0.5), 0 0 15px rgba(255, 182, 213, 0.08)',
      }}
    >
      <div className={`relative ${item.aspect} w-full overflow-hidden rounded-2xl bg-[#1a0f19]`}>
        <img
          src={item.img}
          alt={item.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out"
          style={{
            transform: active ? 'scale(1.08)' : 'scale(1.0)',
          }}
        />

        {/* Soft reflection sheen */}
        <div
          className={`absolute inset-0 pointer-events-none transition-opacity duration-700 bg-gradient-to-tr from-transparent via-white/15 to-transparent ${
            active ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Gradient scrim for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />

        {/* Top action: Expand button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenLightbox();
          }}
          className="absolute top-3 right-3 p-2 rounded-full glass-panel text-white/90 hover:text-white hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
          aria-label="View photo in lightbox"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>

        {/* Caption revealed smoothly on hover / mobile tap */}
        <div
          className={`absolute bottom-0 inset-x-0 p-5 transition-all duration-500 ease-out text-left ${
            active ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-90'
          }`}
        >
          <h3 className="text-lg font-serif font-medium text-[#FFF4F8] leading-tight drop-shadow-sm">
            {item.title}
          </h3>
          <p
            className={`text-xs text-[#F8C8DC]/90 font-light mt-1.5 transition-all duration-300 line-clamp-2 ${
              active ? 'opacity-100 max-h-16' : 'opacity-70 max-h-8'
            }`}
          >
            {item.caption}
          </p>
          <div className="mt-2.5 flex items-center justify-between text-[11px] text-[#FFD6E5]/60">
            <span>{item.date}</span>
            <span className="text-[#FFB6D5]">Tap to view details</span>
          </div>
        </div>
      </div>
    </div>
  );
};
