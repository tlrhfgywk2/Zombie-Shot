import { describe, expect, it } from 'vitest';
import { createMagazineModel, createPistolModel, createZombieModel } from './SceneModels';
import { WeaponHeatVisual } from './WeaponHeatVisual';

describe('무기 열 연출', () => {
  it('모든 총기 재질이 단계적으로 가열되고 다른 모델의 재질은 유지된다', () => {
    const pistol = createPistolModel();
    const otherPistol = createPistolModel();
    const unrelated = [otherPistol.gripBody.material, createMagazineModel().body.material, createZombieModel().torso.material];
    const visual = new WeaponHeatVisual(pistol.materials);
    const snapshots = unrelated.map(material => JSON.stringify(material));
    const original = pistol.materials.map(material => material.color.clone());
    let previousGlow = pistol.materials.map(() => 0);
    for (const heat of [25, 50, 100, 150]) {
      visual.setHeat(heat);
      visual.update(2);
      const glow = pistol.materials.map((material, index) => {
        expect(material.color.equals(original[index]!)).toBe(false);
        const red = material.emissive.r * material.emissiveIntensity;
        expect(red).toBeGreaterThan(previousGlow[index]!);
        return red;
      });
      previousGlow = glow;
    }
    visual.setHeat(250, true);
    expect(pistol.materials.map(material => material.emissive.r)).toEqual(previousGlow);
    expect(unrelated.map(material => JSON.stringify(material))).toEqual(snapshots);
  });

  it('냉각을 보간하고 초기화하면 원래 색과 발광을 즉시 복원한다', () => {
    const pistol = createPistolModel();
    const material = pistol.materials[0]!;
    material.emissive.setHex(0x000511);
    material.emissiveIntensity = 0.4;
    const original = pistol.materials.map(surface => JSON.stringify(surface));
    const visual = new WeaponHeatVisual(pistol.materials);
    visual.setHeat(100, true);
    const hot = material.emissive.r;
    visual.setHeat(50);
    expect(material.emissive.r).toBe(hot);
    visual.update(0.05);
    expect(material.emissive.r).toBeLessThan(hot);
    const cooling = material.emissive.r;
    visual.update(1);
    expect(material.emissive.r).toBeLessThan(cooling);
    visual.setHeat(0, true);
    visual.update(1);
    expect(pistol.materials.map(surface => JSON.stringify(surface))).toEqual(original);
  });
});
