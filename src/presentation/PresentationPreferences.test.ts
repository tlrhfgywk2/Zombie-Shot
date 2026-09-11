import { describe, expect, it } from 'vitest';
import {
  DEFAULT_PRESENTATION_PREFERENCES,
  PRESENTATION_PREFERENCES_KEY,
  clampPresentationSpeed,
  loadPresentationPreferences,
  savePresentationPreferences,
} from './PresentationPreferences';

describe('PresentationPreferences', () => {
  it('기본 재생 속도는 1배속이다', () => {
    expect(loadPresentationPreferences({ getItem: () => null })).toEqual(DEFAULT_PRESENTATION_PREFERENCES);
    expect(loadPresentationPreferences({ getItem: () => '{broken' })).toEqual(DEFAULT_PRESENTATION_PREFERENCES);
  });

  it('0.5배속부터 2배속까지만 허용한다', () => {
    expect(clampPresentationSpeed(0.1)).toBe(0.5);
    expect(clampPresentationSpeed(1.25)).toBe(1.25);
    expect(clampPresentationSpeed(3)).toBe(2);
    expect(clampPresentationSpeed(Number.NaN)).toBe(1);
  });

  it('보정된 재생 속도를 저장한다', () => {
    let saved = '';
    savePresentationPreferences({ speed: 3 }, { setItem: (key, value) => { saved = `${key}:${value}`; } });
    expect(saved).toBe(`${PRESENTATION_PREFERENCES_KEY}:{"speed":2}`);
  });
});
