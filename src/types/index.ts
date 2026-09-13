export type StageStatus = 'VERIFIED' | 'ACTIVE PROGRESS' | 'QUEUED FOR RELEASE';

export type StageLayout = 'left' | 'center' | 'right';

export interface StageStat {
  label: string;
  value: string;
  isPrimary?: boolean;
}

export interface PipelineStage {
  id: string;
  stepNumber: string;
  category: string;
  title: string;
  status: StageStatus;
  layout: StageLayout;
  featured?: boolean;
  whatThisDoes: string;
  whatWeveDone: string;
  stack: string;
  stats: StageStat[];
  media: {
    imageUrl: string;
    imageAlt: string;
    tagTopLeft?: string;
    tagTopRight?: string;
    tagBottomLeft?: string;
    tagBottomRight?: string;
    bottomMetaLeft?: string;
    bottomMetaRight?: string;
  };
}

export interface TeamMember {
  id: string;
  name: string;
  username: string;
  password?: string;
  step?: string;
  roleTitle?: string;
  specialty?: string;
  description?: string;
  callsign?: string;
  status?: 'VERIFIED' | 'DEPLOYED' | 'ACTIVE' | 'STANDBY';
}

export interface MissionMetric {
  label: string;
  value: string;
  subValue: string;
  highlightColor?: string;
}

export interface LightboxImage {
  src: string;
  alt: string;
  caption?: string;
  anchorRect?: DOMRect;
}
