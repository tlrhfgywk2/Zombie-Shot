import { describe, expect, it } from 'vitest';
import { Magazine } from './Magazine';

describe('Magazine', () => {
  it('탄약의 삽입 순서를 보존한다', () => {
    const magazine = new Magazine();
    magazine.add('tracer');
    magazine.add('standard');
    magazine.add('incendiary');
    expect(magazine.getRounds()).toEqual(['tracer', 'standard', 'incendiary']);
  });

  it('4발을 초과하지 못한다', () => {
    const magazine = new Magazine();
    expect(['standard', 'tracer', 'fragmenting', 'incendiary'].map((ammo) => magazine.add(ammo as never))).toEqual([true, true, true, true]);
    expect(magazine.add('standard')).toBe(false);
    expect(magazine.size).toBe(4);
  });

  it('덜 채운 탄창도 유효하고 교체·제거·재배열할 수 있다', () => {
    const magazine = new Magazine();
    magazine.add('standard');
    magazine.add('tracer');
    expect(magazine.size).toBe(2);
    expect(magazine.set(0, 'incendiary')).toBe(true);
    expect(magazine.swap(0, 1)).toBe(true);
    expect(magazine.remove(1)).toBe('incendiary');
    expect(magazine.getRounds()).toEqual(['tracer']);
  });
});
