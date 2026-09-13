import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

interface TextRollProps {
  children: string;
  className?: string;
  activeClassName?: string;
  stagger?: number;
  duration?: number;
  autoRollInterval?: number;
}

/**
 * Character-by-character vertical roll text effect.
 * Staggers each letter vertically on hover, mount, or periodic auto-roll.
 */
export const TextRoll: React.FC<TextRollProps> = ({
  children,
  className,
  activeClassName,
  stagger = 0.028,
  duration = 0.35,
  autoRollInterval
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [autoRollCount, setAutoRollCount] = useState(0);

  useEffect(() => {
    if (!autoRollInterval) return;
    const interval = setInterval(() => {
      setAutoRollCount((prev) => prev + 1);
    }, autoRollInterval);
    return () => clearInterval(interval);
  }, [autoRollInterval]);

  const characters = children.split('');

  return (
    <span
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        'relative inline-flex overflow-hidden cursor-pointer select-none font-orbitron font-bold uppercase tracking-wider',
        className
      )}
    >
      <span className="sr-only">{children}</span>
      <span aria-hidden="true" className="inline-flex">
        {characters.map((char, index) => {
          if (char === ' ') {
            return (
              <span key={index} className="inline-block w-[0.3em]">
                &nbsp;
              </span>
            );
          }

          const rollState = isHovered || autoRollCount % 2 === 1;

          return (
            <span
              key={index}
              className="relative inline-block overflow-hidden h-[1.25em] leading-[1.25em]"
            >
              {/* Primary letter (Rolls out upward) */}
              <motion.span
                animate={{
                  y: rollState ? '-100%' : '0%',
                  opacity: rollState ? 0 : 1,
                  rotateX: rollState ? 45 : 0
                }}
                transition={{
                  duration,
                  delay: index * stagger,
                  ease: [0.25, 1, 0.5, 1]
                }}
                className="inline-block transition-colors duration-200"
              >
                {char}
              </motion.span>

              {/* Secondary letter (Rolls in from bottom) */}
              <motion.span
                animate={{
                  y: rollState ? '0%' : '100%',
                  opacity: rollState ? 1 : 0,
                  rotateX: rollState ? 0 : -45
                }}
                transition={{
                  duration,
                  delay: index * stagger,
                  ease: [0.25, 1, 0.5, 1]
                }}
                className={cn(
                  'absolute inset-0 text-cyan-300 drop-shadow-[0_0_12px_rgba(0,240,255,1)]',
                  activeClassName
                )}
              >
                {char}
              </motion.span>
            </span>
          );
        })}
      </span>
    </span>
  );
};

interface WordRollProps {
  words: string[];
  interval?: number;
  className?: string;
  badgeClassName?: string;
}

/**
 * Multi-phrase rotating vertical rolling slot effect.
 * Cycles smoothly through multiple tactical mission phrases.
 */
export const WordRoll: React.FC<WordRollProps> = ({
  words,
  interval = 3200,
  className,
  badgeClassName
}) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (words.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, interval);
    return () => clearInterval(timer);
  }, [words, interval]);

  const currentWord = words[index];

  return (
    <div className={cn('relative inline-flex items-center overflow-hidden align-middle', className)}>
      <AnimatePresence mode="wait">
        <motion.span
          key={currentWord}
          initial={{ y: '120%', opacity: 0, rotateX: -60 }}
          animate={{ y: '0%', opacity: 1, rotateX: 0 }}
          exit={{ y: '-120%', opacity: 0, rotateX: 60 }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 26,
            mass: 0.7
          }}
          className={cn(
            'inline-block px-3 py-1 rounded-lg bg-cyan-500/15 border border-cyan-400/50 text-cyan-300 font-mono text-xs md:text-sm font-bold shadow-[0_0_16px_rgba(0,240,255,0.3)] backdrop-blur-sm whitespace-nowrap',
            badgeClassName
          )}
        >
          {currentWord}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};
