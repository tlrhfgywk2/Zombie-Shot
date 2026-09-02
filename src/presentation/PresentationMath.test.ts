import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { getAimQuaternion, getPresentationLayout } from './PresentationMath';

describe('프레젠테이션 좌표 계산', () => {
  it('권총의 실제 +X 총열 축을 표적 중심으로 정렬한다', () => {
    const origin = new THREE.Vector3(0.7, 1.1, 3.7);
    const target = new THREE.Vector3(-0.2, 1.05, -5.8);
    const quaternion = getAimQuaternion(origin, target);
    const barrelDirection = new THREE.Vector3(1, 0, 0).applyQuaternion(quaternion);
    const expected = target.clone().sub(origin).normalize();

    expect(barrelDirection.angleTo(expected)).toBeLessThan(0.000001);
    expect(new THREE.Vector3(0, 1, 0).applyQuaternion(quaternion).y).toBeGreaterThan(0.9);
  });

  it.each([
    [1920, 1080],
    [1280, 720],
    [768, 1024],
    [390, 844],
    [360, 800],
    [412, 915],
    [430, 932],
    [844, 390],
  ])('%d×%d에서 삽입 포즈를 장전 포즈보다 높게 둔다', (width, height) => {
    const layout = getPresentationLayout(width, height);
    expect(layout.weaponInsertion.y).toBeGreaterThan(layout.weaponRest.y + 0.5);
    expect(layout.magazineLoad.y).toBeGreaterThan(1);
    expect(layout.magazineInspect.y).toBeGreaterThanOrEqual(layout.magazineLoad.y);
  });

  it('Portrait 전용 좌표와 스케일을 사용한다', () => {
    const portrait = getPresentationLayout(390, 844);
    const desktop = getPresentationLayout(1280, 720);

    expect(portrait.mode).toBe('portrait');
    expect(portrait.weaponAim.y).toBeGreaterThan(desktop.weaponAim.y);
    expect(portrait.weaponAim.x).toBeGreaterThan(desktop.weaponAim.x);
    expect(portrait.pistolScale).toBeLessThan(desktop.pistolScale);
    expect(portrait.cameraTarget.y).toBeGreaterThan(desktop.cameraTarget.y);
    expect(portrait.cartridgeScale).toBeLessThan(desktop.cartridgeScale);
    expect(portrait.insertionScaleFactor).toBeLessThan(desktop.insertionScaleFactor);
  });
});
