import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';
import { LightboxImage } from '../../types';

export interface Skiper48Slide {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  coordinates: string;
  status: string;
}

interface Skiper48Props {
  slides: Skiper48Slide[];
  onSlideClick?: (image: LightboxImage) => void;
  className?: string;
}

export const Skiper48: React.FC<Skiper48Props> = ({
  slides,
  onSlideClick,
  className
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const activeSlide = slides[currentIndex];

  const handleImageClick = (e: React.MouseEvent<HTMLElement>, slide: Skiper48Slide) => {
    if (onSlideClick) {
      const rect = e.currentTarget.getBoundingClientRect();
      onSlideClick({
        src: slide.imageUrl,
        alt: slide.title,
        caption: `${slide.title} — ${slide.category} [${slide.coordinates}]`,
        anchorRect: rect
      });
    }
  };

  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ rotate: -1.8, scale: 0.98 }}
      whileInView={{ rotate: -1.5, scale: 1, opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      animate={{
        rotate: isHovered ? 0 : -1.5,
        scale: isHovered ? 1.015 : 1
      }}
      transition={{
        type: 'spring',
        stiffness: 350,
        damping: 25,
        mass: 0.7
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        'relative w-full max-w-4xl mx-auto my-space-xl p-4 rounded-2xl bg-[#08121c]/90 border border-cyan-500/30 hover:border-cyan-400/60 backdrop-blur-md shadow-[0_0_30px_rgba(0,0,0,0.7)] hover:shadow-[0_0_35px_rgba(0,240,255,0.25)] transition-[border-color,box-shadow] duration-300 will-change-transform transform-gpu',
        className
      )}
    >
      {/* HUD Header Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20 font-mono text-xs text-on-surface-variant">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-primary-container font-bold font-orbitron uppercase tracking-wider text-[11px]">
            TACTICAL MISSION STRIP // LIVE FEED
          </span>
        </div>
        <div className="flex items-center gap-3 text-[10px]">
          <span className="text-cyan-300">
            FRAME [{currentIndex + 1}/{slides.length}]
          </span>
          <span className="text-outline-variant">|</span>
          <span className="text-secondary-fixed">{activeSlide.coordinates}</span>
        </div>
      </div>

      {/* Main Slide Carousel Area */}
      <div className="relative w-full h-64 sm:h-80 md:h-96 my-3 rounded-xl overflow-hidden bg-[#050b12] border border-cyan-500/20">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlide.id}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.04 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            onClick={(e) => handleImageClick(e, activeSlide)}
            className="relative w-full h-full cursor-pointer group"
          >
            <img
              src={activeSlide.imageUrl}
              alt={activeSlide.title}
              className="w-full h-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
            />
            {/* Ambient vignette and scanlines */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#060c14] via-transparent to-black/30 pointer-events-none" />
            <div className="absolute inset-0 hud-scanline-overlay pointer-events-none" />

            {/* Corner Reticles */}
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-[#080f18]/85 border border-cyan-400/40 text-[10px] font-mono text-primary-container shadow-md">
              {activeSlide.category}
            </div>

            <div className="absolute top-3 right-3 px-2.5 py-1 rounded bg-cyan-500/20 border border-cyan-400/40 text-[10px] font-mono text-cyan-200 font-bold">
              {activeSlide.status}
            </div>

            {/* Bottom Caption Overlay */}
            <div className="absolute bottom-3 left-3 right-3 p-3 rounded-lg bg-[#080f18]/90 border border-cyan-500/30 flex items-center justify-between backdrop-blur-sm">
              <div>
                <h4 className="text-sm font-bold text-primary font-orbitron uppercase">
                  {activeSlide.title}
                </h4>
                <p className="text-[11px] text-on-surface-variant font-mono">
                  ACOUSTIC TARGET MATRIX &bull; CLICK TO ENLARGE
                </p>
              </div>
              <span className="material-symbols-outlined text-primary-container text-lg group-hover:scale-110 transition-transform">
                zoom_in
              </span>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Tactical Arrow Controls */}
        <button
          onClick={handlePrev}
          aria-label="Previous slide"
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-lg bg-[#080f18]/80 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/40 flex items-center justify-center transition-all cursor-pointer shadow-md"
        >
          <span className="material-symbols-outlined text-base">chevron_left</span>
        </button>

        <button
          onClick={handleNext}
          aria-label="Next slide"
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-lg bg-[#080f18]/80 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/40 flex items-center justify-center transition-all cursor-pointer shadow-md"
        >
          <span className="material-symbols-outlined text-base">chevron_right</span>
        </button>
      </div>

      {/* Pagination Dot Strip */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-1.5">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={cn(
                'h-1.5 rounded-full transition-all duration-300 cursor-pointer',
                idx === currentIndex
                  ? 'w-6 bg-cyan-400 shadow-[0_0_8px_#00F0FF]'
                  : 'w-2 bg-surface-variant hover:bg-cyan-500/50'
              )}
            />
          ))}
        </div>

        <div className="text-[10px] font-mono text-outline">
          DRAG OR CLICK ARROWS TO SCAN ARCHIVE
        </div>
      </div>
    </motion.div>
  );
};
