export const PRESENTATION_TIMING = {
  roundInsert: 210,
  roundSettle: 55,
  magazineApproach: 360,
  magazineSeat: 115,
  slidePull: 180,
  slideHold: 65,
  slideRelease: 135,
  readySettle: 120,
  shotTravel: 185,
  shotSettle: 120,
  betweenShots: 170,
  hitReaction: 145,
  burnPulse: 480,
  advance: 600,
  death: 650,
  spawn: 480,
} as const;

export const PRESENTATION_MOTION = {
  slideTravel: 0.34,
  weaponRecoil: 0.19,
  cameraShake: 0.032,
  hitLean: 0.11,
} as const;
