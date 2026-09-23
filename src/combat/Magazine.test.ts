import { describe, expect, it } from 'vitest';
import { Magazine } from './Magazine';

describe('탄창 순서', () => {
  it('삽입·교체·이동·제거가 발사 순서를 보존한다', () => {
    const magazine = new Magazine();
    expect(magazine.add('wounding')).toBe(true);
    expect(magazine.add('laceration')).toBe(true);
    expect(magazine.add('ball')).toBe(true);
    expect(magazine.move(0, 2)).toBe(true);
    expect(magazine.getRounds()).toEqual(['laceration', 'ball', 'wounding']);
    expect(magazine.set(1, 'relay')).toBe(true);
    expect(magazine.swap(1, 2)).toBe(true);
    expect(magazine.remove(0)).toBe('laceration');
    expect(magazine.getRounds()).toEqual(['wounding', 'relay']);
  });

  it('기본 4발 제한과 확장 후 6발 제한을 지킨다', () => {
    const magazine = new Magazine();
    for (let i = 0; i < 4; i += 1) expect(magazine.add('ball')).toBe(true);
    expect(magazine.add('ball')).toBe(false);
    magazine.setCapacity(6);
    expect(magazine.add('ball')).toBe(true);
    expect(magazine.add('ball')).toBe(true);
    expect(magazine.add('ball')).toBe(false);
  });
});
