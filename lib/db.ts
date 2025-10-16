import * as SQLite from 'expo-sqlite';

export type SuggestedProduct = {
  id?: number;
  title: string;
  description?: string;
  hairType?: string; // e.g., Curly, Wavy, Straight, Kinky
  imageUri?: string;
  createdAt?: number;
};

let database: SQLite.SQLiteDatabase | null = null;

export async function openDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (database) return database;
  database = await SQLite.openDatabaseAsync('pocketsalon.db');
  await database.execAsync(`
    PRAGMA foreign_keys = ON;
    CREATE TABLE IF NOT EXISTS suggested_products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      hair_type TEXT,
      image_uri TEXT,
      created_at INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_products_hair_type ON suggested_products (hair_type);
  `);
  // Seed once when table is empty
  await seedSuggestedProductsIfEmpty(database);
  return database;
}

// Seed data for suggested_products. This runs once when the table is empty.
const SEED_SUGGESTED_PRODUCTS: Omit<SuggestedProduct, 'id' | 'createdAt'>[] = [
  // ----- LOCAL BRANDS -----
  {
    title: "Human Nature Strengthening Shampoo",
    description: "Infused with gugo and aloe vera to strengthen weak hair and prevent breakage.",
    hairType: "Straight",
    imageUri: "https://example.com/human-nature-shampoo.png"
  },
  {
    title: "Human Nature Natural Hair Revival Mask",
    description: "Deeply nourishes dry, color-treated hair using avocado and sunflower oils.",
    hairType: "Wavy",
    imageUri: "https://example.com/human-nature-mask.png"
  },
  {
    title: "Creamsilk Rebond Straight Conditioner",
    description: "Smoothens frizz and restores straight, salon-like hair with keratin and collagen.",
    hairType: "Straight",
    imageUri: "https://example.com/creamsilk-rebond.png"
  },
  {
    title: "Creamsilk Dry Rescue Conditioner",
    description: "Hydrates and revitalizes dry strands, leaving hair soft and manageable.",
    hairType: "Wavy",
    imageUri: "https://example.com/creamsilk-dry.png"
  },
  {
    title: "Luxe Organix Keratin Treatment with Aloe Vera",
    description: "Restores damaged hair and calms scalp irritation with keratin and aloe vera.",
    hairType: "Curly",
    imageUri: "https://example.com/luxe-aloe.png"
  },
  {
    title: "Luxe Organix Premium Argan Oil Shampoo",
    description: "Moisturizes and smoothens frizzy hair with Moroccan argan oil.",
    hairType: "Wavy",
    imageUri: "https://example.com/luxe-argan.png"
  },
  {
    title: "Zenutrients Gugo Strengthening Shampoo",
    description: "Uses traditional gugo extract to promote thicker and stronger hair growth.",
    hairType: "Kinky",
    imageUri: "https://example.com/zen-gugo.png"
  },
  {
    title: "Zenutrients Aloe & Chamomile Conditioner",
    description: "Gently conditions and soothes the scalp for everyday use.",
    hairType: "Straight",
    imageUri: "https://example.com/zen-aloe.png"
  },
  {
    title: "Vitress Hair Repair Cuticle Coat",
    description: "Coats each strand with protective shine while preventing split ends.",
    hairType: "Wavy",
    imageUri: "https://example.com/vitress-repair.png"
  },
  {
    title: "Vitress Sun Protect Serum",
    description: "Shields hair from UV damage and heat styling with a lightweight serum formula.",
    hairType: "Straight",
    imageUri: "https://example.com/vitress-sun.png"
  },
  {
    title: "Bench Fix Professional Clay Doh",
    description: "Gives flexible hold and matte texture for styled looks.",
    hairType: "Straight",
    imageUri: "https://example.com/bench-clay.png"
  },
  {
    title: "Bench Everyday Moisture Conditioner",
    description: "Softens dry hair using shea butter and milk protein extracts.",
    hairType: "Wavy",
    imageUri: "https://example.com/bench-moisture.png"
  },
  {
    title: "Splash Stylex Hold Gel",
    description: "Provides strong hold for any hairstyle without flakes or stiffness.",
    hairType: "Straight",
    imageUri: "https://example.com/stylex-gel.png"
  },
  {
    title: "Splash Vitress Instant Relax Serum",
    description: "Instantly smoothens and tames unruly hair for a silky finish.",
    hairType: "Wavy",
    imageUri: "https://example.com/vitress-relax.png"
  },
  {
    title: "Sibol Gugo Shampoo Bar",
    description: "Eco-friendly shampoo bar that strengthens and volumizes hair using gugo bark extract.",
    hairType: "Kinky",
    imageUri: "https://example.com/sibol-gugo.png"
  },
  {
    title: "Sibol Shine Conditioner Bar",
    description: "Adds natural shine and softness with coconut and argan oil.",
    hairType: "Wavy",
    imageUri: "https://example.com/sibol-shine.png"
  },
  {
    title: "Forest Magic Gugo Hair Saver Leave-On",
    description: "Traditional Filipino herbal formula to prevent hair fall and add bounce.",
    hairType: "Curly",
    imageUri: "https://example.com/forest-gugo.png"
  },
  {
    title: "Messy Buns Dry Shampoo",
    description: "Locally made dry shampoo that refreshes hair and removes excess oil.",
    hairType: "Straight",
    imageUri: "https://example.com/messybuns.png"
  },
  {
    title: "Organique Acai Hair Serum",
    description: "Rich in antioxidants that strengthen hair and reduce frizz.",
    hairType: "Wavy",
    imageUri: "https://example.com/organique-serum.png"
  },
  {
    title: "Hortaleza Professional Argan Oil Treatment",
    description: "Provides deep nourishment and improves shine for color-treated hair.",
    hairType: "Curly",
    imageUri: "https://example.com/hbc-argan.png"
  },
  {
    title: "Watsons Naturals Coffee Shampoo",
    description: "Boosts hair growth and revitalizes dull strands with natural coffee extract.",
    hairType: "Straight",
    imageUri: "https://example.com/watsons-coffee.png"
  },
  {
    title: "Watsons Olive Conditioner",
    description: "Moisturizes and strengthens dry or brittle hair with olive oil extract.",
    hairType: "Wavy",
    imageUri: "https://example.com/watsons-olive.png"
  },
  {
    title: "Bench Fix Argan Hair Oil",
    description: "Lightweight oil that tames frizz and adds shine without greasiness.",
    hairType: "Straight",
    imageUri: "https://example.com/bench-argan.png"
  },
  {
    title: "Zenutrients Gugo + Lawat Hair Tonic",
    description: "Promotes scalp health and hair regrowth with natural herbal extracts.",
    hairType: "Kinky",
    imageUri: "https://example.com/zen-tonic.png"
  },
  {
    title: "Luxe Organix Biotin Shampoo",
    description: "Fortifies weak hair with biotin and collagen for thicker-looking strands.",
    hairType: "Curly",
    imageUri: "https://example.com/luxe-biotin.png"
  },

  // ----- IMPORTED BRANDS -----
  {
    title: "Shiseido Fino Premium Touch Hair Mask",
    description: "Japanese deep repair mask that restores smoothness and shine to damaged hair.",
    hairType: "Wavy",
    imageUri: "https://example.com/fino-mask.png"
  },
  {
    title: "L’Oréal Paris Total Repair 5 Shampoo",
    description: "Targets five signs of damage for stronger, smoother hair.",
    hairType: "Straight",
    imageUri: "https://example.com/loreal-total.png"
  },
  {
    title: "Pantene Pro-V Smooth & Sleek Conditioner",
    description: "Fights frizz and delivers silky, soft hair with pro-vitamin B5.",
    hairType: "Wavy",
    imageUri: "https://example.com/pantene-smooth.png"
  },
  {
    title: "Dove Intense Repair Conditioner",
    description: "Repairs signs of surface damage and nourishes hair from within.",
    hairType: "Straight",
    imageUri: "https://example.com/dove-repair.png"
  },
  {
    title: "TRESemmé Keratin Smooth Shampoo",
    description: "With marula oil to provide up to 72 hours of frizz control.",
    hairType: "Curly",
    imageUri: "https://example.com/tresemme-keratin.png"
  },
  {
    title: "Head & Shoulders Anti-Dandruff Cool Menthol",
    description: "Cleanses scalp and provides cooling relief from dandruff itch.",
    hairType: "Straight",
    imageUri: "https://example.com/hns-cool.png"
  },
  {
    title: "OGX Coconut Milk Conditioner",
    description: "Nourishes hair with coconut milk, egg white proteins, and coconut oil.",
    hairType: "Curly",
    imageUri: "https://example.com/ogx-coconut.png"
  },
  {
    title: "Herbal Essences Argan Oil of Morocco Shampoo",
    description: "Hydrating shampoo with argan oil for soft, manageable hair.",
    hairType: "Wavy",
    imageUri: "https://example.com/herbal-argan.png"
  },
  {
    title: "Garnier Fructis Grow Strong Shampoo",
    description: "Strengthens hair from root to tip with active fruit protein.",
    hairType: "Straight",
    imageUri: "https://example.com/garnier-grow.png"
  },
  {
    title: "Moroccanoil Treatment Original",
    description: "Iconic argan oil-infused treatment that smooths and detangles hair instantly.",
    hairType: "Wavy",
    imageUri: "https://example.com/moroccanoil.png"
  },
  {
    title: "Olaplex No.3 Hair Perfector",
    description: "Rebuilds broken hair bonds and improves overall strength and texture.",
    hairType: "Curly",
    imageUri: "https://example.com/olaplex.png"
  },
  {
    title: "Kérastase Elixir Ultime Oil",
    description: "Luxurious leave-in oil that adds brilliance and nourishment.",
    hairType: "Straight",
    imageUri: "https://example.com/kerastase-oil.png"
  },
  {
    title: "L’Oréal EverPure Sulfate-Free Moisture Shampoo",
    description: "Gentle formula that hydrates color-treated hair without sulfates.",
    hairType: "Wavy",
    imageUri: "https://example.com/loreal-everpure.png"
  },
  {
    title: "Schwarzkopf Gliss Hair Repair Serum",
    description: "Repairs intensely damaged hair fibers for smoother texture.",
    hairType: "Curly",
    imageUri: "https://example.com/gliss-serum.png"
  },
  {
    title: "John Frieda Frizz Ease Extra Strength Serum",
    description: "Protects against humidity and provides lasting frizz control.",
    hairType: "Wavy",
    imageUri: "https://example.com/john-serum.png"
  },
  {
    title: "The Body Shop Ginger Scalp Care Shampoo",
    description: "Cleanses and revitalizes flaky scalp with ginger essential oil.",
    hairType: "Straight",
    imageUri: "https://example.com/bodyshop-ginger.png"
  },
  {
    title: "Lush Avocado Co-Wash",
    description: "Moisturizing co-wash bar made with avocado butter and olive oil.",
    hairType: "Kinky",
    imageUri: "https://example.com/lush-avocado.png"
  },
  {
    title: "Aussie 3 Minute Miracle Moist Deep Conditioner",
    description: "Revives dry hair in minutes with Australian aloe and jojoba oil.",
    hairType: "Curly",
    imageUri: "https://example.com/aussie-miracle.png"
  },
  {
    title: "Toni & Guy Damage Repair Mask",
    description: "Salon-grade repair mask that restores smoothness and shine.",
    hairType: "Wavy",
    imageUri: "https://example.com/toni-mask.png"
  },
  {
    title: "Batiste Dry Shampoo Original",
    description: "Instantly refreshes hair and adds volume without washing.",
    hairType: "Straight",
    imageUri: "https://example.com/batiste.png"
  },
  {
    title: "SheaMoisture Coconut & Hibiscus Curl Enhancing Smoothie",
    description: "Defines curls and restores moisture with coconut oil and silk protein.",
    hairType: "Curly",
    imageUri: "https://example.com/shea-smoothie.png"
  },
  {
    title: "Mielle Organics Rosemary Mint Scalp & Hair Oil",
    description: "Stimulates scalp and promotes growth with natural rosemary and mint oils.",
    hairType: "Kinky",
    imageUri: "https://example.com/mielle-rosemary.png"
  },
  {
    title: "Living Proof Perfect Hair Day Dry Shampoo",
    description: "Actually cleans hair by absorbing oil and odor for a refreshed feel.",
    hairType: "Straight",
    imageUri: "https://example.com/livingproof.png"
  },
  {
    title: "Briogeo Don’t Despair, Repair! Mask",
    description: "Intensely hydrates and strengthens damaged hair with rosehip oil.",
    hairType: "Wavy",
    imageUri: "https://example.com/briogeo.png"
  },
  {
    title: "Redken All Soft Shampoo",
    description: "Softens and moisturizes brittle hair with argan oil and protein complex.",
    hairType: "Wavy",
    imageUri: "https://example.com/redken-soft.png"
  },
  {
    title: "Paul Mitchell Tea Tree Special Shampoo",
    description: "Invigorates scalp and leaves hair refreshed with peppermint and tea tree oil.",
    hairType: "Straight",
    imageUri: "https://example.com/paul-teatree.png"
  }
];

async function seedSuggestedProductsIfEmpty(db: SQLite.SQLiteDatabase): Promise<void> {
  try {
    const row = await db.getFirstAsync<any>('SELECT COUNT(1) as c FROM suggested_products;');
    const count = Number(row?.c ?? 0);
    if (count > 0) return;
    const now = Date.now();
    // Insert in a transaction for speed
    for (const p of SEED_SUGGESTED_PRODUCTS) {
      await db.runAsync(
        `INSERT INTO suggested_products (title, description, hair_type, image_uri, created_at) VALUES (?, ?, ?, ?, ?);`,
        p.title,
        p.description ?? null,
        p.hairType ?? null,
        p.imageUri ?? null,
        now
      );
    }
  } catch (e) {
    // Do not block app if seed fails
    // eslint-disable-next-line no-console
    console.warn('Seed suggested_products failed', e);
  }
}

export async function addSuggestedProduct(product: SuggestedProduct): Promise<number> {
  const db = await openDatabase();
  const createdAt = Date.now();
  const result = await db.runAsync(
    `INSERT INTO suggested_products (title, description, hair_type, image_uri, created_at)
     VALUES (?, ?, ?, ?, ?);`,
    product.title,
    product.description ?? null,
    product.hairType ?? null,
    product.imageUri ?? null,
    createdAt
  );
  return result.lastInsertRowId ?? 0;
}

export async function listSuggestedProducts(options?: { hairType?: string; limit?: number; search?: string; }): Promise<SuggestedProduct[]> {
  const db = await openDatabase();
  const clauses: string[] = [];
  const params: any[] = [];

  if (options?.hairType) {
    clauses.push('hair_type = ?');
    params.push(options.hairType);
  }
  if (options?.search) {
    clauses.push('title LIKE ?');
    params.push(`%${options.search}%`);
  }
  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
  const limit = options?.limit ? `LIMIT ${Math.max(1, options.limit)}` : '';

  const rows = await db.getAllAsync<any>(
    `SELECT id, title, description, hair_type as hairType, image_uri as imageUri, created_at as createdAt
     FROM suggested_products ${where}
     ORDER BY created_at DESC ${limit};`,
    ...params
  );
  return rows as SuggestedProduct[];
}

export async function getSuggestedProduct(id: number): Promise<SuggestedProduct | null> {
  const db = await openDatabase();
  const row = await db.getFirstAsync<any>(
    `SELECT id, title, description, hair_type as hairType, image_uri as imageUri, created_at as createdAt
     FROM suggested_products WHERE id = ?;`,
    id
  );
  return (row ?? null) as SuggestedProduct | null;
}

export async function updateSuggestedProduct(id: number, updates: Partial<SuggestedProduct>): Promise<void> {
  const db = await openDatabase();
  const fields: string[] = [];
  const params: any[] = [];
  if (typeof updates.title === 'string') { fields.push('title = ?'); params.push(updates.title); }
  if (updates.description !== undefined) { fields.push('description = ?'); params.push(updates.description); }
  if (updates.hairType !== undefined) { fields.push('hair_type = ?'); params.push(updates.hairType); }
  if (updates.imageUri !== undefined) { fields.push('image_uri = ?'); params.push(updates.imageUri); }
  if (!fields.length) return;
  params.push(id);
  await db.runAsync(`UPDATE suggested_products SET ${fields.join(', ')} WHERE id = ?;`, ...params);
}

export async function deleteSuggestedProduct(id: number): Promise<void> {
  const db = await openDatabase();
  await db.runAsync(`DELETE FROM suggested_products WHERE id = ?;`, id);
}

export async function clearAllSuggestedProducts(): Promise<void> {
  const db = await openDatabase();
  await db.runAsync(`DELETE FROM suggested_products;`);
}



