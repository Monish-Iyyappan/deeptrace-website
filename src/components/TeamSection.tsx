import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TeamMember } from '../types';
import { attachSpotlight, attachCardTilt, isReducedMotion } from '../utils/motion';

gsap.registerPlugin(ScrollTrigger);

interface TeamSectionProps {
  teamMembers: TeamMember[];
  signedInMemberId?: string | null;
}

export const TeamSection: React.FC<TeamSectionProps> = ({
  teamMembers,
  signedInMemberId
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Attach spotlight and 3D tilt to each team card
    const cleanups = cardRefs.current.map((card) => {
      if (card) {
        const cleanupSpotlight = attachSpotlight(card);
        const cleanupTilt = attachCardTilt(card, 5);
        return () => {
          cleanupSpotlight();
          cleanupTilt();
        };
      }
      return () => {};
    });

    // Staggered reveal for team cards
    let trigger: ScrollTrigger | null = null;
    if (!isReducedMotion() && containerRef.current) {
      const cards = cardRefs.current.filter(Boolean) as HTMLElement[];
      const anim = gsap.fromTo(
        cards,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.12,
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

  const getStatusBadge = (member: TeamMember) => {
    // Override badge if this member is signed in
    if (signedInMemberId && member.id === signedInMemberId) {
      return (
        <span className="text-primary-container font-bold font-mono shadow-[0_0_10px_rgba(0,240,255,0.9)] animate-pulse flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-primary-container inline-block"></span>
          <span>ACTIVE</span>
        </span>
      );
    }

    switch (member.status) {
      case 'VERIFIED':
        return <span className="text-primary-container font-bold font-mono shadow-[0_0_6px_rgba(0,240,255,0.6)]">VERIFIED</span>;
      case 'DEPLOYED':
        return <span className="text-tertiary-fixed-dim font-bold font-mono shadow-[0_0_6px_rgba(255,185,82,0.6)]">DEPLOYED</span>;
      case 'ACTIVE':
        return <span className="text-primary-container font-bold font-mono">ACTIVE</span>;
      case 'STANDBY':
        return <span className="text-outline-variant font-bold font-mono">STANDBY</span>;
    }
  };

  return (
    <section
      ref={containerRef}
      className="w-full px-margin-desktop py-space-3xl max-w-7xl mx-auto scroll-mt-28"
      id="team-credits"
    >
      <div className="flex flex-col gap-space-md mb-space-2xl">
        <div className="flex items-center gap-space-sm font-label-sm text-label-sm font-mono">
          <span className="text-primary-container font-bold">
            [MISSION PERSONNEL // CREW &amp; CONTRIBUTORS]
          </span>
          <span className="text-outline-variant">/</span>
          <span className="text-on-surface-variant">
            PROJECT CLEARANCE TIER-1
          </span>
        </div>
        <h2 className="font-headline-lg text-headline-lg text-primary uppercase font-orbitron">
          DEEPTRACE ARCHITECTURE TEAM
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl leading-relaxed">
          Core engineers and spatial intelligence contributors behind the
          acoustic neural pipeline and autonomous payload framework.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamMembers.map((member, index) => {
          const isMemberActive = signedInMemberId === member.id;

          return (
            <div
              key={member.id}
              ref={(el) => (cardRefs.current[index] = el)}
              className={`bg-[#091420]/80 backdrop-blur-md border rounded-xl p-5 font-mono flex flex-col justify-between transition-all duration-300 relative group overflow-hidden spotlight-card ${
                isMemberActive
                  ? 'border-cyan-400 shadow-[0_0_28px_rgba(0,240,255,0.3)] bg-[#0c1c2e]/90'
                  : 'border-cyan-500/20 hover:border-cyan-400/50 hover:shadow-[0_0_24px_rgba(0,240,255,0.18)]'
              }`}
            >
              <div className="space-y-space-sm">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] text-cyan-400 uppercase tracking-widest font-semibold">
                    {member.step} // {member.roleTitle}
                  </div>
                  {isMemberActive && (
                    <span className="text-[9px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-bold">
                      AUTHENTICATED
                    </span>
                  )}
                </div>
                
                <div className="text-base font-bold text-on-surface tracking-wider font-orbitron flex items-center gap-2">
                  <span>{member.name}</span>
                </div>
                <div className="text-xs text-secondary-fixed">
                  {member.specialty}
                </div>
                <p className="text-[12px] text-slate-300 pt-space-xs leading-relaxed font-sans">
                  {member.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-cyan-500/15 flex items-center justify-between text-[10px] text-outline">
                <span>CALLSIGN: {member.callsign}</span>
                {getStatusBadge(member)}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
