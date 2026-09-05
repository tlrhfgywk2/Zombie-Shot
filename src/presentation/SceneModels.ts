import * as THREE from 'three';
import type { AmmoType, AttachmentSlot } from '../combat/types';
import { SERVICE_45, ATTACHMENT_DEFINITIONS, type AttachmentId } from '../data/attachmentDefinitions';
import { AMMO_DEFINITIONS } from '../data/ammoDefinitions';

export interface PistolModel {
  root: THREE.Group;
  grip: THREE.Group;
  gripBody: THREE.Mesh;
  slide: THREE.Group;
  muzzle: THREE.Object3D;
  magazineSeatAnchor: THREE.Object3D;
  ejectionPort: THREE.Object3D;
  attachmentSockets: Record<AttachmentSlot, THREE.Group>;
}

export interface MagazineModel {
  root: THREE.Group;
  body: THREE.Mesh;
  feedEnd: THREE.Group;
  basePlate: THREE.Mesh;
  magazineInsertAnchor: THREE.Object3D;
  roundDisplay: THREE.Group;
  witnessRounds: THREE.Mesh[];
}

export interface ZombieModel {
  root: THREE.Group;
  torso: THREE.Mesh;
  head: THREE.Group;
  leftArm: THREE.Group;
  rightArm: THREE.Group;
  leftLeg: THREE.Group;
  rightLeg: THREE.Group;
  threatHalo: THREE.Mesh;
}

const mesh = (geometry: THREE.BufferGeometry, material: THREE.Material, castShadow = true): THREE.Mesh => {
  const result = new THREE.Mesh(geometry, material);
  result.castShadow = castShadow;
  return result;
};

export const createPistolModel = (): PistolModel => {
  const root = new THREE.Group();
  root.name = 'pistolRoot';
  root.userData.weapon = SERVICE_45.internalName;
  const slide = new THREE.Group();
  const frameMaterial = new THREE.MeshStandardMaterial({ color: 0x303637, roughness: 0.45, metalness: 0.66 });
  const slideMaterial = new THREE.MeshStandardMaterial({ color: 0x84908e, roughness: 0.27, metalness: 0.82 });
  const darkMetal = new THREE.MeshStandardMaterial({ color: 0x101614, roughness: 0.34, metalness: 0.72 });
  const polymer = new THREE.MeshStandardMaterial({ color: 0x121816, roughness: 0.87, metalness: 0.05 });

  const frame = mesh(new THREE.BoxGeometry(1.28, 0.24, 0.42), frameMaterial);
  frame.position.set(0.18, 0.22, 0);
  root.add(frame);

  const dustCover = mesh(new THREE.BoxGeometry(0.58, 0.2, 0.38), frameMaterial);
  dustCover.position.set(0.7, 0.06, 0);
  root.add(dustCover);
  // 전술 레일의 가로 홈과 서비스 권총의 해머·조작 레버.
  for (let i = 0; i < 3; i += 1) {
    const railTooth = mesh(new THREE.BoxGeometry(0.065, 0.06, 0.42), darkMetal);
    railTooth.position.set(0.54 + i * 0.16, -0.065, 0); root.add(railTooth);
  }
  const hammer = mesh(new THREE.BoxGeometry(0.12, 0.19, 0.12), darkMetal);
  hammer.position.set(-0.66, 0.53, 0); hammer.rotation.z = -0.35; root.add(hammer);
  for (const z of [-0.24, 0.24]) {
    const lever = mesh(new THREE.BoxGeometry(0.22, 0.045, 0.04), darkMetal);
    lever.position.set(-0.24, 0.25, z); root.add(lever);
  }

  const grip = new THREE.Group();
  grip.name = 'pistolGrip';
  grip.position.set(-0.28, 0.08, 0);
  grip.rotation.z = -0.18;
  const gripHeight = 0.98;
  const gripBody = mesh(new THREE.BoxGeometry(0.48, gripHeight, 0.40), polymer);
  gripBody.name = 'pistolGripBody';
  gripBody.position.y = -0.48;
  grip.add(gripBody);
  for (const z of [-0.211, 0.211]) {
    const panel = mesh(new THREE.BoxGeometry(0.34, 0.72, 0.025), frameMaterial, false);
    panel.position.set(-0.015, -0.48, z);
    grip.add(panel);
    for (let index = 0; index < 5; index += 1) {
      const ridge = mesh(new THREE.BoxGeometry(0.26, 0.016, 0.018), darkMetal, false);
      ridge.position.set(-0.015, -0.73 + index * 0.12, z + Math.sign(z) * 0.018);
      grip.add(ridge);
    }
  }
  const magazineSeatAnchor = new THREE.Object3D();
  magazineSeatAnchor.name = 'magazineSeatAnchor';
  // The magazine seats against an internal stop under the frame, not against the visible grip floor.
  magazineSeatAnchor.position.set(0, 0.32, 0);
  grip.add(magazineSeatAnchor);
  root.add(grip);

  const guard = mesh(new THREE.TorusGeometry(0.24, 0.035, 7, 18, Math.PI * 1.16), frameMaterial);
  guard.position.set(0.28, -0.04, 0);
  guard.rotation.set(0, 0, Math.PI * 0.95);
  root.add(guard);
  const trigger = mesh(new THREE.TorusGeometry(0.095, 0.024, 6, 12, Math.PI * 0.72), darkMetal);
  trigger.position.set(0.22, -0.04, 0);
  trigger.rotation.set(0, 0, -0.2);
  root.add(trigger);

  const slideShape = new THREE.Shape();
  slideShape.moveTo(-0.79, -0.185); slideShape.lineTo(0.79, -0.185);
  slideShape.lineTo(0.79, 0.09); slideShape.lineTo(0.65, 0.185);
  slideShape.lineTo(-0.69, 0.185); slideShape.lineTo(-0.79, 0.08); slideShape.closePath();
  const slideGeometry = new THREE.ExtrudeGeometry(slideShape, { depth: 0.40, bevelEnabled: true, bevelSize: 0.025, bevelThickness: 0.025, bevelSegments: 1, steps: 1 });
  slideGeometry.translate(0, 0, -0.2);
  const slideBody = mesh(slideGeometry, slideMaterial);
  slideBody.position.set(0.2, 0.48, 0);
  slide.add(slideBody);
  const top = mesh(new THREE.BoxGeometry(1.28, 0.08, 0.32), slideMaterial);
  top.position.set(0.07, 0.69, 0);
  slide.add(top);
  const ejectionPortCover = mesh(new THREE.BoxGeometry(0.34, 0.02, 0.25), darkMetal, false);
  ejectionPortCover.position.set(0.23, 0.705, 0.03);
  slide.add(ejectionPortCover);
  const ejectionPort = new THREE.Object3D();
  ejectionPort.name = 'ejectionPort';
  ejectionPort.position.set(0.23, 0.67, 0.25);
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
  muzzle.name = 'muzzle';
  muzzle.position.set(1.13, 0.48, 0);
  root.add(muzzle);

  const attachmentSockets = {
    muzzle: new THREE.Group(), magazine: new THREE.Group(), optic: new THREE.Group(), rail: new THREE.Group(), grip: new THREE.Group(),
  } satisfies Record<AttachmentSlot, THREE.Group>;
  attachmentSockets.muzzle.name = 'attachmentSocketMuzzle';
  attachmentSockets.muzzle.position.set(1.08, 0.48, 0);
  attachmentSockets.magazine.name = 'attachmentSocketMagazine';
  attachmentSockets.magazine.position.set(0, -0.99, 0);
  attachmentSockets.optic.name = 'attachmentSocketOptic';
  attachmentSockets.optic.position.set(-0.29, 0.74, 0);
  attachmentSockets.rail.name = 'attachmentSocketRail';
  attachmentSockets.rail.position.set(0.68, -0.18, 0);
  attachmentSockets.grip.name = 'attachmentSocketGrip';
  attachmentSockets.grip.position.set(0, -0.48, 0);
  root.add(attachmentSockets.muzzle, attachmentSockets.rail);
  slide.add(attachmentSockets.optic);
  grip.add(attachmentSockets.magazine, attachmentSockets.grip);

  return { root, grip, gripBody, slide, muzzle, magazineSeatAnchor, ejectionPort, attachmentSockets };
};

export const createAttachmentModel = (id: AttachmentId): THREE.Group => {
  const root = new THREE.Group();
  root.name = `attachment-${id}`;
  const item = ATTACHMENT_DEFINITIONS[id];
  const advanced = item.rarity === 'advanced';
  const dark = new THREE.MeshStandardMaterial({ color: 0x182020, roughness: 0.45, metalness: 0.65 });
  const metal = new THREE.MeshStandardMaterial({ color: 0x7d8987, roughness: 0.3, metalness: 0.8 });
  const port = new THREE.MeshStandardMaterial({ color: 0x030605, roughness: 1 });
  const green = new THREE.MeshStandardMaterial({ color: 0xbde952, emissive: 0x74ac15, emissiveIntensity: 0.6 });
  const box = (w: number, h: number, d: number, x: number, y: number, z: number, material: THREE.Material = dark) => {
    const part = mesh(new THREE.BoxGeometry(w, h, d), material);
    part.position.set(x, y, z); root.add(part); return part;
  };
  if (item.slot === 'muzzle') {
    const length = advanced ? 0.38 : 0.23;
    // 열린 총구, 양측 포트, 상부 배기 홈으로 짧은 보정기를 구분한다.
    box(length, 0.26, 0.33, length / 2, 0, 0, metal);
    const bore = mesh(new THREE.CircleGeometry(0.092, 16), port);
    bore.rotation.y = Math.PI / 2; bore.position.x = length + 0.001; root.add(bore);
    for (let i = 0; i < (advanced ? 2 : 1); i += 1) {
      const x = 0.10 + i * 0.16;
      box(0.075, 0.015, 0.23, x, 0.133, 0, port);
      for (const side of [-1, 1]) box(0.075, 0.09, 0.012, x, 0.035, side * 0.17, port);
    }
  } else if (item.slot === 'magazine') {
    const height = advanced ? 0.32 : 0.12;
    box(0.48, height, 0.38, 0, -height / 2, 0, advanced ? metal : dark);
    box(0.54, 0.055, 0.42, 0, -height, 0);
    if (advanced) for (const side of [-1, 1]) box(0.06, 0.17, 0.009, 0, -0.15, side * 0.196, port);
  } else if (id === 'highVisibilitySight') {
    box(0.12, 0.04, 0.17, 1.17, 0.02, 0);
    box(0.075, 0.12, 0.09, 1.17, 0.08, 0, green);
  } else if (id === 'compactReflexSight') {
    box(0.36, 0.055, 0.32, 0, 0.025, 0);
    for (const side of [-1, 1]) box(0.09, 0.27, 0.038, 0.025, 0.18, side * 0.15, metal);
    box(0.09, 0.04, 0.34, 0.025, 0.32, 0, metal);
    box(0.016, 0.23, 0.26, 0.025, 0.18, 0, new THREE.MeshStandardMaterial({ color: 0x76dac8, transparent: true, opacity: 0.36, metalness: 0.1, roughness: 0.1 }));
    box(0.08, 0.007, 0.018, 0.025, 0.19, 0, green);
    box(0.1, 0.09, 0.07, -0.05, 0.085, 0.18);
  } else if (item.slot === 'rail') {
    box(advanced ? 0.44 : 0.32, advanced ? 0.23 : 0.14, advanced ? 0.31 : 0.22, 0, -0.02, 0);
    const laser = mesh(new THREE.CircleGeometry(0.035, 12), new THREE.MeshBasicMaterial({ color: 0xf2504a }));
    laser.rotation.y = Math.PI / 2; laser.position.set(advanced ? 0.225 : 0.165, -0.04, advanced ? 0.09 : 0); root.add(laser);
    if (advanced) {
      const lamp = mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.09, 12), metal);
      lamp.rotation.z = Math.PI / 2; lamp.position.set(0.23, -0.02, -0.055); root.add(lamp);
      const lens = mesh(new THREE.CircleGeometry(0.059, 12), new THREE.MeshBasicMaterial({ color: 0xe9eccb }));
      lens.rotation.y = Math.PI / 2; lens.position.set(0.28, -0.02, -0.055); root.add(lens);
    }
  } else if (item.slot === 'grip') {
    const panel = new THREE.MeshStandardMaterial({ color: advanced ? 0x817961 : 0x303b35, roughness: 0.95, metalness: 0 });
    for (const side of [-1, 1]) {
      box(0.38, 0.77, 0.035, -0.015, 0, side * 0.236, panel);
      for (let i = 0; i < 7; i += 1) {
        const ridge = box(0.29, 0.014, 0.01, -0.015, -0.3 + i * 0.1, side * 0.26);
        if (advanced) {
          ridge.rotation.z = 0.35;
          box(0.29, 0.014, 0.01, -0.015, -0.3 + i * 0.1, side * 0.263).rotation.z = -0.35;
        }
      }
      for (const y of [-0.3, 0.3]) {
        const screw = mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.015, 8), metal);
        screw.rotation.x = Math.PI / 2; screw.position.set(-0.015, y, side * 0.275); root.add(screw);
      }
    }
  }
  return root;
};

export const createMagazineModel = (): MagazineModel => {
  const root = new THREE.Group();
  root.name = 'magazineRoot';
  const magazineInsertAnchor = new THREE.Object3D();
  const roundDisplay = new THREE.Group();
  const witnessRounds: THREE.Mesh[] = [];
  const metal = new THREE.MeshStandardMaterial({ color: 0x303936, roughness: 0.42, metalness: 0.7 });
  const edge = new THREE.MeshStandardMaterial({ color: 0x111715, roughness: 0.5, metalness: 0.62 });
  const witnessFrame = new THREE.MeshStandardMaterial({ color: 0x090d0c, roughness: 0.7, metalness: 0.45 });
  const bodyHeight = 1.08;
  const body = mesh(new THREE.BoxGeometry(0.46, bodyHeight, 0.34), metal);
  body.name = 'magazineBody';
  body.position.y = -0.02;
  root.add(body);
  magazineInsertAnchor.name = 'magazineInsertAnchor';
  // The physical insertion reference is the top of the rotated feed lips.
  magazineInsertAnchor.position.set(0, 0.655, 0);
  root.add(magazineInsertAnchor);
  const front = mesh(new THREE.BoxGeometry(0.3, 0.89, 0.018), edge, false);
  front.position.set(0, -0.02, 0.18);
  root.add(front);
  for (let index = 0; index < 6; index += 1) {
    const slotY = 0.35 - index * 0.14;
    const recess = mesh(new THREE.CapsuleGeometry(0.045, 0.09, 4, 8), witnessFrame, false);
    recess.scale.set(1, 1, 0.22);
    recess.position.set(0, slotY, 0.205);
    const round = mesh(
      new THREE.CapsuleGeometry(0.027, 0.058, 4, 8),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.32, metalness: 0.2, emissive: 0x111111 }),
      false,
    );
    round.scale.set(1, 1, 0.2);
    round.position.set(0, slotY, 0.224);
    round.visible = false;
    witnessRounds.push(round);
    roundDisplay.add(recess, round);
  }
  const feedLeft = mesh(new THREE.BoxGeometry(0.18, 0.12, 0.36), edge);
  feedLeft.position.set(-0.14, 0.58, 0);
  feedLeft.rotation.z = -0.18;
  const feedRight = feedLeft.clone();
  feedRight.position.x = 0.14;
  feedRight.rotation.z = 0.18;
  const base = mesh(new THREE.BoxGeometry(0.56, 0.13, 0.42), edge);
  base.name = 'magazineBasePlate';
  base.position.y = -0.61;
  const baseAccent = mesh(new THREE.BoxGeometry(0.4, 0.025, 0.32), metal, false);
  baseAccent.position.y = -0.69;
  const feedEnd = new THREE.Group();
  feedEnd.name = 'magazineFeedEnd';
  feedEnd.add(feedLeft, feedRight);
  root.add(roundDisplay, feedEnd, base, baseAccent);
  return { root, body, feedEnd, basePlate: base, magazineInsertAnchor, roundDisplay, witnessRounds };
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
  const threatHalo = mesh(new THREE.TorusGeometry(0.58, 0.035, 7, 28), new THREE.MeshBasicMaterial({ color: 0xff6948, transparent: true, opacity: 0.82 }), false);
  threatHalo.name = 'specialThreatHalo';
  threatHalo.position.set(0.08, 1.72, -0.18);
  threatHalo.visible = false;
  root.add(threatHalo);
  return { root, torso, head, leftArm, rightArm, leftLeg, rightLeg, threatHalo };
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
  const bandCounts: Record<AmmoType, number> = { wadcutter: 1, flatPoint: 2, overpressure: 3, subsonic: 1, bonded: 3, match: 2, standard: 0, armorPiercing: 1, hollowPoint: 2, incendiary: 3, stagger: 4, magnum: 5, cryo: 2, arc: 3, sanctified: 4, bloodHex: 5 };
  for (let index = 0; index < bandCounts[ammoType]; index += 1) {
    const band = mesh(new THREE.TorusGeometry(0.059, 0.008, 5, 10), tipMaterial, false);
    band.rotation.x = Math.PI / 2;
    band.position.y = 0.09 - index * 0.045;
    group.add(band);
  }
  group.userData.ammoType = ammoType;
  return group;
};
