import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { MissionMetric, LightboxImage } from '../types';
import { attachMagneticEffect, isReducedMotion, scrollToTarget } from '../utils/motion';

interface HeroSectionProps {
  metrics: MissionMetric[];
  onAccessDemoClick: () => void;
  onExploreClick: () => void;
  onImageClick?: (image: LightboxImage) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  metrics,
  onAccessDemoClick,
  onExploreClick,
  onImageClick
}) => {
  const heroContainerRef = useRef<HTMLDivElement>(null);
  const accessDemoBtnRef = useRef<HTMLButtonElement>(null);
  const metricsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Attach magnetic physics to the main CTA button
    const cleanupMagnetic = attachMagneticEffect(accessDemoBtnRef.current, 0.25);

    // Coordinated staggered entrance for Hero elements if motion allowed
    if (!isReducedMotion() && heroContainerRef.current) {
      const heroItems = heroContainerRef.current.querySelectorAll('.hero-anim-item');
      gsap.fromTo(
        heroItems,
        { opacity: 0, y: 22 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power2.out',
          delay: 0.1
        }
      );

      const metricCards = heroContainerRef.current.querySelectorAll('.metric-gauge-card');
      gsap.fromTo(
        metricCards,
        { opacity: 0, y: 20, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power2.out',
          delay: 0.5
        }
      );
    }

    return () => {
      cleanupMagnetic();
    };
  }, []);

  const handleRadarClick = (e: React.MouseEvent<HTMLElement>) => {
    if (onImageClick) {
      const rect = e.currentTarget.getBoundingClientRect();
      onImageClick({
        src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBtuVvrp7azGHKzzT_AWWsbQSn2_m4yGTQ5PVytno7SLmgK1VxmXg308ORiCXlboWcBGn7S0lcb5k6Z5H2u_BgNCL-mb-B5XeKPU_bI9kt2l1UiGSVSUFbbVks3YJ_ZqarlRPSgrkFsgXLy5pqEdKGWWJnWcp7hW7qVXOtBcELP6FL_Mh9Bpd5S3EUxmCYrr1yKc9AW9ut40qXPiiSPW-Rr_7_3o03tR7Osdhy8aLM8GhEzBqTkl_7NwhxKelGhtnl5LQ',
        alt: 'DeepTrace Marine AI Holographic Sonar Emblem',
        caption: 'Holographic Circular Sonar Radar — 455 kHz Dual-Beam CHIRP Telemetry Display',
        anchorRect: rect
      });
    }
  };

  return (
    <section className="relative w-full px-margin-desktop py-space-3xl overflow-hidden">
      {/* Glow Backdrop */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-primary-container/10 blur-3xl pointer-events-none"></div>

      <div ref={heroContainerRef} className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
        
        {/* Diagnostics Readout Badge */}
        <div className="hero-anim-item flex flex-wrap items-center justify-center gap-space-xs font-label-sm text-label-sm bg-surface-container-low/85 backdrop-blur px-space-md py-space-xs rounded mb-space-xl border border-cyan-500/25 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
          <span className="text-primary-container font-bold font-mono">[SYS_INIT: OK]</span>
          <span className="text-outline-variant">/</span>
          <span className="text-secondary-fixed font-mono">ACOUSTIC: 455 kHz CHIRP</span>
          <span className="text-outline-variant">/</span>
          <span className="text-tertiary-fixed-dim font-mono">NEURAL_ENGINE: YOLOv11x-MARINE</span>
          <span className="text-outline-variant">/</span>
          <span className="text-primary-container font-mono">CONF: 98.4%</span>
        </div>

        {/* Holographic Circular Sonar Radar (Clickable for Optical Preview) */}
        <button
          aria-label="Enlarge DeepTrace Circular Sonar Radar"
          className="hero-anim-item relative flex items-center justify-center mb-space-xl group cursor-pointer focus:outline-none rounded-full"
          title="Click to view optical preview"
          onClick={handleRadarClick}
        >
          {/* Concentric Ambient Glow & Pulse Rings */}
          <div className="absolute w-60 h-60 rounded-full border border-cyan-500/15 pointer-events-none group-hover:border-cyan-400/30 transition-colors"></div>
          <div className="absolute w-52 h-52 rounded-full border border-cyan-400/25 pointer-events-none animate-pulse"></div>
          <div className="absolute w-44 h-44 rounded-full bg-primary-container/10 blur-md pointer-events-none sonar-echo-ring"></div>

          {/* Perfect Circular Radar Display Housing */}
          <div className="relative w-48 h-48 rounded-full p-2 bg-[#091420]/95 border-2 border-cyan-400/60 group-hover:border-cyan-300 shadow-[0_0_35px_rgba(0,240,255,0.35)] group-hover:shadow-[0_0_50px_rgba(0,240,255,0.5)] flex items-center justify-center overflow-hidden transition-all">
            
            {/* Cardinal Direction Ticks (000°, 090°, 180°, 270°) */}
            <span className="absolute top-1 text-[7px] font-mono text-cyan-400/80 font-bold z-20">000°</span>
            <span className="absolute bottom-1 text-[7px] font-mono text-cyan-400/80 font-bold z-20">180°</span>
            <span className="absolute right-1.5 text-[7px] font-mono text-cyan-400/80 font-bold z-20">090°</span>
            <span className="absolute left-1.5 text-[7px] font-mono text-cyan-400/80 font-bold z-20">270°</span>

            {/* Crosshairs (X and Y Axis) with Center Reticle */}
            <div className="absolute inset-x-0 top-1/2 h-[1px] bg-cyan-500/35 pointer-events-none -translate-y-1/2"></div>
            <div className="absolute inset-y-0 left-1/2 w-[1px] bg-cyan-500/35 pointer-events-none -translate-x-1/2"></div>

            {/* Concentric Range Grid Rings with Distance Labels */}
            <div className="absolute w-36 h-36 rounded-full border border-cyan-500/25 pointer-events-none flex items-start justify-center">
              <span className="text-[6px] font-mono text-cyan-400/50 -mt-2">150M</span>
            </div>
            <div className="absolute w-24 h-24 rounded-full border border-cyan-500/35 pointer-events-none flex items-start justify-center">
              <span className="text-[6px] font-mono text-cyan-400/50 -mt-2">100M</span>
            </div>
            <div className="absolute w-12 h-12 rounded-full border border-cyan-400/45 pointer-events-none flex items-start justify-center">
              <span className="text-[6px] font-mono text-cyan-400/50 -mt-2">50M</span>
            </div>

            {/* 360-Degree Circular Radar Sweep Beam Rotating Inside Circle */}
            <div
              className="absolute inset-0 rounded-full radar-sweep-beam pointer-events-none z-10"
              style={{
                background:
                  'conic-gradient(from 0deg, transparent 0deg, transparent 270deg, rgba(0, 240, 255, 0.12) 320deg, rgba(0, 240, 255, 0.55) 360deg)'
              }}
            ></div>

            {/* Center DeepTrace Marine Logo */}
            <img
              alt="DeepTrace Marine AI Mark"
              className="w-20 h-20 object-contain relative z-20 filter drop-shadow-[0_0_14px_rgba(0,240,255,0.6)] group-hover:scale-105 transition-transform"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBtuVvrp7azGHKzzT_AWWsbQSn2_m4yGTQ5PVytno7SLmgK1VxmXg308ORiCXlboWcBGn7S0lcb5k6Z5H2u_BgNCL-mb-B5XeKPU_bI9kt2l1UiGSVSUFbbVks3YJ_ZqarlRPSgrkFsgXLy5pqEdKGWWJnWcp7hW7qVXOtBcELP6FL_Mh9Bpd5S3EUxmCYrr1yKc9AW9ut40qXPiiSPW-Rr_7_3o03tR7Osdhy8aLM8GhEzBqTkl_7NwhxKelGhtnl5LQ"
            />

            {/* Sonar Blips with Pulsing Glow */}
            <div className="absolute top-8 right-10 w-2 h-2 rounded-full bg-primary-container sonar-target-blip z-30 shadow-[0_0_8px_rgba(0,240,255,0.9)]"></div>
            <div
              className="absolute bottom-10 left-10 w-1.5 h-1.5 rounded-full bg-cyan-300 sonar-target-blip z-30 shadow-[0_0_6px_rgba(0,240,255,0.9)]"
              style={{ animationDelay: '1.2s' }}
            ></div>

            {/* Circular CRT Scanline Overlay */}
            <div className="absolute inset-0 rounded-full hud-scanline-overlay pointer-events-none z-30"></div>

            {/* Outer Glowing Circle Rim */}
            <div className="absolute inset-0 rounded-full border border-cyan-400/50 pointer-events-none z-30 shadow-[inset_0_0_12px_rgba(0,240,255,0.2)]"></div>
          </div>
        </button>

        <div className="hero-anim-item inline-flex items-center gap-space-xs font-label-md text-label-md px-space-sm py-space-2xs rounded bg-surface-container-high text-primary-fixed-dim uppercase mb-space-sm border border-cyan-500/25">
          Autonomous Sub-Surface Acoustic Reconnaissance
        </div>

        <h1 className="hero-anim-item font-headline-xl text-headline-xl text-primary mb-space-md tracking-tight uppercase font-orbitron">
          DEEPTRACE // NEURAL SONAR
        </h1>

        <p className="hero-anim-item max-w-3xl font-body-lg text-body-lg text-on-surface-variant mb-space-2xl">
          Autonomous real-time detection, segmentation, and georeferencing of
          abandoned ghost fishing gear and synthetic oceanic debris from
          high-frequency side-scan sonar arrays.
        </p>

        {/* Mission Parameters Banner */}
        <div className="hero-anim-item flex items-center justify-center gap-space-xs mb-space-sm font-label-sm text-label-sm tracking-wider uppercase font-mono">
          <span className="text-primary-container font-bold">[ MISSION PARAMETERS</span>
          <span className="text-outline-variant">//</span>
          <span className="text-secondary-fixed font-bold">PROJECT GOALS</span>
          <span className="text-primary-container font-bold">]</span>
          <div className="hidden md:flex items-center gap-1 text-[10px] text-on-surface-variant font-mono">
            <span className="text-outline-variant">—</span>
            <span className="text-cyan-400">BENCHMARK SPECS</span>
          </div>
        </div>

        {/* Key Telemetry Gauges Grid */}
        <div
          ref={metricsContainerRef}
          className="grid grid-cols-2 md:grid-cols-4 gap-space-md w-full max-w-4xl mb-space-2xl"
        >
          {metrics.map((metric, idx) => (
            <div
              key={idx}
              className="metric-gauge-card p-space-md bg-surface-container-low/90 rounded-lg flex flex-col items-center justify-center shadow-sm border border-cyan-500/15 hover:border-cyan-400/40 hover:shadow-[0_0_16px_rgba(0,240,255,0.12)] transition-all"
            >
              <span className="font-label-sm text-label-sm text-on-surface-variant font-mono">
                {metric.label}
              </span>
              <span
                className={`font-headline-md text-headline-md font-orbitron my-1 ${
                  metric.highlightColor || 'text-primary-container'
                }`}
              >
                {metric.value}
              </span>
              <span className="font-label-sm text-label-sm text-secondary-fixed font-mono">
                {metric.subValue}
              </span>
            </div>
          ))}
        </div>

        {/* Hero CTA Button -> Scrolls to Deployment Section */}
        <button
          ref={accessDemoBtnRef}
          className="mt-4 px-7 py-3 rounded border border-cyan-400/50 bg-cyan-400/15 hover:bg-cyan-400/25 text-cyan-300 font-mono text-xs uppercase tracking-widest transition-all duration-200 flex items-center gap-2.5 shadow-[0_0_20px_rgba(0,240,255,0.2)] group cursor-pointer font-bold"
          onClick={() => {
            if (onAccessDemoClick) {
              onAccessDemoClick();
            } else {
              scrollToTarget('deployment-cta');
            }
          }}
        >
          <span>ACCESS MISSION DEMO</span>
          <svg
            className="w-4 h-4 group-hover:translate-y-0.5 transition-transform text-cyan-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            ></path>
          </svg>
        </button>

        {/* Scroll Target Reticle */}
        <a
          className="flex flex-col items-center gap-space-2xs text-on-surface-variant hover:text-primary-container transition-colors mt-space-xl cursor-pointer"
          href="#step-01"
          onClick={(e) => {
            e.preventDefault();
            if (onExploreClick) {
              onExploreClick();
            } else {
              scrollToTarget('step-01');
            }
          }}
        >
          <span className="font-label-sm text-label-sm tracking-widest uppercase font-mono">
            INITIALIZE TIMELINE SCAN
          </span>
          <span className="material-symbols-outlined text-primary-container animate-bounce">
            expand_more
          </span>
        </a>
      </div>
    </section>
  );
};
