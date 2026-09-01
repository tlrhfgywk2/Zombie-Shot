export type ResponsiveLayoutMode = 'desktop' | 'portrait' | 'compact-landscape';

export const RESPONSIVE_LAYOUT_LIMITS = {
  portraitMaxWidth: 560,
  portraitMinAspectRatio: 1.2,
  compactLandscapeMaxHeight: 500,
} as const;

export const getResponsiveLayoutMode = (width: number, height: number): ResponsiveLayoutMode => {
  const safeWidth = Math.max(width, 1);
  const safeHeight = Math.max(height, 1);
  const portrait = safeWidth <= RESPONSIVE_LAYOUT_LIMITS.portraitMaxWidth
    && safeHeight / safeWidth >= RESPONSIVE_LAYOUT_LIMITS.portraitMinAspectRatio;

  if (portrait) return 'portrait';
  if (safeHeight <= RESPONSIVE_LAYOUT_LIMITS.compactLandscapeMaxHeight && safeWidth > safeHeight) return 'compact-landscape';
  return 'desktop';
};

export const getViewportSize = (): { width: number; height: number } => ({
  width: window.visualViewport?.width ?? window.innerWidth,
  height: window.visualViewport?.height ?? window.innerHeight,
});

export const applyResponsiveLayoutMode = (element: HTMLElement): ResponsiveLayoutMode => {
  const viewport = getViewportSize();
  const mode = getResponsiveLayoutMode(viewport.width, viewport.height);
  element.dataset.layout = mode;
  return mode;
};
