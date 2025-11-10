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
      'Meticulously crafted with Gugo Extract, this vibrant bar actively works to combat hair fall while delivering a delightfully invigorating cleanse. This gentle formula, infused with nourishing Jojoba and Coconut Oils, leaves your hair feeling incredibly fresh, soft, and visibly more resilient with every sustainable wash.',
    imageKey: 'Kathare - Anti Hair Fall',
    categories: ['Sulfate-free'],
    productType: 'Shampoo',
    hairDamage: ['Hair Loss'],
    price: 320,
    link: 'https://kathare.store/products/citrus-kiss-shampoo-bar?pr_prod_strat=e5_desc&pr_rec_id=4cbecf7bf&pr_rec_pid=6978645885135&pr_ref_pid=6904151965903&pr_seq=uniform',
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
      imageKey: 'Watsons - Smooth and Sleek Shampoo Ylang Ylang & Coconut',
      productType: 'Shampoo',
      hairTypes: ['Wavy'],
      price: 358,
      link: 'https://www.lazada.com.ph/products/kracie-ichikami-japanese-shampoo-conditioner-set-for-women-made-in-japan-i4447707196-s25212927864.html?',
    },
    {
      id: '24',
      name: 'Bremod - Cocoa Butter Hair Shampoo',
      description:
        'With its superior ability to be easily absorbed deep into the hair shaft, coconut oil coats and moisturizes the hair, reducing breakage and protecting it from protein loss and environmental damage like wind, sun, and smoke to help you grow longer, sleeker, and healthier-looking hair.',
      imageKey: 'Watsons - Smooth and Sleek Shampoo Ylang Ylang & Coconut',
      productType: 'Shampoo',
      hairTypes: ['Wavy'],
      hairDamage: ['Breakage'],
      scalpCondition: ['Oily','Dandruff'],
      price: 165,
      link: 'https://shopee.ph/product/426990928/23676815278?gads_t_sig=VTJGc2RHVmtYMTlxTFVSVVRrdENkVlBXTnFLbGtLY21IOVhMT0xMVGhrdXdUKzBTd1pNaVIxN2h4bHFNODNiaHJwUTFyWU5KSTY5QXc1ZUFCMndPRDkzWmxGSlJIUXNqeDR6UjBFV1NVUStlSjFWRFBYeE9JUlF5S3FUSDZSKzc',
    },
    {
      id: '25',
      name: 'Bremod - Cocoa Butter Hair Conditioner',
      description:
        'With its superior ability to be easily absorbed deep into the hair shaft, coconut oil coats and moisturizes the hair, reducing breakage and protecting it from protein loss and environmental damage like wind, sun, and smoke to help you grow longer, sleeker, and healthier-looking hair.',
      imageKey: 'Watsons - Smooth and Sleek Shampoo Ylang Ylang & Coconut',
      productType: 'Conditioner',
      hairTypes: ['Wavy'],
      hairDamage: ['Breakage'],
      scalpCondition: ['Oily','Dandruff'],
      price: 165,
      link: 'https://shopee.ph/product/426990928/23676815278?gads_t_sig=VTJGc2RHVmtYMTlxTFVSVVRrdENkVlBXTnFLbGtLY21IOVhMT0xMVGhrdXdUKzBTd1pNaVIxN2h4bHFNODNiaHJwUTFyWU5KSTY5QXc1ZUFCMndPRDkzWmxGSlJIUXNqeDR6UjBFV1NVUStlSjFWRFBYeE9JUlF5S3FUSDZSKzc',
    },
    {
      id: '26',
      name: 'LUXE Organix - Curl Define Intensive Hydration Shampoo',
      description:
        'Say goodbye to frizzy and tangled curls! The Luxe Organix Premium Curl and Define Shampoo gently cleanses the hair while effectively locking in moisture to prevent dryness. It is formulated with a blend of Jojoba, Avocado, and Moroccan Oil to keep curls strong, healthy, and bouncy. Embrace and revive your natural curls with this CGM-approved shampoo that is perfect for everyday use.',
      imageKey: 'Watsons - Smooth and Sleek Shampoo Ylang Ylang & Coconut',
      productType: 'Shampoo',
      scalpCondition: ['Dry'],
      hairTypes: ['Wavy','Curly'],
      price: 199,
      link: 'https://www.watsons.com.ph/luxe-organix-curl-define-intensive-hydration-daily-shampoo-220ml/p/BP_50042488?',
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
      imageKey: 'Watsons - Smooth and Sleek Shampoo Ylang Ylang & Coconut',
      productType: 'Shampoo',
      scalpCondition: ['Dry'],
      hairTypes: ['Wavy','Curly'],
      price: 1005,
      link: 'https://www.zalora.com.ph/p/goldwell-goldwell-dual-senses-curls-waves-hydrating-shampoo-elasticity-for-curly-wavy-hair-250ml-8-4oz-white-2028472?productQuery=goldwell-goldwell-dual-senses-curls-waves-hydrating-shampoo-elasticity-for-curly-wavy-hair-250ml-8-4oz-white-2028472',
    },
    {
      id: '28',
      name: 'Zenutrients - Curl Avocado & Tea Tree Sulfate-Free Shampoo',
      description:
       'Maximize your curl potential with Zenutrients\' Curls Avocado & Tea Tree Sulfate-Free Shampoo, a gentle cleansing formula designed to keep curls healthy, strong, and protected from damage, all while being free of sulfates, parabens, protein, and silicones.',
      imageKey: 'Watsons - Smooth and Sleek Shampoo Ylang Ylang & Coconut',
      productType: 'Shampoo',
      hairTypes: ['Wavy','Curly'],
      price: 372,
      link: 'https://zenutrients.com.ph/products/avocado-tea-tree-sulfate-free-shampoo-250ml?country=PH&currency=PH',
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
      imageKey: 'Watsons - Smooth and Sleek Shampoo Ylang Ylang & Coconut',
      productType: 'Shampoo',
      hairDamage: ['Color Damage'],
      price: 179,
      link: 'https://www.watsons.com.ph/luxe-organix-luxe-organix-bye-brass-purple-shampoo-270ml/p/BP_50036502?',
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
       'The Ichikami Damage and Color Care Shampoo A features a premium blend of Pure Japanese Botanical Extracts that repair and protect colored hair from root to tip. This nourishing formula strengthens each strand, leaving your hair soft, shiny, and vibrant while preserving color richness. Experience ultimate care for your color-treated hair!',
      imageKey: 'Watsons - Smooth and Sleek Shampoo Ylang Ylang & Coconut',
      productType: 'Shampoo',
      hairDamage: ['Color Damage'],
      price: 179,
      link: 'https://www.watsons.com.ph/luxe-organix-luxe-organix-bye-brass-purple-shampoo-270ml/p/BP_50036502?',
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
      

];

export function recommendProducts(preferences: {
  requiredCategories?: string[]; // e.g. ["Sulfate-free"]
  hairType?: string; // optional hair type to prefer
  scalpCondition?: string; // optional scalp condition to prefer
  hairDamage?: string; // optional hair damage to prefer
  limit?: number;
}): Product[] {
  if (!preferences) return sampleProducts.slice(0, 6);
  const { requiredCategories = [], hairType, scalpCondition, hairDamage, limit = 6 } = preferences;

  // Strict filtering: products must match the specified criteria OR not have that property defined
  const filtered = sampleProducts.filter((product) => {
    // Hair Type Filter: If hairType is specified, product must match it or have no hairTypes defined
    if (hairType) {
      const hasHairTypes = product.hairTypes && product.hairTypes.length > 0;
      if (hasHairTypes && !product.hairTypes?.some((t) => t.toLowerCase() === hairType.toLowerCase())) {
        return false; // Product has hair types but doesn't match the required one
      }
    }

    // Scalp Condition Filter: If scalpCondition is specified, product must match it or have no scalpCondition defined
    if (scalpCondition) {
      const hasScalpCondition = product.scalpCondition && product.scalpCondition.length > 0;
      if (hasScalpCondition && !product.scalpCondition?.some((s) => s.toLowerCase() === scalpCondition.toLowerCase())) {
        return false; // Product has scalp conditions but doesn't match the required one
      }
    }

    // Hair Damage Filter: If hairDamage is specified, product must match it or have no hairDamage defined
    if (hairDamage) {
      const hasHairDamage = product.hairDamage && product.hairDamage.length > 0;
      if (hasHairDamage && !product.hairDamage?.some((d) => d.toLowerCase() === hairDamage.toLowerCase())) {
        return false; // Product has hair damage types but doesn't match the required one
      }
    }

    // Category Filter: If requiredCategories specified, product must have at least one matching category
    if (requiredCategories.length > 0) {
      const hasMatchingCategory = requiredCategories.some((reqCat) =>
        product.categories?.some((prodCat) => prodCat.toLowerCase() === reqCat.toLowerCase())
      );
      if (!hasMatchingCategory) {
        return false;
      }
    }

    return true;
  });

  // Score the filtered products to prioritize better matches
  const scored = filtered
    .map((product) => {
      let score = 0;
      
      // Bonus for matching hair type
      if (hairType && product.hairTypes?.some((t) => t.toLowerCase() === hairType.toLowerCase())) {
        score += 3;
      }
      
      // Bonus for matching scalp condition
      if (scalpCondition && product.scalpCondition?.some((s) => s.toLowerCase() === scalpCondition.toLowerCase())) {
        score += 3;
      }
      
      // Bonus for matching hair damage
      if (hairDamage && product.hairDamage?.some((d) => d.toLowerCase() === hairDamage.toLowerCase())) {
        score += 3;
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
