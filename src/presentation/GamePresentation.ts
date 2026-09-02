import * as THREE from 'three';
import type { AmmoType, AttachmentSlot, EnemyType, PlayerCombatState } from '../combat/types';
import type { AttachmentId, LoadoutSnapshot } from '../data/attachmentDefinitions';
import { AMMO_DEFINITIONS } from '../data/ammoDefinitions';
import { AudioManager } from './AudioManager';
import type { AudioPreferences } from './AudioPreferences';
import { PRESENTATION_EFFECTS, PRESENTATION_MOTION, PRESENTATION_TIMING } from './presentationConfig';
import { getAimQuaternion, getPresentationLayout, type PresentationLayout } from './PresentationMath';
import { createAttachmentModel, createCartridge, createMagazineModel, createPistolModel, createZombieModel } from './SceneModels';

interface MuzzleSmokeEffect {
  root: THREE.Group;
  material: THREE.MeshBasicMaterial;
  velocity: THREE.Vector3;
  age: number;
  baseScale: number;
  active: boolean;
}

interface CasingEffect {
  root: THREE.Group;
  materials: THREE.MeshStandardMaterial[];
  velocity: THREE.Vector3;
  angularVelocity: THREE.Vector3;
  age: number;
  active: boolean;
}

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
  private readonly muzzleSmokePool: MuzzleSmokeEffect[] = [];
  private readonly casingPool: CasingEffect[] = [];
  private readonly attachmentVisuals: Partial<Record<AttachmentSlot, THREE.Group>> = {};
  private readonly attachmentVisualIds: Partial<Record<AttachmentSlot, AttachmentId>> = {};
  private readonly presentationDebug = new URLSearchParams(window.location.search).get('presentationDebug') === '1';
  private readonly debugBounds = {
    grip: new THREE.Box3(),
    magazineBody: new THREE.Box3(),
    magazineFull: new THREE.Box3(),
    magazineBase: new THREE.Box3(),
    magazineFeed: new THREE.Box3(),
  };
  private readonly debugSmokeMarkers: THREE.Mesh[] = [];
  private debugOverlay?: HTMLPreElement;
  private presentationState = '대기';
  private lastMagazineDiagnostic = '아직 착좌하지 않음';
  private lastSmokeDiagnostic = '아직 발사하지 않음';
  private magazineParentingDiagnostic = '부모 전환 전';
  private seatedMagazineLocalMatrix?: THREE.Matrix4;
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
  private shotEffectSequence = 0;
  private specialThreat = false;

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
    this.buildShotEffectPools();
    if (this.presentationDebug) this.buildPresentationDebug();
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
    this.debugOverlay?.remove();
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

  setAttachments(loadout: LoadoutSnapshot, playerState: PlayerCombatState): void {
    for (const slot of Object.keys(this.pistolModel.attachmentSockets) as AttachmentSlot[]) {
      const id = loadout[slot];
      const current = this.attachmentVisuals[slot];
      if (this.attachmentVisualIds[slot] !== id) {
        if (current) this.disposeObject(current);
        delete this.attachmentVisuals[slot];
        delete this.attachmentVisualIds[slot];
        if (id) {
          const visual = createAttachmentModel(id);
          this.pistolModel.attachmentSockets[slot].add(visual);
          this.attachmentVisuals[slot] = visual;
          this.attachmentVisualIds[slot] = id;
        }
      }
      const visual = this.attachmentVisuals[slot];
      if (visual) this.setAttachmentDisabledAppearance(visual, Boolean(playerState.disabledSlots[slot]));
    }
    const magazineId = loadout.magazine;
    this.magazineModel.basePlate.scale.x = magazineId === 'extendedFeed' ? 1.22 : magazineId === 'reserveFeed' ? 0.86 : 1;
  }

  wait(milliseconds: number): Promise<void> {
    return this.tween(milliseconds, () => undefined);
  }

  setZombie(distance: number, hpRatio: number, burning: boolean, level: number, type: EnemyType = 'normal'): void {
    this.zombieTargetZ = 1.1 - distance * 0.72;
    const scale = 1 + Math.min(level - 1, 10) * 0.025;
    this.zombieModel.root.scale.setScalar(scale);
    const material = this.zombieModel.torso.material as THREE.MeshStandardMaterial;
    const specialColors: Partial<Record<EnemyType, number>> = { contaminator: 0x67543f, groundshaker: 0x5b4b42, screecher: 0x3d5261 };
    material.color.setHex(specialColors[type] ?? 0x30443c);
    material.emissive.setHex(burning ? 0x5e1705 : hpRatio < 0.35 ? 0x33110d : 0x08110a);
    material.emissiveIntensity = burning ? 0.82 : 0.32;
    this.burnLight.intensity = burning ? 1.35 : 0;
    this.specialThreat = type === 'contaminator' || type === 'groundshaker' || type === 'screecher';
    this.zombieModel.threatHalo.visible = this.specialThreat;
    const haloMaterial = this.zombieModel.threatHalo.material as THREE.MeshBasicMaterial;
    haloMaterial.color.setHex(type === 'contaminator' ? 0x9bd24a : type === 'groundshaker' ? 0xff8a4c : 0x69c7ff);
  }

  private setAttachmentDisabledAppearance(root: THREE.Group, disabled: boolean): void {
    root.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      const materials = Array.isArray(child.material) ? child.material : [child.material];
      for (const material of materials) {
        if (material.userData.baseOpacity === undefined) material.userData.baseOpacity = material.opacity;
        if (material.userData.baseColor === undefined && 'color' in material) material.userData.baseColor = (material as THREE.MeshBasicMaterial).color.getHex();
        material.transparent = disabled || material.userData.baseOpacity < 1;
        material.opacity = disabled ? 0.42 : material.userData.baseOpacity as number;
        if ('color' in material && material.userData.baseColor !== undefined) (material as THREE.MeshBasicMaterial).color.setHex(disabled ? 0x8b3328 : material.userData.baseColor as number);
      }
    });
  }

  async animateLoading(rounds: readonly AmmoType[]): Promise<void> {
    this.presentationState = '탄약 삽입';
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
      this.presentationState = '탄창 확인';
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
      this.presentationState = '탄창 접근';
      const eased = this.easeInOut(progress);
      this.pistolModel.root.position.lerpVectors(pistolStartPosition, this.layout.weaponInsertion, eased);
      this.pistolModel.root.quaternion.slerpQuaternions(pistolStartQuaternion, insertionQuaternion, eased);
      this.pistolModel.root.scale.setScalar(THREE.MathUtils.lerp(this.layout.pistolScale, insertionScale, eased));
      this.pistolModel.root.updateMatrixWorld(true);
      const approachPose = this.getMagazineInsertionPose(
        PRESENTATION_MOTION.magazineApproachDistance,
        insertionScale,
      );
      magazine.position.lerpVectors(magazineStartPosition, approachPose.position, eased);
      magazine.quaternion.slerpQuaternions(magazineStartQuaternion, approachPose.quaternion, eased);
      magazine.scale.setScalar(THREE.MathUtils.lerp(magazineStartScale, insertionScale, eased));
    });
    await this.tween(PRESENTATION_TIMING.magazineSeat, (progress) => {
      this.presentationState = '탄창 착좌';
      this.pistolModel.root.position.y = this.layout.weaponInsertion.y + Math.sin(progress * Math.PI) * 0.035;
      this.pistolModel.root.updateMatrixWorld(true);
      const pose = this.getMagazineInsertionPose(THREE.MathUtils.lerp(
        PRESENTATION_MOTION.magazineApproachDistance,
        0,
        this.easeOutBack(progress),
      ), insertionScale);
      magazine.position.copy(pose.position);
      magazine.quaternion.copy(pose.quaternion);
    });
    this.attachMagazineAtSeat();
    if (!this.isMagazineSeated()) throw new Error('탄창이 실제 착좌 기준점에 도달하지 못했습니다.');
    this.presentationState = '탄창 착좌 완료';
    this.captureMagazineDiagnostic();
    this.audio.magazineSeat();
    if (this.presentationDebug) await this.wait(800);
    await this.wait(PRESENTATION_TIMING.magazineSeatingPause);
    await this.animateChamber();
    this.captureMagazineDiagnostic();
    this.presentationState = '조준 준비';
    const readyPosition = this.pistolModel.root.position.clone();
    const readyQuaternion = this.pistolModel.root.quaternion.clone();
    const target = this.getZombieTarget();
    const aimQuaternion = getAimQuaternion(this.layout.weaponAim, target);
    await this.tween(PRESENTATION_TIMING.readySettle, (progress) => {
      const eased = this.easeInOut(progress);
      this.pistolModel.root.position.lerpVectors(readyPosition, this.layout.weaponAim, eased);
      this.pistolModel.root.quaternion.slerpQuaternions(readyQuaternion, aimQuaternion, eased);
      this.pistolModel.root.scale.setScalar(THREE.MathUtils.lerp(insertionScale, this.layout.pistolScale, eased));
    });
    this.aimPistolAtTarget(target);
    this.clearCartridges();
    this.animationInProgress = false;
    this.presentationState = '사격 준비';
  }

  async animateShot(ammoType: AmmoType): Promise<void> {
    this.presentationState = `발사 · ${AMMO_DEFINITIONS[ammoType].name}`;
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
    this.spawnMuzzleSmoke();
    this.ejectShellCasing();
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
    this.presentationState = '발사 후 연기 잔류';
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
    this.presentationState = '슬라이드 후퇴';
    this.audio.slidePull();
    await this.tween(PRESENTATION_TIMING.slidePull, (progress) => {
      slide.position.x = THREE.MathUtils.lerp(0, -PRESENTATION_MOTION.slideTravel, this.easeInOut(progress));
    });
    await this.wait(PRESENTATION_TIMING.slideHold);
    this.presentationState = '슬라이드 후방 정지';
    this.audio.slideRelease();
    this.presentationState = '슬라이드 전진';
    await this.tween(PRESENTATION_TIMING.slideRelease, (progress) => {
      slide.position.x = THREE.MathUtils.lerp(-PRESENTATION_MOTION.slideTravel, 0, this.easeOutBack(progress));
    });
    slide.position.x = 0;
  }

  private buildShotEffectPools(): void {
    for (let index = 0; index < PRESENTATION_EFFECTS.smokePoolSize; index += 1) {
      const root = new THREE.Group();
      root.name = `muzzleSmoke${index}`;
      const geometry = new THREE.SphereGeometry(1, 6, 5);
      const material = new THREE.MeshBasicMaterial({
        color: 0xe2e8e4,
        transparent: true,
        opacity: 0,
        depthTest: false,
        depthWrite: false,
      });
      const puffOffsets = [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0.62, 0.35, 0.28),
        new THREE.Vector3(1.05, 0.8, -0.24),
      ];
      for (let puffIndex = 0; puffIndex < puffOffsets.length; puffIndex += 1) {
        const puff = new THREE.Mesh(geometry, material);
        puff.renderOrder = 20;
        puff.position.copy(puffOffsets[puffIndex] ?? new THREE.Vector3());
        puff.scale.setScalar(1 - puffIndex * 0.18);
        root.add(puff);
      }
      root.visible = false;
      this.scene.add(root);
      this.muzzleSmokePool.push({ root, material, velocity: new THREE.Vector3(), age: 0, baseScale: 1, active: false });
    }

    for (let index = 0; index < PRESENTATION_EFFECTS.casingPoolSize; index += 1) {
      const root = new THREE.Group();
      const brass = new THREE.MeshStandardMaterial({ color: 0xc7a04b, roughness: 0.3, metalness: 0.82, transparent: true });
      const dark = new THREE.MeshStandardMaterial({ color: 0x392d18, roughness: 0.48, metalness: 0.45, transparent: true });
      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.043, 0.048, 0.18, 8), brass);
      const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.054, 0.054, 0.018, 8), brass);
      const mouth = new THREE.Mesh(new THREE.CylinderGeometry(0.034, 0.034, 0.006, 8), dark);
      rim.position.y = -0.096;
      mouth.position.y = 0.093;
      body.castShadow = true;
      rim.castShadow = true;
      root.add(body, rim, mouth);
      root.visible = false;
      this.scene.add(root);
      this.casingPool.push({
        root,
        materials: [brass, dark],
        velocity: new THREE.Vector3(),
        angularVelocity: new THREE.Vector3(),
        age: 0,
        active: false,
      });
    }
  }

  private buildPresentationDebug(): void {
    const overlay = document.createElement('pre');
    overlay.className = 'presentation-debug';
    overlay.dataset.testid = 'presentation-debug';
    overlay.setAttribute('aria-label', '프레젠테이션 진단 정보');
    this.host.append(overlay);
    this.debugOverlay = overlay;

    const addMarker = (target: THREE.Object3D, geometry: THREE.BufferGeometry, color: number): void => {
      const material = new THREE.MeshBasicMaterial({ color, depthTest: false, toneMapped: false });
      const marker = new THREE.Mesh(geometry, material);
      marker.userData.presentationDebug = true;
      marker.renderOrder = 1000;
      target.add(marker);
    };
    addMarker(this.pistolModel.magazineSeatAnchor, new THREE.TorusGeometry(0.085, 0.018, 8, 20), 0x00ff55);
    addMarker(this.magazineModel.magazineInsertAnchor, new THREE.OctahedronGeometry(0.055), 0xff2035);
    addMarker(this.pistolModel.muzzle, new THREE.SphereGeometry(0.052, 10, 8), 0x00ffff);
    addMarker(this.pistolModel.ejectionPort, new THREE.BoxGeometry(0.085, 0.085, 0.085), 0xffff00);
    addMarker(this.pistolModel.root, new THREE.AxesHelper(0.25).geometry, 0xffffff);
    addMarker(this.magazineModel.root, new THREE.IcosahedronGeometry(0.048, 0), 0xff7aff);

    const helperColors = [0x00ff55, 0xff2035, 0xff7aff, 0x5599ff, 0xff9900];
    Object.values(this.debugBounds).forEach((box, index) => {
      const helper = new THREE.Box3Helper(box, helperColors[index] ?? 0xffffff);
      helper.userData.presentationDebug = true;
      helper.renderOrder = 999;
      const material = helper.material as THREE.LineBasicMaterial;
      material.depthTest = false;
      material.transparent = true;
      material.opacity = 0.82;
      this.scene.add(helper);
    });

    for (let index = 0; index < this.muzzleSmokePool.length; index += 1) {
      const marker = new THREE.Mesh(
        new THREE.SphereGeometry(0.07, 8, 6),
        new THREE.MeshBasicMaterial({ color: 0xff00ff, depthTest: false, toneMapped: false }),
      );
      marker.name = `smokeDebugMarker${index}`;
      marker.userData.presentationDebug = true;
      marker.visible = false;
      marker.renderOrder = 1001;
      this.scene.add(marker);
      this.debugSmokeMarkers.push(marker);
    }
  }

  private isEffectivelyVisible(object: THREE.Object3D): boolean {
    let current: THREE.Object3D | null = object;
    while (current) {
      if (!current.visible) return false;
      current = current.parent;
    }
    return true;
  }

  private isDescendantOf(object: THREE.Object3D, ancestor: THREE.Object3D): boolean {
    let current: THREE.Object3D | null = object;
    while (current) {
      if (current === ancestor) return true;
      current = current.parent;
    }
    return false;
  }

  private measureVisibleBounds(object: THREE.Object3D, reference?: THREE.Object3D): THREE.Box3 {
    this.scene.updateMatrixWorld(true);
    const bounds = new THREE.Box3().makeEmpty();
    const inverseReference = reference ? reference.matrixWorld.clone().invert() : undefined;
    object.traverse((child) => {
      if (!(child instanceof THREE.Mesh) || child.userData.presentationDebug || !this.isEffectivelyVisible(child)) return;
      child.geometry.computeBoundingBox();
      const localBounds = child.geometry.boundingBox;
      if (!localBounds) return;
      for (const x of [localBounds.min.x, localBounds.max.x]) {
        for (const y of [localBounds.min.y, localBounds.max.y]) {
          for (const z of [localBounds.min.z, localBounds.max.z]) {
            const point = new THREE.Vector3(x, y, z).applyMatrix4(child.matrixWorld);
            if (inverseReference) point.applyMatrix4(inverseReference);
            bounds.expandByPoint(point);
          }
        }
      }
    });
    return bounds;
  }

  private formatVector(vector: THREE.Vector3): string {
    return `${vector.x.toFixed(3)}, ${vector.y.toFixed(3)}, ${vector.z.toFixed(3)}`;
  }

  private formatBounds(bounds: THREE.Box3): string {
    if (bounds.isEmpty()) return '표시 안 됨';
    return `X[${bounds.min.x.toFixed(3)}, ${bounds.max.x.toFixed(3)}] Y[${bounds.min.y.toFixed(3)}, ${bounds.max.y.toFixed(3)}] Z[${bounds.min.z.toFixed(3)}, ${bounds.max.z.toFixed(3)}]`;
  }

  private captureMagazineDiagnostic(): void {
    const gripBounds = this.measureVisibleBounds(this.pistolModel.gripBody, this.pistolModel.grip);
    const bodyBounds = this.measureVisibleBounds(this.magazineModel.body, this.pistolModel.grip);
    const fullBounds = this.measureVisibleBounds(this.magazineModel.root, this.pistolModel.grip);
    const baseBounds = this.measureVisibleBounds(this.magazineModel.basePlate, this.pistolModel.grip);
    const feedBounds = this.measureVisibleBounds(this.magazineModel.feedEnd, this.pistolModel.grip);
    const bodyBelowGrip = Math.max(0, gripBounds.min.y - bodyBounds.min.y);
    const centerOffsetX = bodyBounds.getCenter(new THREE.Vector3()).x - gripBounds.getCenter(new THREE.Vector3()).x;
    const centerOffsetZ = bodyBounds.getCenter(new THREE.Vector3()).z - gripBounds.getCenter(new THREE.Vector3()).z;
    const magazineCopies: THREE.Object3D[] = [];
    this.scene.traverse((child) => { if (child.name === 'magazineRoot') magazineCopies.push(child); });
    this.lastMagazineDiagnostic = [
      `손잡이 축 손잡이 ${this.formatBounds(gripBounds)}`,
      `손잡이 축 탄창 몸체 ${this.formatBounds(bodyBounds)}`,
      `손잡이 축 탄창 전체 ${this.formatBounds(fullBounds)}`,
      `손잡이 축 바닥판 ${this.formatBounds(baseBounds)}`,
      `손잡이 축 급탄부 ${this.formatBounds(feedBounds)}`,
      `몸체 하단 돌출 ${bodyBelowGrip.toFixed(4)} · 중심 X/Z 오차 ${centerOffsetX.toFixed(4)}/${centerOffsetZ.toFixed(4)}`,
      `${this.magazineParentingDiagnostic} · 슬라이드 중 상대 변형 ${this.getSeatedMagazineLocalDrift()}`,
      `월드 손잡이 ${this.formatBounds(this.measureVisibleBounds(this.pistolModel.gripBody))}`,
      `월드 탄창 몸체 ${this.formatBounds(this.measureVisibleBounds(this.magazineModel.body))}`,
      `탄창 UUID ${this.magazineModel.root.uuid} · 장면 내 magazineRoot ${magazineCopies.length}개`,
    ].join('\n');
  }

  private captureSmokeDiagnostic(effect: MuzzleSmokeEffect): void {
    this.scene.updateMatrixWorld(true);
    const world = effect.root.getWorldPosition(new THREE.Vector3());
    const projected = world.clone().project(this.camera);
    const width = this.renderer.domElement.clientWidth;
    const height = this.renderer.domElement.clientHeight;
    const screenX = (projected.x * 0.5 + 0.5) * width;
    const screenY = (-projected.y * 0.5 + 0.5) * height;
    const distance = this.camera.position.distanceTo(world);
    const pixelsPerWorldUnit = height / (2 * Math.tan(THREE.MathUtils.degToRad(this.camera.fov) / 2) * Math.max(distance, 0.001));
    const diameterPixels = effect.root.scale.x * 2 * pixelsPerWorldUnit;
    this.lastSmokeDiagnostic = [
      `월드 ${this.formatVector(world)}`,
      `NDC ${this.formatVector(projected)} · 화면 ${screenX.toFixed(1)}, ${screenY.toFixed(1)} px`,
      `추정 지름 ${diameterPixels.toFixed(1)} px · 불투명도 ${effect.material.opacity.toFixed(3)} · 나이 ${(effect.age * 1000).toFixed(0)} ms`,
      `활성 장면 하위 ${this.isDescendantOf(effect.root, this.scene)} · 유효 표시 ${this.isEffectivelyVisible(effect.root)} · 카메라 레이어 ${Boolean(effect.root.layers.mask & this.camera.layers.mask)}`,
    ].join('\n');
  }

  private updatePresentationDebug(): void {
    if (!this.presentationDebug || !this.debugOverlay) return;
    this.debugBounds.grip.copy(this.measureVisibleBounds(this.pistolModel.gripBody));
    this.debugBounds.magazineBody.copy(this.measureVisibleBounds(this.magazineModel.body));
    this.debugBounds.magazineFull.copy(this.measureVisibleBounds(this.magazineModel.root));
    this.debugBounds.magazineBase.copy(this.measureVisibleBounds(this.magazineModel.basePlate));
    this.debugBounds.magazineFeed.copy(this.measureVisibleBounds(this.magazineModel.feedEnd));

    const seatPosition = this.pistolModel.magazineSeatAnchor.getWorldPosition(new THREE.Vector3());
    const insertPosition = this.magazineModel.magazineInsertAnchor.getWorldPosition(new THREE.Vector3());
    const seatRotation = this.pistolModel.magazineSeatAnchor.getWorldQuaternion(new THREE.Quaternion());
    const insertRotation = this.magazineModel.magazineInsertAnchor.getWorldQuaternion(new THREE.Quaternion());
    let activeSmoke = 0;
    let firstActive: MuzzleSmokeEffect | undefined;
    this.muzzleSmokePool.forEach((effect, index) => {
      const marker = this.debugSmokeMarkers[index];
      if (marker) {
        marker.visible = effect.active;
        if (effect.active) marker.position.copy(effect.root.position);
      }
      if (effect.active) {
        activeSmoke += 1;
        firstActive ??= effect;
      }
    });
    if (firstActive && firstActive.age < 0.08) this.captureSmokeDiagnostic(firstActive);
    this.debugOverlay.textContent = [
      '프레젠테이션 진단 모드',
      '초록 고리=착좌 · 빨강 팔면체=삽입 · 청록=총구 · 노랑=배출구 · 자홍=연기',
      `상태 ${this.presentationState}`,
      `앵커 거리 ${seatPosition.distanceTo(insertPosition).toFixed(5)} · 회전차 ${THREE.MathUtils.radToDeg(seatRotation.angleTo(insertRotation)).toFixed(3)}°`,
      `탄창 부모 ${this.magazineModel.root.parent?.name || '(이름 없음)'} · 활성 연기 ${activeSmoke}`,
      '',
      '[최근 착좌 측정]',
      this.lastMagazineDiagnostic,
      '',
      '[최근 연기 측정]',
      this.lastSmokeDiagnostic,
    ].join('\n');
  }

  private spawnMuzzleSmoke(): void {
    const effect = this.muzzleSmokePool.find((candidate) => !candidate.active) ?? this.muzzleSmokePool[0];
    if (!effect) return;
    const position = new THREE.Vector3();
    const quaternion = new THREE.Quaternion();
    const weaponScale = new THREE.Vector3();
    this.pistolModel.muzzle.getWorldPosition(position);
    this.pistolModel.muzzle.getWorldQuaternion(quaternion);
    this.pistolModel.root.getWorldScale(weaponScale);
    const variation = this.effectVariation(this.shotEffectSequence, 0.07);
    const forward = new THREE.Vector3(1, 0, 0).applyQuaternion(quaternion).normalize();
    const outward = new THREE.Vector3(0, 0, 1).applyQuaternion(quaternion).normalize();
    effect.root.position.copy(position).addScaledVector(forward, PRESENTATION_EFFECTS.smokeMuzzleOffset * weaponScale.x);
    effect.root.quaternion.copy(quaternion);
    effect.velocity.copy(forward).multiplyScalar(PRESENTATION_EFFECTS.smokeForwardSpeed)
      .addScaledVector(new THREE.Vector3(0, 1, 0), PRESENTATION_EFFECTS.smokeUpSpeed)
      .addScaledVector(outward, PRESENTATION_EFFECTS.smokeOutwardSpeed + variation);
    effect.baseScale = Math.max(weaponScale.x, 0.72) * PRESENTATION_EFFECTS.smokeInitialScale;
    effect.root.scale.setScalar(effect.baseScale);
    effect.material.opacity = PRESENTATION_EFFECTS.smokeInitialOpacity;
    effect.age = 0;
    effect.active = true;
    effect.root.visible = true;
  }

  private ejectShellCasing(): void {
    const effect = this.casingPool.find((candidate) => !candidate.active) ?? this.casingPool[0];
    if (!effect) return;
    const position = new THREE.Vector3();
    const quaternion = new THREE.Quaternion();
    const weaponScale = new THREE.Vector3();
    this.pistolModel.ejectionPort.getWorldPosition(position);
    this.pistolModel.ejectionPort.getWorldQuaternion(quaternion);
    this.pistolModel.root.getWorldScale(weaponScale);
    const variation = this.effectVariation(this.shotEffectSequence, 0.12);
    const localVelocity = new THREE.Vector3(
      -PRESENTATION_EFFECTS.casingBackwardSpeed + variation * 0.35,
      PRESENTATION_EFFECTS.casingUpSpeed + variation,
      PRESENTATION_EFFECTS.casingOutwardSpeed + variation * 0.45,
    );
    effect.root.position.copy(position);
    effect.root.quaternion.copy(quaternion).multiply(
      new THREE.Quaternion().setFromEuler(new THREE.Euler(variation, 0, variation * 0.6)),
    );
    effect.root.scale.setScalar(Math.max(weaponScale.x, 0.72) * PRESENTATION_EFFECTS.casingScale);
    effect.velocity.copy(localVelocity.applyQuaternion(quaternion));
    effect.angularVelocity.set(10.5 + variation * 8, 15.5 - variation * 7, 8.5 + variation * 5);
    effect.materials.forEach((material) => { material.opacity = 1; });
    effect.age = 0;
    effect.active = true;
    effect.root.visible = true;
    this.shotEffectSequence += 1;
  }

  private effectVariation(sequence: number, range: number): number {
    return Math.sin((sequence + 1) * 12.9898) * range;
  }

  private updateShotEffects(delta: number): void {
    for (const effect of this.muzzleSmokePool) {
      if (!effect.active) continue;
      effect.age += delta;
      const progress = Math.min(effect.age / (PRESENTATION_EFFECTS.smokeLifetime / 1000), 1);
      effect.root.position.addScaledVector(effect.velocity, delta);
      effect.root.scale.setScalar(effect.baseScale * (1 + PRESENTATION_EFFECTS.smokeExpansion * this.easeInOut(progress)));
      const fadeProgress = THREE.MathUtils.clamp(
        (progress - PRESENTATION_EFFECTS.smokeFadeDelay) / (1 - PRESENTATION_EFFECTS.smokeFadeDelay),
        0,
        1,
      );
      effect.material.opacity = PRESENTATION_EFFECTS.smokeInitialOpacity * Math.pow(1 - fadeProgress, 1.25);
      if (progress >= 1) {
        effect.active = false;
        effect.root.visible = false;
      }
    }

    for (const effect of this.casingPool) {
      if (!effect.active) continue;
      effect.age += delta;
      const progress = Math.min(effect.age / (PRESENTATION_EFFECTS.casingLifetime / 1000), 1);
      effect.velocity.y -= PRESENTATION_EFFECTS.casingGravity * delta;
      effect.root.position.addScaledVector(effect.velocity, delta);
      effect.root.rotateX(effect.angularVelocity.x * delta);
      effect.root.rotateY(effect.angularVelocity.y * delta);
      effect.root.rotateZ(effect.angularVelocity.z * delta);
      const opacity = THREE.MathUtils.clamp((1 - progress) * 5, 0, 1);
      effect.materials.forEach((material) => { material.opacity = opacity; });
      if (progress >= 1) {
        effect.active = false;
        effect.root.visible = false;
      }
    }
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

  private getMagazineInsertionPose(distance: number, scale: number): { position: THREE.Vector3; quaternion: THREE.Quaternion } {
    this.pistolModel.root.updateMatrixWorld(true);
    this.magazineModel.magazineInsertAnchor.updateMatrix();
    const seatPosition = new THREE.Vector3();
    const quaternion = new THREE.Quaternion();
    this.pistolModel.magazineSeatAnchor.getWorldPosition(seatPosition);
    this.pistolModel.magazineSeatAnchor.getWorldQuaternion(quaternion);
    const down = new THREE.Vector3(0, -1, 0).applyQuaternion(quaternion);
    seatPosition.addScaledVector(down, distance * scale);
    const anchorMatrix = new THREE.Matrix4().compose(
      seatPosition,
      quaternion,
      new THREE.Vector3(scale, scale, scale),
    );
    const magazineMatrix = anchorMatrix.multiply(this.magazineModel.magazineInsertAnchor.matrix.clone().invert());
    const position = new THREE.Vector3();
    const ignoredScale = new THREE.Vector3();
    magazineMatrix.decompose(position, quaternion, ignoredScale);
    return { position, quaternion };
  }

  private attachMagazineAtSeat(): void {
    const magazine = this.magazineModel.root;
    this.pistolModel.root.updateMatrixWorld(true);
    const beforePosition = magazine.getWorldPosition(new THREE.Vector3());
    const beforeQuaternion = magazine.getWorldQuaternion(new THREE.Quaternion());
    this.pistolModel.magazineSeatAnchor.attach(magazine);
    this.magazineModel.magazineInsertAnchor.updateMatrix();
    const localMatrix = this.magazineModel.magazineInsertAnchor.matrix.clone().invert();
    localMatrix.decompose(magazine.position, magazine.quaternion, magazine.scale);
    this.pistolModel.root.updateMatrixWorld(true);
    const afterPosition = magazine.getWorldPosition(new THREE.Vector3());
    const afterQuaternion = magazine.getWorldQuaternion(new THREE.Quaternion());
    this.magazineParentingDiagnostic = `부모 전환 위치 점프 ${beforePosition.distanceTo(afterPosition).toFixed(6)} · 회전 점프 ${THREE.MathUtils.radToDeg(beforeQuaternion.angleTo(afterQuaternion)).toFixed(6)}°`;
    this.seatedMagazineLocalMatrix = magazine.matrix.clone();
  }

  private getSeatedMagazineLocalDrift(): string {
    if (!this.seatedMagazineLocalMatrix) return '측정 전';
    this.magazineModel.root.updateMatrix();
    const currentPosition = new THREE.Vector3();
    const currentQuaternion = new THREE.Quaternion();
    const currentScale = new THREE.Vector3();
    const seatedPosition = new THREE.Vector3();
    const seatedQuaternion = new THREE.Quaternion();
    const seatedScale = new THREE.Vector3();
    this.magazineModel.root.matrix.decompose(currentPosition, currentQuaternion, currentScale);
    this.seatedMagazineLocalMatrix.decompose(seatedPosition, seatedQuaternion, seatedScale);
    return `${currentPosition.distanceTo(seatedPosition).toFixed(6)} / ${THREE.MathUtils.radToDeg(currentQuaternion.angleTo(seatedQuaternion)).toFixed(6)}° / ${currentScale.distanceTo(seatedScale).toFixed(6)}`;
  }

  private isMagazineSeated(): boolean {
    if (this.magazineModel.root.parent !== this.pistolModel.magazineSeatAnchor) return false;
    const seatPosition = new THREE.Vector3();
    const insertPosition = new THREE.Vector3();
    const seatQuaternion = new THREE.Quaternion();
    const insertQuaternion = new THREE.Quaternion();
    this.pistolModel.magazineSeatAnchor.getWorldPosition(seatPosition);
    this.magazineModel.magazineInsertAnchor.getWorldPosition(insertPosition);
    this.pistolModel.magazineSeatAnchor.getWorldQuaternion(seatQuaternion);
    this.magazineModel.magazineInsertAnchor.getWorldQuaternion(insertQuaternion);
    return seatPosition.distanceToSquared(insertPosition) < 0.000001
      && seatQuaternion.angleTo(insertQuaternion) < 0.000001
      && this.magazineModel.root.scale.distanceToSquared(new THREE.Vector3(1, 1, 1)) < 0.000001;
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
    this.magazineModel.root.scale.setScalar(
      this.magazineModel.root.parent === this.pistolModel.magazineSeatAnchor ? 1 : this.layout.magazineScale,
    );
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
    this.updateShotEffects(delta);
    this.updatePresentationDebug();
    if (!this.zombieFallen) {
      this.zombieModel.root.position.y = Math.sin(this.elapsed * 2.35) * 0.032;
      const stride = Math.sin(this.elapsed * 3.1) * 0.16;
      this.zombieModel.leftLeg.rotation.x = stride;
      this.zombieModel.rightLeg.rotation.x = -stride;
      this.zombieModel.leftArm.rotation.z = -0.08 + stride * 0.35;
      this.zombieModel.rightArm.rotation.z = 0.08 - stride * 0.35;
      this.zombieModel.head.rotation.y = Math.sin(this.elapsed * 1.45) * 0.045;
      if (this.specialThreat) {
        const pulse = 1 + Math.sin(this.elapsed * 4.2) * 0.055;
        this.zombieModel.threatHalo.scale.setScalar(pulse);
        this.zombieModel.threatHalo.rotation.z = this.elapsed * 0.18;
      }
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
