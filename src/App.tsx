import React, { useState, useEffect } from 'react';
import {
  Flower,
  Plus,
  MapPin,
  Sparkles,
  BarChart2,
  Filter,
  Flame,
  Shield,
  RotateCcw,
  Search,
  Layers,
  Heart,
} from 'lucide-react';
import { FlowerEntry, Contributor } from './types/flower';
import {
  getAllFlowersFromDb,
  insertFlowerIntoDb,
  updateFlowerReactionsInDb,
  deleteFlowerFromDb,
  resetDatabaseToDefault,
} from './db/sqliteService';
import { InteractiveCampusMap } from './components/InteractiveCampusMap';
import { FlowerAnalyticsCharts } from './components/FlowerAnalyticsCharts';
import { GenZWidgets } from './components/GenZWidgets';
import { FlowerSightingsList } from './components/FlowerSightingsList';
import { BloomHistoryTimeline } from './components/BloomHistoryTimeline';
import { CampusAntiPluckingTicker } from './components/CampusAntiPluckingTicker';
import { HumorousCertificate } from './components/HumorousCertificate';
import { AddFlowerModal } from './components/AddFlowerModal';
import {
  CAMPUS_CAMPUS_LOCATIONS,
  FLOWER_CATEGORIES,
  FLOWER_OF_THE_DAY,
} from './data/flowerConstants';
import confetti from 'canvas-confetti';

export default function App() {
  const [flowers, setFlowers] = useState<FlowerEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [preselectedCoords, setPreselectedCoords] = useState<{
    lat: number;
    lng: number;
    location: string;
  } | null>(null);

  // User Roles (admin / user)
  const [currentUserRole, setCurrentUserRole] = useState<'user' | 'admin'>('user');
  const [currentUserName, setCurrentUserName] = useState<string>('Campus Scout');

  // Load from SQLite database on mount
  useEffect(() => {
    async function loadData() {
      try {
        const data = await getAllFlowersFromDb();
        setFlowers(data);
      } catch (err) {
        console.error('Failed to load flowers from SQLite:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Compute Dashboard Metrics
  const totalFlowerCount = flowers.reduce((sum, f) => sum + f.count, 0);

  // Most common flower types
  const typeCounts: Record<string, number> = {};
  flowers.forEach((f) => {
    typeCounts[f.category] = (typeCounts[f.category] || 0) + f.count;
  });

  const sortedTypes = Object.entries(typeCounts).sort((a, b) => b[1] - a[1]);
  const mostCommonType = sortedTypes[0] ? sortedTypes[0][0] : 'Hibiscus';
  const mostCommonCount = sortedTypes[0] ? sortedTypes[0][1] : 0;

  // Compute Leaderboard Contributors
  const contributorMap: Record<string, { total: number; sightings: number; role: 'user' | 'admin' }> = {};
  flowers.forEach((f) => {
    if (!contributorMap[f.userName]) {
      contributorMap[f.userName] = { total: 0, sightings: 0, role: f.userRole };
    }
    contributorMap[f.userName].total += f.count;
    contributorMap[f.userName].sightings += 1;
  });

  const contributors: Contributor[] = Object.entries(contributorMap)
    .map(([name, data]) => ({
      userName: name,
      avatar: name.charAt(0),
      role: data.role,
      totalFlowers: data.total,
      sightingsCount: data.sightings,
      badge: data.total > 50 ? '🌸 Master Botanist' : '🌱 Scout',
    }))
    .sort((a, b) => b.totalFlowers - a.totalFlowers);

  // Handler: Map coordinate clicked
  const handleMapClickCoordinates = (lat: number, lng: number, suggestedLocation: string) => {
    setPreselectedCoords({ lat, lng, location: suggestedLocation });
    setIsAddModalOpen(true);
  };

  // Handler: Add Flower
  const handleSaveFlower = async (
    flowerData: Omit<FlowerEntry, 'id' | 'timestamp' | 'reactions'>
  ) => {
    const newEntry: FlowerEntry = {
      ...flowerData,
      id: `fl-${Date.now()}`,
      timestamp: new Date().toISOString(),
      reactions: { cherry: 1, blossom: 0, hibiscus: 0, sparkles: 1, love: 1 },
    };

    try {
      await insertFlowerIntoDb(newEntry);
      setFlowers((prev) => [newEntry, ...prev]);
    } catch (err) {
      console.error('Failed to insert flower into SQLite:', err);
    }
  };

  // Handler: Emoji reactions
  const handleReact = async (
    flowerId: string,
    reactionType: keyof FlowerEntry['reactions']
  ) => {
    const target = flowers.find((f) => f.id === flowerId);
    if (!target) return;

    const updatedReactions = {
      ...target.reactions,
      [reactionType]: target.reactions[reactionType] + 1,
    };

    setFlowers((prev) =>
      prev.map((f) => (f.id === flowerId ? { ...f, reactions: updatedReactions } : f))
    );

    try {
      await updateFlowerReactionsInDb(flowerId, updatedReactions);
    } catch (err) {
      console.error('Failed to update reaction in SQLite:', err);
    }
  };

  // Handler: Delete Flower (Admin capability)
  const handleDeleteFlower = async (flowerId: string) => {
    if (!confirm('Are you sure you want to delete this flower sighting from the campus database?')) {
      return;
    }

    try {
      await deleteFlowerFromDb(flowerId);
      setFlowers((prev) => prev.filter((f) => f.id !== flowerId));
    } catch (err) {
      console.error('Failed to delete from SQLite:', err);
    }
  };

  // Handler: Reset Database
  const handleResetData = async () => {
    if (confirm('Reset campus SQLite database back to original botanical seed sightings?')) {
      await resetDatabaseToDefault();
      const fresh = await getAllFlowersFromDb();
      setFlowers(fresh);
    }
  };

  // Filtered flowers list for search input
  const searchedFlowers = flowers.filter((f) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      f.name.toLowerCase().includes(q) ||
      f.category.toLowerCase().includes(q) ||
      f.locationName.toLowerCase().includes(q) ||
      f.userName.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-[#fbfbfa] text-stone-900 font-sans selection:bg-emerald-100 selection:text-emerald-900 pb-20">
      {/* Aesthetic Notion-Style Clean Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-stone-200/80 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center text-lg shadow-xs shadow-emerald-500/20">
              🌸
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-lg font-bold font-serif text-stone-900 tracking-tight leading-none">
                  FlowerCount
                </h1>
                <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full font-mono">
                  v2.0
                </span>
              </div>
              <p className="text-[11px] text-stone-500 font-medium">
                Campus Flora Tracker & SQLite Heatmap
              </p>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick section links */}
            <div className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-stone-600 bg-stone-100 p-1 rounded-full">
              <a href="#timeline-section" className="px-3 py-1 rounded-full hover:bg-white hover:text-stone-900 transition-colors">
                Timeline ⏳
              </a>
              <a href="#map-section" className="px-3 py-1 rounded-full hover:bg-white hover:text-stone-900 transition-colors">
                Map 🗺️
              </a>
              <a href="#warnings-section" className="px-3 py-1 rounded-full hover:bg-white hover:text-stone-900 transition-colors">
                Warnings 🚨
              </a>
              <a href="#certificate-section" className="px-3 py-1 rounded-full hover:bg-white hover:text-stone-900 transition-colors">
                Diploma 📜
              </a>
            </div>

            {/* Role indicator pill */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 text-xs font-semibold text-stone-700">
              <span className={`w-2 h-2 rounded-full ${currentUserRole === 'admin' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
              <span>{currentUserRole === 'admin' ? 'Admin Mode 🛡️' : 'Scout Mode 🌱'}</span>
            </div>

            <button
              onClick={() => {
                setPreselectedCoords(null);
                setIsAddModalOpen(true);
              }}
              className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-full shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Flower</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-8">
        {/* Gen Z Dashboard Header & Stats Cards */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900 tracking-tight">
                Campus Bloom Dashboard
              </h2>
              <p className="text-xs sm:text-sm text-stone-500">
                Track, map, and count flowers on our college campus in real-time.
              </p>
            </div>

            <button
              onClick={handleResetData}
              className="self-start sm:self-auto text-xs text-stone-400 hover:text-stone-700 flex items-center gap-1 transition-colors cursor-pointer"
              title="Reset SQLite database"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Database</span>
            </button>
          </div>

          {/* Metric Cards (Notion / Pinterest Aesthetic Rounded Style) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* 1. Total Flower Count */}
            <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs hover:shadow-sm transition-all group">
              <div className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center justify-between">
                <span>Total Flower Count</span>
                <span className="text-lg">🌸</span>
              </div>
              <div className="mt-2 text-3xl sm:text-4xl font-mono font-bold text-stone-900 tabular-nums">
                {totalFlowerCount.toLocaleString()}
              </div>
              <div className="mt-1 text-xs text-emerald-700 font-semibold flex items-center gap-1">
                <span>Across {flowers.length} campus spots</span>
              </div>
            </div>

            {/* 2. Most Common Flower */}
            <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs hover:shadow-sm transition-all group">
              <div className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center justify-between">
                <span>Top Flower Type</span>
                <span className="text-lg">👑</span>
              </div>
              <div className="mt-2 text-2xl sm:text-3xl font-bold font-serif text-stone-900 truncate">
                {mostCommonType}
              </div>
              <div className="mt-1 text-xs text-stone-500 font-mono">
                {mostCommonCount} blossoms ({totalFlowerCount > 0 ? Math.round((mostCommonCount / totalFlowerCount) * 100) : 0}%)
              </div>
            </div>

            {/* 3. High Density Hotspot */}
            <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs hover:shadow-sm transition-all group">
              <div className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center justify-between">
                <span>Peak Floral Hotspot</span>
                <span className="text-lg">📍</span>
              </div>
              <div className="mt-2 text-xl sm:text-2xl font-bold text-stone-900 truncate">
                Engineering Lab
              </div>
              <div className="mt-1 text-xs text-rose-600 font-semibold flex items-center gap-1">
                <Flame className="w-3.5 h-3.5" />
                <span>Heatmap Glow: Intense</span>
              </div>
            </div>

            {/* 4. Active Scouts */}
            <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs hover:shadow-sm transition-all group">
              <div className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center justify-between">
                <span>Active Student Scouts</span>
                <span className="text-lg">🌱</span>
              </div>
              <div className="mt-2 text-3xl sm:text-4xl font-mono font-bold text-stone-900 tabular-nums">
                {contributors.length}
              </div>
              <div className="mt-1 text-xs text-stone-500">
                SQLite database connected
              </div>
            </div>
          </div>
        </section>

        {/* Anti-Plucking Gen Z Warnings Ticker */}
        <section id="warnings-section">
          <CampusAntiPluckingTicker />
        </section>

        {/* Gen Z Widgets Row: Flower of the Day + Fun Facts + Leaderboard */}
        <section>
          <GenZWidgets
            flowerOfTheDay={FLOWER_OF_THE_DAY}
            contributors={contributors}
            currentUserRole={currentUserRole}
            currentUserName={currentUserName}
            onSwitchUserRole={(role, name) => {
              setCurrentUserRole(role);
              setCurrentUserName(name);
            }}
          />
        </section>

        {/* Bloom History Timeline Widget */}
        <section id="timeline-section">
          <BloomHistoryTimeline flowers={flowers} />
        </section>

        {/* Interactive Campus Map Section with Leaflet + Heatmap */}
        <section id="map-section" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>Leaflet.js + Heatmap Integration</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-serif text-stone-900 tracking-tight mt-0.5">
                Interactive Campus Flora Map
              </h3>
            </div>

            {/* Filters on Map */}
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="text-xs font-semibold bg-white border border-stone-200 rounded-full px-3 py-1.5 text-stone-700 focus:outline-emerald-500 shadow-2xs"
              >
                <option value="all">All Flower Types</option>
                {FLOWER_CATEGORIES.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.emoji} {c.name}
                  </option>
                ))}
              </select>

              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="text-xs font-semibold bg-white border border-stone-200 rounded-full px-3 py-1.5 text-stone-700 focus:outline-emerald-500 shadow-2xs"
              >
                <option value="all">All Campus Locations</option>
                {CAMPUS_CAMPUS_LOCATIONS.map((l) => (
                  <option key={l.name} value={l.name}>
                    {l.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <InteractiveCampusMap
            flowers={flowers}
            selectedCategory={selectedCategory}
            selectedLocation={selectedLocation}
            onMapClickCoordinates={handleMapClickCoordinates}
            onSelectFlower={(f) => {
              // Scroll to sightings list or inspect
              console.log('Selected flower on map:', f);
            }}
          />
        </section>

        {/* Data Visualization Section (Chart.js) */}
        <section>
          <FlowerAnalyticsCharts flowers={flowers} />
        </section>

        {/* Recent Uploads & Sightings Feed */}
        <section className="space-y-4">
          {/* Search bar inside feed */}
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sightings by name, spot, scout..."
              className="w-full text-xs font-medium bg-white border border-stone-200 rounded-full pl-9 pr-4 py-2.5 text-stone-800 placeholder-stone-400 focus:outline-emerald-500 shadow-2xs"
            />
          </div>

          <FlowerSightingsList
            flowers={searchedFlowers}
            selectedCategory={selectedCategory}
            selectedLocation={selectedLocation}
            currentUserRole={currentUserRole}
            onReact={handleReact}
            onDeleteFlower={handleDeleteFlower}
          />
        </section>

        {/* Humorous Fake Certificate Generator */}
        <section id="certificate-section">
          <HumorousCertificate
            currentUserName={currentUserName}
            totalSightingsCount={flowers.length}
            totalFlowersCount={totalFlowerCount}
          />
        </section>
      </main>

      {/* Floating "Add Flower" Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => {
            setPreselectedCoords(null);
            setIsAddModalOpen(true);
          }}
          className="group px-5 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-2 border-2 border-white/40"
        >
          <span className="text-lg group-hover:rotate-45 transition-transform">🌸</span>
          <span>Add Flower</span>
        </button>
      </div>

      {/* Add Flower Modal */}
      <AddFlowerModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSaveFlower={handleSaveFlower}
        preselectedCoords={preselectedCoords}
        currentUserRole={currentUserRole}
        currentUserName={currentUserName}
      />

      {/* Aesthetic Minimal Footer */}
      <footer className="mt-20 border-t border-stone-200 bg-white/60 py-8 text-center text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-serif font-bold text-stone-800">
            <span>FlowerCount 🌸</span>
            <span className="text-stone-300">·</span>
            <span className="font-sans text-xs font-normal text-stone-500">
              Campus Botanical Scout Bureau
            </span>
          </div>

          <p className="text-[11px] text-stone-400">
            Powered by SQLite Database, Leaflet.js Heatmaps & Chart.js Visuals
          </p>
        </div>
      </footer>
    </div>
  );
}
