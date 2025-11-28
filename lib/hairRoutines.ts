// Hair Care Routine Recommendation System
// Combines Scalp Condition + Hair Type + Damage Level

export type ScalpCondition = 'Dry Scalp' | 'Oily Scalp' | 'Dandruff' | 'Normal Scalp';
export type HairType = 'Straight' | 'Wavy' | 'Curly' | 'Kinky';
export type DamageLevel = 'Healthy' | 'Light Damage' | 'Moderate Damage' | 'Severe Damage';
export type DamageType = 'Healthy' | 'Breakage' | 'Hair Loss' | 'Color Damage';

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
export const scalpRoutines = {
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
export const hairTypeRoutines = {
  'Straight': {
    conditionerTips: 'Use lightweight conditioners. Apply only from ears down. When using conditioner, focus the conditioner on applying from mid-length to ends and not on the roots to avoid oiliness. Recommended: TRESemmé Keratin Smooth, Pantene 3 Minute Miracle Intensive Conditioner Keratin, or Creamsilk Triple Keratin Ultimate Straight',
    styling: 'Apply volumizing mousse or root-lift spray to damp hair before blow-drying. Use smoothing shampoos like Palmolive Silky Straight with Keratin or LUXE Organix Premium Keratin Castor Oil Shampoo',
    dryingTips: 'Use texturizing spray or dry shampoo on non-wash days for grip and lift. Try Watsons Smooth and Sleek Shampoo Ylang Ylang & Coconut for daily maintenance. It\'s much better if the hair is towel dried to remove any dripping water from hair, so that the products would not be wasted. Then gently massage after.',
    extraTip: 'Avoid heavy oils, butters, or creams—they make hair look greasy instantly. For dry scalp, try Human Heart Nature Moisturizing Shampoo',
  },
  'Wavy': {
    conditionerTips: 'Detangle in shower with fingers or wide-tooth comb while conditioner is in. When using conditioner, focus the conditioner on applying from mid-length to ends and not on the roots to avoid oiliness. Use moisturizing products like Bremod Cocoa Butter Conditioner or Human Heart Nature Moisturizing Shampoo',
    styling: 'On soaking wet hair, apply curl cream then scrunch in lightweight gel or mousse. Try LUXE Organix Curl Define Intensive Hydration Shampoo or Zenutrients Curl Avocado & Tea Tree Sulfate-Free Shampoo',
    dryingTips: 'Plop hair in t-shirt or microfiber towel for 15 min, then air-dry or diffuse. Never brush when dry. For hydration, use Goldwell Dual Senses Curls & Waves Hydrating Shampoo. It\'s much better if the hair is towel dried to remove any dripping water from hair, so that the products would not be wasted. Then gently massage after.',
    extraTip: 'Use a microfiber towel or t-shirt to reduce frizz when drying. Kracie Ichikami Japanese Shampoo works great for wavy hair maintenance',
  },
  'Curly': {
    conditionerTips: 'Be generous with conditioner—this is your main detangling tool. When using conditioner, focus the conditioner on applying from mid-length to ends and not on the roots to avoid oiliness. Use curl-specific products like LUXE Organix Curl Define Intensive Hydration Shampoo or Zenutrients Curl Avocado & Tea Tree Sulfate-Free Shampoo',
    styling: 'On soaking wet hair, apply leave-in conditioner followed by curl-defining cream or strong-hold gel (praying hands or raking method). Goldwell Dual Senses Curls & Waves Hydrating Shampoo helps maintain elasticity',
    dryingTips: 'Plop, diffuse, or air-dry. Scrunch out the crunch with oil only when 100% dry. Use sulfate-free products to preserve curl definition. It\'s much better if the hair is towel dried to remove any dripping water from hair, so that the products would not be wasted. Then gently massage after.',
    extraTip: 'The Curly Girl Method (CGM) can help maintain natural curl patterns. Zenutrients Curl Avocado & Tea Tree is CGM-approved and perfect for curly hair',
  },
  'Kinky': {
    conditionerTips: 'Use thick, buttery deep conditioner every wash day. When using conditioner, focus the conditioner on applying from mid-length to ends and not on the roots to avoid oiliness. Let it sit 15-30 minutes with shower cap. Try It\'s a 10 Coily Miracle Hydrating Shampoo for intensive moisture',
    styling: 'Use LOC Method: (L) water-based leave-in, (O) sealing oil like castor or jojoba, (C) thick curl cream or shea butter. Recommended: Not Your Mother\'s Kinky Moves Curl Defining Hair Cream or The Body Shop Jamaican Black Castor Oil Curl Activator',
    dryingTips: 'Focus on low-manipulation and protective styles (twists, braids) to prevent breakage. Use products specifically designed for coily hair texture. It\'s much better if the hair is towel dried to remove any dripping water from hair, so that the products would not be wasted. Then gently massage after.',
    extraTip: 'Protective styles help retain length and minimize breakage. The Body Shop Jamaican Black Castor Oil Curl Activator provides weightless definition without buildup',
  },
};

// Section 3: Damage Treatment (Organized by Damage Type and Severity)
export const damageRoutines = {
  'Healthy': {
    goal: 'Prevent future damage',
    conditioner: 'Standard hydrating conditioner',
    treatment: 'Basic deep conditioner or hair mask once or twice a month for maintenance',
    lifestyle: 'Always use heat protectant before styling. Get regular trims every 8-12 weeks',
  },
  'Breakage': {
    'Light Damage': {
      goal: 'Strengthen hair shaft and prevent split ends',
      conditioner: 'Strengthening conditioner with keratin or amino acids (e.g., Creamsilk Triple Keratin, Pantene 3 Minute Miracle)',
      treatment: 'Use protein treatment or bond-building mask once a week. Try products with keratin like Luxe Organix Premium Keratin Castor Oil',
      lifestyle: 'Sleep on silk/satin pillowcase to reduce friction. Never brush wet hair—use wide-tooth comb. Minimize heat styling and always use heat protectant',
    },
    'Moderate Damage': {
      goal: 'Repair damaged cuticles and restore hair strength',
      conditioner: 'Deep repairing conditioner with keratin (e.g., TRESemmé Keratin Smooth, Bremod Cocoa Butter Conditioner)',
      treatment: 'Apply protein mask 1-2x per week. Use strengthening shampoos like Zenutrients Gugo Strengthening Shampoo. Alternate protein with moisture treatments',
      lifestyle: 'Reduce heat styling significantly. Trim split ends every 6-8 weeks. Avoid tight hairstyles that pull on roots. Use silk/satin pillowcases',
    },
    'Severe Damage': {
      goal: 'Emergency repair to prevent further breakage and hair loss',
      conditioner: 'Intensive repair conditioner with keratin and proteins (e.g., Creamsilk Triple Keratin Ultimate Straight)',
      treatment: 'Use bond-building treatment 2x per week minimum (products with keratin and amino acids). Deep condition for 30 minutes with heat cap weekly',
      lifestyle: 'Stop all heat styling immediately. Sleep on silk pillowcase. Handle hair extremely gently—detangle only with wide-tooth comb and lots of conditioner. Get a trim to remove most damaged ends',
    },
  },
  'Hair Loss': {
    'Light Damage': {
      goal: 'Strengthen hair roots and reduce shedding',
      conditioner: 'Volumizing conditioner that doesn\'t weigh hair down (e.g., Pantene 3 Minute Miracle)',
      treatment: 'Use scalp treatments with strengthening ingredients. Try Kathare Anti Hair Fall Shampoo or Zenutrients Gugo Strengthening Shampoo once a week',
      lifestyle: 'Massage scalp for 5-10 minutes daily to stimulate blood flow. Avoid tight hairstyles. Reduce stress and ensure adequate protein in diet',
    },
    'Moderate Damage': {
      goal: 'Stimulate hair growth and prevent further loss',
      conditioner: 'Strengthening conditioner applied only on lengths, not scalp (e.g., Creamsilk Triple Keratin)',
      treatment: 'Use anti-hair fall shampoos regularly (e.g., Kathare Anti Hair Fall, Yves Rocher Anti Hair Loss). Apply scalp serums with biotin or caffeine. Consider rosemary oil scalp massage',
      lifestyle: 'Massage scalp daily with growth-promoting oils (castor, rosemary). Minimize chemical treatments. Eat protein-rich foods. Manage stress levels. Consult dermatologist if severe',
    },
    'Severe Damage': {
      goal: 'Stop hair loss and promote regrowth',
      conditioner: 'Lightweight strengthening conditioner on lengths only (e.g., Bremod Cocoa Butter)',
      treatment: 'Use intensive anti-hair fall treatments (e.g., Yves Rocher Anti Hair Loss Fortifying Shampoo, Kathare Anti Hair Fall). Apply scalp treatments 2-3x weekly. Consider dermatologist consultation',
      lifestyle: 'Stop all harsh chemical treatments (bleach, relaxers). Massage scalp with growth oils daily. Take biotin supplements. Manage stress aggressively. Avoid tight hairstyles completely. See a trichologist or dermatologist',
    },
  },
  'Color Damage': {
    'Light Damage': {
      goal: 'Preserve color vibrancy and prevent fading',
      conditioner: 'Color-safe conditioner with UV protection (e.g., TRESemmé Keratin Smooth)',
      treatment: 'Use color-protecting masks once a week. Try Kracie Ichikami Japanese Shampoo or Luxe Organix Bye Brass Purple Shampoo for toning',
      lifestyle: 'Wash hair with cool/lukewarm water to seal cuticles. Use sulfate-free shampoos. Minimize sun exposure or wear a hat. Wait 72 hours after coloring before washing',
    },
    'Moderate Damage': {
      goal: 'Repair damage from color treatment while maintaining vibrancy',
      conditioner: 'Intensive color-safe repairing conditioner (e.g., Creamsilk Triple Keratin Ultimate Straight, Pantene 3 Minute Miracle)',
      treatment: 'Alternate between color-protecting masks and protein treatments. Use Ichikami Damage and Color Care Shampoo or Joico Colorful Anti-Fade Shampoo. Deep condition 1-2x weekly',
      lifestyle: 'Reduce washing frequency to 2-3x per week. Use purple/blue shampoo for toning if blonde/highlighted. Always use heat protectant. Avoid chlorinated pools or wear a swim cap',
    },
    'Severe Damage': {
      goal: 'Emergency repair for over-processed colored hair',
      conditioner: 'Intensive repair conditioner for color-treated hair (e.g., Joico Colorful line, TRESemmé Keratin Smooth)',
      treatment: 'Use bond-building treatments 2x per week (products with keratin). Apply color-safe deep conditioning masks with heat. Try Ichikami Damage and Color Care or Luxe Organix Bye Brass',
      lifestyle: 'Stop all heat styling. No more coloring for at least 3 months—let hair recover. Use only sulfate-free, color-safe products. Deep condition every wash. Consider olaplex-type treatments. Get regular trims',
    },
  },
};

export function getHairRoutine(
  scalpCondition: ScalpCondition,
  hairType: HairType,
  damageLevel: DamageLevel,
  damageType?: DamageType
): HairRoutine {
  const scalp = scalpRoutines[scalpCondition];
  const hair = hairTypeRoutines[hairType];
  
  // Determine which damage routine to use
  let damage: any;
  if (damageLevel === 'Healthy') {
    // Always use healthy routine for healthy hair
    damage = damageRoutines['Healthy'];
  } else if (damageType && damageType !== 'Healthy') {
    // Use specific damage type routine if available
    damage = damageRoutines[damageType]?.[damageLevel];
    // If specific routine doesn't exist, fall back to healthy
    if (!damage) {
      console.warn(`No routine found for damageType: ${damageType}, damageLevel: ${damageLevel}, using Healthy routine`);
      damage = damageRoutines['Healthy'];
    }
  } else {
    // No damage type specified, use healthy routine as fallback
    console.warn(`No damage type specified for damageLevel: ${damageLevel}, using Healthy routine`);
    damage = damageRoutines['Healthy'];
  }

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
      extraTip: hair.extraTip || undefined,
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
  
  // Handle "High chance of..." or "high" -> Severe Damage
  if (normalized.includes('high chance') || normalized.includes('high')) return 'Severe Damage';
  
  // Handle "Moderate chance of..." or "moderate" -> Moderate Damage
  if (normalized.includes('moderate chance') || normalized.includes('moderate')) return 'Moderate Damage';
  
  // Handle "Likely..." or "Possible chance of..." -> Light Damage
  if (normalized.includes('likely') || normalized.includes('possible chance') || normalized.includes('possible')) return 'Light Damage';
  
  // Handle "light" -> Light Damage
  if (normalized.includes('light')) return 'Light Damage';
  
  // Handle "severe" -> Severe Damage
  if (normalized.includes('severe')) return 'Severe Damage';
  
  // If it contains any damage indicator but doesn't match above, default to Moderate Damage
  if (normalized.includes('breakage') || normalized.includes('hair loss') || normalized.includes('color') || normalized.includes('damage')) {
    return 'Moderate Damage';
  }
  
  return 'Healthy'; // default only if truly no damage indicators
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

// Helper to map damage type from detection
export function mapDamageTypeToRoutine(detectedType: string): DamageType {
  const normalized = detectedType.toLowerCase();
  if (normalized.includes('healthy')) return 'Healthy';
  if (normalized.includes('breakage')) return 'Breakage';
  if (normalized.includes('hair loss') || normalized.includes('hairloss')) return 'Hair Loss';
  if (normalized.includes('color') || normalized.includes('colordamage')) return 'Color Damage';
  return 'Healthy'; // default
}

