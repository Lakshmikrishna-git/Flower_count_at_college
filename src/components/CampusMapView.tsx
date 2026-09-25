import React, { useState } from 'react';
import { MapPin, Flower, Plus, Info, Eye } from 'lucide-react';
import { CampusZone, FlowerSpecimen } from '../types';
import { playBloomSound } from '../utils/audio';

interface CampusMapViewProps {
  zones: CampusZone[];
  specimens: FlowerSpecimen[];
  selectedZoneId: string | null;
  onSelectZone: (zoneId: string) => void;
  onOpenAddModalWithZone: (zoneId: string) => void;
  onQuickIncrement: (specimenId: string) => void;
  collegeName: string;
}

export const CampusMapView: React.FC<CampusMapViewProps> = ({
  zones,
  specimens,
  selectedZoneId,
  onSelectZone,
  onOpenAddModalWithZone,
  onQuickIncrement,
  collegeName,
}) => {
  const activeZone = zones.find((z) => z.id === selectedZoneId) || zones[0];
  const activeSpecimens = specimens.filter((s) => s.zoneId === activeZone.id);
  const activeFlowersCount = activeSpecimens.reduce((sum, s) => sum + s.count, 0);
  const activePetalsCount = activeSpecimens.reduce((sum, s) => sum + s.totalPetals, 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-emerald-600 mb-1">
            Tactical Campus Cartography
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight">
            Interactive Campus Floral Grid
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Click on any collegiate sector to inspect petal concentration, watchman patrol frequency, and audited blossoms.
          </p>
        </div>

        <button
          onClick={() => onOpenAddModalWithZone(activeZone.id)}
          className="self-start sm:self-auto px-4 py-2 text-xs font-semibold text-stone-900 bg-emerald-400 hover:bg-emerald-300 rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add Flower in {activeZone.name.split(' ')[0]}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* The Visual Campus Blueprint / Schematic */}
        <div className="lg:col-span-8 bg-stone-900 rounded-2xl p-4 sm:p-6 border border-stone-800 shadow-md relative overflow-hidden">
          {/* Blueprint Grid Lines & Legend */}
          <div className="flex items-center justify-between text-xs text-stone-400 border-b border-stone-800 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono">{collegeName} · Master Ground Plan</span>
            </div>
            <div className="hidden sm:flex items-center gap-4 text-[11px] font-mono">
              <span>SCALE: 1:500 (POINTLESS)</span>
              <span>AZIMUTH: 38° N</span>
            </div>
          </div>

          {/* Stylized Architectural Campus Canvas */}
          <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] bg-stone-950 rounded-xl border border-stone-800/80 overflow-hidden select-none">
            {/* Background Architectural Paths and Lawn Shapes */}
            <svg
              className="absolute inset-0 w-full h-full opacity-40 pointer-events-none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern id="campus-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#262626" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#campus-grid)" />

              {/* Campus Roads and Connecting Walkways */}
              <path
                d="M 50 200 Q 250 220 400 180 T 750 160"
                fill="none"
                stroke="#3f3f46"
                strokeWidth="14"
                strokeLinecap="round"
              />
              <path
                d="M 400 180 L 420 380 L 680 390"
                fill="none"
                stroke="#3f3f46"
                strokeWidth="12"
                strokeLinecap="round"
              />
              <path
                d="M 220 80 L 400 180 L 250 350"
                fill="none"
                stroke="#3f3f46"
                strokeWidth="8"
                strokeDasharray="6 4"
              />

              {/* College Central Lawn Circle */}
              <circle cx="50%" cy="40%" r="65" fill="#064e3b" opacity="0.35" stroke="#059669" strokeWidth="1.5" />
              {/* Canteen Courtyard Garden */}
              <rect x="18%" y="54%" width="90" height="70" rx="10" fill="#78350f" opacity="0.3" stroke="#d97706" strokeWidth="1" />
              {/* Workshop Quad */}
              <polygon points="620,120 740,130 710,240 590,220" fill="#831843" opacity="0.3" stroke="#db2777" strokeWidth="1" />
              {/* Library Trees */}
              <circle cx="68%" cy="75%" r="55" fill="#065f46" opacity="0.3" stroke="#10b981" strokeWidth="1" />
              {/* Sports Ground Oval */}
              <ellipse cx="82%" cy="82%" rx="70" ry="40" fill="#1c1917" stroke="#52525b" strokeWidth="1" strokeDasharray="4 4" />
            </svg>

            {/* Campus Landmark Labels in Background */}
            <div className="absolute top-[28%] left-[45%] text-[10px] sm:text-xs font-mono uppercase text-emerald-500/40 pointer-events-none">
              Decennial Block
            </div>
            <div className="absolute top-[65%] left-[16%] text-[10px] sm:text-xs font-mono uppercase text-amber-500/40 pointer-events-none">
              Canteen & Chai
            </div>
            <div className="absolute top-[32%] right-[14%] text-[10px] sm:text-xs font-mono uppercase text-pink-500/40 pointer-events-none">
              Mech Workshop
            </div>
            <div className="absolute bottom-[24%] right-[22%] text-[10px] sm:text-xs font-mono uppercase text-emerald-400/40 pointer-events-none">
              Library Quad
            </div>
            <div className="absolute top-[10%] left-[12%] text-[10px] sm:text-xs font-mono uppercase text-purple-400/40 pointer-events-none">
              Back Gate
            </div>

            {/* Interactive Zone Pins */}
            {zones.map((zone) => {
              const zoneSpecimens = specimens.filter((s) => s.zoneId === zone.id);
              const flowerTotal = zoneSpecimens.reduce((sum, s) => sum + s.count, 0);
              const isSelected = zone.id === activeZone.id;

              return (
                <div
                  key={zone.id}
                  style={{
                    left: `${zone.xPercent}%`,
                    top: `${zone.yPercent}%`,
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
                  onClick={() => {
                    playBloomSound(1.1);
                    onSelectZone(zone.id);
                  }}
                >
                  {/* Pulsing Target Ring */}
                  {isSelected && (
                    <span
                      className="absolute -inset-3 rounded-full animate-ping opacity-40 pointer-events-none"
                      style={{ backgroundColor: zone.accentColor }}
                    />
                  )}

                  {/* Marker Pin Icon */}
                  <div
                    className={`relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border shadow-lg transition-transform ${
                      isSelected
                        ? 'scale-115 ring-2 ring-white/60 bg-stone-900 border-white text-white'
                        : 'scale-100 bg-stone-900/90 border-stone-700 text-stone-200 group-hover:scale-105'
                    }`}
                  >
                    <Flower
                      className="w-3.5 h-3.5 shrink-0"
                      style={{ color: zone.accentColor }}
                    />
                    <span className="text-[11px] font-mono font-semibold tabular-nums">
                      {flowerTotal}
                    </span>
                  </div>

                  {/* Hover Tag */}
                  <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1.5 hidden group-hover:block whitespace-nowrap bg-stone-950/95 text-stone-200 text-[10px] px-2 py-0.5 rounded border border-stone-700 pointer-events-none z-30 shadow-md">
                    {zone.name}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Zone Navigator Chips */}
          <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-stone-400 font-mono text-[11px] shrink-0">Sectors:</span>
            {zones.map((zone) => {
              const isSelected = zone.id === activeZone.id;
              return (
                <button
                  key={zone.id}
                  onClick={() => onSelectZone(zone.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs transition-colors whitespace-nowrap cursor-pointer shrink-0 font-medium ${
                    isSelected
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-stone-800 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  {zone.name.split('&')[0].trim()}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Sector Inspector Panel */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-stone-500 font-mono">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>Sector Dossier</span>
              </div>
              <h2 className="text-lg font-serif font-bold text-stone-900 mt-1">
                {activeZone.name}
              </h2>
              <p className="text-xs text-stone-500 italic mt-0.5">
                {activeZone.subtitle}
              </p>
            </div>

            <span className="shrink-0 text-xs font-mono font-medium px-2 py-0.5 rounded bg-stone-100 text-stone-700">
              {activeZone.dangerLevel}
            </span>
          </div>

          <p className="text-xs text-stone-600 leading-relaxed bg-stone-50 p-3 rounded-lg border border-stone-100">
            {activeZone.description}
          </p>

          {/* Sector Telemetry Stats */}
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="bg-stone-50 p-3 rounded-lg border border-stone-100">
              <div className="text-[11px] uppercase font-mono text-stone-400">Total Blooms</div>
              <div className="text-2xl font-mono font-bold text-stone-900 tabular-nums">
                {activeFlowersCount}
              </div>
            </div>
            <div className="bg-stone-50 p-3 rounded-lg border border-stone-100">
              <div className="text-[11px] uppercase font-mono text-stone-400">Total Petals</div>
              <div className="text-2xl font-mono font-bold text-emerald-700 tabular-nums">
                {activePetalsCount}
              </div>
            </div>
          </div>

          {/* Field Intel */}
          <div className="space-y-2 text-xs">
            <div className="flex items-start gap-2">
              <span className="font-semibold text-stone-700 shrink-0">Watchman Presence:</span>
              <span className="text-stone-500">{activeZone.watchmanPresence}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-semibold text-stone-700 shrink-0">Student Activity:</span>
              <span className="text-stone-500">{activeZone.studentActivity}</span>
            </div>
          </div>

          {/* Audited Flowers in this Sector */}
          <div className="space-y-3 pt-3 border-t border-stone-200">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-700">
                Audited Specimens ({activeSpecimens.length})
              </h3>
              <button
                onClick={() => onOpenAddModalWithZone(activeZone.id)}
                className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold cursor-pointer"
              >
                + Register New
              </button>
            </div>

            {activeSpecimens.length === 0 ? (
              <div className="text-center py-6 text-stone-400 text-xs">
                No blossoms recorded in this sector yet. Be the first to count!
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {activeSpecimens.map((specimen) => (
                  <div
                    key={specimen.id}
                    className="p-2.5 rounded-lg border border-stone-200/70 hover:border-emerald-300 transition-colors flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-stone-900 truncate">
                        {specimen.name}
                      </div>
                      <div className="text-[11px] text-stone-500 font-mono">
                        {specimen.petalsPerFlower} petals/bloom · By {specimen.finderName}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs font-mono font-bold text-stone-800 tabular-nums">
                        {specimen.count}
                      </span>
                      <button
                        onClick={() => {
                          playBloomSound();
                          onQuickIncrement(specimen.id);
                        }}
                        title="Count one more in this sector"
                        className="p-1 rounded bg-stone-100 hover:bg-emerald-100 text-stone-700 hover:text-emerald-700 cursor-pointer transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
