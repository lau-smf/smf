// Import Lucide icons directly in the survey file
import {
  BookOpen,
  Brain,
  Heart,
  Award,
  Target,
  Users,
  HeartHandshake,
  HelpCircle,
  DollarSign,
  // Add these new icons for the options
  HandHeart,
  Ear,
  Footprints,
  ClipboardCheck,
  Clock,
  Lightbulb,
  Sprout,
  Dumbbell,
  Eye,
  Sparkles,
  Palette,
  Users as UsersIcon,
  Microphone,
  Hammer,
  CpuChip,
  Binary,
  Compass,
  FilePlus2,
  FolderCheck,
  // Free time activity icons
  HeartHandshake as Volunteer,
  Heart as Caretaking,
  Apple,
  Mountain,
  Beaker,
  Drama,
  PenTool,
  PaintBucket,
  Wrench,
  Laptop,
  Presentation,
} from 'lucide-react';

export const vipModelSurvey = {
  sections: [
    {
      id: 'interests',
      title: 'Which field(s) sound interesting to you?',
      description: 'Check all that apply.',
      type: 'multiSelect',
      icon: BookOpen, // Direct component reference
      colors: {
        gradientFrom: '#3B82F6', // Blue
        gradientTo: '#60A5FA',
        tertiary: '#93C5FD',
      },
      background: {
        shapes: ['circle', 'square'],
        count: 5,
        blurRange: ['100px', '180px'],
        opacityRange: ['0.4', '0.6'],
      },
      options: [
        {
          id: 'health',
          text: 'Health and medicine related (helping people stay healthy, taking care of pets...)',
        },
        {
          id: 'agriculture',
          text: 'Agriculture and sciences (predicting weather, growing plants, working in a chemistry lab...)',
        },
        {
          id: 'arts',
          text: 'Arts and communication (reading, writing, acting, photography...)',
        },
        {
          id: 'engineering',
          text: 'Engineering and technology (putting things together, using tools, using math to solve problems...)',
        },
        {
          id: 'business',
          text: 'Business and management (working with computer programs, taking notes at meetings, being in charge of a group...)',
        },
        {
          id: 'service',
          text: 'Human and public service (helping people solve problems, prepare food, working with children and elderly...)',
        },
      ],
    },
    {
      id: 'qualities',
      title: 'Which of the following qualities describe you best?',
      description: 'Check all that apply.',
      type: 'chips',
      icon: Brain, // Direct component reference
      colors: {
        gradientFrom: '#10B981', // Green
        gradientTo: '#34D399',
        tertiary: '#6EE7B7',
      },
      background: {
        shapes: ['triangle', 'hexagon'],
        count: 4,
        blurRange: ['120px', '200px'],
        opacityRange: ['0.3', '0.5'],
      },
      options: [
        {
          id: 'compassionate',
          text: 'Compassionate and caring',
          icon: HandHeart,
        },
        { id: 'listener', text: 'Good listener', icon: Ear },
        {
          id: 'directions',
          text: 'Good at following directions',
          icon: Footprints,
        },
        {
          id: 'conscientious',
          text: 'Conscientious and careful',
          icon: ClipboardCheck,
        },
        { id: 'patient', text: 'Patient', icon: Clock },
        { id: 'problemSolver', text: 'Problem solver', icon: Lightbulb },
        { id: 'natureLover', text: 'Nature Lover', icon: Sprout },
        { id: 'active', text: 'Physically Active', icon: Dumbbell },
        { id: 'observer', text: 'Observer', icon: Eye },
        { id: 'imaginative', text: 'Imaginative', icon: Sparkles },
        { id: 'creative', text: 'Creative', icon: Palette },
        { id: 'outgoing', text: 'Outgoing', icon: UsersIcon },
        { id: 'performer', text: 'Performer', icon: Microphone },
        {
          id: 'handsOn',
          text: 'Like using hands to create things',
          icon: Hammer,
        },
        { id: 'logical', text: 'Logical thinker', icon: CpuChip },
        { id: 'practical', text: 'Practical', icon: Binary },
        { id: 'decisive', text: 'Good at making decisions', icon: Compass },
        { id: 'openMinded', text: 'Open-minded', icon: FilePlus2 },
        { id: 'organized', text: 'Organized', icon: FolderCheck },
      ],
    },
    {
      id: 'freeTime',
      title: 'What do you enjoy doing in your free time?',
      description: 'Check all that apply.',
      type: 'chips',
      icon: Heart, // Direct component reference
      colors: {
        gradientFrom: '#8B5CF6', // Purple
        gradientTo: '#A78BFA',
        tertiary: '#C4B5FD',
      },
      background: {
        shapes: ['circle', 'triangle', 'hexagon'],
        count: 6,
        blurRange: ['90px', '160px'],
        opacityRange: ['0.4', '0.7'],
      },
      options: [
        { id: 'volunteering', text: 'Volunteering', icon: Volunteer },
        { id: 'caretaking', text: 'Taking care of others', icon: Caretaking },
        { id: 'health', text: 'Working on being healthy', icon: Apple },
        { id: 'hiking', text: 'Hiking', icon: Mountain },
        { id: 'experimenting', text: 'Experimentation', icon: Beaker },
        { id: 'acting', text: 'Acting', icon: Drama },
        { id: 'writing', text: 'Writing', icon: PenTool },
        { id: 'painting', text: 'Painting', icon: PaintBucket },
        { id: 'building', text: 'Building things', icon: Wrench },
        { id: 'computing', text: 'Working with a computer', icon: Laptop },
        { id: 'coaching', text: 'Coaching/tutoring', icon: Presentation },
      ],
    },
    {
      id: 'enjoySubject',
      title: "It's important to me that I genuinely enjoy the subject I study",
      description: 'Mark only one oval.',
      type: 'rating',
      scale: 5,
      icon: Award, // Direct component reference
      lowLabel: 'Strongly Disagree',
      highLabel: 'Strongly Agree',
      colors: {
        gradientFrom: '#F59E0B', // Amber
        gradientTo: '#FBBF24',
        tertiary: '#FCD34D',
      },
      background: {
        shapes: ['square', 'circle'],
        count: 5,
        blurRange: ['110px', '190px'],
        opacityRange: ['0.4', '0.6'],
      },
    },
    {
      id: 'personalGoals',
      title:
        'I want to choose a major that helps me reach personal goals I really care about',
      description: 'Mark only one oval.',
      type: 'rating',
      scale: 5,
      icon: Target, // Direct component reference
      lowLabel: 'Strongly Disagree',
      highLabel: 'Strongly Agree',
      colors: {
        gradientFrom: '#EF4444', // Red
        gradientTo: '#F87171',
        tertiary: '#FCA5A5',
      },
      background: {
        shapes: ['circle', 'triangle'],
        count: 4,
        blurRange: ['130px', '210px'],
        opacityRange: ['0.3', '0.5'],
      },
    },
    {
      id: 'othersExpectations',
      title:
        'What other people expect from me plays a big role in how I am thinking about choosing a major',
      description: 'Mark only one oval.',
      type: 'rating',
      scale: 5,
      icon: Users, // Direct component reference
      lowLabel: 'Strongly Disagree',
      highLabel: 'Strongly Agree',
      colors: {
        gradientFrom: '#EC4899', // Pink
        gradientTo: '#F472B6',
        tertiary: '#F9A8D4',
      },
      background: {
        shapes: ['hexagon', 'square'],
        count: 6,
        blurRange: ['95px', '170px'],
        opacityRange: ['0.4', '0.6'],
      },
    },
    {
      id: 'reflectsValues',
      title:
        'I want to choose a major that really resembles who I am and reflects my values.',
      description: 'Mark only one oval.',
      type: 'rating',
      scale: 5,
      icon: HeartHandshake, // Direct component reference
      lowLabel: 'Strongly Disagree',
      highLabel: 'Strongly Agree',
      colors: {
        gradientFrom: '#06B6D4', // Cyan
        gradientTo: '#22D3EE',
        tertiary: '#67E8F9',
      },
      background: {
        shapes: ['circle', 'square', 'triangle'],
        count: 7,
        blurRange: ['105px', '185px'],
        opacityRange: ['0.3', '0.6'],
      },
    },
    {
      id: 'unsure',
      title:
        "I often feel unsure about what I want or why I'm even choosing a major",
      description: 'Mark only one oval.',
      type: 'rating',
      scale: 5,
      icon: HelpCircle, // Direct component reference
      lowLabel: 'Strongly Disagree',
      highLabel: 'Strongly Agree',
      colors: {
        gradientFrom: '#7C3AED', // Violet
        gradientTo: '#A78BFA',
        tertiary: '#C4B5FD',
      },
      background: {
        shapes: ['triangle', 'hexagon', 'circle'],
        count: 5,
        blurRange: ['115px', '195px'],
        opacityRange: ['0.4', '0.7'],
      },
    },
    {
      id: 'financial',
      title:
        'A big factor in my decision is how secure and financially stable the job options are in that field',
      description: 'Mark only one oval.',
      type: 'rating',
      scale: 5,
      icon: DollarSign, // Direct component reference
      lowLabel: 'Strongly Disagree',
      highLabel: 'Strongly Agree',
      colors: {
        gradientFrom: '#0EA5E9', // Sky
        gradientTo: '#38BDF8',
        tertiary: '#7DD3FC',
      },
      background: {
        shapes: ['square', 'circle', 'hexagon'],
        count: 6,
        blurRange: ['125px', '205px'],
        opacityRange: ['0.3', '0.6'],
      },
    },
  ],
};
