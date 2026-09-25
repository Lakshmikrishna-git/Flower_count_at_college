import React, { useState } from 'react';
import { CAMPUS_PLUCKING_WARNINGS, CampusWarning } from '../data/campusWarnings';
import { AlertOctagon, Shuffle, ShieldAlert, Sparkles, MapPin, BellRing, Copy, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

export const CampusAntiPluckingTicker: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);
  const [filterThreat, setFilterThreat] = useState<string>('all');

  const currentWarning: CampusWarning = CAMPUS_PLUCKING_WARNINGS[currentIndex] || CAMPUS_PLUCKING_WARNINGS[0];

  const handleNextWarning = () => {
    setCurrentIndex((prev) => (prev + 1) % CAMPUS_PLUCKING_WARNINGS.length);
  };

  const handleRandomize = () => {
    const nextIdx = Math.floor(Math.random() * CAMPUS_PLUCKING_WARNINGS.length);
    setCurrentIndex(nextIdx);
    confetti({
      particleCount: 15,
      spread: 35,
      origin: { y: 0.8 },
      colors: ['#f43f5e', '#f59e0b', '#10b981'],
    });
  };

  const handleCopyWarning = () => {
    navigator.clipboard.writeText(`🚨 [FlowerCount Anti-Plucking Warning] "${currentWarning.message}" - Location: ${currentWarning.locationTag}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getThreatBadgeStyle = (level: CampusWarning['threatLevel']) => {
    switch (level) {
      case 'Watchman Alert':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'Academic Hazard':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Severe Guilt':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    }
  };

  return (
    <div className="bg-gradient-to-r from-rose-50/80 via-white to-amber-50/60 rounded-3xl p-5 sm:p-6 border border-rose-200/80 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center font-bold text-base">
            🚨
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm sm:text-base text-stone-900 tracking-tight font-serif">
                Campus Flora Defense Hotline
              </h3>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-rose-600 text-white font-bold tracking-wider">
                Anti-Plucking Bureau
              </span>
            </div>
            <p className="text-[11px] text-stone-500">
              Gen Z campus humor directives discouraging flower plucking ({CAMPUS_PLUCKING_WARNINGS.length} verified warnings)
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          <button
            onClick={handleCopyWarning}
            className="px-2.5 py-1 rounded-full bg-white hover:bg-stone-50 border border-stone-200 text-stone-600 hover:text-stone-900 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
            title="Copy warning text to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-600" />
                <span className="text-emerald-700">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 text-stone-400" />
                <span>Copy</span>
              </>
            )}
          </button>

          <button
            onClick={handleRandomize}
            className="px-3 py-1 rounded-full bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
            title="Roll next random campus warning"
          >
            <Shuffle className="w-3 h-3" />
            <span>Next Directive</span>
          </button>
        </div>
      </div>

      {/* The Active Animated Warning Display */}
      <div className="bg-white/90 backdrop-blur-xs rounded-2xl p-4 sm:p-5 border border-rose-100 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <span className="text-3xl select-none shrink-0 filter drop-shadow-xs">
            {currentWarning.icon}
          </span>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-stone-900 uppercase tracking-wide">
                {currentWarning.title}
              </span>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${getThreatBadgeStyle(currentWarning.threatLevel)}`}>
                {currentWarning.threatLevel}
              </span>
            </div>
            <p className="text-sm font-semibold text-stone-800 leading-snug font-serif">
              "{currentWarning.message}"
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-stone-500 font-medium shrink-0 self-end sm:self-center bg-stone-50 px-3 py-1.5 rounded-xl border border-stone-100">
          <MapPin className="w-3.5 h-3.5 text-rose-500" />
          <span>Active in: <strong className="text-stone-800">{currentWarning.locationTag}</strong></span>
        </div>
      </div>

      {/* Quick Carousel Selector Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <span className="text-[10px] font-mono uppercase text-stone-400 shrink-0">Directives:</span>
        {CAMPUS_PLUCKING_WARNINGS.slice(0, 8).map((w, idx) => (
          <button
            key={w.id}
            onClick={() => setCurrentIndex(idx)}
            className={`px-2 py-0.5 rounded-lg text-xs transition-colors shrink-0 cursor-pointer ${
              currentIndex === idx
                ? 'bg-stone-900 text-white font-bold'
                : 'bg-white hover:bg-stone-100 text-stone-600 border border-stone-200'
            }`}
          >
            {w.icon} {w.title.split(' ')[0]}
          </button>
        ))}
      </div>
    </div>
  );
};
