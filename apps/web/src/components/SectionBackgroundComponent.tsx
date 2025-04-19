// SectionBackground.tsx
import React from 'react';
import { BlurredGeometricBackground } from './BlurredGeometricBackground';

interface SectionBackgroundProps {
  colors: string[];
  shapes: ('circle' | 'square' | 'triangle' | 'hexagon')[];
  count: number;
  blurRange: [string, string];
  opacityRange: [string, string];
  seed: string;
  position: number; // Section position (0, 1, 2, etc.)
  currentSection: number; // Which section is currently active
}

export const SectionBackground: React.FC<SectionBackgroundProps> = ({
  colors,
  shapes,
  count,
  blurRange,
  opacityRange,
  seed,
  position,
  currentSection,
}) => {
  // Calculate the horizontal offset based on current section
  const horizontalOffset = `${(position - currentSection) * 100}vw`;

  return (
    <div
      className='absolute inset-0 z-40 transition-transform duration-700 ease-in-out'
      style={{
        transform: `translateX(${horizontalOffset})`,
        width: '100vw',
        pointerEvents: 'none',
      }}
    >
      <BlurredGeometricBackground
        colors={colors}
        shapes={shapes}
        count={count}
        blurRange={blurRange}
        opacityRange={opacityRange}
        seed={seed}
      />
    </div>
  );
};
