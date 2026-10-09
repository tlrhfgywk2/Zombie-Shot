import { createAmmoBuild, type AmmoBuild } from './ammoDefinitions';
import type { WeaponId } from './weaponDefinitions';

export type GameMode = 'free' | 'startingAmmo';
export const GAME_MODE_NAMES: Record<GameMode, string> = {
  free: '프리 모드', startingAmmo: '초기 탄약 지급',
};

/** 표준탄은 모든 모드에서 무제한이며, 여기에 없는 특수탄은 0발로 시작한다. */
export const STARTING_AMMO_LOADOUTS: Record<WeaponId, Readonly<Partial<AmmoBuild>>> = {
  p220: { opening: 1, flatNose: 2 },
  m1911: { finisher: 1, wounding: 2 },
  desertEagle: { plusP: 1, lowRecoil: 2 },
  m500: { lightLoad: 1, relay: 1 },
};

export const createRunAmmoBuild = (mode: GameMode, weapon: WeaponId): AmmoBuild =>
  mode === 'startingAmmo' ? createAmmoBuild(STARTING_AMMO_LOADOUTS[weapon]) : createAmmoBuild();
