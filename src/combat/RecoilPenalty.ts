/** 발사 전 누적 반동으로 이번 탄에 적용할 정수 화력 감소를 구한다. */
export function recoilFirepowerPenalty(accumulatedRecoil: number, effectiveThreshold: number): number {
  const excess = Math.max(0, accumulatedRecoil - effectiveThreshold);
  return excess === 0 ? 0 : Math.min(3, Math.ceil(excess / 2));
}
