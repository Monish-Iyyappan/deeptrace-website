import React, { useState, useRef, useEffect } from 'react';
import { TeamMember } from '../types';
import { attachSpotlight, attachCardTilt, scrollToTarget } from '../utils/motion';
import { TextRoll, WordRoll } from './ui/TextRoll';

interface HomeAuthSectionProps {
  teamMembers: TeamMember[];
  signedInMemberId: string | null;
  onSignIn: (memberId: string) => void;
  onSignOut: () => void;
  onEnterAsGuest: () => void;
}

export const HomeAuthSection: React.FC<HomeAuthSectionProps> = ({
  teamMembers,
  signedInMemberId,
  onSignIn,
  onSignOut,
  onEnterAsGuest
}) => {
  const [usernameInput, setUsernameInput] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const loginBoxRef = useRef<HTMLDivElement>(null);
  const logoCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cleanupSpotlight = attachSpotlight(loginBoxRef.current);
    const cleanupTilt = attachCardTilt(loginBoxRef.current, 3);
    const cleanupLogoTilt = attachCardTilt(logoCardRef.current, 4);

    return () => {
      cleanupSpotlight();
      cleanupTilt();
      cleanupLogoTilt();
    };
  }, []);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const rawUser = usernameInput.trim().toLowerCase();
    const rawPass = passwordInput.trim().toLowerCase();

    if (!rawUser || !rawPass) {
      setErrorMessage('Please enter both username and password.');
      return;
    }

    const matched = teamMembers.find((member) => {
      const expectedUsername = member.username.toLowerCase();
      const expectedPassword = (member.password || member.name.toLowerCase().replace(/\s+/g, '@')).toLowerCase();
      return rawUser === expectedUsername && rawPass === expectedPassword;
    });

    if (matched) {
      onSignIn(matched.id);
      setErrorMessage(null);
      setUsernameInput('');
      setPasswordInput('');
    } else {
      setErrorMessage('Invalid username or password.');
    }
  };

  const handleGuestEntry = () => {
    setErrorMessage(null);
    onEnterAsGuest();
  };

  const activeMember = teamMembers.find((m) => m.id === signedInMemberId);

  return (
    <section
      id="home"
      className="relative w-full min-h-[92vh] md:min-h-screen flex items-center justify-center px-margin-desktop py-16 max-w-7xl mx-auto scroll-mt-20 z-20"
    >
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        {/* CENTER-LEFT: DeepTrace Logo & Brand Identity */}
        <div
          ref={logoCardRef}
          className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 will-change-transform"
        >
          {/* Glowing DeepTrace Sonar Emblem */}
          <div className="relative group cursor-pointer" onClick={() => scrollToTarget('step-01', -70)}>
            <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-3xl bg-[#06101c] border-2 border-cyan-400/40 p-4 flex items-center justify-center shadow-[0_0_35px_rgba(0,240,255,0.3)] group-hover:border-cyan-300 group-hover:shadow-[0_0_45px_rgba(0,240,255,0.5)] transition-all overflow-hidden">
              {/* Radar Sweep Animation */}
              <div className="absolute inset-0 rounded-3xl border border-cyan-500/20 pointer-events-none" />
              <div className="absolute inset-2 rounded-full border border-cyan-500/30 pointer-events-none" />
              <div className="absolute inset-6 rounded-full border border-cyan-500/20 pointer-events-none" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.15)_0%,transparent_70%)] pointer-events-none" />
              <div className="absolute inset-0 radar-sweep-beam origin-center pointer-events-none opacity-40 bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,rgba(0,240,255,0.4)_60deg,transparent_65deg)]" />

              <span className="material-symbols-outlined text-primary-container text-5xl md:text-6xl drop-shadow-[0_0_15px_rgba(0,240,255,0.8)] group-hover:scale-110 transition-transform">
                radar
              </span>
            </div>
            {/* Pulsing Sonar Target Ping */}
            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary-container animate-ping opacity-75" />
            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary-container shadow-[0_0_10px_rgba(0,240,255,1)]" />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-center lg:justify-start gap-2 font-mono text-xs text-primary-container">
              <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse" />
              <TextRoll
                stagger={0.018}
                duration={0.3}
                className="font-mono text-xs text-primary-container font-bold tracking-widest uppercase"
              >
                MISSION PLATFORM // ACCESS GATEWAY
              </TextRoll>
            </div>

            <div className="py-1">
              <TextRoll
                stagger={0.04}
                duration={0.4}
                autoRollInterval={5500}
                className="font-headline-xl text-4xl md:text-5xl lg:text-6xl text-primary font-orbitron font-bold uppercase tracking-wider leading-tight"
                activeClassName="text-cyan-300 drop-shadow-[0_0_20px_rgba(0,240,255,1)]"
              >
                DEEPTRACE
              </TextRoll>
            </div>

            <div className="font-body-lg text-base md:text-lg text-on-surface-variant max-w-xl leading-relaxed flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1">
              <span>Acoustic Neural Intelligence Platform for</span>
              <WordRoll
                words={[
                  'GHOST GEAR DETECTION',
                  'MARINE HABITAT CONSERVATION',
                  'BATHYMETRIC CARTOGRAPHY',
                  'BIO-ENTANGLEMENT HAZARD SCAN',
                  'AUTONOMOUS SUB-SEA RECON'
                ]}
              />
            </div>
          </div>

          {/* Telemetry Indicator Tags */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 font-mono text-xs text-on-surface-variant">
            <span className="px-3 py-1 rounded bg-surface-container-high border border-cyan-500/20 text-cyan-200">
              <TextRoll stagger={0.02}>SYS // v2.4-STABLE</TextRoll>
            </span>
            <span className="px-3 py-1 rounded bg-surface-container-high border border-cyan-500/20 text-cyan-200">
              <TextRoll stagger={0.02}>LAT: 36°48'N | LON: 122°01'W</TextRoll>
            </span>
            <span className="px-3 py-1 rounded bg-surface-container-high border border-cyan-500/20 text-primary font-bold">
              <TextRoll stagger={0.02}>PORT: 842.19 kHz</TextRoll>
            </span>
          </div>
        </div>

        {/* CENTER-RIGHT: The Login Box */}
        <div className="lg:col-span-6 flex justify-center lg:justify-end w-full">
          <div
            ref={loginBoxRef}
            className="w-full max-w-md bg-[#091420]/90 backdrop-blur-md border border-cyan-500/35 hover:border-cyan-400/60 rounded-2xl p-6 md:p-8 shadow-[0_0_40px_rgba(0,0,0,0.7)] hover:shadow-[0_0_35px_rgba(0,240,255,0.2)] spotlight-card transition-[border-color,box-shadow] duration-300 relative overflow-hidden will-change-transform"
          >
            {/* Ambient Corner Glow Blob */}
            <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-primary-container/10 rounded-full blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between pb-5 mb-5 border-b border-cyan-500/20">
              <div className="flex items-center gap-2 font-mono text-sm text-primary">
                <span className="material-symbols-outlined text-primary-container text-base">login</span>
                <TextRoll className="font-bold tracking-wider font-orbitron uppercase text-sm">
                  CREW SIGN IN
                </TextRoll>
              </div>
              <span className="text-[10px] font-mono text-cyan-400/80 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                TIER-1 ACCESS
              </span>
            </div>

            {/* Form */}
            <form className="space-y-4 font-mono" onSubmit={handleLoginSubmit}>
              {/* Error Message */}
              {errorMessage && (
                <div className="p-3 rounded-lg bg-red-950/60 border border-red-500/50 text-red-300 text-xs flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-red-400">error</span>
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Active Session Notice */}
              {activeMember && (
                <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-400/40 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary-container animate-pulse shadow-[0_0_8px_rgba(0,240,255,0.9)]" />
                    <span className="text-on-surface">
                      ACTIVE: <strong className="text-primary font-orbitron">{activeMember.name}</strong>
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={onSignOut}
                    className="text-[10px] text-red-300 hover:text-red-200 px-2 py-0.5 rounded bg-red-950/50 border border-red-500/30 font-bold cursor-pointer"
                  >
                    LOG OUT
                  </button>
                </div>
              )}

              {/* Username Input Field */}
              <div className="space-y-1.5">
                <label className="text-xs text-secondary-fixed uppercase tracking-wider font-bold block" htmlFor="home-auth-username">
                  USERNAME
                </label>
                <input
                  id="home-auth-username"
                  type="text"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="Enter username"
                  className="w-full px-4 py-2.5 rounded-lg bg-[#0d1724] border border-cyan-500/30 text-on-surface text-sm font-mono placeholder:text-slate-500 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 focus:outline-none transition-all"
                  autoComplete="username"
                />
              </div>

              {/* Password Input Field */}
              <div className="space-y-1.5">
                <label className="text-xs text-secondary-fixed uppercase tracking-wider font-bold block" htmlFor="home-auth-password">
                  PASSWORD
                </label>
                <div className="relative">
                  <input
                    id="home-auth-password"
                    type={showPassword ? 'text' : 'password'}
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Enter password"
                    className="w-full px-4 py-2.5 rounded-lg bg-[#0d1724] border border-cyan-500/30 text-on-surface text-sm font-mono placeholder:text-slate-500 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 focus:outline-none transition-all pr-10"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-cyan-300 transition-colors focus:outline-none cursor-pointer"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    <span className="material-symbols-outlined text-base">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Primary Log In Button */}
              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-lg bg-primary-container hover:bg-primary-fixed text-on-primary-fixed font-mono text-xs font-bold shadow-[0_0_15px_rgba(0,240,255,0.35)] transition-all cursor-pointer flex items-center justify-center gap-2 mt-2 group"
              >
                <span className="material-symbols-outlined text-sm">login</span>
                <TextRoll className="font-bold tracking-wider font-mono text-xs text-on-primary-fixed" activeClassName="text-white">
                  LOG IN
                </TextRoll>
              </button>

              {/* Non-Teammate Enter Button */}
              <button
                type="button"
                onClick={handleGuestEntry}
                className="w-full py-2.5 px-4 rounded-lg bg-surface-container-high/80 hover:bg-surface-container-highest text-slate-300 hover:text-white font-mono text-xs font-bold border border-cyan-500/25 hover:border-cyan-400/50 transition-all cursor-pointer flex items-center justify-center gap-2 group"
              >
                <span className="material-symbols-outlined text-sm text-cyan-400">arrow_forward</span>
                <TextRoll className="font-bold tracking-wider font-mono text-xs text-slate-300 group-hover:text-white" activeClassName="text-cyan-300">
                  ENTER WITHOUT CREDENTIALS (NON-TEAMMATES)
                </TextRoll>
              </button>
            </form>
          </div>
        </div>

      </div>
    </section>
  );
};
