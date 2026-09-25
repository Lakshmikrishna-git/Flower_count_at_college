import React, { useState } from 'react';
import { Search, Filter, Plus, Minus, Trash2, Flower, ArrowUpDown, Sparkles } from 'lucide-react';
import { CampusZone, FlowerCondition, FlowerSpecimen } from '../types';
import { playBloomSound } from '../utils/audio';

interface FloradexListViewProps {
  specimens: FlowerSpecimen[];
  zones: CampusZone[];
  onQuickIncrement: (specimenId: string) => void;
  onQuickDecrement: (specimenId: string) => void;
  onDeleteSpecimen: (specimenId: string) => void;
  onOpenAddModal: () => void;
}

export const FloradexListView: React.FC<FloradexListViewProps> = ({
  specimens,
  zones,
  onQuickIncrement,
  onQuickDecrement,
  onDeleteSpecimen,
  onOpenAddModal,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedZoneFilter, setSelectedZoneFilter] = useState<string>('all');
  const [selectedConditionFilter, setSelectedConditionFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'count' | 'petals' | 'date' | 'name'>('count');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Filter logic
  const filtered = specimens.filter((specimen) => {
    const matchesSearch =
      specimen.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      specimen.scientificName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      specimen.zoneName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      specimen.finderName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesZone =
      selectedZoneFilter === 'all' || specimen.zoneId === selectedZoneFilter;

    const matchesCondition =
      selectedConditionFilter === 'all' || specimen.condition === selectedConditionFilter;

    return matchesSearch && matchesZone && matchesCondition;
  });

  // Sort logic
  filtered.sort((a, b) => {
    if (sortBy === 'count') return b.count - a.count;
    if (sortBy === 'petals') return b.totalPetals - a.totalPetals;
    if (sortBy === 'date') return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return 0;
  });

  const getConditionLabel = (condition: FlowerCondition) => {
    switch (condition) {
      case 'thriving':
        return 'Thriving';
      case 'wilted_by_exams':
        return 'Wilted by Finals';
      case 'soaked_in_chai':
        return 'Soaked in Canteen Chai';
      case 'munched_by_caterpillar':
        return 'Munched by Fauna';
      case 'legendary_bloom':
        return 'Legendary Bloom';
      default:
        return 'Cataloged';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-emerald-600 mb-1">
            Complete Floral Registry
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight">
            The Campus Floradex Ledger
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Mathematically audited flowers registered across all collegiate sectors.
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="self-start sm:self-auto px-4 py-2 text-xs font-semibold text-stone-900 bg-emerald-400 hover:bg-emerald-300 rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Register Specimen</span>
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by flower name, Latin name, sector, or finder..."
              className="w-full text-xs bg-stone-50 border border-stone-300 rounded-lg pl-9 pr-3 py-2 text-stone-800 placeholder-stone-400 focus:outline-emerald-500"
            />
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <ArrowUpDown className="w-4 h-4 text-stone-400 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-stone-700 focus:outline-emerald-500"
            >
              <option value="count">Sort: Highest Flower Count</option>
              <option value="petals">Sort: Highest Petal Count</option>
              <option value="date">Sort: Recently Added</option>
              <option value="name">Sort: Alphabetical</option>
            </select>

            {/* View Mode Segmented Button */}
            <div className="flex items-center bg-stone-100 p-0.5 rounded-lg border border-stone-200 text-xs">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Cards
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Table
              </button>
            </div>
          </div>
        </div>

        {/* Filter Tabs / Segmented Controls */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-stone-400 font-mono text-[11px] shrink-0">Sector:</span>
          <button
            onClick={() => setSelectedZoneFilter('all')}
            className={`px-2.5 py-1 rounded-lg whitespace-nowrap transition-colors cursor-pointer font-medium ${
              selectedZoneFilter === 'all'
                ? 'bg-stone-900 text-stone-100'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            All Sectors ({specimens.length})
          </button>
          {zones.map((zone) => {
            const count = specimens.filter((s) => s.zoneId === zone.id).length;
            const isSelected = selectedZoneFilter === zone.id;
            return (
              <button
                key={zone.id}
                onClick={() => setSelectedZoneFilter(zone.id)}
                className={`px-2.5 py-1 rounded-lg whitespace-nowrap transition-colors cursor-pointer font-medium ${
                  isSelected
                    ? 'bg-stone-900 text-stone-100'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {zone.name.split('&')[0].trim()} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Empty State */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-stone-200 space-y-3">
          <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
            <Flower className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-stone-800 text-lg">
            No Flowers Match Your Census Query
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Perhaps a security guard whistled them away, or they haven't been spotted yet. Try changing your search filters or audit a new specimen!
          </p>
          <button
            onClick={onOpenAddModal}
            className="mt-2 px-4 py-2 text-xs font-semibold text-stone-900 bg-emerald-400 hover:bg-emerald-300 rounded-lg shadow-xs cursor-pointer inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Audit This Sighting</span>
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid Card View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((specimen) => (
            <div
              key={specimen.id}
              className="bg-white rounded-xl border border-stone-200 hover:border-emerald-300 transition-all shadow-xs flex flex-col justify-between overflow-hidden"
            >
              <div>
                {/* Photo or Floral Gradient Header */}
                {specimen.imageUrl ? (
                  <div className="h-44 w-full overflow-hidden bg-stone-100 relative">
                    <img
                      src={specimen.imageUrl}
                      alt={specimen.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2 right-2 bg-stone-900/80 backdrop-blur-xs text-white text-[11px] font-mono px-2 py-0.5 rounded">
                      {specimen.count} flowers
                    </div>
                  </div>
                ) : (
                  <div
                    className="h-28 w-full flex items-center justify-center relative border-b border-stone-100"
                    style={{
                      background: `linear-gradient(135deg, ${specimen.color}15 0%, ${specimen.color}35 100%)`,
                    }}
                  >
                    <Flower
                      className="w-12 h-12 opacity-80"
                      style={{ color: specimen.color }}
                    />
                    <div className="absolute top-2 right-2 bg-stone-900/80 backdrop-blur-xs text-white text-[11px] font-mono px-2 py-0.5 rounded">
                      {specimen.count} flowers
                    </div>
                  </div>
                )}

                <div className="p-4 space-y-2.5">
                  <div>
                    <h3 className="font-semibold text-stone-900 text-base leading-snug">
                      {specimen.name}
                    </h3>
                    <p className="text-xs text-stone-400 font-mono italic">
                      {specimen.scientificName}
                    </p>
                  </div>

                  {/* Clean unboxed metadata with typographic separators (Zero-Pill discipline) */}
                  <div className="flex flex-wrap items-center gap-1.5 text-xs text-stone-500">
                    <span className="font-medium text-stone-700">{specimen.zoneName}</span>
                    <span aria-hidden="true">·</span>
                    <span>{getConditionLabel(specimen.condition)}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums">{specimen.petalsPerFlower} petals/fl.</span>
                  </div>

                  {/* Bureau Verdict */}
                  {specimen.verdict && (
                    <p className="text-xs text-stone-600 italic bg-stone-50 p-2.5 rounded-lg border border-stone-100 leading-relaxed">
                      "{specimen.verdict}"
                    </p>
                  )}

                  {specimen.academicEquivalent && (
                    <div className="text-[11px] text-stone-500">
                      <span className="font-semibold text-stone-700">Course Equivalent: </span>
                      <span>{specimen.academicEquivalent}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Card Action Footer */}
              <div className="p-4 pt-3 border-t border-stone-100 bg-stone-50/50 flex items-center justify-between">
                <div>
                  <div className="text-xs font-mono font-bold text-emerald-800 tabular-nums">
                    {specimen.totalPetals.toLocaleString()} petals
                  </div>
                  <div className="text-[10px] text-stone-400">
                    Finder: {specimen.finderName}
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onQuickDecrement(specimen.id)}
                    title="Decrement count"
                    className="p-1.5 rounded-lg bg-white border border-stone-200 text-stone-600 hover:text-stone-900 hover:border-stone-300 transition-colors cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => {
                      playBloomSound();
                      onQuickIncrement(specimen.id);
                    }}
                    title="Spotted another flower!"
                    className="px-2.5 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 hover:bg-emerald-200 font-semibold text-xs transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+1</span>
                  </button>

                  <button
                    onClick={() => onDeleteSpecimen(specimen.id)}
                    title="Remove specimen record"
                    className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Tabular Ledger View */
        <div className="bg-white rounded-xl border border-stone-200 overflow-x-auto shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-500 font-mono uppercase text-[11px] border-b border-stone-200">
              <tr>
                <th className="py-3 px-4">Specimen</th>
                <th className="py-3 px-4">Sector</th>
                <th className="py-3 px-4 text-right">Count</th>
                <th className="py-3 px-4 text-right">Petals/Fl.</th>
                <th className="py-3 px-4 text-right">Total Petals</th>
                <th className="py-3 px-4">Condition</th>
                <th className="py-3 px-4">Finder</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.map((specimen) => (
                <tr key={specimen.id} className="hover:bg-stone-50/80 transition-colors">
                  <td className="py-3 px-4 font-semibold text-stone-900">
                    <div>{specimen.name}</div>
                    <div className="text-[10px] text-stone-400 font-mono italic">
                      {specimen.scientificName}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-stone-600">{specimen.zoneName}</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-stone-900 tabular-nums">
                    {specimen.count}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-stone-600 tabular-nums">
                    {specimen.petalsPerFlower}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-emerald-700 tabular-nums">
                    {specimen.totalPetals.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-stone-500">
                    {getConditionLabel(specimen.condition)}
                  </td>
                  <td className="py-3 px-4 text-stone-500">{specimen.finderName}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => {
                          playBloomSound();
                          onQuickIncrement(specimen.id);
                        }}
                        className="p-1 rounded bg-stone-100 hover:bg-emerald-100 text-stone-700 hover:text-emerald-700 cursor-pointer"
                        title="Add 1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteSpecimen(specimen.id)}
                        className="p-1 rounded hover:bg-rose-50 text-stone-400 hover:text-rose-600 cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
