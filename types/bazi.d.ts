// types/bazi.d.ts
export { };

declare global {

  /** Canonical pillar keys used across the app. */
  type PillarName = 'year' | 'month' | 'day' | 'hour';

  /** Raw pillar (engine-friendly). */
  interface RawPillar {
    stem: Gan;
    branch: Zhi;
  }

  /** Four pillars in raw form keyed by pillar name. */
  type RawFourPillars = Record<PillarName, RawPillar>;

  interface BaZiLunarDate {
    lunarYear: number;
    lunarMonth: number;
    lunarDay: number;
    lunarHour: number;
    lunarMinute: number;
    lunarSecond: number;
  }

  interface ProfilenIput {
    year: number;
    month: number;
    day: number;
    hour?: number;
    minute?: number;
    second?: number;
    timezone?: string;
    gender: 'male' | 'female';
    locale?: Locale;
  }
}


