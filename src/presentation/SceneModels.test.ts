import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { ATTACHMENT_DEFINITIONS, ATTACHMENT_ORDER } from '../data/attachmentDefinitions';
import { createAttachmentModel, createMagazineModel, createPistolModel, createZombieModel } from './SceneModels';

describe('권총 모델 기준점', () => {
  it('총구는 총열의 +X 전방에 있고 명시적으로 이름 붙어 있다', () => {
    const pistol = createPistolModel();

    expect(pistol.muzzle.name).toBe('muzzle');
    expect(pistol.muzzle.position.x).toBeGreaterThan(1);
    expect(pistol.muzzle.parent).toBe(pistol.root);
  });

  it('탄창 착좌 기준점은 프레임 아래 내부 스톱에 있고 탄피 배출구는 슬라이드의 보이는 측면에 있다', () => {
    const pistol = createPistolModel();

    expect(pistol.magazineSeatAnchor.name).toBe('magazineSeatAnchor');
    expect(pistol.magazineSeatAnchor.parent?.parent).toBe(pistol.root);
    expect(pistol.magazineSeatAnchor.position.x).toBe(0);
    expect(pistol.magazineSeatAnchor.position.y).toBeCloseTo(0.32);
    expect(pistol.ejectionPort.name).toBe('ejectionPort');
    expect(pistol.ejectionPort.parent).toBe(pistol.slide);
    expect(pistol.ejectionPort.position.y).toBeGreaterThan(0.6);
    expect(pistol.ejectionPort.position.z).toBeGreaterThan(0.2);
  });

  it('탄창 삽입 기준점은 회전된 급탄부의 실제 상단에 있다', () => {
    const magazine = createMagazineModel();

    expect(magazine.magazineInsertAnchor.name).toBe('magazineInsertAnchor');
    expect(magazine.magazineInsertAnchor.parent).toBe(magazine.root);
    expect(magazine.magazineInsertAnchor.position.x).toBe(0);
    expect(magazine.magazineInsertAnchor.position.y).toBeCloseTo(0.655);
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

  it('착좌 시 몸체는 손잡이 안에 있고 바닥판만 아래로 남는다', () => {
    const pistol = createPistolModel();
    const magazine = createMagazineModel();
    pistol.magazineSeatAnchor.add(magazine.root);
    magazine.root.position.copy(magazine.magazineInsertAnchor.position).multiplyScalar(-1);
    pistol.root.updateMatrixWorld(true);
    const gripBounds = new THREE.Box3().setFromObject(pistol.gripBody);
    const bodyBounds = new THREE.Box3().setFromObject(magazine.body);
    const baseBounds = new THREE.Box3().setFromObject(magazine.basePlate);
    const bodyCenterInGrip = pistol.grip.worldToLocal(magazine.body.getWorldPosition(new THREE.Vector3()));

    expect(bodyBounds.min.y).toBeGreaterThan(gripBounds.min.y);
    expect(baseBounds.min.y).toBeLessThan(gripBounds.min.y);
    expect(bodyCenterInGrip.x).toBeCloseTo(pistol.gripBody.position.x);
    expect(bodyCenterInGrip.z).toBeCloseTo(pistol.gripBody.position.z);
  });

  it('다섯 장착물 소켓이 권총 루트에 명시적으로 고정된다', () => {
    const pistol = createPistolModel();
    expect(Object.keys(pistol.attachmentSockets)).toEqual(['muzzle', 'magazine', 'optic', 'rail', 'grip']);
    for (const socket of Object.values(pistol.attachmentSockets)) {
      expect(socket.name).toMatch(/^attachmentSocket/);
      expect(socket.parent).toBe(pistol.root);
    }
  });

  it.each(ATTACHMENT_ORDER)('%s 장착물은 해당 물리 슬롯에 배치 가능한 모델을 만든다', (id) => {
    const pistol = createPistolModel();
    const model = createAttachmentModel(id);
    pistol.attachmentSockets[ATTACHMENT_DEFINITIONS[id].slot].add(model);
    expect(model.children.length).toBeGreaterThan(0);
    expect(model.parent).toBe(pistol.attachmentSockets[ATTACHMENT_DEFINITIONS[id].slot]);
  });

  it('특수 위협 표식은 일반 상태에서 숨겨진 채 좀비에 부착된다', () => {
    const zombie = createZombieModel();
    expect(zombie.threatHalo.name).toBe('specialThreatHalo');
    expect(zombie.threatHalo.visible).toBe(false);
    expect(zombie.threatHalo.parent).toBe(zombie.root);
  });
});
