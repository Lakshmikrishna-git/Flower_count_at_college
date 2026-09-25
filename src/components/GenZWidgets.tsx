import React, { useState } from 'react';
import { Sparkles, Trophy, Shuffle, ExternalLink, Lightbulb, Heart, Shield, User } from 'lucide-react';
import { FlowerOfTheDay, Contributor } from '../types/flower';
import { RANDOM_FLOWER_FACTS } from '../data/flowerConstants';
import confetti from 'canvas-confetti';

interface GenZWidgetsProps {
  flowerOfTheDay: FlowerOfTheDay;
  contributors: Contributor[];
  currentUserRole: 'user' | 'admin';
  currentUserName: string;
  onSwitchUserRole: (role: 'user' | 'admin', name: string) => void;
}

export const GenZWidgets: React.FC<GenZWidgetsProps> = ({
  flowerOfTheDay,
  contributors,
  currentUserRole,
  currentUserName,
  onSwitchUserRole,
}) => {
  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  const [isLikingFact, setIsLikingFact] = useState(false);
  const [factLikes, setFactLikes] = useState(38);

  const handleNextFact = () => {
    setCurrentFactIndex((prev) => (prev + 1) % RANDOM_FLOWER_FACTS.length);
  };

  const handleLikeFact = () => {
    setFactLikes((prev) => prev + 1);
    setIsLikingFact(true);
    confetti({
      particleCount: 20,
      spread: 45,
      origin: { y: 0.8 },
      colors: ['#f472b6', '#34d399', '#fde047'],
    });
    setTimeout(() => setIsLikingFact(false), 300);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* 1. Flower of the Day Card (Aesthetic Pastel Notion/Pinterest vibe) */}
      <div className="bg-gradient-to-br from-rose-50/70 via-white to-pink-50/40 p-6 rounded-3xl border border-rose-100/80 shadow-xs relative overflow-hidden group hover:shadow-md transition-all flex flex-col justify-between">
        <div className="absolute top-0 right-0 translate-x-4 -translate-y-4 w-28 h-28 bg-rose-200/30 rounded-full blur-2xl pointer-events-none" />

        <div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700 bg-rose-100/70 px-2.5 py-1 rounded-full flex items-center gap-1.5">
              <span>🌸</span> Flower of the Day
            </span>
            <span className="text-xs font-mono font-semibold text-rose-800 bg-white px-2 py-0.5 rounded-full border border-rose-100 shadow-2xs">
              {flowerOfTheDay.spottedToday} sighted today
            </span>
          </div>

          <div className="mt-4 flex items-start gap-3.5">
            <span className="text-4xl filter drop-shadow-sm select-none group-hover:scale-110 transition-transform">
              {flowerOfTheDay.emoji}
            </span>
            <div>
              <h3 className="text-lg font-bold font-serif text-stone-900 leading-tight">
                {flowerOfTheDay.name}
              </h3>
              <p className="text-xs text-stone-500 font-mono italic">
                {flowerOfTheDay.scientificName}
              </p>
            </div>
          </div>

          <p className="mt-3 text-xs text-stone-600 leading-relaxed bg-white/70 backdrop-blur-2xs p-3 rounded-2xl border border-rose-100/60">
            {flowerOfTheDay.funFact}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-rose-100/60 flex items-center justify-between text-[11px] text-stone-500">
          <span className="truncate max-w-[190px]">📍 {flowerOfTheDay.locationTip}</span>
          <span className="font-semibold text-rose-700 shrink-0">Campus Queen 👑</span>
        </div>
      </div>

      {/* 2. Random Flower Fun Facts Widget (Interactive Gen Z card) */}
      <div className="bg-gradient-to-br from-amber-50/60 via-white to-emerald-50/40 p-6 rounded-3xl border border-amber-100/80 shadow-xs flex flex-col justify-between group hover:shadow-md transition-all">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100/70 px-2.5 py-1 rounded-full flex items-center gap-1.5">
              <Lightbulb className="w-3 h-3 text-amber-600" />
              <span>Campus Botany Tea 🍵</span>
            </span>

            <button
              onClick={handleNextFact}
              className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-full transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-semibold"
              title="Next fun fact"
            >
              <Shuffle className="w-3 h-3" />
              <span>Next</span>
            </button>
          </div>

          <div className="mt-4 min-h-[90px] flex items-center">
            <p className="text-xs text-stone-700 leading-relaxed font-medium">
              "{RANDOM_FLOWER_FACTS[currentFactIndex]}"
            </p>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-amber-100/70 flex items-center justify-between">
          <button
            onClick={handleLikeFact}
            className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              isLikingFact
                ? 'scale-110 bg-rose-500 text-white'
                : 'bg-white hover:bg-rose-50 text-stone-700 hover:text-rose-600 border border-stone-200'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isLikingFact ? 'fill-white' : 'text-rose-500'}`} />
            <span>{factLikes} Likes</span>
          </button>
          <span className="text-[10px] font-mono text-stone-400">
            Fact #{currentFactIndex + 1} of {RANDOM_FLOWER_FACTS.length}
          </span>
        </div>
      </div>

      {/* 3. Top Contributors Leaderboard & Role Switcher */}
      <div className="bg-gradient-to-br from-emerald-50/70 via-white to-teal-50/40 p-6 rounded-3xl border border-emerald-100/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-all">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-2.5 py-1 rounded-full flex items-center gap-1.5">
              <Trophy className="w-3 h-3 text-emerald-600" />
              <span>Flora Leaderboard</span>
            </span>

            {/* Quick Role Toggle (User / Admin) */}
            <div className="flex items-center gap-1 bg-white p-0.5 rounded-full border border-emerald-200 text-[10px]">
              <button
                onClick={() => onSwitchUserRole('user', currentUserName)}
                className={`px-2 py-0.5 rounded-full font-bold cursor-pointer transition-colors ${
                  currentUserRole === 'user' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-stone-500'
                }`}
              >
                User
              </button>
              <button
                onClick={() => onSwitchUserRole('admin', currentUserName)}
                className={`px-2 py-0.5 rounded-full font-bold cursor-pointer transition-colors ${
                  currentUserRole === 'admin' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-stone-500'
                }`}
              >
                Admin 🛡️
              </button>
            </div>
          </div>

          <div className="mt-3.5 space-y-2.5">
            {contributors.slice(0, 3).map((c, index) => (
              <div
                key={c.userName}
                className="flex items-center justify-between p-2 rounded-xl bg-white/80 border border-emerald-100/60 shadow-2xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-bold font-mono text-stone-400 w-4">
                    #{index + 1}
                  </span>
                  <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                    {c.avatar}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-stone-900 flex items-center gap-1">
                      <span>{c.userName}</span>
                      {c.role === 'admin' && (
                        <span className="text-[9px] bg-stone-900 text-white px-1 rounded font-mono">
                          ADMIN
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-stone-400 font-mono">
                      {c.sightingsCount} sightings
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-emerald-800">
                    {c.totalFlowers} fl.
                  </span>
                  <span className="block text-[10px] text-stone-400">{c.badge}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-3 pt-2 border-t border-emerald-100/70 text-[11px] text-stone-500 flex items-center justify-between">
          <span>Active user: <strong className="text-stone-800">{currentUserName}</strong></span>
          <span className="text-emerald-700 font-semibold">{currentUserRole === 'admin' ? 'Admin Mode' : 'Campus Scout'}</span>
        </div>
      </div>
    </div>
  );
};
