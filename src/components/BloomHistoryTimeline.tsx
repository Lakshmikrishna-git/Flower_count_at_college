import React, { useState } from 'react';
import { FlowerEntry } from '../types/flower';
import { Calendar, Clock, MapPin, Sparkles, User, ChevronDown, ChevronUp, Tag } from 'lucide-react';

interface BloomHistoryTimelineProps {
  flowers: FlowerEntry[];
  onSelectFlower?: (flower: FlowerEntry) => void;
}

export const BloomHistoryTimeline: React.FC<BloomHistoryTimelineProps> = ({
  flowers,
  onSelectFlower,
}) => {
  const [filterPeriod, setFilterPeriod] = useState<'all' | 'today' | 'week'>('all');
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  // Sort chronological descending (most recent arrivals at top)
  const sortedChronological = [...flowers].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const now = new Date().getTime();
  const filtered = sortedChronological.filter((f) => {
    if (filterPeriod === 'all') return true;
    const itemTime = new Date(f.timestamp).getTime();
    if (filterPeriod === 'today') {
      return now - itemTime < 24 * 60 * 60 * 1000;
    }
    if (filterPeriod === 'week') {
      return now - itemTime < 7 * 24 * 60 * 60 * 1000;
    }
    return true;
  });

  const formatArrivalDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        weekday: 'short',
      });
    } catch {
      return 'Recently';
    }
  };

  const formatArrivalTime = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '';
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-emerald-100/90 shadow-xs space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700">
            <span className="p-1 rounded-md bg-emerald-100/80 text-emerald-800">
              <Calendar className="w-3.5 h-3.5" />
            </span>
            <span>Semester Arrival Log</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold font-serif text-stone-900 tracking-tight mt-1">
            Bloom History Timeline
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Chronological arrival of verified campus blooms across the semester term
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="bg-stone-100 p-1 rounded-full flex items-center gap-1 text-xs">
            <button
              onClick={() => setFilterPeriod('all')}
              className={`px-3 py-1 rounded-full font-semibold transition-all cursor-pointer ${
                filterPeriod === 'all'
                  ? 'bg-white text-stone-900 shadow-2xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              Full Term ({flowers.length})
            </button>
            <button
              onClick={() => setFilterPeriod('week')}
              className={`px-3 py-1 rounded-full font-semibold transition-all cursor-pointer ${
                filterPeriod === 'week'
                  ? 'bg-white text-stone-900 shadow-2xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              This Week
            </button>
            <button
              onClick={() => setFilterPeriod('today')}
              className={`px-3 py-1 rounded-full font-semibold transition-all cursor-pointer ${
                filterPeriod === 'today'
                  ? 'bg-white text-stone-900 shadow-2xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              Today
            </button>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
            title={isExpanded ? 'Collapse timeline' : 'Expand timeline'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="relative pl-6 sm:pl-8 space-y-6 before:content-[''] before:absolute before:left-2.5 sm:before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-emerald-400 before:via-teal-200 before:to-stone-200">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-stone-400 text-xs italic">
              No flower sightings recorded for this time window.
            </div>
          ) : (
            filtered.map((item, index) => {
              const isFirst = index === 0;
              const emoji =
                item.category === 'Hibiscus'
                  ? '🌺'
                  : item.category === 'Bougainvillea'
                  ? '🌸'
                  : item.category === 'Marigold'
                  ? '🌼'
                  : item.category === 'Frangipani'
                  ? '🤍'
                  : item.category === 'Rose'
                  ? '🌹'
                  : item.category === 'Sunflower'
                  ? '🌻'
                  : '🌿';

              return (
                <div key={item.id} className="relative group">
                  {/* Timeline Node Bead */}
                  <div
                    className={`absolute -left-[27px] sm:-left-[35px] top-1.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 flex items-center justify-center text-xs transition-transform group-hover:scale-115 ${
                      isFirst
                        ? 'bg-emerald-600 text-white border-emerald-300 ring-4 ring-emerald-100 shadow-sm'
                        : 'bg-white text-stone-700 border-emerald-300 shadow-2xs'
                    }`}
                  >
                    <span className="text-[11px] select-none">{emoji}</span>
                  </div>

                  {/* Vertical Timeline Card */}
                  <div
                    onClick={() => onSelectFlower?.(item)}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                      isFirst
                        ? 'bg-gradient-to-r from-emerald-50/60 via-white to-teal-50/30 border-emerald-200 shadow-xs'
                        : 'bg-stone-50/50 hover:bg-white border-stone-200/80 hover:border-emerald-300 hover:shadow-2xs'
                    }`}
                  >
                    <div className="flex items-start gap-3.5 min-w-0">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover border border-stone-200 shrink-0 group-hover:scale-105 transition-transform"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-emerald-100/70 text-emerald-800 flex items-center justify-center text-2xl shrink-0 font-serif">
                          {emoji}
                        </div>
                      )}

                      <div className="space-y-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-bold text-stone-900 text-sm sm:text-base group-hover:text-emerald-800 transition-colors truncate">
                            {item.name}
                          </h4>
                          {isFirst && (
                            <span className="text-[10px] font-mono font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-full shadow-2xs uppercase tracking-wider">
                              Latest Arrival ✨
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-stone-500">
                          <span className="flex items-center gap-1 font-medium text-stone-700">
                            <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                            <span>{item.locationName}</span>
                          </span>
                          <span aria-hidden="true" className="text-stone-300">·</span>
                          <span className="flex items-center gap-1 font-mono text-[11px] text-stone-600">
                            <User className="w-3 h-3 text-stone-400" />
                            <span>Scout {item.userName}</span>
                          </span>
                        </div>

                        {item.notes && (
                          <p className="text-xs text-stone-600 italic line-clamp-1 pt-0.5">
                            "{item.notes}"
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Right Meta Column: Blossom Count & Arrival Timestamp */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-stone-100 text-right">
                      <div className="flex items-center gap-1.5">
                        <span className="text-base sm:text-lg font-mono font-bold text-emerald-800 tabular-nums">
                          +{item.count}
                        </span>
                        <span className="text-[11px] font-semibold text-stone-500 uppercase font-mono">
                          blooms
                        </span>
                      </div>

                      <div className="text-[11px] font-mono text-stone-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-stone-400" />
                        <span>{formatArrivalDate(item.timestamp)}</span>
                        <span>{formatArrivalTime(item.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
