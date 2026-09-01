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

export const getPresentationLayout = (width: number, height: number): PresentationLayout => {
  const mode = getResponsiveLayoutMode(width, height);

  if (mode === 'portrait') {
    return {
      mode,
      weaponRest: new THREE.Vector3(0.3, 2.02, 3.72),
      weaponInsertion: new THREE.Vector3(0.02, 2.64, 2.4),
      weaponAim: new THREE.Vector3(0.55, 1.94, 3.68),
      magazineLoad: new THREE.Vector3(-0.56, 2.08, 4.04),
      magazineInspect: new THREE.Vector3(-0.48, 2.3, 3.98),
      pistolScale: 0.58,
      magazineScale: 0.72,
      cartridgeScale: 0.88,
      insertionScaleFactor: 0.58,
      cameraFov: 48,
      cameraPosition: new THREE.Vector3(0, 2.15, 7.6),
      cameraTarget: new THREE.Vector3(0, 1.55, -4.4),
    };
  }

  if (mode === 'compact-landscape') {
    return {
      mode,
      weaponRest: new THREE.Vector3(0.72, 1.12, 3.65),
      weaponInsertion: new THREE.Vector3(0.82, 3, 2.3),
      weaponAim: new THREE.Vector3(0.72, 1.12, 3.65),
      magazineLoad: new THREE.Vector3(-0.72, 2.18, 4.04),
      magazineInspect: new THREE.Vector3(-0.58, 2.32, 3.98),
      pistolScale: 0.82,
      magazineScale: 0.82,
      cartridgeScale: 1.04,
      insertionScaleFactor: 0.52,
      cameraFov: 46,
      cameraPosition: new THREE.Vector3(0, 2.15, 7.6),
      cameraTarget: new THREE.Vector3(0, 1.4, -4.4),
    };
  }

  return {
    mode,
    weaponRest: new THREE.Vector3(0.58, 0.95, 3.65),
    weaponInsertion: new THREE.Vector3(0.78, 2.3, 2.6),
    weaponAim: new THREE.Vector3(0.58, 0.95, 3.65),
    magazineLoad: new THREE.Vector3(-1.08, 1.5, 4.04),
    magazineInspect: new THREE.Vector3(-0.88, 1.62, 3.98),
    pistolScale: 0.92,
    magazineScale: 1,
    cartridgeScale: 1.12,
    insertionScaleFactor: 0.72,
    cameraFov: 43,
    cameraPosition: new THREE.Vector3(0, 2.15, 7.6),
    cameraTarget: new THREE.Vector3(0, 1.4, -4.4),
  };
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
