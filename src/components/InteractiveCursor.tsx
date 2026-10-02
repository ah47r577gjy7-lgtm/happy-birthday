import React, { useEffect, useRef, useState } from 'react';

export const InteractiveCursor: React.FC = () => {
  const [enabled, setEnabled] = useState(false);
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);
  const cursorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Check if device supports fine hover (desktop mouse) and no reduced motion
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!hasFinePointer || reducedMotion) {
      setEnabled(false);
      return;
    }

    setEnabled(true);

    let mouseX = -200;
    let mouseY = -200;
    let currentX = -200;
    let currentY = -200;
    let rafId: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Check if target or parent is interactive
      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive = target.closest('button, a, input, textarea, [data-interactive="true"]');
        setIsHoveringInteractive(!!interactive);
      }
    };

    const updateCursor = () => {
      // Smooth linear interpolation (lerp)
      currentX += (mouseX - currentX) * 0.16;
      currentY += (mouseY - currentY) * 0.16;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      }

      rafId = requestAnimationFrame(updateCursor);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    rafId = requestAnimationFrame(updateCursor);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  if (!enabled) return null;

  return (
    <div
      aria-hidden="true"
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-50 mix-blend-screen transition-[width,height,opacity] duration-300 ease-out -translate-x-1/2 -translate-y-1/2"
      style={{
        width: isHoveringInteractive ? '140px' : '90px',
        height: isHoveringInteractive ? '140px' : '90px',
        opacity: isHoveringInteractive ? 0.65 : 0.35,
      }}
    >
      <div
        className="w-full h-full rounded-full"
        style={{
          background: isHoveringInteractive
            ? 'radial-gradient(circle, rgba(255, 182, 213, 0.7) 0%, rgba(248, 200, 220, 0.3) 45%, rgba(255, 214, 229, 0) 70%)'
            : 'radial-gradient(circle, rgba(255, 214, 229, 0.45) 0%, rgba(248, 200, 220, 0.18) 50%, rgba(255, 214, 229, 0) 70%)',
          filter: 'blur(10px)',
        }}
      />
    </div>
  );
};
