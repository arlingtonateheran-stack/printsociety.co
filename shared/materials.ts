// Material comparison tool for selecting optimal print materials
// Helps customers choose between different materials based on their needs

export type MaterialType = 'vinyl' | 'paper' | 'fabric' | 'plastic' | 'foil' | 'transparent';

export type MaterialFinish = 'matte' | 'gloss' | 'semi-gloss' | 'satin' | 'metallic';

export interface Material {
  id: string;
  name: string;
  type: MaterialType;
  finish: MaterialFinish;
  description: string;
  priceMultiplier: number; // 1.0 = base price
  
  // Properties
  durability: number; // 0-10 (0 = least durable, 10 = most durable)
  waterResistance: number; // 0-10
  fadeResistance: number; // 0-10 (UV resistance)
  flexibility: number; // 0-10 (can it bend/stretch)
  printQuality: number; // 0-10
  tactileFeel: 'smooth' | 'textured' | 'rough';
  
  // Use cases
  useCase: string[];
  idealFor: string[];
  notRecommendedFor: string[];
  
  // Environmental
  isEcoFriendly: boolean;
  isRecyclable: boolean;
  
  // Specifications
  thickness?: string;
  dimensions: string[];
  minOrder: number;
  
  // Adhesion
  adhesionType: 'permanent' | 'removable' | 'repositionable';
  applicationSurface: string[];
  
  // Features
  features: string[];
  
  // Storage
  shelfLife?: string;
  storageConditions?: string;
}

export interface ComparisonResult {
  material1: Material;
  material2: Material;
  similarities: string[];
  differences: string[];
  score1: number; // 0-100
  score2: number; // 0-100
  winner: 'material1' | 'material2' | 'tie';
  recommendation: string;
}

export interface MaterialRecommendation {
  material: Material;
  matchScore: number; // 0-100
  matchedCriteria: string[];
  unmatchedCriteria: string[];
  reasoning: string;
}

// Material database
export const MATERIALS: Material[] = [
  {
    id: 'vinyl-permanent',
    name: 'Permanent Vinyl',
    type: 'vinyl',
    finish: 'gloss',
    description: 'Classic permanent adhesive vinyl with superior durability',
    priceMultiplier: 1.0,
    durability: 9,
    waterResistance: 10,
    fadeResistance: 8,
    flexibility: 6,
    printQuality: 9,
    tactileFeel: 'smooth',
    useCase: ['outdoor decals', 'vehicle graphics', 'weatherproof labels'],
    idealFor: ['outdoor use', 'vehicles', 'water exposure', 'long-term applications'],
    notRecommendedFor: ['temporary use', 'delicate surfaces', 'frequent removal'],
    isEcoFriendly: false,
    isRecyclable: false,
    thickness: '3.5 mil',
    dimensions: ['up to 36" wide'],
    minOrder: 50,
    adhesionType: 'permanent',
    applicationSurface: ['plastic', 'metal', 'painted surfaces', 'glass'],
    features: ['waterproof', 'UV resistant', 'outdoor rated', 'cast vinyl'],
  },
  {
    id: 'vinyl-removable',
    name: 'Removable Vinyl',
    type: 'vinyl',
    finish: 'matte',
    description: 'Easy-to-remove vinyl perfect for temporary applications',
    priceMultiplier: 1.1,
    durability: 6,
    waterResistance: 7,
    fadeResistance: 6,
    flexibility: 7,
    printQuality: 8,
    tactileFeel: 'smooth',
    useCase: ['temporary signage', 'window displays', 'promotional stickers'],
    idealFor: ['temporary use', 'rental properties', 'seasonal promotions', 'test applications'],
    notRecommendedFor: ['outdoor long-term', 'high moisture', 'permanent signage'],
    isEcoFriendly: true,
    isRecyclable: true,
    thickness: '3.2 mil',
    dimensions: ['up to 36" wide'],
    minOrder: 50,
    adhesionType: 'removable',
    applicationSurface: ['smooth walls', 'glass', 'painted surfaces'],
    features: ['repositionable', 'no residue', 'easy application', 'temporary'],
  },
  {
    id: 'paper-glossy',
    name: 'Glossy Paper',
    type: 'paper',
    finish: 'gloss',
    description: 'Bright, vibrant finish for eye-catching stickers',
    priceMultiplier: 0.7,
    durability: 4,
    waterResistance: 3,
    fadeResistance: 4,
    flexibility: 3,
    printQuality: 10,
    tactileFeel: 'smooth',
    useCase: ['labels', 'short-term stickers', 'promotional items'],
    idealFor: ['indoor use', 'budget options', 'vibrant colors', 'gift stickers'],
    notRecommendedFor: ['outdoor use', 'moisture exposure', 'long-term applications'],
    isEcoFriendly: true,
    isRecyclable: true,
    thickness: '80 gsm',
    dimensions: ['various sizes'],
    minOrder: 100,
    adhesionType: 'permanent',
    applicationSurface: ['smooth surfaces'],
    features: ['bright colors', 'affordable', 'recycled options available'],
  },
  {
    id: 'paper-matte',
    name: 'Matte Paper',
    type: 'paper',
    finish: 'matte',
    description: 'Non-reflective finish for a sophisticated look',
    priceMultiplier: 0.8,
    durability: 4,
    waterResistance: 2,
    fadeResistance: 3,
    flexibility: 2,
    printQuality: 10,
    tactileFeel: 'textured',
    useCase: ['premium labels', 'fine art stickers', 'minimalist designs'],
    idealFor: ['upscale branding', 'indoor displays', 'artistic applications'],
    notRecommendedFor: ['outdoor use', 'heavy handling', 'moisture-prone areas'],
    isEcoFriendly: true,
    isRecyclable: true,
    thickness: '120 gsm',
    dimensions: ['various sizes'],
    minOrder: 100,
    adhesionType: 'permanent',
    applicationSurface: ['smooth surfaces'],
    features: ['premium feel', 'sophisticated look', 'no glare'],
  },
  {
    id: 'fabric-white',
    name: 'Fabric Transfer - White',
    type: 'fabric',
    finish: 'matte',
    description: 'Heat-transfer labels for apparel and textiles',
    priceMultiplier: 1.3,
    durability: 7,
    waterResistance: 6,
    fadeResistance: 7,
    flexibility: 9,
    printQuality: 8,
    tactileFeel: 'smooth',
    useCase: ['clothing labels', 't-shirt designs', 'textile applications'],
    idealFor: ['apparel', 'textiles', 'flexible applications', 'brand labels'],
    notRecommendedFor: ['rigid surfaces', 'non-fabric use'],
    isEcoFriendly: false,
    isRecyclable: false,
    thickness: 'flexible',
    dimensions: ['up to 36" wide'],
    minOrder: 50,
    adhesionType: 'permanent',
    applicationSurface: ['cotton', 'polyester', 'cotton blends'],
    features: ['heat-transferable', 'flexible', 'washable', 'breathable'],
  },
  {
    id: 'holographic',
    name: 'Holographic Vinyl',
    type: 'foil',
    finish: 'metallic',
    description: 'Rainbow holographic vinyl for eye-catching effects',
    priceMultiplier: 1.8,
    durability: 8,
    waterResistance: 9,
    fadeResistance: 7,
    flexibility: 5,
    printQuality: 7,
    tactileFeel: 'smooth',
    useCase: ['premium stickers', 'luxury branding', 'special effects'],
    idealFor: ['high-end products', 'gift items', 'premium branding'],
    notRecommendedFor: ['budget projects', 'large coverage areas'],
    isEcoFriendly: false,
    isRecyclable: false,
    thickness: '3.5 mil',
    dimensions: ['up to 24" wide'],
    minOrder: 100,
    adhesionType: 'permanent',
    applicationSurface: ['smooth surfaces'],
    features: ['holographic effect', 'premium feel', 'eye-catching', 'durable'],
  },
];

// Comparison functions
export function compareMaterials(material1Id: string, material2Id: string): ComparisonResult {
  const m1 = MATERIALS.find((m) => m.id === material1Id);
  const m2 = MATERIALS.find((m) => m.id === material2Id);

  if (!m1 || !m2) {
    throw new Error('Material not found');
  }

  const similarities: string[] = [];
  const differences: string[] = [];

  if (m1.type === m2.type) similarities.push('Same material type');
  else differences.push(`Different types: ${m1.type} vs ${m2.type}`);

  if (m1.finish === m2.finish) similarities.push(`Same finish: ${m1.finish}`);
  else differences.push(`Different finishes: ${m1.finish} vs ${m2.finish}`);

  if (m1.adhesionType === m2.adhesionType) similarities.push(`Same adhesion: ${m1.adhesionType}`);
  else differences.push(`Different adhesion: ${m1.adhesionType} vs ${m2.adhesionType}`);

  if (m1.isEcoFriendly === m2.isEcoFriendly) {
    similarities.push(m1.isEcoFriendly ? 'Both eco-friendly' : 'Both conventional');
  } else {
    differences.push(m1.isEcoFriendly ? 'Only m1 is eco-friendly' : 'Only m2 is eco-friendly');
  }

  // Calculate match scores
  const score1 = Math.round(
    (m1.durability + m1.waterResistance + m1.fadeResistance + m1.printQuality) / 4
  );
  const score2 = Math.round(
    (m2.durability + m2.waterResistance + m2.fadeResistance + m2.printQuality) / 4
  );

  let winner: 'material1' | 'material2' | 'tie' = 'tie';
  if (score1 > score2) winner = 'material1';
  else if (score2 > score1) winner = 'material2';

  const recommendation =
    winner === 'tie'
      ? `Both materials are comparable. Choose based on your budget and aesthetic preference.`
      : `${winner === 'material1' ? m1.name : m2.name} is the better choice for overall performance.`;

  return {
    material1: m1,
    material2: m2,
    similarities,
    differences,
    score1,
    score2,
    winner,
    recommendation,
  };
}

export function recommendMaterial(
  requirements: {
    outdoor?: boolean;
    durable?: boolean;
    waterproof?: boolean;
    budgetLevel?: 'low' | 'medium' | 'high';
    useCase?: string;
    temporary?: boolean;
    ecoFriendly?: boolean;
  }
): MaterialRecommendation[] {
  const recommendations: MaterialRecommendation[] = [];

  for (const material of MATERIALS) {
    let score = 50;
    const matchedCriteria: string[] = [];
    const unmatchedCriteria: string[] = [];

    if (requirements.outdoor && material.fadeResistance >= 7) {
      score += 15;
      matchedCriteria.push('Good UV resistance for outdoor use');
    } else if (requirements.outdoor) {
      unmatchedCriteria.push('Limited UV resistance');
    }

    if (requirements.durable && material.durability >= 8) {
      score += 15;
      matchedCriteria.push('Highly durable');
    } else if (requirements.durable && material.durability < 5) {
      unmatchedCriteria.push('Low durability');
    }

    if (requirements.waterproof && material.waterResistance >= 8) {
      score += 15;
      matchedCriteria.push('Waterproof');
    } else if (requirements.waterproof && material.waterResistance < 5) {
      unmatchedCriteria.push('Not waterproof');
    }

    if (requirements.budgetLevel === 'low' && material.priceMultiplier <= 0.9) {
      score += 15;
      matchedCriteria.push('Budget-friendly');
    } else if (requirements.budgetLevel === 'low') {
      unmatchedCriteria.push('Higher cost');
    }

    if (requirements.temporary && material.adhesionType === 'removable') {
      score += 20;
      matchedCriteria.push('Removable adhesion');
    }

    if (requirements.ecoFriendly && material.isEcoFriendly) {
      score += 10;
      matchedCriteria.push('Eco-friendly');
    }

    if (requirements.useCase && material.useCase.includes(requirements.useCase)) {
      score += 20;
      matchedCriteria.push(`Designed for ${requirements.useCase}`);
    }

    recommendations.push({
      material,
      matchScore: Math.min(100, score),
      matchedCriteria,
      unmatchedCriteria,
      reasoning: `This material meets ${matchedCriteria.length} of your key requirements.`,
    });
  }

  return recommendations.sort((a, b) => b.matchScore - a.matchScore);
}

export function getMaterialDetails(materialId: string): Material | undefined {
  return MATERIALS.find((m) => m.id === materialId);
}

export function filterMaterials(criteria: {
  type?: MaterialType;
  finish?: MaterialFinish;
  maxPrice?: number;
  minDurability?: number;
  ecoFriendly?: boolean;
}): Material[] {
  return MATERIALS.filter((m) => {
    if (criteria.type && m.type !== criteria.type) return false;
    if (criteria.finish && m.finish !== criteria.finish) return false;
    if (criteria.maxPrice && m.priceMultiplier > criteria.maxPrice) return false;
    if (criteria.minDurability && m.durability < criteria.minDurability) return false;
    if (criteria.ecoFriendly && !m.isEcoFriendly) return false;
    return true;
  });
}
