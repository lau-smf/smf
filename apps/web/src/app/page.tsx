'use client';

import Head from 'next/head';
import * as React from 'react';
import '@/utils/env';

import '@/styles/globals.css';
import { Glow } from '@/components/hero/Glow';
import { StarField } from '@/components/hero/StarField';
import { MusicPlayer } from '@/components/hero/MusicPlayer';
import { HorizontalTimeline } from '@/components/hero/Timeline';
import { HeroComponent } from '@/Hero';
import { useGlobalStore } from '@/store/useGlobalStore';
import { ShootingStar } from '@/components/star/Star';
import { BlurredGeometricBackground } from '@/components/BlurredGeometricBackground';
import { useEffect, useRef, useState } from 'react';
import { SectionBackground } from '@/components/SectionBackgroundComponent';

export default function HomePage() {
  const experience = useGlobalStore.useExperience();
  const hasScrolledToAnimation = useRef(false);

  // Inside your component function
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionsWrapperRef = useRef<HTMLDivElement>(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const totalSections = 3; // Update this based on your actual number of sections

  // Effect for auto-scrolling to animation section when experience starts
  useEffect(() => {
    if (experience && !hasScrolledToAnimation.current) {
      // Set the flag to prevent repeated scrolling
      hasScrolledToAnimation.current = true;

      // Add a small delay to ensure elements are rendered
      setTimeout(() => {
        // Scroll to the horizontal container
        containerRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }
  }, [experience]);

  useEffect(() => {
    const container = containerRef.current;
    const sectionsWrapper = sectionsWrapperRef.current;
    const mainElement = document.querySelector('main');

    if (!container || !sectionsWrapper || !mainElement) return;

    // If experience is not started, disable scroll
    if (!experience) {
      // Prevent scrolling on the main element
      const preventScroll = (e: WheelEvent) => {
        e.preventDefault();
      };

      mainElement.addEventListener('wheel', preventScroll, { passive: false });

      return () => {
        mainElement.removeEventListener('wheel', preventScroll);
      };
    } else {
      // When experience starts, enable horizontal scrolling
      const handleWheel = (e: WheelEvent) => {
        e.preventDefault();

        if (isScrolling) return;

        // Determine scroll direction
        const direction = e.deltaY > 0 ? 1 : -1;
        let nextSection = currentSection + direction;

        // Ensure we stay within bounds
        if (nextSection < 0) nextSection = 0;
        if (nextSection >= totalSections) nextSection = totalSections - 1;

        if (nextSection !== currentSection) {
          setIsScrolling(true);
          setCurrentSection(nextSection);

          // Move to the new section
          sectionsWrapper.style.transform = `translateX(-${nextSection * 100}vw)`;

          // Update timeline based on section
          updateTimeline(nextSection / (totalSections - 1));

          // Update active navigation dot
          document.querySelectorAll('nav button').forEach((btn, index) => {
            if (index === nextSection) {
              btn.classList.remove('bg-gray-500');
              btn.classList.add('bg-blue-500');
            } else {
              btn.classList.remove('bg-blue-500');
              btn.classList.add('bg-gray-500');
            }
          });

          // Reset scrolling flag after animation completes
          setTimeout(() => {
            setIsScrolling(false);
          }, 700); // Match this with the transition duration
        }
      };

      // Function to update timeline animation
      const updateTimeline = (progress: number) => {
        // Create a custom event to communicate with the timeline component
        const timelineEvent = new CustomEvent('timeline-scroll', {
          detail: { progress },
        });
        document.dispatchEvent(timelineEvent);
      };

      // Add click handlers to navigation buttons
      document.querySelectorAll('nav button').forEach((btn) => {
        btn.addEventListener('click', () => {
          const sectionIndex = parseInt(
            btn.getAttribute('data-section') || '0',
          );
          setCurrentSection(sectionIndex);
          sectionsWrapper.style.transform = `translateX(-${sectionIndex * 100}vw)`;
          updateTimeline(sectionIndex / (totalSections - 1));

          // Update active navigation dot
          document.querySelectorAll('nav button').forEach((b, index) => {
            if (index === sectionIndex) {
              b.classList.remove('bg-gray-500');
              b.classList.add('bg-blue-500');
            } else {
              b.classList.remove('bg-blue-500');
              b.classList.add('bg-gray-500');
            }
          });
        });
      });

      container.addEventListener('wheel', handleWheel, { passive: false });
      return () => container.removeEventListener('wheel', handleWheel);
    }
  }, [experience, currentSection, isScrolling, totalSections]);

  return (
    <main className={'overflow-y-auto overflow-x-hidden scroll-smooth'}>
      <Head>
        <title>Home</title>
      </Head>
      <section
        className={
          'relative w-screen h-screen flex flex-col items-center justify-center'
        }
        id='hero-section'
      >
        <ShootingStar />
        <Glow />
        <StarField />
        <MusicPlayer />
        <HeroComponent />
      </section>
      <div
        id='horizontal-container'
        className='relative h-[95vh] overflow-hidden transition-opacity duration-700'
        ref={containerRef}
        style={{
          opacity: experience ? 1 : 0,
          visibility: experience ? 'visible' : 'hidden',
        }}
      >
        <HorizontalTimeline />
        <SectionBackground
          colors={['#3B82F6', '#60A5FA', '#93C5FD']}
          shapes={['circle', 'square']}
          count={5}
          blurRange={['100px', '180px']}
          opacityRange={['0.4', '0.6']}
          seed='section1'
          position={0}
          currentSection={currentSection}
        />

        <SectionBackground
          colors={['#10B981', '#34D399', '#6EE7B7']}
          shapes={['triangle', 'hexagon']}
          count={4}
          blurRange={['120px', '200px']}
          opacityRange={['0.3', '0.5']}
          seed='section2'
          position={1}
          currentSection={currentSection}
        />

        <SectionBackground
          colors={['#8B5CF6', '#A78BFA', '#C4B5FD']}
          shapes={['circle', 'triangle', 'hexagon']}
          count={6}
          blurRange={['90px', '160px']}
          opacityRange={['0.4', '0.7']}
          seed='section3'
          position={2}
          currentSection={currentSection}
        />

        <div
          className='flex flex-nowrap transition-transform duration-700 ease-in-out h-full'
          id='sections-wrapper'
          ref={sectionsWrapperRef}
        >
          <section
            className='relative p-4 text-white h-full w-screen flex-shrink-0 overflow-hidden bg-gray-950'
            id='section-1'
          >
            <div className='h-full relative z-10'>
              <div className='flex flex-col items-center justify-center h-full'>
                <h2 className='text-3xl font-bold mb-4'>Section One</h2>
                <p className='text-center text-white'>
                  Use the scroll wheel to navigate horizontally between
                  sections.
                </p>
              </div>
            </div>
          </section>

          <section
            className='relative p-4 text-white h-full w-screen flex-shrink-0 overflow-hidden bg-gray-950'
            id='section-2'
          >
            <div className='h-full relative z-10'>
              <div className='flex flex-col items-center justify-center h-full'>
                <h2 className='text-3xl font-bold mb-4'>Section Two</h2>
                <p className='text-center text-white'>
                  This is the second section. Continue scrolling to see more.
                </p>
              </div>
            </div>
          </section>

          <section
            className='relative p-4 text-white h-full w-screen flex-shrink-0 overflow-hidden bg-gray-950'
            id='section-3'
          >
            <div className='h-full relative z-10'>
              <div className='flex flex-col items-center justify-center h-full'>
                <h2 className='text-3xl font-bold mb-4'>Section Three</h2>
                <p className='text-center text-white'>
                  This is the third section of the horizontal layout.
                </p>
              </div>
            </div>
          </section>
        </div>

        <nav className='fixed top-1/2 right-4 -translate-y-1/2 z-10 flex flex-col space-y-4'>
          <button
            className='w-3 h-3 rounded-full bg-blue-500 hover:bg-blue-400'
            aria-label='Go to section 1'
            data-section='0'
          ></button>
          <button
            className='w-3 h-3 rounded-full bg-gray-500 hover:bg-blue-400'
            aria-label='Go to section 2'
            data-section='1'
          ></button>
          <button
            className='w-3 h-3 rounded-full bg-gray-500 hover:bg-blue-400'
            aria-label='Go to section 3'
            data-section='2'
          ></button>
        </nav>
      </div>
    </main>
  );
}
