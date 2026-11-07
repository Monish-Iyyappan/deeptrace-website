import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PipelineStage, LightboxImage } from '../types';
import { attachSpotlight, isReducedMotion, scrollToTarget } from '../utils/motion';
import { Skiper90Card } from './ui/Skiper90';
import { Skiper71 } from './ui/Skiper71';

gsap.registerPlugin(ScrollTrigger);

interface PipelineStageCardProps {
  stage: PipelineStage;
  onImageClick?: (image: LightboxImage) => void;
  nextStageId?: string;
}

export const PipelineStageCard: React.FC<PipelineStageCardProps> = ({
  stage,
  onImageClick,
  nextStageId
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cardEl = cardRef.current;
    if (!cardEl) return;

    const stepNum = parseInt(stage.stepNumber, 10) || 1;
    const stepAngles = [-1.8, 1.8, -1.5, 1.5, -1.8, 1.6, -1.4, 1.8, -1.6, 1.5, -1.5];
    const initialRot = stepAngles[(stepNum - 1) % stepAngles.length];

    // Attach interactive spotlight glow border
    const cleanupSpotlight = attachSpotlight(cardEl);

    // Initial resting rotation
    gsap.set(cardEl, { rotation: initialRot, transformOrigin: 'center center' });

    // Hover listeners to align to 0deg and return to initialRot
    const handleMouseEnter = () => {
      gsap.to(cardEl, {
        rotation: 0,
        scale: 1.015,
        duration: 0.35,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    };

    const handleMouseLeave = () => {
      gsap.to(cardEl, {
        rotation: initialRot,
        scale: 1,
        duration: 0.45,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    };

    cardEl.addEventListener('mouseenter', handleMouseEnter);
    cardEl.addEventListener('mouseleave', handleMouseLeave);

    // GSAP ScrollTrigger reveal with Skiper17 rotational swing
    let trigger: ScrollTrigger | null = null;
    if (!isReducedMotion()) {
      const animation = gsap.fromTo(
        cardEl,
        {
          opacity: 0,
          y: 45,
          rotation: initialRot * 2.2,
          scale: 0.96
        },
        {
          opacity: 1,
          y: 0,
          rotation: initialRot,
          scale: 1,
          duration: 0.85,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: cardEl,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
      trigger = animation.scrollTrigger || null;
    }

    return () => {
      cleanupSpotlight();
      cardEl.removeEventListener('mouseenter', handleMouseEnter);
      cardEl.removeEventListener('mouseleave', handleMouseLeave);
      if (trigger) trigger.kill();
    };
  }, [stage.featured, stage.stepNumber]);

  const handleMediaClick = (e: React.MouseEvent<HTMLElement>) => {
    if (onImageClick) {
      const rect = e.currentTarget.getBoundingClientRect();
      onImageClick({
        src: stage.media.imageUrl,
        alt: stage.media.imageAlt,
        caption: `STEP ${stage.stepNumber} // ${stage.title} — ${stage.category}`,
        anchorRect: rect
      });
    }
  };

  const getStatusBadge = () => {
    return (
      <span className="px-space-sm py-space-2xs rounded bg-cyan-500/15 text-cyan-300 font-bold border border-cyan-400/40 font-mono text-[10px] tracking-wider shadow-[0_0_8px_rgba(0,240,255,0.2)] flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#00F0FF] animate-pulse" />
        <span>ACTIVE // TIER-1 VERIFIED</span>
      </span>
    );
  };

  const getStatusDotColor = () => {
    return 'bg-cyan-400 shadow-[0_0_8px_rgba(0,240,255,0.8)]';
  };

  /* FEATURED FULL-VIEWPORT STAGE TAKEOVER */
  if (stage.featured) {
    return (
      <Skiper90Card
        ref={cardRef}
        className="relative w-full min-h-[90vh] md:min-h-screen rounded-2xl md:rounded-3xl overflow-hidden border border-cyan-500/35 hover:border-cyan-400/60 shadow-[0_0_30px_rgba(0,0,0,0.6)] hover:shadow-[0_0_30px_rgba(0,240,255,0.2)] flex flex-col justify-between p-6 md:p-12 scroll-mt-24 my-8 spotlight-card backdrop-blur-md transition-[border-color,box-shadow] duration-300 will-change-transform"
        id={stage.id}
      >
        {/* Ambient Corner Glow Blob (same as launch box) */}
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-primary-container/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Fullscreen High-Res Background Image with Dark Vignette */}
        <div className="absolute inset-0 z-0 bg-[#060c14]">
          <img
            alt={stage.media.imageAlt}
            className="w-full h-full object-cover opacity-35 filter contrast-125"
            src={stage.media.imageUrl}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080f18] via-[#080f18]/80 to-[#080f18]/90 pointer-events-none"></div>
          <div className="absolute inset-0 hud-scanline-overlay pointer-events-none"></div>
        </div>

        {/* Top HUD Telemetry Bar */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-cyan-500/20 font-mono text-xs">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded bg-primary-container text-on-primary-fixed font-bold text-xs shadow-[0_0_12px_rgba(0,240,255,0.4)]">
              FEATURED PIPELINE STAGE // 01
            </span>
            <span className="text-secondary-fixed font-bold">
              {stage.category}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-cyan-200/80">
              {stage.media.tagTopRight || 'LAT: 36°48\'N 122°01\'W'}
            </span>
            {getStatusBadge()}
          </div>
        </div>

        {/* Center Content & Stage Imagery Showcase */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-auto py-8">
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <span className="font-mono text-xs text-primary-container uppercase tracking-widest font-bold">
                STAGE-01 TAKEOVER // DEEP RECONNAISSANCE
              </span>
              <h2 className="font-headline-xl text-headline-xl md:text-4xl text-primary uppercase font-orbitron tracking-wide leading-tight">
                {stage.title}
              </h2>
            </div>

            <div className="space-y-2 bg-[#091420]/80 backdrop-blur-md p-5 rounded-xl border border-cyan-500/25">
              <h3 className="font-label-md text-label-md text-secondary-fixed uppercase font-mono font-bold tracking-wider">
                WHAT THIS DOES
              </h3>
              <p className="font-body-lg text-body-lg text-on-surface leading-relaxed">
                {stage.whatThisDoes}
              </p>
              <div className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-space-xs pt-1 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-surface-variant inline-block"></span>
                <span>STATUS: QUEUED FOR RELEASE</span>
              </div>
            </div>

            <div className="space-y-2 bg-[#091420]/80 backdrop-blur-md p-5 rounded-xl border border-cyan-500/25">
              <h3 className="font-label-md text-label-md text-secondary-fixed uppercase font-mono font-bold tracking-wider">
                WHAT WE'VE DONE
              </h3>
              <p className="font-body-md text-body-md text-on-surface leading-relaxed">
                {stage.whatWeveDone}
              </p>
              <div className="pt-2 font-mono text-xs text-secondary-fixed">
                <strong>Stack:</strong> <span className="text-cyan-200">{stage.stack}</span>
              </div>
            </div>

            {/* Stage Stats */}
            <div className="flex flex-wrap gap-3 pt-2">
              {stage.stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="px-4 py-2 bg-surface-container-high/90 rounded-lg font-mono text-xs border border-cyan-500/20 text-on-surface flex items-center gap-2"
                >
                  <span className="text-outline-variant">{stat.label}:</span>
                  <span className="font-bold text-primary">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Zoomable Image Card */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <button
              aria-label={`Enlarge image for ${stage.title}`}
              className="relative w-full h-80 sm:h-96 rounded-2xl bg-[#060c14] border-2 border-cyan-400/40 overflow-hidden group cursor-pointer shadow-[0_0_30px_rgba(0,0,0,0.8)] hover:border-cyan-300 transition-all focus:outline-none"
              title="Click to view optical preview"
              onClick={handleMediaClick}
            >
              <Skiper71
                src={stage.media.imageUrl}
                alt={stage.media.imageAlt}
              >
                {stage.media.tagBottomLeft && (
                  <div className="absolute bottom-3 left-3 font-label-sm text-[10px] font-mono text-primary-container bg-[#080f18]/90 border border-cyan-500/35 px-2 py-1 rounded shadow-sm z-10">
                    {stage.media.tagBottomLeft}
                  </div>
                )}
              </Skiper71>
            </button>
            <span className="text-[10px] font-mono text-on-surface-variant pt-2">
              [CLICK SPECTROGRAM FOR OPTICAL PREVIEW]
            </span>
          </div>
        </div>

        {/* Bottom Scroll-Past / Collapse Affordance */}
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-cyan-500/20 font-mono text-xs">
          <div className="text-on-surface-variant">
            {stage.media.bottomMetaLeft || 'SAMPLE RATE: 100 kHz'} &bull; {stage.media.bottomMetaRight || 'PORT/STBD SYNCHRONIZED'}
          </div>

          <button
            className="px-5 py-2.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-primary font-mono text-xs font-bold border border-cyan-400/40 hover:shadow-[0_0_16px_rgba(0,240,255,0.25)] transition-all flex items-center gap-2 cursor-pointer group"
            onClick={() => scrollToTarget(nextStageId || 'step-02')}
          >
            <span>CONTINUE RECONNAISSANCE</span>
            <span className="material-symbols-outlined text-sm group-hover:translate-y-0.5 transition-transform text-primary-container">
              arrow_downward
            </span>
          </button>
        </div>
      </Skiper90Card>
    );
  }

  /* Left/Right Layout (2 Columns inside unified Launch-Box-style Step Card) */
  if (stage.layout === 'left' || stage.layout === 'right') {
    const isImageFirst = stage.layout === 'left';

    const MediaColumn = (
      <div
        className={`lg:col-span-5 bg-[#060c14]/70 border border-cyan-500/20 rounded-xl p-space-md shadow-inner flex flex-col gap-space-sm relative overflow-hidden ${
          !isImageFirst ? 'order-1 lg:order-2' : ''
        }`}
      >
        <div className="flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant">
          <span className="text-primary-container font-mono tracking-wider">
            {stage.media.tagTopLeft || `[STAGE_${stage.stepNumber} // TELEMETRY]`}
          </span>
          <span className="text-cyan-200/60 font-mono text-[10px]">
            {stage.media.tagTopRight || 'ONLINE // ACTIVE'}
          </span>
        </div>

        <button
          aria-label={`Enlarge image for ${stage.title}`}
          className="relative w-full h-72 rounded-lg bg-[#060c14] border border-cyan-500/15 overflow-hidden flex items-center justify-center group cursor-pointer focus:outline-none"
          title="Click to view optical preview"
          onClick={handleMediaClick}
        >
          <Skiper71
            src={stage.media.imageUrl}
            alt={stage.media.imageAlt}
          >
            {stage.media.tagBottomLeft && (
              <div className="absolute bottom-space-sm left-space-sm font-label-sm text-[10px] font-mono text-primary-container bg-[#080f18]/90 border border-cyan-500/35 px-space-xs py-space-2xs rounded shadow-sm z-10">
                {stage.media.tagBottomLeft}
              </div>
            )}

            {stage.media.tagBottomRight && (
              <div className="absolute bottom-space-sm right-space-sm font-label-sm text-[10px] font-mono text-outline bg-[#080f18]/90 border border-cyan-500/35 px-space-xs py-space-2xs rounded shadow-sm z-10">
                {stage.media.tagBottomRight}
              </div>
            )}
          </Skiper71>
        </button>

        <div className="flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant font-mono">
          <span className="text-slate-300 text-[10px]">
            {stage.media.bottomMetaLeft || `SYS // STEP ${stage.stepNumber}`}
          </span>
          <span className="text-primary font-semibold text-[10px]">
            {stage.media.bottomMetaRight || 'SYNCHRONIZED'}
          </span>
        </div>
      </div>
    );

    const InfoColumn = (
      <div
        className={`lg:col-span-7 flex flex-col gap-space-md justify-between ${
          !isImageFirst ? 'order-2 lg:order-1' : ''
        }`}
      >
        <div className="flex items-center gap-space-sm font-label-sm text-label-sm">
          <span className="px-space-sm py-space-2xs rounded bg-surface-container-high text-primary-fixed-dim border border-cyan-500/20 font-mono">
            STEP {stage.stepNumber} // {stage.category}
          </span>
          {getStatusBadge()}
        </div>

        <h2 className="font-headline-lg text-headline-lg text-primary uppercase font-orbitron">
          {stage.title}
        </h2>

        <div className="space-y-space-xs p-4 bg-[#0d1724]/90 rounded-xl border border-cyan-500/20 shadow-inner">
          <h3 className="font-label-md text-label-md text-secondary-fixed uppercase font-mono tracking-wider">
            WHAT THIS DOES
          </h3>
          <p className="font-body-md text-body-md text-slate-300 leading-relaxed">
            {stage.whatThisDoes}
          </p>
          <div className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-space-xs pt-space-2xs font-mono">
            <span
              className={`w-1.5 h-1.5 rounded-full inline-block ${getStatusDotColor()}`}
            ></span>
            <span>STATUS: QUEUED FOR RELEASE</span>
          </div>
        </div>

        <div className="space-y-space-xs p-4 bg-[#0d1724]/90 rounded-xl border border-cyan-500/20 shadow-inner">
          <h3 className="font-label-md text-label-md text-secondary-fixed uppercase font-mono tracking-wider">
            WHAT WE'VE DONE
          </h3>
          <p className="font-body-md text-body-md text-slate-300 leading-relaxed">
            {stage.whatWeveDone}
            <br />
            <strong className="text-secondary-fixed font-mono">Stack:</strong>{' '}
            <span className="font-mono text-cyan-200">{stage.stack}</span>
          </p>
        </div>

        <div className="flex flex-wrap gap-space-xs pt-space-xs">
          {stage.stats.map((stat, idx) => (
            <span
              key={idx}
              className={`px-space-sm py-space-2xs bg-surface-container-high rounded font-label-sm text-label-sm font-mono border border-cyan-500/15 ${
                stat.isPrimary ? 'text-primary border-cyan-400/40 shadow-[0_0_8px_rgba(0,240,255,0.15)]' : 'text-on-surface'
              }`}
            >
              {stat.label}: {stat.value}
            </span>
          ))}
        </div>
      </div>
    );

    return (
      <Skiper90Card
        ref={cardRef}
        className="relative rounded-2xl bg-surface-container-high/90 md:bg-[#091420]/90 backdrop-blur-md border border-cyan-500/35 hover:border-cyan-400/60 p-space-xl md:p-space-2xl shadow-[0_0_30px_rgba(0,0,0,0.6)] hover:shadow-[0_0_30px_rgba(0,240,255,0.2)] transition-[border-color,box-shadow] duration-300 overflow-hidden spotlight-card scroll-mt-36 will-change-transform"
        id={stage.id}
      >
        {/* Ambient Corner Glow Blob (same as launch box) */}
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-primary-container/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-2xl items-center relative z-10">
          {isImageFirst ? (
            <>
              {MediaColumn}
              {InfoColumn}
            </>
          ) : (
            <>
              {InfoColumn}
              {MediaColumn}
            </>
          )}
        </div>
      </Skiper90Card>
    );
  }

  /* Center Layout (What We've Done on Left, Image in Center, What This Does on Right) */
  return (
    <Skiper90Card
      ref={cardRef}
      className="relative rounded-2xl bg-surface-container-high/90 md:bg-[#091420]/90 backdrop-blur-md border border-cyan-500/35 hover:border-cyan-400/60 p-space-xl md:p-space-2xl shadow-[0_0_30px_rgba(0,0,0,0.6)] hover:shadow-[0_0_30px_rgba(0,240,255,0.2)] transition-[border-color,box-shadow] duration-300 flex flex-col gap-space-lg scroll-mt-36 spotlight-card overflow-hidden will-change-transform"
      id={stage.id}
    >
      {/* Ambient Corner Glow Blob (same as launch box) */}
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-primary-container/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 flex flex-col gap-space-lg">
        {/* Top Header Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-sm">
          <div className="flex items-center gap-space-sm font-label-sm text-label-sm">
            <span className="px-space-sm py-space-2xs rounded bg-surface-container-high text-primary-fixed-dim border border-cyan-500/20 font-mono">
              STEP {stage.stepNumber} // {stage.category}
            </span>
            {getStatusBadge()}
          </div>
          <span className="font-label-sm text-label-sm text-cyan-200/60 font-mono text-[10px]">
            {stage.media.tagTopRight || 'DYNAMIC SPECTRAL PROCESSING'}
          </span>
        </div>

        {/* Step Title */}
        <h2 className="font-headline-lg text-headline-lg text-primary uppercase tracking-wide font-orbitron">
          {stage.title}
        </h2>

        {/* 3-Column Triptych Grid: [What We've Done on Left] - [Image in Center] - [What This Does on Right] */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch">
          {/* Left Column: WHAT WE'VE DONE */}
          <div className="space-y-space-xs p-5 bg-[#0d1724]/90 rounded-xl border border-cyan-500/20 shadow-inner flex flex-col justify-between order-1">
            <div>
              <h3 className="font-label-md text-label-md text-secondary-fixed uppercase font-mono tracking-wider mb-2">
                WHAT WE'VE DONE
              </h3>
              <p className="font-body-md text-body-md text-slate-300 leading-relaxed">
                {stage.whatWeveDone}
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-cyan-500/15 font-mono text-xs text-secondary-fixed">
              <strong>Stack:</strong>{' '}
              <span className="font-mono text-cyan-200">{stage.stack}</span>
            </div>
          </div>

          {/* Center Column: IMAGE IN THE MIDDLE */}
          <div className="flex flex-col justify-center order-2">
            <button
              aria-label={`Enlarge image for ${stage.title}`}
              className="relative w-full h-72 lg:h-full min-h-[260px] rounded-xl bg-[#060c14] border border-cyan-500/20 overflow-hidden shadow-inner group cursor-pointer focus:outline-none flex items-center justify-center"
              title="Click to view optical preview"
              onClick={handleMediaClick}
            >
              <Skiper71
                src={stage.media.imageUrl}
                alt={stage.media.imageAlt}
              >
                {stage.media.tagTopRight && (
                  <div className="absolute top-space-sm right-space-sm font-label-sm text-label-sm text-on-primary-fixed bg-primary-container px-space-sm py-space-2xs rounded font-bold shadow-md font-mono z-10 text-[10px]">
                    {stage.media.tagTopRight}
                  </div>
                )}

                {stage.media.tagBottomRight && (
                  <div className="absolute bottom-space-sm right-space-sm font-label-sm text-label-sm text-primary bg-[#080f18]/90 border border-cyan-500/30 px-space-sm py-space-xs rounded shadow-md font-mono text-[10px] z-10">
                    {stage.media.tagBottomRight}
                  </div>
                )}

                {stage.media.tagBottomLeft && (
                  <div className="absolute bottom-space-sm left-space-sm font-label-sm text-label-sm text-primary bg-[#080f18]/90 border border-cyan-500/30 px-space-sm py-space-2xs rounded font-mono text-[10px] z-10">
                    {stage.media.tagBottomLeft}
                  </div>
                )}
              </Skiper71>
            </button>
          </div>

          {/* Right Column: WHAT THIS DOES */}
          <div className="space-y-space-xs p-5 bg-[#0d1724]/90 rounded-xl border border-cyan-500/20 shadow-inner flex flex-col justify-between order-3">
            <div>
              <h3 className="font-label-md text-label-md text-secondary-fixed uppercase font-mono tracking-wider mb-2">
                WHAT THIS DOES
              </h3>
              <p className="font-body-md text-body-md text-slate-300 leading-relaxed">
                {stage.whatThisDoes}
              </p>
            </div>
            <div className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-space-xs pt-3 mt-3 border-t border-cyan-500/15 font-mono">
              <span
                className={`w-1.5 h-1.5 rounded-full inline-block ${getStatusDotColor()}`}
              ></span>
              <span>STATUS: QUEUED FOR RELEASE</span>
            </div>
          </div>
        </div>

        {/* Bottom Stats Badges */}
        <div className="flex flex-wrap items-center justify-between gap-space-sm font-label-sm text-label-sm pt-1">
          {stage.stats.map((stat, idx) => (
            <span
              key={idx}
              className={`font-mono text-[11px] ${
                stat.isPrimary
                  ? 'text-primary-container font-semibold shadow-[0_0_8px_rgba(0,240,255,0.2)]'
                  : 'text-slate-300'
              }`}
            >
              {stat.label}: {stat.value}
            </span>
          ))}
        </div>
      </div>
    </Skiper90Card>
  );
};
