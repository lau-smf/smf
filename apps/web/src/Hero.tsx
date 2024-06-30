import { StartButton } from './components/StartButton';
import { cn } from '@/utils/twcn';

export const HeroComponent = () => {
  return (
    <div className={'flex flex-col items-center w-screen z-10'}>
      <h2 className={'text-white text-center leading-[60px] text-4xl'}>
        Know Your Major
      </h2>
      <h1
        className={cn(
          'text-transparent text-center bg-clip-text text-6xl leading-[60px] font-bold bg-gradient-to-r from-blue-600 to-cyan-600',
        )}
      >
        AI Student Major Fit
      </h1>
      <p className='text-center text-white w-1/4 py-6 mb-5 text-base'>
        Helping students to find the best major that fits their interests and
        skills, using AI models to evaluate the student's answers to a set of
        questions.
      </p>
      <StartButton />
    </div>
  );
};
