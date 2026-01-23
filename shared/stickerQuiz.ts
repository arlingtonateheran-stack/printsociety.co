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
  points: Record<string, number>; // Category -> points
  icon?: string;
}

export interface QuizAnswer {
  questionId: string;
  answer: string | string[] | number;
  confidence: number; // 0-100
}

export interface QuizResult {
  recommendedProducts: ProductRecommendation[];
  primaryUseCase: string;
  materialSuggestion: string;
  designTips: string[];
  nextSteps: string[];
  customization Options: CustomizationOption[];
}

export interface ProductRecommendation {
  productId: string;
  productName: string;
  match: number; // 0-100
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
        points: { durable: 3, cost-effective: 3, volume: 3 },
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
        points: { eye-catching: 3, affordable: 2, temporary: 2 },
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
        points: { waterproof: 3, durable: 3, fade-resistant: 3 },
        icon: '☀️',
      },
      {
        id: 'vehicle',
        label: 'Vehicle/Car',
        value: 'vehicle',
        points: { waterproof: 3, durable: 3, adhesive-strong: 3 },
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
        points: { durable: 3, fade-resistant: 3, permanent: 3 },
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
  {
    id: 'material-pref',
    question: 'What material appeals to you?',
    type: 'single-choice',
    options: [
      {
        id: 'vinyl-glossy',
        label: 'Glossy Vinyl (Classic)',
        value: 'vinyl-gloss',
        points: { durable: 3, glossy: 3 },
        icon: '✨',
      },
      {
        id: 'vinyl-matte',
        label: 'Matte Vinyl (Subtle)',
        value: 'vinyl-matte',
        points: { durable: 3, matte: 3, professional: 2 },
        icon: '⚪',
      },
      {
        id: 'paper',
        label: 'Paper (Budget-Friendly)',
        value: 'paper',
        points: { affordable: 3, eco-friendly: 2 },
        icon: '📄',
      },
      {
        id: 'holographic',
        label: 'Holographic (Eye-Catching)',
        value: 'holographic',
        points: { premium: 3, eye-catching: 3, fun: 2 },
        icon: '🌈',
      },
      {
        id: 'not-sure',
        label: 'Not Sure',
        value: 'flexible',
        points: { flexible: 3 },
        icon: '❓',
      },
    ],
    required: true,
  },
  {
    id: 'budget',
    question: 'What\'s your budget range?',
    type: 'single-choice',
    options: [
      {
        id: 'budget',
        label: 'Budget (under $100)',
        value: 'budget',
        points: { affordable: 3, cost-effective: 3 },
        icon: '💰',
      },
      {
        id: 'mid-range',
        label: 'Mid-Range ($100-$500)',
        value: 'mid',
        points: { quality: 2, value: 2 },
        icon: '💵',
      },
      {
        id: 'premium',
        label: 'Premium ($500+)',
        value: 'premium',
        points: { premium: 3, quality: 3 },
        icon: '💎',
      },
      {
        id: 'flexible',
        label: 'Flexible',
        value: 'flexible',
        points: { flexible: 2 },
        icon: '🎯',
      },
    ],
    required: true,
  },
  {
    id: 'quantity',
    question: 'How many stickers do you need?',
    type: 'slider',
    minValue: 10,
    maxValue: 10000,
    step: 100,
    required: true,
  },
];

// Scoring categories
export const SCORING_CATEGORIES = [
  'waterproof',
  'durable',
  'fun',
  'professional',
  'cost-effective',
  'volume',
  'flexible',
  'colorful',
  'eye-catching',
  'affordable',
  'temporary',
  'removable',
  'fade-resistant',
  'permanent',
  'glossy',
  'matte',
  'premium',
  'eco-friendly',
  'quality',
  'value',
  'adhesive-strong',
  'versatile',
];

// Product library
export const STICKER_PRODUCTS = [
  {
    id: 'vinyl-round-2in',
    name: 'Vinyl Round Stickers 2"',
    category: 'vinyl',
    scores: {
      durable: 9,
      waterproof: 10,
      fade_resistant: 8,
      affordable: 7,
      glossy: 9,
    },
    bestFor: ['outdoor', 'vehicle', 'permanent', 'vinyl-gloss'],
    minOrder: 50,
    pricePerUnit: 0.15,
  },
  {
    id: 'vinyl-square-3in',
    name: 'Vinyl Square Stickers 3"',
    category: 'vinyl',
    scores: {
      durable: 9,
      waterproof: 10,
      fade_resistant: 8,
      affordable: 6,
      professional: 8,
    },
    bestFor: ['business', 'outdoor', 'professional'],
    minOrder: 50,
    pricePerUnit: 0.25,
  },
  {
    id: 'paper-glossy',
    name: 'Glossy Paper Stickers',
    category: 'paper',
    scores: {
      affordable: 10,
      colorful: 10,
      eco_friendly: 8,
      fun: 9,
      glossy: 10,
    },
    bestFor: ['personal', 'event', 'budget', 'paper'],
    minOrder: 100,
    pricePerUnit: 0.08,
  },
  {
    id: 'paper-matte',
    name: 'Matte Paper Stickers',
    category: 'paper',
    scores: {
      affordable: 9,
      professional: 9,
      eco_friendly: 8,
      matte: 10,
      sustainable: 8,
    },
    bestFor: ['business', 'professional', 'matte'],
    minOrder: 100,
    pricePerUnit: 0.12,
  },
  {
    id: 'holographic',
    name: 'Holographic Stickers',
    category: 'holographic',
    scores: {
      eye_catching: 10,
      premium: 10,
      fun: 10,
      durable: 8,
      waterproof: 9,
    },
    bestFor: ['premium', 'eye-catching', 'personal', 'fun'],
    minOrder: 100,
    pricePerUnit: 0.50,
  },
];

// Quiz functions
export function calculateQuizResults(answers: QuizAnswer[]): QuizResult {
  // Score all products based on answers
  const productScores: Record<string, number> = {};

  for (const product of STICKER_PRODUCTS) {
    let score = 0;
    let matchCount = 0;

    for (const answer of answers) {
      const question = STICKER_QUIZ_QUESTIONS.find((q) => q.id === answer.questionId);
      if (!question || question.type === 'slider') continue;

      const option = question.options?.find(
        (o) => o.id === answer.answer || o.value === answer.answer
      );
      if (!option) continue;

      // Check if product is in bestFor list
      if (product.bestFor.includes(option.value)) {
        score += 25;
        matchCount++;
      }

      // Check scoring matches
      for (const [category, points] of Object.entries(option.points)) {
        if (product.scores[category]) {
          score += product.scores[category] * (points / 3);
          matchCount++;
        }
      }
    }

    const matchPercentage =
      matchCount > 0 ? Math.min(100, Math.round((score / (matchCount * 25)) * 100)) : 0;
    productScores[product.id] = matchPercentage;
  }

  // Sort by score
  const recommendations: ProductRecommendation[] = STICKER_PRODUCTS.map((product) => ({
    productId: product.id,
    productName: product.name,
    match: productScores[product.id] || 0,
    whyRecommended: generateRecommendationReason(productScores[product.id] || 0, product.id),
  }))
    .sort((a, b) => b.match - a.match)
    .slice(0, 3);

  // Find primary use case
  const useCaseAnswer = answers.find((a) => a.questionId === 'use-case');
  const primaryUseCase =
    (useCaseAnswer?.answer as string) || 'general use';

  return {
    recommendedProducts: recommendations,
    primaryUseCase,
    materialSuggestion: getMaterialSuggestion(answers),
    designTips: getDesignTips(answers),
    nextSteps: getNextSteps(answers),
    customization Options: getCustomizationOptions(answers),
  };
}

function generateRecommendationReason(score: number, productId: string): string {
  if (score >= 85) {
    return 'Perfect match for your needs';
  } else if (score >= 70) {
    return 'Great choice for your requirements';
  } else if (score >= 50) {
    return 'Good option for your use case';
  } else {
    return 'Possible alternative';
  }
}

function getMaterialSuggestion(answers: QuizAnswer[]): string {
  const envAnswer = answers.find((a) => a.questionId === 'environment');
  const durationAnswer = answers.find((a) => a.questionId === 'duration');

  if (
    envAnswer?.answer === 'outdoor' ||
    envAnswer?.answer === 'vehicle'
  ) {
    return 'Vinyl Stickers are best for durability and weather resistance';
  }

  if (durationAnswer?.answer === 'permanent' || durationAnswer?.answer === 'permanent-years') {
    return 'Choose premium vinyl for maximum longevity';
  }

  if (answers.find((a) => a.questionId === 'budget')?.answer === 'budget') {
    return 'Paper stickers are affordable and eco-friendly';
  }

  return 'Vinyl stickers offer the best balance of quality and durability';
}

function getDesignTips(answers: QuizAnswer[]): string[] {
  const tips: string[] = [];

  const useCaseAnswer = answers.find((a) => a.questionId === 'use-case')?.answer;

  if (useCaseAnswer === 'business') {
    tips.push('Keep your logo and branding consistent');
    tips.push('Use your brand colors for better recognition');
  }

  if (useCaseAnswer === 'event') {
    tips.push('Make stickers colorful and eye-catching');
    tips.push('Include event date or contact information');
  }

  const envAnswer = answers.find((a) => a.questionId === 'environment')?.answer;
  if (envAnswer === 'outdoor' || envAnswer === 'vehicle') {
    tips.push('Ensure high contrast for visibility');
    tips.push('Test colors in different lighting');
  }

  return tips.length > 0
    ? tips
    : [
        'Use bold, clear designs for visibility',
        'Test color saturation for your material',
      ];
}

function getNextSteps(answers: QuizAnswer[]): string[] {
  return [
    'Upload your artwork',
    'Choose your material and quantity',
    'Get an instant quote',
    'Approve proof and ship!',
  ];
}

function getCustomizationOptions(answers: QuizAnswer[]): CustomizationOption[] {
  const options: CustomizationOption[] = [
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

  const budgetAnswer = answers.find((a) => a.questionId === 'budget')?.answer;
  if (budgetAnswer !== 'budget') {
    options.push({
      category: 'Special Effects',
      options: ['Metallic', 'Transparent', 'Textured'],
      description: 'Add premium special effects',
    });
  }

  return options;
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