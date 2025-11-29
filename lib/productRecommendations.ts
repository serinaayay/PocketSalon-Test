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
  'Naturals WS': require('../assets/products/shampoo/50000073 WATSONS NATURALS ALOE VERA SHAMPOO 490ML_FRONT-h4Hzdfz7-zoom.jpg'),
  'The Body Shop - Tea Tree Purify Shampoo': require('../assets/products/shampoo/The body shop tea tree.jpg'),
  'LUXE Organix - Dandruff Control Silky Smooth Shampoo': require('../assets/products/shampoo/Sibol - Health Shine Shampoo Bar.jpg'),
  'Natural WS - Naturals Argan Hair Oil': require('../assets/products/shampoo/Natural WS - Hair OIl.jpg'),
  'Human Nature - Puro Jojoba Oil': require('../assets/products/shampoo/Natural WS - Hair OIl.jpg'),
  'Palmolive - Silky Straight with Keratin Shampoo': require('../assets/products/shampoo/Palmolive - Silky Straight.jpg'),
  'Creamsilk - Triple Keratine Rescue Conditioner Ultimate Straight': require('../assets/products/conditioner/Creamsilk - Triple Keratine Ultimate Straight.jpg'),
  'Tresemme - Conditioner Keratine Smooth': require('../assets/products/conditioner/Tresemme- Conditioner Keratine Smooth.jpg'),
  'Pantene - 3 Minute Miracle Intensive Conditioner Keratin': require('../assets/products/conditioner/Pantene - 3 Minute Miracle Intensive Conditioner Keratin.jpg'),
  'LUXE Organix - Premium Keratin Castor Oil Shampoo': require('../assets/products/shampoo/Luxe organiz - Premium Keratin Castor Oil.jpg'),
  'LUXE Organix - Milk Protein Keratin Shampoo': require('../assets/products/shampoo/Lo_KeratinShampooMilk Protein_50041084  (1)-5hJ6BD2C-zoom.jpg'),
  'Watsons - Smooth and Sleek Shampoo Ylang Ylang & Coconut': require('../assets/products/shampoo/Smooth and Sleek Shampoo Ylang Ylang.jpg'),
  'Kracie "Ichikami" - Japanase Shampoo': require('../assets/products/shampoo/Kracie - Japanese Shampoo.jpg'),
  'Bremod - Cocoa Butter Hair Shampoo': require('../assets/products/shampoo/Bremod Shampoo.jpg'),
  'Bremod - Cocoa Butter Hair Conditioner': require('../assets/products/conditioner/bremod - conditioner.jpg'),
  'LUXE Organix - Curl Define Intensive Hydration Shampoo': require('../assets/products/shampoo/Luxe Organix - Curl Define.jpg'),
  'Goldwell - Dual Senses Curls & Waves Hydrating Shampoo': require('../assets/products/shampoo/curls and waves shampoo.jpg'),
  'Zenutrients - Curl Avocado & Tea Tree Sulfate-Free Shampoo': require('../assets/products/shampoo/Zenutrients - Curls avocado.jpg'),
  'LUXE Organix - Bye Brass Purple Shampoo': require('../assets/products/shampoo/bye brass purple shampoo.jpg'),
  'Ichikami - Damage and Color Care Shampoo': require('../assets/products/shampoo/ichikami damage and color shampoo.jpg'),
  'Joico - Colorful Anti-Fade Shampoo': require('../assets/products/shampoo/joico colorful.jpg'),
  'Not Your Mother\'s - Kinky Moves Curl Defining Hair Cream': require('../assets/products/shampoo/not your mother\'s  - kinky moves.jpg'),
  'The Body Shop - Jamaican Black Castor Oil Curl Activator': require('../assets/products/shampoo/Jamaican_Black_Castor_Oil_Curl_Activator_1_540x.jpg'),
  'It\'s a 10 - Coily Miracle Hydrating Shampoo': require('../assets/products/shampoo/it\'s a 10 - coily miracle.jpg'),
  'Yves Rocher - Anti Hair Loss Fortifying Shampoo': require('../assets/products/shampoo/yves-rocher-1585-7203033-1.jpg'),
  'Khaokho Talaypu Advanced Repair Treatment': require('../assets/products/shampoo/Zenutrients - Curls avocado.jpg'),
  'Nanny Rose Gugo & Lawat Anti Hair Fall': require('../assets/products/shampoo/Nanny Rose Gugo Lawat.png'),
  'HASK Curl Care Moisturizing Shampoo': require('../assets/products/shampoo/HASK Curl Care Moisturizing.jpeg'),
  'Kathare Strawberry Swirl': require('../assets/products/conditioner/kathare strawb.jpg'),
  'Kathare Coco Dreams': require('../assets/products/conditioner/kathare coco dreams.jpg'),
  'Kathare Lavender Lover': require('../assets/products/conditioner/kathare - lavander lover.jpg'),
  'Kathare Gugo Blossom': require('../assets/products/conditioner/kathare - gugo blossom.jpg'),
  'Shea Moisture Coconut Hibiscus Conditioner': require('../assets/products/conditioner/shea moisture conditioner.jpg'),
  'Davines LOVE Curl Conditioner': require('../assets/products/conditioner/davines - love curl.jpg'),
  'Maui Moisture Revive Hydrate Shea Butter Conditioner': require('../assets/products/conditioner/maui-moisture-revive-hydrate-shea-butter-conditioner-385ml.jpg'),
  'Zenutrients Argan Chamomile Conditioner': require('../assets/products/conditioner/zenutrients - argan and chamomile.jpg'),
  'Zenutrients Tea Tree Scalp Conditioner': require('../assets/products/conditioner/zenutrients - tea tree scalp condi.jpg'),

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
  ingredients?: string[]; // optional targeting
  price?: number; // optional targeting
  link?: string; // optional targeting
  isLocal?: boolean; // indicates if product is from local/Philippine brand
  isNatural?: boolean; // indicates if product is natural/organic
};

export const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Human Heart Nature - Moisturizing Shampoo',
    description:
      '99.24% Natural \n Sulfate-Free \n Paraben-Free \n\n Best for: Hydrating & softening dry, rough hair.',
    imageKey: 'human-heart-moisturizing-shampoo',
    productType: 'Shampoo',
    scalpCondition: ['Dry'],
    hairTypes: ['Straight','Wavy'],
    price: 156.51,
    link: 'https://humanheartnature.com/buy/moisturizing-shampoo-2018.html?srsltid=AfmBOop9Pshy69OgosP_o1iMeRJPXfol4f2r7yHx7vTqNVTYwOrY6XkO',
    isLocal: true,
    isNatural: true,
    ingredients: [
      "aqua (water)",
      "sodium cocoyl isethionate",
      "decyl glucoside",
      "coco-glucoside",
      "Cocos nucifera (coconut) nectar",
      "Persea gratissima (avocado) oil",
      "Aloe barbadensis (aloe vera) leaf juice",
      "Citrus aurantium dulcis (orange) peel essential oil",
      "Cymbopogon flexuosus (lemon grass) essential oil",
      "Cyamopsis tetragonolobus (guar) gum",
      "olus oil",
      "tocopherol (Vitamin E)",
      "dicaprylyl ether",
      "sodium gluconate",
      "sodium lactate",
      "xanthan gum",
      "p-anisic acid",
      "glycerin",
      "levulinic acid",
      "sodium levulinate",
      "citric acid",
      "potassium sorbate",
      "sodium benzoate",
      "coconut acid",
      "sodium isethionate",
      "benzoic acid"
    ]
 
  },
  {
    id: '2',
      name: 'Kathare - Anti Hair Fall Shampoo',
    description:
      'Meticulously crafted with Gugo Extract, this vibrant bar actively works to combat hair fall while delivering a delightfully invigorating cleanse. This gentle formula, infused with nourishing Jojoba and Coconut Oils, leaves your hair feeling incredibly fresh, soft, and visibly more resilient with every sustainable wash. The handcrafted shampoo bar is ideal for hair fall, hair thinning, and hairs that are prone to oiliness or heaviness.',
    imageKey: 'Kathare - Anti Hair Fall',
    categories: ['Sulfate-free'],
    productType: 'Shampoo',
    hairDamage: ['Hair Loss'],
    price: 320,
    link: 'https://kathare.store/products/citrus-kiss-shampoo-bar?pr_prod_strat=e5_desc&pr_rec_id=4cbecf7bf&pr_rec_pid=6978645885135&pr_ref_pid=6904151965903&pr_seq=uniform',
    isLocal: true,
    isNatural: true,
    ingredients: [
      "Sodium Cocoyl Isethionate",
      "Cocamidopropyl Betaine",
      "Cetearyl Alcohol",
      "Stearic Acid",
      "Cetyl Alcohol",
      "Behentrimonium Methosulfate",
      "Citric Acid",
      "Parfum (Fragrance)",
      "Butyrospermum Parkii (Shea) Butter",
      "Sodium Lactate",
      "Cetrimonium Chloride",
      "Cocos Nifera (Coconut) Oil",
      "Ricinus Communis (Castor) Seed Oil",
      "Entada Phaseoloides (Gugo) Extract",
      "Sodium Benzoate",
      "Apple Cider Vinegar",
      "Colorant",
      "Panthenol"
    ]
   
  },
    {
      id: '3',
      name: 'Kathare Anti-Dandruff Shampoo',
      description:
        'This gentle bar cleanses while giving profound relief to scalps with dandruff and irritation. It also nurtures your scalp back to serenity, leaving your hair soft and healthy.',
      imageKey: 'Kathare Anti-Dandruff',
      scalpCondition: ['Dandruff', 'Dry'],
      productType: 'Shampoo',
      price: 320,
      link: 'https://kathare.store/products/avocado-fresco-shampoo-bar-anti-dandruff',
      isLocal: true,
      isNatural: true,
      ingredients: [
        "Sodium Cocoyl Isethionate",
        "Cocamidopropyl Betaine",
        "Cetearyl Alcohol",
        "Stearic Acid",
        "Cetyl Alcohol",
        "Behentrimonium Methosulfate",
        "Citric Acid",
        "Parfum (Fragrance)",
        "Butyrospermum Parkii (Shea) Butter",
        "Sodium Lactate",
        "Cetrimonium Chloride",
        "Cocos Nucifera (Coconut) Oil",
        "Melaleuca Alternifolia (Tea Tree) Leaf Oil",
        "Aloe Barbadensis Leaf Extract",
        "Sodium Benzoate",
        "Apple Cider Vinegar",
        "Colorant",
        "Panthenol"
      ]
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
      price: 229.75,
      link: 'https://www.kulturafilipino.com/products/healthy-shine-shampoo-bar-75-grams',
      isLocal: true,
      isNatural: true,
      ingredients: [
        "Chamomile",
        "Moringa",
        "Aloe Vera",],
      
    },
    {
      id: '5',
      name: 'Zenutrients - Tea Tree Scalp Shampoo',
      description:
        'Our range of shampoos have no sulfates, no phthalates and no parabens, only good ingredients so you have good hair. Use the Tea Tree Shampoo if you are bothered by itchy, flaking, imbalanced (dry / oily) scalp. Great for getting your hair and scalp rebalanced and healthy.',
      imageKey: 'Zenutrients - Tea Tree Scalp',
      productType: 'Shampoo',
      scalpCondition: ['Dry', 'Oily'],
      price: 109,
      link: 'https://www.watsons.com.ph/zenutrients-shampoo-tea-tree-scalp-treatment-100ml/p/BP_50025769',
      isLocal: true,
      isNatural: true,
      ingredients: [
        "Aqua",
        "Cocamidopropyl betaine",
        "Cocamide MEA",
        "Coco Diethanolamide",
        "Methyl Ester Sulfonate",
        "Glycerin",
        "Sodium Chloride",
        "Phenoxyethanol",
        "Mentha piperita Oil",
        "Melaleuca Alternifolia Leaf Oil"
      ]
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
      price: 249,
      link: 'https://www.watsons.com.ph/zenutrients-gugo-strengthening-shampoo-250ml/p/BP_50012331',
      isLocal: true,
      isNatural: true,
      ingredients: [
        "Aqua",
        "Cocamidopropyl betaine",
        "Cocamide MEA",
        "Coco Diethanolamide",
        "Methyl Ester Sulfonate",
        "Glycerin",
        "Entada Phaseoloides",
        "Sodium Chloride",
        "Essence",
        "Phenoxyethanol",
        "Melaleuca Alternifolia Leaf Oil",
        "Eucalyptus Globulus Leaf Oil"
      ]
    },
    {
      id: '7',
      name: 'Kathare Anti Oily Shampoo',
      description:
        'Handcrafted and infused with delicate floral notes, this shampoo bar elevates your hair care into a peaceful, gentle cleansing experience. Made for our humid climate, it calms the senses and leaves your hair feeling exceptionally soft, manageable, and beautifully refreshed.',
      imageKey: 'Kathare Anti Oily',
      productType: 'Shampoo',
      scalpCondition: ['Oily'],
      price: 330,
      link: 'https://kathare.store/products/lilac-sky-shampoo-bar-calming-cleanse',
      isLocal: true,
      isNatural: true,
      ingredients: [
        "Sodium Cocoyl Isethionate",
        "Cocamidopropyl Betaine",
        "Cetearyl Alcohol",
        "Stearic Acid",
        "Cetyl Alcohol",
        "Behentrimonium Methosulfate",
        "Citric Acid",
        "Parfum (Fragrance)",
        "Butyrospermum Parkii (Shea) Butter",
        "Sodium Lactate",
        "Cetrimonium Chloride",
        "Simmondsia Chinensis (Jojoba) Seed Oil",
        "Ricinus Communis (Castor) Seed Oil",
        "Mentha Piperita (Peppermint) Oil",
        "Lavandula Angustifolia (Lavender) Oil",
        "Sodium Benzoate",
        "Apple Cider Vinegar",
        "Colorant",
        "Panthenol",
        "Sesamum Indicum (Sesame) Seed"
      ]
    },
    {
      id: '8',
      name: 'Creamsilk - Triple Keratine',
      description:
        'Cream Silk\'s most advanced 3-in-1 conditioning system yet, that combines the benefits of 3 Keratin products: Keratin relaxers to tame rebellious frizz, Keratin serum to to revive intense, damage, Keratin essence to restore extreme dullness. Has 3x the keratin in our 1 ultimate solution.',
      imageKey: 'Creamsilk - Triple Keratine',
      productType: 'Conditioner',
      hairDamage: ['Color Damage'],
      price: 259,
      link: 'https://www.watsons.com.ph/creamsilk-triple-keratin-rescue-ultimate-color-revive-150ml/p/BP_50004015',
      isLocal: true,
      isNatural: false,
      ingredients: [
        "Water",
        "Sodium Laureth Sulfate",
        "Dimethiconol",
        "Cocamidopropyl Betaine",
        "Sodium chloride",
        "Dimethicone",
        "Perfume",
        "Phenoxyethanol",
        "Piroctone Olamine",
        "Carbomer",
        "Sodium Salicylate",
        "Guar Hydroxypropyltrimonium Chloride",
        "Sodium hydroxide",
        "TEA-Dodecylbenzenesulfonate",
        "TEA-Sulfate",
        "Glycerin",
        "Citric acid",
        "Poloxamer 407",
        "Laureth-23",
        "Helianthus Annuus (Sunflower) Seed Oil",
        "Cyclotetrasiloxane",
        "Sodium benzoate",
        "Laureth-4",
        "PEG-4",
        "Glycine",
        "Niacinamide",
        "Melaleuca Alternifolia (Tea Tree) Leaf Oil"
      ]
    },
    {
      id: '9',
      name: 'Naturals WS - Aloe Vera Shampoo',
      description:
        'Naturals by Watsons Aloe Vera Hair range contains 99% Certified Organic Aloe Vera. Known as the "Miracle Plant", Aloe Vera nourishes the hair and helps it stay smooth and hydrated (from concentrated Aloe Vera Powder).',
      imageKey: 'Naturals WS',
      productType: 'Conditioner',
      scalpCondition: ['Dry'],
      price: 269,
      link: 'https://www.watsons.com.ph/naturals-ws-aloe-vera-shampoo-490ml/p/BP_50000073?',
      isLocal: true,
      isNatural: true,
      ingredients: [
        "Algae Extract",
        "Gluconolactone",
        "Rosa Canina Flower Extract",
        "Triticum Vulgare (Wheat) Germ Extract",
        "Cucumis Sativus (Cucumber) Fruit Extract",
        "Sodium Chloride",
        "Crambe Abyssinica Seed Oil",
        "Arginine",
        "Chamomilla Recutita (Matricaria) Flower Extract",
        "Water",
        "Caprylic/Capric Triglyceride",
        "Calcium Gluconate",
        "Canola Oil",
        "Butylene Glycol",
        "Glycerin",
        "Propylene Glycol",
        "Glycine Soja (Soybean) Germ Extract",
        "Tartaric Acid",
        "Persea Gratissima (Avocado) Oil",
        "Salicylic Acid",
        "Polyquaternium-10",
        "Propanediol",
        "Laminaria Digitata Extract",
        "Scutellaria Baicalensis Root Extract",
        "Hibiscus Sabdariffa Flower Extract",
        "Ascorbic Acid (Vitamin C)",
        "Citric Acid",
        "Tetrasodium EDTA",
        "Camellia Sinensis (Green Tea) Leaf Extract",
        "Sodium Laureth Sulfate",
        "Sodium Benzoate",
        "Tocopheryl Acetate (Vitamin E)",
        "Tocopheryl Acetate (Vitamin E)",
        "Potassium Sorbate",
        "Polysorbate 20",
        "Polyquaternium-7",
        "Lactic Acid",
        "Cocamidopropyl Betaine",
        "Phenoxyethanol",
        "DMDM Hydantoin",
        "Fragrance",
        "Aloe Barbadensis (Aloe Vera) Juice",
        "Cocamide MEA",
        "Malic Acid",
        "Aloe Barbadensis Leaf Extract",
        "Viola Odorata Flower Extract"
      ]
    },
    {
      id: '10',
      name: 'The Body Shop - Tea Tree Purify Shampoo',
      description:
        'Refresh oily hair with our super Tea Tree Purify Shampoo.',
      imageKey: 'The Body Shop - Tea Tree Purify Shampoo',
      productType: 'Shampoo',
      scalpCondition: ['Oily'],
      price: 595,
      link: 'https://thebodyshop.com.ph/products/tea-tree-purify-shampoo-250ml?variant=50683868709139&country=PH&currency=PHP',
      isLocal: false,
      isNatural: true,
    },
    {
      id: '11',
      name: 'Human Nature Strengthening Shampoo Sooting Aloe',
      description:
        '99.24 percent Natural. Best for helping strengthen weak, brittle hair. 80 percent experienced less hair fall, 90 percent observed thicker hair. Fortifies strands against breakage with hydrolyzed wheat protein. Nourishes hair with nutrient-rich Philippine coconut nectar.',
      imageKey: 'Naturals WS',
      productType: 'Shampoo',
      hairDamage: ['Breakage'],
      price: 329.75,
      link: 'https://www.watsons.com.ph/human-nature-human-nature-strengthening-shampoo-soothing-aloe-400ml/p/BP_50051611?',
      isLocal: true,
      isNatural: true,
      ingredients: [
        "aqua (water)",
        "sodium cocoyl isethionate",
        "decyl glucoside",
        "coco-glucoside",
        "Cocos nucifera (coconut) nectar",
        "Cyamopsis tetragonolobus (guar) gum",
        "Aloe barbadensis (aloe vera) leaf juice",
        "Persea gratissima (avocado) oil",
        "olus oil",
        "tocopherol (Vitamin E)",
        "dicaprylyl ether",
        "xanthan gum*",
        "p-anisic acid",
        "levulinic acid",
        "sodium levulinate",
        "glycerin",
        "sodium lactate",
        "sodium gluconate",
        "hydrolyzed wheat protein",
        "fragrance",
        "citric acid",
        "potassium sorbate",
        "sodium benzoate",
        "coconut acid",
        "sodium isethionate",
        "benzoic acid"
      ]
    },
    {
      id: '12',
      name: 'LUXE Organix - Dandruff Control Silky Smooth Shampoo',
      description:
        'Luxe Organix Dandruff Control Silky Smooth Shampoo is gently formulated with Aminoclear Technology which helps combat dandruff without stripping the scalp\'s natural oils and helps treat itchy and flaky scalp. Infused with Amino Acids, this shampoo makes hair silky and smooth while gently cleansing and soothing the scalp, leaving you totally flake-free.',
      imageKey: 'LUXE Organix - Dandruff Control Silky Smooth Shampoo',
      productType: 'Shampoo',
      scalpCondition: ['Dandruff'],
      price: 199,
      link: 'https://www.watsons.com.ph/luxe-organix-dandruff-control-silky-smooth-shampoo-240ml/p/BP_50042489?',
      isLocal: true,
      isNatural: false,
      ingredients: [
        "Water",
        "Sodium Laureth Sulfate",
        "Cocoamidopropyl Betaine",
        "Cocamide Mea",
        "Polyquaternium-10",
        "Glycol Distearate",
        "Zinc",
        "Pyrithione",
        "Dimethicone",
        "Methylchloroisothiazolinone",
        "Methylisothiazolinone",
        "Magnesium Nitrate",
        "Magnesium Chloride",
        "Acrylates Copolymer",
        "Glycerin",
        "Sodium Chloride",
        "Perfume",
        "Dmdm Hydantoin",
        "Bisabolol",
        "Niacinamide",
        "2-Bromo-2 Nitropropane-1,3-Diol",
        "Camellia Sinensis Leaf Extract",
        "Chrysanthellum Indicum Extract",
        "Panax Ginseng Extract"
      ]
    },
    {
      id: '13',
      name: 'Natural WS - Naturals Argan Hair Oil',
      description:
        'Luxe Organix Dandruff Control Silky Smooth Shampoo is gently formulated with Aminoclear Technology which helps combat dandruff without stripping the scalp\'s natural oils and helps treat itchy and flaky scalp. Infused with Amino Acids, this shampoo makes hair silky and smooth while gently cleansing and soothing the scalp, leaving you totally flake-free.',
      imageKey: 'Natural WS - Naturals Argan Hair Oil',
      productType: 'Hair Oil',
      scalpCondition: ['Dry'],
      hairDamage: ['Breakage'],
      price: 225,
      link: 'https://www.watsons.com.ph/naturals-ws-naturals-argan-oil-hair-oil-100ml/p/BP_10094887?',
      isLocal: true,
      isNatural: true,
      ingredients: [
        "Caprylic/Capric Triglyceride",
        "Helianthus Annuus (Sunflower) Seed Oil",
        "Sorbitan Oleate",
        "Parfum",
        "Tocopheryl Acetate",
        "Polyurethane-79",
        "Aqua",
        "Argania Spinosa (Argan) Kernel Oil*",
        "Crambe Abyssinica (Abyssinian) Seed Oil",
        "Niacinamide",
        "Panthenol",
        "Persea Gratissima (Avocado) Oil*",
        "Glycerin",
        "Triticum Vulgare (Wheat) Germ Extract*",
        "Argania Spinosa (Argan) Kernel Extract*",
        "Citric Acid",
        "Sodium Benzoate",
        "Potassium Sorbate",
        "D-Limonene",
        "Linalool",
        "Citronellol",
        "Geraniol",
        "Alpha-Isomethyl Ionone",
        "Coumarin",
        "Eugenol *ingredients from certified organic agriculture"
      ],
    },
     {
      id: '15',
      name: 'Human Nature - Puro Jojoba Oil',
      description:
        'Helps moisturize the skin & helps reduce dandruff & itchy scalp with its powerhouse of germ-fighting properties.',
      imageKey: 'Human Nature - Puro Jojoba Oil',
      productType: 'Hair Oil',
      scalpCondition: ['Dry','Dandruff'],
      hairDamage: ['Breakage'],
      price: 379.05,
      link: 'https://humanheartnature.com/buy/pure-jojoba-oil-30ml.html?',
      isLocal: true,
      isNatural: true,
      ingredients: ['Simmondsia chinensis (jojoba) seed oil'],
    },
    {
      id: '16',
      name: 'Palmolive - Silky Straight with Keratin Shampoo',
      description:
        'Infused with Keratin Protein, this formula helps repair chemically-damaged hair, strengthens frizzy, fly-away strands from root to tip, and leaves a long-lasting, irresistible fragrance.',
      imageKey: 'Palmolive - Silky Straight with Keratin Shampoo',
      productType: 'Shampoo',
      hairTypes: ['Straight'],
      price: 360,
      link: 'https://www.watsons.com.ph/palmolive-silky-straight-with-keratin-shampoo-600ml/p/BP_50014119?',
      isLocal: false,
      isNatural: false,
      ingredients: [
        "Water",
        "Ammonium Lauryl Sulfate",
        "Ammonium Laureth Sulfate",
        "Dimethiconol",
        "Cocamide MEA",
        "Glycol Distearate",
        "Perfume",
        "Sodium Chloride",
        "Cocamidopropyl Betaine",
        "Guar Hydroxypropyltrimonium Chloride",
        "Sodium Phosphate",
        "Glycerin",
        "Sorbitol",
        "Citric Acid",
        "Tetrasodium EDTA",
        "PEG-55 Stearate",
        "Laureth-4",
        "Sodium Benzoate",
        "Laureth-23",
        "Sodium Salicylate",
        "Cocos Nucifera Oil",
        "Hydrolyzed Soy Protein",
        "Hydrolyzed Keratin"
      ]
    },
    {
      id: '17',
      name: 'Creamsilk - Triple Keratine Rescue Conditioner Ultimate Straight',
      description:
        'This first-of-its-kind potent treatment cream, infused with an advanced triple keratin formula, deeply penetrates and intensely restores every strand, transforming hair into its ultimate beautiful state.',
      imageKey: 'Creamsilk - Triple Keratine Rescue Conditioner Ultimate Straight',
      productType: 'Conditioner',
      hairTypes: ['Straight'],
      price: 205.20,
      link:'https://shopsuki.ph/products/creamsilk-triple-keratine-rescue-conditioner-ultimate-straight-330ml?variant=33797038014596&currency=PHP',
      isLocal: true,
      isNatural: false,
      ingredients: [
        "Water",
        "Cetearyl Alcohol",
        "Behentrimonium Chloride",
        "Dimethicone",
        "Amodimethicone",
        "Glycerin",
        "Dipropylene Glycol",
        "Lysine HCl",
        "Hydrolyzed Keratin",
        "Argania Spinosa Kernel Oil",
        "Lactic Acid"
      ]
    },
    {
      id: '18',
      name: 'Tresemme - Conditioner Keratine Smooth',
      description:
        'Specially formulated with Argan Oil and Keratin, this product deeply nourishes hair to deliver five unbeatable benefits in a single wash—anti-frizz, detangling, shine, smoothing, and taming flyaways—beautifully transforming your hair to be velvety-smooth, less frizzy, and easy to style.',
      imageKey: 'Tresemme - Conditioner Keratine Smooth',
      productType: 'Conditioner',
      hairTypes: ['Straight'],
      price: 318.95,
      link:'https://shopsuki.ph/products/tresemme-conditioner-keratin-smooth-330ml?variant=33797038014596&currency=PHP',
      isLocal: false,
      isNatural: false,
      ingredients: [
        "Cetearyl Alcohol",
        "Behentrimonium Chloride",
        "Dimethicone",
        "Amodimethicone",
        "Hydrolyzed Keratin",
        "Butyrospermum Parkii (Shea) Butter",
        "Argania Spinosa Kernel Oil"
      ]
    },
    {
      id: '19',
      name: 'Pantene - 3 Minute Miracle Intensive Conditioner Keratin',
      description:
        'Pantene 3 Minute Miracle Intensive Conditioner Keratin Straight is a daily miracle conditioner for reduced frizz and a smooth, straight look. Your hair tends to lose its smoothness and gain frizz as it is exposed throughout the day.',
      imageKey: 'Pantene - 3 Minute Miracle Intensive Conditioner Keratin',
      productType: 'Conditioner',
      hairTypes: ['Straight'],
      price: 179,
      link: 'https://www.watsons.com.ph/pantene-3-minute-miracle-intensive-conditioner-keratin-straight-150ml/p/BP_50005675?',
      isLocal: false,
      isNatural: false,
      ingredients: [
        "Water",
        "Bis-Aminopropyl Dimethicone",
        "Stearyl Alcohol",
        "Behentrimonium Methosulfate",
        "Cetyl Alcohol",
        "Fragrance",
        "Isopropyl Alcohol",
        "Benzyl Alcohol",
        "Disodium EDTA",
        "Histidine",
        "Panthenol",
        "Panthenyl Ethyl Ether",
        "Citric Acid",
        "Methylchloroisothiazolinone",
        "Methylisothiazolinone",
        "CI 19140",
        "CI 17200",
        "CI 42090"
      ]
    },
    {
      id: '20',
      name: 'LUXE Organix - Premium Keratin Castor Oil Shampoo',
      description:
        'Luxe Organix Hair Professional premium keratin hair shampoo with castor oil is rich in antioxidants and fatty acids that help nourish hair follicles for stronger, longer, and thicker hair. A shampoo perfect for daily use. ',
      imageKey: 'LUXE Organix - Premium Keratin Castor Oil Shampoo',
      productType: 'Shampoo',
      hairTypes: ['Straight'],
      price: 249,
      link: 'https://shopee.ph/product/92328166/15346512455?gads_t_sig=VTJGc2RHVmtYMTlxTFVSVVRrdENkU1psNndicnpENjFrR2ZiZlcxU0ZES2FtVXpNQXZ6V3JCVEVUckVsWUJVdXArcWsyWGpiR2hhZlh5UHUrWnhUK2xaWGh4WjZRek10czhvWmI2czgvWmYrVjVzTWFtaFlxNGtxTCtBWmhZYk0',
      isLocal: true,
      isNatural: false,
      ingredients:[
        "Aqua",
        "Cetearyl Alcohol",
        "Stearamidopropyl Dimethylamine",
        "Steartrimonium Chloride",
        "Behentrimonium Chloride",
        "Amodimethicone",
        "Cetrimonium Chloride",
        "Trideceth-10",
        "Cyclopentasiloxane",
        "Dimethicone",
        "Parfum",
        "Castor Oil",
        "Citric Acid",
        "Methylchloroisothiazolinone",
        "Methylisothiazolinone"
      ]
    },
    {
      id: '21',
      name: 'LUXE Organix - Milk Protein Keratin Shampoo',
      description:
        'Luxe Organix Hair Professionals\' premium keratin hair shampoo with milk protein is rich in amino acids & lipids, which work to strengthen, restructure, and rebuild damaged hair shaft. This protein-rich shampoo restores the hair\'s natural protective layer while providing nourishment to the scalp.',
      imageKey: 'LUXE Organix - Milk Protein Keratin Shampoo',
      productType: 'Shampoo',
      hairTypes: ['Straight'],
      price: 129,
      link: 'https://www.watsons.com.ph/luxe-organix-milk-protein-premium-keratin-shampoo-210ml/p/BP_50041084?',
      isLocal: true,
      isNatural: false,
      ingredients: [
        "Aqua",
        "Sodium Laureth Sulfate",
        "Cocoamidopropyl betaine",
        "ammonium lauryl sulfate",
        "Acrylates copolymer",
        "cocamide dea",
        "Dimethicone",
        "Amodimethicone",
        "Cetrimonium Choloride",
        "Trideceth-10",
        "Polyquaternium-7",
        "Glycol Distearate",
        "Guar Hydroxypropyltrimonium Chloride",
        "Parfum",
        "Dmdm Hydantoin",
        "Milk Extract",
        "Hhydrolyzed Keratin",
        "Citric acid",
        "Methylchloroisothiazolinone",
        "Methylisothiazolinone",
        "Magnesium nitrate",
        "Magnesium Chloride"
      ]
    },
    {
      id: '22',
      name: 'Watsons - Smooth and Sleek Shampoo Ylang Ylang & Coconut',
      description:
        'Loving ourselves means feeling confident. With the right hair care range, you can treat your crown to the shine it deserves and experience the joy of having good hair days, every day.',
      imageKey: 'Watsons - Smooth and Sleek Shampoo Ylang Ylang & Coconut',
      productType: 'Shampoo',
      hairTypes: ['Straight'],
      price: 239,
      link: 'https://www.watsons.com.ph/watsons-smooth-and-sleek-shampoo-ylang-ylang-coconut-1l/p/BP_50007779?',
      isLocal: true,
      isNatural: false,
      ingredients: ["Aqua (Water)",
                    "Sodium Laureth Sulfate",
                    "Sodium Chloride",
                    "Cocamidopropyl Betaine",
                    "Parfum (Fragrance)",
                    "Glycol Distearate",
                    "Polyquaternium-7",
                    "Butyl Methoxydibenzoylmethane",
                    "Cocamide MEA",
                    "Sodium Benzoate",
                    "Citric Acid",
                    "Laureth-10",
                    "Polyquaternium-10",
                    "Propylene Glycol",
                    "Magnesium Nitrate",
                    "Glycerin",
                    "Methylchloroisothiazolinone",
                    "Panthenol",
                    "Magnesium Chloride",
                    "Cocos Nucifera (Coconut) Oil",
                    "Butylene Glycol",
                    "Cocos Nucifera (Coconut) Fruit Extract",
                    "PEG-60 Hydrogenated Castor Oil",
                    "Polysorbate 20",
                    "Sorbitol",
                    "Methylisothiazolinone",
                    "Sodium Acetate",
                    "Phenoxyethanol",
                    "Phenethyl Alcohol",
                    "Sodium Hydroxide",
                    "Caprylyl Glycol",
                    "Isopropyl Alcohol",
                    "Potassium Sorbate",
                    "Alaria Esculenta Extract",
                    "Pantolactone",
                    "Moringa Oleifera Seed Extract",
                    "Cananga Odorata Flower Oil",
                    "Ethylhexylglycerin",
                    "Disodium Phosphate",
                    "Helianthus Annuus (Sunflower) Seed Oil",
                    "Rosmarinus Officinalis (Rosemary) Leaf Extract",
                    "CI 15985 (Yellow 6)",
                    "CI 15510 (Orange 4)"],
    },
    {
      id: '23',
      name: 'Kracie "Ichikami" - Japanase Shampoo',
      description:
        'Discover the highly-rated (5/5 stars) Kracie "Ichikami" Shampoo, brought to you directly from Japan. This authentic Japanese hair care system is specially formulated for women, offering a premium solution for beautiful, healthy hair. ',
      imageKey: 'Kracie "Ichikami" - Japanase Shampoo',
      productType: 'Shampoo',
      hairTypes: ['Wavy'],
      price: 358,
      link: 'https://www.lazada.com.ph/products/kracie-ichikami-japanese-shampoo-conditioner-set-for-women-made-in-japan-i4447707196-s25212927864.html?',
      isLocal: false,
      isNatural: true,
    },
    {
      id: '24',
      name: 'Bremod - Cocoa Butter Hair Shampoo',
      description:
        'With its superior ability to be easily absorbed deep into the hair shaft, coconut oil coats and moisturizes the hair, reducing breakage and protecting it from protein loss and environmental damage like wind, sun, and smoke to help you grow longer, sleeker, and healthier-looking hair.',
      imageKey: 'Bremod - Cocoa Butter Hair Shampoo',
      productType: 'Shampoo',
      hairTypes: ['Wavy'],
      hairDamage: ['Breakage'],
      scalpCondition: ['Oily','Dandruff'],
      price: 165,
      link: 'https://shopee.ph/product/426990928/23676815278?gads_t_sig=VTJGc2RHVmtYMTlxTFVSVVRrdENkVlBXTnFLbGtLY21IOVhMT0xMVGhrdXdUKzBTd1pNaVIxN2h4bHFNODNiaHJwUTFyWU5KSTY5QXc1ZUFCMndPRDkzWmxGSlJIUXNqeDR6UjBFV1NVUStlSjFWRFBYeE9JUlF5S3FUSDZSKzc',
      isLocal: false,
      isNatural: true,
    },
    {
      id: '25',
      name: 'Bremod - Cocoa Butter Hair Conditioner',
      description:
        'With its superior ability to be easily absorbed deep into the hair shaft, coconut oil coats and moisturizes the hair, reducing breakage and protecting it from protein loss and environmental damage like wind, sun, and smoke to help you grow longer, sleeker, and healthier-looking hair.',
      imageKey: 'Bremod - Cocoa Butter Hair Conditioner',
      productType: 'Conditioner',
      hairTypes: ['Wavy'],
      hairDamage: ['Breakage'],
      scalpCondition: ['Oily','Dandruff'],
      price: 165,
      link: 'https://shopee.ph/product/426990928/23676815278?gads_t_sig=VTJGc2RHVmtYMTlxTFVSVVRrdENkVlBXTnFLbGtLY21IOVhMT0xMVGhrdXdUKzBTd1pNaVIxN2h4bHFNODNiaHJwUTFyWU5KSTY5QXc1ZUFCMndPRDkzWmxGSlJIUXNqeDR6UjBFV1NVUStlSjFWRFBYeE9JUlF5S3FUSDZSKzc',
      isLocal: false,
      isNatural: true,
    },
    {
      id: '26',
      name: 'LUXE Organix - Curl Define Intensive Hydration Shampoo',
      description:
        'Say goodbye to frizzy and tangled curls! The Luxe Organix Premium Curl and Define Shampoo gently cleanses the hair while effectively locking in moisture to prevent dryness. It is formulated with a blend of Jojoba, Avocado, and Moroccan Oil to keep curls strong, healthy, and bouncy. Embrace and revive your natural curls with this CGM-approved shampoo that is perfect for everyday use.',
      imageKey: 'LUXE Organix - Curl Define Intensive Hydration Shampoo',
      productType: 'Shampoo',
      scalpCondition: ['Dry'],
      hairTypes: ['Wavy','Curly'],
      price: 199,
      link: 'https://www.watsons.com.ph/luxe-organix-curl-define-intensive-hydration-daily-shampoo-220ml/p/BP_50042488?',
      isLocal: true,
      isNatural: false,
      ingredients: ["Aqua",
                    "Cocamidopropyl Betaine",
                    "Sodium Methylcocoyl Taurate",
                    "Laureth-5 Carboxylic Acid",
                    "Disodium Cocoamphodiacetate",
                    "Acrylates Copolymer",
                    "Cocamide Meaglycol Distearate",
                    "Cocamide Dea",
                    "Guar Hydroxypropyltrimonium Chloride",
                    "Parfum",
                    "Polyquaternium-10",
                    "Palmitamidoprop Titromonium Chloride",
                    "Sodium Hydroxide",
                    "DMDM Hydantoin",
                    "Citric Acid",
                    "Synthetic Jojoba Oil",
                    "Hydrogenated Avocado Oil",
                    "Argania Spinosa Kernel Oil",
                    "2-Bromo 2-Nitropropane-1,3-Diol",
                    "Methylisothiazolinone",
                    "Methylchloroisothiazolinone",
                    "Magnesium Nitrate",
                    "Magnesium Chloride"]
    },
    {
      id: '27',
      name: 'Goldwell - Dual Senses Curls & Waves Hydrating Shampoo',
      description:
        'Goldwell\'s Dual Senses Curls & Waves Hydrating Shampoo is specifically formulated to restore elasticity and provide essential moisture for naturally curly and wavy hair.',
      imageKey: 'Goldwell - Dual Senses Curls & Waves Hydrating Shampoo',
      productType: 'Shampoo',
      scalpCondition: ['Dry'],
      hairTypes: ['Wavy','Curly'],
      price: 1005,
      link: 'https://www.zalora.com.ph/p/goldwell-goldwell-dual-senses-curls-waves-hydrating-shampoo-elasticity-for-curly-wavy-hair-250ml-8-4oz-white-2028472?productQuery=goldwell-goldwell-dual-senses-curls-waves-hydrating-shampoo-elasticity-for-curly-wavy-hair-250ml-8-4oz-white-2028472',
      isLocal: false,
      isNatural: false,
    },
    {
      id: '28',
      name: 'Zenutrients - Curl Avocado & Tea Tree Sulfate-Free Shampoo',
      description:
       'Maximize your curl potential with Zenutrients\' Curls Avocado & Tea Tree Sulfate-Free Shampoo, a gentle cleansing formula designed to keep curls healthy, strong, and protected from damage, all while being free of sulfates, parabens, protein, and silicones.',
      imageKey: 'Zenutrients - Curl Avocado & Tea Tree Sulfate-Free Shampoo',
      productType: 'Shampoo',
      hairTypes: ['Wavy','Curly'],
      price: 372,
      link: 'https://zenutrients.com.ph/products/avocado-tea-tree-sulfate-free-shampoo-250ml?country=PH&currency=PH',
      isLocal: true,
      isNatural: true,
      ingredients: ["Aqua",
                    "Cocamidopropyl Betaine",
                    "Cocamide DEA",
                    "Propylene Glycol",
                    "Glycerin",
                    "Sodium Chloride",
                    "Olea Europaea (Olive) Fruit Oil",
                    "Phenoxyethanol",
                    "Melaleuca Alternifolia (Tea Tree) Leaf Oil",
                    "Fragrance",
                    "Persea Gratissima (Avocado) Oil",
                    "PEG 40 Hydrogenated Castor Oil"],
    },
    {
      id: '29',
      name: 'LUXE Organix - Bye Brass Purple Shampoo',
      description:
       'Luxe Organix Bye Brass Purple Shampoo removes brassiness and yellow undertones. This product is perfect for maintaining color-treated blonde, platinum, or highlighted hair for a natural salon look!',
      imageKey: 'LUXE Organix - Bye Brass Purple Shampoo',
      productType: 'Shampoo',
      hairDamage: ['Color Damage'],
      price: 179,
      link: 'https://www.watsons.com.ph/luxe-organix-luxe-organix-bye-brass-purple-shampoo-270ml/p/BP_50036502?',
      isLocal: true,
      isNatural: false,
      ingredients: [
        "Aqua",
        "Ammonium Laureth Sulfate",
        "Cocamidopropyl Betaine",
        "Cocamide Mea",
        "Glycol Distearate",
        "Cocamidopropylamine Oxide",
        "Dime- Thicone",
        "Polyquaternium-10",
        "Sodium Chloride",
        "Glycerin",
        "Parfum",
        "Citric Acid",
        "CI 60730",
        "Argania Spinosa Kernel Oil",
        "Tocopherol",
        "Jojoba Oil",
        "Methylchloroisothiazolinone",
        "Methylisothiazolinone"
      ]
    },
    {
      id: '30',
      name: 'Ichikami - Damage and Color Care Shampoo',
      description:
       'The Ichikami Damage and Color Care Shampoo A features a premium blend of Pure Japanese Botanical Extracts that repair and protect colored hair from root to tip. This nourishing formula strengthens each strand, leaving your hair soft, shiny, and vibrant while preserving color richness. Experience ultimate care for your color-treated hair!',
      imageKey: 'Ichikami - Damage and Color Care Shampoo',
      productType: 'Shampoo',
      hairDamage: ['Color Damage'],
      price: 645,
      link: 'https://rustans.com/products/ichikami-damage-and-color-care-shampoo-a?variant=43510277046411&country=PH&currency=PHP&',
      isLocal: false,
      isNatural: true,
      ingredients: [
        "Water",
        "Tea-Lauroyl Sarcosinate",
        "Palm Kernelamidopropyl Betaine",
        "Cocamide Methyl MEA",
        "Cocamide MEA",
        "Glycol Distearate",
        "Tea-Cocoyl Glutamate",
        "Fragrance",
        "PEG-7 Glyceryl Cocoate",
        "Lauric Acid",
        "Sodium Benzoate",
        "Citric Acid",
        "Sodium Chloride",
        "PPG-9 Diglyceryl Ether",
        "Polyquaternium-10",
        "Guar Hydroxypropyltrimonium Chloride",
        "Disodium EDTA",
        "Polyquaternium-7",
        "Oryza Sativa (Rice) Bran Oil",
        "Butylene Glycol",
        "Oryza Sativa (Rice) Germ Oil",
        "Alcohol",
        "Perilla Frutescens Seed Oil",
        "Caramel",
        "Propanediol",
        "Diisostearyl Malate",
        "Camellia Japonica Seed Extract",
        "Balamcanda Chinensis Root Extract",
        "Oryza Sativa (Rice) Bran Extract",
        "Angelica Keiskei Leaf/Stem Extract",
        "Polyquaternium-64",
        "Sapindus Mukorossi Peel Extract",
        "BHT",
        "Dianthus Longicalyx Seed Extract",
        "Phenoxyethanol",
        "Tocopherol"
      ]
    },
    {
      id: '31',
      name: 'Joico - Colorful Anti-Fade Shampoo',
      description:
       'This gentle, SLS/SLES sulfate-free anti-fade cleanser preserves up to 8 weeks of hair color vibrancy by using Camelia Oil to restore shine, Pomegranate Extract to protect color longevity, and SmartRelease Technology to repair and fortify hair, providing 3X greater resistance to breakage and leaving it smooth and rejuvenated.',
      imageKey: 'Joico - Colorful Anti-Fade Shampoo',
      productType: 'Shampoo',
      hairDamage: ['Color Damage'],
      price: 1063.50,
      link: 'https://www.strawberrynet.com/en-PH/joico-colorful-anti-fade-shampoo-for-long-lasting-color-vibrancy-300ml-10-1oz/278762?campaign=Google+-+PF',
      isLocal: false,
      isNatural: true,
      ingredients:[
        "Water/Aqua/Eau",
        "Sodium C14-16 Olefin Sulfonate",
        "Cocamidopropyl Betaine",
        "Sodium Methyl Cocoyl Taurate",
        "Sodium Lauroamphoacetate",
        "Lauryl Glucoside",
        "Disodium Laureth Sulfosuccinate",
        "Betaine",
        "Laurdimonium Hydroxypropyl Hydrolyzed Keratin",
        "Rosa Canina Fruit Oil",
        "Phosphatidylcholine",
        "Camellia Sinensis Seed Oil",
        "Arginine HCl",
        "Punica Granatum Extract",
        "Sodium Lauryl Sulfoacetate",
        "Dimethicone Propyl PG-Betaine",
        "Glycol Distearate",
        "Guar Hydroxypropyltrimonium Chloride",
        "Isostearamide MIPA",
        "Polyquaternium-47",
        "Citric Acid",
        "Polyquaternium-7",
        "Laureth-4",
        "PEG-120 Methyl Glucose Dioleate",
        "Dimethicone PEG-8 Meadowfoamate",
        "PEG-4 Laurate",
        "Quaternium-80",
        "Methyl Gluceth-10",
        "Methoxy PEG/PPG-7/3 Aminopropyl Dimethicone",
        "Propylene Glycol",
        "Glyceryl Laurate",
        "Tetrasodium EDTA",
        "Iodopropynyl Butylcarbamate",
        "Phenoxyethanol",
        "Benzoic Acid",
        "Dehydroacetic Acid",
        "Methylchloroisothiazolinone",
        "Methylisothiazolinone",
        "Sodium Benzoate",
        "Sodium Hydroxide",
        "Hydroxycitronellal",
        "Linalool",
        "Fragrance/Parfum"
      ]
    },
      {
        id: '32',
        name: 'Not Your Mother\'s - Kinky Moves Curl Defining Hair Cream',
        description:
        'Don\'t let your sad waves and curls get you all in a knot. Kinky Moves helps encourage natural curls by giving them that extra oomph they so desperately need. It eliminates frizz and flyaways to show your true locks. Infused with natural grape seed and jasmine, this salon formula will add the extra bounce to your step and your hair.',
        imageKey: 'Not Your Mother\'s - Kinky Moves Curl Defining Hair Cream',
        productType: 'Hair Cream',
        hairTypes: ['Coily'],
        price: 325,
        link: 'https://beautybar.com.ph/products/not-your-mothers-kinky-moves-curl-defining-hair-cream-travel-size-4351329-01?',
        isLocal: false,
        isNatural: true,
        ingredients: [
          "Water",
          "polyquaternium-37",
          "propylene glycol dicaprylate/caprate",
          "fragrance",
          "polyquaternium-72",
          "phenyl trimethicone",
          "PPG-1 trideceth-6",
          "poplyquaternium-11",
          "amodimethicone",
          "cetrimonium chloride",
          "trideceth-12",
          "propylene glycol",
          "tetrasodium EDTA",
          "diazolidinyl urea",
          "methylparaben",
          "propylparaben",
          "vitis vinifera (grape) seed extract",
          "jasminum officinale (jasmine) flower extract"
        ]
      },
      {
        id: '33',
        name: 'The Body Shop - Jamaican Black Castor Oil Curl Activator',
        description:
        'Say hello to defined, strong and bouncy curls and coils everyday with our weightless, easy-to-use Curl Activator. It helps to reduce frizz while shaping your hair with a light and natural hold. Smooth the silky cream through your damp or dry locks for healthy, nourished and stronger looking curls and coils. ',
        imageKey: 'The Body Shop - Jamaican Black Castor Oil Curl Activator',
        productType: 'Hair Oil',
        hairTypes: ['Coily'],
        price: 795,
        link: 'https://thebodyshop.com.ph/products/jamaican-black-castor-oil-curl-activator?variant=46841336856851&country=PH&currency=PHP',
        isLocal: false,
        isNatural: true,
      },
      {
        id: '34',
        name: 'It\'s a 10 - Coily Miracle Hydrating Shampoo',
        description:
        'This color-safe, no-added-sulfate hydrating shampoo, designed for curly and textured hair, delivers a rich lather to remove build-up while its deep moisturizing formula strengthens, seals, and defends against humidity and UV rays, resulting in well-defined, bouncy, and lustrous curls with fewer split ends and tamed fly-aways.',
        imageKey: 'It\'s a 10 - Coily Miracle Hydrating Shampoo',
        productType: 'Shampoo',
        hairTypes: ['Coily'],
        price: 1782.50,
        link: 'https://www.strawberrynet.com/en-PH/it-s-a-10-coily-miracle-hydrating-shampoo-295-7ml-10oz/285169?campaign=Google+-+PF&',
        isLocal: false,
        isNatural: true,
        ingredients: [
          "Avocado Oil",
          "Coconut Oil",
          "Shea Butter",
          "Monoi Extract"
        ]
      },
      {
        id: '35',
        name: 'Yves Rocher - Anti Hair Loss Fortifying Shampoo',
        description:
        'This gentle shampoo strengthens hair and steadily decreases hair loss, using White Lupin to restore density and Agave Fructans to activate scalp microcirculation for stronger, more beautiful growth.',
        imageKey: 'Yves Rocher - Anti Hair Loss Fortifying Shampoo',
        productType: 'Shampoo',
        hairDamage: ['Hair Loss'],
        price: 547.25,
        link: 'https://www.zalora.com.ph/p/yves-rocher-anti-hair-loss-fortifying-shampoo-with-white-lupin-300ml-for-stronger-thicker-hair-green-3303027?productQuery=yves-rocher-anti-hair-loss-fortifying-shampoo-with-white-lupin-300ml-for-stronger-thicker-hair-green-3303027&',
        isLocal: false,
        isNatural: true,
      },
      {
        id: '36',
        name: 'Khaokho Talaypu Advanced Repair Treatment Coconut & Avocado Shampoo',
        description:
        'Khaokho Talaypu Advanced Repair Treatment Coconut & Avocado Shampoo is enriched with natural ingredients like coconut oil and avocado extract, known for their nourishing properties. This shampoo deeply conditions and repairs damaged hair, restoring its natural shine and softness. It is free from harmful chemicals, making it suitable for all hair types, especially those in need of extra care and hydration.',
        imageKey: 'Khaokho Talaypu Advanced Repair Treatment',
        productType: 'Shampoo',
        hairDamage: ['Hair Breakage'],
        price: 272,
        link: 'https://www.watsons.com.ph/khaokho-talaypu-khaokho-talaypu-advanced-repair-treatment-coconut-avocado-200-ml/p/BP_50048187',
        isLocal: true,
        isNatural: true,
        ingredients: [
          "Water",
          "Cetearyl Alcohol",
          "Behentrimonium Chloride",
          "Cocos Nucifera (Coconut) Oil",
          "Propylene Glycol",
          "Cetrimonium Chloride",
          "Cetearyl Olivate",
          "Phenoxyethanol Sorbitan Olivate",
          "2-Propanol",
          "Hydroxypropyl Guar Hydroxypropyltrimonium Chloride",
          "Panthenol",
          "Flavor",
          "Persea Gratissima (Avocado) Oil",
          "Disodium Edta",
          "Iodopropynyl Butylcarbamate",
          "Hydrolyzed Keratin",
          "Citric Acid",
          "Cystine",
          "Sodium Hyaluronate",
          "Sodium Citrate",
          "Platinum Powder"
        ]
      },
      {
        id: '37',
        name: 'Nanny Rose Gugo & Lawat Anti Hair Fall Shampoo',
        description:
        'Nanny Rose Gugo & Lawat Anti Hair Fall Shampoo is specially formulated to help reduce hair fall and promote healthier hair growth. Enriched with natural ingredients like Gugo and Lawat, this shampoo strengthens hair from the roots, leaving it feeling revitalized and nourished.',
        imageKey: 'Nanny Rose Gugo & Lawat Anti Hair Fall',
        productType: 'Shampoo',
        hairDamage: ['Hair Loss'],
        price: 245,
        link: 'https://www.watsons.com.ph/nanny-rose-gugo-lawat-antihairfall-shampoo-200ml/p/BP_10091326',
        isLocal: true,
        isNatural: true,
        ingredients: [
          "Entada Phaseoloides Extract",
          "Litsea Glutinosae Extract",
          "Sodium lauroyl sarcosinate",
          "Cocamide DEA",
          "Vitex Nigundo Extract",
          "PEG-120 Methyl Glucose Dioleate",
          "Moringa Oleifera Lam Extract",
          "Cocoamidopropyl betaine",
          "Cetrimonium Chloride",
          "Glycerin",
          "Phenoxyethanol",
          "Citric Acid",
          "Tetrasodium EDTA",
          "Citrofortunella Microcarpa Extract",
          "Dimethicone",
          "Soya Bean Oil",
          "Helianthus Annuus Oil",
          "Lemongrass (cymbopogon flexuosus) Essential Oil",
          "Grapefruit (citrus grandis) Essential Oil",
          "Menthol"
        ]
      },
      {
        id: '38',
        name: 'HASK Curl Care Moisturizing Shampoo',
        description:
        'HASK Curl Care Moisturizing Shampoo is specially formulated to help reduce hair fall and promote healthier hair growth. Enriched with natural ingredients like Gugo and Lawat, this shampoo strengthens hair from the roots, leaving it feeling revitalized and nourished.',
        imageKey: 'HASK Curl Care Moisturizing Shampoo',
        productType: 'Shampoo',
        hairDamage: ['Hair Breakage'],
        price: 720,
        link: 'https://www.watsons.com.ph/hask-hask-curl-care-moisturizing-shampoo-355ml/p/BP_50052302',
        isLocal: false,
        isNatural: false,
        ingredients: [
          "Water",
          "Sodium C14-16 Olefin Sulfonate",
          "Cocamide MIPA",
          "Cocamidopropyl Betaine",
          "Glycerin",
          "Sodium Chloride",
          "Cocos Nucifera (coconut) Oil,",
          "Argania Spinosa (argan) Kernel Oil",
          "Tocopheryl Acetate (vitamin E)",
          "Panthenol",
          "Coco Glucoside",
          "Polyimide-1",
          "Polyquaternium-10",
          "Hydrogenated Palm Glycerides Citrate",
          "Polyquaternium-7",
          "Glyceryl Oleate",
          "Tocopherol",
          "Guar Hydroxypropyltrimonium Chloride",
          "Sodium Hydroxide",
          "Citric Acid",
          "Glycol Distearate",
          "Sodium Benzoate",
          "Sodium Salicylate",
          "Trisodium Ethylenediamine Disuccinate",
          "Isopropanolamine",
          "Parfum/Fragrance",
          "Alpha Isomethyl Ionone",
          "Hexyl Cinnamal",
          "Juniperus Virginiana Oil",
          "Tetramethyl Acetyloctahydronaphthalenes",
          "Vanillin"
        ]
      },
      {
        id: '39',
        name: 'Kathare Strawberry Swirl Moisturizing Revival Conditioner Bar',
        description:
          'The Katharē Strawberry Swirl Conditioner Bar is a handcrafted, sulfate-free, and plastic-free solution made with strawberry extracts and nourishing botanicals specifically for Filipino hair. This concentrated, long-lasting bar provides profound hydration and effortless detangling to revitalize dry, dull hair, leaving it beautifully soft and smooth. This is also good for rebonded, colored hair, and CGM-friendly!',
        imageKey: 'Kathare Strawberry Swirl',
        productType: 'Conditioner',
        hairTypes: ['Straight', 'Curly', 'Wavy', 'Coily'],
        hairDamage: ['Color Damage', 'Breakage'],
        price: 276,
        link: 'https://kathare.store/products/strawberry-lush-conditioner-bar',
        isLocal: true,
        isNatural: true,
        ingredients: [
          "Behentrimonium Methosulfate",
          "Cetearyl alcohol",
          "Stearic Acid",
          "Cetyl Alcohol",
          "Peg-8 Beeswax",
          "Theobroma Cacao Seed (Cocoa) Butter",
          "Butyrospermum parkii (Shea) Butter",
          "Cetrimonium chloride",
          "Sodium Lactate",
          "Avocado Oil",
          "Coconut Oil",
          "Keratin",
          "D-Panthenol (Vitamin b5)",
          "Ethylhexylglycerin",
          "Fragrance Oil",
          "Mica"
        ]
      },
      {
        id: '40',
        name: 'Kathare Coco Dreams Nourishing Revival Conditioner Bar',
        description:
          'The Katharē Coco Dreams Conditioner Bar is a sulfate-free, plastic-free solution handcrafted with Coconut Oil, Keratin, and Cocoa Butter to deeply hydrate, strengthen, and revitalize Filipino hair. This conditioner bar provides profound moisture and repair to eliminate tangles, tame frizz, and restore radiant vitality, leaving hair exceptionally soft, strong, and manageable.',
        imageKey: 'Kathare Coco Dreams',
        productType: 'Conditioner',
        hairTypes: ['Straight', 'Curly', 'Wavy', 'Coily'],
        hairDamage: ['Color Damage', 'Breakage'],
        price: 420,
        link: 'https://kathare.store/products/coco-dreams-conditioner-bar-detangling-repair-hydration',
        isLocal: true,
        isNatural: true,
        ingredients: [
          "Behentrimonium Methosulfate",
          "Cetearyl alcohol",
          "Stearic Acid",
          "Cetyl Alcohol",
          "Beeswax",
          "Theobroma Cacao Seed (Cocoa) Butter",
          "Cetrimonium chloride",
          "Sodium Lactate",
          "Cocos nucifera (Coconut) Oil",
          "Keratin",
          "D-Panthenol (Vitamin b5)",
          "Ethylhexylglycerin",
          "Fragrance Oil"
        ]
      },
      {
        id: '41',
        name: 'Kathare Lavender Lover Extra Shine Revival Conditioner Bar',
        description:
          'The Katharē Lavender Lovers Conditioner Bar is a sulfate-free, plastic-free solution crafted with soothing Lavender Oil, strengthening Keratin, and a rich blend of oils like Argan and Shea Butter to deeply nourish Filipino hair. This conditioner bar provides a calming, deeply conditioning experience that hydrates dry or damaged hair and soothes sensitive scalps, leaving strands exceptionally soft, strong, and manageable. It is perfect for individuals with sensitive or irritated scalps and those with dry, damaged, or brittle hair needing deep moisture and repair.',
        imageKey: 'Kathare Lavender Lover',
        productType: 'Conditioner',
        hairTypes: ['Straight', 'Curly', 'Wavy', 'Coily'],
        hairDamage: ['Color Damage', 'Breakage'],
        price: 420,
        link: 'https://kathare.store/products/lavender-lovers-conditioner-bar-calming-moisturizing',
        isLocal: true,
        isNatural: true,
        ingredients: [
          "Behentrimonium Methosulfate",
          "Cetearyl alcohol",
          "Stearic Acid",
          "Cetyl Alcohol",
          "Beeswax",
          "Theobroma Cacao Seed (Cocoa) Butter",
          "Butyrospermum parkii (Shea) Butter",
          "Cetrimonium chloride",
          "Sodium Lactate",
          "Avocado Oil",
          "Moroccan Argan Oil",
          "Keratin",
          "D-Panthenol (Vitamin b5)",
          "Ethylhexylglycerin",
          "Lavender Oil",
          "Mica"
        ]
      },
      {
        id: '42',
        name: 'Kathare Gugo Blossom Hair Growth Revival Conditioner Bar',
        description:
          'The Katharē Gugo Loco Conditioner Bar is a sulfate-free, plastic-free solution handcrafted with traditional Gugo Extract and strengthening Keratin to address the unique challenges of Filipino hair. This conditioner bar deeply conditions and fortifies strands to actively promote healthy hair growth and significantly reduce hair fall, leaving hair remarkably resilient, soft, and visibly abundant.',
        imageKey: 'Kathare Gugo Blossom',
        productType: 'Conditioner',
        hairTypes: ['Straight', 'Curly', 'Wavy', 'Coily'],
        hairDamage: ['Color Damage', 'Breakage', 'Hair Loss'],
        price: 420,
        link: 'https://kathare.store/products/gugo-loco-conditioner-bar-hair-growth-hair-fall',
        isLocal: true,
        isNatural: true,
        ingredients: [
          "Behentrimonium Methosulfate",
          "Cetearyl alcohol",
          "Stearic Acid",
          "Cetyl Alcohol",
          "Peg-8 Beeswax",
          "Theobroma Cacao Seed (Cocoa) Butter",
          "Butyrospermum parkii (Shea) Butter",
          "Cetrimonium chloride",
          "Sodium Lactate",
          "Almond Oil",
          "Castor Oil",
          "Cocos nucifera (Coconut) Oil",
          "Keratin",
          "D-Panthenol (Vitamin b5)",
          "Ethylhexylglycerin",
          "Gugo Extract",
          "Lemon Oil",
          "Fragrance Oil",
          "Mica"
        ]
      },
      {
        id: '43',
        name: 'Shea Moisture Coconut & Hibiscus Curl & Shine Conditioner',
        description:
          'Shea Moisture conditioner features a lightweight formula that offers a blend of nutrient-rich butters and oils to restore lost moisture and smoothing out dry hair and ends. This conditioner is specially formulated for wavy and curly hair for a more defined, bouncy, lighter-than-feather curls, adding volume and natural shine.',
        imageKey: 'Shea Moisture Coconut Hibiscus Conditioner',
        productType: 'Conditioner',
        hairTypes: ['Wavy', 'Curly'],
        hairDamage: ['Breakage'],
        price: 425,
        link: 'https://shopee.ph/product/154777432/3200405001?gads_t_sig=VTJGc2RHVmtYMTlxTFVSVVRrdENkU1psNndicnpENjFrR2ZiZlcxU0ZES0pxQitlWDJMZThuM2phblBsM0ZlS2N4eUtrMXVGeG1MRndaWWZGUWJOQXg5Y0t6VWlpdGRDeE0zN2M5V1VVNnJZN2RoNUlIdUp3ektyK2dEY21uc28',
        isLocal: false,
        isNatural: true,
        ingredients: [
          "Water",
          "Cetearyl Alcohol",
          "Caprylic/Capric Triglyceride",
          "Cocos Nucifera (Coconut) Oil",
          "Cetyl Alcohol",
          "Stearyl Alcohol",
          "Behentrimonium Chloride",
          "Butyrospermum Parkii (Shea) Butter",
          "Fragrance",
          "Aloe Barbadensis Leaf Juice",
          "Hydrolyzed Vegetable Protein PG-Propyl Silanetriol",
          "Hibiscus Rosa-Sinensis Flower Extract",
          "Simmondsia Chinensis (Jojoba) Seed Oil",
          "Mangifera Indica (Mango) Seed Butter",
          "Melia Azadirachta (Neem) Seed Oil",
          "Brassica Campestris (Rapeseed) Seed Oil",
          "Panthenol",
          "Sodium Lauroyl Hydrolyzed Silk",
          "Tocopherol",
          "Glycerin (Vegetable)",
          "Glycine Soja (Soybean) Oil",
          "Hydroxyethylcellulose",
          "Triethyl Citrate",
          "Caprylyl Glycol",
          "Benzoic Acid"
        ]
      },
      {
        id: '44',
        name: 'Davines LOVE Curl Conditioner',
        description:
          'The Davines LOVE Curl conditioner enhances and controls wavy or curly hair, using a formula rich in proteins and B Vitamins to add elasticity and volume without weighing it down. It deeply moisturizes and nourishes, leaving curls exceptionally soft, light, and shiny while keeping them defined and manageable.',
        imageKey: 'Davines LOVE Curl Conditioner',
        productType: 'Conditioner',
        hairTypes: ['Wavy', 'Curly'],
        price: 1600,
        link: 'https://www.davinesph.com/products/love-curl-conditioner?srsltid=AfmBOorG0c3nlB3DS_CoyrpNDHGbqAyD7OoAwpKD5k-ii29FZEjrDQ87',
        isLocal: false,
        isNatural: false,
        ingredients: [
          "AQUA / WATER / EAU",
          "CETEARYL ALCOHOL",
          "GLYCERIN",
          "BEHENTRIMONIUM CHLORIDE",
          "CETYL ALCOHOL",
          "CETRIMONIUM CHLORIDE",
          "DIMETHICONE",
          "ORYZA SATIVA CERA / ORYZA SATIVA (RICE) BRAN WAX",
          "BEHENTRIMONIUM METHOSULFATE",
          "ISOPROPYL ALCOHOL",
          "BENZYL ALCOHOL",
          "DICAPRYLYL ETHER",
          "PANTHENOL",
          "PARFUM / FRAGRANCE",
          "LAURYL ALCOHOL",
          "AMODIMETHICONE",
          "DISODIUM EDTA",
          "SODIUM BENZOATE",
          "POLYQUATERNIUM-10",
          "PRUNUS AMYGDALUS DULCIS SEED EXTRACT / PRUNUS AMYGDALUS DULCIS (SWEET ALMOND) SEED EXTRACT",
          "TOCOPHEROL",
          "CITRIC ACID",
          "DISILOXANE",
          "TRIDECETH-12",
          "LIMONENE"
        ]
      },
      {
        id: '45',
        name: 'Maui Moisture Revive & Hydrate + Shea Butter Conditioner',
        description:
          'The Maui Moisture Heal & Hydrate + Shea Butter Conditioner features a silicone-free formula that uses 100% aloe vera as its base, blended with creamy shea butter, rich coconut oil, and macadamia oil. This reparative conditioner deeply nourishes and softens dry, damaged strands to help get your hair back to looking healthy and smooth. It is suitable for all hair types and is safe to use on color-treated hair.',
        imageKey: 'Maui Moisture Revive Hydrate Shea Butter Conditioner',
        productType: 'Conditioner',
        hairTypes: ['Straight', 'Curly', 'Wavy', 'Coily'],
        hairDamage: ['Color Damage'],
        price: 819.8,
        link: 'https://www.caretobeauty.com/ph/maui-moisture-revive-hydrate-shea-butter-conditioner-385ml/',
        isLocal: false,
        isNatural: true,
        ingredients: [
          "Aloe Barbadensis Leaf Vera",
          "Water (Aqua)",
          "Behentrimonium Chloride",
          "Cetearyl Alcohol",
          "Glycerin",
          "Cetyl Alcohol",
          "Alcohol",
          "Cocos Nucifera (Coconut) Water",
          "Butyrospermum Parkii (Shea) Butter",
          "Cocos Nucifera (Coconut) Oil",
          "Macadamia Ternifolia Seed Oil",
          "Panthenol",
          "Polyquaternium-10",
          "Polyquaternium-37",
          "Diheptyl Succinate",
          "Caprylyl Glycerin/Sebacic Acid Copolymer",
          "Glyceryl Stearate",
          "Propylene Glycol Dicaprylate/Dicaprate",
          "PPG-1 Trideceth-6",
          "Tapioca Starch",
          "Propylene Glycol",
          "DMDM Hydantoin",
          "Diazolidinyl Urea",
          "Iodopropynyl Butylcarbamate",
          "Fragrance (Parfum)"
        ]
      },
      {
        id: '46',
        name: 'Zenutrients Argan & Chamomile Conditioner',
        description:
          'The Zenutrients Argan & Chamomile Conditioner is filled with fatty acids, antioxidants, and vitamin E that promote hair improvement and seals the moisture in your hair and scalp. It is perfectly formulated for dry hair, dry scalp, and damaged hair with split ends.',
        imageKey: 'Zenutrients Argan Chamomile Conditioner',
        productType: 'Conditioner',
        hairDamage: ['Breakage'],
        price: 249,
        link: 'https://zenutrients.com.ph/collections/conditioner/products/argan-chamomile-conditioner?variant=43211203379423',
        isLocal: true,
        isNatural: true,
        ingredients: [
          "Aqua",
          "Cetyl Alcohol",
          "Cetrimonium Chloride",
          "Panthenol",
          "Argania Spinosa Nut Oil",
          "Phenoxyethanol",
          "Triethanolamine",
          "Eucalyptus Globulus Leaf Oil",
          "Matricaria chamomilla Oil",
          "Menthol"
        ]
      },
      {
        id: '47',
        name: 'Zenutrients - Tea Tree Scalp Conditioner',
        description:
          'The Zenutrients Tea Tree Scalp Conditioner is formulated with Tea Tree Leaf Oil to provide relief from an itchy, flaky, and dry scalp. This conditioner helps lessen dandruff while gently conditioning the hair, making it suitable for daily use and safe for children aged 5 and up.',
        imageKey: 'Zenutrients Tea Tree Scalp Conditioner',
        productType: 'Conditioner',
        scalpCondition: ['Dandruff'],
        price: 125,
        link: 'https://zenutrients.com.ph/collections/conditioner/products/tea-tree-scalp-conditioner-200ml?variant=43211157930207',
        isLocal: true,
        isNatural: true,
        ingredients: [
          "Aqua",
          "Cetyl Alcohol",
          "Cetereath 20",
          "Cetrimonium Chloride",
          "Polyquaternium-7",
          "Citric Acid",
          "Phenoxyethanol",
          "Melaleuca Alternifolia (Tea Tree) Leaf Oil"
        ]
      }

];

// Helper function to normalize product type
const normalizeProductType = (productType: string): string => {
  const normalized = productType.trim();
  if (normalized === 'Shampoo' || normalized === 'Conditioner') {
    return normalized;
  }
  return 'Others';
};

export function recommendProducts(preferences: {
  requiredCategories?: string[]; // e.g. ["Sulfate-free"]
  hairType?: string; // optional hair type to prefer
  scalpCondition?: string; // optional scalp condition to prefer
  hairDamage?: string; // optional hair damage to prefer
  limit?: number;
}): Product[] {
  // Normalize product types in the products array
  const normalizedProducts = sampleProducts.map(product => ({
    ...product,
    productType: normalizeProductType(product.productType)
  }));
  
  if (!preferences) return normalizedProducts.slice(0, 6);
  const { requiredCategories = [], hairType, scalpCondition, hairDamage, limit = 6 } = preferences;
  
  // Normalize empty strings to undefined
  const normalizedHairType = hairType?.trim() || undefined;
  const normalizedScalpCondition = scalpCondition?.trim() || undefined;
  const normalizedHairDamage = hairDamage?.trim() || undefined;

  // Lenient filtering: include product if it matches ANY provided criteria.
  const filtered = normalizedProducts.filter((product) => {
    let matchesAnyCriteria = false;

    // Hair type match
    if (normalizedHairType && product.hairTypes && product.hairTypes.length > 0) {
      if (product.hairTypes.some((t) => t.toLowerCase() === normalizedHairType.toLowerCase())) {
        matchesAnyCriteria = true;
      }
    }

    // Scalp condition match
    if (normalizedScalpCondition && product.scalpCondition && product.scalpCondition.length > 0) {
      if (product.scalpCondition.some((s) => s.toLowerCase() === normalizedScalpCondition.toLowerCase())) {
        matchesAnyCriteria = true;
      }
    }

    // Hair damage match (allow partials like "Moderate Hair Loss")
    if (normalizedHairDamage && product.hairDamage && product.hairDamage.length > 0) {
      const normalizedDamage = normalizedHairDamage.toLowerCase();
      const baseDamageTypes = ['breakage', 'color damage', 'hair loss', 'healthy'];
      const extractedDamage = baseDamageTypes.find((damage) => normalizedDamage.includes(damage)) || normalizedDamage;

      const damageMatches = product.hairDamage.some((d) => {
        const pd = d.toLowerCase();
        return pd === extractedDamage || pd.includes(extractedDamage) || extractedDamage.includes(pd);
      });
      if (damageMatches) {
        matchesAnyCriteria = true;
      }
    }

    // Category Filter: If requiredCategories specified, product must have at least one matching category
    if (requiredCategories.length > 0) {
      const hasMatchingCategory = requiredCategories.some((reqCat) =>
        product.categories?.some((prodCat) => prodCat.toLowerCase() === reqCat.toLowerCase())
      );
      if (!hasMatchingCategory) {
        return false; // Required category not matched - exclude
      }
    }

    // If no criteria specified at all, include all products
    if (!normalizedHairType && !normalizedScalpCondition && !normalizedHairDamage) {
      return true;
    }

    // Otherwise include if ANY criteria matched
    return matchesAnyCriteria;
  });

  // Score the filtered products to prioritize better matches
  const scored = filtered
    .map((product) => {
      let score = 0;
      
      // Bonus for matching hair type
      if (normalizedHairType && product.hairTypes?.some((t) => t.toLowerCase() === normalizedHairType.toLowerCase())) {
        score += 3;
      }
      
      // Bonus for matching scalp condition
      if (normalizedScalpCondition && product.scalpCondition?.some((s) => s.toLowerCase() === normalizedScalpCondition.toLowerCase())) {
        score += 3;
      }
      
      // Bonus for matching hair damage (with partial matching like the filter)
      if (normalizedHairDamage && product.hairDamage) {
        const normalizedDamage = normalizedHairDamage.toLowerCase();
        const baseDamageTypes = ['breakage', 'color damage', 'hair loss', 'healthy'];
        const extractedDamage = baseDamageTypes.find(damage => normalizedDamage.includes(damage)) || normalizedDamage;
        
        const matches = product.hairDamage.some((d) => {
          const productDamage = d.toLowerCase();
          return productDamage === extractedDamage || 
                 productDamage.includes(extractedDamage) || 
                 extractedDamage.includes(productDamage);
        });
        
        if (matches) {
          score += 3;
        }
      }
      
      // Bonus for matching categories
      for (const tag of requiredCategories) {
        if (product.categories?.map((c) => c.toLowerCase()).includes(tag.toLowerCase())) {
          score += 2;
        }
      }
      
      return { product, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.product);

  return scored;
}

export const getProductImage = (imageKey: string) => productImages[imageKey];

export const getPriceCategory = (price?: number): string => {
  if (!price) return '₱';
  if (price < 300) return '₱';
  if (price >= 300 && price < 500) return '₱₱';
  return '₱₱₱';
};
