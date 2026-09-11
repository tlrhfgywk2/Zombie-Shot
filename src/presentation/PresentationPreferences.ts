export interface PresentationPreferences {
  speed: number;
}

export const PRESENTATION_PREFERENCES_KEY = 'zombie-shot.presentation';
export const MIN_PRESENTATION_SPEED = 0.5;
export const MAX_PRESENTATION_SPEED = 2;
export const DEFAULT_PRESENTATION_PREFERENCES: Readonly<PresentationPreferences> = { speed: 1 };

interface ReadableStorage {
  getItem(key: string): string | null;
}

interface WritableStorage {
  setItem(key: string, value: string): void;
}

export const clampPresentationSpeed = (value: number): number => Math.min(
  MAX_PRESENTATION_SPEED,
  Math.max(MIN_PRESENTATION_SPEED, Number.isFinite(value) ? value : DEFAULT_PRESENTATION_PREFERENCES.speed),
);

export const loadPresentationPreferences = (storage?: ReadableStorage): PresentationPreferences => {
  const source = storage ?? getLocalStorage();
  if (!source) return { ...DEFAULT_PRESENTATION_PREFERENCES };
  try {
    const raw = source.getItem(PRESENTATION_PREFERENCES_KEY);
    if (!raw) return { ...DEFAULT_PRESENTATION_PREFERENCES };
    const parsed = JSON.parse(raw) as Partial<PresentationPreferences>;
    return {
      speed: typeof parsed.speed === 'number' ? clampPresentationSpeed(parsed.speed) : DEFAULT_PRESENTATION_PREFERENCES.speed,
    };
  } catch {
    return { ...DEFAULT_PRESENTATION_PREFERENCES };
  }
};

export const savePresentationPreferences = (preferences: PresentationPreferences, storage?: WritableStorage): void => {
  const destination = storage ?? getLocalStorage();
  if (!destination) return;
  try {
    destination.setItem(PRESENTATION_PREFERENCES_KEY, JSON.stringify({ speed: clampPresentationSpeed(preferences.speed) }));
  } catch {
    // 저장 공간이 없어도 현재 세션의 연출 속도 변경은 유지한다.
  }
};

const getLocalStorage = (): Storage | undefined => {
  try {
    return typeof localStorage === 'undefined' ? undefined : localStorage;
  } catch {
    return undefined;
  }
};
