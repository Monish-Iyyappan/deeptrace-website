import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TeamMember } from '../types';
import { attachSpotlight, isReducedMotion } from '../utils/motion';
import { Skiper17Card } from './ui/Skiper17';

gsap.registerPlugin(ScrollTrigger);

interface TeamSectionProps {
  teamMembers: TeamMember[];
  signedInMemberId?: string | null;
  onOpenSignInModal?: (memberId?: string) => void;
}

export const TeamSection: React.FC<TeamSectionProps> = ({
  teamMembers,
  signedInMemberId,
  onOpenSignInModal
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Attach spotlight cursor glow to each team card
    const cleanups = cardRefs.current.map((card) => {
      if (card) {
        return attachSpotlight(card);
      }
      return () => {};
    });

    // Staggered reveal for team cards with Skiper17 rotational swing
    let trigger: ScrollTrigger | null = null;
    if (!isReducedMotion() && containerRef.current) {
      const cards = cardRefs.current.filter(Boolean) as HTMLElement[];
      const restAngles = [-4.5, 3.5, -3.5, 3.5, -2.5, 3.5];
      const startAngles = [-9, 8, -8, 8, -7, 8];

      const anim = gsap.fromTo(
        cards,
        {
          opacity: 0,
          y: 45,
          rotation: (i) => startAngles[i % startAngles.length],
          scale: 0.94
        },
        {
          opacity: 1,
          y: 0,
          rotation: (i) => restAngles[i % restAngles.length],
          scale: 1,
          duration: 0.85,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        }
      );
      trigger = anim.scrollTrigger || null;
    }

    return () => {
      cleanups.forEach((c) => c());
      if (trigger) trigger.kill();
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="w-full px-margin-desktop py-space-3xl max-w-7xl mx-auto scroll-mt-28"
      id="team-credits"
    >
      <div className="flex flex-col gap-space-md mb-space-2xl text-center items-center">
        <div className="flex items-center gap-space-xs font-label-sm text-label-sm font-mono">
          <span className="text-primary-container font-bold">
            [MISSION PERSONNEL // CREW CLEARANCE]
          </span>
          <span className="text-outline-variant">/</span>
          <span className="text-on-surface-variant">
            TIER-1 ACCESS
          </span>
        </div>
        <h2 className="font-headline-lg text-headline-lg text-primary uppercase font-orbitron tracking-wide">
          DEEPTRACE ARCHITECTURE TEAM
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl leading-relaxed">
          Select any crew dossier to authenticate and activate mission clearance credentials.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
        {teamMembers.map((member, index) => {
          const isMemberActive = signedInMemberId === member.id;

          return (
            <Skiper17Card
              key={member.id}
              index={index}
              total={teamMembers.length}
              isActive={isMemberActive}
              ref={(el) => (cardRefs.current[index] = el)}
              onClick={() => onOpenSignInModal?.(member.id)}
              className={`border rounded-2xl p-8 py-10 font-mono flex flex-col items-center justify-center gap-5 transition-all duration-300 relative group overflow-hidden spotlight-card cursor-pointer min-h-[170px] ${
                isMemberActive
                  ? 'bg-[#0c1f33]/95 border-cyan-400 shadow-[0_0_30px_rgba(0,240,255,0.35)]'
                  : 'bg-[#091522]/90 hover:bg-[#0c1c2e]/95 border-cyan-500/25 hover:border-cyan-400/70 shadow-[0_0_20px_rgba(0,0,0,0.5)]'
              }`}
            >
              {/* Ambient Card Radial Glow Blob */}
              <div className="absolute -top-12 -right-12 w-36 h-36 bg-primary-container/10 rounded-full blur-2xl pointer-events-none" />

              {/* Team Member Name ONLY */}
              <div className="text-base sm:text-lg md:text-xl font-bold text-slate-100 tracking-wider font-orbitron text-center uppercase group-hover:text-cyan-300 transition-colors">
                {member.name}
              </div>

              {/* Active / Unactive Spot Indicator */}
              <div className="flex items-center justify-center">
                {isMemberActive ? (
                  <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-cyan-500/20 border border-cyan-400 text-cyan-300 font-bold font-mono text-xs shadow-[0_0_12px_rgba(0,240,255,0.5)] animate-pulse">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(0,240,255,1)]" />
                    <span>ACTIVE</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#060e18]/80 border border-slate-700/60 text-slate-400 font-medium font-mono text-xs group-hover:border-cyan-500/40 group-hover:text-slate-300 transition-colors">
                    <span className="w-2 h-2 rounded-full bg-slate-500 group-hover:bg-slate-400 transition-colors" />
                    <span>UNACTIVE</span>
                  </div>
                )}
              </div>
            </Skiper17Card>
          );
        })}
      </div>
    </section>
  );
};

