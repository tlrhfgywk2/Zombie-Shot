import { describe, expect, it } from 'vitest';
import { PRESENTATION_MOTION, PRESENTATION_TIMING } from './presentationConfig';

describe('총기 연출 타이밍', () => {
  it('기본 총기 조작과 사격 구간은 원래 1배속 시간을 사용한다', () => {
    expect(PRESENTATION_TIMING.roundInsert).toBe(210);
    expect(PRESENTATION_TIMING.slidePull).toBe(180);
    expect(PRESENTATION_TIMING.shotTravel).toBe(185);
    expect(PRESENTATION_TIMING.hitReaction).toBe(145);
    expect(PRESENTATION_TIMING.burnPulse).toBe(480);
    expect(PRESENTATION_TIMING.advance).toBe(600);
    expect(PRESENTATION_TIMING.death).toBe(650);
    expect(PRESENTATION_TIMING.spawn).toBe(480);
  });

  it('약실 확인은 짧고 슬라이드가 완전 후퇴량의 일부만 움직인다', () => {
    expect(PRESENTATION_TIMING.chamberCheckMove + PRESENTATION_TIMING.chamberCheckHold + PRESENTATION_TIMING.chamberCheckReturn).toBeLessThan(500);
    expect(PRESENTATION_MOTION.chamberCheckSlideTravel).toBeLessThan(PRESENTATION_MOTION.slideTravel * 0.15);
  });
});
