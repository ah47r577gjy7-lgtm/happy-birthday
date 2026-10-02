export interface BirthdayConfig {
  personName: string;
  senderName: string;
  mainBirthdayMessage: string;
  soniaHeroPhoto: string;
  soniaPhoto1: string;
  soniaPhoto2: string;
  soniaPhoto3: string;
  soniaPhoto4: string;
  soniaPhoto5: string;
  memory1Title: string;
  memory1Text: string;
  memory2Title: string;
  memory2Text: string;
  memory3Title: string;
  memory3Text: string;
  finalMessage: string;
  finalSignature: string;
}

export type ScreenId = 'screen1' | 'screen2' | 'screen3' | 'screen4';

export interface CelebrationParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  rotation: number;
  rotationSpeed: number;
  type: 'confetti' | 'heart' | 'sparkle' | 'star' | 'firework';
  life?: number;
  maxLife?: number;
}
