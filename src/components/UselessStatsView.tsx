import React from 'react';
import { FlowerSpecimen, CampusZone, CampusProfile } from '../types';
import { BarChart3, TrendingDown, AlertTriangle, Coffee, Compass } from 'lucide-react';

interface UselessStatsViewProps {
  specimens: FlowerSpecimen[];
  zones: CampusZone[];
  campusProfile: CampusProfile;
}

export const UselessStatsView: React.FC<UselessStatsViewProps> = ({
  specimens,
  zones,
  campusProfile,
}) => {
  const totalFlowers = specimens.reduce((sum, s) => sum + s.count, 0);
  const totalPetals = specimens.reduce((sum, s) => sum + s.totalPetals, 0);

  // Sector breakdown
  const zoneStats = zones.map((zone) => {
    const zoneFlowers = specimens
      .filter((s) => s.zoneId === zone.id)
      .reduce((sum, s) => sum + s.count, 0);
    const zonePetals = specimens
      .filter((s) => s.zoneId === zone.id)
      .reduce((sum, s) => sum + s.totalPetals, 0);
    const percentage = totalFlowers > 0 ? (zoneFlowers / totalFlowers) * 100 : 0;
    return {
      zone,
      flowers: zoneFlowers,
      petals: zonePetals,
      percentage,
    };
  });

  // Color breakdown
  const colorMap: Record<string, { count: number; name: string }> = {};
  specimens.forEach((s) => {
    if (!colorMap[s.color]) {
      colorMap[s.color] = { count: 0, name: s.name.split(' ')[0] };
    }
    colorMap[s.color].count += s.totalPetals;
  });
  const colorList = Object.entries(colorMap).map(([color, data]) => ({
    color,
    ...data,
  }));

  // Useless metrics calculations
  const metersEndToEnd = (totalPetals * 0.024).toFixed(1); // avg 2.4cm per petal
  const teaCupsEquivalent = Math.round(totalPetals * 0.08);
  const internalMarksSacrificed = (totalFlowers * 0.04).toFixed(1);

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-emerald-600 mb-1">
          Empirical Pointlessness
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight">
          Campus Botanical Telemetry & Useless Analytics
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Mathematically sound, scientifically verifiable, and completely unhelpful metrics derived from our college flower survey.
        </p>
      </div>

      {/* Pointless Equivalencies Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-stone-500">
            <span>Linear Petal Span</span>
            <Compass className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-3xl font-mono font-bold text-stone-900 tabular-nums">
            {metersEndToEnd} <span className="text-sm font-sans font-normal text-stone-500">meters</span>
          </div>
          <p className="mt-1 text-xs text-stone-500">
            If laid end-to-end, reaches from the main gate directly into the canteen counter.
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-stone-500">
            <span>Academic Sacrifice</span>
            <TrendingDown className="w-4 h-4 text-rose-500" />
          </div>
          <div className="mt-2 text-3xl font-mono font-bold text-rose-600 tabular-nums">
            -{internalMarksSacrificed} <span className="text-sm font-sans font-normal text-stone-500">marks</span>
          </div>
          <p className="mt-1 text-xs text-stone-500">
            Estimated semester internal assessment score lost while counting rather than writing assignments.
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-stone-500">
            <span>Canteen Chai Affinity</span>
            <Coffee className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2 text-3xl font-mono font-bold text-stone-900 tabular-nums">
            {teaCupsEquivalent} <span className="text-sm font-sans font-normal text-stone-500">cups</span>
          </div>
          <p className="mt-1 text-xs text-stone-500">
            Equivalent volume of milk tea steam absorbed by petals growing within 50 meters of the chai boiler.
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-stone-500">
            <span>Bee Patronage Index</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 text-3xl font-mono font-bold text-emerald-700 tabular-nums">
            {Math.round(totalFlowers * 0.18)} <span className="text-sm font-sans font-normal text-stone-500">bees</span>
          </div>
          <p className="mt-1 text-xs text-stone-500">
            Estimated campus pollinator fleet sustained, with 80% concentrating around sweet tea waste.
          </p>
        </div>
      </section>

      {/* Chart 1: The Famous Inverse Law of College Floristry */}
      <section className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-serif font-bold text-stone-900">
              The Inverse Law of College Floristry (Empirical Study)
            </h2>
            <p className="text-xs text-stone-500">
              Correlating hours spent auditing blossoms vs. student semester GPA (n = 3,200)
            </p>
          </div>
          <div className="text-xs font-mono text-stone-500">
            Pearson Correlation: <span className="text-rose-600 font-bold">-0.994</span>
          </div>
        </div>

        {/* SVG Scatter & Regression Curve */}
        <div className="w-full h-56 bg-stone-50 rounded-xl border border-stone-200 p-4 relative overflow-hidden">
          <svg className="w-full h-full" viewBox="0 0 600 200" preserveAspectRatio="none">
            {/* Grid Lines */}
            <line x1="50" y1="20" x2="580" y2="20" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="50" y1="65" x2="580" y2="65" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="50" y1="110" x2="580" y2="110" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="50" y1="155" x2="580" y2="155" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="3 3" />

            {/* Axes */}
            <line x1="50" y1="15" x2="50" y2="160" stroke="#9ca3af" strokeWidth="1.5" />
            <line x1="50" y1="160" x2="580" y2="160" stroke="#9ca3af" strokeWidth="1.5" />

            {/* Downward Trendline */}
            <path
              d="M 60 30 Q 250 80 560 150"
              fill="none"
              stroke="#ef4444"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* Sample Student Scatter Points */}
            <circle cx="80" cy="35" r="4" fill="#059669" />
            <circle cx="140" cy="48" r="4" fill="#059669" />
            <circle cx="210" cy="68" r="4" fill="#10b981" />
            <circle cx="280" cy="85" r="4" fill="#f59e0b" />
            <circle cx="340" cy="100" r="4" fill="#f59e0b" />
            <circle cx="420" cy="120" r="4" fill="#ef4444" />
            <circle cx="490" cy="138" r="4" fill="#ef4444" />
            <circle cx="550" cy="148" r="5" fill="#991b1b" />
          </svg>

          {/* Axis Labels */}
          <div className="absolute left-2 top-4 text-[10px] font-mono text-stone-500 uppercase rotate-[-90deg] origin-left">
            GPA (10.0 → 2.0)
          </div>
          <div className="absolute right-4 bottom-1 text-[10px] font-mono text-stone-500 uppercase">
            Flowers Counted Per Week →
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-stone-500 pt-1">
          <span className="italic">Conclusion: The more you count petals, the closer you get to a supplementary exam.</span>
          <span className="font-mono text-emerald-700 font-semibold">Status: Empirically Proven</span>
        </div>
      </section>

      {/* Chart 2: Petal Yield by Collegiate Sector */}
      <section className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
        <div>
          <h2 className="text-base font-serif font-bold text-stone-900">
            Sector Floral Distribution
          </h2>
          <p className="text-xs text-stone-500">
            Relative petal concentration and blossom counts logged per campus zone
          </p>
        </div>

        <div className="space-y-3.5">
          {zoneStats.map((item) => (
            <div key={item.zone.id} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-stone-800">
                  {item.zone.name}
                </span>
                <span className="font-mono tabular-nums text-stone-500">
                  {item.flowers} fl. ({item.petals.toLocaleString()} petals) · {item.percentage.toFixed(1)}%
                </span>
              </div>
              <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden flex">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.max(item.percentage, 2)}%`,
                    backgroundColor: item.zone.accentColor,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Chart 3: Petal Color Spectrum Breakdown */}
      <section className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
        <div>
          <h2 className="text-base font-serif font-bold text-stone-900">
            Campus Color Spectrum
          </h2>
          <p className="text-xs text-stone-500">
            Distribution of audited petals by chromatic wavelength
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {colorList.map((item) => {
            const percent = totalPetals > 0 ? ((item.count / totalPetals) * 100).toFixed(1) : '0';
            return (
              <div
                key={item.color}
                className="p-3.5 rounded-xl border border-stone-200/80 bg-stone-50/60 flex flex-col justify-between"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="w-4 h-4 rounded-full border border-black/10 shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs font-mono font-medium uppercase text-stone-700 truncate">
                    {item.name}
                  </span>
                </div>
                <div>
                  <div className="text-base font-mono font-bold text-stone-900 tabular-nums">
                    {item.count.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-stone-400 font-mono">
                    {percent}% of all petals
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
