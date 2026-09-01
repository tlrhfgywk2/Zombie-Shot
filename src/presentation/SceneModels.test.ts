import { describe, expect, it } from 'vitest';
import { createPistolModel } from './SceneModels';

describe('권총 모델 기준점', () => {
  it('총구는 총열의 +X 전방에 있고 명시적으로 이름 붙어 있다', () => {
    const pistol = createPistolModel();

    expect(pistol.muzzle.name).toBe('muzzle');
    expect(pistol.muzzle.position.x).toBeGreaterThan(1);
    expect(pistol.muzzle.parent).toBe(pistol.root);
  });

  it('탄창 소켓은 손잡이 안에 있고 탄피 배출구는 슬라이드의 보이는 측면에 있다', () => {
    const pistol = createPistolModel();

    expect(pistol.magazineSocket.name).toBe('magazineSocket');
    expect(pistol.magazineSocket.parent?.parent).toBe(pistol.root);
    expect(pistol.ejectionPort.name).toBe('ejectionPort');
    expect(pistol.ejectionPort.parent).toBe(pistol.slide);
    expect(pistol.ejectionPort.position.y).toBeGreaterThan(0.6);
    expect(pistol.ejectionPort.position.z).toBeGreaterThan(0.2);
  });
});
