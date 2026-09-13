import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface Skiper71Props {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  loading?: 'lazy' | 'eager';
  children?: React.ReactNode;
}

export const Skiper71: React.FC<Skiper71Props> = ({
  src,
  alt,
  className,
  imageClassName,
  loading = 'lazy',
  children
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div
      className={cn(
        'relative w-full h-full overflow-hidden group bg-[#060c14] flex items-center justify-center',
        className
      )}
    >
      {/* High-Resolution Optical Sonar Image - Always Guaranteed Visible */}
      {!hasError ? (
        <img
          src={src}
          alt={alt}
          loading={loading}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={cn(
            'w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 block relative z-0',
            isLoaded ? 'filter-none' : 'filter brightness-90',
            imageClassName
          )}
        />
      ) : (
        /* Tactical Acoustic Sonar Fallback Canvas if URL fails */
        <div className="w-full h-full flex flex-col items-center justify-center bg-[#07111c] text-cyan-400 p-4 font-mono select-none">
          <span className="material-symbols-outlined text-4xl mb-2 animate-pulse text-cyan-300">
            radar
          </span>
          <span className="text-xs font-bold font-orbitron uppercase tracking-wider text-primary">
            ACOUSTIC SPECTROGRAM
          </span>
          <span className="text-[10px] text-cyan-200/70 mt-1">
            455 kHz DUAL-BEAM CHIRP ACTIVE
          </span>
        </div>
      )}

      {/* Shutter Wipe Curtain - Reveals from left to right on initial view */}
      <motion.div
        initial={{ x: '0%' }}
        whileInView={{ x: '105%' }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-none absolute inset-0 z-10 bg-[#08121d] flex items-center justify-end"
      >
        {/* Leading Cyan Optical Laser Beam */}
        <div className="w-1.5 h-full bg-cyan-300 shadow-[0_0_16px_#00F0FF]" />
      </motion.div>

      {/* Persistent Vignette and HUD Scanline Texture */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-[#060c14]/80 via-transparent to-transparent" />
      <div className="pointer-events-none absolute inset-0 z-10 hud-scanline-overlay opacity-80" />

      {/* Viewfinder Tactical Corner Reticles */}
      <div className="pointer-events-none absolute top-2 left-2 w-3.5 h-3.5 border-t-2 border-l-2 border-cyan-400 z-20 transition-colors group-hover:border-cyan-200 shadow-[0_0_6px_rgba(0,240,255,0.4)]" />
      <div className="pointer-events-none absolute top-2 right-2 w-3.5 h-3.5 border-t-2 border-r-2 border-cyan-400 z-20 transition-colors group-hover:border-cyan-200 shadow-[0_0_6px_rgba(0,240,255,0.4)]" />
      <div className="pointer-events-none absolute bottom-2 left-2 w-3.5 h-3.5 border-b-2 border-l-2 border-cyan-400 z-20 transition-colors group-hover:border-cyan-200 shadow-[0_0_6px_rgba(0,240,255,0.4)]" />
      <div className="pointer-events-none absolute bottom-2 right-2 w-3.5 h-3.5 border-b-2 border-r-2 border-cyan-400 z-20 transition-colors group-hover:border-cyan-200 shadow-[0_0_6px_rgba(0,240,255,0.4)]" />

      {/* Telemetry Tags / Badges */}
      <div className="relative z-20 w-full h-full pointer-events-none">
        {children}
      </div>
    </div>
  );
};
