import initSqlJs, { Database } from 'sql.js';
import { FlowerEntry } from '../types/flower';

const DB_STORAGE_KEY = 'flowercount_sqlite_binary_v1';

let dbInstance: Database | null = null;

// Initial campus sightings with realistic geographic coordinates centered on campus gardens
const INITIAL_SEED_FLOWERS: FlowerEntry[] = [
  {
    id: 'fl-1',
    name: 'Scarlet Tropical Hibiscus',
    category: 'Hibiscus',
    locationName: 'Admin Central Lawn',
    lat: 10.6015,
    lng: 76.1528,
    count: 18,
    notes: 'Vibrant red blooms right near the fountain hedges! Fully in bloom this morning.',
    imageUrl: '/src/assets/images/botanical_specimen_hibiscus_1790316203580.jpg',
    userName: 'Aanya S.',
    userRole: 'admin',
    timestamp: '2026-09-24T09:30:00Z',
    reactions: { cherry: 14, blossom: 5, hibiscus: 22, sparkles: 12, love: 18 },
  },
  {
    id: 'fl-2',
    name: 'Paper Bougainvillea Canopy',
    category: 'Bougainvillea',
    locationName: 'Engineering Lab Archway',
    lat: 10.6022,
    lng: 76.1539,
    count: 75,
    notes: 'Cascading magenta blossoms covering the entire workshop south wall!',
    imageUrl: '/src/assets/images/botanical_specimen_bougainvillea_1790316217851.jpg',
    userName: 'Rohan K.',
    userRole: 'user',
    timestamp: '2026-09-24T10:15:00Z',
    reactions: { cherry: 19, blossom: 8, hibiscus: 9, sparkles: 24, love: 15 },
  },
  {
    id: 'fl-3',
    name: 'Golden Sun Marigolds',
    category: 'Marigold',
    locationName: 'Canteen Garden Path',
    lat: 10.6008,
    lng: 76.1519,
    count: 42,
    notes: 'Sweet fragrant border plants catching morning dew near chai counter.',
    imageUrl: '/src/assets/images/botanical_specimen_marigold_1790316233089.jpg',
    userName: 'Kavya M.',
    userRole: 'user',
    timestamp: '2026-09-24T11:45:00Z',
    reactions: { cherry: 6, blossom: 31, hibiscus: 4, sparkles: 16, love: 20 },
  },
  {
    id: 'fl-4',
    name: 'Fragrant White Frangipani',
    category: 'Frangipani',
    locationName: 'Library Quiet Steps',
    lat: 10.6019,
    lng: 76.1545,
    count: 12,
    notes: 'Five-petal white blossoms falling gently on stone steps. Super aesthetic for book photos!',
    imageUrl: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=800&auto=format&fit=crop&q=80',
    userName: 'Devika P.',
    userRole: 'user',
    timestamp: '2026-09-24T13:20:00Z',
    reactions: { cherry: 28, blossom: 15, hibiscus: 6, sparkles: 33, love: 25 },
  },
  {
    id: 'fl-5',
    name: 'Wild Purple Morning Glories',
    category: 'Wildflower',
    locationName: 'Sports Ground Fence',
    lat: 10.6028,
    lng: 76.1512,
    count: 34,
    notes: 'Spreading vines hugging the cricket net boundary fence. Open wide during morning sun.',
    imageUrl: 'https://images.unsplash.com/photo-1527061011665-3652c757a4d4?w=800&auto=format&fit=crop&q=80',
    userName: 'Arjun N.',
    userRole: 'user',
    timestamp: '2026-09-24T14:10:00Z',
    reactions: { cherry: 12, blossom: 18, hibiscus: 7, sparkles: 11, love: 14 },
  },
  {
    id: 'fl-6',
    name: 'Bright Yellow Tecoma Bells',
    category: 'Sunflower',
    locationName: 'Open Air Theatre (OAT)',
    lat: 10.6011,
    lng: 76.1552,
    count: 27,
    notes: 'Bushy vibrant yellow trumpet bells glowing under the golden hour sunlight.',
    imageUrl: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=800&auto=format&fit=crop&q=80',
    userName: 'Sneha R.',
    userRole: 'admin',
    timestamp: '2026-09-24T16:05:00Z',
    reactions: { cherry: 15, blossom: 22, hibiscus: 5, sparkles: 20, love: 19 },
  }
];

export async function getDatabase(): Promise<Database> {
  if (dbInstance) return dbInstance;

  const SQL = await initSqlJs({
    // Fetch sql-wasm from unpkg or cdn
    locateFile: (file) => `https://sql.js.org/dist/${file}`,
  });

  // Check if we have saved SQLite binary database in localStorage
  let savedData: Uint8Array | null = null;
  try {
    const raw = localStorage.getItem(DB_STORAGE_KEY);
    if (raw) {
      const parsedArray = JSON.parse(raw);
      savedData = new Uint8Array(parsedArray);
    }
  } catch (err) {
    console.warn('Could not restore binary SQLite database, initializing fresh.', err);
  }

  if (savedData) {
    try {
      dbInstance = new SQL.Database(savedData);
      return dbInstance;
    } catch (err) {
      console.warn('Error loading saved SQLite binary, rebuilding fresh db:', err);
    }
  }

  // Create new SQLite database and schema
  dbInstance = new SQL.Database();
  initSchema(dbInstance);
  saveDatabase(dbInstance);
  return dbInstance;
}

function initSchema(db: Database) {
  db.run(`
    CREATE TABLE IF NOT EXISTS flowers (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      locationName TEXT NOT NULL,
      lat REAL NOT NULL,
      lng REAL NOT NULL,
      count INTEGER NOT NULL,
      notes TEXT,
      imageUrl TEXT,
      userName TEXT NOT NULL,
      userRole TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      reactions_json TEXT NOT NULL
    );
  `);

  // Insert seed rows into SQLite table
  const insertStmt = db.prepare(`
    INSERT INTO flowers (id, name, category, locationName, lat, lng, count, notes, imageUrl, userName, userRole, timestamp, reactions_json)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const f of INITIAL_SEED_FLOWERS) {
    insertStmt.run([
      f.id,
      f.name,
      f.category,
      f.locationName,
      f.lat,
      f.lng,
      f.count,
      f.notes || '',
      f.imageUrl || '',
      f.userName,
      f.userRole,
      f.timestamp,
      JSON.stringify(f.reactions),
    ]);
  }
  insertStmt.free();
}

export function saveDatabase(db: Database) {
  try {
    const data = db.export();
    const array = Array.from(data);
    localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(array));
  } catch (err) {
    console.error('Failed to export SQLite database to localStorage:', err);
  }
}

// Data access operations
export async function getAllFlowersFromDb(): Promise<FlowerEntry[]> {
  const db = await getDatabase();
  const res = db.exec('SELECT * FROM flowers ORDER BY timestamp DESC');
  if (!res || res.length === 0) return [];

  const columns = res[0].columns;
  const values = res[0].values;

  return values.map((row) => {
    const obj: any = {};
    columns.forEach((col, idx) => {
      obj[col] = row[idx];
    });

    let reactions = { cherry: 0, blossom: 0, hibiscus: 0, sparkles: 0, love: 0 };
    try {
      if (obj.reactions_json) {
        reactions = JSON.parse(obj.reactions_json);
      }
    } catch {
      // fallback
    }

    return {
      id: String(obj.id),
      name: String(obj.name),
      category: String(obj.category),
      locationName: String(obj.locationName),
      lat: Number(obj.lat),
      lng: Number(obj.lng),
      count: Number(obj.count),
      notes: obj.notes ? String(obj.notes) : undefined,
      imageUrl: obj.imageUrl ? String(obj.imageUrl) : undefined,
      userName: String(obj.userName),
      userRole: (obj.userRole === 'admin' ? 'admin' : 'user') as 'admin' | 'user',
      timestamp: String(obj.timestamp),
      reactions,
    };
  });
}

export async function insertFlowerIntoDb(flower: FlowerEntry): Promise<void> {
  const db = await getDatabase();
  const stmt = db.prepare(`
    INSERT INTO flowers (id, name, category, locationName, lat, lng, count, notes, imageUrl, userName, userRole, timestamp, reactions_json)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run([
    flower.id,
    flower.name,
    flower.category,
    flower.locationName,
    flower.lat,
    flower.lng,
    flower.count,
    flower.notes || '',
    flower.imageUrl || '',
    flower.userName,
    flower.userRole,
    flower.timestamp,
    JSON.stringify(flower.reactions),
  ]);
  stmt.free();
  saveDatabase(db);
}

export async function updateFlowerReactionsInDb(flowerId: string, reactions: FlowerEntry['reactions']): Promise<void> {
  const db = await getDatabase();
  const stmt = db.prepare(`
    UPDATE flowers SET reactions_json = ? WHERE id = ?
  `);
  stmt.run([JSON.stringify(reactions), flowerId]);
  stmt.free();
  saveDatabase(db);
}

export async function deleteFlowerFromDb(flowerId: string): Promise<void> {
  const db = await getDatabase();
  const stmt = db.prepare(`
    DELETE FROM flowers WHERE id = ?
  `);
  stmt.run([flowerId]);
  stmt.free();
  saveDatabase(db);
}

export async function resetDatabaseToDefault(): Promise<void> {
  localStorage.removeItem(DB_STORAGE_KEY);
  dbInstance = null;
  await getDatabase();
}
