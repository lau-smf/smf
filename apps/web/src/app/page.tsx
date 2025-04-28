'use client';

import * as React from 'react';

import '@/styles/globals.css';
import { HeroComponent } from '@/components/hero/Hero';
import { useGlobalStore } from '@/store/useGlobalStore';
import { useEffect, useRef, useState } from 'react';
import { IoSend } from 'react-icons/io5';
import { HiLightBulb } from 'react-icons/hi';
import { ExperienceBackground } from '@/components/experience/ExperienceBackground';
import { ExperienceTimeline } from '@/components/experience/Timeline';
import { vipModelSurvey } from '@/constant/questions';
import { CheckboxGroup } from '@/components/experience/CheckboxGroup';
import { SentimentSlider } from '@/components/experience/SentimentSlider';
import { ChipsGroup } from '@/components/experience/ChipsGroup';
import axios from 'axios';

// Inside your HomePage component, add this state
export default function HomePage() {
  const experience = useGlobalStore.useExperience();
  const hasScrolledToAnimation = useRef(false);

  const [recommendation, setRecommendation] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Inside your component function
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionsWrapperRef = useRef<HTMLDivElement>(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [animationState, setAnimationState] = useState<
    'none' | 'exiting' | 'entering'
  >('none');
  const [isScrolling, setIsScrolling] = useState(false);
  const [animationDirection, setAnimationDirection] = useState<'next' | 'prev'>(
    'next',
  );

  // Update totalSections based on the imported questions
  const totalSections = vipModelSurvey.sections.length;

  // State for section answers - initialize with appropriate default values for each section type
  const [sectionInputs, setSectionInputs] = useState(() => {
    return vipModelSurvey.sections.map((section) => {
      if (section.type === 'multiSelect' || section.type === 'chips') {
        return new Set<string>(); // Ensure we create actual Set objects
      } else if (section.type === 'rating') {
        return section.scale > 0 ? 0 : '';
      } else {
        return '';
      }
    });
  });

  // Add these state variables to track the warning state
  const [showWarning, setShowWarning] = useState(false);
  const [warningTimer, setWarningTimer] = useState<NodeJS.Timeout | null>(null);

  // Add a function to trigger and clear the warning animation
  const triggerWarning = () => {
    // Clear existing timer if there is one
    if (warningTimer) {
      clearTimeout(warningTimer);
    }

    // Show the warning
    setShowWarning(true);

    // Set a timer to clear the warning after 5 seconds
    const timer = setTimeout(() => {
      setShowWarning(false);
    }, 5000);

    // Save the timer reference
    setWarningTimer(timer);
  };

  // Clean up the timer on component unmount
  useEffect(() => {
    return () => {
      if (warningTimer) {
        clearTimeout(warningTimer);
      }
    };
  }, [warningTimer]);

  // Add this function to check if the current section has valid input
  const hasValidInput = (sectionIndex: number) => {
    const section = vipModelSurvey.sections[sectionIndex];
    const input = sectionInputs[sectionIndex];

    if (section.type === 'multiSelect') {
      // For multiSelect, check if any options are selected
      return (input as Set<string>).size > 0;
    } else if (section.type === 'rating') {
      // For rating, check if a rating has been selected (greater than 0)
      return input !== null && input !== undefined && input !== 0;
    } else {
      // For text inputs, check if there's text
      return Boolean(input && input.toString().trim());
    }
  };

  const handleInputChange = (sectionIndex: number, value: any) => {
    const newInputs = [...sectionInputs];
    const section = vipModelSurvey.sections[sectionIndex];

    if (section.type === 'multiSelect' || section.type === 'chips') {
      // Toggle the selection for multiSelect or chips
      const selectedOptions = newInputs[sectionIndex] as Set<string>;
      const newSet = new Set(selectedOptions);

      if (newSet.has(value)) {
        newSet.delete(value);
      } else {
        newSet.add(value);
      }

      newInputs[sectionIndex] = newSet;

      // If the new selection is valid and we're showing a warning, clear it
      if (newSet.size > 0 && showWarning && sectionIndex === currentSection) {
        setShowWarning(false);
        if (warningTimer) {
          clearTimeout(warningTimer);
          setWarningTimer(null);
        }
      }
    } else if (section.type === 'rating') {
      // Just update the value for rating
      newInputs[sectionIndex] = value;

      // If the new rating is valid and we're showing a warning, clear it
      if (value > 0 && showWarning && sectionIndex === currentSection) {
        setShowWarning(false);
        if (warningTimer) {
          clearTimeout(warningTimer);
          setWarningTimer(null);
        }
      }
    } else {
      // Default text input
      newInputs[sectionIndex] = value;

      // If the new text is valid and we're showing a warning, clear it
      if (
        value &&
        value.trim() &&
        showWarning &&
        sectionIndex === currentSection
      ) {
        setShowWarning(false);
        if (warningTimer) {
          clearTimeout(warningTimer);
          setWarningTimer(null);
        }
      }
    }

    setSectionInputs(newInputs);
  };

  // Handle section transition
  const handleSectionTransition = (newSection: number) => {
    if (newSection === currentSection || isScrolling) return;

    // Set direction
    const direction = newSection > currentSection ? 'next' : 'prev';
    setAnimationDirection(direction);

    // Start exit animation
    setIsScrolling(true);
    setAnimationState('exiting');

    // After exit animation completes
    setTimeout(() => {
      // Change section
      setCurrentSection(newSection);

      // Move sections wrapper
      if (sectionsWrapperRef.current) {
        sectionsWrapperRef.current.style.transform = `translateX(-${newSection * 100}vw)`;
      }

      // Update timeline
      const timelineEvent = new CustomEvent('timeline-scroll', {
        detail: { progress: newSection / (totalSections - 1) },
      });
      document.dispatchEvent(timelineEvent);

      // Update navigation dots
      document.querySelectorAll('nav button').forEach((btn, index) => {
        if (index === newSection) {
          btn.classList.remove('bg-gray-500');
          btn.classList.add('bg-blue-500');
        } else {
          btn.classList.remove('bg-blue-500');
          btn.classList.add('bg-gray-500');
        }
      });

      // Start enter animation after a short delay
      setTimeout(() => {
        setAnimationState('entering');

        // Reset after animation completes
        setTimeout(() => {
          setIsScrolling(false);
          setAnimationState('none');
        }, 700); // Match this with the longest animation duration
      }, 100);
    }, 500); // Exit animation duration
  };

  // Handle form submission for each section
  const handleSubmit = (sectionIndex: number) => {
    const section = vipModelSurvey.sections[sectionIndex];
    const input = sectionInputs[sectionIndex];

    let hasValidInput = false;

    if (section.type === 'multiSelect') {
      // For multiSelect, check if any options are selected
      hasValidInput = (input as Set<string>).size > 0;
    } else if (section.type === 'rating') {
      // For rating, any value is valid
      hasValidInput = input !== null && input !== undefined;
    } else {
      // For text inputs, check if there's text
      hasValidInput = Boolean(input && input.toString().trim());
    }

    if (hasValidInput) {
      // Handle the submission

      // Move to next section if not on the last one
      if (sectionIndex < totalSections - 1) {
        handleSectionTransition(sectionIndex + 1);
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

  // Initialize with first section visible
  useEffect(() => {
    // Initial animation for first section
    if (experience) {
      setTimeout(() => {
        setAnimationState('entering');
        setTimeout(() => {
          setAnimationState('none');
        }, 700);
      }, 100);
    }
  }, [experience]);

  // Modify the wheel event handler
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

        // Check if trying to scroll forward
        if (direction > 0) {
          // Only allow scrolling forward if the current section has valid input
          if (!hasValidInput(currentSection)) {
            // Show warning instead of allowing scroll
            triggerWarning();
            return;
          }
        }

        let nextSection = currentSection + direction;

        // Ensure we stay within bounds
        if (nextSection < 0) nextSection = 0;
        if (nextSection >= totalSections) nextSection = totalSections - 1;

        if (nextSection !== currentSection) {
          handleSectionTransition(nextSection);
        }
      };

      // Same logic for the nav button event listeners
      const setupButtonListeners = () => {
        document.querySelectorAll('nav button').forEach((btn) => {
          btn.addEventListener('click', () => {
            if (isScrolling) return;

            const sectionIndex = parseInt(
              btn.getAttribute('data-section') || '0',
            );

            // Only allow forward navigation if current section is valid
            if (
              sectionIndex > currentSection &&
              !hasValidInput(currentSection)
            ) {
              triggerWarning();
              return;
            }

            if (sectionIndex !== currentSection) {
              handleSectionTransition(sectionIndex);
            }
          });
        });
      };

      // Call setup after a brief delay to ensure buttons exist
      setTimeout(setupButtonListeners, 100);

      container.addEventListener('wheel', handleWheel, { passive: false });
      return () => container.removeEventListener('wheel', handleWheel);
    }
  }, [
    experience,
    currentSection,
    isScrolling,
    totalSections,
    sectionInputs,
    showWarning,
  ]);

  // Add this function to your component
  const prepareApiRequest = () => {
    // Extract the data from sectionInputs based on survey sections
    const interestFields = Array.from(sectionInputs[0] as Set<string>);
    const qualities = Array.from(sectionInputs[1] as Set<string>);
    const freeTimeActivities = Array.from(sectionInputs[2] as Set<string>);

    // Map motivation scores from section ratings
    // Intrinsic motivation - section 3
    const intrinsicMotivation = Number(sectionInputs[3]);
    // Identified regulation - section 4
    const identifiedRegulation = Number(sectionInputs[4]);
    // Introjected regulation - section 5
    const introjectedRegulation = Number(sectionInputs[5]);
    // Integrated regulation - section 6
    const integratedRegulation = Number(sectionInputs[6]);
    // Amotivation - section 7
    const amotivation = Number(sectionInputs[7]);
    // External regulation - section 8
    const externalRegulation = Number(sectionInputs[8]);

    return {
      interest_fields: interestFields,
      qualities: qualities,
      free_time_activities: freeTimeActivities,
      intrinsic_motivation: intrinsicMotivation,
      identified_regulation: identifiedRegulation,
      introjected_regulation: introjectedRegulation,
      integrated_regulation: integratedRegulation,
      amotivation: amotivation,
      external_regulation: externalRegulation,
    };
  };

  // Add this function to your component
  const handleFinalSubmit = async () => {
    // Check if all sections have valid input
    const allSectionsValid = Array.from(
      { length: totalSections },
      (_, i) => i,
    ).every((index) => hasValidInput(index));

    if (!allSectionsValid) {
      triggerWarning();
      return;
    }

    try {
      setIsSubmitting(true);

      // Prepare the API request data
      const requestData = prepareApiRequest();

      console.log(JSON.stringify(requestData, null, 2));
      // Call the API
      const response = await axios.post(
        // 'https://model-268826743579.europe-west1.run.app/recommend',
        'http://localhost:8000/recommend',
        requestData,
      );

      // Store the recommendation
      setRecommendation(response.data.recommendation);

      // Scroll to the recommendation section
      setTimeout(() => {
        document.getElementById('recommendation-section')?.scrollIntoView({
          behavior: 'smooth',
        });
      }, 500);
    } catch (error) {
      console.error('Error submitting survey:', error);
      // You might want to show an error message to the user
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderQuestion = (section: any, index: number) => {
    const isCurrentSection = index === currentSection;
    const animationStyle = {
      opacity: isCurrentSection ? 1 : 0,
      animation: isCurrentSection
        ? animationState === 'exiting'
          ? `${animationDirection === 'next' ? 'fadeOutLeft' : 'fadeOutRight'} 0.5s forwards`
          : animationState === 'entering'
            ? `${animationDirection === 'next' ? 'fadeInLeft' : 'fadeInRight'} 0.7s forwards`
            : 'none'
        : 'none',
      animationDelay: '200ms',
    };

    switch (section.type) {
      case 'multiSelect':
        return (
          <div className='space-y-6' style={animationStyle}>
            <CheckboxGroup
              options={section.options}
              name={section.id}
              selectedValues={sectionInputs[index] as Set<string>}
              onChange={(value) => handleInputChange(index, value)}
              gradientFrom={section.colors.gradientFrom}
              gradientTo={section.colors.gradientTo}
            />
            <div className='pt-4'>
              <button
                onClick={() => handleSubmit(index)}
                className='px-4 py-2 rounded-lg transition-all duration-300'
                style={{
                  background: `linear-gradient(to right, ${section.colors.gradientFrom}, ${section.colors.gradientTo})`,
                }}
              >
                Continue
              </button>
            </div>
          </div>
        );

      case 'chips':
        return (
          <div className='space-y-6' style={animationStyle}>
            <ChipsGroup
              options={section.options}
              name={section.id}
              selectedValues={sectionInputs[index] as Set<string>}
              onChange={(value) => handleInputChange(index, value)}
              gradientFrom={section.colors.gradientFrom}
              gradientTo={section.colors.gradientTo}
            />
            <div className='pt-4'>
              <button
                onClick={() => handleSubmit(index)}
                className='px-4 py-2 rounded-lg transition-all duration-300'
                style={{
                  background: `linear-gradient(to right, ${section.colors.gradientFrom}, ${section.colors.gradientTo})`,
                }}
              >
                Continue
              </button>
            </div>
          </div>
        );

      case 'rating':
        return (
          <div className='space-y-8 w-full' style={animationStyle}>
            <SentimentSlider
              name={section.id}
              value={sectionInputs[index] as number}
              onChange={(value) => handleInputChange(index, value)}
              gradientFrom={section.colors.gradientFrom}
              gradientTo={section.colors.gradientTo}
              negativeLabel={section.lowLabel}
              positiveLabel={section.highLabel}
              steps={section.scale}
            />

            <div className='pt-6'>
              <button
                onClick={() => {
                  if (index === totalSections - 1) {
                    void handleFinalSubmit();
                    return;
                  }
                  handleSubmit(index);
                }}
                className='px-4 py-2 rounded-lg transition-all duration-300'
                style={{
                  background: `linear-gradient(to right, ${section.colors.gradientFrom}, ${section.colors.gradientTo})`,
                }}
              >
                {index === totalSections - 1 ? 'Submit' : 'Continue'}
              </button>
            </div>
          </div>
        );

      default:
        return (
          <div className='flex' style={animationStyle}>
            <input
              type='text'
              value={sectionInputs[index] as string}
              onChange={(e) => handleInputChange(index, e.target.value)}
              placeholder='Enter your response...'
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
                background: `linear-gradient(to right, ${section.colors.gradientFrom}, ${section.colors.gradientTo})`,
              }}
              aria-label='Send'
            >
              <IoSend className='text-white text-xl' />
            </button>
          </div>
        );
    }
  };

  // Add this function inside your HomePage component
  const LoadingAnimation = () => {
    return (
      <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50'>
        <div className='bg-gray-900 p-8 rounded-xl shadow-2xl flex flex-col items-center'>
          <div className='loading-spinner mb-4'>
            <div className='spinner'></div>
          </div>
          <p className='text-white text-lg'>
            Generating your personalized recommendation...
          </p>
        </div>
      </div>
    );
  };

  // Add this function inside your HomePage component
  const RecommendationSection = () => {
    if (!recommendation) return null;

    return (
      <section
        id='recommendation-section'
        className='min-h-screen w-full flex items-center justify-center p-6 bg-gray-950'
      >
        <div className='max-w-2xl w-full p-8 bg-black/30 backdrop-blur-md rounded-xl shadow-xl'>
          <div className='animate-fadeIn'>
            <div className='flex items-center justify-center mb-6'>
              <div className='w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center'>
                <HiLightBulb className='text-white text-3xl' />
              </div>
            </div>

            <h2 className='text-3xl font-bold mb-6 text-center text-white'>
              Your Personalized Recommendation
            </h2>

            <div className='prose prose-invert max-w-none'>
              <div className='whitespace-pre-wrap text-white/90 leading-relaxed'>
                {typeof recommendation === 'object'
                  ? JSON.stringify(recommendation, null, 2)
                  : recommendation}
              </div>
            </div>

            <div className='mt-8 flex justify-center'>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className='px-6 py-3 rounded-lg transition-all duration-300 bg-gradient-to-r from-purple-500 to-blue-500 text-white'
              >
                Back to Top
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  };

  return (
    <main className={'overflow-y-auto overflow-x-hidden scroll-smooth'}>
      {/* Define animations directly in the component */}
      <style jsx>{`
        /* Animation keyframes */
        @keyframes fadeOutLeft {
          from {
            opacity: 1;
            transform: translateX(0);
          }
          to {
            opacity: 0;
            transform: translateX(-30px);
          }
        }

        @keyframes fadeOutRight {
          from {
            opacity: 1;
            transform: translateX(0);
          }
          to {
            opacity: 0;
            transform: translateX(30px);
          }
        }

        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        /* Add animation for the pulsing bulb */
        @keyframes bulbPulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.3);
            opacity: 0.7;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-pulse {
          animation: bulbPulse 0.8s ease-in-out infinite;
        }

        /* Add to your existing style jsx block */
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .loading-spinner {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .spinner {
          width: 50px;
          height: 50px;
          border: 5px solid rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s ease-in-out infinite;
        }

        /* Add to your existing style jsx block */
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }
      `}</style>

      <HeroComponent />

      {isSubmitting && <LoadingAnimation />}

      <div
        id='horizontal-container'
        className='relative h-[95vh] overflow-hidden transition-opacity duration-700'
        ref={containerRef}
        style={{
          opacity: experience ? 1 : 0,
          visibility: experience ? 'visible' : 'hidden',
        }}
      >
        <ExperienceTimeline />

        {/* Generate experience backgrounds for each section */}
        {vipModelSurvey.sections.map((section, index) => (
          <ExperienceBackground
            key={section.id}
            colors={[
              section.colors.gradientFrom,
              section.colors.gradientTo,
              section.colors.tertiary,
            ]}
            shapes={section.background.shapes}
            count={section.background.count}
            blurRange={section.background.blurRange}
            opacityRange={section.background.opacityRange}
            seed={section.id}
            position={index}
            currentSection={currentSection}
          />
        ))}

        <div
          className='flex flex-nowrap transition-transform duration-700 ease-in-out h-full'
          id='sections-wrapper'
          ref={sectionsWrapperRef}
        >
          {vipModelSurvey.sections.map((section, index) => (
            <section
              key={section.id}
              className='relative p-4 text-white h-full w-screen flex-shrink-0 overflow-hidden bg-gray-950'
              id={`section-${index + 1}`}
            >
              <div className='h-full relative z-10'>
                <div className='flex flex-col items-center justify-center h-full max-w-2xl mx-auto'>
                  {/* Section title - using section title as the main heading */}
                  <h2
                    className='text-3xl font-bold mb-6 text-center'
                    style={{
                      opacity: index === currentSection ? 1 : 0,
                      animation:
                        index === currentSection
                          ? animationState === 'exiting'
                            ? `${animationDirection === 'next' ? 'fadeOutLeft' : 'fadeOutRight'} 0.5s forwards`
                            : animationState === 'entering'
                              ? `${animationDirection === 'next' ? 'fadeInLeft' : 'fadeInRight'} 0.7s forwards`
                              : 'none'
                          : 'none',
                      animationDelay: '0ms',
                    }}
                  >
                    {section.title}
                  </h2>

                  <div className='w-full p-6 bg-black/30 backdrop-blur-md rounded-xl mb-8 shadow-xl'>
                    {/* Description - instructions for the question */}
                    <p
                      className='text-white/80 mb-6'
                      style={{
                        opacity: index === currentSection ? 1 : 0,
                        animation:
                          index === currentSection
                            ? animationState === 'exiting'
                              ? `${animationDirection === 'next' ? 'fadeOutLeft' : 'fadeOutRight'} 0.5s forwards`
                              : animationState === 'entering'
                                ? `${animationDirection === 'next' ? 'fadeInLeft' : 'fadeInRight'} 0.7s forwards`
                                : 'none'
                            : 'none',
                        animationDelay: '150ms',
                      }}
                    >
                      {section.description}
                    </p>

                    {/* Render the appropriate input based on question type */}
                    {renderQuestion(section, index)}
                  </div>

                  {/* Helper text */}
                  <div
                    className='text-center flex items-center justify-center gap-2'
                    style={{
                      opacity: index === currentSection ? 1 : 0,
                      animation:
                        index === currentSection
                          ? animationState === 'exiting'
                            ? `${animationDirection === 'next' ? 'fadeOutLeft' : 'fadeOutRight'} 0.5s forwards`
                            : animationState === 'entering'
                              ? `${animationDirection === 'next' ? 'fadeInLeft' : 'fadeInRight'} 0.7s forwards`
                              : 'none'
                          : 'none',
                      animationDelay: '300ms',
                    }}
                  >
                    <HiLightBulb
                      className={`text-lg ${showWarning && index === currentSection ? 'animate-pulse' : ''}`}
                      style={{
                        color:
                          showWarning && index === currentSection
                            ? 'red'
                            : section.colors.gradientFrom,
                      }}
                    />
                    <span className={'text-white/70 text-sm '}>
                      {showWarning && index === currentSection
                        ? 'Please make a selection before continuing'
                        : 'Scroll to move between sections'}
                    </span>
                  </div>
                </div>
              </div>
            </section>
          ))}
        </div>
      </div>

      {recommendation && <RecommendationSection />}
    </main>
  );
}
