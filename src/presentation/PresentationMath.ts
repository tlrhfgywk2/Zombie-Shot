import * as THREE from 'three';
import { getResponsiveLayoutMode, type ResponsiveLayoutMode } from './ResponsiveLayout';

export interface PresentationLayout {
  mode: ResponsiveLayoutMode;
  weaponRest: THREE.Vector3;
  weaponInsertion: THREE.Vector3;
  weaponAim: THREE.Vector3;
  magazineLoad: THREE.Vector3;
  magazineInspect: THREE.Vector3;
  pistolScale: number;
  magazineScale: number;
  cartridgeScale: number;
  insertionScaleFactor: number;
  cameraFov: number;
  cameraPosition: THREE.Vector3;
  cameraTarget: THREE.Vector3;
}

export const getPresentationLayout = (width: number, height: number, modeOverride?: ResponsiveLayoutMode): PresentationLayout => {
  const tabletLandscapeStage = width >= 900 && width <= 1220 && height >= 420 && height <= 620;
  const mode: ResponsiveLayoutMode = modeOverride
    ?? (width <= 600 ? 'portrait' : tabletLandscapeStage ? 'tablet-landscape' : getResponsiveLayoutMode(width, height));

  if (mode === 'portrait') {
    return {
      mode,
      weaponRest: new THREE.Vector3(0.50, 1.65, 3.72),
      weaponInsertion: new THREE.Vector3(0.58, 1.82, 3.48),
      weaponAim: new THREE.Vector3(0.82, 1.55, 3.62),
      magazineLoad: new THREE.Vector3(-0.56, 2.08, 4.04),
      magazineInspect: new THREE.Vector3(-0.48, 2.3, 3.98),
      pistolScale: 0.5,
      magazineScale: 0.72,
      cartridgeScale: 0.88,
      insertionScaleFactor: 0.85,
      cameraFov: 48,
      cameraPosition: new THREE.Vector3(0, 2.15, 7.6),
      cameraTarget: new THREE.Vector3(0, 1.55, -4.4),
    };
  }

  if (mode === 'tablet-portrait') {
    return {
      mode,
      weaponRest: new THREE.Vector3(0.78, 1.38, 3.65),
      weaponInsertion: new THREE.Vector3(0.82, 1.58, 3.42),
      weaponAim: new THREE.Vector3(0.98, 1.16, 3.52),
      magazineLoad: new THREE.Vector3(-0.88, 1.72, 4.04),
      magazineInspect: new THREE.Vector3(-0.72, 1.86, 3.98),
      pistolScale: 0.68,
      magazineScale: 0.86,
      cartridgeScale: 0.96,
      insertionScaleFactor: 0.82,
      cameraFov: 47,
      cameraPosition: new THREE.Vector3(0, 2.15, 7.6),
      cameraTarget: new THREE.Vector3(0, 1.48, -4.4),
    };
  }

  if (mode === 'compact-landscape') {
    return {
      mode,
      weaponRest: new THREE.Vector3(1, 1.12, 3.65),
      weaponInsertion: new THREE.Vector3(0.92, 1.4, 3.38),
      weaponAim: new THREE.Vector3(1, 1.12, 3.58),
      magazineLoad: new THREE.Vector3(-0.72, 2.18, 4.04),
      magazineInspect: new THREE.Vector3(-0.58, 2.32, 3.98),
      pistolScale: 0.82,
      magazineScale: 0.82,
      cartridgeScale: 1.04,
      insertionScaleFactor: 0.78,
      cameraFov: 46,
      cameraPosition: new THREE.Vector3(0, 2.15, 7.6),
      cameraTarget: new THREE.Vector3(0, 1.4, -4.4),
    };
  }

  if (mode === 'tablet-landscape') {
    return {
      mode,
      weaponRest: new THREE.Vector3(1.05, 0.78, 3.45),
      weaponInsertion: new THREE.Vector3(1.18, 1.12, 3.22),
      weaponAim: new THREE.Vector3(1.12, 0.84, 3.4),
      magazineLoad: new THREE.Vector3(-1.28, 1.12, 4.04),
      magazineInspect: new THREE.Vector3(-1.05, 1.27, 3.98),
      pistolScale: 0.84,
      magazineScale: 0.92,
      cartridgeScale: 1.04,
      insertionScaleFactor: 0.84,
      cameraFov: 47,
      cameraPosition: new THREE.Vector3(0, 2.15, 7.6),
      cameraTarget: new THREE.Vector3(0, 1.36, -4.4),
    };
  }

  return {
    mode,
    weaponRest: new THREE.Vector3(1.05, 1.55, 3.62),
    weaponInsertion: new THREE.Vector3(0.95, 1.45, 3.35),
    weaponAim: new THREE.Vector3(1.15, 0.95, 3.56),
    magazineLoad: new THREE.Vector3(-1.08, 1.5, 4.04),
    magazineInspect: new THREE.Vector3(-0.88, 1.62, 3.98),
    pistolScale: 0.78,
    magazineScale: 1,
    cartridgeScale: 1.12,
    insertionScaleFactor: 0.85,
    cameraFov: 43,
    cameraPosition: new THREE.Vector3(0, 2.15, 7.6),
    cameraTarget: new THREE.Vector3(0, 1.4, -4.4),
  };
};

export const constrainWeaponPosition = (position: THREE.Vector3, layout: PresentationLayout): THREE.Vector3 => {
  const horizontalMargin = 0.18;
  const verticalMargin = 0.3;
  const depthMargin = 0.35;
  return position.set(
    THREE.MathUtils.clamp(position.x, Math.min(layout.weaponRest.x, layout.weaponAim.x) - horizontalMargin, Math.max(layout.weaponRest.x, layout.weaponAim.x) + horizontalMargin),
    THREE.MathUtils.clamp(position.y, Math.min(layout.weaponRest.y, layout.weaponAim.y) - verticalMargin, Math.max(layout.weaponRest.y, layout.weaponAim.y) + verticalMargin),
    THREE.MathUtils.clamp(position.z, Math.min(layout.weaponRest.z, layout.weaponAim.z) - depthMargin, Math.max(layout.weaponRest.z, layout.weaponAim.z) + depthMargin),
  );
};

export const getAimQuaternion = (origin: THREE.Vector3, target: THREE.Vector3): THREE.Quaternion => {
  const forward = target.clone().sub(origin).normalize();
  const referenceUp = Math.abs(forward.y) > 0.98
    ? new THREE.Vector3(0, 0, 1)
    : new THREE.Vector3(0, 1, 0);
  const localZ = forward.clone().cross(referenceUp).normalize();
  const localY = localZ.clone().cross(forward).normalize();
  const basis = new THREE.Matrix4().makeBasis(forward, localY, localZ);
  return new THREE.Quaternion().setFromRotationMatrix(basis);
};
