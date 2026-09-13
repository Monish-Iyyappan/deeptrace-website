import React, { useEffect, useState } from 'react';
import { motion, useScroll, useSpring, useTransform, useVelocity } from 'framer-motion';
import { cn } from '../../lib/utils';

interface Skiper19Props {
  className?: string;
}

const MILESTONES = [
  { id: 'logo', label: 'LOGO // SYS_INIT', top: 0 },
  { id: 'hero', label: 'RADAR // OPTICAL', top: 10 },
  { id: 'step-01', label: 'HYDROPHONE', top: 22 },
  { id: 'step-04', label: 'YOLOv11x INFERENCE', top: 44 },
  { id: 'step-08', label: 'BATHYMETRY GIS', top: 66 },
  { id: 'deployment-cta', label: 'FLEET DEPLOYMENT', top: 82 },
  { id: 'team-credits', label: 'CREW CLEARANCE', top: 96 }
];

export const Skiper19: React.FC<Skiper19Props> = ({ className }) => {
  const { scrollYProgress } = useScroll();
  const scrollVelocity = useVelocity(scrollYProgress);

  // Smooth hydrodynamic inertia for the swimming fish
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 160,
    damping: 26,
    mass: 0.6,
    restDelta: 0.0005
  });

  const smoothVelocity = useSpring(scrollVelocity, {
    stiffness: 220,
    damping: 30
  });

  // Dynamic pitch tilt: fish pitches downward when scrolling down, levels when stationary
  const fishPitch = useTransform(smoothVelocity, [-2, 0, 2], [-14, 0, 14]);

  // Position along the vertical journey (0% to 100%)
  const trackerY = useTransform(smoothProgress, [0, 1], ['2%', '98%']);

  // Dynamic depth telemetry calculation (from -40M to -4200M)
  const [depthDisplay, setDepthDisplay] = useState('-0040M');
  const [activeMilestone, setActiveMilestone] = useState('SYS_INIT');

  useEffect(() => {
    return smoothProgress.on('change', (v) => {
      const depth = Math.round(40 + v * 4160);
      setDepthDisplay(`-${depth.toString().padStart(4, '0')}M`);

      if (v < 0.12) setActiveMilestone('LOGO // GATEWAY');
      else if (v < 0.25) setActiveMilestone('RADAR // PREVIEW');
      else if (v < 0.5) setActiveMilestone('NEURAL DETECT');
      else if (v < 0.75) setActiveMilestone('SONAR MAPPING');
      else if (v < 0.9) setActiveMilestone('FLEET LAUNCH');
      else setActiveMilestone('CREW CLEARANCE');
    });
  }, [smoothProgress]);

  return (
    <div
      aria-hidden="true"
      className={cn(
        'pointer-events-none fixed left-2 sm:left-4 md:left-7 top-0 bottom-0 w-12 z-40 select-none hidden sm:flex flex-col items-center justify-between',
        className
      )}
    >
      {/* Background Rail Track with Glow */}
      <div className="absolute top-20 bottom-16 w-[2px] bg-cyan-950/40 rounded-full border-x border-cyan-500/10" />

      {/* SVG Path Trace Line with Neon Glow */}
      <svg className="absolute top-20 bottom-16 w-full h-[calc(100vh-144px)] overflow-visible" preserveAspectRatio="none">
        <defs>
          <linearGradient id="fishSonarGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.2" />
            <stop offset="40%" stopColor="#00F0FF" stopOpacity="0.8" />
            <stop offset="90%" stopColor="#00F0FF" stopOpacity="1" />
            <stop offset="100%" stopColor="#7df4ff" stopOpacity="1" />
          </linearGradient>
          <filter id="fishTraceGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Dynamic Stroke Follow Line */}
        <motion.line
          x1="50%"
          y1="0"
          x2="50%"
          y2="100%"
          stroke="url(#fishSonarGradient)"
          strokeWidth="2.5"
          strokeLinecap="round"
          filter="url(#fishTraceGlow)"
          style={{ pathLength: smoothProgress }}
        />
      </svg>

      {/* Waypoint Nodes along the track */}
      {MILESTONES.map((m) => (
        <div
          key={m.id}
          className="absolute -translate-x-1/2 flex items-center justify-center left-1/2"
          style={{ top: `${m.top}%` }}
        >
          <div className="w-2.5 h-2.5 rounded-full bg-[#080f18] border border-cyan-500/50 flex items-center justify-center shadow-[0_0_8px_rgba(0,240,255,0.3)]">
            <div className="w-1 h-1 rounded-full bg-cyan-400" />
          </div>
        </div>
      ))}

      {/* Swimming Cybernetic Sonar Fish Drone */}
      <motion.div
        style={{ top: trackerY, rotate: fishPitch }}
        className="absolute -translate-x-1/2 -translate-y-1/2 z-50 flex items-center left-1/2 origin-center"
      >
        {/* Forward Sonar Acoustic Ping Ring */}
        <div className="absolute left-10 w-8 h-8 rounded-full border border-cyan-400/70 fish-ping-ring pointer-events-none" />

        {/* Trailing Acoustic Bubbles in Fish Wake */}
        <div className="absolute -left-3 top-1 w-1.5 h-1.5 rounded-full bg-cyan-300/80 animate-ping pointer-events-none" />
        <div className="absolute -left-6 top-3 w-1 h-1 rounded-full bg-cyan-400/60 pointer-events-none" />

        {/* Cybernetic Fish Drone SVG Avatar */}
        <div className="relative w-14 h-14 flex items-center justify-center fish-swim-glow group cursor-pointer">
          <svg
            viewBox="0 0 64 48"
            className="w-full h-full overflow-visible drop-shadow-[0_0_12px_rgba(0,240,255,0.85)]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="fishBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#003544" />
                <stop offset="50%" stopColor="#005d6e" />
                <stop offset="100%" stopColor="#00f0ff" />
              </linearGradient>
              <linearGradient id="fishFinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#003844" stopOpacity="0.3" />
              </linearGradient>
            </defs>

            {/* Left Pectoral Fin */}
            <path
              d="M24 18 C16 10, 8 12, 10 17 C12 21, 20 20, 24 18 Z"
              fill="url(#fishFinGrad)"
              stroke="#00f0ff"
              strokeWidth="1.2"
              className="fish-fin-left"
            />

            {/* Right Pectoral Fin */}
            <path
              d="M24 30 C16 38, 8 36, 10 31 C12 27, 20 28, 24 30 Z"
              fill="url(#fishFinGrad)"
              stroke="#00f0ff"
              strokeWidth="1.2"
              className="fish-fin-right"
            />

            {/* Articulated Tail Fin */}
            <g className="fish-tail-animated">
              <path
                d="M16 24 L4 14 C6 20, 2 24, 2 24 C2 24, 6 28, 4 34 L16 24 Z"
                fill="url(#fishFinGrad)"
                stroke="#00f0ff"
                strokeWidth="1.5"
              />
              {/* Tail Propulsion Glow Core */}
              <circle cx="8" cy="24" r="1.5" fill="#7df4ff" />
            </g>

            {/* Main Streamlined Bio-Mechanical Hull */}
            <path
              d="M14 24 C18 16, 36 14, 52 24 C36 34, 18 32, 14 24 Z"
              fill="#06121d"
              stroke="#00f0ff"
              strokeWidth="1.8"
            />

            {/* Dorsal Spine Circuit Lines */}
            <path
              d="M20 24 L48 24"
              stroke="#00f0ff"
              strokeWidth="1.5"
              strokeDasharray="3 2"
            />

            {/* Optical Visor / Sonar Eye */}
            <circle cx="46" cy="24" r="3.5" fill="#00f0ff" className="animate-pulse" />
            <circle cx="46" cy="24" r="1.5" fill="#ffffff" />

            {/* Forward Sonar Emitter Cone */}
            <path
              d="M52 24 L58 20 M52 24 L58 28"
              stroke="#7df4ff"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Live Telemetry Tag Tooltip Beside the Fish */}
        <div className="absolute left-14 whitespace-nowrap flex flex-col gap-0.5 bg-[#050e18]/95 border border-cyan-400/50 px-2.5 py-1 rounded-md shadow-[0_0_16px_rgba(0,240,255,0.35)] backdrop-blur-md">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            <span className="font-orbitron text-[9px] font-bold text-cyan-200 tracking-wider">
              {activeMilestone}
            </span>
          </div>
          <div className="font-mono text-[8px] text-on-surface-variant flex items-center gap-2">
            <span className="text-cyan-400 font-bold">{depthDisplay}</span>
            <span className="text-slate-500">|</span>
            <span>455 kHz</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

