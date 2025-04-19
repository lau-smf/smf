import { useEffect, useId, useRef, useState } from 'react';
import * as React from 'react';
import { Circle, Square, Triangle } from 'lucide-react';

export function Timeline() {
  // Original Timeline implementation
  let id = useId();

  return (
    <div className='pointer-events-none absolute inset-0 z-50 overflow-hidden lg:right-[calc(max(2rem,50%-38rem)+40rem)] lg:min-w-[32rem] lg:overflow-visible'>
      <svg
        className='absolute left-[max(0px,calc(50%-18.125rem))] top-0 h-full w-1.5 lg:left-full lg:ml-1 xl:left-auto xl:right-1 xl:ml-0'
        aria-hidden='true'
      >
        <defs>
          <pattern id={id} width='6' height='8' patternUnits='userSpaceOnUse'>
            <path
              d='M0 0H6M0 8H6'
              className='stroke-sky-900/10 xl:stroke-white/10 dark:stroke-white/10'
              fill='none'
            />
          </pattern>
        </defs>
        <rect width='100%' height='100%' fill={`url(#${id})`} />
      </svg>
    </div>
  );
}

export const HorizontalTimeline = () => {
  const id = useId();
  const maskId = `mask-${id}`;
  const timelineRef = useRef<SVGSVGElement>(null);
  const teethRef = useRef<SVGGElement>(null);
  const gradientRef = useRef<SVGLinearGradientElement>(null);
  const lastProgressRef = useRef(0);
  const timelineContainerRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState(0);

  // Define section colors that match the SectionBackground colors
  const sectionGradients = [
    ['#3B82F6', '#60A5FA', '#93C5FD'], // Blue gradient for section 1
    ['#10B981', '#34D399', '#6EE7B7'], // Green gradient for section 2
    ['#8B5CF6', '#A78BFA', '#C4B5FD'], // Purple gradient for section 3
  ];

  // Set up the initial teeth
  useEffect(() => {
    const svg = timelineRef.current;
    const teethGroup = teethRef.current;

    if (!svg || !teethGroup) return;

    // Clear any existing teeth
    while (teethGroup.firstChild) {
      teethGroup.removeChild(teethGroup.firstChild);
    }

    // Create teeth with 8px spacing (matching original pattern)
    const spacing = 8;
    const viewportWidth = window.innerWidth;
    const numberOfTeeth = Math.ceil(viewportWidth / spacing) + 20; // Add extra teeth for smooth animation

    for (let i = 0; i < numberOfTeeth; i++) {
      const x = i * spacing;
      const line = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'line',
      );
      line.setAttribute('x1', x.toString());
      line.setAttribute('y1', '0');
      line.setAttribute('x2', x.toString());
      line.setAttribute('y2', '6'); // Initial height
      line.setAttribute('stroke', 'white');
      line.setAttribute('stroke-width', '1');
      line.setAttribute('data-index', i.toString());

      teethGroup.appendChild(line);
    }

    // Initial teeth size adjustment
    updateTeethSizes(0.5); // Start with middle teeth larger
  }, []);

  // Function to update teeth heights based on their position using quadratic (x²) function
  const updateTeethSizes = (scrollProgress: number) => {
    const teethGroup = teethRef.current;
    if (!teethGroup) return;

    const teeth = teethGroup.querySelectorAll('line');
    const viewportWidth = window.innerWidth;
    const centerPos = viewportWidth / 2;

    teeth.forEach((tooth) => {
      const x = parseFloat(tooth.getAttribute('x1') || '0');

      // Calculate normalized distance from center (0 to 1)
      // Use 40% of viewport as our normalization range for a more pronounced effect
      const distanceFromCenter =
        Math.abs(x - centerPos) / (viewportWidth * 0.4);
      const clampedDistance = Math.min(1, distanceFromCenter); // Clamp to 1

      // Apply quadratic function (x²) - this gives a more natural curve than linear
      // but less extreme than higher exponents
      const normalizedDistance = Math.pow(clampedDistance, 2);

      // Calculate height: small at edges, large in middle
      const minHeight = 6; // Original height
      const maxHeight = 12; // Significantly taller in center (4x)
      const height = maxHeight - normalizedDistance * (maxHeight - minHeight);

      // Update the height
      tooth.setAttribute('y2', height.toString());

      // Keep teeth white
      tooth.setAttribute('stroke', 'white');

      // Adjust opacity for subtle emphasis
      const opacity = 0.4 + (1 - normalizedDistance) * 0.6;
      tooth.setAttribute('stroke-opacity', opacity.toString());
    });
  };

  // Helper functions for color interpolation
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  const componentToHex = (c: number) => {
    const hex = c.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  const rgbToHex = (r: number, g: number, b: number) => {
    return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
  };

  // Function to interpolate between colors based on progress
  const interpolateColors = (progress: number) => {
    // Determine which sections we're between
    const totalSections = sectionGradients.length;
    const exactPosition = progress * (totalSections - 1);
    const lowerIndex = Math.floor(exactPosition);
    const upperIndex = Math.min(lowerIndex + 1, totalSections - 1);

    // Calculate how far we are between these two sections (0-1)
    const sectionProgress = exactPosition - lowerIndex;

    // Get the colors for both sections
    const lowerColors = sectionGradients[lowerIndex];
    const upperColors = sectionGradients[upperIndex];

    // Interpolate between the colors
    return lowerColors.map((startColor, i) => {
      const endColor = upperColors[i];
      const startRGB = hexToRgb(startColor);
      const endRGB = hexToRgb(endColor);

      if (!startRGB || !endRGB) return startColor;

      const r = Math.round(
        startRGB.r + (endRGB.r - startRGB.r) * sectionProgress,
      );
      const g = Math.round(
        startRGB.g + (endRGB.g - startRGB.g) * sectionProgress,
      );
      const b = Math.round(
        startRGB.b + (endRGB.b - startRGB.b) * sectionProgress,
      );

      return rgbToHex(r, g, b);
    });
  };

  // Handle scrolling animation
  useEffect(() => {
    const handleTimelineScroll = (event: CustomEvent) => {
      const { progress } = event.detail;

      if (!teethRef.current || !gradientRef.current) return;

      // Calculate the animation based on progress difference
      const progressDelta = progress - lastProgressRef.current;
      lastProgressRef.current = progress;

      // Move teeth one by one
      const teeth = teethRef.current.querySelectorAll('line');
      const viewportWidth = window.innerWidth;
      const moveAmount = progressDelta * 40; // Adjust for desired speed

      teeth.forEach((tooth) => {
        // Get current position and calculate new position
        const currentX = parseFloat(tooth.getAttribute('x1') || '0');
        let newX = currentX - moveAmount; // Move in opposite direction of scroll

        // Wrap around if needed
        if (newX < -8) newX += viewportWidth + 16;
        if (newX > viewportWidth + 8) newX -= viewportWidth + 16;

        // Update position
        tooth.setAttribute('x1', newX.toString());
        tooth.setAttribute('x2', newX.toString());
      });

      // Update teeth sizes based on their new positions
      updateTeethSizes(progress);

      // Smoothly update gradient colors based on the scroll progress
      const interpolatedColors = interpolateColors(progress);

      // Update the gradient stops directly
      const stops = gradientRef.current.querySelectorAll('stop');
      stops[0].setAttribute('stop-color', interpolatedColors[0]);
      stops[1].setAttribute('stop-color', interpolatedColors[1]);
      stops[2].setAttribute('stop-color', interpolatedColors[2]);

      // Also update the horizontal line gradient
      const horizontalLine = document.querySelector(
        '.horizontal-timeline-line',
      );
      if (horizontalLine) {
        horizontalLine.setAttribute(
          'style',
          `background: linear-gradient(to right, transparent, ${interpolatedColors[1]}, transparent)`,
        );
      }

      // Update active section for icon display
      const totalSections = 3;
      setActiveSection(Math.round(progress * (totalSections - 1)));

      // Update section icons positions
      updateSectionIcons(progress);
    };

    document.addEventListener(
      'timeline-scroll',
      handleTimelineScroll as EventListener,
    );

    // Also respond to window resize
    const handleResize = () => {
      if (teethRef.current) {
        updateTeethSizes(lastProgressRef.current);
        updateSectionIcons(lastProgressRef.current);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      document.removeEventListener(
        'timeline-scroll',
        handleTimelineScroll as EventListener,
      );
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Function to update section icons based on progress
  const updateSectionIcons = (progress: number) => {
    // Calculate which section we're in (0, 1, or 2)
    const totalSections = 3;
    const currentActiveSection = Math.round(progress * (totalSections - 1));

    // Loop through all icons and update their positions
    for (let i = 0; i < totalSections; i++) {
      const icon = document.getElementById(`section-icon-${i}`);
      if (!icon) continue;

      let positionClass = '';

      // Determine if icon should be visible and where
      if (i === currentActiveSection) {
        // Current section icon is in center
        positionClass = 'current';
      } else if (i === currentActiveSection + 1) {
        // Next section icon is to the right
        positionClass = 'next';
      } else if (i === currentActiveSection - 1) {
        // Previous section icon is to the left
        positionClass = 'prev';
      } else {
        // Other icons are hidden
        positionClass = 'hidden';
      }

      // Remove all position classes and add the new one
      icon.classList.remove(
        'icon-current',
        'icon-next',
        'icon-prev',
        'icon-hidden',
      );
      icon.classList.add(`icon-${positionClass}`);
    }
  };

  // Initialize section icons once
  useEffect(() => {
    // Start bounce animation when active section changes
    const icon = document.getElementById(`section-icon-${activeSection}`);
    if (icon) {
      // Reset animation by removing and adding the class
      icon.classList.remove('bounce-animation');
      void icon.offsetWidth; // Trigger reflow to restart animation
      icon.classList.add('bounce-animation');
    }
  }, [activeSection]);

  // Get icon component based on section index
  const getIconComponent = (index: number) => {
    switch (index) {
      case 0:
        return <Circle size={22} color='white' />;
      case 1:
        return <Square size={22} color='white' />;
      case 2:
        return <Triangle size={22} color='white' />;
      default:
        return <Circle size={22} color='white' />;
    }
  };

  return (
    <div
      className='pointer-events-none absolute inset-0 z-50 overflow-hidden bottom-0 lg:min-h-[32rem] lg:overflow-visible'
      ref={timelineContainerRef}
    >
      {/* CSS for section icons */}
      <style jsx global>{`
        .section-icon {
          position: absolute;
          top: 28px; /* Position directly under the timeline teeth */
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transform-origin: center;
          z-index: 60;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
        }

        /* Current section icon (center) */
        .icon-current {
          left: 50%;
          transform: translateX(-50%) scale(1);
          width: 40px;
          height: 40px;
          opacity: 1;
          transition: all 1s cubic-bezier(0.22, 1, 0.36, 1);
        }

        /* Next section icon (right) */
        .icon-next {
          left: calc(50% + 70px);
          transform: translateX(0) scale(0.7);
          width: 32px;
          height: 32px;
          opacity: 0.7;
          transition: all 1s cubic-bezier(0.22, 1, 0.36, 1);
        }

        /* Previous section icon (left) */
        .icon-prev {
          left: calc(50% - 70px);
          transform: translateX(-100%) scale(0.7);
          width: 32px;
          height: 32px;
          opacity: 0.7;
          transition: all 1s cubic-bezier(0.22, 1, 0.36, 1);
        }

        /* Hidden icons */
        .icon-hidden {
          opacity: 0;
          transform: translateX(0) scale(0.5);
          transition: all 0.7s ease-out;
          pointer-events: none;
        }

        /* Bouncing animation */
        @keyframes bounce {
          0%,
          100% {
            transform: translateX(-50%) translateY(0) scale(1);
          }
          50% {
            transform: translateX(-50%) translateY(-5px) scale(1.05);
          }
        }

        .bounce-animation {
          animation: bounce 0.7s ease-in-out;
        }

        .section-icon-inner {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
        }
      `}</style>

      {/* Section Icons */}
      {sectionGradients.map((colors, index) => (
        <div
          key={index}
          id={`section-icon-${index}`}
          className={`section-icon ${index === 0 ? 'icon-current' : index === 1 ? 'icon-next' : 'icon-hidden'}`}
          style={{
            backgroundColor: colors[1],
          }}
        >
          <div className='section-icon-inner'>{getIconComponent(index)}</div>
        </div>
      ))}

      <div
        className='horizontal-timeline-line absolute top-0 inset-y-full right-0 w-full h-px'
        style={{
          background: `linear-gradient(to right, transparent, ${sectionGradients[0][1]}, transparent)`,
        }}
      />
      <svg
        ref={timelineRef}
        className='absolute left-0 top-0 h-7 w-full lg:mt-1'
        aria-hidden='true'
      >
        <defs>
          <linearGradient
            id='gradient'
            ref={gradientRef}
            gradientUnits='userSpaceOnUse'
            x1='0%'
            y1='0%'
            x2='100%'
            y2='0%'
          >
            <stop
              offset='0%'
              stopColor={sectionGradients[0][0]}
              stopOpacity='0'
            />
            <stop
              offset='50%'
              stopColor={sectionGradients[0][1]}
              stopOpacity='1'
            />
            <stop
              offset='100%'
              stopColor={sectionGradients[0][2]}
              stopOpacity='0'
            />
          </linearGradient>

          <mask id={maskId}>
            <rect
              x='0'
              y='0'
              width='100%'
              height='100%'
              fill='url(#gradient)'
            />
          </mask>
        </defs>

        {/* Group for all teeth with mask applied */}
        <g ref={teethRef} mask={`url(#${maskId})`}></g>
      </svg>
    </div>
  );
};
