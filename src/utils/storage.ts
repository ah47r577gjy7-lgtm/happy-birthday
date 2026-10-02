import { BirthdayConfig } from '../types/celebration';

import heroImg from '../assets/images/birthday_hero_portrait_1790957273166.jpg';
import photo1Img from '../assets/images/sonia_portrait_cafe_1790958261506.jpg';
import photo2Img from '../assets/images/sonia_portrait_garden_1790958280886.jpg';
import photo3Img from '../assets/images/birthday_memory_stargaze_1790957287633.jpg';
import photo4Img from '../assets/images/birthday_memory_sunset_1790957300280.jpg';
import photo5Img from '../assets/images/birthday_surprise_portrait_1790957312199.jpg';

export const DEFAULT_CONFIG: BirthdayConfig = {
  personName: 'SONIA',
  senderName: 'With all my heart',
  mainBirthdayMessage:
    "Today isn't just another day. It is the celebration of someone whose kindness, laughter, and rare warmth make the whole world a little softer and brighter. Thank you for being the magical presence you are.",
  soniaHeroPhoto: heroImg,
  soniaPhoto1: photo1Img,
  soniaPhoto2: photo2Img,
  soniaPhoto3: photo3Img,
  soniaPhoto4: photo4Img,
  soniaPhoto5: photo5Img,
  memory1Title: 'A beautiful memory',
  memory1Text: 'Some moments become special simply because you were there.',
  memory2Title: 'Another little moment',
  memory2Text: 'Some memories deserve to be kept forever.',
  memory3Title: 'One more reason to smile',
  memory3Text: "Here's to all the beautiful moments still waiting for you.",
  finalMessage: 'I hope this year brings you more happiness than you can imagine.',
  finalSignature: 'Made especially for you.',
};

const STORAGE_KEY = 'sonia_birthday_experience_v2';

export function loadConfig(): BirthdayConfig {
  if (typeof window === 'undefined') return DEFAULT_CONFIG;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_CONFIG;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_CONFIG,
      ...parsed,
    };
  } catch {
    return DEFAULT_CONFIG;
  }
}

export function saveConfig(config: BirthdayConfig): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (err) {
    console.warn('Storage quota exceeded or storage disabled', err);
  }
}

export function resetConfig(): BirthdayConfig {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
  return DEFAULT_CONFIG;
}
