import React, { useLayoutEffect, useRef, useState } from 'react';
import { styled } from 'styled-components';

// =============================================================================
// PageRuler
// -----------------------------------------------------------------------------
// Vertical tick-ruler strip. Use once per page OR once per section: each
// instance measures its own document-Y offset and phase-locks the tile
// pattern, so stacked strips stay globally in-sync with no seam at section
// boundaries.
//
// Implementation notes:
//   * The parent must be `position: relative`. Our page wrappers already are.
//   * The Figma ruler artwork is a horizontal strip. We render a very wide
//     (20000px) ribbon, tile it horizontally, then rotate the ribbon by
//     +/-90 degrees to turn the repeat-x into a vertical ruler.
//   * The ribbon's tick shape comes from a CSS mask (not background-image).
//     The tick COLOR comes from `background-color`. This means every ruler
//     on a page shares ONE shape, so ticks line up perfectly no matter which
//     color each section chooses. Red/blue alternation becomes a per-instance
//     `color` prop instead of three different ruler images.
//   * PHASE SYNC: useLayoutEffect + ResizeObserver measure the strip's
//     document-Y center; we shift `mask-position` by `-(centerY mod pitch)`
//     (sign flipped for right-side) so tile boundaries line up globally.
// =============================================================================

export interface PageRulerProps {
  /** Mask image URL (Figma asset or imported). The image's alpha defines
   *  where ticks appear; its own color is irrelevant (we use it as a mask). */
  src: string;
  /** Which edge to pin the ruler to. Defaults to left. */
  side?: 'left' | 'right';
  /** Tick color. Defaults to #a51c1c (the Forge red). Pass '#fff' for the
   *  white rulers on dark hero gradients, '#2d4a80' for the navy variant. */
  color?: string;
  /** Strip width in pixels. Standardized at 70 to match Status/Admin/Login. */
  width?: number;
  /** Tile pitch (px) along the ruler's axis. Matches the artwork's native
   *  750px tick cadence. Changing it re-scales the ticks proportionally. */
  tilePitch?: number;
  /** z-index. Default 1 so the strip sits above sibling section backgrounds
   *  but below interactive content (which should use >= 2). */
  zIndex?: number;
  /** Passthrough style overrides (rare - for exceptional layouts). */
  style?: React.CSSProperties;
  /** Optional className for scoping / overrides. */
  className?: string;
}

/**
 * Outer strip: fixed-width column pinned to one edge, full height of the
 * parent. `overflow: hidden` clips the rotated ribbon inside.
 */
const Strip = styled.div<{
  $side: 'left' | 'right';
  $width: number;
  $zIndex: number;
}>`
  position: absolute;
  ${p => (p.$side === 'right' ? 'right: -1px;' : 'left: -1px;')}
  top: 0;
  bottom: 0;
  width: ${p => p.$width}px;
  overflow: hidden;
  pointer-events: none;
  z-index: ${p => p.$zIndex};
`;

/**
 * Inner ribbon: 20000px wide, rotated +/-90deg around center. Tiled via
 * CSS mask so every ruler instance shares the same tick shape regardless of
 * section color.
 */
const Ribbon = styled.div<{
  $src: string;
  $side: 'left' | 'right';
  $width: number;
  $tilePitch: number;
  $color: string;
  $phase: number;
}>`
  position: absolute;
  left: 50%;
  top: 50%;
  width: 20000px;
  height: ${p => p.$width}px;
  margin-left: -10000px;
  margin-top: ${p => -p.$width / 2}px;

  background-color: ${p => p.$color};

  -webkit-mask-image: url(${p => p.$src});
  mask-image: url(${p => p.$src});
  -webkit-mask-repeat: repeat-x;
  mask-repeat: repeat-x;
  -webkit-mask-size: ${p => p.$tilePitch}px ${p => p.$width}px;
  mask-size: ${p => p.$tilePitch}px ${p => p.$width}px;
  -webkit-mask-position: ${p => -p.$phase}px 0;
  mask-position: ${p => -p.$phase}px 0;

  transform: ${p =>
    p.$side === 'right'
      ? 'rotate(90deg) scaleY(-1)'
      : 'rotate(-90deg) scaleY(-1)'};
  transform-origin: center center;
`;

/**
 * PageRuler - continuous vertical ruler down the side of its positioned
 * parent. Drop in one per section; ticks stay globally in-phase.
 */
const PageRuler: React.FC<PageRulerProps> = ({
  src,
  side = 'left',
  color = '#a51c1c',
  width = 70,
  tilePitch = 750,
  zIndex = 1,
  style,
  className,
}) => {
  const stripRef = useRef<HTMLDivElement>(null);
  // centerY = the strip's vertical center in document coordinates. We key
  // the tile phase off this so stacked strips stitch together seamlessly.
  const [centerY, setCenterY] = useState(0);

  useLayoutEffect(() => {
    const el = stripRef.current;
    if (!el) return;

    const measure = () => {
      const node = stripRef.current;
      if (!node) return;
      const r = node.getBoundingClientRect();
      setCenterY(Math.round(r.top + window.scrollY + r.height / 2));
    };

    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(document.documentElement);
    if (el.parentElement) ro.observe(el.parentElement);
    ro.observe(el);

    window.addEventListener('resize', measure);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  // Phase derivation (full derivation in git history / ISSUES.md):
  //   Left  (-90deg + scaleY(-1)): ribbon_x at docY=0 is  centerY.
  //   Right (+90deg + scaleY(-1)): ribbon_x at docY=0 is -centerY.
  //   background-position: -phase px locks tile boundaries to docY multiples
  //   of tilePitch when phase = (signed centerY) mod tilePitch.
  const raw = side === 'right' ? -centerY : centerY;
  const phase = ((raw % tilePitch) + tilePitch) % tilePitch;

  return (
    <Strip
      ref={stripRef}
      $side={side}
      $width={width}
      $zIndex={zIndex}
      style={style}
      className={className}
      aria-hidden="true"
    >
      <Ribbon
        $src={src}
        $side={side}
        $width={width}
        $tilePitch={tilePitch}
        $color={color}
        $phase={phase}
      />
    </Strip>
  );
};

export default PageRuler;
