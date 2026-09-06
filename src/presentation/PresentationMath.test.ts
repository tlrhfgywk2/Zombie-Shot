import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { constrainWeaponPosition, getAimQuaternion, getPresentationLayout } from './PresentationMath';
import { getResponsiveLayoutMode } from './ResponsiveLayout';

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
    [390, 397],
    [360, 800],
    [412, 915],
    [430, 932],
    [844, 390],
    [1180, 524],
  ])('%d×%d에서 장전 중 권총을 조준·대기 위치의 안전 범위에 유지한다', (width, height) => {
    const layout = getPresentationLayout(width, height);
    expect(layout.weaponInsertion.distanceTo(layout.weaponRest)).toBeLessThan(0.75);
    expect(layout.weaponInsertion.y).toBeLessThanOrEqual(Math.max(layout.weaponRest.y, layout.weaponAim.y) + 0.3);
    expect(layout.magazineLoad.y).toBeGreaterThan(1);
    expect(layout.magazineInspect.y).toBeGreaterThanOrEqual(layout.magazineLoad.y);
  });

  it('Portrait 전용 좌표와 스케일을 사용한다', () => {
    const portrait = getPresentationLayout(390, 844);
    const desktop = getPresentationLayout(1280, 720);

    expect(portrait.mode).toBe('portrait');
    expect(portrait.weaponAim.y).toBeGreaterThan(desktop.weaponAim.y);
    expect(portrait.weaponAim.x).toBeGreaterThan(0.75);
    expect(desktop.weaponAim.x).toBeGreaterThan(1);
    expect(portrait.pistolScale).toBeLessThan(desktop.pistolScale);
    expect(portrait.cameraTarget.y).toBeGreaterThan(desktop.cameraTarget.y);
    expect(portrait.cartridgeScale).toBeLessThan(desktop.cartridgeScale);
    expect(portrait.insertionScaleFactor).toBeLessThanOrEqual(desktop.insertionScaleFactor);
  });

  it('세로 화면에서 준비 패널을 제외한 짧은 전투 영역도 세로 구도를 유지한다', () => {
    expect(getPresentationLayout(390, 397).mode).toBe('portrait');
    expect(getPresentationLayout(390, 397).pistolScale).toBe(0.5);
  });

  it('아이패드 가로 게임 영역에서는 낮고 비스듬한 전용 포즈를 사용한다', () => {
    const layout = getPresentationLayout(1180, 524);

    expect(layout.mode).toBe('tablet-landscape');
    expect(layout.weaponAim.x).toBeGreaterThan(1);
    expect(layout.weaponInsertion.y).toBeLessThan(1.8);
    expect(layout.pistolScale).toBeLessThan(0.9);
  });

  it('세로 태블릿은 전투 영역의 가로 비율과 무관하게 태블릿 세로 포즈를 사용한다', () => {
    const viewportMode = getResponsiveLayoutMode(709, 1536);
    const layout = getPresentationLayout(709, 602, viewportMode);

    expect(viewportMode).toBe('tablet-portrait');
    expect(layout.mode).toBe('tablet-portrait');
    expect(layout.weaponInsertion.y).toBeLessThan(1.7);
  });

  it('예상 밖 좌표도 현재 레이아웃의 권총 모션 범위로 제한한다', () => {
    const layout = getPresentationLayout(709, 602, 'tablet-portrait');
    const constrained = constrainWeaponPosition(new THREE.Vector3(-9, 12, -4), layout);

    expect(constrained.x).toBeGreaterThan(0.5);
    expect(constrained.y).toBeLessThanOrEqual(Math.max(layout.weaponRest.y, layout.weaponAim.y) + 0.3);
    expect(constrained.z).toBeGreaterThan(3);
  });
});
