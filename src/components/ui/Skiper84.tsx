import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface Skiper84Props {
  className?: string;
}

export const Skiper84: React.FC<Skiper84Props> = ({ className }) => {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'pointer-events-none fixed inset-0 z-0 overflow-hidden select-none',
        className
      )}
    >
      {/* Dynamic Bathymetric Sonar Concentric Rings */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-25">
        <div className="absolute inset-0 rounded-full border border-cyan-500/20 animate-[ping_12s_cubic-bezier(0,0,0.2,1)_infinite]" />
        <div className="absolute inset-16 rounded-full border border-cyan-400/15 animate-[ping_16s_cubic-bezier(0,0,0.2,1)_infinite_2s]" />
        <div className="absolute inset-32 rounded-full border border-cyan-300/10 animate-[ping_20s_cubic-bezier(0,0,0.2,1)_infinite_4s]" />
      </div>

      {/* Floating Deep Oceanic Glow Orbs */}
      <motion.div
        animate={{
          x: [0, 40, -30, 0],
          y: [0, -30, 20, 0],
          scale: [1, 1.15, 0.95, 1],
          opacity: [0.15, 0.25, 0.18, 0.15]
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        className="absolute -top-32 left-1/4 w-[500px] h-[500px] rounded-full bg-cyan-500/20 blur-[120px]"
      />

      <motion.div
        animate={{
          x: [0, -50, 30, 0],
          y: [0, 40, -20, 0],
          scale: [1, 0.9, 1.1, 1],
          opacity: [0.1, 0.2, 0.12, 0.1]
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2
        }}
        className="absolute top-2/3 -right-24 w-[600px] h-[600px] rounded-full bg-teal-500/15 blur-[140px]"
      />

      {/* Tactical Dot Matrix Sonar Grid Overlay */}
      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#00F0FF_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)]" />

      {/* Subtle Horizontal Sonar Beam Wave */}
      <div className="absolute inset-x-0 h-40 top-1/3 bg-gradient-to-b from-transparent via-cyan-400/[0.03] to-transparent pointer-events-none -skew-y-3" />
    </div>
  );
};
