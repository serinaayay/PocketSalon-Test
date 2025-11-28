import { View, Text, Pressable, ScrollView, TextInput, KeyboardAvoidingView, Platform, Dimensions, Image } from "react-native";
import { useState, useRef, useEffect } from "react";
import { router } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import { recommendProducts } from '../lib/productRecommendations';
import { hairTypeRoutines, scalpRoutines, damageRoutines } from '../lib/hairRoutines';
import { askGemini } from '../lib/gemini';


const { width, height } = Dimensions.get('window');

// Healthy Hair Guide products (from healthy-hair-guide)
const healthyHairProducts = [
  {
    name: "Davines OI Shampoo",
    description: "A gentle daily shampoo, ideal for any hair type, that cleanses and nourishes the hair, leaving it soft and manageable.",
    category: ["all", "straight", "wavy", "curly", "coily"],
  },
  {
    name: "L'Oréal Paris EverPure Moisture Shampoo",
    description: "Keep your straight hair soft and hydrated with this sulfate-free formula infused with rosemary. It gently cleanses while preserving color and shine, leaving your hair smooth and frizz-free.",
    category: "straight",
  },
  {
    name: "Kérastase Discipline Bain Fluidealiste Gentle Shampoo",
    description: "A luxurious, gentle shampoo designed to tame frizz and smooth unruly hair. Perfect for straight and curly types, it leaves hair feeling silky, manageable, and full of movement without weighing it down.",
    category: ["straight", "curly"],
  },
  {
    name: "Human Nature Revitalizing Shampoo",
    description: "Made with 96.4% natural ingredients, this refreshing shampoo helps bring life back to dull, straight hair. It cleans deeply while keeping strands healthy and bouncy — all without harsh chemicals.",
    category: "straight",
  },
  {
    name: "Zenutrients Coco Honey Nourishing Shampoo",
    description: "Combining the moisture of coconut oil and the soothing properties of honey, this nourishing shampoo softens and strengthens straight hair. It helps reduce dryness while keeping your scalp healthy and hydrated.",
    category: "straight",
  },
  {
    name: "HairReve Sulfate-Free Shampoo",
    description: "A gentle yet effective sulfate-free formula made for sensitive scalps and straight hair. It cleanses without stripping natural oils, promoting smoother, shinier strands with every wash.",
    category: "straight",
  }
];

// Natural Remedies data (from natural-remedies.tsx)
const remedies = [
  {
    name: "Rosemary Oil",
    description: "Rosemary oil stimulates hair growth and improves circulation to the scalp.",
    category: "hair loss",
    howToUse: "Mix a few drops with a carrier oil (like coconut oil) to dilute and massage into the scalp. Leave at least a few minutes before washing out.",
  },
  {
    name: "Peppermint Oil",
    description: "Peppermint oil has been shown to promote hair growth by increasing blood flow to the scalp.",
    category: "hair loss",
    howToUse: "Dilute a few drops (1-2 drops) in a carrier oil and massage into the scalp. Leave for at least an hour before rinsing, then repeat for at least one month.",
  },
  {
    name: "Scalp Massage",
    description: "Regular scalp massages can improve blood circulation and stimulation of hair follicles, promoting hair growth.",
    category: "hair loss",
    howToUse: "Use can use your fingertips or scalp massagers to gently massage your scalp in circular motions for 5-10 minutes daily. You can also apply oils like coconut or jojoba oil during the massage for added benefits.",
  },
  {
    name: "Rice Water",
    description: "Rice water is rich in vitamins and minerals that can strengthen hair and reduce breakage.",
    category: ["breakage", "color damage"],
    howToUse: "To make rice water, rinse 1/2 cup of rice thoroughly, then soak it in 2-3 cups of water for 30 minutes. Strain the rice and use the water as a final rinse after shampooing, then wash your hair right after.",
  },
  {
    name: "Jojoba Oil",
    description: "Jojoba oil has an oily composition, making it an excellent moisturizer for dry, brittle hair.",
    category: ["breakage", "hair loss"],
    howToUse: "Apply a few drops to your fingers and spread evenly from the roots to its tips ends of your hair. Leave it on for at least 30 minutes before washing out with a gentle shampoo. You also can use it as a leave-in conditioner.",
  },
  {
    name: "Coconut Oil",
    description: "Coconut oil penetrates the hair shaft, reducing protein loss and preventing breakage.",
    category: "breakage",
    howToUse: "Warm a small amount of coconut oil and apply over damp hair, focusing on the ends. Leave it on for at least 1-2 hours before washing out with shampoo and conditioner.",
  },
  {
    name: "Avocado Oil",
    description: "Avocado oil is rich in vitamins A, D, and E, which nourish and strengthen hair.",
    category: ["breakage", "color damage"],
    howToUse: "To use as a hair mask, mash half an avocado (after removing the stone and peel), mix it with one egg yolk and a tablespoon of honey, apply the mixture to clean, damp hair for 30 minutes, then rinse and dry — this treatment can be used once every two weeks for shinier, healthier hair.",
  },
  {
    name: "Almond Oil",
    description: "Almond oil is rich in vitamin E and fatty acids that help repair and protect color-treated hair. It deeply hydrates and nourishes the hair, reducing damage caused by chemical treatments like hair dyes",
    category: "color damage",
    howToUse: "Apply a dime-sized amount to the ends of your hair before drying to rehydrate the strands and decrease frizz.",
  },
  {
    name: "Honey",
    description: "Honey is a natural humectant that helps retain moisture in color-treated hair, preventing dryness and brittleness.",
    category: "color damage",
    howToUse: "To use as a hair mask, mash half an avocado (after removing the stone and peel), mix it with one egg yolk and a tablespoon of honey, apply the mixture to clean, damp hair for 30 minutes, then rinse and dry — this treatment can be used once every two weeks for shinier, healthier hair.",
  },
  {
    name: "Olive Oil",
    description: "This cooking oil is rich in antioxidants and vitamins that help repair and strengthen color-damaged hair.",
    category: "color damage",
    howToUse: "Measure about 1–2 tablespoons (or around ¼ cup if you're treating longer, thicker hair). Massage the oil deeply into your hair, on the scalp if it's dry, or the ends if they're damaged, then wrap your hair in a shower cap and leave it on for at least 15 minutes. After the treatment, comb your hair with a wide-toothed comb, then shampoo thoroughly (you may need to shampoo twice depending on how much oil you used) and rinse",
  },
  {
    name: "Aloe Vera",
    description: "Aloe vera soothes the scalp and conditions hair, reducing dandruff and promoting healthy hair growth. It contains vitamin A, C, and E, which are essential for healthy hair, and Vitamin B12 and Folic Acid that help prevent hair loss.",
    category: ["color damage", "hair loss"],
    howToUse: "Scoop out fresh aloe vera gel (or use pure aloe vera gel) and apply it evenly to your scalp and hair, focusing on the ends if they're prone to breakage. Cover your hair with a shower cap and leave it on for 30–60 minutes. Rinse thoroughly with a mild shampoo. Use this once a week to help strengthen and nourish your hair.",
  },
];

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface Capability {
  icon: keyof typeof Ionicons.glyphMap;
  text: string;
}

const capabilities: Capability[] = [
  { icon: 'water-outline', text: 'Care routines & washing tips' },
  { icon: 'medical-outline', text: 'Hair health diagnosis' },
  { icon: 'leaf-outline', text: 'Natural remedies' },
  { icon: 'sunny-outline', text: 'Lifestyle & environmental effects' },
  { icon: 'warning-outline', text: 'Myths & common mistakes' },
  { icon: 'lock-closed-outline', text: 'Privacy & app features' },
  { icon: 'pulse-outline', text: 'Hair types & damage info' },
];

const exampleQuestions = [
  'How often should I wash curly hair?',
  'Does trimming help hair grow faster?',
  'How to prevent sun damage?',
  'Why is my hair falling out?',
  'Is this breakage or hair shedding?',
  'How can I tell if my hair is dry or just frizzy?',
  'Why does my scalp itch or get flaky?',
  'What products are best for my hair type?',
  'What shampoo should I use?',
  'What conditioner works best for my hair type?',
  'Can you suggest local PH brands?',
  'Is this product safe for colored hair?',
  "What's the best oil for dry scalp?",
  'Do you have products for hair fall?',
  'What products help with dandruff?',
  'Should I use sulfate-free shampoo?',
  'Is tea tree oil good for my scalp?',
  "What's a good clarifying shampoo?",
  'Any products for oily scalp?',
  'How does your AI analyze my hair?',
  'Is my photo stored?',
  'How do I retake my analysis?',
  'Can the app detect scalp problems?',
  'Why did my analysis result change?',
  'How accurate is MobileNet?',
  'Do you guarantee product effectiveness?',
  'Are your recommendations hair expert-approved?',
  'What ingredients should I avoid?',
  'Will the recommended products work for my hair?',
  'Is sulfate-free better?',
  'How do you analyze my hair?',
  'How can I take care of color damaged hair?',
  'What is my hair type?',
  'How to refresh curls without washing?',
  'What natural remedies help with hair loss?',
  'Can I mix different hair product brands?',
  'How often should I deep condition?',
  'What causes hair breakage?',
  'How to care for wavy hair?',
  'Are natural remedies better than commercial products?',
  'What should I do if my hair is damaged?',
  'How to protect hair from pollution?',
  'What is the best routine for straight hair?',
  'How to care for hair after swimming?',
  'Does diet affect hair health?',
  'How to care for hair after gym?',
  'What ingredients help hair grow?',
  'How to know if my hair is healthy?',
  'What is the difference between dry and frizzy hair?',
  'How to care for kinky or coily hair?',
  'What causes scalp itching?',
  'How to test hair health?',
  'What is keratin and is it good for hair?',
  'How to care for hair in summer vs winter?',
  'What is hyaluronic acid for hair?',
  'What is the best routine for my hair type?',
  'How often should I shampoo?',
  'Should I deep condition weekly?',
  "What's the best routine for wavy hair?",
  'How do I take care of straight hair?',
  'Should I use hair oil before or after shower?',
  'Should I air dry or blow dry?',
  'How do I style my natural waves?',
  'How to fix greasy hair quickly?',
  'How do I maintain a healthy scalp?',
  'Should I trim my hair every month?',
];

const normalizeQuestion = (input: string) =>
  input
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

type ScriptedHandler = () => string | null;

const getLocalBrandResponse = () => {
  const products = recommendProducts({ limit: 50 });
  const localBrands = products.filter(p => p.isLocal === true);
  const brandNames = new Set<string>();

  localBrands.forEach(p => {
    if (p.name.toLowerCase().includes('kathare')) {
      brandNames.add('Kathare');
    } else if (p.name.toLowerCase().includes('zenutrients')) {
      brandNames.add('Zenutrients');
    } else if (p.name.toLowerCase().includes('human nature')) {
      brandNames.add('Human Nature');
    } else if (p.name.toLowerCase().includes('hairreve')) {
      brandNames.add('HairReve');
    }
  });

  const brandList = Array.from(brandNames);
  if (brandList.length > 0) {
    return `Yes! We recommend local Philippine brands like ${brandList.join(', ')}, and more brands that are local in our product recommendations. Take a hair scan to get personalized recommendations from these local brands!`;
  }

  return "Yes! We recommend local Philippine brands like Kathare, Zenutrients, and more brands that are local in our product recommendations. Take a hair scan to get personalized recommendations from these local brands!";
};

const getDryScalpOilResponse = () => {
  const products = recommendProducts({ scalpCondition: 'Dry Scalp', limit: 10 });
  const oils = products.filter(p => p.productType === 'Hair Oil');
  let response = "Best oils for DRY SCALP:\n\n";

  if (oils.length > 0) {
    oils.forEach((product, index) => {
      response += `${index + 1}. ${product.name}\n   ${product.description}\n\n`;
    });
  } else {
    response += "Natural oils that help:\n• Jojoba oil (similar to scalp's natural oils)\n• Coconut oil (deep moisture)\n• Argan oil (lightweight, non-greasy)\n• Tea tree oil (soothes irritation, use diluted)\n• Olive oil (rich moisture)\n\nHow to use:\n- Apply to scalp, massage gently\n- Leave for 30 min to overnight\n- Wash with gentle shampoo\n- Use 1-2x per week\n\n";
  }

  response += "Take a hair scan for personalized product recommendations!";
  return response;
};

const getHairFallProductsResponse = () => {
  const products = recommendProducts({ hairDamage: 'Hair Loss', limit: 10 });
  const filtered = products.filter(p =>
    p.description.toLowerCase().includes('hair loss') ||
    p.description.toLowerCase().includes('strengthen') ||
    p.description.toLowerCase().includes('growth')
  );

  let response = "Products for HAIR FALL/LOSS:\n\n";

  if (filtered.length > 0) {
    filtered.slice(0, 5).forEach((product, index) => {
      response += `${index + 1}. ${product.name}\n   ${product.description}\n\n`;
    });
  }

  response += "Look for products with:\n• Biotin (strengthens hair)\n• Caffeine (stimulates growth)\n• Niacinamide (improves scalp circulation)\n• Rosemary oil (promotes growth)\n• Peptides (strengthens follicles)\n\nConsider natural remedies: Rosemary oil, Peppermint oil, and scalp massages. Check our Natural Remedies section!\n\nIf hair loss persists, consult a dermatologist.";
  return response;
};

const getDandruffProductsResponse = () => {
  const products = recommendProducts({ scalpCondition: 'Dandruff', limit: 10 });
  const dandruffProducts = products.filter(p => p.productType === 'Shampoo');

  let response = "Products for DANDRUFF:\n\n";

  if (dandruffProducts.length > 0) {
    dandruffProducts.slice(0, 5).forEach((product, index) => {
      response += `${index + 1}. ${product.name}\n   ${product.description}\n\n`;
    });
  }

  response += "Look for active ingredients:\n• Zinc Pyrithione (reduces fungus)\n• Ketoconazole (antifungal)\n• Salicylic Acid (exfoliates flakes)\n• Tea Tree Oil (natural antifungal)\n• Selenium Sulfide (reduces flakes)\n\nTips:\n- Massage shampoo into scalp for 3-5 minutes\n- Use 2-3x per week\n- Avoid scratching scalp\n- Keep scalp moisturized\n\nTake a hair scan to get personalized dandruff-fighting products!";
  return response;
};

const getOilyScalpProductsResponse = () => {
  const products = recommendProducts({ scalpCondition: 'Oily Scalp', limit: 10 });
  const oilyScalpProducts = products.filter(p => p.productType === 'Shampoo');

  let response = "Products for OILY SCALP:\n\n";

  if (oilyScalpProducts.length > 0) {
    oilyScalpProducts.slice(0, 5).forEach((product, index) => {
      response += `${index + 1}. ${product.name}\n   ${product.description}\n\n`;
    });
  }

  response += "Look for:\n• Clarifying shampoos (use weekly)\n• Tea tree oil products (controls oil)\n• Salicylic acid (exfoliates scalp)\n• Zinc products (regulates oil)\n• Lightweight, volumizing formulas\n\nTips for oily scalp:\n- Wash 2-3x per week (not daily!)\n- Focus shampoo on SCALP only\n- Use dry shampoo between washes\n- Avoid heavy conditioners on roots\n- Rinse with cool water\n\nTake a hair scan for personalized oily scalp recommendations!";
  return response;
};

type RoutineType = 'Straight' | 'Wavy' | 'Curly' | 'Kinky';

const getRoutineResponse = (type: RoutineType) => {
  const routine = hairTypeRoutines[type];
  if (!routine) return "Please take a hair scan to view your personalized routine.";

  let response = `Best routine for ${type.toUpperCase()} HAIR:\n\n`;
  response += `CONDITIONING:\n${routine.conditionerTips}\n\n`;
  response += `STYLING:\n${routine.styling}\n\n`;
  response += `DRYING:\n${routine.dryingTips}\n\n`;
  if (routine.extraTip) response += `TIP:\n${routine.extraTip}`;
  return response;
};

const getHairTypeCareResponse = (type: RoutineType) => {
  if (type === 'Straight') {
    return "How to take care of STRAIGHT HAIR (Type 1):\n\nWASH ROUTINE:\n• Frequency: Every 2-3 days\n• Use volumizing or lightweight shampoo\n• Oils travel down quickly (gets greasy faster)\n• Focus shampoo on scalp\n\nCONDITIONING:\n• Apply to ends only (avoid roots)\n• Use lightweight conditioners\n• Avoid heavy oils (makes hair flat)\n• Rinse thoroughly\n\nSTYLING:\n• Minimal product needed\n• Use volumizing sprays if desired\n• Avoid heavy creams/oils\n• Heat protectant before styling\n\nDRYING:\n• Can air dry easily\n• Blow dry with brush for volume\n• Dry from roots for lift\n• Use cool shot to set style\n\nMAINTENANCE:\n• Regular trims (every 6-8 weeks)\n• Avoid over-washing (strips oils)\n• Use dry shampoo between washes\n• Brush gently to distribute oils\n\nCOMMON CONCERNS:\n• Gets oily quickly → Less frequent washing\n• Looks flat → Volumizing products at roots\n• Split ends → Regular trims\n\nPRODUCT TIPS:\n✓ Lightweight formulas\n✓ Volumizing products\n✓ Clarifying shampoo (monthly)\n✓ Avoid heavy oils/butters\n\nFor your COMPLETE straight hair routine:\nTake a hair scan → View Personalized Routine → Get detailed care instructions!";
  }

  if (type === 'Wavy') {
    return "How to care for WAVY hair (Type 2):\n\nWASH ROUTINE:\n• Frequency: 2-3 times per week\n• Use lightweight, moisturizing shampoo\n• Focus shampoo on scalp only\n• Condition mid-lengths to ends\n\nCONDITIONING:\n• Leave-in conditioner for daily moisture\n• Deep condition bi-weekly or weekly if damaged\n• Co-wash between shampoos if needed\n\nSTYLING:\n• Apply products to damp hair\n• Use curl creams/mousse for definition\n• Scrunch hair upward to enhance waves\n• Avoid brushing when dry\n\nDRYING:\n• Air dry preferred (less frizz)\n• Diffuse on low heat/speed if needed\n• Do not touch while drying\n\nMAINTENANCE:\n• Sleep on silk/satin pillowcase\n• Refresh waves with water + leave-in\n• Use lightweight oils/serums for frizz control";
  }

  if (type === 'Curly') {
    return "Curly hair (Type 3):\n\nWell-defined spiral curls.\n\n• 3A: Loose, big curls\n• 3B: Springy ringlets\n• 3C: Tight corkscrew curls\n\nCare tips:\n• Deep condition weekly\n• Use leave-in conditioner daily\n• Detangle only when wet with conditioner\n• Apply products to soaking wet hair\n• Avoid brushes—use fingers or wide-tooth comb";
  }

  return "Kinky/Coily hair (Type 4):\n\nTight coils, zigzag patterns.\n\n• 4A: Soft, tight coils\n• 4B: Z-pattern, sharp angles\n• 4C: Very tight, fragile, high shrinkage\n\nCare tips:\n• Pre-poo before washing\n• Shampoo every 7-10 days (sulfate-free)\n• Deep condition every wash\n• Leave-in + oils daily\n• Protective styles to reduce breakage\n• Detangle gently in sections with conditioner";
};

const greetingResponse = "Hello! I'm here to help you with hair care tips, hair types, and hair health questions. What would you like to know?";
const gratitudeResponse = "You're welcome! Happy to help with your hair care journey! Feel free to ask more questions anytime.";
const farewellResponse = "Goodbye! Take care of your hair! Come back anytime you have questions.";
const productVariationResponse = "Every person's hair is unique, so results may vary. The products we recommend are based on your hair condition and common effective ingredients, but they may not work the same for everyone. We encourage you to observe how your hair responds and adjust as needed. If concerns persist, consulting a haircare professional or dermatologist may provide more personalized guidance.";
const requiredProductsResponse = "No! The recommended products are suggestions based on your hair analysis. You can choose to use them or explore other options that suit your preferences and budget.";
const ingredientsToAvoidResponse = "Avoid harsh sulfates if your hair is color-treated or dry. Avoid heavy oils if you have an oily or sensitive scalp.";
const sulfateFreeResponse = "Sulfate-free is gentler and ideal for colored or dry hair. If you have oily or buildup-prone scalp, occasional sulfates are fine.";
const keratinResponse = "Good in moderation—it strengthens hair. Overuse can make hair stiff or brittle.";
const hyaluronicResponse = "Hyaluronic acid attracts moisture, helping keep hair hydrated and soft.";
const teaTreeResponse = "Yes, but use diluted products. Tea tree helps with dandruff and oiliness.";
const productLinksResponse = "Product links or purchasing options will be shown after recommendations, based on availability.";
const personalizationResponse = "Yes — we match product types and routines based on your hair condition.";
const shampooGeneralResponse = "Based on your hair analysis, I can recommend personalized shampoos! Please take a hair scan first, or let me know your hair type (Straight, Wavy, Curly, or Coily) for recommendations.";
const conditionerGeneralResponse = "Based on your hair analysis, I can recommend personalized conditioners! Please take a hair scan first, or let me know your hair type (Straight, Wavy, Curly, or Coily) for recommendations.";
const colorSafeResponse = "For color-treated hair, look for:\n\n✓ Sulfate-free products (sulfates strip color)\n✓ Products labeled 'color-safe' or 'color-protecting'\n✓ UV protection ingredients\n✓ Gentle, moisturizing formulas\n\nOur app recommends color-safe products based on your hair analysis. Avoid products with harsh sulfates, alcohols, or clarifying ingredients that can fade your color faster.";
const mixingBrandsResponse = "Absolutely. Focus on the ingredients and benefits, not the brand. Mixing brands is common and safe.";
const aiAnalysisResponse = "How our AI analyzes your hair:\n\n1. IMAGE UPLOAD:\n• You take or upload a photo of your hair\n• The image is preprocessed for analysis\n\n2. AI MODEL (MobileNet):\n• We use a trained MobileNet machine learning model\n• The model analyzes visual patterns in your hair\n• It examines texture, curl pattern, and damage indicators\n\n3. DETECTION:\n• Hair Type Classification (Straight, Wavy, Curly, Kinky)\n• Damage Detection (Breakage, Hair Loss, Color Damage)\n• Confidence scores for each prediction\n\n4. YOUR INPUT:\n• We combine AI results with your scalp condition input\n• This creates a more complete hair profile\n\n5. PERSONALIZED RECOMMENDATIONS:\n• Based on your unique hair profile\n• Products matched to your needs\n• Custom care routines\n• Natural remedy suggestions\n\nOur AI provides quick, convenient analysis, but we always recommend consulting a hair professional for persistent concerns!";
const photoStoredResponse = "Is your photo stored?\n\nYES, your photos are securely stored in Firebase Storage.\n\nWhy we store them:\n• Hair care professionals validate the AI results\n• Ensures accuracy of recommendations\n• Quality control and model improvement\n• Your analysis history\n\nYour Privacy:\n✓ Photos are stored securely\n✓ Used ONLY for educational purposes\n✓ NOT shared with third parties\n✓ NOT used for marketing\n✓ Accessed only by authorized professionals\n✓ Protected by industry-standard security\n\nRest assured: Your photos are safe and used solely to improve your hair care experience and validate AI accuracy.\n\nIf you have privacy concerns, feel free to contact us!";
const retakeAnalysisResponse = "How to retake your hair analysis:\n\n1. Go to the HOME screen\n2. Tap the CAMERA icon (Capture button)\n3. Choose 'Capture Photo' or 'Upload Image'\n4. Follow the cropping guidelines\n5. Select your scalp condition\n6. Tap 'Analyze'\n\nTips for best results:\n✓ Good lighting (natural light is best)\n✓ Focus on your hair only\n✓ Avoid filters or edits\n✓ Clear, close-up shot\n✓ Show hair texture clearly\n✓ Avoid shadows or glare\n\nYou can retake your analysis as many times as you want! It's helpful to retake periodically to track your hair health progress over time.\n\nCheck your JOURNAL to see your analysis history!";
const scalpDetectionResponse = "Can the app detect scalp problems?\n\nNO, our app does NOT detect scalp problems or scalp conditions.\n\nWhat we DETECT:\n✓ Hair Type (Straight, Wavy, Curly, Kinky)\n✓ Hair Damage (Breakage, Hair Loss, Color Damage)\n\nWhat we DON'T detect:\n✗ Scalp diseases\n✗ Medical scalp conditions\n✗ Infections or dermatological issues\n✗ Scalp psoriasis, eczema, etc.\n\nOur main features:\n• Hair type classification\n• Hair damage assessment\n• Product recommendations\n• Hair care routines\n\nFor scalp concerns:\nWe do ask you to INPUT your scalp condition (Oily, Dry, Dandruff, Normal) to provide better product recommendations, but this is YOUR assessment, not AI detection.\n\nIf you have persistent scalp problems, please consult a dermatologist or trichologist!";
const resultChangeResponse = "Why did your analysis result change?\n\nAnalysis results can vary due to:\n\n1. PHOTO QUALITY:\n• Different lighting conditions\n• Camera angle or distance\n• Image clarity and focus\n• Background interference\n\n2. HAIR CONDITION:\n• Your hair health may have actually improved/worsened\n• Different hair sections photographed\n• Styling products on hair\n• Wet vs. dry hair\n\n3. AI MODEL:\n• Confidence levels vary between images\n• Model interprets visual patterns\n• Borderline cases may fluctuate\n\n4. TIME BETWEEN SCANS:\n• Hair condition changes over time\n• Seasonal effects\n• New treatments or products used\n• Environmental factors\n\nFor most consistent results:\n✓ Use similar lighting\n✓ Same time of day\n✓ Clean, product-free hair\n✓ Same hair section\n✓ Clear, focused images\n\nRemember: AI provides guidance, not diagnosis. If results are drastically different, retake the photo with better lighting, or consult a hair professional!";
const accuracyResponse = "How accurate is MobileNet?\n\nOur MobileNet model provides generally reliable hair analysis, but accuracy depends on several factors:\n\nFACTORS AFFECTING ACCURACY:\n• Photo quality (lighting, focus, angle)\n• Image clarity and resolution\n• Hair visibility in the photo\n• Training data quality\n• Borderline cases between categories\n\nWhat to know:\n✓ The model provides confidence scores with each prediction\n✓ Higher confidence = more reliable result\n✓ Works best with clear, well-lit photos\n✓ Trained on diverse hair types and conditions\n\nIMPORTANT:\n• AI is a TOOL, not a replacement for professional assessment\n• Results are guidance, not medical diagnosis\n• Hair care professionals validate our recommendations\n• Use results as a starting point for your hair care journey\n\nFor best accuracy:\n1. Take clear photos in natural light\n2. Focus on hair texture and condition\n3. Retake if confidence score is low\n4. Track results over time\n\nIf you have concerns about accuracy, consult a hair professional or trichologist!";
const guaranteeResponse = "Do we guarantee product effectiveness?\n\nNO, we do NOT guarantee that recommended products will work for everyone.\n\nWhy?\n• Every person's hair is UNIQUE\n• Individual responses vary\n• Hair chemistry differs\n• Lifestyle factors affect results\n• Genetics play a role\n• Environmental conditions vary\n\nWhat we DO provide:\n✓ Evidence-based recommendations\n✓ Products with beneficial ingredients\n✓ Matched to your hair type and condition\n✓ Expert-validated suggestions\n✓ Variety of options to try\n\nDISCLAIMER:\nThis application is experimental. Our recommendations are for guidance and suggestions only. Results may vary. Please consult a trusted hair care professional for personalized advice.";
const expertApprovalResponse = "Yes - we consulted a hair technician and hair expert to validate the recommended products and routines.";
const hairTypeOverviewResponse = "What is YOUR hair type?\n\nThere are 4 main hair types:\n\n• TYPE 1: STRAIGHT\n   - No curl pattern, lies flat\n   - 1A: Fine, soft, very straight\n   - 1B: Medium texture, slight body\n   - 1C: Coarse, may have slight bends\n   - Gets oily faster (oils travel down easily)\n\n• TYPE 2: WAVY\n   - S-shaped pattern\n   - 2A: Fine, thin waves\n   - 2B: Medium waves, more defined\n   - 2C: Thick, coarse, prone to frizz\n   - Needs balance of moisture and volume\n\n• TYPE 3: CURLY\n   - Well-defined spiral curls\n   - 3A: Loose, big curls\n   - 3B: Springy ringlets\n   - 3C: Tight corkscrew curls\n   - Naturally drier, needs lots of moisture\n\n• TYPE 4: KINKY/COILY\n   - Tight coils, zigzag patterns\n   - 4A: Soft, tight coils\n   - 4B: Z-pattern, sharp angles\n   - 4C: Very tight, fragile, high shrinkage\n   - Driest type, needs maximum moisture\n\nTake a hair scan now to identify YOUR specific hair type and get personalized care instructions!";
const naturalVsCommercialResponse = "Natural remedies vs. commercial products:\n\nNot necessarily better, just different!\n\nNatural remedies:\n• Fewer chemicals\n• Budget-friendly\n• May take longer to see results\n• Can be messy\n\nCommercial products:\n• Scientifically formulated\n• Convenient\n• Can contain harsh ingredients\n• More expensive\n\nIt really depends on YOUR preference! Both can work well when chosen correctly for your hair type.";
const trimmingMythResponse = "MYTH BUSTED: Trimming does NOT make hair grow faster.\n\nWhy this is a myth:\n• Hair grows from the ROOTS (scalp), not the ends\n• Cutting ends doesn't affect growth rate\n• Growth happens at ~0.5 inches per month regardless\n\nBUT trimming IS important because:\n• Prevents split ends from traveling UP the hair shaft\n• Makes hair APPEAR longer and healthier\n• Helps you RETAIN length (less breakage)\n• Removes damaged, weak ends\n\nBest practice:\n• Trim every 6-8 weeks (or every 3-4 months minimum)\n• Use sharp scissors (dull ones cause more damage)\n• Trim when hair is dry for accuracy\n\nThink of it as maintenance, not growth stimulation!";
const hairFallCausesResponse = "HAIR LOSS causes:\n\nCommon causes:\n• Stress and hormonal changes (pregnancy, menopause, thyroid)\n• Nutritional deficiencies (iron, protein, vitamins)\n• Tight hairstyles (pulling on follicles)\n• Scalp conditions (dandruff, infections)\n• Genetics and aging\n• Medical conditions or medications\n• Excessive heat styling\n\nRecovery:\n• Address underlying health issues\n• Improve nutrition (protein, iron, biotin)\n• Avoid tight hairstyles\n• Use gentle hair care products\n• Scalp massages to improve circulation\n• Consider natural remedies (rosemary oil, peppermint oil)\n• Consult a professional if persistent\n\nIf shedding persists for more than 3 months, consult a dermatologist.";
const breakageVsSheddingResponse = "If the fallen strand has a tiny white bulb at the end, it's shedding. If there's no bulb and the piece is shorter or uneven, that's breakage.";
const dryVsFrizzyResponse = "Dry hair lacks moisture and feels rough along the entire strand. Frizz is more about surface texture—your hair may actually be healthy but lacking smoothness.";
const scalpItchResponse = "This may be due to product buildup, dryness, or dandruff. Using gentle exfoliating or clarifying products may help. If redness or irritation persists, consult a specialist.";
const productBestForHairTypeResponse = "Recommendations will depend on your hair type and current condition. Please specify your hair type (Straight, Wavy, Curly, or Coily) for personalized product recommendations.";
const sulfateShampooResponse = "Should you use sulfate-free shampoo?\n\nYES, if you have:\n• Color-treated hair (sulfates strip color)\n• Dry or damaged hair\n• Curly or coily hair (naturally drier)\n• Sensitive scalp\n• Chemically treated hair\n\nOCCASIONALLY OK if you have:\n• Very oily scalp\n• Heavy product buildup\n• Active lifestyle (lots of sweating)\n\nWhy sulfate-free?\n• Gentler on hair and scalp\n• Preserves natural oils\n• Reduces frizz\n• Maintains color longer\n• Less irritating\n\nBest practice: Use sulfate-free for daily washing, clarifying shampoo (with sulfates) once a month for deep cleansing.\n\nTake a hair scan to get personalized recommendations!";
const clarifyingResponse = "Clarifying shampoo recommendations:\n\nWhat is clarifying shampoo?\n• Deep-cleansing formula\n• Removes product buildup\n• Cleanses impurities\n• Resets hair\n\nWhen to use:\n• Once a month (or every 2-4 weeks)\n• After heavy product use\n• Before deep treatments\n• When hair feels heavy/greasy\n\nLook for ingredients:\n• Salicylic acid (exfoliates)\n• Apple cider vinegar (balances pH)\n• Charcoal (absorbs impurities)\n• Tea tree oil (deep clean)\n\nIMPORTANT:\n❌ Don't use too often (strips natural oils)\n❌ Not ideal for color-treated hair (fades color)\n✓ Always deep condition after\n✓ Use lukewarm water\n\nFor specific product recommendations based on your hair type, take a hair scan!";
const seasonalCareResponse = "Seasonal hair care:\n\nSUMMER:\n• UV protection (hats, UV sprays)\n• When planning to swim, use hair products with UV protection before diving into swimming pools or salt water so your hair still has protection\n• Deep conditioning weekly\n• Rinse after swimming\n• Avoid excessive heat styling\n\nWINTER:\n• Extra moisture (oils, masks)\n• Protect from cold wind\n• Humidifier indoors\n• Avoid hot water washes\n\nAdjust your routine with the seasons!";
const coilyCareResponse = "How to care for KINKY/COILY hair (Type 4):\n\nWASH ROUTINE:\n• Frequency: Once a week or less (every 7-10 days)\n• ALWAYS sulfate-free, moisturizing shampoo\n• Pre-poo (oil treatment) before shampooing\n• Focus shampoo ONLY on scalp\n• NEVER shampoo the lengths (too drying)\n• Deep condition every wash (mandatory)\n\nCONDITIONING:\n• ALWAYS deep condition after shampooing\n• Leave-in conditioner DAILY (critical!)\n• Condition mid-lengths to ends generously\n• Use rich, buttery conditioners\n• Moisturize and seal daily\n\nDETANGLING:\n• ONLY detangle when WET (with conditioner)\n• Use fingers first (gentlest method)\n• Wide-tooth comb as backup\n• Start from ends, work up VERY gently\n• Section hair into 4-6 parts\n• Work in small sections\n• Take your time (patience prevents breakage)\n\nSTYLING:\n• Apply products to wet/damp hair\n• Use LOC method (Liquid, Oil, Cream)\n• Protective styles (braids, twists, buns)\n• Avoid heat styling when possible\n• Use heat protectant if styling\n\nDRYING:\n• Air dry preferred (no heat damage)\n• Or diffuse on low heat/speed\n• Don't touch while drying\n• Use silk/satin bonnet or pillowcase\n\nMAINTENANCE:\n• Moisturize daily (spray + leave-in)\n• Seal with oils/butters\n• Protective styles at night\n• Sleep on silk/satin pillowcase\n• Trim every 8-12 weeks\n• Gentle handling always\n\nPRODUCT TIPS:\n✓ Rich, buttery conditioners\n✓ Leave-in conditioner daily\n✓ Deep condition every wash\n✓ Oils and butters (coconut, shea, jojoba)\n✓ Avoid lightweight products (not enough moisture)\n\nCOMMON CONCERNS:\n• Dryness → Daily moisture + sealing\n• Breakage → Gentle handling + protein treatments\n• Shrinkage → Normal! Use stretching techniques\n• Tangling → Detangle only when wet with conditioner\n\nFor your COMPLETE coily hair routine:\nTake a hair scan → View Personalized Routine → Get detailed coily hair care instructions!";
const colorDamageCareResponse = "How to CARE for COLOR DAMAGED hair:\n\n1. USE COLOR-SAFE PRODUCTS:\n• Sulfate-free shampoos (sulfates strip color)\n• Color-protecting conditioners\n• Products specifically for color-treated hair\n• Look for UV protection in products\n\n2. DEEP CONDITIONING:\n• Weekly deep conditioning treatments\n• Use masks with argan oil, keratin, or amino acids\n• Leave-in conditioners for daily moisture\n• Protein treatments to rebuild strength\n\n3. WASHING HABITS:\n• Wash less frequently (2-3x per week)\n• Use cool/lukewarm water (hot water fades color)\n• Avoid hot styling tools when possible\n• Use heat protectant if styling\n\n4. PROTECTION:\n• UV-protectant hair sprays/serums\n• Wear hats in direct sunlight\n• Avoid chlorine (wear swim cap)\n• Protect from environmental damage\n\n5. AVOID:\n• Frequent color applications\n• Overlapping color treatments\n• Harsh chemical treatments\n• Excessive heat styling\n\n6. RECOVERY TIME:\n• Allow time between color treatments\n• Give hair time to recover\n• Trim damaged ends regularly\n• Be patient - recovery takes time\n\nRemember: Prevention is key! Protect your color-treated hair to maintain its health and vibrancy.";
const swimmingCareResponse = "Swimming & hair care:\n\nCHLORINE/SALT WATER can:\n• Dry out hair\n• Cause color fading\n• Create tangles\n• Strip natural oils\n\nProtection:\n1. Wet hair with clean water first\n2. Apply leave-in conditioner\n3. Wear a swim cap if possible\n4. Rinse IMMEDIATELY after\n5. Deep condition after swimming";
const productEffectivenessResponse = "Every person's hair reacts differently. We provide recommendations based on best-fitting ingredients and hair condition, but results may vary.";
const privacyResponse = "Yes — your images are processed securely and are not shared with third parties.";
const naturalRemedyHairLossResponse = (() => {
  const hairLossRemedies = remedies.filter(r => Array.isArray(r.category) ? r.category.includes('hair loss') : r.category === 'hair loss');
  let response = "Natural remedies for HAIR LOSS:\n\n";
  hairLossRemedies.forEach((remedy, index) => {
    response += `${index + 1}. ${remedy.name}\n${remedy.description}\nHow to use: ${remedy.howToUse}\n\n`;
  });
  response += "Remember: Results may vary. If hair loss persists, consult a professional.";
  return response;
})();
const naturalRemedyBreakageResponse = (() => {
  const breakageRemedies = remedies.filter(r => Array.isArray(r.category) ? r.category.includes('breakage') : r.category === 'breakage');
  let response = "Natural remedies for BREAKAGE:\n\n";
  breakageRemedies.forEach((remedy, index) => {
    response += `${index + 1}. ${remedy.name}\n${remedy.description}\nHow to use: ${remedy.howToUse}\n\n`;
  });
  response += "Tip: Be gentle with your hair and avoid excessive heat styling.";
  return response;
})();
const naturalRemedyColorDamageResponse = (() => {
  const colorDamageRemedies = remedies.filter(r => Array.isArray(r.category) ? r.category.includes('color damage') : r.category === 'color damage');
  let response = "Natural remedies for COLOR DAMAGE:\n\n";
  colorDamageRemedies.forEach((remedy, index) => {
    response += `${index + 1}. ${remedy.name}\n${remedy.description}\nHow to use: ${remedy.howToUse}\n\n`;
  });
  response += "Tip: Use color-safe products and avoid frequent color treatments.";
  return response;
})();
const naturalIngredientsResponse = "Natural remedies can be beneficial!\n\nCommon natural treatments:\n• Coconut oil: Deep moisture\n• Aloe vera: Soothing, strengthening\n• Avocado: Rich in vitamins\n• Egg mask: Protein boost\n• Honey: Moisture retention\n\nAlways do a patch test first! Natural doesn't always mean safe for everyone. Check our Natural Remedies section in the app for detailed recipes!";
const washingFrequencyResponse = "Washing frequency by hair type:\n\n• Type 1 (Straight): Every 2-3 days (gets oily faster)\n• Type 2 (Wavy): 2-3 times per week\n• Type 3 (Curly): 1-2 times per week\n• Type 4 (Kinky/Coily): Once a week or less\n\nAdjust based on:\n• Lifestyle (exercise, environment)\n• Scalp oiliness\n• Hair thickness\n• Product buildup";
const bestRoutineGeneralResponse = "What is the best routine for your hair type?\n\nThe BEST routine is personalized to YOUR specific hair!\n\nOur app provides customized routines based on:\n✓ Your hair type (Straight, Wavy, Curly, Kinky)\n✓ Your scalp condition (Oily, Dry, Dandruff, Normal)\n✓ Your hair damage level (Healthy, Breakage, Hair Loss, Color Damage)\n\nTake a hair scan now to get YOUR custom routine!";
const shampooFrequencyGeneralResponse = "How often should you shampoo?\n\nIt depends on your hair type and scalp condition!\n\nGENERAL GUIDELINES:\n• Straight hair (Type 1): Every 2-3 days\n• Wavy hair (Type 2): 2-3 times per week\n• Curly hair (Type 3): 1-2 times per week\n• Kinky/Coily hair (Type 4): Once a week or less\n\nADJUST BASED ON:\n• Oily scalp: May need more frequent washing (but not daily!)\n• Dry scalp: Less frequent, focus on moisture\n• Dandruff: 2-3x per week with dandruff shampoo\n• Active lifestyle: May need extra washes after workouts\n• Product buildup: Use clarifying shampoo monthly";
const deepConditionResponse = "Should you deep condition weekly?\n\nIt depends on your hair type and condition!\n\nWHO NEEDS WEEKLY DEEP CONDITIONING:\n✓ Curly/Coily hair (Type 3 & 4)\n✓ Dry or damaged hair\n✓ Color-treated hair\n✓ Chemically processed hair\n✓ Heat-styled hair\n✓ High porosity hair\n\nWHO CAN DO BI-WEEKLY:\n• Wavy hair (Type 2)\n• Normal porosity hair\n• Minimally processed hair\n\nWHO CAN DO MONTHLY:\n• Straight hair (Type 1)\n• Oily hair\n• Fine hair (avoid over-conditioning)\n• Low porosity hair\n\nBENEFITS OF DEEP CONDITIONING:\n• Restores moisture\n• Repairs damage\n• Strengthens hair\n• Reduces breakage\n• Improves elasticity\n• Adds shine\n\nHow to deep condition:\n1. Shampoo hair\n2. Apply deep conditioner/mask\n3. Focus on mid-lengths to ends\n4. Leave for 15-30 minutes (or as directed)\n5. Rinse thoroughly";
const basicRoutineResponse = "Basic hair care routine:\n\nWEEKLY:\n1. Cleanse scalp thoroughly\n2. Condition mid-lengths to ends\n3. Deep condition (once/week)\n4. Trim every 6-8 weeks\n\nDAILY:\n• Gentle detangling\n• Protect from sun/heat\n• Sleep on silk/satin\n• Drink water, eat healthy\n\nCustomize based on YOUR hair type and needs!";
const refreshCurlsResponse = "Refresh curls/waves without washing:\n\n1. Lightly dampen with water spray\n2. Apply leave-in conditioner or curl cream\n3. Scrunch gently\n4. Air dry or diffuse on low\n5. Use silk/satin pillowcase at night\n\nPro tip: Sleep in a pineapple (high loose ponytail) or use a bonnet to preserve curls overnight!";
const healthyVsDamagedResponse = "Signs of HEALTHY hair:\n• Shiny and smooth\n• Minimal breakage\n• Elastic (stretches slightly without breaking)\n• No split ends\n• Soft texture\n\nSigns of DAMAGED hair:\n• Dull, lifeless\n• Excessive shedding\n• Breaks easily\n• Split/frayed ends\n• Rough, tangled\n\nUse our app's damage detector to analyze your hair!";
const hairHealthTestsResponse = "Simple hair health tests:\n\n1. ELASTICITY TEST:\nStretch a strand when wet. Healthy hair stretches 50% then returns.\n\n2. POROSITY TEST:\nDrop hair in water. Floats = low, sinks slowly = normal, sinks fast = high.\n\n3. BREAKAGE TEST:\nGently pull a strand. Breaks easily = damaged.\n\nFor accurate analysis, use our app's AI detection feature!";
const sunProtectionResponse = "How to PREVENT sun damage to your hair:\n\n1. PHYSICAL PROTECTION:\n• Wear wide-brimmed hats or scarves\n• Use umbrellas in direct sunlight\n• Cover hair when swimming\n\n2. PRODUCT PROTECTION:\n• Use UV-protectant hair sprays/serums\n• Apply leave-in conditioner with UV filters\n• Use hair oils with natural SPF\n\n3. TIMING:\n• Avoid peak sun hours (10am-4pm)\n• Seek shade when possible\n\n4. AFTER-SUN CARE:\n• Rinse hair after sun exposure\n• Deep condition weekly\n• Use protein treatments if hair feels weak\n• Avoid heat styling on sun-exposed days";
const sunDamageResponse = "YES, sun DOES damage hair!\n\nUV rays cause:\n• Color fading\n• Protein loss\n• Dryness and brittleness\n• Weakened strands\n• Split ends\n• Loss of elasticity\n\nProtection:\n• Wear hats or scarves\n• UV-protectant hair products\n• Avoid peak sun (10am-4pm)\n• Deep condition weekly\n• Rinse after sun exposure";
const pollutionResponse = "Pollution damages hair:\n\nEffects:\n• Buildup on scalp and strands\n• Dullness\n• Scalp irritation\n• Accelerated aging\n\nProtection:\n• Wash hair regularly\n• Use clarifying shampoo weekly\n• Protective hairstyles\n• Antioxidant hair products\n• Cover hair in heavily polluted areas";
const dietResponse = "YES! Diet greatly affects hair health.\n\nEssential nutrients:\n• Protein: Hair building blocks\n• Iron: Prevents shedding\n• Omega-3: Scalp health\n• Biotin: Strengthens hair\n• Vitamins A, C, E: Growth & shine\n\nEat: Eggs, fish, nuts, leafy greens, berries, sweet potatoes\n\nDrink plenty of water!";
const gymResponse = "Post-workout hair care:\n\nSweat contains salt that can:\n• Dry out hair\n• Cause buildup\n• Lead to breakage\n\nAfter gym:\n1. Rinse with water (no need to shampoo every time)\n2. Use dry shampoo on roots\n3. Tie hair loosely while working out\n4. Wash 2-3x per week\n5. Keep hair moisturized\n\nDon't let sweat sit for hours!";
const productIngredientResponse = "Caffeine, rosemary, peptides, and niacinamide support scalp circulation and stronger growth.";
const whereToBuyLocalResponse = "Take a scan to get local product suggestions tailored to you.";

const teaTreeResponseDetailed = "YES! Tea tree oil is EXCELLENT for scalp health!\n\nBenefits:\n• Antifungal properties (fights dandruff)\n• Reduces oiliness\n• Soothes itchy, irritated scalp\n• Unclogs hair follicles\n• Natural antiseptic\n\nIMPORTANT: Always dilute!\n• Add 5-10 drops to 1 oz carrier oil (coconut, jojoba)\n• Or use products that already contain tea tree oil\n• NEVER apply undiluted (can cause irritation)\n\nHow to use:\n1. Mix with carrier oil\n2. Massage into scalp\n3. Leave for 15-30 minutes\n4. Wash with gentle shampoo\n5. Use 1-2x per week\n\nBest for:\n• Oily scalp\n• Dandruff\n• Scalp acne\n• Itchy scalp\n\nDo a patch test first to check for allergies!";
const breakageCausesResponse = "BREAKAGE causes:\n\nCommon causes:\n• Heat styling without heat protectant (flat irons, curling irons, blow dryers)\n• Excessive brushing or combing (especially when wet)\n• Chemical treatments (perms, relaxers, bleach)\n• Rough handling (towel drying, tight hair ties, rough brushing)\n• Environmental factors (sun exposure, pollution, hard water)\n• Lack of moisture and protein\n• Split ends traveling up the hair shaft\n• Using harsh shampoos or over-washing\n\nRecovery:\n• Use heat protectant before styling\n• Deep conditioning weekly (protein and moisture)\n• Trim split ends regularly (every 6-8 weeks)\n• Gentle handling (wide-tooth comb, microfiber towel)\n• Minimize heat styling (air dry when possible)\n• Use natural remedies (coconut oil, jojoba oil, rice water)\n• Avoid tight hairstyles and hair ties\n• Use sulfate-free, moisturizing products\n\nBe patient - recovery takes time!";
const colorDamageCausesResponse = "COLOR DAMAGE causes:\n\nCommon causes:\n• Chemical processing (bleach, permanent dyes, highlights)\n• Frequent color applications (overlapping treatments)\n• Harsh color products (high ammonia, peroxide)\n• Heat styling on color-treated hair\n• UV exposure (sun fades color and damages hair)\n• Chlorine and saltwater exposure\n• Sulfate shampoos (strip color and moisture)\n• Lack of color-safe products\n• Over-processing (leaving dye on too long)\n\nRecovery:\n• Use color-safe, sulfate-free shampoos\n• Deep conditioning weekly (with color-protecting masks)\n• UV protection (hats, UV-protectant sprays)\n• Minimize heat styling (use low heat with protectant)\n• Avoid frequent color applications (wait 6-8 weeks)\n• Use natural remedies (almond oil, olive oil, honey, aloe vera)\n• Rinse hair after swimming (chlorine/saltwater)\n• Trim damaged ends regularly\n• Use leave-in conditioners for daily moisture\n\nProtect your color to maintain health and vibrancy!";
const damageActionResponse = "What to do if your hair is DAMAGED:\n\nIMMEDIATE STEPS:\n\n1. STOP THE DAMAGE:\n• Avoid heat styling (or use lowest heat with protectant)\n• Stop chemical treatments (coloring, perming, relaxing)\n• Avoid tight hairstyles\n• Use gentle hair ties (silk scrunchies)\n• Don't brush when wet (use wide-tooth comb)\n\n2. DEEP CONDITIONING:\n• Deep condition weekly (or 2x/week if severely damaged)\n• Use protein treatments bi-weekly\n• Leave-in conditioner daily\n• Hair masks with keratin, argan oil, or coconut oil\n\n3. TRIM DAMAGED ENDS:\n• Get a trim every 6-8 weeks\n• Remove split ends to prevent traveling up\n• Even if growing out, trim regularly\n\n4. GENTLE HANDLING:\n• Use microfiber towel (not terrycloth)\n• Wide-tooth comb only\n• Detangle gently with conditioner\n• Sleep on silk/satin pillowcase\n• Avoid rough towel drying\n\n5. PROTECTIVE STYLING:\n• Low manipulation styles\n• Avoid excessive brushing\n• Use heat protectant if styling\n• Protect from sun/UV rays\n\n6. PRODUCTS:\n• Sulfate-free shampoos\n• Rich, moisturizing conditioners\n• Protein treatments\n• Leave-in conditioners\n• Hair oils (argan, jojoba, coconut)\n\n7. LIFESTYLE:\n• Eat protein-rich foods\n• Stay hydrated\n• Manage stress\n• Get enough sleep\n\nRECOVERY TIMELINE:\n• Minor damage: 4-6 weeks\n• Moderate damage: 2-3 months\n• Severe damage: 4-6 months\n\nFor PERSONALIZED damage treatment:\nTake a hair scan → View Personalized Routine → Get custom damage treatment plan!";
const genericDamageResponse = "Hair damage:\n\nCommon causes:\n• Heat styling without protection\n• Chemical treatments\n• Rough handling\n• Environmental factors\n• Lack of moisture\n\nRecovery:\n• Deep conditioning weekly\n• Trim damaged ends\n• Gentle handling\n• Minimize heat/chemicals\n• Use our app to track progress!";
const oilUsageResponse = "Should you use hair oil BEFORE or AFTER shower?\n\nBOTH have benefits! Choose based on your goal:\n\nBEFORE SHOWER (Pre-wash treatment):\n✓ Deep conditioning treatment\n✓ Protects hair during washing\n✓ Good for dry, damaged hair\n✓ Leave for 30 min to overnight\n✓ Best oils: Coconut, Olive, Castor\n\nHow to:\n1. Apply oil to dry hair\n2. Massage into scalp and lengths\n3. Leave for 30+ minutes\n4. Shampoo thoroughly (may need 2 washes)\n\nAFTER SHOWER (Leave-in treatment):\n✓ Seals moisture\n✓ Adds shine\n✓ Reduces frizz\n✓ Protects from heat/environment\n✓ Best oils: Argan, Jojoba, Almond\n\nHow to:\n1. Apply to damp (not wet) hair\n2. Focus on mid-lengths to ends\n3. Use small amount (1-2 drops)\n4. Avoid roots (can look greasy)\n\nHAIR TYPE GUIDE:\n• Straight/Fine: After shower, minimal amount\n• Wavy: Both (light oils)\n• Curly/Coily: Both (generous amounts)\n• Oily scalp: After shower, ends only\n• Dry hair: Before shower for deep treatment\n\nPro tip: You can do BOTH!\nPre-wash for treatment + Post-wash for styling\n\nFor personalized oil recommendations:\nTake a hair scan → View Personalized Routine!";
const dryingResponse = "Should you AIR DRY or BLOW DRY?\n\nIT DEPENDS on your hair type and lifestyle!\n\nAIR DRYING:\n✓ No heat damage\n✓ Better for hair health\n✓ Free and effortless\n✓ Good for curly/wavy hair\n\n❌ Takes longer\n❌ Less volume/control\n❌ Can cause frizz if done wrong\n❌ May look flat on straight hair\n\nBest for:\n• Curly, wavy, coily hair\n• Damaged or color-treated hair\n• When you have time\n\nBLOW DRYING:\n✓ Faster results\n✓ More volume and control\n✓ Smooth finish\n✓ Good for styling\n\n❌ Heat damage risk\n❌ Can cause frizz/dryness\n❌ Requires heat protectant\n❌ Takes effort\n\nBest for:\n• Straight hair (adds volume)\n• When you need quick results\n• Achieving specific styles\n\nBEST OF BOTH WORLDS:\n1. Air dry 60-70%\n2. Then blow dry on LOW heat\n3. Use heat protectant\n4. Finish with cool shot\n\nBLOW DRYING TIPS:\n✓ Always use heat protectant\n✓ Keep dryer 6 inches away\n✓ Use low-medium heat\n✓ Point down to smooth cuticle\n✓ Finish with cool air\n\nAIR DRYING TIPS:\n✓ Gently squeeze (don't rub) with towel\n✓ Apply leave-in products\n✓ Don't touch too much (causes frizz)\n✓ Sleep in protective style if overnight\n\nFor your hair type's BEST drying method:\nTake a hair scan → View Personalized Routine → See custom drying tips!";
const stylingWavesResponse = "How to style NATURAL WAVES:\n\n1. START WITH CLEAN, DAMP HAIR:\n• Wash with sulfate-free shampoo\n• Condition mid-lengths to ends\n• Gently squeeze out excess water (don't rub!)\n\n2. APPLY PRODUCTS:\n• Use leave-in conditioner\n• Add curl cream or mousse (lightweight)\n• Apply to damp hair, section by section\n• Use prayer hands or scrunching method\n\n3. SCRUNCHING TECHNIQUE:\n• Flip head upside down\n• Scrunch hair upward toward scalp\n• Hold for a few seconds\n• Repeat throughout hair\n\n4. DRYING:\n• Air dry preferred (less frizz)\n• OR diffuse on low heat/speed\n• Don't touch while drying (causes frizz)\n• Let dry 100% before touching\n\n5. FINISHING:\n• Once dry, scrunch out the crunch\n• Use tiny bit of oil/serum for shine\n• Avoid brushing (breaks up waves)\n\n6. OVERNIGHT/REFRESH:\n• Sleep on silk/satin pillowcase\n• Or pineapple (high loose ponytail)\n• Refresh with water spray + leave-in\n• Re-scrunch to reactivate waves\n\nKEY TIPS:\n✓ Don't use terrycloth towels (causes frizz)\n✓ Use microfiber towel or t-shirt\n✓ Less is more with products\n✓ Avoid touching while drying\n✓ Embrace your natural texture!\n\nPRODUCTS TO USE:\n• Curl-enhancing cream\n• Lightweight mousse\n• Leave-in conditioner\n• Anti-frizz serum (tiny amount)\n\nFor WAVY HAIR product recommendations:\nTake a hair scan → Get personalized wave-enhancing products!";
const greasyHairFixResponse = "How to fix GREASY HAIR quickly:\n\n1. DRY SHAMPOO (Best quick fix!):\n• Spray or powder on roots\n• Wait 2-3 minutes\n• Massage into scalp\n• Brush through\n• Focus on crown and part line\n\n2. BABY POWDER/CORNSTARCH:\n• Sprinkle small amount on roots\n• Massage into oily areas\n• Brush through thoroughly\n• Good emergency substitute\n\n3. STYLING TRICKS:\n• Pull hair back in sleek ponytail/bun\n• Use headband or scarf\n• Create textured updo\n• Slick back with gel (intentional look)\n• Try braids or twists\n\n4. BLOTTING PAPERS:\n• Press on roots (like for face)\n• Absorbs oil\n• Quick touch-up\n\n5. BLOW DRYER + COOL AIR:\n• Lift roots and blast cool air\n• Adds volume, reduces appearance of oil\n• Takes 2 minutes\n\n6. CHANGE YOUR PART:\n• Parts get oiliest\n• Switch side or go middle\n• Creates volume at roots\n\nPREVENTION TIPS:\n• Don't over-wash (causes more oil production)\n• Wash 2-3x per week max\n• Focus shampoo on scalp only\n• Avoid touching hair\n• Use products for oily scalp\n• Clean pillowcases weekly\n\nLONG-TERM SOLUTIONS:\nFor personalized oily scalp care:\nTake a hair scan → View Personalized Routine → Get custom wash frequency and product recommendations!";
const healthyScalpResponse = "How to maintain a HEALTHY SCALP:\n\n1. PROPER CLEANSING:\n• Wash appropriate frequency for your scalp type\n• Focus shampoo on SCALP, not lengths\n• Massage gently (don't scratch)\n• Rinse thoroughly\n• Use lukewarm water (hot = drying)\n\n2. EXFOLIATION:\n• Use scalp scrub 1-2x per month\n• Or clarifying shampoo\n• Removes buildup and dead skin\n• Promotes circulation\n\n3. SCALP MASSAGE:\n• 5 minutes daily or 3x per week\n• Increases blood flow\n• Promotes hair growth\n• Reduces tension\n• Use fingertips (not nails)\n\n4. MOISTURIZE (for dry scalp):\n• Use scalp oils (jojoba, tea tree)\n• Apply at night, wash morning\n• Don't skip this if flaky\n\n5. BALANCE OIL (for oily scalp):\n• Don't over-wash (makes worse!)\n• Use clarifying treatments\n• Tea tree products help\n• Dry shampoo between washes\n\n6. PROTECT:\n• Wear hat in sun (scalp burns!)\n• Rinse after swimming\n• Avoid harsh chemicals\n• Use gentle products\n\n7. DIET & LIFESTYLE:\n• Stay hydrated\n• Eat protein, omega-3s\n• Manage stress\n• Get enough sleep\n\n8. AVOID:\n❌ Scratching with nails\n❌ Harsh sulfates\n❌ Very hot water\n❌ Product buildup\n❌ Tight hairstyles\n❌ Excessive heat\n\nSIGNS OF HEALTHY SCALP:\n✓ No itching or irritation\n✓ Minimal flaking\n✓ No redness\n✓ Comfortable feeling\n✓ Healthy hair growth\n\nFor PERSONALIZED scalp care:\nTake a hair scan → Input scalp condition → View Personalized Routine → Get custom scalp care instructions!";
const trimmingFrequencyResponse = "Should you trim your hair every month?\n\nNO, monthly trims are usually TOO FREQUENT!\n\nRECOMMENDED TRIM FREQUENCY:\n• Every 6-8 weeks (general guideline)\n• Every 3-4 months (minimum)\n• Every 8-12 weeks (if growing out hair)\n\nBASED ON HAIR CONDITION:\n\nHealthy hair:\n• Every 3-4 months is fine\n• Focus on maintaining length\n\nDamaged/split ends:\n• Every 6-8 weeks\n• Remove damage to prevent traveling\n\nColor-treated/heat-styled:\n• Every 6-8 weeks\n• More prone to damage\n\nGrowing out hair:\n• Every 8-12 weeks\n• Just trim the very ends (1/4 inch)\n\nShort haircuts:\n• Every 4-6 weeks\n• To maintain shape\n\nWHY NOT MONTHLY?\n• Hair grows ~0.5 inches per month\n• Monthly trims = no length gain\n• Unnecessary expense\n• Can actually slow growth progress\n\nMYTH: Trimming makes hair grow faster\n❌ FALSE! Hair grows from roots, not ends\n✓ BUT trimming prevents split ends from traveling up\n\nSIGNS YOU NEED A TRIM:\n• Visible split ends\n• Rough, frayed ends\n• Excessive tangling\n• Hair breaks easily\n• Ends look thin/wispy\n\nTRIMMING TIPS:\n✓ Use sharp scissors (dull = more damage)\n✓ Trim when dry for accuracy\n✓ Remove 1/4 to 1/2 inch\n✓ Don't wait too long (damage spreads)\n\nFor your hair's specific needs:\nTake a hair scan → View Personalized Routine → Get custom maintenance schedule!";
const curlyWashFrequencyResponse = "For CURLY hair (Type 3), wash 1-2 times per week.\n\nWhy less frequent?\n• Curly hair is naturally drier\n• Natural oils take longer to travel down curls\n• Over-washing strips essential moisture\n• Can cause frizz and breakage\n\nBest practices:\n• Use sulfate-free shampoo\n• Focus shampoo on scalp only\n• Condition mid-lengths to ends\n• Co-wash (conditioner-only) between shampoos\n• Deep condition weekly\n\nAdjust if:\n• You exercise frequently (may need 2-3x)\n• You have oily scalp (focus on scalp only)\n• You use heavy products (clarify monthly)";
const straightWashFrequencyResponse = "How often to SHAMPOO for STRAIGHT hair (Type 1):\n\nFrequency: Every 2-3 days\n\nWhy more frequent?\n• Natural oils travel down quickly (straight path)\n• Gets greasy faster than other types\n• Needs regular cleansing to avoid flat, oily look\n\nBest practices:\n• Use volumizing or lightweight shampoo\n• Focus shampoo on SCALP only\n• Avoid heavy, moisturizing shampoos (can weigh down)\n• Use dry shampoo between washes if needed\n• Clarifying shampoo once a month\n\nAdjust if:\n• Very oily scalp: Every 2 days\n• Normal scalp: Every 2-3 days\n• Dry scalp: Every 3-4 days\n• Active lifestyle: May need extra wash after workouts\n\nIMPORTANT:\n❌ Don't wash daily (strips natural oils)\n✓ Let scalp regulate naturally\n✓ Use lukewarm water (not hot)\n✓ Rinse thoroughly";
const wavyWashFrequencyResponse = "How often to SHAMPOO for WAVY hair (Type 2):\n\nFrequency: 2-3 times per week\n\nWhy this frequency?\n• Needs balance between moisture and cleansing\n• Too frequent = strips natural oils, causes frizz\n• Too infrequent = buildup weighs down waves\n\nBest practices:\n• Use lightweight, moisturizing shampoo\n• Sulfate-free is ideal (preserves waves)\n• Focus shampoo on SCALP only\n• Condition mid-lengths to ends\n• Co-wash (conditioner-only) between shampoos if needed\n\nAdjust if:\n• Oily scalp: 3 times per week\n• Normal scalp: 2-3 times per week\n• Dry scalp: 2 times per week\n• Product buildup: Clarify monthly\n\nIMPORTANT:\n✓ Use gentle, sulfate-free formulas\n✓ Avoid over-washing (causes frizz)\n✓ Let waves air dry when possible";
const coilyWashFrequencyResponse = "How often to SHAMPOO for COILY/KINKY hair (Type 4):\n\nFrequency: Once a week or less (every 7-10 days)\n\nWhy least frequent?\n• Coily hair is the driest hair type\n• Natural oils rarely reach the ends\n• Needs maximum moisture retention\n• Over-washing causes severe dryness and breakage\n\nBest practices:\n• ALWAYS sulfate-free, moisturizing shampoo\n• Pre-poo (oil treatment) before shampooing\n• Focus shampoo ONLY on scalp\n• NEVER shampoo the lengths (too drying)\n• Deep condition every wash\n• Use gentle, hydrating formulas\n\nAdjust if:\n• Very oily scalp: Every 5-7 days\n• Normal scalp: Once a week\n• Dry scalp: Every 10-14 days\n• Protective styles: May go 2 weeks between\n• Product buildup: Clarify monthly (gentle formula)\n\nIMPORTANT:\n❌ Never wash more than 2x per week\n✓ Pre-poo with oils before washing\n✓ Always deep condition after shampooing\n✓ Use warm (not hot) water\n✓ Follow with leave-in conditioner";

const createScriptedHandlers = () => {
  const handlers: Record<string, ScriptedHandler> = {};
  const register = (phrases: string[], handler: ScriptedHandler) => {
    phrases.forEach(phrase => {
      const key = normalizeQuestion(phrase);
      if (key.length > 0) {
        handlers[key] = handler;
      }
    });
  };

  register(['hi', 'hello', 'hey', 'hi there', 'hello there'], () => greetingResponse);
  register(['thank you', 'thanks', 'ty'], () => gratitudeResponse);
  register(['bye', 'goodbye', 'see you later', 'talk later', 'see you soon'], () => farewellResponse);

  register(['are natural remedies better than commercial products', 'are natural remedies better than market products'], () => naturalVsCommercialResponse);
  register(['can you suggest local ph brands', 'do you recommend local ph brands', 'do you have local ph brands'], () => getLocalBrandResponse());
  register(['can i mix different hair product brands', 'can i mix different brands', 'is it safe to mix different hair product brands'], () => mixingBrandsResponse);
  register(['will the recommended products work for my hair', 'will the recommended products work'], () => productVariationResponse);
  register(['do i have to use the recommended products', 'do i need to use the recommended products', 'am i required to use the recommended products'], () => requiredProductsResponse);
  register(['why is my hair falling out', 'why is my hair shedding'], () => hairFallCausesResponse);
  register(['is this breakage or hair shedding', 'is my hair breaking or shedding'], () => breakageVsSheddingResponse);
  register(['how can i tell if my hair is dry or just frizzy', 'what is the difference between dry and frizzy hair'], () => dryVsFrizzyResponse);
  register(['why does my scalp itch or get flaky', 'what causes scalp itching', 'why is my scalp itchy'], () => scalpItchResponse);
  register(['what products are best for my hair type'], () => productBestForHairTypeResponse);
  register(['what shampoo should i use', 'what shampoo should i use for my hair'], () => shampooGeneralResponse);
  register(['what conditioner works best for my hair type', 'what conditioner should i use'], () => conditionerGeneralResponse);
  register(['is this product safe for colored hair', 'is this product safe for colour treated hair'], () => colorSafeResponse);
  register(['whats the best oil for dry scalp', 'what is the best oil for dry scalp'], () => getDryScalpOilResponse());
  register(['do you have products for hair fall', 'what products help with hair fall'], () => getHairFallProductsResponse());
  register(['what products help with dandruff', 'do you have products for dandruff'], () => getDandruffProductsResponse());
  register(['should i use sulfate free shampoo', 'should i use sulfatefree shampoo'], () => sulfateShampooResponse);
  register(['is sulfate free better', 'is sulfatefree better'], () => sulfateFreeResponse);
  register(['is tea tree oil good for my scalp'], () => teaTreeResponseDetailed);
  register(['whats a good clarifying shampoo', 'what is a good clarifying shampoo'], () => clarifyingResponse);
  register(['any products for oily scalp', 'do you have products for oily scalp'], () => getOilyScalpProductsResponse());
  register(['how does your ai analyze my hair', 'how do you analyze my hair'], () => aiAnalysisResponse);
  register(['is my photo stored', 'are my photos stored'], () => photoStoredResponse);
  register(['how do i retake my analysis', 'how can i retake my analysis'], () => retakeAnalysisResponse);
  register(['can the app detect scalp problems', 'can your app detect scalp problems'], () => scalpDetectionResponse);
  register(['why did my analysis result change'], () => resultChangeResponse);
  register(['how accurate is mobilenet', 'how accurate is your ai'], () => accuracyResponse);
  register(['do you guarantee product effectiveness'], () => guaranteeResponse);
  register(['are your recommendations hair expert approved'], () => expertApprovalResponse);
  register(['what ingredients should i avoid'], () => ingredientsToAvoidResponse);
  register(['will the recommended products work for my hair'], () => productEffectivenessResponse);
  register(['what ingredients help hair grow'], () => productIngredientResponse);
  register(['can you suggest where to buy local products', 'where can i buy local products'], () => whereToBuyLocalResponse);
  register(['what natural remedies help with hair loss'], () => naturalRemedyHairLossResponse);
  register(['what natural remedies help with breakage'], () => naturalRemedyBreakageResponse);
  register(['what natural remedies help with color damage', 'what natural remedies help with colour damage'], () => naturalRemedyColorDamageResponse);
  register(['what natural ingredients can i use'], () => naturalIngredientsResponse);
  register(['how often should i wash curly hair', 'how often should i wash my curly hair'], () => curlyWashFrequencyResponse);
  register(['how often should i shampoo'], () => shampooFrequencyGeneralResponse);
  register(['how often should i deep condition', 'should i deep condition weekly'], () => deepConditionResponse);
  register(['how often should i wash my hair'], () => washingFrequencyResponse);
  register(['how do i maintain a healthy scalp', 'how to maintain a healthy scalp'], () => healthyScalpResponse);
  register(['should i trim my hair every month'], () => trimmingFrequencyResponse);
  register(['how to prevent sun damage', 'how do i prevent sun damage'], () => sunProtectionResponse);
  register(['how to protect hair from pollution'], () => pollutionResponse);
  register(['how to care for hair after swimming'], () => swimmingCareResponse);
  register(['does diet affect hair health'], () => dietResponse);
  register(['how to care for hair after gym', 'how do i care for hair after gym'], () => gymResponse);
  register(['how to know if my hair is healthy'], () => healthyVsDamagedResponse);
  register(['how to test hair health'], () => hairHealthTestsResponse);
  register(['what is keratin and is it good for hair', 'what is keratin'], () => keratinResponse);
  register(['what is hyaluronic acid for hair', 'what is hyaluronic acid'], () => hyaluronicResponse);
  register(['what is the best routine for my hair type'], () => bestRoutineGeneralResponse);
  register(['what is the best routine for straight hair'], () => getRoutineResponse('Straight'));
  register(['what is the best routine for wavy hair', 'whats the best routine for wavy hair'], () => getRoutineResponse('Wavy'));
  register(['what is the best routine for curly hair'], () => getRoutineResponse('Curly'));
  register(['what is the best routine for kinky hair', 'what is the best routine for coily hair'], () => getRoutineResponse('Kinky'));
  register(['how to care for straight hair', 'how do i take care of straight hair'], () => getHairTypeCareResponse('Straight'));
  register(['how to care for wavy hair', 'how do i care for wavy hair'], () => getHairTypeCareResponse('Wavy'));
  register(['how to care for curly hair', 'how do i care for curly hair'], () => getHairTypeCareResponse('Curly'));
  register(['how to care for kinky or coily hair', 'how do i care for kinky hair', 'how do i care for coily hair'], () => coilyCareResponse);
  register(['how can i take care of color damaged hair', 'how to care for color damaged hair'], () => colorDamageCareResponse);
  register(['what should i do if my hair is damaged', 'what to do if my hair is damaged'], () => damageActionResponse);
  register(['what causes hair breakage'], () => breakageCausesResponse);
  register(['what natural remedies help with color damage'], () => naturalRemedyColorDamageResponse);
  register(['how to refresh curls without washing'], () => refreshCurlsResponse);
  register(['what is my hair type'], () => hairTypeOverviewResponse);
  register(['what is hyaluronic acid for hair'], () => hyaluronicResponse);
  register(['should i use hair oil before or after shower'], () => oilUsageResponse);
  register(['should i air dry or blow dry'], () => dryingResponse);
  register(['how do i style my natural waves', 'how to style natural waves'], () => stylingWavesResponse);
  register(['how to fix greasy hair quickly'], () => greasyHairFixResponse);
  register(['does trimming help hair grow faster'], () => trimmingMythResponse);
  register(['how to care for hair after gym'], () => gymResponse);
  register(['how to care for hair in summer vs winter'], () => seasonalCareResponse);
  register(['what natural remedies help with color damage'], () => naturalRemedyColorDamageResponse);
  register(['what natural remedies help with breakage'], () => naturalRemedyBreakageResponse);
  register(['what natural remedies can i use'], () => naturalIngredientsResponse);
  register(['how to care for hair after swimming'], () => swimmingCareResponse);
  register(['what ingredients should i avoid'], () => ingredientsToAvoidResponse);
  register(['how to care for hair after gym'], () => gymResponse);
  register(['how to care for hair after swimming'], () => swimmingCareResponse);
  register(['what natural remedies help with hair loss'], () => naturalRemedyHairLossResponse);
  register(['how do i take care of straight hair'], () => getHairTypeCareResponse('Straight'));
  register(['how do i take care of wavy hair'], () => getHairTypeCareResponse('Wavy'));
  register(['how do i take care of curly hair'], () => getHairTypeCareResponse('Curly'));
  register(['how do i take care of kinky hair'], () => coilyCareResponse);
  register(['how to protect hair from pollution'], () => pollutionResponse);
  register(['what ingredients help hair grow'], () => productIngredientResponse);
  register(['how accurate is mobilenet'], () => accuracyResponse);
  register(['why did my analysis result change'], () => resultChangeResponse);
  register(['can the app detect scalp problems'], () => scalpDetectionResponse);
  register(['how do i retake my analysis'], () => retakeAnalysisResponse);
  register(['how does your ai analyze my hair'], () => aiAnalysisResponse);
  register(['is my photo stored'], () => photoStoredResponse);
  register(['do you guarantee product effectiveness'], () => guaranteeResponse);
  register(['are your recommendations hair expert approved'], () => expertApprovalResponse);

  return handlers;
};

const scriptedHandlers = createScriptedHandlers();

export default function ChatbotScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [showWelcome, setShowWelcome] = useState(true);
  const [isThinking, setIsThinking] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // Get random example questions (3 at a time)
  const getRandomQuestions = (count: number = 3): string[] => {
    const shuffled = [...exampleQuestions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages, isThinking]);

  const getScriptedResponse = (userQuestion: string): string | null => {
    const lowerQuestion = userQuestion.toLowerCase().trim();
    const normalizedQuestion = normalizeQuestion(userQuestion);

    if (lowerQuestion.length < 3) {
      return "I can't understand your question or your question is not related to the app.";
    }

    if (lowerQuestion === 'hello' || lowerQuestion === 'hi' || lowerQuestion === 'hey' || lowerQuestion.startsWith('hello ') || lowerQuestion.startsWith('hi ') || lowerQuestion.startsWith('hey ')) {
      return "Hello! I'm here to help you with hair care tips, hair types, and hair health questions. What would you like to know?";
    }

    if (lowerQuestion.includes('thank you') || lowerQuestion.includes('thanks') || lowerQuestion === 'ty') {
      return "You're welcome! Happy to help with your hair care journey! Feel free to ask more questions anytime.";
    }

    if (lowerQuestion === 'bye' || lowerQuestion === 'goodbye' || lowerQuestion.includes('see you') || lowerQuestion.includes('talk later')) {
      return "Goodbye! Take care of your hair! Come back anytime you have questions.";
    }

    if ((lowerQuestion.includes('natural') || lowerQuestion.includes('organic') || lowerQuestion.includes('remedies') || lowerQuestion.includes('remedy')) && (lowerQuestion.includes('better') || lowerQuestion.includes('work') || lowerQuestion.includes('vs') || lowerQuestion.includes('versus') || lowerQuestion.includes('market') || lowerQuestion.includes('product'))) {
      return "Natural remedies vs. commercial products:\n\nNot necessarily better, just different!\n\nNatural remedies:\n• Fewer chemicals\n• Budget-friendly\n• May take longer to see results\n• Can be messy\n\nCommercial products:\n• Scientifically formulated\n• Convenient\n• Can contain harsh ingredients\n• More expensive\n\nIt really depends on YOUR preference! Both can work well when chosen correctly for your hair type.";
    }

    // Local PH brands (MUST come before mixing brands handler to avoid false matches)
    if ((lowerQuestion.includes('local') || lowerQuestion.includes('ph') || lowerQuestion.includes('philippine') || lowerQuestion.includes('filipino')) && 
        (lowerQuestion.includes('brand') || lowerQuestion.includes('product') || lowerQuestion.includes('suggest'))) {
      const products = recommendProducts({ limit: 50 });
      const localBrands = products.filter(p => p.isLocal === true);
      
      // Get unique brand names
      const brandNames = new Set<string>();
      localBrands.forEach(p => {
        if (p.name.toLowerCase().includes('kathare')) {
          brandNames.add('Kathare');
        } else if (p.name.toLowerCase().includes('zenutrients')) {
          brandNames.add('Zenutrients');
        } else if (p.name.toLowerCase().includes('human nature')) {
          brandNames.add('Human Nature');
        } else if (p.name.toLowerCase().includes('hairreve')) {
          brandNames.add('HairReve');
        }
      });
      
      const brandList = Array.from(brandNames);
      if (brandList.length > 0) {
        return `Yes! We recommend local Philippine brands like ${brandList.join(', ')}, and more brands that are local in our product recommendations. Take a hair scan to get personalized recommendations from these local brands!`;
      }
      
      return "Yes! We recommend local Philippine brands like Kathare, Zenutrients, and more brands that are local in our product recommendations. Take a hair scan to get personalized recommendations from these local brands!";
    }

    // Mixing brands (check before product recommendations accuracy to avoid false matches)
    if ((lowerQuestion.includes('brand') || lowerQuestion.includes('different brand') || lowerQuestion.includes('mix')) && 
        (lowerQuestion.includes('okay') || lowerQuestion.includes('ok') || lowerQuestion.includes('safe') || lowerQuestion.includes('use') || lowerQuestion.includes('can'))) {
      return "Absolutely. Focus on the ingredients and benefits, not the brand. Mixing brands is common and safe.";
    }

    // Product recommendations accuracy and variation (exclude mixing brands questions)
    if ((lowerQuestion.includes('recommended') || lowerQuestion.includes('recommend') || lowerQuestion.includes('suggestion') || lowerQuestion.includes('product')) && 
        !lowerQuestion.includes('mix') && !lowerQuestion.includes('brand') &&
        (lowerQuestion.includes('vary') || lowerQuestion.includes('varying') || lowerQuestion.includes('work for everyone') || lowerQuestion.includes('work for all') || lowerQuestion.includes('surely work') || lowerQuestion.includes('surely') || (lowerQuestion.includes('work') && (lowerQuestion.includes('recommended') || lowerQuestion.includes('recommend') || lowerQuestion.includes('product'))) || lowerQuestion.includes('accurate') || lowerQuestion.includes('accuracy') || lowerQuestion.includes('personalized') || lowerQuestion.includes('personal') || lowerQuestion.includes('unique') || lowerQuestion.includes('different'))) {
      return "Every person's hair is unique, so results may vary. The products we recommend are based on your hair condition and common effective ingredients, but they may not work the same for everyone. We encourage you to observe how your hair responds and adjust as needed. If concerns persist, consulting a haircare professional or dermatologist may provide more personalized guidance.";
    }

    // Required to use recommended products
    if ((lowerQuestion.includes('required') || lowerQuestion.includes('must') || lowerQuestion.includes('have to')) && 
        (lowerQuestion.includes('recommended') || lowerQuestion.includes('recommend') || lowerQuestion.includes('suggestion') || lowerQuestion.includes('product'))) {
      return "No! The recommended products are suggestions based on your hair analysis. You can choose to use them or explore other options that suit your preferences and budget.";
    }

    // Hair fall/shedding questions - specific causes
    if ((lowerQuestion.includes('hair falling') || lowerQuestion.includes('hair fall') || lowerQuestion.includes('hair loss') || lowerQuestion.includes('shedding') || lowerQuestion.includes('thinning')) && 
        (lowerQuestion.includes('why') || lowerQuestion.includes('cause') || lowerQuestion.includes('reason') || lowerQuestion.includes('what'))) {
      return "HAIR LOSS causes:\n\nCommon causes:\n• Stress and hormonal changes (pregnancy, menopause, thyroid)\n• Nutritional deficiencies (iron, protein, vitamins)\n• Tight hairstyles (pulling on follicles)\n• Scalp conditions (dandruff, infections)\n• Genetics and aging\n• Medical conditions or medications\n• Excessive heat styling\n\nRecovery:\n• Address underlying health issues\n• Improve nutrition (protein, iron, biotin)\n• Avoid tight hairstyles\n• Use gentle hair care products\n• Scalp massages to improve circulation\n• Consider natural remedies (rosemary oil, peppermint oil)\n• Consult a professional if persistent\n\nIf shedding persists for more than 3 months, consult a dermatologist.";
    }

    // Breakage vs shedding
    if ((lowerQuestion.includes('breakage') || lowerQuestion.includes('breaking')) && 
        (lowerQuestion.includes('shedding') || lowerQuestion.includes('falling') || lowerQuestion.includes('difference'))) {
      return "If the fallen strand has a tiny white bulb at the end, it's shedding. If there's no bulb and the piece is shorter or uneven, that's breakage.";
    }

    // Dry vs frizzy hair
    if ((lowerQuestion.includes('dry') || lowerQuestion.includes('frizzy') || lowerQuestion.includes('frizz')) && 
        (lowerQuestion.includes('tell') || lowerQuestion.includes('know') || lowerQuestion.includes('difference') || lowerQuestion.includes('vs') || lowerQuestion.includes('versus'))) {
      return "Dry hair lacks moisture and feels rough along the entire strand. Frizz is more about surface texture—your hair may actually be healthy but lacking smoothness.";
    }

    // Scalp itching/flaking
    if ((lowerQuestion.includes('scalp') || lowerQuestion.includes('itch') || lowerQuestion.includes('itchy') || lowerQuestion.includes('flaky') || lowerQuestion.includes('flake')) && 
        (lowerQuestion.includes('why') || lowerQuestion.includes('cause') || lowerQuestion.includes('reason'))) {
      return "This may be due to product buildup, dryness, or dandruff. Using gentle exfoliating or clarifying products may help. If redness or irritation persists, consult a specialist.";
    }

    // Best products for hair type
    if ((lowerQuestion.includes('best') || lowerQuestion.includes('good') || lowerQuestion.includes('recommend') || lowerQuestion.includes('product')) && 
        (lowerQuestion.includes('product') || lowerQuestion.includes('shampoo') || lowerQuestion.includes('conditioner')) && 
        (lowerQuestion.includes('hair type') || lowerQuestion.includes('my hair') || lowerQuestion.includes('straight') || lowerQuestion.includes('wavy') || lowerQuestion.includes('curly') || lowerQuestion.includes('coily'))) {
      
      // Detect hair type from question or context
      let detectedHairType: string | undefined;
      if (lowerQuestion.includes('straight') || lowerQuestion.includes('type 1')) {
        detectedHairType = 'Straight';
      } else if (lowerQuestion.includes('wavy') || lowerQuestion.includes('type 2')) {
        detectedHairType = 'Wavy';
      } else if (lowerQuestion.includes('curly') || lowerQuestion.includes('type 3')) {
        detectedHairType = 'Curly';
      } else if (lowerQuestion.includes('coily') || lowerQuestion.includes('kinky') || lowerQuestion.includes('type 4')) {
        detectedHairType = 'Coily';
      }
      
      if (detectedHairType) {
        const products = recommendProducts({ hairType: detectedHairType, limit: 10 });
        if (products.length > 0) {
          let response = `Recommended products for ${detectedHairType} hair:\n\n`;
          products.forEach((product, index) => {
            response += `${index + 1}. ${product.name}\n`;
          });
          return response;
        }
      }
      
      return "Recommendations will depend on your hair type and current condition. Please specify your hair type (Straight, Wavy, Curly, or Coily) for personalized product recommendations.";
    }

    // Ingredients to avoid
    if ((lowerQuestion.includes('ingredient') || lowerQuestion.includes('avoid') || lowerQuestion.includes('bad') || lowerQuestion.includes('harmful')) && 
        (lowerQuestion.includes('should') || lowerQuestion.includes('what') || lowerQuestion.includes('which'))) {
      return "Avoid harsh sulfates if your hair is color-treated or dry. Avoid heavy oils if you have an oily or sensitive scalp.";
    }

    // Will recommended products work
    if ((lowerQuestion.includes('recommended') || lowerQuestion.includes('recommend') || lowerQuestion.includes('suggestion')) && 
        (lowerQuestion.includes('work') || lowerQuestion.includes('effective') || lowerQuestion.includes('help'))) {
      return "Every person's hair reacts differently. We provide recommendations based on best-fitting ingredients and hair condition, but results may vary.";
    }

    // Sulfate-free
    if (lowerQuestion.includes('sulfate') && (lowerQuestion.includes('free') || lowerQuestion.includes('better') || lowerQuestion.includes('good'))) {
      return "Sulfate-free is gentler and ideal for colored or dry hair. If you have oily or buildup-prone scalp, occasional sulfates are fine.";
    }

    // Keratin
    if (lowerQuestion.includes('keratin') && (lowerQuestion.includes('good') || lowerQuestion.includes('bad') || lowerQuestion.includes('damage'))) {
      return "Good in moderation—it strengthens hair. Overuse can make hair stiff or brittle.";
    }

    // Hyaluronic acid
    if (lowerQuestion.includes('hyaluronic') && (lowerQuestion.includes('acid') || lowerQuestion.includes('do') || lowerQuestion.includes('what'))) {
      return "Hyaluronic acid attracts moisture, helping keep hair hydrated and soft.";
    }

    // Tea tree oil
    if (lowerQuestion.includes('tea tree') && (lowerQuestion.includes('safe') || lowerQuestion.includes('scalp') || lowerQuestion.includes('oil'))) {
      return "Yes, but use diluted products. Tea tree helps with dandruff and oiliness.";
    }

    // Hair growth ingredients
    if ((lowerQuestion.includes('ingredient') || lowerQuestion.includes('help')) && 
        (lowerQuestion.includes('growth') || lowerQuestion.includes('grow') || lowerQuestion.includes('longer'))) {
      return "Caffeine, rosemary, peptides, and niacinamide support scalp circulation and stronger growth.";
    }

    // Where to buy products
    if ((lowerQuestion.includes('buy') || lowerQuestion.includes('purchase') || lowerQuestion.includes('where') || lowerQuestion.includes('get')) && 
        (lowerQuestion.includes('product') || lowerQuestion.includes('recommend'))) {
      return "Product links or purchasing options will be shown after recommendations, based on availability.";
    }

    // Personalized suggestions
    if ((lowerQuestion.includes('personalized') || lowerQuestion.includes('personal') || lowerQuestion.includes('suggestion') || lowerQuestion.includes('recommend')) && 
        (lowerQuestion.includes('are') || lowerQuestion.includes('is') || lowerQuestion.includes('custom'))) {
      return "Yes — we match product types and routines based on your hair condition.";
    }

    // What shampoo should I use?
    if ((lowerQuestion.includes('what') || lowerQuestion.includes('which')) && 
        lowerQuestion.includes('shampoo') && 
        (lowerQuestion.includes('should') || lowerQuestion.includes('use') || lowerQuestion.includes('recommend'))) {
      
      let detectedHairType: string | undefined;
      if (lowerQuestion.includes('straight') || lowerQuestion.includes('type 1')) {
        detectedHairType = 'Straight';
      } else if (lowerQuestion.includes('wavy') || lowerQuestion.includes('type 2')) {
        detectedHairType = 'Wavy';
      } else if (lowerQuestion.includes('curly') || lowerQuestion.includes('type 3')) {
        detectedHairType = 'Curly';
      } else if (lowerQuestion.includes('coily') || lowerQuestion.includes('kinky') || lowerQuestion.includes('type 4')) {
        detectedHairType = 'Coily';
      }
      
      if (detectedHairType) {
        const products = recommendProducts({ hairType: detectedHairType, limit: 10 });
        const shampoos = products.filter(p => p.productType === 'Shampoo');
        if (shampoos.length > 0) {
          let response = `Recommended shampoos for ${detectedHairType} hair:\n\n`;
          shampoos.forEach((product, index) => {
            response += `${index + 1}. ${product.name}\n   ${product.description}\n\n`;
          });
          return response;
        }
      }
      
      return "Based on your hair analysis, I can recommend personalized shampoos! Please take a hair scan first, or let me know your hair type (Straight, Wavy, Curly, or Coily) for recommendations.";
    }

    // What conditioner works best?
    if ((lowerQuestion.includes('what') || lowerQuestion.includes('which')) && 
        lowerQuestion.includes('conditioner') && 
        (lowerQuestion.includes('best') || lowerQuestion.includes('work') || lowerQuestion.includes('recommend') || lowerQuestion.includes('use'))) {
      
      let detectedHairType: string | undefined;
      if (lowerQuestion.includes('straight') || lowerQuestion.includes('type 1')) {
        detectedHairType = 'Straight';
      } else if (lowerQuestion.includes('wavy') || lowerQuestion.includes('type 2')) {
        detectedHairType = 'Wavy';
      } else if (lowerQuestion.includes('curly') || lowerQuestion.includes('type 3')) {
        detectedHairType = 'Curly';
      } else if (lowerQuestion.includes('coily') || lowerQuestion.includes('kinky') || lowerQuestion.includes('type 4')) {
        detectedHairType = 'Coily';
      }
      
      if (detectedHairType) {
        const products = recommendProducts({ hairType: detectedHairType, limit: 10 });
        const conditioners = products.filter(p => p.productType === 'Conditioner');
        if (conditioners.length > 0) {
          let response = `Recommended conditioners for ${detectedHairType} hair:\n\n`;
          conditioners.forEach((product, index) => {
            response += `${index + 1}. ${product.name}\n   ${product.description}\n\n`;
          });
          return response;
        }
      }
      
      return "Based on your hair analysis, I can recommend personalized conditioners! Please take a hair scan first, or let me know your hair type (Straight, Wavy, Curly, or Coily) for recommendations.";
    }


    // Safe for colored hair
    if ((lowerQuestion.includes('safe') || lowerQuestion.includes('good')) && 
        (lowerQuestion.includes('color') || lowerQuestion.includes('colored') || lowerQuestion.includes('coloured') || lowerQuestion.includes('dyed')) && 
        lowerQuestion.includes('hair') &&
        (lowerQuestion.includes('product') || lowerQuestion.includes('this'))) {
      return "For color-treated hair, look for:\n\n✓ Sulfate-free products (sulfates strip color)\n✓ Products labeled 'color-safe' or 'color-protecting'\n✓ UV protection ingredients\n✓ Gentle, moisturizing formulas\n\nOur app recommends color-safe products based on your hair analysis. Avoid products with harsh sulfates, alcohols, or clarifying ingredients that can fade your color faster.";
    }

    // Best oil for dry scalp
    if ((lowerQuestion.includes('best') || lowerQuestion.includes('good') || lowerQuestion.includes('recommend')) && 
        lowerQuestion.includes('oil') && 
        (lowerQuestion.includes('dry scalp') || (lowerQuestion.includes('dry') && lowerQuestion.includes('scalp')))) {
      const products = recommendProducts({ scalpCondition: 'Dry Scalp', limit: 10 });
      const oils = products.filter(p => p.productType === 'Hair Oil');
      
      let response = "Best oils for DRY SCALP:\n\n";
      
      if (oils.length > 0) {
        oils.forEach((product, index) => {
          response += `${index + 1}. ${product.name}\n   ${product.description}\n\n`;
        });
      } else {
        response += "Natural oils that help:\n• Jojoba oil (similar to scalp's natural oils)\n• Coconut oil (deep moisture)\n• Argan oil (lightweight, non-greasy)\n• Tea tree oil (soothes irritation, use diluted)\n• Olive oil (rich moisture)\n\nHow to use:\n- Apply to scalp, massage gently\n- Leave for 30 min to overnight\n- Wash with gentle shampoo\n- Use 1-2x per week\n\n";
      }
      
      response += "Take a hair scan for personalized product recommendations!";
      return response;
    }

    // Products for hair fall
    if ((lowerQuestion.includes('product') || lowerQuestion.includes('help')) && 
        (lowerQuestion.includes('hair fall') || lowerQuestion.includes('hair loss') || lowerQuestion.includes('falling') || lowerQuestion.includes('shedding'))) {
      const products = recommendProducts({ hairDamage: 'Hair Loss', limit: 10 });
      const filtered = products.filter(p => 
        p.description.toLowerCase().includes('hair loss') || 
        p.description.toLowerCase().includes('strengthen') ||
        p.description.toLowerCase().includes('growth')
      );
      
      let response = "Products for HAIR FALL/LOSS:\n\n";
      
      if (filtered.length > 0) {
        filtered.slice(0, 5).forEach((product, index) => {
          response += `${index + 1}. ${product.name}\n   ${product.description}\n\n`;
        });
      }
      
      response += "Look for products with:\n• Biotin (strengthens hair)\n• Caffeine (stimulates growth)\n• Niacinamide (improves scalp circulation)\n• Rosemary oil (promotes growth)\n• Peptides (strengthens follicles)\n\nConsider natural remedies: Rosemary oil, Peppermint oil, and scalp massages. Check our Natural Remedies section!\n\nIf hair loss persists, consult a dermatologist.";
      return response;
    }

    // Products for dandruff
    if ((lowerQuestion.includes('product') || lowerQuestion.includes('help') || lowerQuestion.includes('best')) && 
        lowerQuestion.includes('dandruff')) {
      const products = recommendProducts({ scalpCondition: 'Dandruff', limit: 10 });
      const dandruffProducts = products.filter(p => p.productType === 'Shampoo');
      
      let response = "Products for DANDRUFF:\n\n";
      
      if (dandruffProducts.length > 0) {
        dandruffProducts.slice(0, 5).forEach((product, index) => {
          response += `${index + 1}. ${product.name}\n   ${product.description}\n\n`;
        });
      }
      
      response += "Look for active ingredients:\n• Zinc Pyrithione (reduces fungus)\n• Ketoconazole (antifungal)\n• Salicylic Acid (exfoliates flakes)\n• Tea Tree Oil (natural antifungal)\n• Selenium Sulfide (reduces flakes)\n\nTips:\n- Massage shampoo into scalp for 3-5 minutes\n- Use 2-3x per week\n- Avoid scratching scalp\n- Keep scalp moisturized\n\nTake a hair scan to get personalized dandruff-fighting products!";
      return response;
    }

    // Should I use sulfate-free shampoo
    if (lowerQuestion.includes('sulfate') && 
        (lowerQuestion.includes('should') || lowerQuestion.includes('use') || lowerQuestion.includes('need')) && 
        lowerQuestion.includes('shampoo')) {
      return "Should you use sulfate-free shampoo?\n\nYES, if you have:\n• Color-treated hair (sulfates strip color)\n• Dry or damaged hair\n• Curly or coily hair (naturally drier)\n• Sensitive scalp\n• Chemically treated hair\n\nOCCASIONALLY OK if you have:\n• Very oily scalp\n• Heavy product buildup\n• Active lifestyle (lots of sweating)\n\nWhy sulfate-free?\n• Gentler on hair and scalp\n• Preserves natural oils\n• Reduces frizz\n• Maintains color longer\n• Less irritating\n\nBest practice: Use sulfate-free for daily washing, clarifying shampoo (with sulfates) once a month for deep cleansing.\n\nTake a hair scan to get personalized recommendations!";
    }

    // Is tea tree oil good for scalp
    if (lowerQuestion.includes('tea tree') && 
        (lowerQuestion.includes('good') || lowerQuestion.includes('safe') || lowerQuestion.includes('help') || lowerQuestion.includes('use')) && 
        (lowerQuestion.includes('scalp') || lowerQuestion.includes('my'))) {
      return "YES! Tea tree oil is EXCELLENT for scalp health!\n\nBenefits:\n• Antifungal properties (fights dandruff)\n• Reduces oiliness\n• Soothes itchy, irritated scalp\n• Unclogs hair follicles\n• Natural antiseptic\n\nIMPORTANT: Always dilute!\n• Add 5-10 drops to 1 oz carrier oil (coconut, jojoba)\n• Or use products that already contain tea tree oil\n• NEVER apply undiluted (can cause irritation)\n\nHow to use:\n1. Mix with carrier oil\n2. Massage into scalp\n3. Leave for 15-30 minutes\n4. Wash with gentle shampoo\n5. Use 1-2x per week\n\nBest for:\n• Oily scalp\n• Dandruff\n• Scalp acne\n• Itchy scalp\n\nDo a patch test first to check for allergies!";
    }

    // Good clarifying shampoo
    if ((lowerQuestion.includes('good') || lowerQuestion.includes('best') || lowerQuestion.includes('recommend')) && 
        lowerQuestion.includes('clarifying') && 
        lowerQuestion.includes('shampoo')) {
      return "Clarifying shampoo recommendations:\n\nWhat is clarifying shampoo?\n• Deep-cleansing formula\n• Removes product buildup\n• Cleanses impurities\n• Resets hair\n\nWhen to use:\n• Once a month (or every 2-4 weeks)\n• After heavy product use\n• Before deep treatments\n• When hair feels heavy/greasy\n\nLook for ingredients:\n• Salicylic acid (exfoliates)\n• Apple cider vinegar (balances pH)\n• Charcoal (absorbs impurities)\n• Tea tree oil (deep clean)\n\nIMPORTANT:\n❌ Don't use too often (strips natural oils)\n❌ Not ideal for color-treated hair (fades color)\n✓ Always deep condition after\n✓ Use lukewarm water\n\nFor specific product recommendations based on your hair type, take a hair scan!";
    }

    // Products for oily scalp
    if ((lowerQuestion.includes('product') || lowerQuestion.includes('help') || lowerQuestion.includes('best') || lowerQuestion.includes('any')) && 
        (lowerQuestion.includes('oily scalp') || (lowerQuestion.includes('oily') && lowerQuestion.includes('scalp')))) {
      const products = recommendProducts({ scalpCondition: 'Oily Scalp', limit: 10 });
      const oilyScalpProducts = products.filter(p => p.productType === 'Shampoo');
      
      let response = "Products for OILY SCALP:\n\n";
      
      if (oilyScalpProducts.length > 0) {
        oilyScalpProducts.slice(0, 5).forEach((product, index) => {
          response += `${index + 1}. ${product.name}\n   ${product.description}\n\n`;
        });
      }
      
      response += "Look for:\n• Clarifying shampoos (use weekly)\n• Tea tree oil products (controls oil)\n• Salicylic acid (exfoliates scalp)\n• Zinc products (regulates oil)\n• Lightweight, volumizing formulas\n\nTips for oily scalp:\n- Wash 2-3x per week (not daily!)\n- Focus shampoo on SCALP only\n- Use dry shampoo between washes\n- Avoid heavy conditioners on roots\n- Rinse with cool water\n\nTake a hair scan for personalized oily scalp recommendations!";
      return response;
    }

    // Seasonal care (check before "how hair analysis" to avoid false matches)
    if ((lowerQuestion.includes('summer') || lowerQuestion.includes('winter')) && lowerQuestion.includes('care')) {
      return "Seasonal hair care:\n\nSUMMER:\n• UV protection (hats, UV sprays)\n• When planning to swim, use hair products with UV protection before diving into swimming pools or salt water so your hair still has protection\n• Deep conditioning weekly\n• Rinse after swimming\n• Avoid excessive heat styling\n\nWINTER:\n• Extra moisture (oils, masks)\n• Protect from cold wind\n• Humidifier indoors\n• Avoid hot water washes\n\nAdjust your routine with the seasons!";
    }

    // How to care for kinky or coily hair? (MUST come before AI handler to avoid false matches)
    if ((lowerQuestion.includes('how to care') || lowerQuestion.includes('how do i care') || lowerQuestion.includes('care for')) && 
        (lowerQuestion.includes('kinky') || lowerQuestion.includes('coily')) &&
        lowerQuestion.includes('hair')) {
      return "How to care for KINKY/COILY hair (Type 4):\n\nWASH ROUTINE:\n• Frequency: Once a week or less (every 7-10 days)\n• ALWAYS sulfate-free, moisturizing shampoo\n• Pre-poo (oil treatment) before shampooing\n• Focus shampoo ONLY on scalp\n• NEVER shampoo the lengths (too drying)\n• Deep condition every wash (mandatory)\n\nCONDITIONING:\n• ALWAYS deep condition after shampooing\n• Leave-in conditioner DAILY (critical!)\n• Condition mid-lengths to ends generously\n• Use rich, buttery conditioners\n• Moisturize and seal daily\n\nDETANGLING:\n• ONLY detangle when WET (with conditioner)\n• Use fingers first (gentlest method)\n• Wide-tooth comb as backup\n• Start from ends, work up VERY gently\n• Section hair into 4-6 parts\n• Work in small sections\n• Take your time (patience prevents breakage)\n\nSTYLING:\n• Apply products to wet/damp hair\n• Use LOC method (Liquid, Oil, Cream)\n• Protective styles (braids, twists, buns)\n• Avoid heat styling when possible\n• Use heat protectant if styling\n\nDRYING:\n• Air dry preferred (no heat damage)\n• Or diffuse on low heat/speed\n• Don't touch while drying\n• Use silk/satin bonnet or pillowcase\n\nMAINTENANCE:\n• Moisturize daily (spray + leave-in)\n• Seal with oils/butters\n• Protective styles at night\n• Sleep on silk/satin pillowcase\n• Trim every 8-12 weeks\n• Gentle handling always\n\nPRODUCT TIPS:\n✓ Rich, buttery conditioners\n✓ Leave-in conditioner daily\n✓ Deep condition every wash\n✓ Oils and butters (coconut, shea, jojoba)\n✓ Avoid lightweight products (not enough moisture)\n\nCOMMON CONCERNS:\n• Dryness → Daily moisture + sealing\n• Breakage → Gentle handling + protein treatments\n• Shrinkage → Normal! Use stretching techniques\n• Tangling → Detangle only when wet with conditioner\n\nFor your COMPLETE coily hair routine:\nTake a hair scan → View Personalized Routine → Get detailed coily hair care instructions!";
    }

    // Color damage care
    if ((lowerQuestion.includes('color') || lowerQuestion.includes('coloured') || lowerQuestion.includes('colored')) && 
        (lowerQuestion.includes('damage') || lowerQuestion.includes('damaged')) && 
        (lowerQuestion.includes('care') || lowerQuestion.includes('take care') || lowerQuestion.includes('fix') || lowerQuestion.includes('repair') || lowerQuestion.includes('treat') || lowerQuestion.includes('how'))) {
      return "How to CARE for COLOR DAMAGED hair:\n\n1. USE COLOR-SAFE PRODUCTS:\n• Sulfate-free shampoos (sulfates strip color)\n• Color-protecting conditioners\n• Products specifically for color-treated hair\n• Look for UV protection in products\n\n2. DEEP CONDITIONING:\n• Weekly deep conditioning treatments\n• Use masks with argan oil, keratin, or amino acids\n• Leave-in conditioners for daily moisture\n• Protein treatments to rebuild strength\n\n3. WASHING HABITS:\n• Wash less frequently (2-3x per week)\n• Use cool/lukewarm water (hot water fades color)\n• Avoid hot styling tools when possible\n• Use heat protectant if styling\n\n4. PROTECTION:\n• UV-protectant hair sprays/serums\n• Wear hats in direct sunlight\n• Avoid chlorine (wear swim cap)\n• Protect from environmental damage\n\n5. AVOID:\n• Frequent color applications\n• Overlapping color treatments\n• Harsh chemical treatments\n• Excessive heat styling\n\n6. RECOVERY TIME:\n• Allow time between color treatments\n• Give hair time to recover\n• Trim damaged ends regularly\n• Be patient - recovery takes time\n\nRemember: Prevention is key! Protect your color-treated hair to maintain its health and vibrancy.";
    }

    // Swimming & hair care (MUST come before AI handler to avoid false matches)
    if ((lowerQuestion.includes('swim') || lowerQuestion.includes('pool') || lowerQuestion.includes('chlorine') || lowerQuestion.includes('ocean') || lowerQuestion.includes('sea')) &&
        (lowerQuestion.includes('hair') || lowerQuestion.includes('care') || lowerQuestion.includes('after'))) {
      return "Swimming & hair care:\n\nCHLORINE/SALT WATER can:\n• Dry out hair\n• Cause color fading\n• Create tangles\n• Strip natural oils\n\nProtection:\n1. Wet hair with clean water first\n2. Apply leave-in conditioner\n3. Wear a swim cap if possible\n4. Rinse IMMEDIATELY after\n5. Deep condition after swimming";
    }

    // How does your AI analyze my hair? (must be specifically about AI/analysis, not general "how to" questions)
    // Use regex for "ai" and "app" to avoid matching words like "hair", "repair", "apply", "happen"
    const isAIQuestion = /\b(ai|bot|model|algorithm|network|mobilenet)\b/.test(lowerQuestion);
    const isAppQuestion = /\b(app|application|system|scanner|tool|technology)\b/.test(lowerQuestion);
    const isAnalysisWord = /\b(analyze|analysis|detect|detection|scan|scanning|identify|classify|classifying|works|function)\b/.test(lowerQuestion);

    if (lowerQuestion.includes('how') && 
        (isAIQuestion || isAppQuestion || lowerQuestion.includes('mobilenet')) &&
        (isAnalysisWord || lowerQuestion.includes('know my') || lowerQuestion.includes('tell my')) &&
        (lowerQuestion.includes('hair') || lowerQuestion.includes('scan')) &&
        !lowerQuestion.includes('care') && !lowerQuestion.includes('wash') && !lowerQuestion.includes('shampoo') && !lowerQuestion.includes('swim') && !lowerQuestion.includes('swimming') && !lowerQuestion.includes('style') && !lowerQuestion.includes('fix') && !lowerQuestion.includes('repair') && !lowerQuestion.includes('take care')) {
      return "How our AI analyzes your hair:\n\n1. IMAGE UPLOAD:\n• You take or upload a photo of your hair\n• The image is preprocessed for analysis\n\n2. AI MODEL (MobileNet):\n• We use a trained MobileNet machine learning model\n• The model analyzes visual patterns in your hair\n• It examines texture, curl pattern, and damage indicators\n\n3. DETECTION:\n• Hair Type Classification (Straight, Wavy, Curly, Kinky)\n• Damage Detection (Breakage, Hair Loss, Color Damage)\n• Confidence scores for each prediction\n\n4. YOUR INPUT:\n• We combine AI results with your scalp condition input\n• This creates a more complete hair profile\n\n5. PERSONALIZED RECOMMENDATIONS:\n• Based on your unique hair profile\n• Products matched to your needs\n• Custom care routines\n• Natural remedy suggestions\n\nOur AI provides quick, convenient analysis, but we always recommend consulting a hair professional for persistent concerns!";
    }

    // Is my photo stored?
    if ((lowerQuestion.includes('photo') || lowerQuestion.includes('picture') || lowerQuestion.includes('image')) && 
        (lowerQuestion.includes('stored') || lowerQuestion.includes('saved') || lowerQuestion.includes('store') || lowerQuestion.includes('save') || lowerQuestion.includes('keep'))) {
      return "Is your photo stored?\n\nYES, your photos are securely stored in Firebase Storage.\n\nWhy we store them:\n• Hair care professionals validate the AI results\n• Ensures accuracy of recommendations\n• Quality control and model improvement\n• Your analysis history\n\nYour Privacy:\n✓ Photos are stored securely\n✓ Used ONLY for educational purposes\n✓ NOT shared with third parties\n✓ NOT used for marketing\n✓ Accessed only by authorized professionals\n✓ Protected by industry-standard security\n\nRest assured: Your photos are safe and used solely to improve your hair care experience and validate AI accuracy.\n\nIf you have privacy concerns, feel free to contact us!";
    }

    // How do I retake my analysis?
    if ((lowerQuestion.includes('retake') || lowerQuestion.includes('redo') || lowerQuestion.includes('again')) && 
        (lowerQuestion.includes('analysis') || lowerQuestion.includes('scan') || lowerQuestion.includes('test'))) {
      return "How to retake your hair analysis:\n\n1. Go to the HOME screen\n2. Tap the CAMERA icon (Capture button)\n3. Choose 'Capture Photo' or 'Upload Image'\n4. Follow the cropping guidelines\n5. Select your scalp condition\n6. Tap 'Analyze'\n\nTips for best results:\n✓ Good lighting (natural light is best)\n✓ Focus on your hair only\n✓ Avoid filters or edits\n✓ Clear, close-up shot\n✓ Show hair texture clearly\n✓ Avoid shadows or glare\n\nYou can retake your analysis as many times as you want! It's helpful to retake periodically to track your hair health progress over time.\n\nCheck your JOURNAL to see your analysis history!";
    }

    // Can the app detect scalp problems?
    if ((lowerQuestion.includes('detect') || lowerQuestion.includes('scan') || lowerQuestion.includes('analyze')) && 
        (lowerQuestion.includes('scalp') && (lowerQuestion.includes('problem') || lowerQuestion.includes('issue') || lowerQuestion.includes('condition') || lowerQuestion.includes('disease')))) {
      return "Can the app detect scalp problems?\n\nNO, our app does NOT detect scalp problems or scalp conditions.\n\nWhat we DETECT:\n✓ Hair Type (Straight, Wavy, Curly, Kinky)\n✓ Hair Damage (Breakage, Hair Loss, Color Damage)\n\nWhat we DON'T detect:\n✗ Scalp diseases\n✗ Medical scalp conditions\n✗ Infections or dermatological issues\n✗ Scalp psoriasis, eczema, etc.\n\nOur main features:\n• Hair type classification\n• Hair damage assessment\n• Product recommendations\n• Hair care routines\n\nFor scalp concerns:\nWe do ask you to INPUT your scalp condition (Oily, Dry, Dandruff, Normal) to provide better product recommendations, but this is YOUR assessment, not AI detection.\n\nIf you have persistent scalp problems, please consult a dermatologist or trichologist!";
    }

    // Why did my analysis result change?
    if ((lowerQuestion.includes('why') || lowerQuestion.includes('how')) && 
        (lowerQuestion.includes('result') || lowerQuestion.includes('analysis')) && 
        (lowerQuestion.includes('change') || lowerQuestion.includes('different') || lowerQuestion.includes('vary'))) {
      return "Why did your analysis result change?\n\nAnalysis results can vary due to:\n\n1. PHOTO QUALITY:\n• Different lighting conditions\n• Camera angle or distance\n• Image clarity and focus\n• Background interference\n\n2. HAIR CONDITION:\n• Your hair health may have actually improved/worsened\n• Different hair sections photographed\n• Styling products on hair\n• Wet vs. dry hair\n\n3. AI MODEL:\n• Confidence levels vary between images\n• Model interprets visual patterns\n• Borderline cases may fluctuate\n\n4. TIME BETWEEN SCANS:\n• Hair condition changes over time\n• Seasonal effects\n• New treatments or products used\n• Environmental factors\n\nFor most consistent results:\n✓ Use similar lighting\n✓ Same time of day\n✓ Clean, product-free hair\n✓ Same hair section\n✓ Clear, focused images\n\nRemember: AI provides guidance, not diagnosis. If results are drastically different, retake the photo with better lighting, or consult a hair professional!";
    }

    // How accurate is MobileNet?
    if ((lowerQuestion.includes('accurate') || lowerQuestion.includes('accuracy')) && 
        (lowerQuestion.includes('mobilenet') || lowerQuestion.includes('model') || lowerQuestion.includes('ai') || lowerQuestion.includes('detection'))) {
      return "How accurate is MobileNet?\n\nOur MobileNet model provides generally reliable hair analysis, but accuracy depends on several factors:\n\nFACTORS AFFECTING ACCURACY:\n• Photo quality (lighting, focus, angle)\n• Image clarity and resolution\n• Hair visibility in the photo\n• Training data quality\n• Borderline cases between categories\n\nWhat to know:\n✓ The model provides confidence scores with each prediction\n✓ Higher confidence = more reliable result\n✓ Works best with clear, well-lit photos\n✓ Trained on diverse hair types and conditions\n\nIMPORTANT:\n• AI is a TOOL, not a replacement for professional assessment\n• Results are guidance, not medical diagnosis\n• Hair care professionals validate our recommendations\n• Use results as a starting point for your hair care journey\n\nFor best accuracy:\n1. Take clear photos in natural light\n2. Focus on hair texture and condition\n3. Retake if confidence score is low\n4. Track results over time\n\nIf you have concerns about accuracy, consult a hair professional or trichologist!";
    }

    // Do you guarantee product effectiveness?
    if ((lowerQuestion.includes('guarantee') || lowerQuestion.includes('guaranteed') || lowerQuestion.includes('promise')) && 
        (lowerQuestion.includes('product') || lowerQuestion.includes('effective') || lowerQuestion.includes('work'))) {
      return "Do we guarantee product effectiveness?\n\nNO, we do NOT guarantee that recommended products will work for everyone.\n\nWhy?\n• Every person's hair is UNIQUE\n• Individual responses vary\n• Hair chemistry differs\n• Lifestyle factors affect results\n• Genetics play a role\n• Environmental conditions vary\n\nWhat we DO provide:\n✓ Evidence-based recommendations\n✓ Products with beneficial ingredients\n✓ Matched to your hair type and condition\n✓ Expert-validated suggestions\n✓ Variety of options to try\n\nOur approach:\n• Recommend products based on your analysis\n• Suggest ingredients that generally help\n• Provide options at different price points\n• Include natural alternatives\n\nDISCLAIMER:\nThis application is experimental. Our recommendations are for guidance and suggestions only. Results may vary. Please consult a trusted hair care professional for personalized advice.\n\nWe encourage you to:\n- Try products and observe results\n- Give products time to work (4-6 weeks)\n- Adjust based on your hair's response\n- Consult professionals for persistent issues";
    }

    // Are your recommendations hair expert-approved?
    if ((lowerQuestion.includes('expert') || lowerQuestion.includes('professional') || lowerQuestion.includes('approved')) && 
        (lowerQuestion.includes('recommend') || lowerQuestion.includes('product') || lowerQuestion.includes('routine') || lowerQuestion.includes('suggestion'))) {
      return "Yes - we consulted a hair technician and hair expert to validate the recommended products and routines.";
    }

    // Out of scope check - only block clearly unrelated questions
    // Moved to end to allow specific handlers to process first
    // This will be checked at the very end if no other handler matches
    // Specific question: Does trimming help hair grow faster?
    if (lowerQuestion.includes('trim') && (lowerQuestion.includes('grow') || lowerQuestion.includes('faster') || lowerQuestion.includes('longer') || lowerQuestion.includes('help'))) {
      return "MYTH BUSTED: Trimming does NOT make hair grow faster.\n\nWhy this is a myth:\n• Hair grows from the ROOTS (scalp), not the ends\n• Cutting ends doesn't affect growth rate\n• Growth happens at ~0.5 inches per month regardless\n\nBUT trimming IS important because:\n• Prevents split ends from traveling UP the hair shaft\n• Makes hair APPEAR longer and healthier\n• Helps you RETAIN length (less breakage)\n• Removes damaged, weak ends\n\nBest practice:\n• Trim every 6-8 weeks (or every 3-4 months minimum)\n• Remove only 1/4 to 1/2 inch\n• Use sharp scissors (dull ones cause more damage)\n• Trim when hair is dry for accuracy\n\nThink of it as maintenance, not growth stimulation!";
    }

    if (lowerQuestion.includes('brush') && (lowerQuestion.includes('grow') || lowerQuestion.includes('longer') || lowerQuestion.includes('times') || lowerQuestion.includes('day'))) {
      return "MYTH: Brushing 100 times a day does NOT make hair grow longer.\n\nExcessive brushing can actually cause:\n• Breakage\n• Split ends\n• Hair loss\n\nBrush gently only when needed to detangle. Use a wide-tooth comb on wet hair to minimize damage.";
    }

    if ((lowerQuestion.includes('oily') || lowerQuestion.includes('greasy')) && lowerQuestion.includes('wash') && (lowerQuestion.includes('multiple') || lowerQuestion.includes('many') || lowerQuestion.includes('often') || lowerQuestion.includes('every day'))) {
      return "MYTH: Washing oily hair multiple times a day can make it WORSE!\n\nOver-washing strips natural oils, causing your scalp to produce even more oil to compensate.\n\nBetter approach:\n• Wash 2-3 times per week\n• Use dry shampoo between washes\n• Focus shampoo on scalp, conditioner on ends\n• Let your scalp regulate naturally";
    }

    if ((lowerQuestion.includes('cold water') || lowerQuestion.includes('cold rinse')) && (lowerQuestion.includes('shine') || lowerQuestion.includes('shiny'))) {
      return "FACT: Cold water CAN make hair shinier!\n\nCold water helps seal the hair cuticle, making it lie flat and reflect more light. However, the effect is temporary.\n\nBest practice: Rinse with cool (not ice cold) water as a final step after conditioning.";
    }

    if (lowerQuestion.includes('wet hair') && lowerQuestion.includes('brush')) {
      return "CAREFUL: Brushing wet hair can cause breakage!\n\nWet hair is more fragile and elastic. If you must detangle:\n• Use a wide-tooth comb\n• Start from the ends and work up\n• Apply leave-in conditioner first\n• Be very gentle\n\nOr better yet, detangle before washing.";
    }

    if ((lowerQuestion.includes('air dry') || lowerQuestion.includes('air-dry')) && (lowerQuestion.includes('blow dry') || lowerQuestion.includes('better'))) {
      return "IT DEPENDS!\n\nAir drying:\n• No heat damage\n• Takes longer\n• Can cause frizz if done incorrectly\n\nBlow drying:\n• Faster, more control\n• Heat damage if done wrong\n\nBest of both: Air dry 70%, then blow dry on low heat with heat protectant.";
    }

    const routineStrictMatches = new Set([
      'do i have to follow the routines',
      'do i have to follow the suggested routines',
      'do i need to follow the routines',
      'do i need to follow the suggested routines',
      'should i follow the routines',
      'should i follow the suggested routines',
    ]);

    if (routineStrictMatches.has(normalizedQuestion)) {
      return "No, you don't HAVE to follow our suggested routines!\n\nOur recommendations are based on general hair type and damage analysis. They're a helpful starting point, but:\n\n• Your hair is unique\n• Adjust based on what works for YOU\n• Listen to your hair's needs\n• Experiment and find your perfect routine\n\nUse our suggestions as a guide, not a strict rule!";
    }

    if (lowerQuestion.includes('privacy') || (lowerQuestion.includes('data') && (lowerQuestion.includes('safe') || lowerQuestion.includes('used') || lowerQuestion.includes('share'))) || ((lowerQuestion.includes('photo') || lowerQuestion.includes('image')) && (lowerQuestion.includes('safe') || lowerQuestion.includes('secure')))) {
      return "Yes — your images are processed securely and are not shared with third parties.";
    }

    // Natural remedies for specific issues
    if ((lowerQuestion.includes('natural') || lowerQuestion.includes('remedy') || lowerQuestion.includes('remedies')) && 
        (lowerQuestion.includes('hair loss') || lowerQuestion.includes('hairloss') || lowerQuestion.includes('falling') || lowerQuestion.includes('shedding') || lowerQuestion.includes('thinning'))) {
      const hairLossRemedies = remedies.filter(r => {
        if (Array.isArray(r.category)) {
          return r.category.includes('hair loss');
        }
        return r.category === 'hair loss';
      });
      
      let response = "Natural remedies for HAIR LOSS:\n\n";
      hairLossRemedies.forEach((remedy, index) => {
        response += `${index + 1}. ${remedy.name}\n${remedy.description}\nHow to use: ${remedy.howToUse}\n\n`;
      });
      response += "Remember: Results may vary. If hair loss persists, consult a professional.";
      return response;
    }

    if ((lowerQuestion.includes('natural') || lowerQuestion.includes('remedy') || lowerQuestion.includes('remedies')) && 
        (lowerQuestion.includes('breakage') || lowerQuestion.includes('breaking') || lowerQuestion.includes('split ends'))) {
      const breakageRemedies = remedies.filter(r => {
        if (Array.isArray(r.category)) {
          return r.category.includes('breakage');
        }
        return r.category === 'breakage';
      });
      
      let response = "Natural remedies for BREAKAGE:\n\n";
      breakageRemedies.forEach((remedy, index) => {
        response += `${index + 1}. ${remedy.name}\n${remedy.description}\nHow to use: ${remedy.howToUse}\n\n`;
      });
      response += "Tip: Be gentle with your hair and avoid excessive heat styling.";
      return response;
    }

    if ((lowerQuestion.includes('natural') || lowerQuestion.includes('remedy') || lowerQuestion.includes('remedies')) && 
        (lowerQuestion.includes('color') || lowerQuestion.includes('colored') || lowerQuestion.includes('coloured') || lowerQuestion.includes('dye'))) {
      const colorDamageRemedies = remedies.filter(r => {
        if (Array.isArray(r.category)) {
          return r.category.includes('color damage');
        }
        return r.category === 'color damage';
      });
      
      let response = "Natural remedies for COLOR DAMAGE:\n\n";
      colorDamageRemedies.forEach((remedy, index) => {
        response += `${index + 1}. ${remedy.name}\n${remedy.description}\nHow to use: ${remedy.howToUse}\n\n`;
      });
      response += "Tip: Use color-safe products and avoid frequent color treatments.";
      return response;
    }

    if (lowerQuestion.includes('aloe') || lowerQuestion.includes('coconut') || lowerQuestion.includes('avocado') || lowerQuestion.includes('egg') || lowerQuestion.includes('honey') || lowerQuestion.includes('olive') || lowerQuestion.includes('rosemary')) {
      return "Natural remedies can be beneficial!\n\nCommon natural treatments:\n• Coconut oil: Deep moisture\n• Aloe vera: Soothing, strengthening\n• Avocado: Rich in vitamins\n• Egg mask: Protein boost\n• Honey: Moisture retention\n\nAlways do a patch test first! Natural doesn't always mean safe for everyone. Check our Natural Remedies section in the app for detailed recipes!";
    }

    // How often should I shampoo per hair type?
    if ((lowerQuestion.includes('how often') || lowerQuestion.includes('how many times') || lowerQuestion.includes('frequency')) && 
        lowerQuestion.includes('shampoo') && 
        !lowerQuestion.includes('condition')) {
      
      let detectedHairType: string | undefined;
      if (lowerQuestion.includes('straight') || lowerQuestion.includes('type 1')) {
        detectedHairType = 'straight';
      } else if (lowerQuestion.includes('wavy') || lowerQuestion.includes('type 2')) {
        detectedHairType = 'wavy';
      } else if (lowerQuestion.includes('curly') || lowerQuestion.includes('type 3')) {
        detectedHairType = 'curly';
      } else if (lowerQuestion.includes('coily') || lowerQuestion.includes('kinky') || lowerQuestion.includes('type 4')) {
        detectedHairType = 'coily';
      }
      
      if (detectedHairType) {
        if (detectedHairType === 'straight') {
          return "How often to SHAMPOO for STRAIGHT hair (Type 1):\n\nFrequency: Every 2-3 days\n\nWhy more frequent?\n• Natural oils travel down quickly (straight path)\n• Gets greasy faster than other types\n• Needs regular cleansing to avoid flat, oily look\n\nBest practices:\n• Use volumizing or lightweight shampoo\n• Focus shampoo on SCALP only\n• Avoid heavy, moisturizing shampoos (can weigh down)\n• Use dry shampoo between washes if needed\n• Clarifying shampoo once a month\n\nAdjust if:\n• Very oily scalp: Every 2 days\n• Normal scalp: Every 2-3 days\n• Dry scalp: Every 3-4 days\n• Active lifestyle: May need extra wash after workouts\n\nIMPORTANT:\n❌ Don't wash daily (strips natural oils)\n✓ Let scalp regulate naturally\n✓ Use lukewarm water (not hot)\n✓ Rinse thoroughly";
        } else if (detectedHairType === 'wavy') {
          return "How often to SHAMPOO for WAVY hair (Type 2):\n\nFrequency: 2-3 times per week\n\nWhy this frequency?\n• Needs balance between moisture and cleansing\n• Too frequent = strips natural oils, causes frizz\n• Too infrequent = buildup weighs down waves\n\nBest practices:\n• Use lightweight, moisturizing shampoo\n• Sulfate-free is ideal (preserves waves)\n• Focus shampoo on SCALP only\n• Condition mid-lengths to ends\n• Co-wash (conditioner-only) between shampoos if needed\n\nAdjust if:\n• Oily scalp: 3 times per week\n• Normal scalp: 2-3 times per week\n• Dry scalp: 2 times per week\n• Product buildup: Clarify monthly\n\nIMPORTANT:\n✓ Use gentle, sulfate-free formulas\n✓ Avoid over-washing (causes frizz)\n✓ Let waves air dry when possible";
        } else if (detectedHairType === 'curly') {
          return "How often to SHAMPOO for CURLY hair (Type 3):\n\nFrequency: 1-2 times per week\n\nWhy less frequent?\n• Curly hair is naturally drier\n• Natural oils take longer to travel down curls\n• Over-washing strips essential moisture\n• Can cause frizz, breakage, and dryness\n\nBest practices:\n• ALWAYS use sulfate-free shampoo\n• Focus shampoo on SCALP only (not lengths)\n• Co-wash (conditioner-only) between shampoos\n• Deep condition weekly\n• Use gentle, moisturizing formulas\n\nAdjust if:\n• Very oily scalp: 2 times per week\n• Normal scalp: 1-2 times per week\n• Dry scalp: Once a week\n• Exercise frequently: May need 2-3x (but co-wash in between)\n• Heavy products: Clarify monthly\n\nIMPORTANT:\n❌ Never wash daily (dries out curls)\n✓ Co-wash is your friend between shampoos\n✓ Always condition after shampooing\n✓ Use cool/lukewarm water";
        } else if (detectedHairType === 'coily') {
          return "How often to SHAMPOO for COILY/KINKY hair (Type 4):\n\nFrequency: Once a week or less (every 7-10 days)\n\nWhy least frequent?\n• Coily hair is the driest hair type\n• Natural oils rarely reach the ends\n• Needs maximum moisture retention\n• Over-washing causes severe dryness and breakage\n\nBest practices:\n• ALWAYS sulfate-free, moisturizing shampoo\n• Pre-poo (oil treatment) before shampooing\n• Focus shampoo ONLY on scalp\n• NEVER shampoo the lengths (too drying)\n• Deep condition every wash\n• Use gentle, hydrating formulas\n\nAdjust if:\n• Very oily scalp: Every 5-7 days\n• Normal scalp: Once a week\n• Dry scalp: Every 10-14 days\n• Protective styles: May go 2 weeks between\n• Product buildup: Clarify monthly (gentle formula)\n\nIMPORTANT:\n❌ Never wash more than 2x per week\n✓ Pre-poo with oils before washing\n✓ Always deep condition after shampooing\n✓ Use warm (not hot) water\n✓ Follow with leave-in conditioner";
        }
      }
      // If no hair type detected, fall through to general handler below
    }

    // How often should I condition per hair type?
    if ((lowerQuestion.includes('how often') || lowerQuestion.includes('how many times') || lowerQuestion.includes('frequency')) && 
        lowerQuestion.includes('condition') && 
        !lowerQuestion.includes('deep condition')) {
      
      let detectedHairType: string | undefined;
      if (lowerQuestion.includes('straight') || lowerQuestion.includes('type 1')) {
        detectedHairType = 'straight';
      } else if (lowerQuestion.includes('wavy') || lowerQuestion.includes('type 2')) {
        detectedHairType = 'wavy';
      } else if (lowerQuestion.includes('curly') || lowerQuestion.includes('type 3')) {
        detectedHairType = 'curly';
      } else if (lowerQuestion.includes('coily') || lowerQuestion.includes('kinky') || lowerQuestion.includes('type 4')) {
        detectedHairType = 'coily';
      }
      
      if (detectedHairType) {
        if (detectedHairType === 'straight') {
          return "How often to CONDITION for STRAIGHT hair (Type 1):\n\nFrequency: Every time you shampoo (2-3 times per week)\n\nBest practices:\n• Apply to ENDS only (avoid roots)\n• Use lightweight conditioners (avoid heavy formulas)\n• Rinse thoroughly (residue makes hair flat)\n• Leave-in conditioner: Optional, use sparingly\n• Deep condition: Monthly or bi-weekly if damaged\n\nWhat to avoid:\n❌ Heavy, creamy conditioners (weighs down)\n❌ Conditioning roots (makes hair greasy)\n❌ Over-conditioning (causes flatness)\n\nProduct tips:\n✓ Lightweight, volumizing conditioners\n✓ Focus on ends only\n✓ Rinse completely\n✓ Use dry shampoo if roots get oily";
        } else if (detectedHairType === 'wavy') {
          return "How often to CONDITION for WAVY hair (Type 2):\n\nFrequency: Every time you shampoo (2-3 times per week) + Leave-in daily\n\nBest practices:\n• Condition mid-lengths to ends\n• Use lightweight, moisturizing conditioners\n• Leave-in conditioner for daily moisture\n• Deep condition: Bi-weekly or weekly if damaged\n• Co-wash (conditioner-only) between shampoos\n\nWhat to avoid:\n❌ Heavy, thick conditioners (weighs down waves)\n❌ Skipping leave-in (waves need moisture)\n❌ Over-conditioning roots (causes buildup)\n\nProduct tips:\n✓ Lightweight formulas\n✓ Leave-in conditioner daily\n✓ Focus on mid-lengths to ends\n✓ Scrunch in products to enhance waves";
        } else if (detectedHairType === 'curly') {
          return "How often to CONDITION for CURLY hair (Type 3):\n\nFrequency: Every wash (1-2x/week) + Leave-in daily + Deep condition weekly\n\nBest practices:\n• ALWAYS condition after shampooing\n• Condition mid-lengths to ends generously\n• Leave-in conditioner DAILY (essential!)\n• Deep condition weekly (mandatory)\n• Co-wash (conditioner-only) between shampoos\n• Use rich, moisturizing formulas\n\nWhat to avoid:\n❌ Skipping conditioner (curls need moisture)\n❌ Lightweight conditioners (not enough moisture)\n❌ Conditioning roots (causes buildup)\n\nProduct tips:\n✓ Rich, creamy conditioners\n✓ Leave-in conditioner every day\n✓ Deep condition weekly\n✓ Focus on mid-lengths to ends\n✓ Use conditioner to detangle";
        } else if (detectedHairType === 'coily') {
          return "How often to CONDITION for COILY/KINKY hair (Type 4):\n\nFrequency: Every wash (1x/week) + Leave-in daily + Deep condition weekly\n\nBest practices:\n• ALWAYS deep condition after shampooing\n• Leave-in conditioner DAILY (critical!)\n• Condition mid-lengths to ends generously\n• Use rich, buttery conditioners\n• Pre-poo (oil treatment) before washing\n• Moisturize and seal daily\n\nWhat to avoid:\n❌ Lightweight conditioners (not enough)\n❌ Skipping daily moisture\n❌ Conditioning roots (causes buildup)\n\nProduct tips:\n✓ Rich, buttery conditioners\n✓ Leave-in conditioner daily\n✓ Deep condition every wash\n✓ Focus on mid-lengths to ends\n✓ Use conditioner to detangle gently\n✓ Follow with oils/butters to seal moisture";
        }
      }
    }

    // How often should I comb per hair type?
    if ((lowerQuestion.includes('how often') || lowerQuestion.includes('how many times') || lowerQuestion.includes('frequency')) && 
        (lowerQuestion.includes('comb') || lowerQuestion.includes('brush'))) {
      
      let detectedHairType: string | undefined;
      if (lowerQuestion.includes('straight') || lowerQuestion.includes('type 1')) {
        detectedHairType = 'straight';
      } else if (lowerQuestion.includes('wavy') || lowerQuestion.includes('type 2')) {
        detectedHairType = 'wavy';
      } else if (lowerQuestion.includes('curly') || lowerQuestion.includes('type 3')) {
        detectedHairType = 'curly';
      } else if (lowerQuestion.includes('coily') || lowerQuestion.includes('kinky') || lowerQuestion.includes('type 4')) {
        detectedHairType = 'coily';
      }
      
      if (detectedHairType) {
        if (detectedHairType === 'straight') {
          return "How often to COMB/BRUSH for STRAIGHT hair (Type 1):\n\nFrequency: Daily (as needed)\n\nBest practices:\n• Brush daily to distribute natural oils\n• Use paddle brush or boar bristle brush\n• Start from ends, work up to roots\n• Brush when dry (easier to detangle)\n• Can brush multiple times per day if needed\n\nWhen to comb/brush:\n✓ In the morning (distributes oils)\n✓ Before styling\n✓ To detangle\n✓ Before bed (removes tangles)\n\nWhat to avoid:\n❌ Brushing wet hair (causes breakage)\n❌ Rough brushing (damages cuticle)\n❌ Over-brushing (can cause oiliness)\n\nTips:\n• Use gentle strokes\n• Start from ends\n• Use quality brush (boar bristle ideal)\n• Brush before washing to remove tangles";
        } else if (detectedHairType === 'wavy') {
          return "How often to COMB/BRUSH for WAVY hair (Type 2):\n\nFrequency: Only when wet (2-3x/week) + Wide-tooth comb only\n\nBest practices:\n• ONLY comb when WET (with conditioner)\n• Use wide-tooth comb (never brush dry!)\n• Start from ends, work up to roots\n• Comb during conditioning in shower\n• NEVER brush when dry (breaks up waves, causes frizz)\n\nWhen to comb:\n✓ In shower with conditioner\n✓ To detangle before styling\n✓ When applying products to wet hair\n\nWhat to avoid:\n❌ Brushing when dry (destroys waves, causes frizz)\n❌ Fine-tooth combs (causes breakage)\n❌ Over-combing (causes frizz)\n\nTips:\n• Use wide-tooth comb only\n• Always use conditioner when combing\n• Start from ends\n• Use fingers to detangle when possible\n• Avoid touching when dry";
        } else if (detectedHairType === 'curly') {
          return "How often to COMB/BRUSH for CURLY hair (Type 3):\n\nFrequency: Only when wet (1-2x/week) + Wide-tooth comb or fingers\n\nBest practices:\n• ONLY detangle when WET (with conditioner)\n• Use wide-tooth comb or fingers\n• Detangle during conditioning in shower\n• Start from ends, work up to roots\n• NEVER brush or comb when dry (destroys curls, causes frizz)\n\nWhen to comb:\n✓ In shower with conditioner\n✓ To detangle before styling\n✓ When applying products to wet hair\n\nWhat to avoid:\n❌ Brushing when dry (destroys curl pattern)\n❌ Fine-tooth combs (causes breakage)\n❌ Regular brushes (breaks up curls)\n❌ Over-combing (causes frizz and breakage)\n\nTips:\n• Use wide-tooth comb or fingers\n• Always use conditioner when detangling\n• Start from ends, be very gentle\n• Use detangling spray if needed\n• Finger detangle when possible";
        } else if (detectedHairType === 'coily') {
          return "How often to COMB/BRUSH for COILY/KINKY hair (Type 4):\n\nFrequency: Only when wet (1x/week) + Wide-tooth comb or fingers\n\nBest practices:\n• ONLY detangle when WET (with conditioner or detangling product)\n• Use wide-tooth comb or fingers (preferred)\n• Detangle during deep conditioning\n• Start from ends, work up VERY gently\n• Section hair for easier detangling\n• NEVER brush or comb when dry (causes severe breakage)\n\nWhen to comb:\n✓ In shower with deep conditioner\n✓ Before styling (when wet)\n✓ When applying products to wet hair\n\nWhat to avoid:\n❌ Brushing when dry (causes severe breakage)\n❌ Fine-tooth combs (causes breakage)\n❌ Regular brushes (too harsh)\n❌ Rough detangling (hair is fragile)\n\nTips:\n• Use fingers first (gentlest method)\n• Wide-tooth comb as backup\n• Always use conditioner/detangler\n• Start from ends, be EXTREMELY gentle\n• Section hair into 4-6 parts\n• Work in small sections\n• Take your time (patience prevents breakage)";
        }
      }
    }

    // Specific question: How often should I wash curly hair?
    if ((lowerQuestion.includes('how often') || lowerQuestion.includes('how many times') || lowerQuestion.includes('frequency')) && 
        (lowerQuestion.includes('wash') || lowerQuestion.includes('shampoo')) && 
        (lowerQuestion.includes('curly') || lowerQuestion.includes('type 3'))) {
      return "For CURLY hair (Type 3), wash 1-2 times per week.\n\nWhy less frequent?\n• Curly hair is naturally drier\n• Natural oils take longer to travel down curls\n• Over-washing strips essential moisture\n• Can cause frizz and breakage\n\nBest practices:\n• Use sulfate-free shampoo\n• Focus shampoo on scalp only\n• Condition mid-lengths to ends\n• Co-wash (conditioner-only) between shampoos\n• Deep condition weekly\n\nAdjust if:\n• You exercise frequently (may need 2-3x)\n• You have oily scalp (focus on scalp only)\n• You use heavy products (clarify monthly)";
    }

    // General washing frequency question (only if no specific handler matched)
    // This is a fallback for general "how often should I wash" questions
    if ((lowerQuestion.includes('how often') || lowerQuestion.includes('how many')) && 
        (lowerQuestion.includes('wash') || lowerQuestion.includes('shampoo')) && 
        !lowerQuestion.includes('condition') && !lowerQuestion.includes('comb') && !lowerQuestion.includes('brush')) {
      const hairType = lowerQuestion.includes('straight') ? 'straight' : 
                      lowerQuestion.includes('wavy') ? 'wavy' : 
                      lowerQuestion.includes('curly') ? 'curly' : 
                      lowerQuestion.includes('kinky') || lowerQuestion.includes('coily') ? 'kinky' : 
                      undefined;
      
      return "Washing frequency by hair type:\n\n• Type 1 (Straight): Every 2-3 days (gets oily faster)\n• Type 2 (Wavy): 2-3 times per week\n• Type 3 (Curly): 1-2 times per week\n• Type 4 (Kinky/Coily): Once a week or less\n\nAdjust based on:\n• Lifestyle (exercise, environment)\n• Scalp oiliness\n• Hair thickness\n• Product buildup";
    }

    // What is the best routine for my hair type?
    if ((lowerQuestion.includes('best') || lowerQuestion.includes('good') || lowerQuestion.includes('what')) && 
        lowerQuestion.includes('routine') && 
        (lowerQuestion.includes('hair type') || lowerQuestion.includes('my hair'))) {
      return "What is the best routine for your hair type?\n\nThe BEST routine is personalized to YOUR specific hair!\n\nOur app provides customized routines based on:\n✓ Your hair type (Straight, Wavy, Curly, Kinky)\n✓ Your scalp condition (Oily, Dry, Dandruff, Normal)\n✓ Your hair damage level (Healthy, Breakage, Hair Loss, Color Damage)\n\nHow to get your personalized routine:\n1. Take a hair analysis scan in the app\n2. View your results\n3. Tap 'View Your Personalized Routine'\n4. Get detailed care instructions including:\n   • Wash frequency\n   • Shampoo type recommendations\n   • Conditioning tips\n   • Styling advice\n   • Drying techniques\n   • Treatment suggestions\n   • Damage care (if applicable)\n\nYour personalized routine will include specific steps for:\n- Scalp care\n- Hair type styling\n- Damage treatment\n\nTake a hair scan now to get YOUR custom routine!";
    }

    // How often should I shampoo?
    if ((lowerQuestion.includes('how often') || lowerQuestion.includes('frequency')) && 
        lowerQuestion.includes('shampoo')) {
      return "How often should you shampoo?\n\nIt depends on your hair type and scalp condition!\n\nGENERAL GUIDELINES:\n• Straight hair (Type 1): Every 2-3 days\n• Wavy hair (Type 2): 2-3 times per week\n• Curly hair (Type 3): 1-2 times per week\n• Kinky/Coily hair (Type 4): Once a week or less\n\nADJUST BASED ON:\n• Oily scalp: May need more frequent washing (but not daily!)\n• Dry scalp: Less frequent, focus on moisture\n• Dandruff: 2-3x per week with dandruff shampoo\n• Active lifestyle: May need extra washes after workouts\n• Product buildup: Use clarifying shampoo monthly\n\nOVER-WASHING:\n❌ Strips natural oils\n❌ Can make oily scalps produce MORE oil\n❌ Leads to dryness and damage\n\nBest practice:\n✓ Focus shampoo on SCALP only\n✓ Use dry shampoo between washes\n✓ Adjust based on your hair's needs\n\nFor your PERSONALIZED wash frequency:\nTake a hair scan → View Personalized Routine → See your custom recommendations!";
    }

    // Should I deep condition weekly?
    if ((lowerQuestion.includes('should') || lowerQuestion.includes('need')) && 
        lowerQuestion.includes('deep condition') && 
        (lowerQuestion.includes('weekly') || lowerQuestion.includes('how often') || lowerQuestion.includes('frequency'))) {
      return "Should you deep condition weekly?\n\nIt depends on your hair type and condition!\n\nWHO NEEDS WEEKLY DEEP CONDITIONING:\n✓ Curly/Coily hair (Type 3 & 4)\n✓ Dry or damaged hair\n✓ Color-treated hair\n✓ Chemically processed hair\n✓ Heat-styled hair\n✓ High porosity hair\n\nWHO CAN DO BI-WEEKLY:\n• Wavy hair (Type 2)\n• Normal porosity hair\n• Minimally processed hair\n\nWHO CAN DO MONTHLY:\n• Straight hair (Type 1)\n• Oily hair\n• Fine hair (avoid over-conditioning)\n• Low porosity hair\n\nBENEFITS OF DEEP CONDITIONING:\n• Restores moisture\n• Repairs damage\n• Strengthens hair\n• Reduces breakage\n• Improves elasticity\n• Adds shine\n\nHow to deep condition:\n1. Shampoo hair\n2. Apply deep conditioner/mask\n3. Focus on mid-lengths to ends\n4. Leave for 15-30 minutes (or as directed)\n5. Rinse thoroughly\n\nFor your PERSONALIZED treatment schedule:\nTake a hair scan → View Personalized Routine → Get custom treatment recommendations!";
    }

    // What's the best routine for wavy hair?
    if ((lowerQuestion.includes('best') || lowerQuestion.includes('good') || lowerQuestion.includes('routine')) && 
        lowerQuestion.includes('wavy')) {
      const routine = hairTypeRoutines['Wavy'];
      let response = "Best routine for WAVY HAIR (Type 2):\n\n";
      response += `CONDITIONING:\n${routine.conditionerTips}\n\n`;
      response += `STYLING:\n${routine.styling}\n\n`;
      response += `DRYING:\n${routine.dryingTips}\n\n`;
      if (routine.extraTip) response += `TIP:\n${routine.extraTip}`;
      
      return response;
    }

    // How do I take care of straight hair?
    if ((lowerQuestion.includes('how') || lowerQuestion.includes('care') || lowerQuestion.includes('take care')) && 
        lowerQuestion.includes('straight') && 
        lowerQuestion.includes('hair')) {
      return "How to take care of STRAIGHT HAIR (Type 1):\n\nWASH ROUTINE:\n• Frequency: Every 2-3 days\n• Use volumizing or lightweight shampoo\n• Oils travel down quickly (gets greasy faster)\n• Focus shampoo on scalp\n\nCONDITIONING:\n• Apply to ends only (avoid roots)\n• Use lightweight conditioners\n• Avoid heavy oils (makes hair flat)\n• Rinse thoroughly\n\nSTYLING:\n• Minimal product needed\n• Use volumizing sprays if desired\n• Avoid heavy creams/oils\n• Heat protectant before styling\n\nDRYING:\n• Can air dry easily\n• Blow dry with brush for volume\n• Dry from roots for lift\n• Use cool shot to set style\n\nMAINTENANCE:\n• Regular trims (every 6-8 weeks)\n• Avoid over-washing (strips oils)\n• Use dry shampoo between washes\n• Brush gently to distribute oils\n\nCOMMON CONCERNS:\n• Gets oily quickly → Less frequent washing\n• Looks flat → Volumizing products at roots\n• Split ends → Regular trims\n\nPRODUCT TIPS:\n✓ Lightweight formulas\n✓ Volumizing products\n✓ Clarifying shampoo (monthly)\n✓ Avoid heavy oils/butters\n\nFor your COMPLETE straight hair routine:\nTake a hair scan → View Personalized Routine → Get detailed care instructions!";
    }

    // Should I use hair oil before or after shower?
    if ((lowerQuestion.includes('should') || lowerQuestion.includes('when') || lowerQuestion.includes('use')) && 
        lowerQuestion.includes('oil') && 
        (lowerQuestion.includes('before') || lowerQuestion.includes('after')) && 
        (lowerQuestion.includes('shower') || lowerQuestion.includes('wash'))) {
      return "Should you use hair oil BEFORE or AFTER shower?\n\nBOTH have benefits! Choose based on your goal:\n\nBEFORE SHOWER (Pre-wash treatment):\n✓ Deep conditioning treatment\n✓ Protects hair during washing\n✓ Good for dry, damaged hair\n✓ Leave for 30 min to overnight\n✓ Best oils: Coconut, Olive, Castor\n\nHow to:\n1. Apply oil to dry hair\n2. Massage into scalp and lengths\n3. Leave for 30+ minutes\n4. Shampoo thoroughly (may need 2 washes)\n\nAFTER SHOWER (Leave-in treatment):\n✓ Seals moisture\n✓ Adds shine\n✓ Reduces frizz\n✓ Protects from heat/environment\n✓ Best oils: Argan, Jojoba, Almond\n\nHow to:\n1. Apply to damp (not wet) hair\n2. Focus on mid-lengths to ends\n3. Use small amount (1-2 drops)\n4. Avoid roots (can look greasy)\n\nHAIR TYPE GUIDE:\n• Straight/Fine: After shower, minimal amount\n• Wavy: Both (light oils)\n• Curly/Coily: Both (generous amounts)\n• Oily scalp: After shower, ends only\n• Dry hair: Before shower for deep treatment\n\nPro tip: You can do BOTH!\nPre-wash for treatment + Post-wash for styling\n\nFor personalized oil recommendations:\nTake a hair scan → View Personalized Routine!";
    }

    // Should I air dry or blow dry?
    if ((lowerQuestion.includes('should') || lowerQuestion.includes('better')) && 
        (lowerQuestion.includes('air dry') || lowerQuestion.includes('blow dry')) &&
        !lowerQuestion.includes('after shower')) {
      return "Should you AIR DRY or BLOW DRY?\n\nIT DEPENDS on your hair type and lifestyle!\n\nAIR DRYING:\n✓ No heat damage\n✓ Better for hair health\n✓ Free and effortless\n✓ Good for curly/wavy hair\n\n❌ Takes longer\n❌ Less volume/control\n❌ Can cause frizz if done wrong\n❌ May look flat on straight hair\n\nBest for:\n• Curly, wavy, coily hair\n• Damaged or color-treated hair\n• When you have time\n\nBLOW DRYING:\n✓ Faster results\n✓ More volume and control\n✓ Smooth finish\n✓ Good for styling\n\n❌ Heat damage risk\n❌ Can cause frizz/dryness\n❌ Requires heat protectant\n❌ Takes effort\n\nBest for:\n• Straight hair (adds volume)\n• When you need quick results\n• Achieving specific styles\n\nBEST OF BOTH WORLDS:\n1. Air dry 60-70%\n2. Then blow dry on LOW heat\n3. Use heat protectant\n4. Finish with cool shot\n\nBLOW DRYING TIPS:\n✓ Always use heat protectant\n✓ Keep dryer 6 inches away\n✓ Use low-medium heat\n✓ Point down to smooth cuticle\n✓ Finish with cool air\n\nAIR DRYING TIPS:\n✓ Gently squeeze (don't rub) with towel\n✓ Apply leave-in products\n✓ Don't touch too much (causes frizz)\n✓ Sleep in protective style if overnight\n\nFor your hair type's BEST drying method:\nTake a hair scan → View Personalized Routine → See custom drying tips!";
    }

    // How do I style my natural waves?
    if ((lowerQuestion.includes('how') || lowerQuestion.includes('style')) && 
        (lowerQuestion.includes('wave') || lowerQuestion.includes('wavy')) && 
        (lowerQuestion.includes('natural') || lowerQuestion.includes('my'))) {
      return "How to style NATURAL WAVES:\n\n1. START WITH CLEAN, DAMP HAIR:\n• Wash with sulfate-free shampoo\n• Condition mid-lengths to ends\n• Gently squeeze out excess water (don't rub!)\n\n2. APPLY PRODUCTS:\n• Use leave-in conditioner\n• Add curl cream or mousse (lightweight)\n• Apply to damp hair, section by section\n• Use prayer hands or scrunching method\n\n3. SCRUNCHING TECHNIQUE:\n• Flip head upside down\n• Scrunch hair upward toward scalp\n• Hold for a few seconds\n• Repeat throughout hair\n\n4. DRYING:\n• Air dry preferred (less frizz)\n• OR diffuse on low heat/speed\n• Don't touch while drying (causes frizz)\n• Let dry 100% before touching\n\n5. FINISHING:\n• Once dry, scrunch out the crunch\n• Use tiny bit of oil/serum for shine\n• Avoid brushing (breaks up waves)\n\n6. OVERNIGHT/REFRESH:\n• Sleep on silk/satin pillowcase\n• Or pineapple (high loose ponytail)\n• Refresh with water spray + leave-in\n• Re-scrunch to reactivate waves\n\nKEY TIPS:\n✓ Don't use terrycloth towels (causes frizz)\n✓ Use microfiber towel or t-shirt\n✓ Less is more with products\n✓ Avoid touching while drying\n✓ Embrace your natural texture!\n\nPRODUCTS TO USE:\n• Curl-enhancing cream\n• Lightweight mousse\n• Leave-in conditioner\n• Anti-frizz serum (tiny amount)\n\nFor WAVY HAIR product recommendations:\nTake a hair scan → Get personalized wave-enhancing products!";
    }

    // How to fix greasy hair quickly?
    if ((lowerQuestion.includes('how') || lowerQuestion.includes('fix') || lowerQuestion.includes('help')) && 
        (lowerQuestion.includes('greasy') || lowerQuestion.includes('oily')) && 
        (lowerQuestion.includes('quick') || lowerQuestion.includes('fast') || lowerQuestion.includes('without washing'))) {
      return "How to fix GREASY HAIR quickly:\n\n1. DRY SHAMPOO (Best quick fix!):\n• Spray or powder on roots\n• Wait 2-3 minutes\n• Massage into scalp\n• Brush through\n• Focus on crown and part line\n\n2. BABY POWDER/CORNSTARCH:\n• Sprinkle small amount on roots\n• Massage into oily areas\n• Brush through thoroughly\n• Good emergency substitute\n\n3. STYLING TRICKS:\n• Pull hair back in sleek ponytail/bun\n• Use headband or scarf\n• Create textured updo\n• Slick back with gel (intentional look)\n• Try braids or twists\n\n4. BLOTTING PAPERS:\n• Press on roots (like for face)\n• Absorbs oil\n• Quick touch-up\n\n5. BLOW DRYER + COOL AIR:\n• Lift roots and blast cool air\n• Adds volume, reduces appearance of oil\n• Takes 2 minutes\n\n6. CHANGE YOUR PART:\n• Parts get oiliest\n• Switch side or go middle\n• Creates volume at roots\n\nPREVENTION TIPS:\n• Don't over-wash (causes more oil production)\n• Wash 2-3x per week max\n• Focus shampoo on scalp only\n• Avoid touching hair\n• Use products for oily scalp\n• Clean pillowcases weekly\n\nLONG-TERM SOLUTIONS:\nFor personalized oily scalp care:\nTake a hair scan → View Personalized Routine → Get custom wash frequency and product recommendations!";
    }

    // How do I maintain a healthy scalp?
    if ((lowerQuestion.includes('how') || lowerQuestion.includes('maintain') || lowerQuestion.includes('keep')) && 
        (lowerQuestion.includes('healthy scalp') || (lowerQuestion.includes('scalp') && lowerQuestion.includes('healthy')))) {
      return "How to maintain a HEALTHY SCALP:\n\n1. PROPER CLEANSING:\n• Wash appropriate frequency for your scalp type\n• Focus shampoo on SCALP, not lengths\n• Massage gently (don't scratch)\n• Rinse thoroughly\n• Use lukewarm water (hot = drying)\n\n2. EXFOLIATION:\n• Use scalp scrub 1-2x per month\n• Or clarifying shampoo\n• Removes buildup and dead skin\n• Promotes circulation\n\n3. SCALP MASSAGE:\n• 5 minutes daily or 3x per week\n• Increases blood flow\n• Promotes hair growth\n• Reduces tension\n• Use fingertips (not nails)\n\n4. MOISTURIZE (for dry scalp):\n• Use scalp oils (jojoba, tea tree)\n• Apply at night, wash morning\n• Don't skip this if flaky\n\n5. BALANCE OIL (for oily scalp):\n• Don't over-wash (makes worse!)\n• Use clarifying treatments\n• Tea tree products help\n• Dry shampoo between washes\n\n6. PROTECT:\n• Wear hat in sun (scalp burns!)\n• Rinse after swimming\n• Avoid harsh chemicals\n• Use gentle products\n\n7. DIET & LIFESTYLE:\n• Stay hydrated\n• Eat protein, omega-3s\n• Manage stress\n• Get enough sleep\n\n8. AVOID:\n❌ Scratching with nails\n❌ Harsh sulfates\n❌ Very hot water\n❌ Product buildup\n❌ Tight hairstyles\n❌ Excessive heat\n\nSIGNS OF HEALTHY SCALP:\n✓ No itching or irritation\n✓ Minimal flaking\n✓ No redness\n✓ Comfortable feeling\n✓ Healthy hair growth\n\nFor PERSONALIZED scalp care:\nTake a hair scan → Input scalp condition → View Personalized Routine → Get custom scalp care instructions!";
    }

    // Should I trim my hair every month?
    if ((lowerQuestion.includes('should') || lowerQuestion.includes('need') || lowerQuestion.includes('how often')) && 
        lowerQuestion.includes('trim') && 
        (lowerQuestion.includes('month') || lowerQuestion.includes('often') || lowerQuestion.includes('frequency'))) {
      return "Should you trim your hair every month?\n\nNO, monthly trims are usually TOO FREQUENT!\n\nRECOMMENDED TRIM FREQUENCY:\n• Every 6-8 weeks (general guideline)\n• Every 3-4 months (minimum)\n• Every 8-12 weeks (if growing out hair)\n\nBASED ON HAIR CONDITION:\n\nHealthy hair:\n• Every 3-4 months is fine\n• Focus on maintaining length\n\nDamaged/split ends:\n• Every 6-8 weeks\n• Remove damage to prevent traveling\n\nColor-treated/heat-styled:\n• Every 6-8 weeks\n• More prone to damage\n\nGrowing out hair:\n• Every 8-12 weeks\n• Just trim the very ends (1/4 inch)\n\nShort haircuts:\n• Every 4-6 weeks\n• To maintain shape\n\nWHY NOT MONTHLY?\n• Hair grows ~0.5 inches per month\n• Monthly trims = no length gain\n• Unnecessary expense\n• Can actually slow growth progress\n\nMYTH: Trimming makes hair grow faster\n❌ FALSE! Hair grows from roots, not ends\n✓ BUT trimming prevents split ends from traveling up\n\nSIGNS YOU NEED A TRIM:\n• Visible split ends\n• Rough, frayed ends\n• Excessive tangling\n• Hair breaks easily\n• Ends look thin/wispy\n\nTRIMMING TIPS:\n✓ Use sharp scissors (dull = more damage)\n✓ Trim when dry for accuracy\n✓ Remove 1/4 to 1/2 inch\n✓ Don't wait too long (damage spreads)\n\nFor your hair's specific needs:\nTake a hair scan → View Personalized Routine → Get custom maintenance schedule!";
    }

    if (lowerQuestion.includes('routine') || lowerQuestion.includes('steps') || lowerQuestion.includes('daily') || lowerQuestion.includes('weekly')) {
      return "Basic hair care routine:\n\nWEEKLY:\n1. Cleanse scalp thoroughly\n2. Condition mid-lengths to ends\n3. Deep condition (once/week)\n4. Trim every 6-8 weeks\n\nDAILY:\n• Gentle detangling\n• Protect from sun/heat\n• Sleep on silk/satin\n• Drink water, eat healthy\n\nCustomize based on YOUR hair type and needs!\n\nFor a PERSONALIZED routine:\nTake a hair scan → View Personalized Routine → Get detailed care instructions based on YOUR hair!";
    }

    if ((lowerQuestion.includes('refresh') || lowerQuestion.includes('revive')) && (lowerQuestion.includes('curl') || lowerQuestion.includes('wave'))) {
      return "Refresh curls/waves without washing:\n\n1. Lightly dampen with water spray\n2. Apply leave-in conditioner or curl cream\n3. Scrunch gently\n4. Air dry or diffuse on low\n5. Use silk/satin pillowcase at night\n\nPro tip: Sleep in a pineapple (high loose ponytop) or use a bonnet to preserve curls overnight!";
    }

    if ((lowerQuestion.includes('how') && (lowerQuestion.includes('know') || lowerQuestion.includes('tell') || lowerQuestion.includes('check'))) && (lowerQuestion.includes('healthy') || lowerQuestion.includes('damage') || lowerQuestion.includes('unhealthy'))) {
      return "Signs of HEALTHY hair:\n• Shiny and smooth\n• Minimal breakage\n• Elastic (stretches slightly without breaking)\n• No split ends\n• Soft texture\n\nSigns of DAMAGED hair:\n• Dull, lifeless\n• Excessive shedding\n• Breaks easily\n• Split/frayed ends\n• Rough, tangled\n\nUse our app's damage detector to analyze your hair!";
    }

    if (lowerQuestion.includes('test') && (lowerQuestion.includes('hair') || lowerQuestion.includes('damage') || lowerQuestion.includes('health'))) {
      return "Simple hair health tests:\n\n1. ELASTICITY TEST:\nStretch a strand when wet. Healthy hair stretches 50% then returns.\n\n2. POROSITY TEST:\nDrop hair in water. Floats = low, sinks slowly = normal, sinks fast = high.\n\n3. BREAKAGE TEST:\nGently pull a strand. Breaks easily = damaged.\n\nFor accurate analysis, use our app's AI detection feature!";
    }

    // Specific question: How to prevent sun damage?
    if (lowerQuestion.includes('sun') && (lowerQuestion.includes('prevent') || lowerQuestion.includes('protect') || lowerQuestion.includes('avoid') || lowerQuestion.includes('how'))) {
      return "How to PREVENT sun damage to your hair:\n\n1. PHYSICAL PROTECTION:\n• Wear wide-brimmed hats or scarves\n• Use umbrellas in direct sunlight\n• Cover hair when swimming\n\n2. PRODUCT PROTECTION:\n• Use UV-protectant hair sprays/serums\n• Apply leave-in conditioner with UV filters\n• Use hair oils with natural SPF (coconut, jojoba)\n• Look for products with UV filters (octinoxate, avobenzone)\n\n3. TIMING:\n• Avoid peak sun hours (10am-4pm)\n• Seek shade when possible\n• Plan outdoor activities for early morning/evening\n\n4. AFTER-SUN CARE:\n• Rinse hair after sun exposure\n• Deep condition weekly\n• Use protein treatments if hair feels weak\n• Avoid heat styling on sun-exposed days\n\n5. FOR COLORED HAIR:\n• Extra protection needed (color fades faster)\n• Use color-safe UV products\n• Consider color-depositing conditioners\n\nRemember: Prevention is easier than repair!";
    }

    // General sun damage question
    if (lowerQuestion.includes('sun') && (lowerQuestion.includes('damage') || lowerQuestion.includes('affect') || lowerQuestion.includes('harm'))) {
      return "YES, sun DOES damage hair!\n\nUV rays cause:\n• Color fading\n• Protein loss\n• Dryness and brittleness\n• Weakened strands\n• Split ends\n• Loss of elasticity\n\nProtection:\n• Wear hats or scarves\n• UV-protectant hair products\n• Avoid peak sun (10am-4pm)\n• Deep condition weekly\n• Rinse after sun exposure";
    }

    if (lowerQuestion.includes('pollution') || lowerQuestion.includes('pollutants')) {
      return "Pollution damages hair:\n\nEffects:\n• Buildup on scalp and strands\n• Dullness\n• Scalp irritation\n• Accelerated aging\n\nProtection:\n• Wash hair regularly\n• Use clarifying shampoo weekly\n• Protective hairstyles\n• Antioxidant hair products\n• Cover hair in heavily polluted areas";
    }


    if (lowerQuestion.includes('diet') && (lowerQuestion.includes('hair') || lowerQuestion.includes('affect') || lowerQuestion.includes('health'))) {
      return "YES! Diet greatly affects hair health.\n\nEssential nutrients:\n• Protein: Hair building blocks\n• Iron: Prevents shedding\n• Omega-3: Scalp health\n• Biotin: Strengthens hair\n• Vitamins A, C, E: Growth & shine\n\nEat:\nEggs, fish, nuts, leafy greens, berries, sweet potatoes\n\nDrink plenty of water!";
    }

    if ((lowerQuestion.includes('gym') || lowerQuestion.includes('workout') || lowerQuestion.includes('exercise') || lowerQuestion.includes('sweat')) && lowerQuestion.includes('hair')) {
      return "Post-workout hair care:\n\nSweat contains salt that can:\n• Dry out hair\n• Cause buildup\n• Lead to breakage\n\nAfter gym:\n1. Rinse with water (no need to shampoo every time)\n2. Use dry shampoo on roots\n3. Tie hair loosely while working out\n4. Wash 2-3x per week\n5. Keep hair moisturized\n\nDon't let sweat sit for hours!";
    }

    if (lowerQuestion.includes('straight') || lowerQuestion.includes('type 1') || lowerQuestion.includes('1a') || lowerQuestion.includes('1b') || lowerQuestion.includes('1c')) {
      let response = "Straight hair (Type 1):\n\nNo curl pattern, lies flat.\n\n• 1A: Fine, soft, very straight\n• 1B: Medium texture, slight body\n• 1C: Coarse, may have slight bends\n\nCare tips:\n• Wash every 2-3 days\n• Lightweight products\n• Avoid heavy oils\n• Regular trims to prevent oiliness from traveling down";
      
      // Add product recommendations if asked
      if (lowerQuestion.includes('product') || lowerQuestion.includes('shampoo') || lowerQuestion.includes('conditioner')) {
        const products = recommendProducts({ hairType: 'Straight', limit: 10 });
        if (products.length > 0) {
          response += "\n\nRecommended products for Straight hair:\n\n";
          products.forEach((product, index) => {
            response += `${index + 1}. ${product.name}\n`;
          });
        }
      }
      
      return response;
    }

    if (lowerQuestion.includes('wavy') || lowerQuestion.includes('type 2') || lowerQuestion.includes('2a') || lowerQuestion.includes('2b') || lowerQuestion.includes('2c')) {
      let response = "Wavy hair (Type 2):\n\nS-shaped pattern.\n\n• 2A: Fine, thin waves\n• 2B: Medium waves, more defined\n• 2C: Thick, coarse, prone to frizz\n\nCare tips:\n• Wash 2-3x per week\n• Lightweight moisture\n• Scrunch while wet\n• Air dry or diffuse on low";
      
      // Add product recommendations if asked
      if (lowerQuestion.includes('product') || lowerQuestion.includes('shampoo') || lowerQuestion.includes('conditioner')) {
        const products = recommendProducts({ hairType: 'Wavy', limit: 10 });
        if (products.length > 0) {
          response += "\n\nRecommended products for Wavy hair:\n\n";
          products.forEach((product, index) => {
            response += `${index + 1}. ${product.name}\n`;
          });
        }
      }
      
      return response;
    }

    if (lowerQuestion.includes('curly') || lowerQuestion.includes('type 3') || lowerQuestion.includes('3a') || lowerQuestion.includes('3b') || lowerQuestion.includes('3c')) {
      const routine = hairTypeRoutines['Curly'];
      let response = "Curly hair (Type 3):\n\nWell-defined spiral curls.\n\n• 3A: Loose, big curls\n• 3B: Springy ringlets\n• 3C: Tight corkscrew curls\n\nCare tips:\n";
      response += `• ${routine.conditionerTips}\n`;
      response += `• ${routine.styling}\n`;
      response += `• ${routine.dryingTips}\n`;
      
      // Add product recommendations if asked
      if (lowerQuestion.includes('product') || lowerQuestion.includes('shampoo') || lowerQuestion.includes('conditioner')) {
        const products = recommendProducts({ hairType: 'Curly', limit: 10 });
        if (products.length > 0) {
          response += "\n\nRecommended products for Curly hair:\n\n";
          products.forEach((product, index) => {
            response += `${index + 1}. ${product.name}\n`;
          });
        }
      }
      
      return response;
    }

    if (lowerQuestion.includes('kinky') || lowerQuestion.includes('coily') || lowerQuestion.includes('type 4') || lowerQuestion.includes('4a') || lowerQuestion.includes('4b') || lowerQuestion.includes('4c')) {
      const routine = hairTypeRoutines['Kinky'];
      let response = "Kinky/Coily hair (Type 4):\n\nTight coils, zigzag patterns.\n\n• 4A: Soft, tight coils\n• 4B: Z-pattern, sharp angles\n• 4C: Very tight, fragile, high shrinkage\n\nCare tips:\n";
      response += `• ${routine.conditionerTips}\n`;
      response += `• ${routine.styling}\n`;
      response += `• ${routine.dryingTips}\n`;
      
      // Add product recommendations if asked
      if (lowerQuestion.includes('product') || lowerQuestion.includes('shampoo') || lowerQuestion.includes('conditioner')) {
        const products = recommendProducts({ hairType: 'Coily', limit: 10 });
        if (products.length > 0) {
          response += "\n\nRecommended products for Coily hair:\n\n";
          products.forEach((product, index) => {
            response += `${index + 1}. ${product.name}\n`;
          });
        }
      }
      
      return response;
    }

    // Breakage causes - specific
    if ((lowerQuestion.includes('breakage') || lowerQuestion.includes('breaking') || lowerQuestion.includes('split ends')) && 
        (lowerQuestion.includes('why') || lowerQuestion.includes('cause') || lowerQuestion.includes('reason') || lowerQuestion.includes('what'))) {
      return "BREAKAGE causes:\n\nCommon causes:\n• Heat styling without heat protectant (flat irons, curling irons, blow dryers)\n• Excessive brushing or combing (especially when wet)\n• Chemical treatments (perms, relaxers, bleach)\n• Rough handling (towel drying, tight hair ties, rough brushing)\n• Environmental factors (sun exposure, pollution, hard water)\n• Lack of moisture and protein\n• Split ends traveling up the hair shaft\n• Using harsh shampoos or over-washing\n\nRecovery:\n• Use heat protectant before styling\n• Deep conditioning weekly (protein and moisture)\n• Trim split ends regularly (every 6-8 weeks)\n• Gentle handling (wide-tooth comb, microfiber towel)\n• Minimize heat styling (air dry when possible)\n• Use natural remedies (coconut oil, jojoba oil, rice water)\n• Avoid tight hairstyles and hair ties\n• Use sulfate-free, moisturizing products\n\nBe patient - recovery takes time!";
    }

    // Color damage causes - specific
    if ((lowerQuestion.includes('color') || lowerQuestion.includes('colored') || lowerQuestion.includes('coloured') || lowerQuestion.includes('dye')) && 
        (lowerQuestion.includes('damage') || lowerQuestion.includes('damaged')) && 
        (lowerQuestion.includes('why') || lowerQuestion.includes('cause') || lowerQuestion.includes('reason') || lowerQuestion.includes('what'))) {
      return "COLOR DAMAGE causes:\n\nCommon causes:\n• Chemical processing (bleach, permanent dyes, highlights)\n• Frequent color applications (overlapping treatments)\n• Harsh color products (high ammonia, peroxide)\n• Heat styling on color-treated hair\n• UV exposure (sun fades color and damages hair)\n• Chlorine and saltwater exposure\n• Sulfate shampoos (strip color and moisture)\n• Lack of color-safe products\n• Over-processing (leaving dye on too long)\n\nRecovery:\n• Use color-safe, sulfate-free shampoos\n• Deep conditioning weekly (with color-protecting masks)\n• UV protection (hats, UV-protectant sprays)\n• Minimize heat styling (use low heat with protectant)\n• Avoid frequent color applications (wait 6-8 weeks)\n• Use natural remedies (almond oil, olive oil, honey, aloe vera)\n• Rinse hair after swimming (chlorine/saltwater)\n• Trim damaged ends regularly\n• Use leave-in conditioners for daily moisture\n\nProtect your color to maintain health and vibrancy!";
    }

    // What should I do if my hair is damaged?
    if ((lowerQuestion.includes('what should i do') || lowerQuestion.includes('what to do') || lowerQuestion.includes('how to fix') || lowerQuestion.includes('how to repair')) && 
        lowerQuestion.includes('damage') && 
        (lowerQuestion.includes('hair') || lowerQuestion.includes('my'))) {
      return "What to do if your hair is DAMAGED:\n\nIMMEDIATE STEPS:\n\n1. STOP THE DAMAGE:\n• Avoid heat styling (or use lowest heat with protectant)\n• Stop chemical treatments (coloring, perming, relaxing)\n• Avoid tight hairstyles\n• Use gentle hair ties (silk scrunchies)\n• Don't brush when wet (use wide-tooth comb)\n\n2. DEEP CONDITIONING:\n• Deep condition weekly (or 2x/week if severely damaged)\n• Use protein treatments bi-weekly\n• Leave-in conditioner daily\n• Hair masks with keratin, argan oil, or coconut oil\n\n3. TRIM DAMAGED ENDS:\n• Get a trim every 6-8 weeks\n• Remove split ends to prevent traveling up\n• Even if growing out, trim regularly\n\n4. GENTLE HANDLING:\n• Use microfiber towel (not terrycloth)\n• Wide-tooth comb only\n• Detangle gently with conditioner\n• Sleep on silk/satin pillowcase\n• Avoid rough towel drying\n\n5. PROTECTIVE STYLING:\n• Low manipulation styles\n• Avoid excessive brushing\n• Use heat protectant if styling\n• Protect from sun/UV rays\n\n6. PRODUCTS:\n• Sulfate-free shampoos\n• Rich, moisturizing conditioners\n• Protein treatments\n• Leave-in conditioners\n• Hair oils (argan, jojoba, coconut)\n\n7. LIFESTYLE:\n• Eat protein-rich foods\n• Stay hydrated\n• Manage stress\n• Get enough sleep\n\nRECOVERY TIMELINE:\n• Minor damage: 4-6 weeks\n• Moderate damage: 2-3 months\n• Severe damage: 4-6 months\n\nFor PERSONALIZED damage treatment:\nTake a hair scan → View Personalized Routine → Get custom damage treatment plan!";
    }

    // What is the best routine for straight hair?
    if ((lowerQuestion.includes('best routine') || lowerQuestion.includes('good routine')) && 
        lowerQuestion.includes('straight') && 
        lowerQuestion.includes('hair')) {
      const routine = hairTypeRoutines['Straight'];
      let response = "Best routine for STRAIGHT HAIR (Type 1):\n\n";
      response += `CONDITIONING:\n${routine.conditionerTips}\n\n`;
      response += `STYLING:\n${routine.styling}\n\n`;
      response += `DRYING:\n${routine.dryingTips}\n\n`;
      if (routine.extraTip) response += `TIP:\n${routine.extraTip}`;
      
      return response;
    }

    // Generic damage (fallback for general damage questions)
    if (lowerQuestion.includes('damage') && 
        !lowerQuestion.includes('breakage') && !lowerQuestion.includes('color') && !lowerQuestion.includes('colored') && !lowerQuestion.includes('coloured') &&
        (lowerQuestion.includes('why') || lowerQuestion.includes('cause') || lowerQuestion.includes('reason') || lowerQuestion.includes('what'))) {
      return "Hair damage:\n\nCommon causes:\n• Heat styling without protection\n• Chemical treatments\n• Rough handling\n• Environmental factors\n• Lack of moisture\n\nRecovery:\n• Deep conditioning weekly\n• Trim damaged ends\n• Gentle handling\n• Minimize heat/chemicals\n• Use our app to track progress!";
    }

    // What is my hair type?
    if ((lowerQuestion.includes('hair type') || lowerQuestion.includes('what type') || lowerQuestion.includes('what is my hair')) && 
        (lowerQuestion.includes('what') || lowerQuestion.includes('my') || lowerQuestion.includes('is'))) {
      return "What is YOUR hair type?\n\nThere are 4 main hair types:\n\n• TYPE 1: STRAIGHT\n   - No curl pattern, lies flat\n   - 1A: Fine, soft, very straight\n   - 1B: Medium texture, slight body\n   - 1C: Coarse, may have slight bends\n   - Gets oily faster (oils travel down easily)\n\n• TYPE 2: WAVY\n   - S-shaped pattern\n   - 2A: Fine, thin waves\n   - 2B: Medium waves, more defined\n   - 2C: Thick, coarse, prone to frizz\n   - Needs balance of moisture and volume\n\n• TYPE 3: CURLY\n   - Well-defined spiral curls\n   - 3A: Loose, big curls\n   - 3B: Springy ringlets\n   - 3C: Tight corkscrew curls\n   - Naturally drier, needs lots of moisture\n\n• TYPE 4: KINKY/COILY\n   - Tight coils, zigzag patterns\n   - 4A: Soft, tight coils\n   - 4B: Z-pattern, sharp angles\n   - 4C: Very tight, fragile, high shrinkage\n   - Driest type, needs maximum moisture\n\nHOW TO IDENTIFY YOUR HAIR TYPE:\n1. Take a hair analysis scan in our app\n2. Our AI will detect your hair type\n3. View your results with confidence scores\n4. Get personalized care recommendations\n\nEach hair type needs different care:\n• Different wash frequencies\n• Different products\n• Different styling techniques\n• Different conditioning needs\n\nTake a hair scan now to identify YOUR specific hair type and get personalized care instructions!";
    }

    // Out of scope check - only block clearly unrelated questions
    const clearlyOutOfScope = (
      (lowerQuestion.includes('weather') || lowerQuestion.includes('temperature')) ||
      (lowerQuestion.includes('news') || lowerQuestion.includes('politics')) ||
      (lowerQuestion.includes('math') || lowerQuestion.includes('calculate') || lowerQuestion.includes('equation')) ||
      (lowerQuestion.includes('recipe') && !lowerQuestion.includes('hair')) ||
      (lowerQuestion.includes('joke') || lowerQuestion.includes('funny')) ||
      (lowerQuestion.includes('doctor') && !lowerQuestion.includes('hair') && !lowerQuestion.includes('scalp')) ||
      (lowerQuestion.includes('medical') && !lowerQuestion.includes('hair') && !lowerQuestion.includes('scalp')) ||
      (lowerQuestion.includes('alopecia') && !lowerQuestion.includes('hair')) ||
      (lowerQuestion.includes('cut') && (lowerQuestion.includes('bob') || lowerQuestion.includes('mohawk') || lowerQuestion.includes('pixie'))) ||
      (lowerQuestion.includes('hairstyle') && (lowerQuestion.includes('bob') || lowerQuestion.includes('mohawk') || lowerQuestion.includes('pixie'))) ||
      (lowerQuestion.includes('dye') && !lowerQuestion.includes('hair') && !lowerQuestion.includes('color')) ||
      (lowerQuestion.includes('bleach') && !lowerQuestion.includes('hair')) ||
      (lowerQuestion.includes('highlight') && !lowerQuestion.includes('hair') && !lowerQuestion.includes('color'))
    );
    
    if (clearlyOutOfScope) {
      return null;
    }

    return null;
  };

  const handleExampleQuestion = (question: string) => {
    setShowWelcome(false);
    // Clear input immediately
    setInputText("");
    // Send the question (this will add to existing messages, not replace them)
    sendMessage(question);
  };

  const sendMessage = (questionText?: string) => {
    const textToSend = questionText || inputText.trim();
    if (!textToSend) return;

    setShowWelcome(false);

    const userMessage: Message = {
      id: Date.now().toString(),
      text: textToSend,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);

    // Show thinking indicator
    setIsThinking(true);

    if (!questionText) {
      setInputText("");
    }

    // Get AI response
    // We use a small timeout to allow the UI to update and show "Thinking..."
    setTimeout(async () => {
      let responseText: string | null = getScriptedResponse(textToSend);
      
      // If no scripted response found, ask Gemini
      if (!responseText) {
        try {
          responseText = await askGemini(textToSend);
        } catch (error) {
          console.error("Gemini Error:", error);
          responseText = "I'm having trouble connecting to the internet right now. Please check your connection and try again.";
        }
      }

      setIsThinking(false);
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText || "I'm not sure how to answer that yet.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 100);
  };

  return (
    <View className="flex-1 bg-[#FFF2E4]">
      {/* Fixed Header */}
      <View className="w-full bg-[#3F2305] rounded-b-3xl pt-12 pb-6">
        <View className="flex-row items-center justify-center relative">
          <Pressable 
            onPress={() => router.push('/homepage')} 
            className="absolute left-6"
            style={{ top: '50%', transform: [{ translateY: -10 }] }}>
            <Image
              source={require('../assets/images/arrow.png')}
              style={{ width: 24, height: 24, tintColor: '#FAF7F0' }}
              resizeMode="contain"/>
          </Pressable>
          
          <View className="items-center justify-center px-16">
            <Text className="text-[#FAF7F0] text-3xl font-bold text-center">
              PocketSalon Assistant
            </Text>
            <Text className="text-[#FAF7F0] text-base text-center mt-2">
              Ask about hair types, care routines & health tips
            </Text>
          </View>

          <View className="absolute right-6" style={{ top: '50%', transform: [{ translateY: -10 }] }}>
            <Ionicons name="chatbubble-ellipses-outline" size={28} color="#FAF7F0" />
          </View>
        </View>
      </View>

      {/* Scrollable Content */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
        keyboardVerticalOffset={0}>
        {showWelcome && messages.length === 0 ? (
          <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
            {/* What I can help you with */}
            <Text className="text-[#3F2305] text-xl font-bold mb-4">What I can help you with:</Text>
            <View className="mb-6">
              {capabilities.map((capability, index) => (
                <View key={index} className="flex-row items-center mb-3">
                  <Ionicons name={capability.icon} size={20} color="#3F2305" style={{ marginRight: 12 }} />
                  <Text className="text-[#3F2305] text-base flex-1">{capability.text}</Text>
                </View>
              ))}
            </View>

            {/* Try asking */}
            <Text className="text-[#3F2305] text-xl font-bold mb-4 mt-2">Try asking:</Text>
            <View className="mb-6">
              {getRandomQuestions(3).map((question, index) => (
                <Pressable
                  key={index}
                  onPress={() => handleExampleQuestion(question)}
                  className="bg-gray-200 rounded-lg px-4 py-3 mb-3">
                  <Text className="text-[#3F2305] text-base">{question}</Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>
        ) : (
          <ScrollView
            ref={scrollViewRef}
            className="flex-1 px-4 py-4"
            contentContainerStyle={{ paddingBottom: 20 }}>
            {messages.map((message) => (
              <View
                key={message.id}
                className={`mb-4 ${message.isUser ? 'items-end' : 'items-start'}`}>
                <View
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.isUser ? 'bg-[#3F2305]' : 'bg-[#F2EAD3]'
                  }`}>
                  <Text className={`text-base ${message.isUser ? 'text-white' : 'text-[#3F2305]'}`}>
                    {message.text}
                  </Text>
                </View>
              </View>
            ))}
            {isThinking && (
              <View className="mb-4 items-start">
                <View className="max-w-[80%] rounded-2xl px-4 py-3 bg-[#F2EAD3]">
                  <Text className="text-base text-[#3F2305] italic">
                    Thinking...
                  </Text>
                </View>
              </View>
            )}
            {/* Show example questions after AI response (when not thinking and last message is from AI) */}
            {!isThinking && messages.length > 0 && messages[messages.length - 1]?.isUser === false && (
              <View className="mt-4 mb-2">
                <Text className="text-[#3F2305] text-lg font-bold mb-3">Try asking:</Text>
                <View>
                  {getRandomQuestions(3).map((question, index) => (
                    <Pressable
                      key={index}
                      onPress={() => handleExampleQuestion(question)}
                      className="bg-gray-200 rounded-lg px-4 py-3 mb-3">
                      <Text className="text-[#3F2305] text-base">{question}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            )}
          </ScrollView>
        )}

        {/* Input */}
        <View className="bg-white border-t border-[#DFD7BF] px-4 py-3 flex-row items-center">
          <TextInput
            value={inputText}
            onChangeText={setInputText}
            placeholder="Ask me anything about hair care..."
            placeholderTextColor="#3F2305"
            className="flex-1 bg-[#F5F5F5] rounded-full px-4 py-4 mr-2 text-base"
            multiline
            maxLength={200}
            onSubmitEditing={() => sendMessage()}
            returnKeyType="send"
          />
          <Pressable 
            onPress={() => sendMessage()} 
            className="bg-[#3F2305] rounded-full items-center justify-center"   
            style={{width: 50, height: 50 }}>
            <Image
              source={require('../assets/images/arrow.png')}
              style={{ width: '50%', height: '50%', resizeMode: 'contain', transform: [{ rotate: '180deg' }]}}
              resizeMode="contain"/>
          </Pressable>
        </View>

        {/* Bottom Bar - Feedback Icons (shown when in chat mode) */}
        {!showWelcome && messages.length > 0 && (
          <View className="bg-white border-t border-[#DFD7BF] px-4 py-2 flex-row justify-center items-center opacity-50">
            <Pressable className="mx-4">
              <Ionicons name="thumbs-up-outline" size={24} color="#3F2305" />
            </Pressable>
            <Pressable className="mx-4">
              <Ionicons name="thumbs-down-outline" size={24} color="#3F2305" />
            </Pressable>
            <Pressable className="mx-4">
              <Ionicons name="download-outline" size={24} color="#3F2305" />
            </Pressable>
          </View>
        )}
      </KeyboardAvoidingView>

    </View>
  );
}
