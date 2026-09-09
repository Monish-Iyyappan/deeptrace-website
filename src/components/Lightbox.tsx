import React, { useEffect, useRef } from 'react';
import { LightboxImage } from '../types';
import { isReducedMotion } from '../utils/motion';

interface LightboxProps {
  image: LightboxImage | null;
  onClose: () => void;
}

export const Lightbox: React.FC<LightboxProps> = ({ image, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (image) {
      // Save previously focused element to restore upon closing
      previousActiveElementRef.current = document.activeElement as HTMLElement;

      // Focus close button on open
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 50);

      // Prevent background scrolling while modal is open
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          onClose();
        }

        // Focus trap
        if (e.key === 'Tab' && modalRef.current) {
          const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          if (focusableElements.length === 0) return;

          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];

          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              e.preventDefault();
              lastElement.focus();
            }
          } else {
            if (document.activeElement === lastElement) {
              e.preventDefault();
              firstElement.focus();
            }
          }
        }
      };

      window.addEventListener('keydown', handleKeyDown);

      return () => {
        document.body.style.overflow = originalOverflow;
        window.removeEventListener('keydown', handleKeyDown);
        // Restore focus
        if (previousActiveElementRef.current) {
          previousActiveElementRef.current.focus();
        }
      };
    }
  }, [image, onClose]);

  if (!image) return null;

  const reducedMotion = isReducedMotion();

  return (
    <div
      aria-label="Tactical Sonar High-Resolution Lightbox"
      aria-modal="true"
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/85 backdrop-blur-md ${
        reducedMotion ? '' : 'transition-opacity duration-200 animate-fadeIn'
      }`}
      ref={modalRef}
      role="dialog"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      {/* Lightbox Modal Enclosure */}
      <div
        className={`relative max-w-5xl w-full max-h-[90vh] bg-[#080f18] rounded-2xl border border-cyan-400/50 shadow-[0_0_50px_rgba(0,240,255,0.3)] overflow-hidden flex flex-col ${
          reducedMotion ? '' : 'transform transition-transform duration-300 scale-100'
        }`}
      >
        {/* Header HUD Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#091420] border-b border-cyan-500/25">
          <div className="flex items-center gap-2 font-mono text-xs text-primary">
            <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse shadow-[0_0_6px_rgba(0,240,255,0.8)]"></span>
            <span className="font-bold tracking-wider font-orbitron uppercase">
              HIGH-RESOLUTION OPTICAL / ACOUSTIC TELEMETRY
            </span>
          </div>

          <button
            ref={closeButtonRef}
            aria-label="Close image popup"
            className="w-8 h-8 rounded-lg bg-surface-container-high hover:bg-cyan-500/20 text-on-surface hover:text-primary-container border border-cyan-500/30 flex items-center justify-center transition-all cursor-pointer shadow-sm hover:scale-105"
            onClick={onClose}
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Image Display Area */}
        <div className="relative flex-1 bg-[#050a10] overflow-hidden flex items-center justify-center min-h-[300px] max-h-[75vh] p-2 sm:p-4">
          <img
            alt={image.alt}
            className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-2xl border border-cyan-500/20"
            src={image.src}
          />
          <div className="absolute inset-0 hud-scanline-overlay pointer-events-none opacity-40"></div>
        </div>

        {/* Footer Caption & Reticle */}
        <div className="px-5 py-3 bg-[#091420] border-t border-cyan-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 font-mono text-xs text-on-surface-variant">
          <span className="text-cyan-200">
            {image.caption || image.alt}
          </span>
          <div className="flex items-center gap-2 text-[10px] text-primary-container">
            <span>[PRESS ESC TO DISMISS]</span>
          </div>
        </div>
      </div>
    </div>
  );
};
