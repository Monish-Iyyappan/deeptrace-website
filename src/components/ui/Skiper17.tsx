import React, { useState, forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '../../lib/utils';

export interface Skiper17CardProps extends HTMLMotionProps<'div'> {
  index: number;
  total?: number;
  children: React.ReactNode;
  className?: string;
  isActive?: boolean;
}

export const Skiper17Card = forwardRef<HTMLDivElement, Skiper17CardProps>(
  ({ index, total = 6, children, className, isActive = false, ...props }, ref) => {
    // Exact organic dossier angles matching the tactical team layout
    const angles = [-4.5, 3.5, -3.5, 3.5, -2.5, 3.5];
    const initialRotate = angles[index % angles.length];
    const [isHovered, setIsHovered] = useState(false);

    return (
      <motion.div
        ref={ref}
        initial={{ rotate: initialRotate, scale: 1 }}
        animate={{
          rotate: isHovered ? 0 : initialRotate,
          scale: isHovered ? 1.05 : 1,
          zIndex: isHovered ? 30 : 1
        }}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 24,
          mass: 0.7
        }}
        onMouseEnter={(e) => {
          setIsHovered(true);
          props.onMouseEnter?.(e);
        }}
        onMouseLeave={(e) => {
          setIsHovered(false);
          props.onMouseLeave?.(e);
        }}
        className={cn(
          'relative will-change-transform transform-gpu cursor-pointer transition-[box-shadow,border-color,background-color] duration-300',
          isHovered
            ? 'shadow-[0_0_35px_rgba(0,240,255,0.35)] border-cyan-400'
            : isActive
            ? 'shadow-[0_0_28px_rgba(0,240,255,0.3)] border-cyan-400'
            : 'shadow-[0_0_20px_rgba(0,0,0,0.6)] border-cyan-500/20',
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Skiper17Card.displayName = 'Skiper17Card';

