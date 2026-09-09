import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export let globalLenis: Lenis | null = null;

export const isReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

export const initSmoothScroll = (): (() => void) => {
  if (typeof window === 'undefined') return () => {};

  if (isReducedMotion()) {
    return () => {};
  }

  const lenis = new Lenis({
    duration: 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    touchMultiplier: 1.8
  });

  globalLenis = lenis;

  // Synchronize Lenis with GSAP ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);

  const tickerCallback = (time: number) => {
    lenis.raf(time * 1000);
  };

  gsap.ticker.add(tickerCallback);
  gsap.ticker.lagSmoothing(0);

  return () => {
    gsap.ticker.remove(tickerCallback);
    lenis.destroy();
    globalLenis = null;
  };
};

export const scrollToTarget = (
  target: string | HTMLElement,
  offset: number = -80
): void => {
  if (typeof window === 'undefined') return;

  const targetElement =
    typeof target === 'string'
      ? document.getElementById(target.replace('#', ''))
      : target;

  if (!targetElement) return;

  if (globalLenis && !isReducedMotion()) {
    globalLenis.scrollTo(targetElement, {
      offset,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
    });
  } else {
    targetElement.scrollIntoView({ behavior: 'smooth' });
  }
};

/**
 * Attaches a magnetic hover effect to a button or interactive element.
 */
export const attachMagneticEffect = (
  element: HTMLElement | null,
  strength: number = 0.25
): (() => void) => {
  if (!element || isReducedMotion()) return () => {};

  const handleMouseMove = (e: MouseEvent) => {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distanceX = (e.clientX - centerX) * strength;
    const distanceY = (e.clientY - centerY) * strength;

    gsap.to(element, {
      x: distanceX,
      y: distanceY,
      duration: 0.3,
      ease: 'power2.out'
    });
  };

  const handleMouseLeave = () => {
    gsap.to(element, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: 'elastic.out(1, 0.4)'
    });
  };

  element.addEventListener('mousemove', handleMouseMove);
  element.addEventListener('mouseleave', handleMouseLeave);

  return () => {
    element.removeEventListener('mousemove', handleMouseMove);
    element.removeEventListener('mouseleave', handleMouseLeave);
  };
};

/**
 * Tracks mouse movement across cards to drive the radial glow spotlight border.
 */
export const attachSpotlight = (cardElement: HTMLElement | null): (() => void) => {
  if (!cardElement || isReducedMotion()) return () => {};

  const handleMouseMove = (e: MouseEvent) => {
    const rect = cardElement.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardElement.style.setProperty('--mouse-x', `${x}px`);
    cardElement.style.setProperty('--mouse-y', `${y}px`);
  };

  cardElement.addEventListener('mousemove', handleMouseMove);

  return () => {
    cardElement.removeEventListener('mousemove', handleMouseMove);
  };
};

/**
 * Attaches a 3D cursor-following tilt effect to a card element.
 * Uses GSAP native 3D rotation properties for hardware-accelerated 60fps performance.
 * Respects prefers-reduced-motion and touch devices (hover: none).
 */
export const attachCardTilt = (
  cardElement: HTMLElement | null,
  maxTiltDeg: number = 4
): (() => void) => {
  if (!cardElement || isReducedMotion()) return () => {};
  if (typeof window !== 'undefined' && !window.matchMedia('(hover: hover)').matches) {
    return () => {};
  }

  const handleMouseMove = (e: MouseEvent) => {
    const rect = cardElement.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotX = ((centerY - y) / centerY) * maxTiltDeg;
    const rotY = ((x - centerX) / centerX) * maxTiltDeg;

    gsap.to(cardElement, {
      transformPerspective: 1000,
      rotationX: rotX,
      rotationY: rotY,
      scale: 1.015,
      duration: 0.25,
      ease: 'power1.out',
      overwrite: 'auto'
    });
  };

  const handleMouseLeave = () => {
    gsap.to(cardElement, {
      transformPerspective: 1000,
      rotationX: 0,
      rotationY: 0,
      scale: 1,
      duration: 0.5,
      ease: 'power2.out',
      overwrite: 'auto'
    });
  };

  cardElement.addEventListener('mousemove', handleMouseMove);
  cardElement.addEventListener('mouseleave', handleMouseLeave);

  return () => {
    cardElement.removeEventListener('mousemove', handleMouseMove);
    cardElement.removeEventListener('mouseleave', handleMouseLeave);
    gsap.set(cardElement, {
      clearProps: 'rotationX,rotationY,scale,transformPerspective'
    });
  };
};
