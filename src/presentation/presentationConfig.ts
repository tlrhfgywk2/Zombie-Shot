export const PRESENTATION_TIMING = {
  weaponReloadTransition: 280,
  roundInsert: 210,
  roundSettle: 55,
  magazineInspectMove: 240,
  magazineInspectHold: 560,
  magazineApproach: 360,
  magazineSeat: 210,
  magazineSeatingPause: 90,
  slidePull: 180,
  slideHold: 65,
  slideRelease: 135,
  readySettle: 220,
  shotTravel: 185,
  shotSettle: 120,
  reacquireBase: 170,
  reacquirePerRecoil: 45,
  hitReaction: 145,
  burnPulse: 480,
  advance: 600,
  death: 650,
  spawn: 480,
} as const;

export const PRESENTATION_MOTION = {
  magazineApproachDistance: 0.72,
  slideTravel: 0.34,
  weaponRecoil: 0.19,
  cameraShake: 0.032,
  hitLean: 0.11,
} as const;

export const PRESENTATION_EFFECTS = {
  smokePoolSize: 6,
  smokeLifetime: 900,
  smokeInitialScale: 0.15,
  smokeExpansion: 1.05,
  smokeInitialOpacity: 0.5,
  smokeFadeDelay: 0.2,
  smokeMuzzleOffset: 0.16,
  smokeForwardSpeed: 0.42,
  smokeUpSpeed: 0.38,
  smokeOutwardSpeed: 0.16,
  casingPoolSize: 6,
  casingLifetime: 950,
  casingScale: 0.78,
  casingGravity: 2.8,
  casingBackwardSpeed: 0.28,
  casingUpSpeed: 1.05,
  casingOutwardSpeed: 1.2,
} as const;

export const getReacquisitionDuration = (accumulatedRecoil: number): number => {
  if (!Number.isFinite(accumulatedRecoil) || accumulatedRecoil < 0) throw new Error('재조준 시간에는 0 이상의 누적 반동이 필요합니다.');
  return Math.round(PRESENTATION_TIMING.reacquireBase + accumulatedRecoil * PRESENTATION_TIMING.reacquirePerRecoil);
};
