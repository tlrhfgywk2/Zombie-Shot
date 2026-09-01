import { describe, expect, it } from 'vitest';
import { Magazine } from './Magazine';

describe('Magazine', () => {
  it('탄약의 삽입 순서를 보존한다', () => {
    const magazine = new Magazine();
    magazine.add('stagger');
    magazine.add('standard');
    magazine.add('incendiary');
    expect(magazine.getRounds()).toEqual(['stagger', 'standard', 'incendiary']);
  });

  it('4발을 초과하지 못한다', () => {
    const magazine = new Magazine();
    expect(['standard', 'armorPiercing', 'hollowPoint', 'incendiary'].map((ammo) => magazine.add(ammo as never))).toEqual([true, true, true, true]);
    expect(magazine.add('standard')).toBe(false);
    expect(magazine.size).toBe(4);
  });

  it('덜 채운 탄창도 유효하고 교체·제거·재배열할 수 있다', () => {
    const magazine = new Magazine();
    magazine.add('standard');
    magazine.add('stagger');
    expect(magazine.size).toBe(2);
    expect(magazine.set(0, 'incendiary')).toBe(true);
    expect(magazine.swap(0, 1)).toBe(true);
    expect(magazine.remove(1)).toBe('incendiary');
    expect(magazine.getRounds()).toEqual(['stagger']);
  });

  it('탄환을 다른 위치나 마지막 빈 슬롯으로 이동한다', () => {
    const magazine = new Magazine();
    magazine.add('standard');
    magazine.add('stagger');
    magazine.add('incendiary');
    expect(magazine.move(0, 2)).toBe(true);
    expect(magazine.getRounds()).toEqual(['stagger', 'incendiary', 'standard']);
    expect(magazine.move(0, 3)).toBe(true);
    expect(magazine.getRounds()).toEqual(['incendiary', 'standard', 'stagger']);
  });

  it('유효하지 않은 이동은 탄창을 변경하지 않는다', () => {
    const magazine = new Magazine();
    magazine.add('standard');
    expect(magazine.move(-1, 0)).toBe(false);
    expect(magazine.move(0, 2)).toBe(false);
    expect(magazine.getRounds()).toEqual(['standard']);
  });
});
