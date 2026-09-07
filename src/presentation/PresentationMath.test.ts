import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { anchorPresentationLayoutToStage, constrainWeaponPosition, getAimQuaternion, getPresentationLayout, PRESENTATION_STAGE_ANCHORS } from './PresentationMath';
import { getResponsiveLayoutMode } from './ResponsiveLayout';

const expectScreenAnchor = (position: THREE.Vector3, camera: THREE.PerspectiveCamera, anchor: { x: number; y: number }): void => {
  const projected = position.project(camera);
  expect(projected.x * 0.5 + 0.5).toBeCloseTo(anchor.x, 3);
  expect(-projected.y * 0.5 + 0.5).toBeCloseTo(anchor.y, 3);
};

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

  it.each([
    [360, 380, 'portrait'],
    [709, 602, 'tablet-portrait'],
    [1180, 524, 'tablet-landscape'],
    [844, 260, 'compact-landscape'],
    [1440, 570, 'desktop'],
  ] as const)('%d×%d 전투 영역에서 총과 탄창을 하단 패널 기준 화면 앵커에 고정한다', (width, height, mode) => {
    const layout = getPresentationLayout(width, height, mode);
    const camera = new THREE.PerspectiveCamera(layout.cameraFov, width / height, 0.1, 100);
    camera.position.copy(layout.cameraPosition);
    camera.lookAt(layout.cameraTarget);
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld(true);
    const weaponAnchor = new THREE.Vector3(-0.46, -0.92, 0);
    const magazineAnchor = new THREE.Vector3(0, -0.7, 0);
    const aimTarget = new THREE.Vector3(0, 1.05, -5.8);
    anchorPresentationLayoutToStage(layout, camera, weaponAnchor, magazineAnchor, aimTarget);

    const expectPoseAnchor = (position: THREE.Vector3, quaternion: THREE.Quaternion, scale: number, localAnchor: THREE.Vector3, anchor: { x: number; y: number }): void => {
      expectScreenAnchor(localAnchor.clone().multiplyScalar(scale).applyQuaternion(quaternion).add(position), camera, anchor);
    };
    const resting = new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.02, -0.04, -0.08));
    const magazineLoad = new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.04, 0.02, -0.12));
    const magazineInspect = new THREE.Quaternion().setFromEuler(new THREE.Euler(0.015, -0.08, 0.035));

    expectPoseAnchor(layout.weaponRest, resting, layout.pistolScale, weaponAnchor, PRESENTATION_STAGE_ANCHORS.weaponRest);
    expectPoseAnchor(layout.weaponInsertion, resting, layout.pistolScale * layout.insertionScaleFactor, weaponAnchor, PRESENTATION_STAGE_ANCHORS.weaponInsertion);
    expectPoseAnchor(layout.weaponAim, getAimQuaternion(layout.weaponAim, aimTarget), layout.pistolScale, weaponAnchor, PRESENTATION_STAGE_ANCHORS.weaponAim);
    expectPoseAnchor(layout.magazineLoad, magazineLoad, layout.magazineScale, magazineAnchor, PRESENTATION_STAGE_ANCHORS.magazineLoad);
    expectPoseAnchor(layout.magazineInspect, magazineInspect, layout.magazineScale, magazineAnchor, PRESENTATION_STAGE_ANCHORS.magazineInspect);
    expect(layout.weaponInsertion.distanceTo(layout.weaponRest)).toBeLessThan(0.5);
  });
});
