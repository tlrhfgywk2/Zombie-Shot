import * as THREE from 'three';
import type { AmmoType } from '../combat/types';
import { AMMO_DEFINITIONS } from '../data/ammoDefinitions';

export interface PistolModel {
  root: THREE.Group;
  slide: THREE.Group;
  muzzle: THREE.Object3D;
  magazineSocket: THREE.Object3D;
}

export interface MagazineModel {
  root: THREE.Group;
  roundDisplay: THREE.Group;
}

export interface ZombieModel {
  root: THREE.Group;
  torso: THREE.Mesh;
  head: THREE.Group;
  leftArm: THREE.Group;
  rightArm: THREE.Group;
  leftLeg: THREE.Group;
  rightLeg: THREE.Group;
}

const mesh = (geometry: THREE.BufferGeometry, material: THREE.Material, castShadow = true): THREE.Mesh => {
  const result = new THREE.Mesh(geometry, material);
  result.castShadow = castShadow;
  return result;
};

export const createPistolModel = (): PistolModel => {
  const root = new THREE.Group();
  const slide = new THREE.Group();
  const frameMaterial = new THREE.MeshStandardMaterial({ color: 0x242c29, roughness: 0.45, metalness: 0.66 });
  const slideMaterial = new THREE.MeshStandardMaterial({ color: 0x59645f, roughness: 0.27, metalness: 0.82 });
  const darkMetal = new THREE.MeshStandardMaterial({ color: 0x101614, roughness: 0.34, metalness: 0.72 });
  const polymer = new THREE.MeshStandardMaterial({ color: 0x121816, roughness: 0.87, metalness: 0.05 });
  const accent = new THREE.MeshStandardMaterial({ color: 0xb4da43, roughness: 0.46, metalness: 0.25, emissive: 0x243607, emissiveIntensity: 0.25 });

  const frame = mesh(new THREE.BoxGeometry(1.28, 0.24, 0.42), frameMaterial);
  frame.position.set(0.18, 0.22, 0);
  root.add(frame);

  const dustCover = mesh(new THREE.BoxGeometry(0.58, 0.2, 0.38), frameMaterial);
  dustCover.position.set(0.7, 0.06, 0);
  root.add(dustCover);

  const grip = new THREE.Group();
  grip.position.set(-0.28, 0.08, 0);
  grip.rotation.z = -0.18;
  const gripBody = mesh(new THREE.BoxGeometry(0.48, 0.98, 0.49), polymer);
  gripBody.position.y = -0.48;
  grip.add(gripBody);
  for (const z of [-0.256, 0.256]) {
    const panel = mesh(new THREE.BoxGeometry(0.34, 0.72, 0.025), frameMaterial, false);
    panel.position.set(-0.015, -0.48, z);
    grip.add(panel);
    for (let index = 0; index < 5; index += 1) {
      const ridge = mesh(new THREE.BoxGeometry(0.26, 0.025, 0.018), accent, false);
      ridge.position.set(-0.015, -0.73 + index * 0.12, z + Math.sign(z) * 0.018);
      grip.add(ridge);
    }
  }
  const magazineSocket = new THREE.Object3D();
  magazineSocket.position.set(-0.05, -0.93, 0);
  grip.add(magazineSocket);
  root.add(grip);

  const guard = mesh(new THREE.TorusGeometry(0.24, 0.035, 7, 18, Math.PI * 1.16), frameMaterial);
  guard.position.set(0.28, -0.04, 0);
  guard.rotation.set(Math.PI / 2, 0, 0.08);
  root.add(guard);
  const trigger = mesh(new THREE.TorusGeometry(0.095, 0.024, 6, 12, Math.PI * 0.72), darkMetal);
  trigger.position.set(0.22, -0.04, 0);
  trigger.rotation.set(Math.PI / 2, 0, -0.2);
  root.add(trigger);

  const slideBody = mesh(new THREE.BoxGeometry(1.58, 0.37, 0.46), slideMaterial);
  slideBody.position.set(0.2, 0.48, 0);
  slide.add(slideBody);
  const top = mesh(new THREE.BoxGeometry(1.28, 0.08, 0.32), slideMaterial);
  top.position.set(0.07, 0.69, 0);
  slide.add(top);
  const ejectionPort = mesh(new THREE.BoxGeometry(0.34, 0.02, 0.25), darkMetal, false);
  ejectionPort.position.set(0.23, 0.705, 0.03);
  slide.add(ejectionPort);
  for (let index = 0; index < 5; index += 1) {
    const serration = mesh(new THREE.BoxGeometry(0.025, 0.24, 0.475), darkMetal, false);
    serration.position.set(-0.42 + index * 0.07, 0.48, 0);
    serration.rotation.z = -0.15;
    slide.add(serration);
  }
  const frontSight = mesh(new THREE.BoxGeometry(0.08, 0.1, 0.08), darkMetal);
  frontSight.position.set(0.88, 0.77, 0);
  const rearSight = mesh(new THREE.BoxGeometry(0.12, 0.1, 0.26), darkMetal);
  rearSight.position.set(-0.53, 0.77, 0);
  slide.add(frontSight, rearSight);
  root.add(slide);

  const barrel = mesh(new THREE.CylinderGeometry(0.095, 0.095, 1.4, 16), darkMetal);
  barrel.rotation.z = Math.PI / 2;
  barrel.position.set(0.36, 0.48, 0);
  root.add(barrel);
  const muzzleRing = mesh(new THREE.TorusGeometry(0.098, 0.026, 8, 16), slideMaterial);
  muzzleRing.position.set(1.01, 0.48, 0);
  muzzleRing.rotation.y = Math.PI / 2;
  root.add(muzzleRing);
  const muzzle = new THREE.Object3D();
  muzzle.position.set(1.13, 0.48, 0);
  root.add(muzzle);

  return { root, slide, muzzle, magazineSocket };
};

export const createMagazineModel = (): MagazineModel => {
  const root = new THREE.Group();
  const roundDisplay = new THREE.Group();
  const metal = new THREE.MeshStandardMaterial({ color: 0x303936, roughness: 0.42, metalness: 0.7 });
  const edge = new THREE.MeshStandardMaterial({ color: 0x111715, roughness: 0.5, metalness: 0.62 });
  const body = mesh(new THREE.BoxGeometry(0.46, 1.08, 0.34), metal);
  body.position.y = -0.02;
  root.add(body);
  const front = mesh(new THREE.BoxGeometry(0.3, 0.89, 0.018), edge, false);
  front.position.set(0, -0.02, 0.18);
  root.add(front);
  for (let index = 0; index < 4; index += 1) {
    const witness = mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.025, 10), edge, false);
    witness.rotation.x = Math.PI / 2;
    witness.position.set(0, 0.28 - index * 0.2, 0.197);
    roundDisplay.add(witness);
  }
  const feedLeft = mesh(new THREE.BoxGeometry(0.18, 0.12, 0.36), edge);
  feedLeft.position.set(-0.14, 0.58, 0);
  feedLeft.rotation.z = -0.18;
  const feedRight = feedLeft.clone();
  feedRight.position.x = 0.14;
  feedRight.rotation.z = 0.18;
  const base = mesh(new THREE.BoxGeometry(0.56, 0.13, 0.42), edge);
  base.position.y = -0.61;
  const baseAccent = mesh(new THREE.BoxGeometry(0.4, 0.025, 0.32), metal, false);
  baseAccent.position.y = -0.69;
  root.add(roundDisplay, feedLeft, feedRight, base, baseAccent);
  return { root, roundDisplay };
};

export const createZombieModel = (): ZombieModel => {
  const root = new THREE.Group();
  const skin = new THREE.MeshStandardMaterial({ color: 0x708563, roughness: 0.94, emissive: 0x08110a });
  const skinDark = new THREE.MeshStandardMaterial({ color: 0x455b43, roughness: 1 });
  const cloth = new THREE.MeshStandardMaterial({ color: 0x30443c, roughness: 1 });
  const clothDark = new THREE.MeshStandardMaterial({ color: 0x151c19, roughness: 1 });
  const seam = new THREE.MeshStandardMaterial({ color: 0x92ab4b, roughness: 0.8, emissive: 0x152006, emissiveIntensity: 0.2 });

  const pelvis = mesh(new THREE.BoxGeometry(0.68, 0.38, 0.43), clothDark);
  pelvis.position.y = 0.12;
  root.add(pelvis);
  const torso = mesh(new THREE.CapsuleGeometry(0.48, 0.78, 6, 10), cloth);
  torso.name = 'body';
  torso.position.y = 0.85;
  torso.scale.set(1, 1, 0.7);
  root.add(torso);
  const tornPanel = mesh(new THREE.BoxGeometry(0.52, 0.18, 0.025), seam, false);
  tornPanel.position.set(0.08, 0.88, 0.36);
  tornPanel.rotation.z = -0.15;
  root.add(tornPanel);

  const head = new THREE.Group();
  head.position.set(0.08, 1.69, 0.03);
  head.rotation.z = -0.08;
  const skull = mesh(new THREE.IcosahedronGeometry(0.4, 1), skin);
  skull.scale.set(0.86, 1.08, 0.9);
  head.add(skull);
  const jaw = mesh(new THREE.BoxGeometry(0.31, 0.19, 0.31), skinDark);
  jaw.position.set(0.02, -0.28, 0.06);
  head.add(jaw);
  const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0xcaff5a });
  for (const x of [-0.13, 0.13]) {
    const eye = mesh(new THREE.SphereGeometry(0.035, 6, 5), eyeMaterial, false);
    eye.position.set(x, 0.06, 0.35);
    head.add(eye);
  }
  root.add(head);

  const createLimb = (side: number, arm: boolean): THREE.Group => {
    const pivot = new THREE.Group();
    pivot.position.set(side * (arm ? 0.5 : 0.24), arm ? 1.18 : 0.04, 0);
    const upper = mesh(new THREE.CapsuleGeometry(arm ? 0.12 : 0.16, arm ? 0.58 : 0.68, 5, 7), arm ? skin : clothDark);
    upper.position.y = arm ? -0.38 : -0.46;
    upper.rotation.z = arm ? side * 0.1 : 0;
    pivot.add(upper);
    const lower = mesh(new THREE.CapsuleGeometry(arm ? 0.105 : 0.14, arm ? 0.52 : 0.62, 5, 7), arm ? skinDark : clothDark);
    lower.position.set(arm ? side * 0.08 : 0, arm ? -0.84 : -0.97, arm ? 0.12 : 0);
    lower.rotation.z = arm ? side * -0.18 : 0;
    pivot.add(lower);
    return pivot;
  };
  const leftArm = createLimb(-1, true);
  const rightArm = createLimb(1, true);
  leftArm.rotation.x = 0.9;
  rightArm.rotation.x = 1.05;
  const leftLeg = createLimb(-1, false);
  const rightLeg = createLimb(1, false);
  root.add(leftArm, rightArm, leftLeg, rightLeg);
  return { root, torso, head, leftArm, rightArm, leftLeg, rightLeg };
};

export const createCartridge = (ammoType: AmmoType, scale = 1): THREE.Group => {
  const group = new THREE.Group();
  group.scale.setScalar(scale);
  const brass = new THREE.MeshStandardMaterial({ color: 0xc9a556, roughness: 0.32, metalness: 0.78 });
  const definition = AMMO_DEFINITIONS[ammoType];
  const tipMaterial = new THREE.MeshStandardMaterial({ color: definition.color, roughness: 0.4, metalness: 0.26, emissive: definition.color, emissiveIntensity: ammoType === 'incendiary' ? 0.22 : 0.05 });
  const casing = mesh(new THREE.CylinderGeometry(0.055, 0.058, 0.27, 10), brass);
  const rim = mesh(new THREE.CylinderGeometry(0.064, 0.064, 0.025, 10), brass);
  rim.position.y = -0.145;
  const bullet = mesh(new THREE.ConeGeometry(0.055, 0.14, 10), tipMaterial);
  bullet.position.y = 0.205;
  group.add(casing, rim, bullet);
  const bandCounts: Record<AmmoType, number> = { standard: 0, tracer: 1, fragmenting: 2, incendiary: 3 };
  for (let index = 0; index < bandCounts[ammoType]; index += 1) {
    const band = mesh(new THREE.TorusGeometry(0.059, 0.008, 5, 10), tipMaterial, false);
    band.rotation.x = Math.PI / 2;
    band.position.y = 0.09 - index * 0.045;
    group.add(band);
  }
  group.userData.ammoType = ammoType;
  return group;
};
