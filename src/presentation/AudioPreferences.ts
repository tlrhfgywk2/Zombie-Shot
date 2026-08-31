export interface AudioPreferences {
  muted: boolean;
  volume: number;
}

export const AUDIO_PREFERENCES_KEY = 'zombie-shot.audio';
export const DEFAULT_AUDIO_PREFERENCES: Readonly<AudioPreferences> = { muted: false, volume: 0.65 };

interface ReadableStorage {
  getItem(key: string): string | null;
}

interface WritableStorage {
  setItem(key: string, value: string): void;
}

export const clampVolume = (value: number): number => Math.min(1, Math.max(0, Number.isFinite(value) ? value : DEFAULT_AUDIO_PREFERENCES.volume));

export const loadAudioPreferences = (storage?: ReadableStorage): AudioPreferences => {
  const source = storage ?? getLocalStorage();
  if (!source) return { ...DEFAULT_AUDIO_PREFERENCES };
  try {
    const raw = source.getItem(AUDIO_PREFERENCES_KEY);
    if (!raw) return { ...DEFAULT_AUDIO_PREFERENCES };
    const parsed = JSON.parse(raw) as Partial<AudioPreferences>;
    return {
      muted: typeof parsed.muted === 'boolean' ? parsed.muted : DEFAULT_AUDIO_PREFERENCES.muted,
      volume: typeof parsed.volume === 'number' ? clampVolume(parsed.volume) : DEFAULT_AUDIO_PREFERENCES.volume,
    };
  } catch {
    return { ...DEFAULT_AUDIO_PREFERENCES };
  }
};

export const saveAudioPreferences = (preferences: AudioPreferences, storage?: WritableStorage): void => {
  const destination = storage ?? getLocalStorage();
  if (!destination) return;
  try {
    destination.setItem(AUDIO_PREFERENCES_KEY, JSON.stringify({ muted: preferences.muted, volume: clampVolume(preferences.volume) }));
  } catch {
    // 저장 공간이 차단되거나 가득 차도 게임과 오디오는 계속 동작해야 한다.
  }
};

const getLocalStorage = (): Storage | undefined => {
  try {
    return typeof localStorage === 'undefined' ? undefined : localStorage;
  } catch {
    return undefined;
  }
};
