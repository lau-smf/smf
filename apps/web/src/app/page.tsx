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
import { IoSend } from 'react-icons/io5';

// Structure for section questions
interface SectionQuestion {
  title: string;
  question: string;
  placeholder: string;
  gradientFrom: string;
  gradientTo: string;
}

export default function HomePage() {
  const experience = useGlobalStore.useExperience();
  const hasScrolledToAnimation = useRef(false);

  // Inside your component function
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionsWrapperRef = useRef<HTMLDivElement>(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const totalSections = 3; // Update this based on your actual number of sections

  // State for section answers
  const [sectionInputs, setSectionInputs] = useState(['', '', '']);

  // Define the questions and colors for each section
  const sectionQuestions: SectionQuestion[] = [
    {
      title: 'Your Experience',
      question: 'What brings you joy in your daily life?',
      placeholder: 'Share your thoughts...',
      gradientFrom: '#3B82F6', // Blue
      gradientTo: '#60A5FA',
    },
    {
      title: 'Your Goals',
      question: "What's one goal you'd like to achieve this year?",
      placeholder: 'Type your goal here...',
      gradientFrom: '#10B981', // Green
      gradientTo: '#34D399',
    },
    {
      title: 'Your Values',
      question: 'What value do you cherish the most and why?',
      placeholder: 'Explain your values...',
      gradientFrom: '#8B5CF6', // Purple
      gradientTo: '#A78BFA',
    },
  ];

  // Handle input changes
  const handleInputChange = (sectionIndex: number, value: string) => {
    const newInputs = [...sectionInputs];
    newInputs[sectionIndex] = value;
    setSectionInputs(newInputs);
  };

  // Handle form submission for each section
  const handleSubmit = (sectionIndex: number) => {
    if (sectionInputs[sectionIndex].trim()) {
      // Handle the submission (can be expanded later)
      console.log(
        `Section ${sectionIndex + 1} answer:`,
        sectionInputs[sectionIndex],
      );

      // Clear the input after submission
      const newInputs = [...sectionInputs];
      newInputs[sectionIndex] = '';
      setSectionInputs(newInputs);

      // Show a success message or proceed to next section
      if (sectionIndex < totalSections - 1) {
        // Move to next section if not on the last one
        setCurrentSection(sectionIndex + 1);
        sectionsWrapperRef.current!.style.transform = `translateX(-${(sectionIndex + 1) * 100}vw)`;
        updateTimeline((sectionIndex + 1) / (totalSections - 1));

        // Update active navigation dot
        document.querySelectorAll('nav button').forEach((btn, index) => {
          if (index === sectionIndex + 1) {
            btn.classList.remove('bg-gray-500');
            btn.classList.add('bg-blue-500');
          } else {
            btn.classList.remove('bg-blue-500');
            btn.classList.add('bg-gray-500');
          }
        });
      }
    }
  };

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
          {sectionQuestions.map((sectionData, index) => (
            <section
              key={index}
              className='relative p-4 text-white h-full w-screen flex-shrink-0 overflow-hidden bg-gray-950'
              id={`section-${index + 1}`}
            >
              <div className='h-full relative z-10'>
                <div className='flex flex-col items-center justify-center h-full max-w-2xl mx-auto'>
                  <h2 className='text-3xl font-bold mb-4'>
                    {sectionData.title}
                  </h2>

                  <div className='w-full p-6 bg-black/30 backdrop-blur-md rounded-xl mb-8 shadow-xl'>
                    <h3 className='text-xl mb-4'>{sectionData.question}</h3>

                    <div className='flex'>
                      <input
                        type='text'
                        value={sectionInputs[index]}
                        onChange={(e) =>
                          handleInputChange(index, e.target.value)
                        }
                        placeholder={sectionData.placeholder}
                        className='flex-grow px-4 py-3 bg-black/50 text-white border border-white/20 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-white/50'
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleSubmit(index);
                          }
                        }}
                      />
                      <button
                        onClick={() => handleSubmit(index)}
                        className='px-4 py-3 rounded-r-lg transition-all duration-300 flex items-center justify-center'
                        style={{
                          background: `linear-gradient(to right, ${sectionData.gradientFrom}, ${sectionData.gradientTo})`,
                        }}
                        aria-label='Send'
                      >
                        <IoSend className='text-white text-xl' />
                      </button>
                    </div>
                  </div>

                  <p className='text-center text-white/70 text-sm'>
                    Scroll or use the navigation dots to move between sections
                  </p>
                </div>
              </div>
            </section>
          ))}
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
