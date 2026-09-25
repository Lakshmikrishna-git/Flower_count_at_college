// Database interface for FlowerCount 🌸 SQLite storage
export interface FlowerEntry {
  id: string;
  name: string;
  category: string; // e.g. "Hibiscus", "Bougainvillea", "Marigold", "Frangipani", "Rose", "Jasmine", "Sunflower", "Wildflower"
  locationName: string;
  lat: number;
  lng: number;
  count: number;
  notes?: string;
  imageUrl?: string;
  userName: string;
  userRole: 'user' | 'admin';
  timestamp: string;
  reactions: {
    cherry: number; // 🌸
    blossom: number; // 🌼
    hibiscus: number; // 🌺
    sparkles: number; // ✨
    love: number; // 💚
  };
}

export interface FlowerTypeStat {
  name: string;
  count: number;
  sightings: number;
  color: string;
  emoji: string;
}

export interface Contributor {
  userName: string;
  avatar: string;
  role: 'admin' | 'user';
  totalFlowers: number;
  sightingsCount: number;
  badge: string;
}

export interface FlowerOfTheDay {
  name: string;
  scientificName: string;
  emoji: string;
  vibe: string;
  funFact: string;
  spottedToday: number;
  locationTip: string;
  aestheticColor: string;
}
