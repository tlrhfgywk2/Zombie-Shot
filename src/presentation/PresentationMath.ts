import * as THREE from 'three';

export interface PresentationLayout {
  weaponRest: THREE.Vector3;
  weaponInsertion: THREE.Vector3;
  weaponAim: THREE.Vector3;
  magazineLoad: THREE.Vector3;
  magazineInspect: THREE.Vector3;
  pistolScale: number;
  magazineScale: number;
  cameraFov: number;
}

export const getPresentationLayout = (width: number, height: number): PresentationLayout => {
  const portrait = height > width;
  const shortLandscape = height < 500 && width > height;

  if (portrait) {
    return {
      weaponRest: new THREE.Vector3(0.38, 1.35, 3.65),
      weaponInsertion: new THREE.Vector3(0.05, 2.2, 2.2),
      weaponAim: new THREE.Vector3(0.38, 1.35, 3.65),
      magazineLoad: new THREE.Vector3(-0.32, 1.92, 4.04),
      magazineInspect: new THREE.Vector3(-0.24, 2.12, 3.98),
      pistolScale: 0.72,
      magazineScale: 0.82,
      cameraFov: 49,
    };
  }

  if (shortLandscape) {
    return {
      weaponRest: new THREE.Vector3(0.72, 1.12, 3.65),
      weaponInsertion: new THREE.Vector3(0.82, 3, 2.3),
      weaponAim: new THREE.Vector3(0.72, 1.12, 3.65),
      magazineLoad: new THREE.Vector3(-0.72, 2.18, 4.04),
      magazineInspect: new THREE.Vector3(-0.58, 2.32, 3.98),
      pistolScale: 0.82,
      magazineScale: 0.82,
      cameraFov: 46,
    };
  }

  return {
    weaponRest: new THREE.Vector3(0.58, 0.95, 3.65),
    weaponInsertion: new THREE.Vector3(0.78, 2.3, 2.6),
    weaponAim: new THREE.Vector3(0.58, 0.95, 3.65),
    magazineLoad: new THREE.Vector3(-1.08, 1.5, 4.04),
    magazineInspect: new THREE.Vector3(-0.88, 1.62, 3.98),
    pistolScale: 0.92,
    magazineScale: 1,
    cameraFov: 43,
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
