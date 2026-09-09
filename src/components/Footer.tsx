import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { attachMagneticEffect, isReducedMotion } from '../utils/motion';

gsap.registerPlugin(ScrollTrigger);

export const Footer: React.FC = () => {
  const footerRef = useRef<HTMLElement>(null);
  const ghBtnRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const cleanupMagnetic = attachMagneticEffect(ghBtnRef.current, 0.2);

    let trigger: ScrollTrigger | null = null;
    if (!isReducedMotion() && footerRef.current) {
      const cols = footerRef.current.querySelectorAll('.footer-col');
      const anim = gsap.fromTo(
        cols,
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 90%',
            toggleActions: 'play none none none'
          }
        }
      );
      trigger = anim.scrollTrigger || null;
    }

    return () => {
      cleanupMagnetic();
      if (trigger) trigger.kill();
    };
  }, []);

  return (
    <footer
      ref={footerRef}
      className="w-full bg-surface-container-lowest py-space-3xl mt-space-4xl relative z-10 border-t border-cyan-500/15"
    >
      <div className="w-full px-margin-desktop">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-space-2xl pb-space-2xl">
          
          <div className="footer-col space-y-space-md">
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-primary-container text-lg">
                radar
              </span>
              <span className="font-headline-sm text-headline-sm text-on-surface font-orbitron tracking-wider">
                DEEPTRACE // MARINE HQ
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
              Sub-surface acoustic telemetry, deep-trench acoustic mapping, and
              autonomous naval sensor array intelligence.
            </p>
            <div className="font-label-sm text-label-sm text-on-surface-variant space-y-space-2xs font-mono text-[10px]">
              <div>GRID: QUAD-09 // TRENCH 4B</div>
              <div>STATION: ABYSSAL RELAY #12</div>
            </div>
          </div>

          <div className="footer-col space-y-space-sm">
            <div className="font-label-md text-label-md text-primary-container uppercase font-mono tracking-wider">
              TACTICAL TELEMETRY
            </div>
            <ul className="space-y-space-xs font-label-sm text-label-sm text-on-surface-variant font-mono text-[11px]">
              <li>THERMOCLINE LAYER: -840M</li>
              <li>ACOUSTIC ATTENUATION: 1.4 dB/km</li>
              <li>VELOCITY PROFILE: 1492 m/s</li>
              <li>SIGNAL GAIN: +18.4 dB</li>
            </ul>
          </div>

          <div className="footer-col space-y-space-sm">
            <div className="font-label-md text-label-md text-primary-container uppercase font-mono tracking-wider">
              SYSTEM STATUS
            </div>
            <ul className="space-y-space-xs font-label-sm text-label-sm text-on-surface-variant font-mono text-[11px]">
              <li className="flex items-center gap-space-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-container shadow-[0_0_6px_rgba(0,240,255,0.8)]"></span>{' '}
                ARRAY: OPERATIONAL
              </li>
              <li className="flex items-center gap-space-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-container shadow-[0_0_6px_rgba(0,240,255,0.8)]"></span>{' '}
                COMPUTE MESH: ACTIVE
              </li>
              <li className="flex items-center gap-space-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary-fixed-dim shadow-[0_0_6px_rgba(0,217,251,0.8)]"></span>{' '}
                SYNC DRIFT: 0.002ms
              </li>
              <li className="flex items-center gap-space-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-container shadow-[0_0_6px_rgba(0,240,255,0.8)]"></span>{' '}
                THREAT DETECTION: LEVEL 1
              </li>
            </ul>
          </div>

          <div className="footer-col space-y-space-md">
            <div className="font-label-md text-label-md text-primary-container uppercase font-mono tracking-wider">
              REPOSITORY &amp; SPECS
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
              Source code and neural beamforming models published on GitHub.
            </p>
            <a
              ref={ghBtnRef}
              className="inline-flex items-center gap-space-xs px-space-md py-space-xs rounded bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-sm text-label-sm transition-all border border-cyan-500/25 hover:border-cyan-400/50 hover:shadow-[0_0_12px_rgba(0,240,255,0.2)] font-mono"
              href="https://github.com/Monish-Iyyappan/sonar-deeptrace-demo.git"
              rel="noopener noreferrer"
              target="_blank"
            >
              <span className="material-symbols-outlined text-sm text-primary-container">code</span>
              <span>GITHUB REPOSITORY</span>
            </a>
          </div>
        </div>

        <div className="pt-space-lg border-t border-outline-variant/15 flex flex-col md:flex-row items-center justify-between gap-space-md font-label-sm text-label-sm text-on-surface-variant font-mono text-[10px]">
          <div className="flex items-center gap-space-md">
            <span>&copy; 2025 DEEPTRACE TACTICAL SYSTEMS.</span>
            <span>CLASSIFICATION: TOP SECRET // SI-TK</span>
          </div>
          <div className="flex items-center gap-space-lg">
            <span>LAT: 44.1200 N</span>
            <span>LON: 012.0413 W</span>
            <span>DATUM: WGS-84</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
