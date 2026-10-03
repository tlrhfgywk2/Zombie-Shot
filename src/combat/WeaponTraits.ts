import type { AmmoDefinition } from '../data/ammoDefinitions';
import type { WeaponDefinition } from '../data/weaponDefinitions';
import type { AmmoFamily, AmmoType } from './types';

/** 탄약 원본을 변경하지 않고 명시된 주효과 하나만 조정한다. */
export function weaponPayload(ammo: AmmoDefinition, weapon: WeaponDefinition, previousFamily?: AmmoFamily,
  boostedOpening = false): { firepower: number; wound: number; explosive: number; burn: number; actionShock: number; traitBonus: number } {
  const payload = { firepower: Math.max(0, ammo.firepower + weapon.firepowerAdjustment),
    wound: ammo.wound, explosive: ammo.explosive, burn: ammo.burn, actionShock: ammo.actionShock, traitBonus: 0 };
  const key = ammo.primaryPayload;
  if (weapon.trait === 'familyChain' && previousFamily === ammo.family) {
    payload[key] += 1;
    payload.traitBonus = 1;
  } else if (weapon.trait === 'cylinder' && boostedOpening) {
    const initial = payload[key];
    payload[key] = Math.floor(initial * 1.5 + 0.5 + Number.EPSILON);
    payload.traitBonus = payload[key] - initial;
  }
  return payload;
}

/** 모든 탄을 섞지 않고 선택한 시작 칸으로 원형 배열을 회전한다. */
export function spinCylinder(rounds: readonly AmmoType[], random: () => number = Math.random): AmmoType[] {
  if (rounds.length < 2) return [...rounds];
  const roll = random();
  if (!Number.isFinite(roll) || roll < 0 || roll >= 1) throw new Error('회전 난수는 0 이상 1 미만이어야 합니다.');
  const start = 1 + Math.floor(roll * (rounds.length - 1));
  return [...rounds.slice(start), ...rounds.slice(0, start)];
}
