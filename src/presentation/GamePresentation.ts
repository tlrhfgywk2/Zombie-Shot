import * as THREE from 'three';
import { AMMO_DEFINITIONS } from '../data/ammoDefinitions';
import type { AmmoType } from '../combat/types';
import { AudioManager } from './AudioManager';

const wait = (milliseconds: number): Promise<void> => new Promise((resolve) => window.setTimeout(resolve, milliseconds));

export class GamePresentation {
  private readonly scene = new THREE.Scene();
  private readonly camera = new THREE.PerspectiveCamera(43, 1, 0.1, 100);
  private readonly renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  private readonly clock = new THREE.Clock();
  private readonly audio = new AudioManager();
  private readonly zombie = new THREE.Group();
  private readonly weapon = new THREE.Group();
  private readonly magazine = new THREE.Group();
  private readonly muzzleFlash = new THREE.PointLight(0xffb34a, 0, 8);
  private readonly burnLight = new THREE.PointLight(0xff5a18, 0, 5);
  private readonly cartridges: THREE.Group[] = [];
  private zombieTargetZ = -5;
  private zombieBob = 0;
  private animationFrame = 0;

  constructor(private readonly host: HTMLElement) {
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x080c0a, 1);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.domElement.setAttribute('aria-label', '플레이어 앞에 다가오는 좀비와 권총이 보이는 3D 전투 화면');
    this.host.append(this.renderer.domElement);
    this.camera.position.set(0, 2.15, 7.6);
    this.camera.lookAt(0, 1.45, -4.5);
    this.scene.fog = new THREE.FogExp2(0x0b110e, 0.045);
    this.buildEnvironment();
    this.buildZombie();
    this.buildWeapon();
    this.buildMagazine();
    this.resize();
    window.addEventListener('resize', this.resize);
    this.tick();
  }

  destroy(): void {
    cancelAnimationFrame(this.animationFrame);
    window.removeEventListener('resize', this.resize);
    this.renderer.dispose();
  }

  setZombie(distance: number, hpRatio: number, burning: boolean, level: number): void {
    this.zombieTargetZ = 1.1 - distance * 0.72;
    this.zombie.position.z = this.zombieTargetZ;
    const scale = 1 + Math.min(level - 1, 10) * 0.025;
    this.zombie.scale.setScalar(scale);
    const body = this.zombie.getObjectByName('body') as THREE.Mesh | undefined;
    if (body) {
      const material = body.material as THREE.MeshStandardMaterial;
      material.emissive.setHex(burning ? 0x5e1705 : hpRatio < 0.35 ? 0x33110d : 0x08110a);
      material.emissiveIntensity = burning ? 0.85 : 0.35;
    }
    this.burnLight.intensity = burning ? 1.4 : 0;
  }

  async animateLoading(rounds: readonly AmmoType[]): Promise<void> {
    this.audio.click(310);
    this.magazine.visible = true;
    this.magazine.position.set(-1.35, -0.25, 4.2);
    this.magazine.rotation.set(-0.15, 0, -0.2);
    this.clearCartridges();
    for (let index = 0; index < rounds.length; index += 1) {
      const ammo = rounds[index];
      if (!ammo) continue;
      const cartridge = this.createCartridge(ammo);
      cartridge.position.set(-1.35, 1.05, 4.2);
      this.scene.add(cartridge);
      this.cartridges.push(cartridge);
      await this.tween(230, (progress) => {
        cartridge.position.y = THREE.MathUtils.lerp(1.05, -0.04 + index * 0.14, this.ease(progress));
      });
      this.audio.click(430 + index * 45);
    }
    await wait(100);
    await this.tween(430, (progress) => {
      const eased = this.ease(progress);
      this.magazine.position.x = THREE.MathUtils.lerp(-1.35, 1.02, eased);
      this.magazine.position.y = THREE.MathUtils.lerp(-0.25, -0.43, eased);
      this.magazine.rotation.z = THREE.MathUtils.lerp(-0.2, 0, eased);
    });
    this.audio.rack();
    await this.tween(300, (progress) => {
      this.weapon.position.z = Math.sin(progress * Math.PI) * 0.16;
      this.weapon.rotation.x = -0.07 * Math.sin(progress * Math.PI);
    });
    this.magazine.visible = false;
    this.clearCartridges();
  }

  async animateShot(ammoType: AmmoType): Promise<void> {
    const definition = AMMO_DEFINITIONS[ammoType];
    const projectile = new THREE.Mesh(new THREE.SphereGeometry(ammoType === 'fragmenting' ? 0.075 : 0.045, 8, 8), new THREE.MeshBasicMaterial({ color: definition.color }));
    projectile.position.set(1.16, 0.73, 3.2);
    this.scene.add(projectile);
    this.muzzleFlash.color.setHex(definition.color);
    this.muzzleFlash.intensity = 7;
    this.audio.shot();
    await this.tween(230, (progress) => {
      const eased = progress * progress;
      projectile.position.z = THREE.MathUtils.lerp(3.2, this.zombie.position.z + 0.2, eased);
      projectile.position.y = THREE.MathUtils.lerp(0.73, 1.55, eased);
      this.weapon.rotation.x = -0.16 * (1 - progress);
      this.camera.position.x = Math.sin(progress * Math.PI * 5) * 0.025 * (1 - progress);
      this.muzzleFlash.intensity = 7 * (1 - progress);
    });
    this.scene.remove(projectile);
    projectile.geometry.dispose();
    (projectile.material as THREE.Material).dispose();
    this.camera.position.x = 0;
    this.weapon.rotation.x = 0;
    await this.tween(170, (progress) => {
      this.zombie.rotation.z = Math.sin(progress * Math.PI) * 0.075;
      this.zombie.position.x = Math.sin(progress * Math.PI) * -0.11;
    });
    this.zombie.rotation.z = 0;
    this.zombie.position.x = 0;
  }

  async animateBurn(): Promise<void> {
    this.burnLight.intensity = 3;
    await this.tween(520, (progress) => {
      this.burnLight.intensity = 1.2 + Math.sin(progress * Math.PI * 6) * 0.8;
      this.zombie.rotation.y = Math.sin(progress * Math.PI * 4) * 0.08;
    });
    this.zombie.rotation.y = 0;
  }

  async animateAdvance(distance: number): Promise<void> {
    const start = this.zombie.position.z;
    const end = 1.1 - distance * 0.72;
    await this.tween(650, (progress) => {
      this.zombie.position.z = THREE.MathUtils.lerp(start, end, this.ease(progress));
      this.zombie.position.x = Math.sin(progress * Math.PI * 4) * 0.06;
    });
    this.zombie.position.x = 0;
    this.zombieTargetZ = end;
  }

  async animateDeath(): Promise<void> {
    await this.tween(620, (progress) => {
      this.zombie.rotation.z = progress * 1.45;
      this.zombie.position.y = -progress * 0.75;
    });
  }

  async animateSpawn(distance: number): Promise<void> {
    this.zombie.visible = true;
    this.zombie.rotation.set(0, 0, 0);
    this.zombie.position.set(0, -0.9, 1.1 - distance * 0.72);
    await this.tween(500, (progress) => {
      this.zombie.position.y = THREE.MathUtils.lerp(-0.9, 0, this.ease(progress));
    });
    this.zombieTargetZ = this.zombie.position.z;
  }

  private buildEnvironment(): void {
    this.scene.add(new THREE.HemisphereLight(0x9eb7a5, 0x080a08, 1.4));
    const key = new THREE.DirectionalLight(0xd7ffe1, 2.4);
    key.position.set(-3, 7, 4);
    key.castShadow = true;
    this.scene.add(key);
    const danger = new THREE.PointLight(0x8cff52, 1.6, 16);
    danger.position.set(2.5, 1.8, -5);
    this.scene.add(danger);
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(28, 35), new THREE.MeshStandardMaterial({ color: 0x101713, roughness: 0.95, metalness: 0.05 }));
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, -0.9, -5);
    floor.receiveShadow = true;
    this.scene.add(floor);
    const lineMaterial = new THREE.MeshBasicMaterial({ color: 0x24352b, transparent: true, opacity: 0.7 });
    for (let index = 0; index < 9; index += 1) {
      const line = new THREE.Mesh(new THREE.PlaneGeometry(0.025, 18), lineMaterial);
      line.rotation.x = -Math.PI / 2;
      line.position.set((index - 4) * 1.4, -0.892, -6);
      this.scene.add(line);
    }
    for (let index = 0; index < 13; index += 1) {
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

  private buildZombie(): void {
    const skin = new THREE.MeshStandardMaterial({ color: 0x78906b, roughness: 0.9, emissive: 0x08110a });
    const cloth = new THREE.MeshStandardMaterial({ color: 0x34443b, roughness: 1 });
    const dark = new THREE.MeshStandardMaterial({ color: 0x161d19, roughness: 1 });
    const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.52, 1.15, 7, 12), cloth);
    body.name = 'body';
    body.position.y = 0.72;
    body.castShadow = true;
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.42, 16, 12), skin);
    head.position.set(0.06, 1.75, 0);
    head.scale.set(0.88, 1.06, 0.9);
    head.castShadow = true;
    const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0xbfff4e });
    for (const x of [-0.13, 0.17]) {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.035, 6, 5), eyeMaterial);
      eye.position.set(x, 1.83, 0.37);
      this.zombie.add(eye);
    }
    const mouth = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.055, 0.035), dark);
    mouth.position.set(0.04, 1.59, 0.38);
    this.zombie.add(mouth);
    for (const side of [-1, 1]) {
      const arm = new THREE.Mesh(new THREE.CapsuleGeometry(0.13, 1, 5, 8), skin);
      arm.position.set(side * 0.58, 0.78, 0.23);
      arm.rotation.set(Math.PI / 2.6, 0, side * -0.17);
      arm.castShadow = true;
      this.zombie.add(arm);
      const leg = new THREE.Mesh(new THREE.CapsuleGeometry(0.17, 0.85, 5, 8), dark);
      leg.position.set(side * 0.25, -0.36, 0);
      leg.castShadow = true;
      this.zombie.add(leg);
    }
    this.zombie.add(body, head, this.burnLight);
    this.zombie.position.z = this.zombieTargetZ;
    this.scene.add(this.zombie);
  }

  private buildWeapon(): void {
    const metal = new THREE.MeshStandardMaterial({ color: 0x252c29, roughness: 0.38, metalness: 0.78 });
    const grip = new THREE.MeshStandardMaterial({ color: 0x111513, roughness: 0.82 });
    const slide = new THREE.Mesh(new THREE.BoxGeometry(1.45, 0.28, 0.36), metal);
    slide.position.set(0.25, 0.45, 0);
    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 1.5, 12), metal);
    barrel.rotation.z = Math.PI / 2;
    barrel.position.set(0.47, 0.41, 0);
    const handle = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.95, 0.46), grip);
    handle.position.set(-0.17, -0.08, 0);
    handle.rotation.z = -0.18;
    const guard = new THREE.Mesh(new THREE.TorusGeometry(0.23, 0.045, 7, 12, Math.PI), metal);
    guard.position.set(0.27, 0.11, 0);
    guard.rotation.z = Math.PI;
    this.weapon.add(slide, barrel, handle, guard);
    this.weapon.position.set(0.62, -0.18, 3.75);
    this.weapon.rotation.set(-0.02, -0.05, -0.08);
    this.muzzleFlash.position.set(1.17, 0.66, -0.02);
    this.weapon.add(this.muzzleFlash);
    this.scene.add(this.weapon);
  }

  private buildMagazine(): void {
    const material = new THREE.MeshStandardMaterial({ color: 0x252c29, roughness: 0.45, metalness: 0.65 });
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.42, 1.05, 0.3), material);
    const base = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.12, 0.38), material);
    base.position.y = -0.56;
    this.magazine.add(body, base);
    this.magazine.visible = false;
    this.scene.add(this.magazine);
  }

  private createCartridge(ammoType: AmmoType): THREE.Group {
    const group = new THREE.Group();
    const brass = new THREE.MeshStandardMaterial({ color: 0xc9a556, roughness: 0.35, metalness: 0.75 });
    const tip = new THREE.MeshStandardMaterial({ color: AMMO_DEFINITIONS[ammoType].color, roughness: 0.45, metalness: 0.3 });
    const casing = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.27, 10), brass);
    const bullet = new THREE.Mesh(new THREE.ConeGeometry(0.055, 0.13, 10), tip);
    bullet.position.y = 0.2;
    group.add(casing, bullet);
    return group;
  }

  private clearCartridges(): void {
    for (const cartridge of this.cartridges) {
      this.scene.remove(cartridge);
      cartridge.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material) => material.dispose());
        }
      });
    }
    this.cartridges.length = 0;
  }

  private readonly resize = (): void => {
    const width = this.host.clientWidth;
    const height = this.host.clientHeight;
    this.camera.aspect = width / Math.max(height, 1);
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
  };

  private tick = (): void => {
    const delta = Math.min(this.clock.getDelta(), 0.05);
    this.zombieBob += delta;
    if (Math.abs(this.zombie.position.y) < 0.2) this.zombie.position.y = Math.sin(this.zombieBob * 2.3) * 0.035;
    this.zombie.position.z += (this.zombieTargetZ - this.zombie.position.z) * Math.min(delta * 4, 1);
    this.renderer.render(this.scene, this.camera);
    this.animationFrame = requestAnimationFrame(this.tick);
  };

  private tween(duration: number, update: (progress: number) => void): Promise<void> {
    return new Promise((resolve) => {
      const start = performance.now();
      const frame = (now: number): void => {
        const progress = Math.min((now - start) / duration, 1);
        update(progress);
        if (progress < 1) requestAnimationFrame(frame);
        else resolve();
      };
      requestAnimationFrame(frame);
    });
  }

  private ease(value: number): number {
    return 1 - Math.pow(1 - value, 3);
  }
}
