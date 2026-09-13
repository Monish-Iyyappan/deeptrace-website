import React, { useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '../../lib/utils';

export interface Skiper90CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  gradientClassName?: string;
}

export const Skiper90Card = forwardRef<HTMLDivElement, Skiper90CardProps>(
  ({ children, className, gradientClassName, ...props }, ref) => {
    const internalRef = useRef<HTMLDivElement>(null);
    useImperativeHandle(ref, () => internalRef.current as HTMLDivElement);

    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!internalRef.current) return;
      const rect = internalRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      if (props.onMouseMove) {
        props.onMouseMove(e);
      }
    };

    return (
      <div
        ref={internalRef}
        onMouseEnter={(e) => {
          setIsHovered(true);
          props.onMouseEnter?.(e);
        }}
        onMouseLeave={(e) => {
          setIsHovered(false);
          props.onMouseLeave?.(e);
        }}
        onMouseMove={handleMouseMove}
        className={cn('relative rounded-2xl group transition-all duration-300', className)}
        {...props}
      >
        {/* Animated / Mouse-tracked tactical gradient border (Skiper90) */}
        <div
          className={cn(
            'pointer-events-none absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0',
            gradientClassName
          )}
          style={{
            background: isHovered
              ? `radial-gradient(450px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(0,240,255,0.7), rgba(0,180,216,0.3) 35%, transparent 70%)`
              : undefined
          }}
        />

        {/* Outer ambient glow halo on hover */}
        <div
          className="pointer-events-none absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-60 transition-opacity duration-500 blur-lg bg-cyan-500/20 -z-10"
          style={{
            background: isHovered
              ? `radial-gradient(350px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(0,240,255,0.35), transparent 70%)`
              : undefined
          }}
        />

        {/* Content Container */}
        {children}
      </div>
    );
  }
);

Skiper90Card.displayName = 'Skiper90Card';

export interface Skiper90ButtonProps extends HTMLMotionProps<'a'> {
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary';
}

export const Skiper90Button = forwardRef<HTMLAnchorElement, Skiper90ButtonProps>(
  ({ children, className, variant = 'primary', ...props }, ref) => {
    return (
      <motion.a
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          'relative group p-[1px] rounded-lg overflow-hidden inline-flex items-center justify-center font-mono cursor-pointer transition-shadow duration-300',
          variant === 'primary'
            ? 'shadow-[0_0_18px_rgba(0,240,255,0.35)] hover:shadow-[0_0_28px_rgba(0,240,255,0.6)]'
            : 'shadow-[0_0_12px_rgba(0,240,255,0.15)] hover:shadow-[0_0_20px_rgba(0,240,255,0.3)]',
          className
        )}
        {...props}
      >
        {/* Animated gradient spinning / sweeping border */}
        <span
          className={cn(
            'absolute inset-[-1000%] animate-[spin_4s_linear_infinite] opacity-60 group-hover:opacity-100 transition-opacity duration-300',
            variant === 'primary'
              ? 'bg-[conic-gradient(from_90deg_at_50%_50%,#006970_0%,#00F0FF_50%,#006970_100%)]'
              : 'bg-[conic-gradient(from_90deg_at_50%_50%,#152332_0%,#00F0FF_50%,#152332_100%)]'
          )}
        />

        {/* Inner button surface */}
        <span
          className={cn(
            'relative w-full h-full px-space-xl py-space-md rounded-lg flex items-center justify-center gap-space-sm font-label-lg text-label-lg font-bold transition-all duration-300',
            variant === 'primary'
              ? 'bg-[#002b33] group-hover:bg-[#003842] text-primary-fixed border border-cyan-400/50'
              : 'bg-surface-container group-hover:bg-surface-container-highest text-on-surface border border-cyan-500/25'
          )}
        >
          {children}
        </span>
      </motion.a>
    );
  }
);

Skiper90Button.displayName = 'Skiper90Button';
