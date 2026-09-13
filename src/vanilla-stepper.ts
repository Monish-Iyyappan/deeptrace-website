/**
 * DeepTrace Tactical HUD - Vanilla TypeScript Navigation, Lightbox & Interactive Controller
 */

export interface StepperControllerOptions {
  totalStages?: number;
  progressBarId?: string;
  stageIdPrefix?: string;
  markerClass?: string;
}

export class DeepTraceHUDController {
  private totalStages: number;
  private progressBar: HTMLElement | null;
  private stages: (HTMLElement | null)[];
  private vMarkers: NodeListOf<HTMLElement>;
  private stickyStepperContainer: HTMLElement | null;
  private stickyNodes: NodeListOf<HTMLElement>;
  private activeIndex: number = 0;

  constructor(options: StepperControllerOptions = {}) {
    this.totalStages = options.totalStages ?? 11;
    this.progressBar = document.getElementById(options.progressBarId ?? 'progress-bar-fill');
    
    const prefix = options.stageIdPrefix ?? 'step-';
    const stageIds = Array.from({ length: this.totalStages }, (_, i) => 
      `${prefix}${String(i + 1).padStart(2, '0')}`
    );
    this.stages = stageIds.map((id) => document.getElementById(id));
    this.vMarkers = document.querySelectorAll<HTMLElement>(`.${options.markerClass ?? 'v-step-marker'}`);
    this.stickyStepperContainer = document.querySelector('#sticky-nav-header .overflow-x-auto');
    this.stickyNodes = document.querySelectorAll('#sticky-nav-header a');

    this.init();
  }

  private init(): void {
    // Scroll and resize listeners
    window.addEventListener('scroll', () => this.update(), { passive: true });
    window.addEventListener('resize', () => this.update(), { passive: true });
    this.update();

    // Spotlight cursor tracking across all .spotlight-card elements
    this.initSpotlights();

    // 3D Card Tilt interactivity
    this.initCardTilt();

    // Smooth anchor navigation interception
    this.initSmoothAnchorLinks();

    // Vanilla HUD Image Popup initialization
    this.initImagePopup();

    // Member Sign-In Session Handling
    this.initMemberAuth();
  }

  public update(): void {
    const scrollPos = window.scrollY + window.innerHeight / 3;
    let newActiveIndex = 0;

    this.stages.forEach((stage, index) => {
      if (stage && stage.offsetTop <= scrollPos) {
        newActiveIndex = index;
      }
    });

    if (this.activeIndex !== newActiveIndex) {
      this.activeIndex = newActiveIndex;
      this.centerActiveStickyNode();
    }

    // Update Horizontal Progress Bar Width
    if (this.progressBar) {
      const percent = Math.min(100, Math.max(8, (this.activeIndex / Math.max(1, this.totalStages - 1)) * 100));
      this.progressBar.style.width = `${percent}%`;
    }

    // Update Sticky Stepper Nodes
    this.stickyNodes.forEach((node, index) => {
      const badge = node.querySelector<HTMLElement>('span');
      if (!badge) return;

      if (index === this.activeIndex) {
        badge.classList.add('ring-2', 'ring-cyan-200', 'ring-offset-1', 'ring-offset-surface', 'scale-125');
        node.classList.remove('opacity-80');
        node.classList.add('opacity-100');
      } else {
        badge.classList.remove('ring-2', 'ring-cyan-200', 'ring-offset-1', 'ring-offset-surface', 'scale-125');
        node.classList.add('opacity-80');
      }
    });

    // Update Vertical Rail HUD Markers
    this.vMarkers.forEach((marker, index) => {
      const badge = marker.querySelector<HTMLElement>('span');
      if (!badge) return;

      if (index === this.activeIndex) {
        marker.classList.add('bg-cyan-500/20', 'shadow-[0_0_10px_rgba(0,240,255,0.3)]');
        badge.classList.add('ring-2', 'ring-cyan-200', 'scale-110', 'shadow-[0_0_8px_rgba(0,240,255,0.8)]');
      } else {
        marker.classList.remove('bg-cyan-500/20', 'shadow-[0_0_10px_rgba(0,240,255,0.3)]');
        badge.classList.remove('ring-2', 'ring-cyan-200', 'scale-110', 'shadow-[0_0_8px_rgba(0,240,255,0.8)]');
      }
    });
  }

  private centerActiveStickyNode(): void {
    if (!this.stickyStepperContainer || !this.stickyNodes[this.activeIndex]) return;
    const activeNode = this.stickyNodes[this.activeIndex] as HTMLElement;
    const containerWidth = this.stickyStepperContainer.offsetWidth;
    const nodeLeft = activeNode.offsetLeft;
    const nodeWidth = activeNode.offsetWidth;
    const targetScrollLeft = nodeLeft - containerWidth / 2 + nodeWidth / 2;

    this.stickyStepperContainer.scrollTo({
      left: Math.max(0, targetScrollLeft),
      behavior: 'smooth'
    });
  }

  private initSpotlights(): void {
    const cards = document.querySelectorAll<HTMLElement>('.spotlight-card');
    cards.forEach((card) => {
      card.addEventListener('mousemove', (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });
    });
  }

  private initCardTilt(): void {
    if (typeof window === 'undefined') return;
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isHover = window.matchMedia('(hover: hover)').matches;
    if (isReduced || !isHover) return;

    const cards = document.querySelectorAll<HTMLElement>('.spotlight-card');
    cards.forEach((card) => {
      card.addEventListener('mousemove', (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const maxTiltDeg = 4;
        const rotX = ((centerY - y) / centerY) * maxTiltDeg;
        const rotY = ((x - centerX) / centerX) * maxTiltDeg;

        card.style.transform = `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale3d(1.015, 1.015, 1.015)`;
        card.style.transition = 'transform 0.25s ease-out';
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        card.style.transition = 'transform 0.5s ease-out';
      });
    });
  }

  private initSmoothAnchorLinks(): void {
    document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (!targetId || targetId === '#') return;
        const targetElement = document.getElementById(targetId.substring(1));
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  private initImagePopup(): void {
    const popup = document.getElementById('vanilla-image-popup') || document.getElementById('vanilla-lightbox');
    if (!popup) return;

    const imgEl = popup.querySelector<HTMLImageElement>('#vanilla-popup-img') || popup.querySelector<HTMLImageElement>('#vanilla-lightbox-img');
    const captionEl = popup.querySelector<HTMLElement>('#vanilla-popup-caption') || popup.querySelector<HTMLElement>('#vanilla-lightbox-caption');
    const closeBtn = popup.querySelector<HTMLButtonElement>('#vanilla-popup-close') || popup.querySelector<HTMLButtonElement>('#vanilla-lightbox-close');

    const openPopup = (src: string, alt: string, caption?: string, triggerEl?: HTMLElement) => {
      if (imgEl) {
        imgEl.src = src;
        imgEl.alt = alt;
      }
      if (captionEl) {
        captionEl.textContent = caption || alt;
      }

      if (triggerEl) {
        const anchor = triggerEl.getBoundingClientRect();
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const popupWidth = Math.min(500, vw - 32);
        const popupHeight = 360;

        let left = anchor.left + anchor.width / 2 - popupWidth / 2;
        let top = anchor.top + anchor.height / 2 - popupHeight / 2;

        left = Math.max(16, Math.min(left, vw - popupWidth - 16));
        top = Math.max(75, Math.min(top, vh - popupHeight - 20));

        popup.style.top = `${top}px`;
        popup.style.left = `${left}px`;
        popup.style.width = `${popupWidth}px`;
      }

      popup.classList.remove('hidden');
      popup.classList.add('block');
    };

    const closePopup = () => {
      popup.classList.add('hidden');
      popup.classList.remove('block');
    };

    // Attach click triggers to all stage images and radar
    document.querySelectorAll<HTMLElement>('[data-lightbox-trigger], [data-popup-trigger]').forEach((el) => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        const img = el.querySelector<HTMLImageElement>('img') || (el as HTMLImageElement);
        if (img) {
          openPopup(
            img.src,
            img.alt,
            el.getAttribute('data-lightbox-caption') || el.getAttribute('data-popup-caption') || img.alt,
            el
          );
        }
      });
    });

    closeBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      closePopup();
    });

    popup.addEventListener('click', () => {
      closePopup();
    });

    window.addEventListener('pointerdown', (e) => {
      if (!popup.contains(e.target as Node) && !popup.classList.contains('hidden')) {
        closePopup();
      }
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !popup.classList.contains('hidden')) {
        closePopup();
      }
    });
  }

  private initMemberAuth(): void {
    const sessionKey = 'deeptrace_auth_member_id';
    const authModal = document.getElementById('vanilla-auth-modal');
    const authTrigger = document.getElementById('header-logo-auth-btn');
    const closeBtn = document.getElementById('vanilla-auth-close');
    const authForm = document.getElementById('vanilla-auth-form') as HTMLFormElement;
    const memberSelect = document.getElementById('vanilla-auth-select') as HTMLSelectElement;
    const signOutBtn = document.getElementById('vanilla-auth-signout');
    const activeReadout = document.getElementById('vanilla-auth-active-readout');
    const headerCallsignBadge = document.getElementById('header-callsign-badge');

    const updateTeamBadges = (signedInId: string | null) => {
      document.querySelectorAll<HTMLElement>('[data-team-member-id]').forEach((card) => {
        const memberId = card.getAttribute('data-team-member-id');
        const badgeEl = card.querySelector<HTMLElement>('.team-status-badge');
        if (!badgeEl) return;

        if (signedInId && memberId === signedInId) {
          card.classList.add('border-cyan-400', 'shadow-[0_0_28px_rgba(0,240,255,0.3)]', 'bg-[#0c1c2e]/90');
          badgeEl.innerHTML = '<span class="text-primary-container font-bold font-mono shadow-[0_0_10px_rgba(0,240,255,0.9)] animate-pulse flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-primary-container inline-block"></span>ACTIVE</span>';
        } else {
          card.classList.remove('border-cyan-400', 'shadow-[0_0_28px_rgba(0,240,255,0.3)]', 'bg-[#0c1c2e]/90');
          const originalStatus = card.getAttribute('data-original-status') || 'VERIFIED';
          badgeEl.innerHTML = `<span class="font-bold font-mono text-outline-variant">${originalStatus}</span>`;
        }
      });

      if (headerCallsignBadge) {
        if (signedInId) {
          headerCallsignBadge.textContent = `[AUTH: ${signedInId.toUpperCase()}]`;
          headerCallsignBadge.classList.remove('hidden');
        } else {
          headerCallsignBadge.classList.add('hidden');
        }
      }

      if (activeReadout) {
        if (signedInId) {
          activeReadout.textContent = `ACTIVE CREW: ${signedInId.toUpperCase()}`;
          activeReadout.classList.remove('hidden');
          signOutBtn?.classList.remove('hidden');
        } else {
          activeReadout.classList.add('hidden');
          signOutBtn?.classList.add('hidden');
        }
      }
    };

    // Reset on exit/load
    try {
      sessionStorage.removeItem(sessionKey);
    } catch {}

    window.addEventListener('beforeunload', () => {
      try {
        sessionStorage.removeItem(sessionKey);
      } catch {}
    });

    authTrigger?.addEventListener('click', () => {
      authModal?.classList.remove('hidden');
      authModal?.classList.add('flex');
      document.body.style.overflow = 'hidden';
      closeBtn?.focus();
    });

    const closeAuth = () => {
      authModal?.classList.add('hidden');
      authModal?.classList.remove('flex');
      document.body.style.overflow = '';
    };

    closeBtn?.addEventListener('click', closeAuth);
    authModal?.addEventListener('click', (e) => {
      if (e.target === authModal) closeAuth();
    });

    authForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = memberSelect?.value;
      if (val) {
        try {
          sessionStorage.setItem(sessionKey, val);
        } catch {}
        updateTeamBadges(val);
        closeAuth();
      }
    });

    signOutBtn?.addEventListener('click', () => {
      try {
        sessionStorage.removeItem(sessionKey);
      } catch {}
      updateTeamBadges(null);
      closeAuth();
    });
  }

  public scrollToStage(stageNumber: number): void {
    const id = `step-${String(stageNumber).padStart(2, '0')}`;
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  }

  public scrollToElement(elementId: string): void {
    const target = document.getElementById(elementId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  }
}

// Auto-initialize if running in a browser environment
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    new DeepTraceHUDController();
  });
}
