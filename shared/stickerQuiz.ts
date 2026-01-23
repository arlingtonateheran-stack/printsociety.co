// Sticker finder quiz to help customers select perfect products
// Interactive quiz that recommends stickers based on customer needs

export interface QuizQuestion {
  id: string;
  question: string;
  description?: string;
  type: 'single-choice' | 'multiple-choice' | 'slider' | 'text';
  options?: QuizOption[];
  minValue?: number;
  maxValue?: number;
  step?: number;
  required: boolean;
}

export interface QuizOption {
  id: string;
  label: string;
  value: string;
  points: Record<string, number>;
  icon?: string;
}

export interface QuizAnswer {
  questionId: string;
  answer: string | string[] | number;
  confidence: number;
}

export interface QuizResult {
  recommendedProducts: ProductRecommendation[];
  primaryUseCase: string;
  materialSuggestion: string;
  designTips: string[];
  nextSteps: string[];
  customizationOptions: CustomizationOption[];
}

export interface ProductRecommendation {
  productId: string;
  productName: string;
  match: number;
  whyRecommended: string;
  pricing?: {
    basePrice: number;
    estimatedTotal: number;
    quantity: number;
  };
}

export interface CustomizationOption {
  category: string;
  options: string[];
  description: string;
}

// Quiz questions
export const STICKER_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'use-case',
    question: 'What will you use the stickers for?',
    description: 'Help us understand your primary use case',
    type: 'single-choice',
    options: [
      {
        id: 'personal',
        label: 'Personal Use',
        value: 'personal',
        points: { waterproof: 1, durable: 2, fun: 3 },
        icon: '👤',
      },
      {
        id: 'business-branding',
        label: 'Business Branding',
        value: 'business',
        points: { professional: 3, durable: 3, premium: 2 },
        icon: '🏢',
      },
      {
        id: 'resale',
        label: 'Resale/Wholesale',
        value: 'resale',
        points: { durable: 3, affordable: 3, volume: 3 },
        icon: '📦',
      },
      {
        id: 'apparel',
        label: 'Apparel/Merchandise',
        value: 'apparel',
        points: { flexible: 3, durable: 2, colorful: 2 },
        icon: '👕',
      },
      {
        id: 'event-promo',
        label: 'Event/Promotional',
        value: 'event',
        points: { 'eye-catching': 3, affordable: 2, temporary: 2 },
        icon: '🎉',
      },
    ],
    required: true,
  },
  {
    id: 'environment',
    question: 'Where will the stickers be used?',
    type: 'single-choice',
    options: [
      {
        id: 'indoor',
        label: 'Indoors Only',
        value: 'indoor',
        points: { waterproof: 0, durable: 1, affordable: 2 },
        icon: '🏠',
      },
      {
        id: 'outdoor',
        label: 'Outdoor/Weather Exposed',
        value: 'outdoor',
        points: { waterproof: 3, durable: 3, 'fade-resistant': 3 },
        icon: '☀️',
      },
      {
        id: 'vehicle',
        label: 'Vehicle/Car',
        value: 'vehicle',
        points: { waterproof: 3, durable: 3, 'adhesive-strong': 3 },
        icon: '🚗',
      },
      {
        id: 'mixed',
        label: 'Mix of Indoor & Outdoor',
        value: 'mixed',
        points: { waterproof: 2, durable: 2, versatile: 2 },
        icon: '🌍',
      },
    ],
    required: true,
  },
  {
    id: 'duration',
    question: 'How long do you need the stickers to last?',
    type: 'single-choice',
    options: [
      {
        id: 'temporary',
        label: 'Temporary (1-3 months)',
        value: 'temporary',
        points: { affordable: 3, removable: 2, temporary: 3 },
        icon: '📅',
      },
      {
        id: 'seasonal',
        label: 'Seasonal (3-6 months)',
        value: 'seasonal',
        points: { durable: 2, affordable: 2, removable: 1 },
        icon: '🗓️',
      },
      {
        id: 'long-term',
        label: 'Long-Term (6+ months)',
        value: 'permanent',
        points: { durable: 3, 'fade-resistant': 3, permanent: 3 },
        icon: '♻️',
      },
      {
        id: 'permanent',
        label: 'Permanent (Years)',
        value: 'permanent-years',
        points: { durable: 3, premium: 2, permanent: 3 },
        icon: '⏳',
      },
    ],
    required: true,
  },
];

export function calculateQuizResults(answers: QuizAnswer[]): QuizResult {
  const primaryUseCase = (answers.find((a) => a.questionId === 'use-case')?.answer as string) || 'general use';

  return {
    recommendedProducts: [
      {
        productId: 'vinyl-glossy',
        productName: 'Glossy Vinyl Stickers',
        match: 90,
        whyRecommended: 'Perfect match for your needs',
      },
    ],
    primaryUseCase,
    materialSuggestion: getMaterialSuggestion(answers),
    designTips: getDesignTips(answers),
    nextSteps: [
      'Upload your artwork',
      'Choose your material and quantity',
      'Get an instant quote',
      'Approve proof and ship!',
    ],
    customizationOptions: getCustomizationOptions(answers),
  };
}

function getMaterialSuggestion(answers: QuizAnswer[]): string {
  const envAnswer = answers.find((a) => a.questionId === 'environment')?.answer;

  if (envAnswer === 'outdoor' || envAnswer === 'vehicle') {
    return 'Vinyl stickers are best for durability and weather resistance';
  }

  return 'Choose the material that best fits your needs';
}

function getDesignTips(answers: QuizAnswer[]): string[] {
  return [
    'Use bold, clear designs for visibility',
    'Test color saturation for your material',
  ];
}

function getCustomizationOptions(answers: QuizAnswer[]): CustomizationOption[] {
  return [
    {
      category: 'Size',
      options: ['1"', '2"', '3"', '4"', 'Custom'],
      description: 'Select from standard or custom sizes',
    },
    {
      category: 'Shape',
      options: ['Round', 'Square', 'Rectangle', 'Custom Cut'],
      description: 'Choose your preferred shape',
    },
    {
      category: 'Finish',
      options: ['Gloss', 'Matte', 'Holographic'],
      description: 'Select your finish preference',
    },
  ];
}

export function getQuizProgress(answeredCount: number): number {
  return Math.round((answeredCount / STICKER_QUIZ_QUESTIONS.length) * 100);
}

export function validateQuizCompletion(answers: QuizAnswer[]): {
  complete: boolean;
  missingQuestions: string[];
} {
  const requiredQuestions = STICKER_QUIZ_QUESTIONS.filter((q) => q.required);
  const answeredIds = answers.map((a) => a.questionId);

  const missingQuestions = requiredQuestions
    .filter((q) => !answeredIds.includes(q.id))
    .map((q) => q.id);

  return {
    complete: missingQuestions.length === 0,
    missingQuestions,
  };
}
