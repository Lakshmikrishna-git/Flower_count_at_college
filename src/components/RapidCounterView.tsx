import React, { useState } from 'react';
import { Flower, RotateCcw, Check, Sparkles, Plus, Minus, MapPin, Hash } from 'lucide-react';
import { CampusZone, FlowerSpecimen } from '../types';
import { playTallyClick, playCelebrationSound } from '../utils/audio';
import { firePetalConfetti } from '../utils/confetti';

interface RapidCounterViewProps {
  zones: CampusZone[];
  specimens: FlowerSpecimen[];
  onCommitTally: (
    zoneId: string,
    specimenName: string,
    countToAdd: number,
    petalsPerFlower: number,
    flowerColor: string
  ) => void;
}

export const RapidCounterView: React.FC<RapidCounterViewProps> = ({
  zones,
  specimens,
  onCommitTally,
}) => {
  const [selectedZoneId, setSelectedZoneId] = useState<string>(zones[0]?.id || '');
  const [selectedFlowerName, setSelectedFlowerName] = useState<string>('Red Hibiscus');
  const [petalsPerBloom, setPetalsPerBloom] = useState<number>(5);
  const [flowerColor, setFlowerColor] = useState<string>('#ef4444');
  const [sessionCount, setSessionCount] = useState<number>(0);
  const [stepSize, setStepSize] = useState<1 | 5 | 25>(1);
  const [isPressing, setIsPressing] = useState<boolean>(false);
  const [lastCommitted, setLastCommitted] = useState<string | null>(null);

  const selectedZone = zones.find((z) => z.id === selectedZoneId) || zones[0];
  const totalSessionPetals = sessionCount * petalsPerBloom;

  // Preset flower options
  const FLOWER_PRESETS = [
    { name: 'Red Hibiscus (Chembarathi)', petals: 5, color: '#ef4444' },
    { name: 'Bougainvillea Bracts', petals: 3, color: '#ec4899' },
    { name: 'Canteen Marigold', petals: 42, color: '#f59e0b' },
    { name: 'Touch-Me-Not (Mimosa)', petals: 16, color: '#d946ef' },
    { name: 'White Frangipani', petals: 5, color: '#f8fafc' },
    { name: 'Yellow Tecoma Bell', petals: 5, color: '#eab308' },
    { name: 'Rebellious Pavement Weed', petals: 4, color: '#10b981' },
  ];

  const handleIncrement = () => {
    playTallyClick();
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(15);
    }
    setSessionCount((prev) => prev + stepSize);
    setIsPressing(true);
    setTimeout(() => setIsPressing(false), 120);
  };

  const handleDecrement = () => {
    if (sessionCount <= 0) return;
    playTallyClick();
    setSessionCount((prev) => Math.max(0, prev - stepSize));
  };

  const handleReset = () => {
    setSessionCount(0);
  };

  const handleCommit = () => {
    if (sessionCount <= 0) return;
    onCommitTally(selectedZoneId, selectedFlowerName, sessionCount, petalsPerBloom, flowerColor);
    playCelebrationSound();
    firePetalConfetti();
    setLastCommitted(`Successfully logged ${sessionCount} ${selectedFlowerName} blooms to ${selectedZone.name}!`);
    setSessionCount(0);
    setTimeout(() => setLastCommitted(null), 4000);
  };

  const handleSelectPreset = (preset: typeof FLOWER_PRESETS[0]) => {
    setSelectedFlowerName(preset.name);
    setPetalsPerBloom(preset.petals);
    setFlowerColor(preset.color);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="text-center space-y-1">
        <div className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
          Field Walking Mode
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight">
          Campus Tally Clicker
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto">
          Keep this screen open while walking between lecture halls. Tap the giant blossom to count as you stroll!
        </p>
      </div>

      {lastCommitted && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-4 py-2.5 rounded-xl text-center font-medium shadow-xs animate-fade-in flex items-center justify-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{lastCommitted}</span>
        </div>
      )}

      {/* Configuration Strip */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-500 mb-1">
              Active Sector
            </label>
            <div className="relative">
              <select
                value={selectedZoneId}
                onChange={(e) => setSelectedZoneId(e.target.value)}
                className="w-full text-xs font-medium bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:outline-emerald-500"
              >
                {zones.map((zone) => (
                  <option key={zone.id} value={zone.id}>
                    {zone.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-500 mb-1">
              Flower Species
            </label>
            <input
              type="text"
              value={selectedFlowerName}
              onChange={(e) => setSelectedFlowerName(e.target.value)}
              className="w-full text-xs font-medium bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:outline-emerald-500"
              placeholder="e.g. Red Hibiscus"
            />
          </div>
        </div>

        {/* Quick Presets */}
        <div>
          <span className="text-[10px] font-mono uppercase text-stone-400 block mb-1.5">
            Quick Botanical Presets:
          </span>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {FLOWER_PRESETS.map((preset) => {
              const isSelected = selectedFlowerName === preset.name;
              return (
                <button
                  key={preset.name}
                  onClick={() => handleSelectPreset(preset)}
                  className={`px-2.5 py-1 text-xs rounded-lg whitespace-nowrap transition-colors cursor-pointer shrink-0 font-medium ${
                    isSelected
                      ? 'bg-stone-900 text-stone-100 shadow-xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {preset.name.split('(')[0].trim()}
                </button>
              );
            })}
          </div>
        </div>

        {/* Petal Multiplier Config */}
        <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
          <span className="text-stone-500 font-medium">Estimated petals per flower:</span>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={1}
              max={100}
              value={petalsPerBloom}
              onChange={(e) => setPetalsPerBloom(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-16 text-center text-xs font-mono font-bold bg-stone-50 border border-stone-300 rounded px-2 py-1"
            />
            <span className="text-stone-400 font-mono text-[11px]">petals</span>
          </div>
        </div>
      </div>

      {/* The Central Giant Tally Clicker */}
      <div className="bg-stone-900 rounded-2xl p-6 sm:p-10 border border-stone-800 shadow-lg text-center relative overflow-hidden flex flex-col items-center justify-center">
        {/* Step Size Selector */}
        <div className="flex items-center gap-1.5 p-1 bg-stone-950/80 rounded-xl border border-stone-800 mb-6">
          <button
            onClick={() => setStepSize(1)}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              stepSize === 1
                ? 'bg-emerald-500 text-stone-950 shadow-xs'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            +1 Single
          </button>
          <button
            onClick={() => setStepSize(5)}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              stepSize === 5
                ? 'bg-emerald-500 text-stone-950 shadow-xs'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            +5 Cluster
          </button>
          <button
            onClick={() => setStepSize(25)}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              stepSize === 25
                ? 'bg-emerald-500 text-stone-950 shadow-xs'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            +25 Bush
          </button>
        </div>

        {/* Big Tap Button */}
        <div className="relative my-4">
          <button
            onClick={handleIncrement}
            className={`relative w-48 h-48 sm:w-56 sm:h-56 rounded-full border-4 border-emerald-500/40 shadow-2xl flex flex-col items-center justify-center transition-all cursor-pointer select-none active:scale-95 ${
              isPressing
                ? 'scale-95 bg-emerald-600/30'
                : 'scale-100 bg-stone-800/90 hover:bg-stone-800 hover:border-emerald-400'
            }`}
            style={{
              boxShadow: isPressing
                ? '0 0 40px rgba(16, 185, 129, 0.4)'
                : '0 10px 30px rgba(0, 0, 0, 0.5)',
            }}
          >
            <Flower className="w-12 h-12 text-emerald-400 mb-2 transition-transform active:rotate-12" />
            <div className="text-4xl sm:text-5xl font-mono font-bold text-white tabular-nums tracking-tight">
              {sessionCount}
            </div>
            <div className="text-[11px] uppercase tracking-wider text-emerald-300 font-semibold mt-1">
              TAP TO COUNT
            </div>
          </button>
        </div>

        {/* Live Petals Computed */}
        <div className="mt-4 flex items-center gap-4 text-xs font-mono text-stone-400">
          <div>
            <span>APPROX PETALS: </span>
            <span className="text-emerald-400 font-bold text-sm tabular-nums">
              {totalSessionPetals.toLocaleString()}
            </span>
          </div>
          <span aria-hidden="true">·</span>
          <div>
            <span>SECTOR: </span>
            <span className="text-stone-200">{selectedZone.name.split(' ')[0]}</span>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="mt-8 flex items-center gap-3 w-full max-w-sm">
          <button
            onClick={handleDecrement}
            disabled={sessionCount <= 0}
            className="flex-1 py-2.5 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 disabled:opacity-40 text-stone-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Minus className="w-3.5 h-3.5" />
            <span>Minus {stepSize}</span>
          </button>

          <button
            onClick={handleReset}
            disabled={sessionCount <= 0}
            className="p-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 disabled:opacity-40 text-stone-400 hover:text-stone-200 transition-colors cursor-pointer"
            title="Reset counter"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={handleCommit}
            disabled={sessionCount <= 0}
            className="flex-2 py-2.5 px-4 rounded-xl bg-emerald-400 hover:bg-emerald-300 disabled:opacity-40 text-stone-900 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md"
          >
            <Sparkles className="w-4 h-4 text-stone-900" />
            <span>Commit to Registry</span>
          </button>
        </div>
      </div>
    </div>
  );
};
