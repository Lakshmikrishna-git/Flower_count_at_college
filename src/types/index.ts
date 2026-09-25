export type FlowerCondition =
  | 'thriving'
  | 'wilted_by_exams'
  | 'munched_by_caterpillar'
  | 'soaked_in_chai'
  | 'legendary_bloom';

export interface FlowerSpecimen {
  id: string;
  name: string;
  scientificName: string;
  zoneId: string;
  zoneName: string;
  count: number;
  petalsPerFlower: number;
  totalPetals: number;
  color: string;
  dateAdded: string;
  finderName: string;
  imageUrl?: string;
  condition: FlowerCondition;
  verdict?: string;
  academicEquivalent?: string;
  campusRisk?: string;
  uselessFact?: string;
}

export interface CampusZone {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  xPercent: number; // For interactive campus map (0 - 100)
  yPercent: number; // For interactive campus map (0 - 100)
  dangerLevel: 'Low' | 'Moderate' | 'High' | 'Watchman Patrol';
  watchmanPresence: string;
  studentActivity: string;
  iconName: string;
  accentColor: string;
  defaultFlowerType: string;
}

export interface CampusProfile {
  collegeName: string;
  shortCode: string;
  location: string;
  motto: string;
  studentBodyCount: number;
  establishedYear: number;
}

export interface ExaminedFlowerResult {
  botanicalIdentity: string;
  scientificName: string;
  estimatedPetals: number;
  verdict: string;
  campusRiskLevel: string;
  academicEquivalent: string;
  uselessFunFact: string;
}
