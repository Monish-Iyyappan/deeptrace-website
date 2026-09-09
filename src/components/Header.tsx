import React, { useEffect, useRef } from 'react';
import { attachMagneticEffect, scrollToTarget } from '../utils/motion';
import { TeamMember } from '../types';

interface HeaderProps {
  onNavClick?: (targetId: string) => void;
  onOpenSignInModal: () => void;
  signedInMember?: TeamMember | null;
}

export const Header: React.FC<HeaderProps> = ({
  onNavClick,
  onOpenSignInModal,
  signedInMember
}) => {
  const launchBtnRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const cleanup = attachMagneticEffect(launchBtnRef.current, 0.2);
    return () => cleanup();
  }, []);

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    if (onNavClick) {
      onNavClick(targetId);
    } else {
      scrollToTarget(targetId);
    }
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-surface/85 backdrop-blur-xl shadow-[0_1px_12px_rgba(0,0,0,0.4)] border-b border-cyan-500/15">
      <div className="h-20 w-full px-margin-desktop flex items-center justify-between relative">
        
        {/* Left Brand & Interactive Crew Sign-In Trigger */}
        <div className="flex items-center gap-space-lg">
          <button
            aria-label="Open DeepTrace Crew Authentication Terminal"
            className="flex items-center gap-space-md group cursor-pointer text-left bg-transparent border-0 p-0 focus:outline-none focus:ring-1 focus:ring-cyan-400 rounded-lg"
            title="Click to sign in as DeepTrace Crew Member"
            onClick={onOpenSignInModal}
          >
            <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center border border-cyan-500/30 group-hover:border-cyan-400 group-hover:shadow-[0_0_16px_rgba(0,240,255,0.4)] transition-all">
              <span className="material-symbols-outlined text-primary-container text-xl group-hover:scale-110 transition-transform">
                radar
              </span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-space-xs">
                <span className="font-headline-sm text-headline-sm uppercase text-on-surface font-orbitron tracking-wider group-hover:text-primary transition-colors">
                  DEEPTRACE
                </span>
                {signedInMember ? (
                  <span className="font-label-sm text-[9px] px-1.5 py-0.5 bg-cyan-500/20 text-cyan-300 rounded border border-cyan-400/40 font-bold animate-pulse">
                    [{signedInMember.callsign}]
                  </span>
                ) : (
                  <span className="font-label-sm text-label-sm px-space-xs py-space-2xs bg-surface-container-high rounded text-secondary-fixed-dim border border-cyan-500/20 group-hover:border-cyan-400/40 transition-colors">
                    V0.1
                  </span>
                )}
              </div>
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest text-[9px] flex items-center gap-1">
                <span>TACTICAL SUB-SURFACE SONAR</span>
                <span className="text-primary-container opacity-0 group-hover:opacity-100 transition-opacity">
                  [AUTH]
                </span>
              </span>
            </div>
          </button>
        </div>

        {/* Centered Navigation Bar */}
        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex items-center gap-space-md absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <a
            aria-current="page"
            className="px-space-md py-space-xs rounded transition-colors bg-surface-container-high text-primary font-bold border border-cyan-500/30 shadow-[0_0_10px_rgba(0,240,255,0.15)]"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            TACTICAL OVERVIEW
          </a>
          <a
            className="px-space-md py-space-xs rounded font-label-lg text-label-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-all"
            href="#step-01"
            onClick={(e) => handleScroll(e, 'step-01')}
          >
            SONAR TELEMETRY
          </a>
          <a
            className="px-space-md py-space-xs rounded font-label-lg text-label-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-all"
            href="#step-08"
            onClick={(e) => handleScroll(e, 'step-08')}
          >
            BATHYMETRIC CARTOGRAPHY
          </a>
          <a
            className="px-space-md py-space-xs rounded font-label-lg text-label-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-all"
            href="#step-04"
            onClick={(e) => handleScroll(e, 'step-04')}
          >
            THREAT MATRIX
          </a>
          <a
            className="px-space-md py-space-xs rounded font-label-lg text-label-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-all"
            href="#team-credits"
            onClick={(e) => handleScroll(e, 'team-credits')}
          >
            TEAM
          </a>
        </nav>

        {/* Right Action Area */}
        <div className="flex items-center gap-space-md">
          <div className="hidden xl:flex items-center gap-space-xs font-label-sm text-label-sm px-space-md py-space-xs rounded bg-surface-container-low border border-cyan-500/20">
            <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse shadow-[0_0_8px_rgba(0,240,255,0.8)]"></span>
            <span className="text-on-surface-variant font-mono">ACTIVE PING 0.4s</span>
          </div>
          <a
            ref={launchBtnRef}
            className="px-space-lg py-space-sm bg-primary-container/15 hover:bg-primary-container text-primary hover:text-on-primary-fixed font-label-lg text-label-lg rounded transition-all shadow-[0_0_14px_rgba(0,240,255,0.25)] flex items-center gap-space-xs border border-cyan-400/40 font-bold"
            href="https://github.com/Monish-Iyyappan/sonar-deeptrace-demo.git"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span className="material-symbols-outlined text-sm">rocket_launch</span>
            <span>LAUNCH DEMO</span>
          </a>
        </div>
      </div>
    </header>
  );
};
