// ExperienceBackground.tsx
import React, { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';

type ShapeType = 'circle' | 'square' | 'triangle' | 'hexagon';

interface Shape {
  id: number;
  type: ShapeType;
  color: string;
  size: number;
  position: {
    top: string;
    left: string;
  };
  blur: string;
  opacity: string;
  rotation: number;
}

interface ExperienceBackgroundProps {
  colors: string[];
  shapes?: ShapeType[];
  count?: number;
  blurRange?: [string, string]; // min and max blur values
  opacityRange?: [string, string]; // min and max opacity values
  seed?: string; // Optional seed value for deterministic generation
  position: number; // Section position (0, 1, 2, etc.)
  currentSection: number; // Which section is currently active
}

export const ExperienceBackground: React.FC<ExperienceBackgroundProps> = ({
  colors,
  shapes = ['circle', 'square', 'triangle', 'hexagon'],
  count = 4,
  blurRange = ['80px', '150px'],
  opacityRange = ['0.3', '0.7'],
  seed = 'default',
  position,
  currentSection,
}) => {
  // Use a ref to track if shapes have been generated
  const shapesGenerated = useRef(false);
  const [shapeElements, setShapeElements] = useState<Shape[]>([]);

  // Calculate the horizontal offset based on current section
  const horizontalOffset = `${(position - currentSection) * 100}vw`;

  // Pseudo-random number generator with seed for consistent generation
  const createSeededRandom = (seed: string) => {
    // Simple hash function for the seed string
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = (hash << 5) - hash + seed.charCodeAt(i);
      hash = hash & hash; // Convert to 32bit integer
    }

    // Return a seeded random function
    return () => {
      hash = (hash * 9301 + 49297) % 233280;
      return hash / 233280;
    };
  };

  useEffect(() => {
    // Only generate shapes once when the component mounts
    if (!shapesGenerated.current) {
      const seededRandom = createSeededRandom(seed);
      const generatedShapes: Shape[] = [];

      // Generate shapes with consistent positions
      for (let i = 0; i < count; i++) {
        // Explicitly cast to ensure we're getting a ShapeType
        // Fix the issue with negative indices by ensuring positive values
        const shapeIndex =
          Math.abs(Math.floor(seededRandom() * shapes.length)) % shapes.length;
        const randomShape: ShapeType = shapes[shapeIndex]!;

        // Similarly, fix other random index calculations:
        const colorIndex =
          Math.abs(Math.floor(seededRandom() * colors.length)) % colors.length;
        const randomColor: string = colors[colorIndex]!;

        // Random size between 200px and 500px
        const randomSize = Math.abs(Math.floor(seededRandom() * 300)) + 200;

        // Random position within the viewport (0-100%)
        const randomTop = `${Math.abs(Math.floor(seededRandom() * 100))}%`;
        const randomLeft = `${Math.abs(Math.floor(seededRandom() * 100))}%`;

        // Random blur between min and max
        const minBlur = parseInt(blurRange[0]);
        const maxBlur = parseInt(blurRange[1]);
        const randomBlur = `${Math.abs(Math.floor(seededRandom() * (maxBlur - minBlur)) + minBlur)}px`;

        // Random opacity between min and max
        const minOpacity = parseFloat(opacityRange[0]);
        const maxOpacity = parseFloat(opacityRange[1]);
        const randomOpacity = Math.abs(
          seededRandom() * (maxOpacity - minOpacity) + minOpacity,
        ).toFixed(2);

        // Random rotation between 0 and 360 degrees
        const randomRotation = Math.abs(Math.floor(seededRandom() * 360)) % 360;

        generatedShapes.push({
          id: i,
          type: randomShape,
          color: randomColor,
          size: randomSize,
          position: {
            top: randomTop,
            left: randomLeft,
          },
          blur: randomBlur,
          opacity: randomOpacity,
          rotation: randomRotation,
        });
      }

      setShapeElements(generatedShapes);
      shapesGenerated.current = true;
    }
  }, [colors, shapes, count, blurRange, opacityRange, seed]);

  const renderShape = (shape: Shape) => {
    const commonStyle = {
      width: `${shape.size}px`,
      height: `${shape.size}px`,
      position: 'absolute' as const,
      top: shape.position.top,
      left: shape.position.left,
      transform: `translate(-50%, -50%) rotate(${shape.rotation}deg)`,
      filter: `blur(${shape.blur})`,
      opacity: shape.opacity,
    };

    switch (shape.type) {
      case 'circle':
        return (
          <div
            key={shape.id}
            className='rounded-full'
            style={{
              ...commonStyle,
              background: shape.color,
            }}
          />
        );
      case 'square':
        return (
          <div
            key={shape.id}
            style={{
              ...commonStyle,
              background: shape.color,
            }}
          />
        );
      case 'triangle':
        return (
          <div
            key={shape.id}
            style={{
              ...commonStyle,
              width: '0',
              height: '0',
              borderLeft: `${shape.size / 2}px solid transparent`,
              borderRight: `${shape.size / 2}px solid transparent`,
              borderBottom: `${shape.size}px solid ${shape.color}`,
              background: 'transparent',
            }}
          />
        );
      case 'hexagon':
        return (
          <div
            key={shape.id}
            style={{
              ...commonStyle,
              background: 'transparent',
            }}
          >
            <svg width={shape.size} height={shape.size} viewBox='0 0 200 200'>
              <polygon
                points='100,10 190,70 190,130 100,190 10,130 10,70'
                fill={shape.color}
              />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={cn(
        'absolute inset-0 z-40 transition-transform duration-700 ease-in-out w-screen pointer-events-none',
      )}
      style={{
        transform: `translateX(${horizontalOffset})`,
      }}
    >
      {shapeElements.map((shape) => renderShape(shape))}
    </div>
  );
};
