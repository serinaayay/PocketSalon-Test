// Product images mapping
export const productImages: { [key: string]: any } = {
  'human-heart-moisturizing-shampoo': require('../assets/products/shampoo/Human Heart - Moisturizing Shampoo.jpg'),
  'Kathare - Anti Hair Fall': require('../assets/products/shampoo/Kathare - Anti Hair Fall.jpg'),
  'Kathare Anti-Dandruff': require('../assets/products/shampoo/Kathare- Anti-Dandruff.jpg'),
  'Kathare Anti Oily': require('../assets/products/shampoo/Kathare - Anti Oily.jpg'),
  'Sibol Anti-Dandruff': require('../assets/products/shampoo/Sibol - Anti Dandruff Shampoo Bar.jpg'),
  'Zenutrients - Tea Tree Scalp': require('../assets/products/shampoo/Zenutrients - Tea Tree Scalp Shampoo.jpg'),
  'Creamsilk - Triple Keratine': require('../assets/products/conditioner/Creamsilk - Triple Keratine Rescue.jpg'),
  'Zenutrients - Gugo Strengthening Shampoo': require('../assets/products/shampoo/Zenutrients - Gugo Strengthening Shampoo.jpg'),

};

export type Product = {
  id: string;
  name: string;
  description: string;
  imageKey: string; // key into productImages
  categories?: string[]; // tags like "Sulfate-free", "Hydrating"
  productType: string; // e.g. Shampoo, Conditioner
  hairTypes?: string[]; // optional targeting
  scalpCondition?: string[]; // optional targeting
  hairDamage?: string[]; // optional targeting (e.g., ['Hair Loss', 'Breakage'])
};

export const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Human Heart Nature - Moisturizing Shampoo',
    description:
      '99.24% Natural | sulfate-free | paraben-free | Best for: Hydrating & softening dry, rough hair.',
    imageKey: 'human-heart-moisturizing-shampoo',
    productType: 'Shampoo',
    scalpCondition: ['Dry'],
 
  },
  {
    id: '2',
      name: 'Kathare - Anti Hair Fall Shampoo',
    description:
      'Meticulously crafted with Gugo Extract, this vibrant bar actively works to combat hair fall while delivering a delightfully invigorating cleanse. This gentle formula, infused with nourishing Jojoba and Coconut Oils, leaves your hair feeling incredibly fresh, soft, and visibly more resilient with every sustainable wash.',
    imageKey: 'Kathare - Anti Hair Fall',
    categories: ['Sulfate-free'],
    productType: 'Shampoo',
    hairDamage: ['Hair Loss'],
   
  },
    {
      id: '3',
      name: 'Kathare Anti-Dandruff Shampoo',
      description:
        'This gentle bar cleanses while giving profound relief to scalps with dandruff and irritation. It also nurtures your scalp back to serenity, leaving your hair soft and healthy.',
      imageKey: 'Kathare Anti-Dandruff',
      scalpCondition: ['Dandruff', 'Dry'],
      productType: 'Shampoo',
    },
    {
      id: '4',
      name: 'Sibol Health Shine Shampoo',
      description:
        'Formulated with natural oils and botanicals like Gugo, Moringa, Aloe Vera, Chamomile, and Tsubaki seed oil to nourish, moisturize, and add shine to colored, damaged, or dry hair.',
      imageKey: 'Sibol Anti-Dandruff',
      productType: 'Shampoo',
      scalpCondition: ['Dry'],
    hairDamage: ['Breakage', "Color Damage"],
      
    },
    {
      id: '5',
      name: 'Zenutrients - Tea Tree Scalp Shampoo',
      description:
        'Our range of shampoos have no sulfates, no phthalates and no parabens, only good ingredients so you have good hair. Use the Tea Tree Shampoo if you are bothered by itchy, flaking, imbalanced (dry / oily) scalp. Great for getting your hair and scalp rebalanced and healthy.',
      imageKey: 'Zenutrients - Tea Tree Scalp',
      productType: 'Shampoo',
      scalpCondition: ['Dry', 'Oily'],
    },
    {
      id: '6',
      name: 'Zenutrients - Gugo Strengthening Shampoo',
      description:
        'This treatment nourishes your scalp to strengthen hair from root to tip. It promotes healthy hair growth, prevents hair fall and breakage, and helps eliminate dandruff and itchiness for a cleaner, healthier scalp.',
       imageKey: 'Zenutrients - Gugo Strengthening Shampoo',
      productType: 'Serum',
      scalpCondition: ['Dandruff'],
    hairDamage: ['Hair Breakage'],
    },
    {
      id: '7',
      name: 'Kathare Anti Oily Shampoo',
      description:
        'Handcrafted and infused with delicate floral notes, this shampoo bar elevates your hair care into a peaceful, gentle cleansing experience. Made for our humid climate, it calms the senses and leaves your hair feeling exceptionally soft, manageable, and beautifully refreshed.',
      imageKey: 'Kathare Anti Oily',
      productType: 'Shampoo',
      scalpCondition: ['Oily'],
    },
];

export function recommendProducts(preferences: {
  requiredCategories?: string[]; // e.g. ["Sulfate-free"]
  hairType?: string; // optional hair type to prefer
  scalpCondition?: string; // optional scalp condition to prefer
  hairDamage?: string; // optional hair damage to prefer
  limit?: number;
}): Product[] {
  if (!preferences) return sampleProducts;
  const { requiredCategories = [], hairType, scalpCondition, limit = 6 } = preferences;

  const scored = sampleProducts
    .map((product) => {
      let score = 0;
      for (const tag of requiredCategories) {
        if (product.categories?.map((c) => c.toLowerCase()).includes(tag.toLowerCase())) {
          score += 2; // strong boost for matching category like Sulfate-free
        }
      }
      if (hairType && product.hairTypes?.some((t) => t.toLowerCase() === hairType.toLowerCase())) {
        score += 1;
      }
      if (scalpCondition && product.scalpCondition?.some((s) => s.toLowerCase() === scalpCondition.toLowerCase())) {
        score += 2;
      }
      // Also consider hair-damage targeting
      if (preferences && (preferences as any).hairDamage) {
        const target = String((preferences as any).hairDamage).toLowerCase();
        if (product.hairDamage?.some((d) => d.toLowerCase() === target)) {
          score += 2;
        }
      }
      return { product, score };
    })
    .filter((x) => x.score > 0 || requiredCategories.length === 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.product);

  return scored;
}

export const getProductImage = (imageKey: string) => productImages[imageKey];
