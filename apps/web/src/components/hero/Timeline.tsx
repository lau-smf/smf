import { useEffect, useId, useRef } from 'react';
import * as React from 'react';

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
  const lastProgressRef = useRef(0);

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

      // Keep the original white color
      tooth.setAttribute('stroke', 'white');

      // Adjust opacity for subtle emphasis
      const opacity = 0.4 + (1 - normalizedDistance) * 0.6;
      tooth.setAttribute('stroke-opacity', opacity.toString());
    });
  };

  // Handle scrolling animation
  useEffect(() => {
    const handleTimelineScroll = (event: CustomEvent) => {
      const { progress } = event.detail;

      if (!teethRef.current) return;

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
    };

    document.addEventListener(
      'timeline-scroll',
      handleTimelineScroll as EventListener,
    );

    // Also respond to window resize
    const handleResize = () => {
      if (teethRef.current) {
        updateTeethSizes(lastProgressRef.current);
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

  return (
    <div className='pointer-events-none absolute inset-0 z-50 overflow-hidden bottom-0 lg:min-h-[32rem] lg:overflow-visible'>
      <div className='absolute top-0 inset-y-full right-0 bg-gradient-to-r from-transparent via-blue-500 to-transparent w-full h-px' />
      <svg
        ref={timelineRef}
        className='absolute left-0 top-0 h-7 w-full lg:mt-1'
        aria-hidden='true'
      >
        <defs>
          <linearGradient
            id='gradient'
            gradientUnits='userSpaceOnUse'
            x1='0%'
            y1='0%'
            x2='100%'
            y2='0%'
          >
            <stop offset='0%' stopColor='white' stopOpacity='0' />
            <stop offset='50%' stopColor='white' stopOpacity='1' />
            <stop offset='100%' stopColor='white' stopOpacity='0' />
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
