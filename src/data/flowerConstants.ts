import { FlowerOfTheDay } from '../types/flower';

export const CAMPUS_CAMPUS_LOCATIONS = [
  { name: 'Admin Central Lawn', lat: 10.6015, lng: 76.1528, vibe: 'Manicured, sunny, formal hedges' },
  { name: 'Engineering Lab Archway', lat: 10.6022, lng: 76.1539, vibe: 'Climbing bougainvillea, brick walls' },
  { name: 'Canteen Garden Path', lat: 10.6008, lng: 76.1519, vibe: 'Chai steam, marigolds, high footfall' },
  { name: 'Library Quiet Steps', lat: 10.6019, lng: 76.1545, vibe: 'Shaded, fragrant frangipani, study zone' },
  { name: 'Sports Ground Fence', lat: 10.6028, lng: 76.1512, vibe: 'Wild vines, morning glories, breezy' },
  { name: 'Open Air Theatre (OAT)', lat: 10.6011, lng: 76.1552, vibe: 'Golden tecoma shrubs, stage perimeter' },
  { name: 'Hostel Mud Path Shortcut', lat: 10.6033, lng: 76.1522, vibe: 'Touch-me-not wild blossoms, green moss' },
  { name: 'Mechanical Workshop Courtyard', lat: 10.6025, lng: 76.1548, vibe: 'Sun-drenched, potted desert roses' },
];

export const FLOWER_CATEGORIES = [
  { name: 'Hibiscus', emoji: '🌺', color: '#f43f5e', sampleNames: ['Red Tropical Hibiscus', 'Pink Double Hibiscus', 'Yellow Queen Hibiscus'] },
  { name: 'Bougainvillea', emoji: '🌸', color: '#ec4899', sampleNames: ['Paper Magenta Bougainvillea', 'White Bridal Bougainvillea', 'Orange Sunset Bracts'] },
  { name: 'Marigold', emoji: '🌼', color: '#f59e0b', sampleNames: ['French Dwarf Marigold', 'African Giant Golden Marigold', 'Canteen Border Calendula'] },
  { name: 'Frangipani', emoji: '🤍', color: '#10b981', sampleNames: ['Temple Tree White Plumeria', 'Pink Singapore Frangipani'] },
  { name: 'Rose', emoji: '🌹', color: '#e11d48', sampleNames: ['Campus Red Bush Rose', 'Pastel Pink Miniature Rose', 'Cream Tea Rose'] },
  { name: 'Jasmine', emoji: '✨', color: '#06b6d4', sampleNames: ['Star Jasmine', 'Arabian Arabian Jasmine (Mulla)', 'Night-Blooming Cestrum'] },
  { name: 'Sunflower', emoji: '🌻', color: '#eab308', sampleNames: ['Dwarf Sunburst', 'Yellow Tecoma Trumpet Bells', 'Cosmos Blossom'] },
  { name: 'Wildflower', emoji: '🌿', color: '#8b5cf6', sampleNames: ['Touch-Me-Not (Mimosa)', 'Purple Morning Glory', 'Lantana Camara'] },
];

export const FLOWER_OF_THE_DAY: FlowerOfTheDay = {
  name: 'Scarlet Hibiscus (Chembarathi)',
  scientificName: 'Hibiscus rosa-sinensis',
  emoji: '🌺',
  vibe: 'Iconic South Indian campus royalty',
  funFact: 'In college botany labs, hibiscus petals are famously crushed with lemon juice to make organic pH indicators when test litmus paper goes missing!',
  spottedToday: 42,
  locationTip: 'High density around the Admin Lawn and Mech block corridor.',
  aestheticColor: '#f43f5e',
};

export const RANDOM_FLOWER_FACTS = [
  'Bougainvillea flowers are actually tiny white cylinders inside! The brilliant magenta "petals" are actually modified leaves called bracts.',
  'Frangipani blossoms only release their sweet fragrance at night to deceive sphinx moths into pollinating them, even though they produce zero nectar!',
  'Sunflowers exhibit heliotropism in youth: young buds track the sun from east to west across the campus sky every single day.',
  'Marigolds emit a natural terpene compound that protects nearby tomato and herb gardens by keeping pesky insects away.',
  'Touch-Me-Not (Mimosa pudica) leaves collapse in under 0.1 seconds when brushed due to rapid potassium-driven water release in the pulvinus cells.',
  'Hibiscus tea made from dried calyces is packed with vitamin C and turns deep ruby red without any artificial coloring.'
];
