import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface Skiper58Props {
  text: string;
  className?: string;
  active?: boolean;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
  href?: string;
  title?: string;
  badge?: string | React.ReactNode;
}

export const Skiper58: React.FC<Skiper58Props> = ({
  text,
  className,
  active,
  onClick,
  href,
  title,
  badge
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const content = (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        'relative inline-flex items-center gap-1.5 overflow-hidden font-mono text-xs select-none cursor-pointer',
        className
      )}
    >
      {badge && <span className="shrink-0">{badge}</span>}
      <div className="relative overflow-hidden h-[1.5em] leading-[1.5em] flex flex-col justify-center">
        {/* Primary Line (Rolls Up) */}
        <motion.span
          animate={{ y: isHovered ? '-120%' : '0%' }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            'inline-block transition-colors duration-200',
            active
              ? 'text-primary-container font-bold drop-shadow-[0_0_8px_rgba(0,240,255,0.9)]'
              : 'text-cyan-200/90 group-hover:text-cyan-100'
          )}
        >
          {text}
        </motion.span>

        {/* Rolling Clone Line (Rolls in from bottom) */}
        <motion.span
          animate={{ y: isHovered ? '0%' : '120%' }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          aria-hidden="true"
          className="absolute inset-0 flex items-center text-primary-container font-bold drop-shadow-[0_0_10px_rgba(0,240,255,1)]"
        >
          {text}
        </motion.span>
      </div>

      {/* Active Underline Beam */}
      {active && (
        <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary-container shadow-[0_0_8px_#00F0FF]" />
      )}
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        title={title}
        onClick={onClick}
        className="inline-flex focus:outline-none"
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className="inline-flex bg-transparent border-0 p-0 focus:outline-none cursor-pointer"
    >
      {content}
    </button>
  );
};
