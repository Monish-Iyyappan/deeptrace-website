import React, { useState, useEffect, useRef } from 'react';
import { TeamMember } from '../types';
import { isReducedMotion } from '../utils/motion';

interface MemberSignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamMembers: TeamMember[];
  signedInMemberId: string | null;
  onSignIn: (memberId: string) => void;
  onSignOut: () => void;
}

export const MemberSignInModal: React.FC<MemberSignInModalProps> = ({
  isOpen,
  onClose,
  teamMembers,
  signedInMemberId,
  onSignIn,
  onSignOut
}) => {
  const [selectedId, setSelectedId] = useState<string>(
    signedInMemberId || (teamMembers[0] ? teamMembers[0].id : '')
  );
  const modalRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (signedInMemberId) {
      setSelectedId(signedInMemberId);
    } else if (teamMembers[0]) {
      setSelectedId(teamMembers[0].id);
    }
  }, [signedInMemberId, teamMembers]);

  useEffect(() => {
    if (isOpen) {
      previousActiveElementRef.current = document.activeElement as HTMLElement;
      setTimeout(() => {
        closeBtnRef.current?.focus();
      }, 50);

      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          onClose();
        }

        // Focus trap
        if (e.key === 'Tab' && modalRef.current) {
          const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          if (focusableElements.length === 0) return;

          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];

          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              e.preventDefault();
              lastElement.focus();
            }
          } else {
            if (document.activeElement === lastElement) {
              e.preventDefault();
              firstElement.focus();
            }
          }
        }
      };

      window.addEventListener('keydown', handleKeyDown);

      return () => {
        document.body.style.overflow = originalOverflow;
        window.removeEventListener('keydown', handleKeyDown);
        if (previousActiveElementRef.current) {
          previousActiveElementRef.current.focus();
        }
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentMember = teamMembers.find((m) => m.id === selectedId) || teamMembers[0];
  const activeSignedInMember = teamMembers.find((m) => m.id === signedInMemberId);
  const reducedMotion = isReducedMotion();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedId) {
      onSignIn(selectedId);
      onClose();
    }
  };

  const handleSignOut = () => {
    onSignOut();
    onClose();
  };

  return (
    <div
      aria-label="DeepTrace Architecture Crew Authentication"
      aria-modal="true"
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md ${
        reducedMotion ? '' : 'transition-opacity duration-200 animate-fadeIn'
      }`}
      ref={modalRef}
      role="dialog"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className={`relative max-w-lg w-full bg-[#080f18] rounded-2xl border border-cyan-400/50 shadow-[0_0_40px_rgba(0,240,255,0.3)] overflow-hidden flex flex-col ${
          reducedMotion ? '' : 'transform transition-transform duration-300 scale-100'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#091420] border-b border-cyan-500/25">
          <div className="flex items-center gap-2 font-mono text-xs text-primary">
            <span className="material-symbols-outlined text-primary-container text-base">verified_user</span>
            <span className="font-bold tracking-wider font-orbitron uppercase">
              CREW AUTHENTICATION TERMINAL
            </span>
          </div>
          <button
            ref={closeBtnRef}
            aria-label="Close sign in modal"
            className="w-8 h-8 rounded-lg bg-surface-container-high hover:bg-cyan-500/20 text-on-surface hover:text-primary-container border border-cyan-500/30 flex items-center justify-center transition-all cursor-pointer"
            onClick={onClose}
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>

        {/* Form Body */}
        <form className="p-6 space-y-5" onSubmit={handleSubmit}>
          {/* Current Active Session Readout */}
          {activeSignedInMember ? (
            <div className="p-3.5 rounded-lg bg-cyan-950/40 border border-cyan-400/40 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-primary-container animate-pulse shadow-[0_0_8px_rgba(0,240,255,0.9)]"></span>
                <span className="text-on-surface">
                  ACTIVE: <strong className="text-primary">{activeSignedInMember.name}</strong>
                </span>
              </div>
              <span className="text-[10px] text-cyan-300 px-2 py-0.5 rounded bg-cyan-500/20 border border-cyan-400/30 font-bold">
                [{activeSignedInMember.callsign}]
              </span>
            </div>
          ) : (
            <div className="p-3 rounded-lg bg-surface-container-low border border-cyan-500/15 text-xs font-mono text-on-surface-variant flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-slate-500"></span>
              <span>NO ACTIVE CREW MEMBER LOGGED IN (TIER-1 STANDBY)</span>
            </div>
          )}

          {/* Member Dropdown Selection */}
          <div className="space-y-1.5 font-mono">
            <label className="text-xs text-secondary-fixed uppercase tracking-wider font-bold block" htmlFor="crew-member-select">
              SELECT ARCHITECTURE CREW MEMBER
            </label>
            <select
              id="crew-member-select"
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#0d1724] border border-cyan-500/30 text-on-surface text-sm font-mono focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 focus:outline-none transition-all cursor-pointer"
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
            >
              {teamMembers.map((member) => (
                <option key={member.id} value={member.id} className="bg-[#091420] text-on-surface py-1">
                  {member.name} — {member.roleTitle} ({member.callsign})
                </option>
              ))}
            </select>
          </div>

          {/* Member Telemetry Preview Card */}
          {currentMember && (
            <div className="p-4 rounded-xl bg-[#091420]/90 border border-cyan-500/20 space-y-2 font-mono text-xs">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-primary-container font-bold">{currentMember.step} // {currentMember.roleTitle}</span>
                <span className="text-secondary-fixed">CALLSIGN: {currentMember.callsign}</span>
              </div>
              <div className="text-sm font-bold text-on-surface font-orbitron">
                {currentMember.name}
              </div>
              <div className="text-[11px] text-cyan-200">
                {currentMember.specialty}
              </div>
              <p className="text-[11px] text-slate-300 pt-1 leading-relaxed font-sans">
                {currentMember.description}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            {signedInMemberId && (
              <button
                type="button"
                className="px-4 py-2.5 rounded-lg bg-red-950/40 hover:bg-red-900/50 text-red-300 font-mono text-xs font-bold border border-red-500/30 transition-all cursor-pointer flex items-center gap-1.5"
                onClick={handleSignOut}
              >
                <span className="material-symbols-outlined text-sm">logout</span>
                <span>SIGN OUT</span>
              </button>
            )}

            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-primary-container hover:bg-primary-fixed text-on-primary-fixed font-mono text-xs font-bold shadow-[0_0_15px_rgba(0,240,255,0.35)] transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">login</span>
              <span>AUTHORIZE SESSION</span>
            </button>
          </div>
        </form>

        {/* Footer Note */}
        <div className="px-6 py-2.5 bg-[#091420] border-t border-cyan-500/20 text-[10px] font-mono text-outline flex items-center justify-between">
          <span>STORAGE: SESSION TIER (AUTO-EXPIRES ON TAB CLOSE)</span>
          <span>AUTH: DEMO STATE</span>
        </div>
      </div>
    </div>
  );
};
