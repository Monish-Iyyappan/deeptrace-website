import { PipelineStage } from '../types';
import { Skiper58 } from './ui/Skiper58';

interface VerticalNavRailProps {
  stages: PipelineStage[];
  activeStepIndex: number;
  onStepClick: (stepId: string) => void;
}

export const VerticalNavRail: React.FC<VerticalNavRailProps> = ({
  stages,
  activeStepIndex,
  onStepClick
}) => {
  return (
    <nav
      aria-label="Pipeline Step Navigation"
      className="fixed top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-1.5 p-2 rounded-xl bg-[#080f18]/90 backdrop-blur-md border border-cyan-500/25 shadow-[0_0_24px_rgba(0,0,0,0.7)] right-3 transition-all"
      id="vertical-hud-nav"
    >
      <div className="font-label-sm text-[8px] text-cyan-400 font-bold text-center tracking-widest pb-1 border-b border-cyan-500/20 font-mono">
        NAV
      </div>
      
      {stages.map((stage, index) => {
        const isActive = index === activeStepIndex;
        const colorClasses = isActive
          ? 'text-primary-container bg-cyan-500/20 shadow-[0_0_10px_rgba(0,240,255,0.3)]'
          : 'text-on-surface-variant hover:bg-surface-variant/40 hover:text-cyan-200';
        
        const ringClasses = isActive
          ? 'ring-2 ring-cyan-200 bg-primary-container/20 text-primary-container scale-110 shadow-[0_0_8px_rgba(0,240,255,0.8)]'
          : 'ring-outline-variant/60 bg-surface-variant/30 text-on-surface-variant';

        return (
          <div key={stage.id} className="relative group flex items-center justify-end">
            {/* Tactical Micro-Tooltip (Hover left of node) */}
            <div className="pointer-events-none absolute right-full mr-2 px-2.5 py-1 rounded bg-[#091420]/95 border border-cyan-400/40 text-[10px] font-mono text-cyan-200 opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap shadow-[0_0_12px_rgba(0,240,255,0.2)] z-50 translate-x-1 group-hover:translate-x-0 flex items-center gap-1">
              <span className="text-primary-container font-bold">[{stage.stepNumber}]</span>
              <Skiper58 text={stage.title} active={isActive} />
            </div>

            <a
              className={`v-step-marker flex items-center gap-1.5 p-0.5 rounded transition-all cursor-pointer ${colorClasses}`}
              data-step-target={stage.id}
              href={`#${stage.id}`}
              onClick={(e) => {
                e.preventDefault();
                onStepClick(stage.id);
              }}
            >
              <span
                className={`w-5 h-5 rounded-full ring-1 flex items-center justify-center font-label-sm text-[9px] font-mono font-bold group-hover:scale-115 transition-transform ${ringClasses}`}
              >
                {stage.stepNumber}
              </span>
            </a>
          </div>
        );
      })}
    </nav>
  );
};
