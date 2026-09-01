import { describe, expect, it } from 'vitest';
import { getResponsiveLayoutMode } from './ResponsiveLayout';

describe('반응형 레이아웃 프로필', () => {
  it.each([
    [360, 800],
    [390, 844],
    [412, 915],
    [430, 932],
  ])('%d×%d 스마트폰 화면을 Portrait로 분류한다', (width, height) => {
    expect(getResponsiveLayoutMode(width, height)).toBe('portrait');
  });

  it.each([
    [1280, 720, 'desktop'],
    [768, 1024, 'desktop'],
    [844, 390, 'compact-landscape'],
  ] as const)('%d×%d 화면을 %s로 분류한다', (width, height, expected) => {
    expect(getResponsiveLayoutMode(width, height)).toBe(expected);
  });
});
