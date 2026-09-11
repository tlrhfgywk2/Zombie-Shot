import { describe, expect, it } from 'vitest';
import { GUN_HANDLING_PRESENTATION_SPEED, PRESENTATION_TIMING } from './presentationConfig';

describe('총기 연출 타이밍', () => {
  it('총기 조작과 사격 구간만 기존 대비 1.5배 속도로 조정한다', () => {
    expect(GUN_HANDLING_PRESENTATION_SPEED).toBe(1.5);
    expect(PRESENTATION_TIMING.roundInsert).toBe(Math.round(210 / 1.5));
    expect(PRESENTATION_TIMING.slidePull).toBe(Math.round(180 / 1.5));
    expect(PRESENTATION_TIMING.shotTravel).toBe(Math.round(185 / 1.5));
    expect(PRESENTATION_TIMING.hitReaction).toBe(Math.round(145 / 1.5));
    expect(PRESENTATION_TIMING.burnPulse).toBe(480);
    expect(PRESENTATION_TIMING.advance).toBe(600);
    expect(PRESENTATION_TIMING.death).toBe(650);
    expect(PRESENTATION_TIMING.spawn).toBe(480);
  });
});
