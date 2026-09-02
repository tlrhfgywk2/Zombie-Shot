import { describe, expect, it } from 'vitest';
import { Player } from './Player';

describe('Player 탄약 경제', () => {
  it('탄창에 넣은 탄약을 소비하고 제거한 탄약을 재고로 되돌린다', () => {
    const player = new Player();
    expect(player.addAmmo('sanctified')).toBe(true);
    expect(player.getStock().sanctified).toBe(0);

    expect(player.removeAmmo(0)).toBe(true);
    expect(player.getStock().sanctified).toBe(1);
  });

  it('급탄기 교체로 줄어든 용량의 초과 탄약을 잃지 않는다', () => {
    const player = new Player();
    player.equipAttachment('extendedFeed');
    for (let index = 0; index < 5; index += 1) expect(player.addAmmo('standard')).toBe(true);
    expect(player.magazine.capacity).toBe(5);
    expect(player.getStock().standard).toBe(5);

    expect(player.equipAttachment('reserveFeed')).toBe('extendedFeed');
    expect(player.magazine.capacity).toBe(3);
    expect(player.magazine.size).toBe(3);
    expect(player.getStock().standard).toBe(7);
  });

  it('보존되거나 미발사된 탄약을 명시적으로 재고에 회수한다', () => {
    const player = new Player();
    player.returnAmmo(['bloodHex', 'incendiary']);
    expect(player.getStock().bloodHex).toBe(2);
    expect(player.getStock().incendiary).toBe(3);
  });
});
