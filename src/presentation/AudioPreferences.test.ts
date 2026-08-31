import { describe, expect, it } from 'vitest';
import { AUDIO_PREFERENCES_KEY, DEFAULT_AUDIO_PREFERENCES, clampVolume, loadAudioPreferences, saveAudioPreferences } from './AudioPreferences';

describe('AudioPreferences', () => {
  it('저장값이 없거나 손상되면 안전한 기본값을 사용한다', () => {
    expect(loadAudioPreferences({ getItem: () => null })).toEqual(DEFAULT_AUDIO_PREFERENCES);
    expect(loadAudioPreferences({ getItem: () => '{broken' })).toEqual(DEFAULT_AUDIO_PREFERENCES);
  });

  it('저장된 음소거와 음량을 읽고 범위를 보정한다', () => {
    expect(loadAudioPreferences({ getItem: () => JSON.stringify({ muted: true, volume: 1.8 }) })).toEqual({ muted: true, volume: 1 });
    expect(clampVolume(-0.3)).toBe(0);
    expect(clampVolume(Number.NaN)).toBe(DEFAULT_AUDIO_PREFERENCES.volume);
  });

  it('저장 실패가 게임 흐름으로 전파되지 않는다', () => {
    expect(() => saveAudioPreferences({ muted: false, volume: 0.4 }, { setItem: () => { throw new Error('차단됨'); } })).not.toThrow();
    let saved = '';
    saveAudioPreferences({ muted: true, volume: 0.4 }, { setItem: (key, value) => { saved = `${key}:${value}`; } });
    expect(saved).toBe(`${AUDIO_PREFERENCES_KEY}:{"muted":true,"volume":0.4}`);
  });
});
