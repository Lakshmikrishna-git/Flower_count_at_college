import React from 'react';
import { Flower, Volume2, VolumeX, Settings, Plus } from 'lucide-react';
import { getSoundMuted, setSoundMuted } from '../utils/audio';

interface NavbarProps {
  activeTab: 'dashboard' | 'map' | 'tally' | 'floradex' | 'stats' | 'certificate';
  setActiveTab: (tab: 'dashboard' | 'map' | 'tally' | 'floradex' | 'stats' | 'certificate') => void;
  onOpenAddModal: () => void;
  onOpenSettings: () => void;
  collegeShortCode: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAddModal,
  onOpenSettings,
  collegeShortCode,
}) => {
  const [muted, setMuted] = React.useState(getSoundMuted());

  const toggleSound = () => {
    const next = !muted;
    setSoundMuted(next);
    setMuted(next);
  };

  const navItems: Array<{ id: 'dashboard' | 'map' | 'tally' | 'floradex' | 'stats' | 'certificate'; label: string }> = [
    { id: 'dashboard', label: 'Census Bureau' },
    { id: 'map', label: 'Campus Map' },
    { id: 'tally', label: 'Tally Clicker' },
    { id: 'floradex', label: 'Floradex' },
    { id: 'stats', label: 'Petal Telemetry' },
    { id: 'certificate', label: 'Diploma' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-stone-900 text-stone-100 border-b border-stone-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-2.5 text-left group transition-opacity hover:opacity-90 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <Flower className="w-4 h-4" />
          </div>
          <span className="text-base sm:text-lg font-bold tracking-tight font-serif text-stone-100">
            {collegeShortCode} Floradex
          </span>
        </button>

        {/* Zone 2: Clean text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-400">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`transition-colors cursor-pointer py-1 relative ${
                  isActive
                    ? 'text-emerald-400 font-semibold'
                    : 'hover:text-stone-200'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary action + utility triggers */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={toggleSound}
            aria-label={muted ? 'Unmute sounds' : 'Mute sounds'}
            className="p-2 text-stone-400 hover:text-stone-200 hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
            title={muted ? 'Unmute procedural sound effects' : 'Mute sound effects'}
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          <button
            onClick={onOpenSettings}
            aria-label="Settings and presets"
            className="p-2 text-stone-400 hover:text-stone-200 hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
            title="Campus settings, export & import"
          >
            <Settings className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-stone-900 bg-emerald-400 hover:bg-emerald-300 rounded-lg shadow-sm transition-colors cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Audit Specimen</span>
          </button>
        </div>
      </div>

      {/* Mobile sub-navigation bar */}
      <div className="md:hidden flex items-center gap-2 overflow-x-auto px-4 py-2 border-t border-stone-800 bg-stone-950/80 text-xs">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`px-2.5 py-1 rounded whitespace-nowrap transition-colors ${
              activeTab === item.id
                ? 'bg-emerald-500/20 text-emerald-400 font-semibold'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
};
