export const GUN_HANDLING_PRESENTATION_SPEED = 1.5;

const gunHandlingDuration = (originalDuration: number): number =>
  Math.round(originalDuration / GUN_HANDLING_PRESENTATION_SPEED);

export const PRESENTATION_TIMING = {
  weaponReloadTransition: gunHandlingDuration(280),
  magazinePresent: gunHandlingDuration(210),
  roundInsert: gunHandlingDuration(210),
  roundSettle: gunHandlingDuration(55),
  magazineInspectMove: gunHandlingDuration(240),
  magazineInspectHold: gunHandlingDuration(560),
  magazineApproach: gunHandlingDuration(360),
  magazineSeat: gunHandlingDuration(210),
  magazineSeatingPause: gunHandlingDuration(90),
  slidePull: gunHandlingDuration(180),
  slideHold: gunHandlingDuration(65),
  slideRelease: gunHandlingDuration(135),
  chamberCheckMove: gunHandlingDuration(105),
  chamberCheckHold: gunHandlingDuration(45),
  chamberCheckReturn: gunHandlingDuration(90),
  roughAim: gunHandlingDuration(210),
  preciseAim: gunHandlingDuration(135),
  shotTravel: gunHandlingDuration(185),
  shotSettle: gunHandlingDuration(120),
  reacquireBase: gunHandlingDuration(170),
  reacquirePerRecoil: gunHandlingDuration(45),
  hitReaction: gunHandlingDuration(145),
  impact: gunHandlingDuration(170),
  magazineRelease: gunHandlingDuration(95),
  magazineDiscard: gunHandlingDuration(360),
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
  smokeLifetime: gunHandlingDuration(900),
  smokeInitialScale: 0.15,
  smokeExpansion: 1.05,
  smokeInitialOpacity: 0.5,
  smokeFadeDelay: 0.2,
  smokeMuzzleOffset: 0.16,
  smokeForwardSpeed: 0.42,
  smokeUpSpeed: 0.38,
  smokeOutwardSpeed: 0.16,
  casingPoolSize: 6,
  casingLifetime: gunHandlingDuration(950),
  casingScale: 0.78,
  casingGravity: 2.8,
  casingBackwardSpeed: 0.28,
  casingUpSpeed: 1.05,
  casingOutwardSpeed: 1.2,
} as const;

export const getReacquisitionDuration = (visualKickStrength: number): number => {
  if (!Number.isFinite(visualKickStrength) || visualKickStrength < 0) throw new Error('재조준 시간에는 0 이상의 연출 강도이 필요합니다.');
  return Math.round(PRESENTATION_TIMING.reacquireBase + visualKickStrength * PRESENTATION_TIMING.reacquirePerRecoil);
};
