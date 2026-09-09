import React, { useEffect, useRef, useState } from 'react';
import { LightboxImage } from '../types';
import { isReducedMotion } from '../utils/motion';

interface ImagePopupProps {
  image: LightboxImage | null;
  onClose: () => void;
}

export const ImagePopup: React.FC<ImagePopupProps> = ({ image, onClose }) => {
  const popupRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<{ top: number; left: number; width: number } | null>(null);

  useEffect(() => {
    if (!image) {
      setCoords(null);
      return;
    }

    const computePosition = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const popupWidth = Math.min(500, vw - 32);
      const popupHeight = 360;

      let targetLeft = (vw - popupWidth) / 2;
      let targetTop = (vh - popupHeight) / 2;

      if (image.anchorRect) {
        const anchor = image.anchorRect;
        // Center relative to anchor horizontally
        targetLeft = anchor.left + anchor.width / 2 - popupWidth / 2;
        // Center relative to anchor vertically
        targetTop = anchor.top + anchor.height / 2 - popupHeight / 2;

        // Clamp inside viewport
        targetLeft = Math.max(16, Math.min(targetLeft, vw - popupWidth - 16));
        targetTop = Math.max(75, Math.min(targetTop, vh - popupHeight - 20));
      }

      setCoords({ top: targetTop, left: targetLeft, width: popupWidth });
    };

    computePosition();

    // Dismiss on Escape key
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    // Dismiss on outside click (delayed slightly so opening click doesn't immediately dismiss)
    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    const timer = setTimeout(() => {
      window.addEventListener('pointerdown', handlePointerDown);
    }, 10);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('pointerdown', handlePointerDown);
      clearTimeout(timer);
    };
  }, [image, onClose]);

  if (!image || !coords) return null;

  const reducedMotion = isReducedMotion();

  return (
    <div
      ref={popupRef}
      aria-label="Tactical Sonar High-Resolution Preview"
      className={`fixed z-50 bg-[#080f18]/95 backdrop-blur-md rounded-xl border-2 border-cyan-400/60 shadow-[0_0_35px_rgba(0,240,255,0.35)] overflow-hidden cursor-pointer select-none ${
        reducedMotion ? '' : 'transition-all duration-200 ease-out animate-fadeIn'
      }`}
      style={{
        top: `${coords.top}px`,
        left: `${coords.left}px`,
        width: `${coords.width}px`
      }}
      title="Click anywhere on popup to dismiss"
      onClick={onClose}
    >
      {/* HUD Header Bar */}
      <div className="flex items-center justify-between px-3.5 py-2 bg-[#091420] border-b border-cyan-500/30">
        <div className="flex items-center gap-2 font-mono text-[10px] text-primary">
          <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse shadow-[0_0_6px_rgba(0,240,255,0.8)]"></span>
          <span className="font-bold tracking-wider font-orbitron uppercase">
            TELEMETRY OPTICAL PREVIEW
          </span>
        </div>

        <button
          aria-label="Dismiss popup"
          className="w-6 h-6 rounded bg-surface-container hover:bg-cyan-500/20 text-cyan-200 hover:text-white flex items-center justify-center border border-cyan-500/30 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
        >
          <span className="material-symbols-outlined text-sm">close</span>
        </button>
      </div>

      {/* Image Showcase */}
      <div className="relative bg-[#050a10] p-2 flex items-center justify-center overflow-hidden max-h-[280px]">
        <img
          alt={image.alt}
          className="max-w-full max-h-[260px] object-contain rounded border border-cyan-500/20 shadow-lg"
          src={image.src}
        />
        <div className="absolute inset-0 hud-scanline-overlay pointer-events-none opacity-30"></div>
      </div>

      {/* HUD Footer Caption */}
      <div className="px-3.5 py-1.5 bg-[#091420] border-t border-cyan-500/25 flex items-center justify-between font-mono text-[10px] text-on-surface-variant">
        <span className="truncate pr-2 text-cyan-200">
          {image.caption || image.alt}
        </span>
        <span className="text-primary-container shrink-0 text-[9px]">
          [CLICK / ESC TO CLOSE]
        </span>
      </div>
    </div>
  );
};
