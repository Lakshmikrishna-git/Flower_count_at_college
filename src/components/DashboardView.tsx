import React from 'react';
import { Flower, MapPin, Sparkles, Plus, AlertCircle, ArrowUpRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { CampusProfile, CampusZone, FlowerSpecimen } from '../types';
import { playBloomSound } from '../utils/audio';

interface DashboardViewProps {
  campusProfile: CampusProfile;
  zones: CampusZone[];
  specimens: FlowerSpecimen[];
  onOpenAddModal: () => void;
  onNavigateToTab: (tab: 'dashboard' | 'map' | 'tally' | 'floradex' | 'stats' | 'certificate') => void;
  onQuickIncrement: (specimenId: string) => void;
  onSelectZone: (zoneId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  campusProfile,
  zones,
  specimens,
  onOpenAddModal,
  onNavigateToTab,
  onQuickIncrement,
  onSelectZone,
}) => {
  const totalFlowers = specimens.reduce((sum, s) => sum + s.count, 0);
  const totalPetals = specimens.reduce((sum, s) => sum + s.totalPetals, 0);
  const flowersPerStudent = (totalFlowers / campusProfile.studentBodyCount).toFixed(3);

  // Find most floral zone
  const zoneFlowerCounts = zones.map((z) => {
    const count = specimens
      .filter((s) => s.zoneId === z.id)
      .reduce((sum, s) => sum + s.count, 0);
    return { zone: z, count };
  });
  zoneFlowerCounts.sort((a, b) => b.count - a.count);
  const topZone = zoneFlowerCounts[0];

  const recentSpecimens = [...specimens].reverse().slice(0, 4);

  return (
    <div className="space-y-8 pb-12">
      {/* Editorial Hero Banner */}
      <section className="relative overflow-hidden rounded-2xl bg-stone-900 text-stone-100 border border-stone-800 shadow-md">
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/campus_flower_census_hero_1790316179228.jpg"
            alt="Campus botanical garden landscape"
            className="w-full h-full object-cover opacity-25 filter saturate-125"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-900/90 to-stone-900/60" />
        </div>

        <div className="relative z-10 px-6 py-10 sm:px-10 sm:py-12 max-w-4xl">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-3">
            <span>Official Campus Petal Audit Bureau</span>
            <span aria-hidden="true">·</span>
            <span>Session 2026-2027</span>
            <span aria-hidden="true">·</span>
            <span className="text-stone-400">{campusProfile.shortCode} Chapter</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-bold text-stone-100 tracking-tight leading-tight text-balance">
            The Pointless College Flower Census
          </h1>

          <p className="mt-3 text-sm sm:text-base text-stone-300 max-w-2xl leading-relaxed">
            Welcome to the officially unofficial registry of every hibiscus, bougainvillea bract, and rebellious weed
            flourishing across {campusProfile.collegeName}. Mathematically cataloged so you don’t have to study for your end-semester exams.
          </p>

          {/* Action Row */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigateToTab('tally')}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-stone-900 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors cursor-pointer flex items-center gap-2"
            >
              <Flower className="w-4 h-4" />
              <span>Launch Field Clicker</span>
            </button>
            <button
              onClick={onOpenAddModal}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-stone-100 bg-stone-800 hover:bg-stone-700 border border-stone-700 rounded-lg transition-colors cursor-pointer flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Audit New Specimen</span>
            </button>
            <button
              onClick={() => onNavigateToTab('map')}
              className="px-4 py-2 text-xs sm:text-sm font-medium text-stone-300 hover:text-stone-100 hover:bg-stone-800/60 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <MapPin className="w-4 h-4" />
              <span>Inspect Campus Map</span>
            </button>
          </div>
        </div>
      </section>

      {/* Telemetry Numbers Ribbon */}
      <section>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs">
            <div className="text-xs font-medium uppercase tracking-wider text-stone-500">
              Total Campus Flowers
            </div>
            <div className="mt-2 text-3xl sm:text-4xl font-mono font-bold text-stone-900 tabular-nums">
              {totalFlowers.toLocaleString()}
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Active campus specimens</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs">
            <div className="text-xs font-medium uppercase tracking-wider text-stone-500">
              Total Audited Petals
            </div>
            <div className="mt-2 text-3xl sm:text-4xl font-mono font-bold text-emerald-700 tabular-nums">
              {totalPetals.toLocaleString()}
            </div>
            <div className="mt-1 text-xs text-stone-500">
              Mathematical approximation
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs">
            <div className="text-xs font-medium uppercase tracking-wider text-stone-500">
              Flowers Per Student
            </div>
            <div className="mt-2 text-3xl sm:text-4xl font-mono font-bold text-stone-900 tabular-nums">
              {flowersPerStudent}
            </div>
            <div className="mt-1 text-xs text-stone-500">
              Ratio across {campusProfile.studentBodyCount.toLocaleString()} engineers
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs">
            <div className="text-xs font-medium uppercase tracking-wider text-stone-500">
              Peak Floral Density
            </div>
            <div className="mt-2 text-xl sm:text-2xl font-semibold text-stone-900 truncate">
              {topZone?.zone.name.split('&')[0].trim() || 'Central Courtyard'}
            </div>
            <div className="mt-1 text-xs text-stone-500 font-mono tabular-nums">
              {topZone?.count || 0} blossoms logged
            </div>
          </div>
        </div>
      </section>

      {/* Campus Botanical Zones Quick Matrix */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-serif font-bold text-stone-900 tracking-tight">
              Campus Floral Sectors
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Live botanical population and security watchman presence per quadrant
            </p>
          </div>
          <button
            onClick={() => onNavigateToTab('map')}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
          >
            <span>Open Interactive Map</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {zones.map((zone) => {
            const zoneSpecimens = specimens.filter((s) => s.zoneId === zone.id);
            const count = zoneSpecimens.reduce((sum, s) => sum + s.count, 0);
            const petals = zoneSpecimens.reduce((sum, s) => sum + s.totalPetals, 0);

            return (
              <div
                key={zone.id}
                onClick={() => {
                  onSelectZone(zone.id);
                  onNavigateToTab('map');
                }}
                className="group bg-white p-5 rounded-xl border border-stone-200 hover:border-emerald-300 hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-stone-900 group-hover:text-emerald-700 transition-colors">
                      {zone.name}
                    </h3>
                    <span className="shrink-0 text-xs font-mono font-medium px-2 py-0.5 rounded bg-stone-100 text-stone-700 tabular-nums">
                      {count} fl.
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-stone-500 line-clamp-2 leading-relaxed">
                    {zone.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: zone.accentColor }} />
                    <span className="font-mono tabular-nums">{petals.toLocaleString()} petals</span>
                  </div>
                  <span className="text-stone-400 truncate max-w-[120px]">{zone.dangerLevel}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Recent Sightings & Useless Campus Bulletin */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Sightings Feed */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-serif font-bold text-stone-900 tracking-tight">
                Latest Botanical Filings
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Recently audited specimens logged by fellow campus observers
              </p>
            </div>
            <button
              onClick={() => onNavigateToTab('floradex')}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
            >
              <span>View All ({specimens.length})</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {recentSpecimens.map((specimen) => (
              <div
                key={specimen.id}
                className="bg-white p-4 rounded-xl border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  {specimen.imageUrl ? (
                    <img
                      src={specimen.imageUrl}
                      alt={specimen.name}
                      className="w-14 h-14 rounded-lg object-cover border border-stone-200 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div
                      className="w-14 h-14 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${specimen.color}15`, color: specimen.color }}
                    >
                      <Flower className="w-6 h-6" />
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-stone-900 text-sm">{specimen.name}</h4>
                      <span className="text-xs text-stone-400 font-mono italic">
                        {specimen.scientificName}
                      </span>
                    </div>

                    <div className="mt-1 flex items-center gap-2 text-xs text-stone-500">
                      <span>{specimen.zoneName}</span>
                      <span aria-hidden="true">·</span>
                      <span>By {specimen.finderName}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">{specimen.petalsPerFlower} petals/bloom</span>
                    </div>

                    {specimen.verdict && (
                      <p className="mt-1.5 text-xs text-stone-600 italic bg-stone-50 px-2 py-1 rounded border border-stone-100">
                        "{specimen.verdict}"
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:self-center shrink-0 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-stone-100">
                  <div className="text-right">
                    <div className="text-base font-bold font-mono text-stone-900 tabular-nums">
                      {specimen.count}
                    </div>
                    <div className="text-[10px] text-stone-400 uppercase font-mono">
                      {specimen.totalPetals} petals
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      playBloomSound();
                      onQuickIncrement(specimen.id);
                    }}
                    title="Spotted another one! Increment count by 1"
                    className="p-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors cursor-pointer font-medium text-xs flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+1</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bureau Bulletin & Useless Lore */}
        <div className="space-y-4">
          <h2 className="text-xl font-serif font-bold text-stone-900 tracking-tight">
            Census Dispatch
          </h2>

          <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-amber-800 text-xs font-semibold uppercase tracking-wider">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Campus Directive #042</span>
            </div>

            <p className="text-xs text-amber-900 leading-relaxed">
              <strong>Attention Students:</strong> Do not pluck campus hibiscus flowers to perform unauthorized acid-base indicator experiments in the hostel. Our petal count has already dropped by 3 blossoms near the civil lab.
            </p>

            <div className="pt-2 border-t border-amber-200/60 text-[11px] text-amber-800/80 flex items-center justify-between">
              <span>Issued by: Chief Petal Auditor</span>
              <span className="font-mono">Whistle alert: Active</span>
            </div>
          </div>

          <div className="bg-white border border-stone-200 rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-stone-700 text-xs font-semibold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Honorary Census Diploma</span>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              Have you personally counted more than 50 campus flowers? You are eligible to receive an official, printable <strong>Diploma of Pointless Botanical Endeavor</strong> signed by the unaccredited board.
            </p>

            <button
              onClick={() => onNavigateToTab('certificate')}
              className="w-full py-2 text-xs font-semibold text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer text-center block"
            >
              Generate Your Diploma
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
