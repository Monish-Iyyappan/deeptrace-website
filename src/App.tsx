import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './index.css';
import { Header } from './components/Header';
import { StickyStepper } from './components/StickyStepper';
import { VerticalNavRail } from './components/VerticalNavRail';
import { HeroSection } from './components/HeroSection';
import { PipelineStageCard } from './components/PipelineStageCard';
import { TeamSection } from './components/TeamSection';
import { Footer } from './components/Footer';
import { ImagePopup } from './components/ImagePopup';
import { MemberSignInModal } from './components/MemberSignInModal';
import { CustomCursor } from './components/CustomCursor';
import { PIPELINE_STAGES, TEAM_MEMBERS, MISSION_METRICS } from './data/pipelineData';
import { LightboxImage } from './types';
import {
  initSmoothScroll,
  scrollToTarget,
  attachMagneticEffect,
  attachSpotlight,
  attachCardTilt,
  isReducedMotion
} from './utils/motion';

gsap.registerPlugin(ScrollTrigger);

const SESSION_STORAGE_KEY = 'deeptrace_auth_member_id';

export const App: React.FC = () => {
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [lightboxImage, setLightboxImage] = useState<LightboxImage | null>(null);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState<boolean>(false);
  const [signedInMemberId, setSignedInMemberId] = useState<string | null>(null);

  const deploymentCtaRef = useRef<HTMLDivElement>(null);
  const ctaCloneBtnRef = useRef<HTMLAnchorElement>(null);

  // Initialize Lenis Kinetic Smooth Scroll
  useEffect(() => {
    const cleanupScroll = initSmoothScroll();
    return () => cleanupScroll();
  }, []);

  // Restore authenticated member session from sessionStorage on load
  useEffect(() => {
    try {
      const savedMemberId = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (savedMemberId && TEAM_MEMBERS.some((m) => m.id === savedMemberId)) {
        setSignedInMemberId(savedMemberId);
      }
    } catch {
      // Ignore sessionStorage security/quota errors
    }
  }, []);

  const handleSignIn = (memberId: string) => {
    setSignedInMemberId(memberId);
    try {
      sessionStorage.setItem(SESSION_STORAGE_KEY, memberId);
    } catch {
      // Ignore sessionStorage errors
    }
  };

  const handleSignOut = () => {
    setSignedInMemberId(null);
    try {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
    } catch {
      // Ignore sessionStorage errors
    }
  };

  // Update active step index based on scroll position
  useEffect(() => {
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
  }, []);

  // Deployment CTA card enhancements (spotlight + 3D tilt + magnetic clone button + ScrollTrigger reveal)
  useEffect(() => {
    const cleanupSpotlight = attachSpotlight(deploymentCtaRef.current);
    const cleanupTilt = attachCardTilt(deploymentCtaRef.current, 4);
    const cleanupMagnetic = attachMagneticEffect(ctaCloneBtnRef.current, 0.2);

    let trigger: ScrollTrigger | null = null;
    if (!isReducedMotion() && deploymentCtaRef.current) {
      const anim = gsap.fromTo(
        deploymentCtaRef.current,
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: deploymentCtaRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
      trigger = anim.scrollTrigger || null;
    }

    return () => {
      cleanupSpotlight();
      cleanupTilt();
      cleanupMagnetic();
      if (trigger) trigger.kill();
    };
  }, []);

  const signedInMember = TEAM_MEMBERS.find((m) => m.id === signedInMemberId) || null;

  return (
    <div className="bg-background font-body-md text-on-surface min-h-screen relative overflow-x-hidden selection:bg-primary-container selection:text-on-primary-fixed">
      {/* Ambient Radial and Grid Backgrounds */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,240,255,0.06)_0%,transparent_60%)]"></div>
      <div className="pointer-events-none fixed inset-0 z-0 opacity-20 bg-[linear-gradient(to_right,rgba(0,240,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,240,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px]"></div>

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
        <span className="text-primary-container">[ SYS // NOMINAL ]</span>
        <span className="text-primary-container">+</span>
      </div>

      {/* Main Top Header */}
      <Header
        signedInMember={signedInMember}
        onNavClick={(targetId) => scrollToTarget(targetId)}
        onOpenSignInModal={() => setIsSignInModalOpen(true)}
      />

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
          <section className="w-full px-margin-desktop py-space-xl max-w-7xl mx-auto space-y-space-4xl">
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
                <a
                  ref={ctaCloneBtnRef}
                  className="px-space-xl py-space-md bg-primary-container text-on-primary-fixed font-label-lg text-label-lg rounded font-bold hover:bg-primary-fixed transition-all shadow-[0_0_20px_rgba(0,240,255,0.4)] flex items-center gap-space-sm font-mono"
                  href="https://github.com/Monish-Iyyappan/sonar-deeptrace-demo.git"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <span className="material-symbols-outlined text-base">code</span>
                  <span>CLONE GITHUB REPOSITORY</span>
                </a>
                <a
                  className="px-space-xl py-space-md bg-surface-container hover:bg-surface-container-highest text-on-surface font-label-lg text-label-lg rounded transition-colors flex items-center gap-space-sm border border-cyan-500/25 cursor-pointer font-mono"
                  href="#step-01"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToTarget('step-01');
                  }}
                >
                  <span className="material-symbols-outlined text-base text-primary-container">radar</span>
                  <span>EXPLORE PIPELINE</span>
                </a>
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

      {/* Member Sign-In Modal */}
      <MemberSignInModal
        isOpen={isSignInModalOpen}
        signedInMemberId={signedInMemberId}
        teamMembers={TEAM_MEMBERS}
        onClose={() => setIsSignInModalOpen(false)}
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
      />

      {/* Tactical HUD Custom Cursor */}
      <CustomCursor />
    </div>
  );
};

export default App;
