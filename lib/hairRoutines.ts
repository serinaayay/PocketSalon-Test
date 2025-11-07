// Hair Care Routine Recommendation System
// Combines Scalp Condition + Hair Type + Damage Level

export type ScalpCondition = 'Dry Scalp' | 'Oily Scalp' | 'Dandruff' | 'Normal Scalp';
export type HairType = 'Straight' | 'Wavy' | 'Curly' | 'Kinky';
export type DamageLevel = 'Healthy' | 'Light Damage' | 'Moderate Damage' | 'Severe Damage';

export type HairRoutine = {
  scalpRoutine: {
    washFrequency: string;
    shampooType: string;
    howTo: string;
    treatment: string;
  };
  hairTypeRoutine: {
    conditionerTips: string;
    styling: string;
    dryingTips: string;
    extraTip?: string;
  };
  damageRoutine: {
    goal: string;
    conditioner: string;
    treatment: string;
    lifestyle: string;
  };
};

// Section 1: Scalp Condition Routines
const scalpRoutines = {
  'Dry Scalp': {
    washFrequency: '1-3 times per week (low frequency)',
    shampooType: 'Sulfate-free, hydrating, or soothing shampoo with aloe vera, hyaluronic acid, or tea tree oil',
    howTo: 'Use lukewarm water (not hot). Massage the scalp gently with fingertips, not nails',
    treatment: 'Apply pre-shampoo scalp oil (jojoba or argan) once a week. Massage for 5-10 minutes before shampooing',
  },
  'Oily Scalp': {
    washFrequency: '4-7 times per week (daily is fine)',
    shampooType: 'Gentle, sulfate-free shampoo for daily use. Focus scrubbing only on the scalp',
    howTo: 'Apply conditioner only from mid-lengths to ends. Keep it far from the scalp',
    treatment: 'Use clarifying shampoo 1-2 times per month. Try a clay scalp mask to absorb excess oil',
  },
  'Dandruff': {
    washFrequency: '3-5 times per week to start, then adjust',
    shampooType: 'Anti-dandruff shampoo with Ketoconazole, Selenium Sulfide, or Zinc Pyrithione',
    howTo: 'Critical: Apply shampoo directly to scalp and let it sit for 5 full minutes before rinsing',
    treatment: 'Alternate medicated shampoo with a gentle, hydrating shampoo if the medicated one is too drying',
  },
  'Normal Scalp': {
    washFrequency: '2-4 times per week (as needed)',
    shampooType: 'Any well-formulated, sulfate-free shampoo (not for specific extremes)',
    howTo: 'Wash as needed to cleanse away normal sweat, product, and oil without stripping the scalp',
    treatment: 'Standard cleansing routine. No special treatment needed',
  },
};

// Section 2: Hair Type Management
const hairTypeRoutines = {
  'Straight': {
    conditionerTips: 'Use lightweight conditioners. Apply only from ears down',
    styling: 'Apply volumizing mousse or root-lift spray to damp hair before blow-drying',
    dryingTips: 'Use texturizing spray or dry shampoo on non-wash days for grip and lift',
    extraTip: 'Avoid heavy oils, butters, or creams—they make hair look greasy instantly',
  },
  'Wavy': {
    conditionerTips: 'Detangle in shower with fingers or wide-tooth comb while conditioner is in',
    styling: 'On soaking wet hair, apply curl cream then scrunch in lightweight gel or mousse',
    dryingTips: 'Plop hair in t-shirt or microfiber towel for 15 min, then air-dry or diffuse. Never brush when dry',
  },
  'Curly': {
    conditionerTips: 'Be generous with conditioner—this is your main detangling tool',
    styling: 'On soaking wet hair, apply leave-in conditioner followed by curl-defining cream or strong-hold gel (praying hands or raking method)',
    dryingTips: 'Plop, diffuse, or air-dry. Scrunch out the crunch with oil only when 100% dry',
  },
  'Kinky': {
    conditionerTips: 'Use thick, buttery deep conditioner every wash day. Let it sit 15-30 minutes with shower cap',
    styling: 'Use LOC Method: (L) water-based leave-in, (O) sealing oil like castor or jojoba, (C) thick curl cream or shea butter',
    dryingTips: 'Focus on low-manipulation and protective styles (twists, braids) to prevent breakage',
  },
};

// Section 3: Damage Treatment
const damageRoutines = {
  'Healthy': {
    goal: 'Prevent future damage',
    conditioner: 'Standard hydrating conditioner',
    treatment: 'Basic deep conditioner or hair mask once or twice a month for maintenance',
    lifestyle: 'Always use heat protectant before styling. Get regular trims every 8-12 weeks',
  },
  'Light Damage': {
    goal: 'Strengthen hair shaft and reduce physical damage',
    conditioner: 'Strengthening or repairing conditioner with keratin or amino acids',
    treatment: 'Use bond-building treatment (Olaplex, K18) or protein mask once a week',
    lifestyle: 'Sleep on silk/satin pillowcase. Never brush wet hair—use wide-tooth comb. Minimize heat styling',
  },
  'Moderate Damage': {
    goal: 'Repair chemical damage and restore strength',
    conditioner: 'Deep repairing conditioner. Must be sulfate-free if color-treated',
    treatment: 'Bond-building treatment 1-2x per week. Alternate with deep-conditioning moisture mask',
    lifestyle: 'Reduce heat styling. Use heat protectant and lower temperature settings. Consider protective styles',
  },
  'Severe Damage': {
    goal: 'Emergency repair and prevent further breakage',
    conditioner: 'Intensive repair conditioner. Must be sulfate-free and color-safe',
    treatment: 'Bond-building treatment 2x per week minimum. Use protein treatments alternating with moisture masks',
    lifestyle: 'Stop all heat styling and chemical treatments. Sleep on silk pillowcase. Handle hair like lace. Consider a trim to remove most damaged ends',
  },
};

export function getHairRoutine(
  scalpCondition: ScalpCondition,
  hairType: HairType,
  damageLevel: DamageLevel
): HairRoutine {
  const scalp = scalpRoutines[scalpCondition];
  const hair = hairTypeRoutines[hairType];
  const damage = damageRoutines[damageLevel];

  return {
    scalpRoutine: {
      washFrequency: scalp.washFrequency,
      shampooType: scalp.shampooType,
      howTo: scalp.howTo,
      treatment: scalp.treatment,
    },
    hairTypeRoutine: {
      conditionerTips: hair.conditionerTips,
      styling: hair.styling,
      dryingTips: hair.dryingTips,
      extraTip: hair.extraTip,
    },
    damageRoutine: {
      goal: damage.goal,
      conditioner: damage.conditioner,
      treatment: damage.treatment,
      lifestyle: damage.lifestyle,
    },
  };
}

// Helper to map damage detection results to routine categories
export function mapDamageLevelToRoutine(detectedLevel: string): DamageLevel {
  const normalized = detectedLevel.toLowerCase();
  if (normalized.includes('healthy')) return 'Healthy';
  if (normalized.includes('light')) return 'Light Damage';
  if (normalized.includes('moderate')) return 'Moderate Damage';
  if (normalized.includes('severe')) return 'Severe Damage';
  return 'Healthy'; // default
}

// Helper to normalize hair type from detection
export function mapHairTypeToRoutine(detectedType: string): HairType {
  const normalized = detectedType.toLowerCase();
  if (normalized.includes('straight')) return 'Straight';
  if (normalized.includes('wavy')) return 'Wavy';
  if (normalized.includes('curly')) return 'Curly';
  if (normalized.includes('kinky') || normalized.includes('coily')) return 'Kinky';
  return 'Straight'; // default
}

