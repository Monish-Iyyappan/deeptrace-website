import React, { useEffect, useRef } from 'react';
import { PipelineStage } from '../types';

interface StickyStepperProps {
  stages: PipelineStage[];
  activeStepIndex: number;
  onStepClick: (stepId: string) => void;
}

export const StickyStepper: React.FC<StickyStepperProps> = ({
  stages,
  activeStepIndex,
  onStepClick
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const progressPercent = Math.min(
    100,
    Math.max(8, (activeStepIndex / Math.max(1, stages.length - 1)) * 100)
  );

  // Auto-center active stage node in horizontal container on mobile/small screens
  useEffect(() => {
    const activeNode = nodeRefs.current[activeStepIndex];
    const container = scrollContainerRef.current;
    if (activeNode && container) {
      const containerWidth = container.offsetWidth;
      const nodeLeft = activeNode.offsetLeft;
      const nodeWidth = activeNode.offsetWidth;
      const targetScrollLeft = nodeLeft - containerWidth / 2 + nodeWidth / 2;
      container.scrollTo({
        left: Math.max(0, targetScrollLeft),
        behavior: 'smooth'
      });
    }
  }, [activeStepIndex]);

  return (
    <div
      className="sticky top-20 z-40 w-full bg-surface-container-lowest/90 backdrop-blur-md px-margin-desktop py-space-sm shadow-md transition-all border-b border-cyan-500/20"
      id="sticky-nav-header"
    >
      <div className="w-full flex flex-col gap-space-xs">
        <div className="flex items-center justify-between font-label-sm text-label-sm">
          <div className="flex items-center gap-space-sm">
            <span className="text-primary-container font-headline-sm text-xs font-mono">
              PIPELINE TELEMETRY //
            </span>
            <span className="text-on-surface-variant font-mono">
              {stages.length} ACTIVE STAGES
            </span>
          </div>
          <div className="flex items-center gap-space-md text-on-surface-variant font-mono text-[10px]">
            <span className="flex items-center gap-space-2xs">
              <span className="w-2 h-2 rounded-full bg-surface-variant border border-outline-variant/60 inline-block"></span>{' '}
              QUEUED FOR RELEASE (ALL STAGES)
            </span>
          </div>
        </div>

        {/* Nodes Track with Edge Fade Masks */}
        <div
          ref={scrollContainerRef}
          className="relative w-full overflow-x-auto py-1.5 scrollbar-none stepper-mask-fade"
        >
          <div className="flex items-center justify-between min-w-[780px] relative py-space-xs px-2">
            {/* Background Rail Line */}
            <div className="absolute left-2 right-2 h-0.5 bg-surface-variant/70 z-0"></div>
            
            {/* Progress Fill Line */}
            <div
              className="absolute left-2 h-0.5 bg-primary-container shadow-[0_0_8px_rgba(0,240,255,0.8)] transition-all duration-300 z-0"
              id="progress-bar-fill"
              style={{ width: `${progressPercent}%` }}
            ></div>

            {stages.map((stage, index) => {
              const isCurrent = index === activeStepIndex;
              const isPast = index < activeStepIndex;
              
              let nodeColor = 'bg-surface-variant text-on-surface-variant ring-surface-variant/50';
              let textColor = 'text-on-surface-variant';

              if (isCurrent) {
                nodeColor = 'bg-primary-container text-on-primary-fixed ring-primary-container/40 shadow-[0_0_10px_rgba(0,240,255,0.4)]';
                textColor = 'text-primary-container';
              } else if (isPast) {
                nodeColor = 'bg-[#152332] text-cyan-200 ring-cyan-500/30';
                textColor = 'text-cyan-200/80';
              }

              return (
                <a
                  key={stage.id}
                  ref={(el) => (nodeRefs.current[index] = el)}
                  className={`group z-10 flex flex-col items-center gap-1 cursor-pointer transition-all duration-200 hover:scale-110 ${
                    isCurrent ? 'scale-105' : 'opacity-80 hover:opacity-100'
                  }`}
                  href={`#${stage.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    onStepClick(stage.id);
                  }}
                >
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center font-label-sm text-[8px] font-bold ring-2 ${nodeColor} ${
                      isCurrent ? 'ring-2 ring-cyan-200 ring-offset-1 ring-offset-surface scale-125' : ''
                    }`}
                  >
                    {stage.stepNumber}
                  </span>
                  <span className={`font-label-sm text-[9px] font-mono tracking-tight ${textColor} ${isCurrent ? 'font-bold underline decoration-cyan-400 underline-offset-2' : ''}`}>
                    {stage.category}
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
