import React, { useLayoutEffect, useRef, useState } from 'react';
import { styled } from 'styled-components';

export interface PageRulerProps {
  src: string;
  side?: 'left' | 'right';
  color?: string;
  width?: number;
  tilePitch?: number;
  phaseOffset?: number;
  zIndex?: number;
  style?: React.CSSProperties;
  className?: string;
}

const NATIVE_WIDTH = 76.8649;

const Strip = styled.div<{
  $src: string;
  $side: 'left' | 'right';
  $width: number;
  $color: string;
  $scaledPitch: number;
  $phase: number;
  $zIndex: number;
}>`
  position: absolute;
  ${p => (p.$side === 'right' ? 'right: -1px;' : 'left: -1px;')}
  top: 0;
  bottom: 0;
  width: ${p => p.$width}px;

  background-color: ${p => p.$color};

  -webkit-mask-image: url(${p => p.$src});
  mask-image: url(${p => p.$src});
  -webkit-mask-repeat: repeat-y;
  mask-repeat: repeat-y;

  -webkit-mask-size: ${p => p.$width}px ${p => p.$scaledPitch}px;
  mask-size: ${p => p.$width}px ${p => p.$scaledPitch}px;

  -webkit-mask-position: 0 -${p => p.$phase}px;
  mask-position: 0 -${p => p.$phase}px;

  ${p => p.$side === 'right' ? 'transform: scaleX(-1);' : ''}

  pointer-events: none;
  z-index: ${p => p.$zIndex};

  @media (max-width: 768px) {
    display: none;
  }
`;

const PageRuler: React.FC<PageRulerProps> = ({
  src,
  side = 'left',
  color = '#a51c1c',
  width = 77,
  tilePitch = 74.5514,
  phaseOffset = 0,
  zIndex = 1,
  style,
  className,
}) => {
  const stripRef = useRef<HTMLDivElement>(null);
  const [topY, setTopY] = useState(0);

  useLayoutEffect(() => {
    const el = stripRef.current;
    if (!el) return;

    const measure = () => {
      const node = stripRef.current;
      if (!node) return;
      const r = node.getBoundingClientRect();
      setTopY(Math.round(r.top + window.scrollY));
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

  const scaledPitch = tilePitch * (width / NATIVE_WIDTH);
  const raw = topY + phaseOffset;
  const phase = ((raw % scaledPitch) + scaledPitch) % scaledPitch;

  return (
    <Strip
      ref={stripRef}
      $src={src}
      $side={side}
      $width={width}
      $color={color}
      $scaledPitch={scaledPitch}
      $phase={phase}
      $zIndex={zIndex}
      style={style}
      className={className}
      aria-hidden="true"
    />
  );
};

export default PageRuler;
