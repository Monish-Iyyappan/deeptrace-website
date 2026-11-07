import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './index.css';
import { Header } from './components/Header';
import { HomeAuthSection } from './components/HomeAuthSection';
import { StickyStepper } from './components/StickyStepper';
import { VerticalNavRail } from './components/VerticalNavRail';
import { HeroSection } from './components/HeroSection';
import { PipelineStageCard } from './components/PipelineStageCard';
import { TeamSection } from './components/TeamSection';
import { Footer } from './components/Footer';
import { ImagePopup } from './components/ImagePopup';
import { CustomCursor } from './components/CustomCursor';
import { PIPELINE_STAGES, TEAM_MEMBERS, MISSION_METRICS } from './data/pipelineData';
import { LightboxImage } from './types';
import { Skiper90Button } from './components/ui/Skiper90';
import { Skiper84 } from './components/ui/Skiper84';
import { Skiper19 } from './components/ui/Skiper19';
import {
  initSmoothScroll,
  scrollToTarget,
  attachMagneticEffect,
  attachSpotlight,
  isReducedMotion
} from './utils/motion';

gsap.registerPlugin(ScrollTrigger);

const SESSION_STORAGE_KEY = 'deeptrace_auth_member_id';

export const App: React.FC = () => {
  const [hasEntered, setHasEntered] = useState<boolean>(false);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [lightboxImage, setLightboxImage] = useState<LightboxImage | null>(null);
  const [signedInMemberId, setSignedInMemberId] = useState<string | null>(null);

  const pipelineSectionRef = useRef<HTMLElement>(null);
  const deploymentCtaRef = useRef<HTMLDivElement>(null);
  const ctaCloneBtnRef = useRef<HTMLAnchorElement>(null);

  // Initialize Lenis Kinetic Smooth Scroll
  useEffect(() => {
    const cleanupScroll = initSmoothScroll();
    return () => cleanupScroll();
  }, []);

  // Ensure all member statuses start as UNACTIVE on website load/entry and clear on exit
  useEffect(() => {
    try {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
    } catch {}

    const handleBeforeUnload = () => {
      try {
        sessionStorage.removeItem(SESSION_STORAGE_KEY);
      } catch {}
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const handleSignIn = (memberId: string) => {
    setSignedInMemberId(memberId);
  };

  const handleSignOut = () => {
    setSignedInMemberId(null);
  };

  // Update active step index based on scroll position
  useEffect(() => {
    if (!hasEntered) return;

    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight / 3;
      let currentIndex = 0;

      PIPELINE_STAGES.forEach((stage, index) => {
        const element = document.getElementById(stage.id);
        if (element && element.offsetTop <= scrollPos) {
          currentIndex = index;
        }
      });

      setActiveStepIndex(currentIndex);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [hasEntered]);

  // Deployment CTA card enhancements (spotlight + Skiper17 rotation entrance + hover alignment + magnetic clone button)
  useEffect(() => {
    if (!hasEntered || !deploymentCtaRef.current) return;

    const ctaEl = deploymentCtaRef.current;
    const initialRot = -1.5;

    const cleanupSpotlight = attachSpotlight(ctaEl);
    const cleanupMagnetic = attachMagneticEffect(ctaCloneBtnRef.current, 0.2);

    // Initial resting rotation
    gsap.set(ctaEl, { rotation: initialRot, transformOrigin: 'center center' });

    // Hover listeners to align to 0deg and return to initialRot
    const handleMouseEnter = () => {
      gsap.to(ctaEl, {
        rotation: 0,
        scale: 1.015,
        duration: 0.35,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    };

    const handleMouseLeave = () => {
      gsap.to(ctaEl, {
        rotation: initialRot,
        scale: 1,
        duration: 0.45,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    };

    ctaEl.addEventListener('mouseenter', handleMouseEnter);
    ctaEl.addEventListener('mouseleave', handleMouseLeave);

    let trigger: ScrollTrigger | null = null;
    if (!isReducedMotion()) {
      const anim = gsap.fromTo(
        ctaEl,
        {
          opacity: 0,
          y: 45,
          rotation: -4.5,
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
            trigger: ctaEl,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
      trigger = anim.scrollTrigger || null;
    }

    return () => {
      cleanupSpotlight();
      cleanupMagnetic();
      ctaEl.removeEventListener('mouseenter', handleMouseEnter);
      ctaEl.removeEventListener('mouseleave', handleMouseLeave);
      if (trigger) trigger.kill();
    };
  }, [hasEntered]);

  const signedInMember = TEAM_MEMBERS.find((m) => m.id === signedInMemberId) || null;

  // PAGE 1: SEPARATE HOME / AUTHENTICATION PAGE
  if (!hasEntered) {
    return (
      <div className="bg-background font-body-md text-on-surface min-h-screen relative overflow-x-hidden selection:bg-primary-container selection:text-on-primary-fixed flex flex-col justify-center">
        {/* Ambient Radial and Grid Backgrounds */}
        <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,240,255,0.06)_0%,transparent_60%)]"></div>
        <div className="pointer-events-none fixed inset-0 z-0 opacity-20 bg-[linear-gradient(to_right,rgba(0,240,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,240,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px]"></div>
        <Skiper84 />

        {/* Top Left HUD Telemetry Tag */}
        <div className="fixed top-space-xs left-space-md z-40 hidden lg:flex items-center gap-space-xs font-label-sm text-label-sm text-on-surface-variant font-mono">
          <span className="text-primary-container">+</span>
          <span>LAT: 44°07'12"N</span>
          <span className="text-outline-variant">|</span>
          <span>LON: 12°02'28"W</span>
          <span className="text-outline-variant">|</span>
          <span>DEPTH: -3840M</span>
        </div>

        {/* Top Right HUD Telemetry Tag */}
        <div className="fixed top-space-xs right-space-md z-40 hidden lg:flex items-center gap-space-xs font-label-sm text-label-sm text-on-surface-variant font-mono">
          <span>ACOUSTIC SIG: 842.19 kHz</span>
          <span className="text-outline-variant">|</span>
          <span className="text-primary-container">[ SYS // GATEWAY ]</span>
          <span className="text-primary-container">+</span>
        </div>

        {/* The Standalone Home Page: Logo on Center-Left & Login Box on Center-Right */}
        <HomeAuthSection
          teamMembers={TEAM_MEMBERS}
          signedInMemberId={signedInMemberId}
          onSignIn={(memberId) => {
            handleSignIn(memberId);
            setHasEntered(true);
          }}
          onSignOut={handleSignOut}
          onEnterAsGuest={() => {
            handleSignOut();
            setHasEntered(true);
          }}
        />

        {/* Tactical HUD Custom Cursor */}
        <CustomCursor />
      </div>
    );
  }

  // PAGE 2: SEPARATE MAIN WEB APPLICATION
  return (
    <div className="bg-background font-body-md text-on-surface min-h-screen relative overflow-x-hidden selection:bg-primary-container selection:text-on-primary-fixed">
      {/* Ambient Radial and Grid Backgrounds */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,240,255,0.06)_0%,transparent_60%)]"></div>
      <div className="pointer-events-none fixed inset-0 z-0 opacity-20 bg-[linear-gradient(to_right,rgba(0,240,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,240,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px]"></div>
      <Skiper84 />

      {/* Top Left HUD Telemetry Tag */}
      <div className="fixed top-space-xs left-space-md z-40 hidden lg:flex items-center gap-space-xs font-label-sm text-label-sm text-on-surface-variant font-mono">
        <span className="text-primary-container">+</span>
        <span>LAT: 44°07'12"N</span>
        <span className="text-outline-variant">|</span>
        <span>LON: 12°02'28"W</span>
        <span className="text-outline-variant">|</span>
        <span>DEPTH: -3840M</span>
      </div>

      {/* Top Right HUD Telemetry Tag */}
      <div className="fixed top-space-xs right-space-md z-40 hidden lg:flex items-center gap-space-xs font-label-sm text-label-sm text-on-surface-variant font-mono">
        <span>ACOUSTIC SIG: 842.19 kHz</span>
        <span className="text-outline-variant">|</span>
        <span className="text-primary-container">[ TIER-1 CLEARANCE // ALL ACCESS ]</span>
        <span className="text-primary-container">+</span>
      </div>

      {/* Main Top Header with Return to Home Support */}
      <Header
        signedInMember={signedInMember}
        onNavClick={(targetId) => scrollToTarget(targetId)}
        onReturnHome={() => setHasEntered(false)}
      />

      {/* Skiper19 Cybernetic Sonar Scout Fish — Swims from Logo to the End of the Page */}
      <Skiper19 />

      <main className="w-full pt-20 bg-surface relative z-10">
        <div className="flex flex-col w-full">
          
          {/* Sticky Horizontal HUD Stepper with edge fade masks */}
          <StickyStepper
            activeStepIndex={activeStepIndex}
            stages={PIPELINE_STAGES}
            onStepClick={(stepId) => scrollToTarget(stepId)}
          />

          {/* Fixed Right-Side Vertical Step Navigation Rail */}
          <VerticalNavRail
            activeStepIndex={activeStepIndex}
            stages={PIPELINE_STAGES}
            onStepClick={(stepId) => scrollToTarget(stepId)}
          />

          {/* Hero Section */}
          <HeroSection
            metrics={MISSION_METRICS}
            onAccessDemoClick={() => scrollToTarget('deployment-cta')}
            onExploreClick={() => scrollToTarget('step-01')}
            onImageClick={(img) => setLightboxImage(img)}
          />

          {/* 11 Pipeline Stages */}
          <section
            ref={pipelineSectionRef}
            className="relative w-full px-margin-desktop py-space-xl max-w-7xl mx-auto space-y-space-4xl"
          >
            {PIPELINE_STAGES.map((stage, index) => {
              const nextStage = PIPELINE_STAGES[index + 1];
              return (
                <PipelineStageCard
                  key={stage.id}
                  nextStageId={nextStage ? nextStage.id : 'deployment-cta'}
                  stage={stage}
                  onImageClick={(img) => setLightboxImage(img)}
                />
              );
            })}
          </section>

          {/* Deployment CTA Section */}
          <section
            className="w-full px-margin-desktop py-space-4xl max-w-7xl mx-auto scroll-mt-28"
            id="deployment-cta"
          >
            <div
              ref={deploymentCtaRef}
              className="relative rounded-2xl bg-surface-container-high/90 p-space-2xl md:p-space-4xl shadow-[0_0_30px_rgba(0,0,0,0.6)] hover:shadow-[0_0_30px_rgba(0,240,255,0.2)] hover:border-cyan-400/60 transition-[border-color,box-shadow] duration-300 overflow-hidden flex flex-col items-center text-center border border-cyan-500/35 spotlight-card backdrop-blur-md will-change-transform"
            >
              <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-primary-container/10 rounded-full blur-3xl pointer-events-none"></div>

              <div className="w-16 h-16 rounded-xl bg-surface-container flex items-center justify-center mb-space-md shadow-md border border-cyan-500/30">
                <img
                  alt="DeepTrace Marine AI"
                  className="w-10 h-10 object-contain drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDpKXmgUVTLV03yXP8EFOlr29WnunJ-Rpb_39t8jbqsSfSQi9Rts5C9Vp1X-GoVKcXLVZqfOE8IKWQ0Tq4z0SWhafTE499gOBGVfsBZCLDIubJosddwNjxSBvWB3VKf02zbWhIeCHn2drAIbK9UUMVSu52vXa52KcfamDPATPIcWe9eA4ghwfbUKzU6EVsmJAtD2qNgyxXsPEQmtAFs2-J2aCGdrQBlQO6vt3QoRePO0SF5qp8OJLMOTV3Mffe66XXSbQ"
                />
              </div>

              <span className="font-label-sm text-label-sm text-primary-container uppercase tracking-widest mb-space-xs font-mono">
                OPEN ACCESS MARINE CONSERVATION ARCHITECTURE
              </span>

              <h2 className="font-headline-xl text-headline-xl text-primary uppercase max-w-2xl mb-space-md font-orbitron">
                Deploy DeepTrace to Your Sub-Sea Fleet
              </h2>

              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mb-space-2xl leading-relaxed">
                Access our neural weights, side-scan dataset augmentations, and
                Dockerized TensorRT inference containers on GitHub.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-space-md">
                <Skiper90Button
                  ref={ctaCloneBtnRef}
                  variant="primary"
                  href="https://github.com/Monish-Iyyappan/sonar-deeptrace-demo.git"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <span className="material-symbols-outlined text-base">code</span>
                  <span>CLONE GITHUB REPOSITORY</span>
                </Skiper90Button>
                <Skiper90Button
                  variant="secondary"
                  href="#step-01"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToTarget('step-01');
                  }}
                >
                  <span className="material-symbols-outlined text-base text-primary-container">radar</span>
                  <span>EXPLORE PIPELINE</span>
                </Skiper90Button>
              </div>

              <div className="mt-space-2xl pt-space-md border-t border-outline-variant/20 w-full flex flex-col md:flex-row items-center justify-between text-on-surface-variant font-label-sm text-label-sm gap-space-xs font-mono text-[10px]">
                <span>DEEPTRACE // v2.4-STABLE</span>
                <span>
                  LAT: 36°48'N | LON: 122°01'W | MONTEREY MARINE SANCTUARY
                </span>
                <span>NOAA GGGI GLOBAL INITIATIVE</span>
              </div>
            </div>
          </section>

          {/* Team Clearance Section */}
          <TeamSection
            signedInMemberId={signedInMemberId}
            teamMembers={TEAM_MEMBERS}
            onOpenSignInModal={() => setHasEntered(false)}
          />
        </div>
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Reusable Floating Image Popup */}
      <ImagePopup
        image={lightboxImage}
        onClose={() => setLightboxImage(null)}
      />

      {/* Tactical HUD Custom Cursor */}
      <CustomCursor />
    </div>
  );
};

export default App;
