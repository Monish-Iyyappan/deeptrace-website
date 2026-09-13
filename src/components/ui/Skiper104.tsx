import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { MissionMetric } from '../../types';

interface Skiper104Props {
  metrics: MissionMetric[];
  className?: string;
}

export const Skiper104: React.FC<Skiper104Props> = ({ metrics, className }) => {
  return (
    <div
      className={cn(
        'relative w-full max-w-4xl mb-space-2xl p-2 rounded-xl bg-[#080f18]/60 backdrop-blur-md border border-cyan-500/20 shadow-[0_0_25px_rgba(0,240,255,0.08)]',
        className
      )}
    >
      {/* Tactical HUD Corner Marks */}
      <div className="pointer-events-none absolute -top-1 -left-1 text-cyan-400 font-mono text-xs select-none">
        +
      </div>
      <div className="pointer-events-none absolute -top-1 -right-1 text-cyan-400 font-mono text-xs select-none">
        +
      </div>
      <div className="pointer-events-none absolute -bottom-1 -left-1 text-cyan-400 font-mono text-xs select-none">
        +
      </div>
      <div className="pointer-events-none absolute -bottom-1 -right-1 text-cyan-400 font-mono text-xs select-none">
        +
      </div>

      {/* Decorative Grid Scanning Beam */}
      <div className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent animate-pulse" />

      {/* Scroll Reveal Grid */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1,
              delayChildren: 0.05
            }
          }
        }}
        className="grid grid-cols-2 md:grid-cols-4 gap-space-md w-full"
      >
        {metrics.map((metric, idx) => (
          <motion.div
            key={idx}
            variants={{
              hidden: { opacity: 0, y: 24, scale: 0.94 },
              visible: {
                opacity: 1,
                y: 0,
                scale: 1,
                transition: {
                  duration: 0.55,
                  ease: [0.16, 1, 0.3, 1]
                }
              }
            }}
            whileHover={{
              y: -4,
              boxShadow: '0 0 20px rgba(0, 240, 255, 0.25)',
              borderColor: 'rgba(0, 240, 255, 0.5)'
            }}
            className="metric-gauge-card relative group p-space-md bg-surface-container-low/90 rounded-lg flex flex-col items-center justify-center shadow-sm border border-cyan-500/20 transition-all duration-300 overflow-hidden"
          >
            {/* Subtle card corner accents */}
            <span className="absolute top-1 left-1 text-[8px] font-mono text-cyan-500/40 select-none">
              ⌜
            </span>
            <span className="absolute top-1 right-1 text-[8px] font-mono text-cyan-500/40 select-none">
              ⌝
            </span>
            <span className="absolute bottom-1 left-1 text-[8px] font-mono text-cyan-500/40 select-none">
              ⌞
            </span>
            <span className="absolute bottom-1 right-1 text-[8px] font-mono text-cyan-500/40 select-none">
              ⌟
            </span>

            {/* Hover cyber glow gradient background */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <span className="relative z-10 font-label-sm text-label-sm text-on-surface-variant font-mono tracking-wider">
              {metric.label}
            </span>
            <span
              className={cn(
                'relative z-10 font-headline-md text-headline-md font-orbitron my-1 drop-shadow-[0_0_8px_rgba(0,240,255,0.4)]',
                metric.highlightColor || 'text-primary-container'
              )}
            >
              {metric.value}
            </span>
            <span className="relative z-10 font-label-sm text-label-sm text-secondary-fixed font-mono">
              {metric.subValue}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};
