import * as THREE from 'three';
import type { AmmoType } from '../combat/types';
import { AMMO_DEFINITIONS } from '../data/ammoDefinitions';
import { AudioManager } from './AudioManager';
import type { AudioPreferences } from './AudioPreferences';
import { PRESENTATION_MOTION, PRESENTATION_TIMING } from './presentationConfig';
import { getAimQuaternion, getPresentationLayout, type PresentationLayout } from './PresentationMath';
import { createCartridge, createMagazineModel, createPistolModel, createZombieModel } from './SceneModels';

export class GamePresentation {
  private readonly scene = new THREE.Scene();
  private readonly camera = new THREE.PerspectiveCamera(43, 1, 0.1, 100);
  private readonly renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
  private readonly clock = new THREE.Clock();
  private readonly audio = new AudioManager();
  private readonly zombieModel = createZombieModel();
  private readonly pistolModel = createPistolModel();
  private readonly magazineModel = createMagazineModel();
  private readonly muzzleFlash = new THREE.PointLight(0xffb34a, 0, 7);
  private readonly burnLight = new THREE.PointLight(0xff5a18, 0, 5);
  private readonly cartridges: THREE.Group[] = [];
  private layout: PresentationLayout = getPresentationLayout(1280, 720);
  private readonly baseAimQuaternion = new THREE.Quaternion();
  private readonly baseWeaponPosition = new THREE.Vector3();
  private zombieTargetZ = -6.1;
  private elapsed = 0;
  private zombieFallen = false;
  private paused = document.hidden;
  private windowBlurred = false;
  private animationInProgress = false;
  private resizeObserver?: ResizeObserver;
  private animationFrame = 0;

  constructor(private readonly host: HTMLElement) {
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    this.renderer.setClearColor(0x080c0a, 1);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.domElement.setAttribute('aria-label', '다가오는 감염체와 장전 동작을 보여 주는 3D 전투 화면');
    this.host.append(this.renderer.domElement);
    this.camera.position.copy(this.layout.cameraPosition);
    this.camera.lookAt(this.layout.cameraTarget);
    this.scene.fog = new THREE.FogExp2(0x0b110e, 0.044);
    this.buildEnvironment();
    this.buildActors();
    this.resize();
    window.addEventListener('resize', this.resize);
    window.visualViewport?.addEventListener('resize', this.resize);
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
    window.addEventListener('blur', this.handleBlur);
    window.addEventListener('focus', this.handleFocus);
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(this.resize);
      this.resizeObserver.observe(this.host);
    }
    this.audio.setActive(!this.paused);
    this.tick();
  }

  destroy(): void {
    cancelAnimationFrame(this.animationFrame);
    window.removeEventListener('resize', this.resize);
    window.visualViewport?.removeEventListener('resize', this.resize);
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    window.removeEventListener('blur', this.handleBlur);
    window.removeEventListener('focus', this.handleFocus);
    this.resizeObserver?.disconnect();
    this.audio.setActive(false);
    this.scene.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      object.geometry.dispose();
      const materials = Array.isArray(object.material) ? object.material : [object.material];
      materials.forEach((material) => material.dispose());
    });
    this.renderer.dispose();
  }

  setAudioPreferences(preferences: AudioPreferences): void {
    this.audio.setPreferences(preferences);
  }

  wait(milliseconds: number): Promise<void> {
    return this.tween(milliseconds, () => undefined);
  }

  setZombie(distance: number, hpRatio: number, burning: boolean, level: number): void {
    this.zombieTargetZ = 1.1 - distance * 0.72;
    const scale = 1 + Math.min(level - 1, 10) * 0.025;
    this.zombieModel.root.scale.setScalar(scale);
    const material = this.zombieModel.torso.material as THREE.MeshStandardMaterial;
    material.emissive.setHex(burning ? 0x5e1705 : hpRatio < 0.35 ? 0x33110d : 0x08110a);
    material.emissiveIntensity = burning ? 0.82 : 0.32;
    this.burnLight.intensity = burning ? 1.35 : 0;
  }

  async animateLoading(rounds: readonly AmmoType[]): Promise<void> {
    this.animationInProgress = true;
    this.audio.prepare();
    this.resetWeaponPose();
    this.clearCartridges();
    const magazine = this.magazineModel.root;
    if (magazine.parent !== this.scene) this.scene.attach(magazine);
    this.setMagazineRounds([]);
    magazine.visible = true;
    magazine.position.copy(this.layout.magazineLoad);
    magazine.rotation.set(-0.04, 0.02, -0.12);
    magazine.scale.setScalar(this.layout.magazineScale);
    for (let index = 0; index < rounds.length; index += 1) {
      const ammo = rounds[index];
      if (!ammo) continue;
      const cartridge = createCartridge(ammo, this.layout.cartridgeScale);
      cartridge.position.copy(this.layout.magazineLoad).add(new THREE.Vector3(0.16, 0.98, 0.02));
      cartridge.rotation.z = -0.04;
      this.scene.add(cartridge);
      this.cartridges.push(cartridge);
      await this.tween(PRESENTATION_TIMING.roundInsert, (progress) => {
        const eased = this.easeOutBack(progress);
        cartridge.position.y = THREE.MathUtils.lerp(this.layout.magazineLoad.y + 0.98, this.layout.magazineLoad.y + 0.49, eased);
        cartridge.position.x = THREE.MathUtils.lerp(this.layout.magazineLoad.x + 0.16, this.layout.magazineLoad.x + 0.02, eased);
        cartridge.rotation.z = THREE.MathUtils.lerp(-0.04, -0.12, eased);
        this.camera.position.y = this.layout.cameraPosition.y - Math.sin(progress * Math.PI) * 0.018;
      });
      this.audio.insertRound(ammo, index);
      await this.wait(PRESENTATION_TIMING.roundSettle);
      cartridge.visible = false;
      this.setMagazineRounds(rounds.slice(0, index + 1));
    }
    this.camera.position.y = this.layout.cameraPosition.y;
    const inspectionStart = magazine.position.clone();
    await this.tween(PRESENTATION_TIMING.magazineInspectMove, (progress) => {
      const eased = this.easeInOut(progress);
      magazine.position.lerpVectors(inspectionStart, this.layout.magazineInspect, eased);
      magazine.rotation.set(
        THREE.MathUtils.lerp(-0.04, 0.015, eased),
        THREE.MathUtils.lerp(0.02, -0.08, eased),
        THREE.MathUtils.lerp(-0.12, 0.035, eased),
      );
    });
    await this.tween(PRESENTATION_TIMING.magazineInspectHold, (progress) => {
      magazine.rotation.y = -0.08 + Math.sin(progress * Math.PI) * 0.11;
      magazine.position.y = this.layout.magazineInspect.y + Math.sin(progress * Math.PI) * 0.025;
    });

    const magazineStartPosition = magazine.position.clone();
    const magazineStartQuaternion = magazine.quaternion.clone();
    const pistolStartPosition = this.pistolModel.root.position.clone();
    const pistolStartQuaternion = this.pistolModel.root.quaternion.clone();
    const insertionQuaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.02, -0.04, -0.08));
    const magazineStartScale = magazine.scale.x;
    const insertionScale = this.layout.pistolScale * this.layout.insertionScaleFactor;
    await this.tween(PRESENTATION_TIMING.magazineApproach, (progress) => {
      const eased = this.easeInOut(progress);
      this.pistolModel.root.position.lerpVectors(pistolStartPosition, this.layout.weaponInsertion, eased);
      this.pistolModel.root.quaternion.slerpQuaternions(pistolStartQuaternion, insertionQuaternion, eased);
      this.pistolModel.root.scale.setScalar(THREE.MathUtils.lerp(this.layout.pistolScale, insertionScale, eased));
      this.pistolModel.root.updateMatrixWorld(true);
      const approachPose = this.getMagazineSocketPose(1.08);
      magazine.position.lerpVectors(magazineStartPosition, approachPose.position, eased);
      magazine.quaternion.slerpQuaternions(magazineStartQuaternion, approachPose.quaternion, eased);
      magazine.scale.setScalar(THREE.MathUtils.lerp(magazineStartScale, insertionScale, eased));
    });
    await this.tween(PRESENTATION_TIMING.magazineSeat, (progress) => {
      const pose = this.getMagazineSocketPose(THREE.MathUtils.lerp(1.08, 0.46, this.easeOutBack(progress)));
      magazine.position.copy(pose.position);
      magazine.quaternion.copy(pose.quaternion);
      this.pistolModel.root.position.y = this.layout.weaponInsertion.y + Math.sin(progress * Math.PI) * 0.035;
    });
    this.audio.magazineSeat();
    await this.animateChamber();
    const readyPosition = this.pistolModel.root.position.clone();
    const readyQuaternion = this.pistolModel.root.quaternion.clone();
    const target = this.getZombieTarget();
    const aimQuaternion = getAimQuaternion(this.layout.weaponAim, target);
    await this.tween(PRESENTATION_TIMING.readySettle, (progress) => {
      const eased = this.easeInOut(progress);
      this.pistolModel.root.position.lerpVectors(readyPosition, this.layout.weaponAim, eased);
      this.pistolModel.root.quaternion.slerpQuaternions(readyQuaternion, aimQuaternion, eased);
      this.pistolModel.root.scale.setScalar(THREE.MathUtils.lerp(insertionScale, this.layout.pistolScale, eased));
      magazine.scale.setScalar(THREE.MathUtils.lerp(insertionScale, this.layout.pistolScale, eased));
      this.pistolModel.root.updateMatrixWorld(true);
      const seatedPose = this.getMagazineSocketPose(0.46);
      magazine.position.copy(seatedPose.position);
      magazine.quaternion.copy(seatedPose.quaternion);
    });
    this.aimPistolAtTarget(target);
    magazine.visible = false;
    this.clearCartridges();
    this.animationInProgress = false;
  }

  async animateShot(ammoType: AmmoType): Promise<void> {
    this.animationInProgress = true;
    const definition = AMMO_DEFINITIONS[ammoType];
    const target = this.getZombieTarget();
    this.aimPistolAtTarget(target);
    this.pistolModel.root.updateMatrixWorld(true);
    const projectile = this.createProjectile(ammoType);
    const start = new THREE.Vector3();
    this.pistolModel.muzzle.getWorldPosition(start);
    projectile.position.copy(start);
    this.scene.add(projectile);
    this.muzzleFlash.color.setHex(definition.color);
    this.muzzleFlash.intensity = ammoType === 'incendiary' ? 10 : 7.5;
    this.audio.shot(ammoType);
    const slideTravel = PRESENTATION_MOTION.slideTravel * (ammoType === 'magnum' ? 1.12 : 1);
    await this.tween(PRESENTATION_TIMING.shotTravel, (progress) => {
      const projectileProgress = Math.min(progress * 1.55, 1);
      projectile.position.lerpVectors(start, target, projectileProgress * projectileProgress);
      this.pistolModel.slide.position.x = -slideTravel * Math.sin(Math.min(progress * 2.2, 1) * Math.PI);
      const recoil = Math.sin(Math.min(progress * 1.7, 1) * Math.PI);
      const recoilRotation = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), PRESENTATION_MOTION.weaponRecoil * recoil);
      const forward = new THREE.Vector3(1, 0, 0).applyQuaternion(this.baseAimQuaternion);
      this.pistolModel.root.quaternion.copy(this.baseAimQuaternion).multiply(recoilRotation);
      this.pistolModel.root.position.copy(this.baseWeaponPosition).addScaledVector(forward, -0.075 * recoil);
      this.camera.position.x = Math.sin(progress * Math.PI * 7) * PRESENTATION_MOTION.cameraShake * (1 - progress);
      this.muzzleFlash.intensity = 8 * Math.max(0, 1 - progress * 4);
    });
    this.disposeObject(projectile);
    this.audio.impact(ammoType);
    await Promise.all([this.animateImpact(ammoType, target), this.animateHitReaction(ammoType)]);
    const recoilPosition = this.pistolModel.root.position.clone();
    const recoilQuaternion = this.pistolModel.root.quaternion.clone();
    await this.tween(PRESENTATION_TIMING.shotSettle, (progress) => {
      const eased = this.easeInOut(progress);
      this.pistolModel.root.position.lerpVectors(recoilPosition, this.baseWeaponPosition, eased);
      this.pistolModel.root.quaternion.slerpQuaternions(recoilQuaternion, this.baseAimQuaternion, eased);
    });
    this.camera.position.x = this.layout.cameraPosition.x;
    this.pistolModel.slide.position.x = 0;
    this.muzzleFlash.intensity = 0;
    this.animationInProgress = false;
  }

  async animateBurn(): Promise<void> {
    this.audio.burn();
    this.burnLight.intensity = 3.2;
    await this.tween(PRESENTATION_TIMING.burnPulse, (progress) => {
      this.burnLight.intensity = 1.3 + Math.sin(progress * Math.PI * 7) * 0.85;
      this.zombieModel.root.rotation.y = Math.sin(progress * Math.PI * 4) * 0.085;
      this.zombieModel.head.rotation.z = -0.08 + Math.sin(progress * Math.PI * 5) * 0.05;
    });
    this.zombieModel.root.rotation.y = 0;
    this.zombieModel.head.rotation.z = -0.08;
  }

  async animateAdvance(distance: number): Promise<void> {
    const start = this.zombieModel.root.position.z;
    const end = 1.1 - distance * 0.72;
    this.audio.growl();
    await this.tween(PRESENTATION_TIMING.advance, (progress) => {
      this.zombieModel.root.position.z = THREE.MathUtils.lerp(start, end, this.easeInOut(progress));
      this.zombieModel.root.position.x = Math.sin(progress * Math.PI * 4) * 0.07;
    });
    this.zombieModel.root.position.x = 0;
    this.zombieTargetZ = end;
  }

  async animateDeath(): Promise<void> {
    this.zombieFallen = true;
    this.audio.death();
    await this.tween(PRESENTATION_TIMING.death, (progress) => {
      const eased = this.easeInOut(progress);
      this.zombieModel.root.rotation.z = eased * 1.38;
      this.zombieModel.root.rotation.x = eased * -0.25;
      this.zombieModel.root.position.y = -eased * 0.78;
      this.zombieModel.leftArm.rotation.x = 0.9 - eased * 0.8;
      this.zombieModel.rightArm.rotation.x = 1.05 - eased * 1.05;
    });
  }

  async animateSpawn(distance: number): Promise<void> {
    this.zombieFallen = true;
    const zombie = this.zombieModel.root;
    zombie.visible = true;
    zombie.rotation.set(0, 0, 0);
    zombie.position.set(0, -0.9, 1.1 - distance * 0.72);
    await this.tween(PRESENTATION_TIMING.spawn, (progress) => {
      zombie.position.y = THREE.MathUtils.lerp(-0.9, 0, this.easeOutBack(progress));
    });
    this.zombieTargetZ = zombie.position.z;
    this.zombieFallen = false;
  }

  private buildActors(): void {
    this.zombieModel.root.position.z = this.zombieTargetZ;
    this.burnLight.position.set(0, 0.9, 0.4);
    this.zombieModel.root.add(this.burnLight);
    this.scene.add(this.zombieModel.root);
    this.pistolModel.root.position.copy(this.layout.weaponRest);
    this.pistolModel.root.rotation.set(-0.02, -0.04, -0.08);
    const weaponFill = new THREE.PointLight(0xc9ffe0, 0.72, 4.5);
    weaponFill.position.set(0.2, 1.25, 1.2);
    this.pistolModel.root.add(weaponFill);
    this.muzzleFlash.position.set(0, 0, 0);
    this.pistolModel.muzzle.add(this.muzzleFlash);
    this.scene.add(this.pistolModel.root);
    this.magazineModel.root.visible = false;
    this.scene.add(this.magazineModel.root);
  }

  private buildEnvironment(): void {
    this.scene.add(new THREE.HemisphereLight(0x9eb7a5, 0x080a08, 1.3));
    const key = new THREE.DirectionalLight(0xd7ffe1, 2.35);
    key.position.set(-3, 7, 4);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    this.scene.add(key);
    const danger = new THREE.PointLight(0x8cff52, 1.5, 16);
    danger.position.set(2.5, 1.8, -5);
    this.scene.add(danger);
    const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x101713, roughness: 0.95, metalness: 0.05 });
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(28, 35), floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, -0.9, -5);
    floor.receiveShadow = true;
    this.scene.add(floor);
    const lineMaterial = new THREE.MeshBasicMaterial({ color: 0x24352b, transparent: true, opacity: 0.68 });
    for (let index = 0; index < 8; index += 1) {
      const line = new THREE.Mesh(new THREE.PlaneGeometry(0.025, 18), lineMaterial);
      line.rotation.x = -Math.PI / 2;
      line.position.set((index - 3.5) * 1.4, -0.892, -6);
      this.scene.add(line);
    }
    for (let index = 0; index < 12; index += 1) {
      const cross = new THREE.Mesh(new THREE.PlaneGeometry(12, 0.018), lineMaterial);
      cross.rotation.x = -Math.PI / 2;
      cross.position.set(0, -0.89, 2 - index * 1.5);
      this.scene.add(cross);
    }
    const wallMaterial = new THREE.MeshStandardMaterial({ color: 0x101814, roughness: 1 });
    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.3, 5, 24), wallMaterial);
    leftWall.position.set(-5.6, 1.4, -5);
    const rightWall = leftWall.clone();
    rightWall.position.x = 5.6;
    this.scene.add(leftWall, rightWall);
  }

  private async animateChamber(): Promise<void> {
    const slide = this.pistolModel.slide;
    const chamberZ = this.pistolModel.root.position.z;
    this.audio.slidePull();
    await this.tween(PRESENTATION_TIMING.slidePull, (progress) => {
      slide.position.x = THREE.MathUtils.lerp(0, -PRESENTATION_MOTION.slideTravel, this.easeInOut(progress));
      this.pistolModel.root.position.z = chamberZ + Math.sin(progress * Math.PI) * 0.08;
    });
    await this.wait(PRESENTATION_TIMING.slideHold);
    this.audio.slideRelease();
    await this.tween(PRESENTATION_TIMING.slideRelease, (progress) => {
      slide.position.x = THREE.MathUtils.lerp(-PRESENTATION_MOTION.slideTravel, 0, this.easeOutBack(progress));
      this.pistolModel.root.position.z = THREE.MathUtils.lerp(chamberZ + 0.08, chamberZ, progress);
    });
    slide.position.x = 0;
  }

  private createProjectile(ammoType: AmmoType): THREE.Group {
    const group = new THREE.Group();
    const color = AMMO_DEFINITIONS[ammoType].color;
    const radius = ammoType === 'magnum' ? 0.065 : 0.042;
    const projectile = new THREE.Mesh(new THREE.SphereGeometry(radius, 7, 7), new THREE.MeshBasicMaterial({ color }));
    group.add(projectile);
    if (ammoType === 'stagger' || ammoType === 'incendiary') {
      const trail = new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.35, radius, ammoType === 'stagger' ? 0.85 : 0.42, 6), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.68 }));
      trail.rotation.x = Math.PI / 2;
      trail.position.z = 0.3;
      group.add(trail);
    }
    return group;
  }

  private async animateImpact(ammoType: AmmoType, position: THREE.Vector3): Promise<void> {
    const effect = new THREE.Group();
    effect.position.copy(position);
    const color = AMMO_DEFINITIONS[ammoType].color;
    const count = ammoType === 'magnum' ? 7 : ammoType === 'incendiary' ? 5 : 3;
    const pieces: THREE.Mesh[] = [];
    for (let index = 0; index < count; index += 1) {
      const geometry = ammoType === 'incendiary' ? new THREE.SphereGeometry(0.045, 5, 4) : new THREE.TetrahedronGeometry(0.04);
      const material = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.9 });
      const piece = new THREE.Mesh(geometry, material);
      piece.userData.direction = new THREE.Vector3(Math.cos(index * 2.4), Math.sin(index * 1.8), Math.sin(index) * 0.4).normalize();
      pieces.push(piece);
      effect.add(piece);
    }
    this.scene.add(effect);
    await this.tween(170, (progress) => {
      for (const piece of pieces) {
        const direction = piece.userData.direction as THREE.Vector3;
        piece.position.copy(direction).multiplyScalar(progress * (ammoType === 'magnum' ? 0.42 : 0.25));
        (piece.material as THREE.MeshBasicMaterial).opacity = 1 - progress;
      }
    });
    this.disposeObject(effect);
  }

  private async animateHitReaction(ammoType: AmmoType): Promise<void> {
    const strength = PRESENTATION_MOTION.hitLean * (ammoType === 'magnum' ? 1.5 : 1);
    await this.tween(PRESENTATION_TIMING.hitReaction, (progress) => {
      const impulse = Math.sin(progress * Math.PI);
      this.zombieModel.root.rotation.z = impulse * strength;
      this.zombieModel.root.position.x = -impulse * strength;
      this.zombieModel.head.rotation.x = impulse * 0.12;
    });
    this.zombieModel.root.rotation.z = 0;
    this.zombieModel.root.position.x = 0;
    this.zombieModel.head.rotation.x = 0;
  }

  private clearCartridges(): void {
    for (const cartridge of this.cartridges) this.disposeObject(cartridge);
    this.cartridges.length = 0;
  }

  private setMagazineRounds(rounds: readonly AmmoType[]): void {
    for (let index = 0; index < this.magazineModel.witnessRounds.length; index += 1) {
      const witness = this.magazineModel.witnessRounds[index];
      const ammo = rounds[index];
      if (!witness) continue;
      witness.visible = Boolean(ammo);
      if (!ammo) continue;
      const material = witness.material as THREE.MeshStandardMaterial;
      material.color.setHex(AMMO_DEFINITIONS[ammo].color);
      material.emissive.setHex(AMMO_DEFINITIONS[ammo].color);
      material.emissiveIntensity = ammo === 'incendiary' ? 0.32 : 0.12;
      witness.userData.ammoType = ammo;
      witness.userData.sequenceIndex = index;
    }
  }

  private getMagazineSocketPose(offset: number): { position: THREE.Vector3; quaternion: THREE.Quaternion } {
    this.pistolModel.root.updateMatrixWorld(true);
    const position = new THREE.Vector3();
    const quaternion = new THREE.Quaternion();
    this.pistolModel.magazineSocket.getWorldPosition(position);
    this.pistolModel.magazineSocket.getWorldQuaternion(quaternion);
    const down = new THREE.Vector3(0, -1, 0).applyQuaternion(quaternion);
    position.addScaledVector(down, offset * this.pistolModel.root.scale.y);
    return { position, quaternion };
  }

  private getZombieTarget(): THREE.Vector3 {
    return this.zombieModel.root.position.clone().add(new THREE.Vector3(0, 1.05, 0.15));
  }

  private aimPistolAtTarget(target: THREE.Vector3): void {
    const pistol = this.pistolModel.root;
    pistol.position.copy(this.layout.weaponAim);
    pistol.quaternion.copy(getAimQuaternion(pistol.position, target));
    for (let iteration = 0; iteration < 4; iteration += 1) {
      pistol.updateMatrixWorld(true);
      const muzzlePosition = new THREE.Vector3();
      this.pistolModel.muzzle.getWorldPosition(muzzlePosition);
      const currentForward = new THREE.Vector3(1, 0, 0).applyQuaternion(pistol.quaternion).normalize();
      const desiredForward = target.clone().sub(muzzlePosition).normalize();
      const correction = new THREE.Quaternion().setFromUnitVectors(currentForward, desiredForward);
      pistol.quaternion.premultiply(correction).normalize();
    }
    pistol.updateMatrixWorld(true);
    this.baseAimQuaternion.copy(pistol.quaternion);
    this.baseWeaponPosition.copy(pistol.position);
  }

  private disposeObject(object: THREE.Object3D): void {
    object.removeFromParent();
    object.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      child.geometry.dispose();
      const materials = Array.isArray(child.material) ? child.material : [child.material];
      materials.forEach((material) => material.dispose());
    });
  }

  private resetWeaponPose(): void {
    this.pistolModel.root.position.copy(this.layout.weaponRest);
    this.pistolModel.root.quaternion.setFromEuler(new THREE.Euler(-0.02, -0.04, -0.08));
    this.pistolModel.slide.position.set(0, 0, 0);
  }

  private readonly resize = (): void => {
    const width = this.host.clientWidth;
    const height = this.host.clientHeight;
    this.layout = getPresentationLayout(width, height);
    this.pistolModel.root.scale.setScalar(this.layout.pistolScale);
    this.magazineModel.root.scale.setScalar(this.layout.magazineScale);
    if (!this.animationInProgress) {
      this.pistolModel.root.position.copy(this.layout.weaponRest);
      this.camera.position.copy(this.layout.cameraPosition);
      this.camera.lookAt(this.layout.cameraTarget);
    }
    this.camera.aspect = width / Math.max(height, 1);
    this.camera.fov = this.layout.cameraFov;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
  };

  private readonly handleVisibilityChange = (): void => {
    this.updateActivity();
  };

  private readonly handleBlur = (): void => {
    this.windowBlurred = true;
    this.updateActivity();
  };

  private readonly handleFocus = (): void => {
    this.windowBlurred = false;
    this.updateActivity();
  };

  private updateActivity(): void {
    this.paused = document.hidden || this.windowBlurred;
    this.audio.setActive(!this.paused);
    this.clock.getDelta();
  }

  private tick = (): void => {
    const delta = Math.min(this.clock.getDelta(), 0.05);
    if (this.paused) {
      this.animationFrame = requestAnimationFrame(this.tick);
      return;
    }
    this.elapsed += delta;
    if (!this.zombieFallen) {
      this.zombieModel.root.position.y = Math.sin(this.elapsed * 2.35) * 0.032;
      const stride = Math.sin(this.elapsed * 3.1) * 0.16;
      this.zombieModel.leftLeg.rotation.x = stride;
      this.zombieModel.rightLeg.rotation.x = -stride;
      this.zombieModel.leftArm.rotation.z = -0.08 + stride * 0.35;
      this.zombieModel.rightArm.rotation.z = 0.08 - stride * 0.35;
      this.zombieModel.head.rotation.y = Math.sin(this.elapsed * 1.45) * 0.045;
    }
    this.zombieModel.root.position.z += (this.zombieTargetZ - this.zombieModel.root.position.z) * Math.min(delta * 4, 1);
    this.renderer.render(this.scene, this.camera);
    this.animationFrame = requestAnimationFrame(this.tick);
  };

  private tween(duration: number, update: (progress: number) => void): Promise<void> {
    return new Promise((resolve) => {
      let elapsed = 0;
      let previous = performance.now();
      const frame = (now: number): void => {
        const frameTime = Math.min(Math.max(now - previous, 0), 50);
        previous = now;
        if (!this.paused) elapsed += frameTime;
        const progress = Math.min(elapsed / duration, 1);
        update(progress);
        if (progress < 1) requestAnimationFrame(frame);
        else resolve();
      };
      requestAnimationFrame(frame);
    });
  }

  private easeInOut(value: number): number {
    return value < 0.5 ? 4 * value * value * value : 1 - Math.pow(-2 * value + 2, 3) / 2;
  }

  private easeOutBack(value: number): number {
    const overshoot = 1.32;
    return 1 + (overshoot + 1) * Math.pow(value - 1, 3) + overshoot * Math.pow(value - 1, 2);
  }
}
