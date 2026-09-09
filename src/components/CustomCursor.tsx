import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { isReducedMotion } from '../utils/motion';

export const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Disable on touch devices and reduced motion
    if (typeof window === 'undefined') return;
    const isTouch = !window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (isTouch || isReducedMotion()) return;

    const cursorEl = cursorRef.current;
    const ringEl = ringRef.current;
    const dotEl = dotRef.current;
    if (!cursorEl || !ringEl || !dotEl) return;

    // Enable custom cursor CSS rule
    document.documentElement.classList.add('custom-cursor-active');

    // High performance GSAP quickTo setters
    const setDotX = gsap.quickTo(dotEl, 'x', { duration: 0.08, ease: 'power2.out' });
    const setDotY = gsap.quickTo(dotEl, 'y', { duration: 0.08, ease: 'power2.out' });
    const setRingX = gsap.quickTo(ringEl, 'x', { duration: 0.22, ease: 'power2.out' });
    const setRingY = gsap.quickTo(ringEl, 'y', { duration: 0.22, ease: 'power2.out' });

    let isHoveringInteractive = false;
    let isMouseDown = false;
    let isOverInput = false;

    // Center offset helpers (dot = 4px, ring = 32px)
    const handlePointerMove = (e: PointerEvent) => {
      setDotX(e.clientX - 2);
      setDotY(e.clientY - 2);
      setRingX(e.clientX - 16);
      setRingY(e.clientY - 16);
    };

    const updateCursorState = () => {
      if (isOverInput) {
        gsap.to(cursorEl, { opacity: 0, duration: 0.15, overwrite: 'auto' });
        return;
      }

      gsap.to(cursorEl, { opacity: 1, duration: 0.15, overwrite: 'auto' });

      if (isHoveringInteractive) {
        const targetScale = isMouseDown ? 1.35 : 1.7;
        gsap.to(ringEl, {
          scale: targetScale,
          borderColor: '#7df4ff',
          backgroundColor: 'rgba(0, 240, 255, 0.08)',
          boxShadow: '0 0 16px rgba(0, 240, 255, 0.4)',
          duration: 0.2,
          overwrite: 'auto'
        });
        gsap.to(dotEl, {
          scale: 1.3,
          backgroundColor: '#00f0ff',
          duration: 0.2,
          overwrite: 'auto'
        });
      } else {
        const targetScale = isMouseDown ? 0.85 : 1;
        gsap.to(ringEl, {
          scale: targetScale,
          borderColor: 'rgba(0, 240, 255, 0.45)',
          backgroundColor: 'transparent',
          boxShadow: '0 0 6px rgba(0, 240, 255, 0.15)',
          duration: 0.25,
          overwrite: 'auto'
        });
        gsap.to(dotEl, {
          scale: 1,
          backgroundColor: '#00f0ff',
          duration: 0.25,
          overwrite: 'auto'
        });
      }
    };

    // Delegated hover detection
    const handlePointerOver = (e: PointerEvent) => {
      const target = e.target as Element | null;
      if (!target) return;

      const textInput = target.closest('input:not([type="button"]):not([type="submit"]):not([type="reset"]):not([type="checkbox"]):not([type="radio"]), textarea');
      const interactive = target.closest('button, a, select, [role="button"], .spotlight-card, label, [data-cursor="interactive"]');

      isOverInput = Boolean(textInput);
      isHoveringInteractive = Boolean(interactive) && !isOverInput;

      updateCursorState();
    };

    const handlePointerDown = () => {
      isMouseDown = true;
      updateCursorState();
    };

    const handlePointerUp = () => {
      isMouseDown = false;
      updateCursorState();
    };

    const handleMouseLeave = () => {
      gsap.to(cursorEl, { opacity: 0, duration: 0.2, overwrite: 'auto' });
    };

    const handleMouseEnter = () => {
      if (!isOverInput) {
        gsap.to(cursorEl, { opacity: 1, duration: 0.2, overwrite: 'auto' });
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    window.addEventListener('pointerup', handlePointerUp, { passive: true });
    document.addEventListener('pointerover', handlePointerOver, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      document.documentElement.classList.remove('custom-cursor-active');
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      document.removeEventListener('pointerover', handlePointerOver);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      gsap.killTweensOf([cursorEl, ringEl, dotEl]);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden opacity-0 select-none"
    >
      {/* Outer Tactical Reticle Ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-cyan-400/45 shadow-[0_0_8px_rgba(0,240,255,0.2)] flex items-center justify-center pointer-events-none will-change-transform"
      >
        {/* Subtle Crosshair Reticle Ticks */}
        <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-[1px] h-1 bg-cyan-400/70"></span>
        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-[1px] h-1 bg-cyan-400/70"></span>
        <span className="absolute top-1/2 -left-1 -translate-y-1/2 h-[1px] w-1 bg-cyan-400/70"></span>
        <span className="absolute top-1/2 -right-1 -translate-y-1/2 h-[1px] w-1 bg-cyan-400/70"></span>
      </div>

      {/* Inner Precision Sonar Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-1 h-1 rounded-full bg-primary-container shadow-[0_0_6px_rgba(0,240,255,1)] pointer-events-none will-change-transform"
      ></div>
    </div>
  );
};
