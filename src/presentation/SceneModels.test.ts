import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { createMagazineModel, createPistolModel } from './SceneModels';

describe('권총 모델 기준점', () => {
  it('총구는 총열의 +X 전방에 있고 명시적으로 이름 붙어 있다', () => {
    const pistol = createPistolModel();

    expect(pistol.muzzle.name).toBe('muzzle');
    expect(pistol.muzzle.position.x).toBeGreaterThan(1);
    expect(pistol.muzzle.parent).toBe(pistol.root);
  });

  it('탄창 착좌 기준면은 손잡이 바닥에 있고 탄피 배출구는 슬라이드의 보이는 측면에 있다', () => {
    const pistol = createPistolModel();

    expect(pistol.magazineSeatAnchor.name).toBe('magazineSeatAnchor');
    expect(pistol.magazineSeatAnchor.parent?.parent).toBe(pistol.root);
    expect(pistol.magazineSeatAnchor.position.x).toBe(0);
    expect(pistol.magazineSeatAnchor.position.y).toBeCloseTo(-0.97);
    expect(pistol.ejectionPort.name).toBe('ejectionPort');
    expect(pistol.ejectionPort.parent).toBe(pistol.slide);
    expect(pistol.ejectionPort.position.y).toBeGreaterThan(0.6);
    expect(pistol.ejectionPort.position.z).toBeGreaterThan(0.2);
  });

  it('탄창 삽입 기준면은 몸체 하단과 바닥판이 만나는 위치에 있다', () => {
    const magazine = createMagazineModel();

    expect(magazine.magazineInsertAnchor.name).toBe('magazineInsertAnchor');
    expect(magazine.magazineInsertAnchor.parent).toBe(magazine.root);
    expect(magazine.magazineInsertAnchor.position.x).toBe(0);
    expect(magazine.magazineInsertAnchor.position.y).toBeCloseTo(-0.56);
    expect(magazine.magazineInsertAnchor.position.z).toBe(0);
  });

  it('회전·스케일된 권총에서도 두 착좌 기준면을 정확히 일치시킨다', () => {
    const pistol = createPistolModel();
    const magazine = createMagazineModel();
    pistol.root.position.set(0.8, 2.3, 2.6);
    pistol.root.rotation.set(-0.02, -0.04, -0.08);
    pistol.root.scale.setScalar(0.66);
    pistol.magazineSeatAnchor.add(magazine.root);
    magazine.root.position.copy(magazine.magazineInsertAnchor.position).multiplyScalar(-1);
    pistol.root.updateMatrixWorld(true);
    const seat = new THREE.Vector3();
    const insert = new THREE.Vector3();

    pistol.magazineSeatAnchor.getWorldPosition(seat);
    magazine.magazineInsertAnchor.getWorldPosition(insert);

    expect(insert.distanceTo(seat)).toBeLessThan(0.000001);
    expect(magazine.root.quaternion.equals(new THREE.Quaternion())).toBe(true);
    expect(magazine.root.scale.equals(new THREE.Vector3(1, 1, 1))).toBe(true);
  });
});
