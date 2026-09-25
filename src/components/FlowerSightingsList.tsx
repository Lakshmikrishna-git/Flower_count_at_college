import React, { useState } from 'react';
import { FlowerEntry } from '../types/flower';
import { Heart, MessageCircle, MapPin, Trash2, Calendar, User, Check, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface FlowerSightingsListProps {
  flowers: FlowerEntry[];
  selectedCategory: string;
  selectedLocation: string;
  currentUserRole: 'user' | 'admin';
  onReact: (flowerId: string, reactionType: keyof FlowerEntry['reactions']) => void;
  onDeleteFlower?: (flowerId: string) => void;
}

export const FlowerSightingsList: React.FC<FlowerSightingsListProps> = ({
  flowers,
  selectedCategory,
  selectedLocation,
  currentUserRole,
  onReact,
  onDeleteFlower,
}) => {
  const [activeReactionId, setActiveReactionId] = useState<string | null>(null);

  // Filter flowers
  const filtered = flowers.filter((f) => {
    const matchCat = selectedCategory === 'all' || f.category === selectedCategory;
    const matchLoc = selectedLocation === 'all' || f.locationName === selectedLocation;
    return matchCat && matchLoc;
  });

  const handleEmojiClick = (
    e: React.MouseEvent,
    flowerId: string,
    reactionType: keyof FlowerEntry['reactions']
  ) => {
    e.stopPropagation();
    onReact(flowerId, reactionType);
    setActiveReactionId(flowerId);

    // Micro petal confetti
    confetti({
      particleCount: 15,
      spread: 35,
      origin: {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      },
      colors: ['#f43f5e', '#fb7185', '#34d399', '#fde047'],
    });

    setTimeout(() => setActiveReactionId(null), 500);
  };

  const reactionEmojis: Array<{ type: keyof FlowerEntry['reactions']; emoji: string; label: string }> = [
    { type: 'cherry', emoji: '🌸', label: 'Cherry' },
    { type: 'blossom', emoji: '🌼', label: 'Daisy' },
    { type: 'hibiscus', emoji: '🌺', label: 'Hibiscus' },
    { type: 'sparkles', emoji: '✨', label: 'Vibe' },
    { type: 'love', emoji: '💚', label: 'Campus Love' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold font-serif text-stone-900 tracking-tight">
            Recent Campus Sightings
          </h3>
          <p className="text-xs text-stone-500">
            Real-time verified blooms logged across college sectors
          </p>
        </div>
        <span className="text-xs font-mono font-semibold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
          {filtered.length} entries
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-emerald-100 text-stone-500 space-y-2">
          <span className="text-4xl block">🍃</span>
          <p className="text-sm font-semibold text-stone-700">No flowers found matching current filters</p>
          <p className="text-xs text-stone-400">Try choosing a different campus sector or plant category!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((flower) => {
            const totalReactions =
              flower.reactions.cherry +
              flower.reactions.blossom +
              flower.reactions.hibiscus +
              flower.reactions.sparkles +
              flower.reactions.love;

            return (
              <div
                key={flower.id}
                className="bg-white rounded-3xl border border-stone-200/80 hover:border-emerald-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
              >
                <div>
                  {/* Photo or aesthetic pastel card header */}
                  {flower.imageUrl ? (
                    <div className="h-44 w-full overflow-hidden bg-stone-100 relative">
                      <img
                        src={flower.imageUrl}
                        alt={flower.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-stone-900 text-xs font-bold font-mono px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1.5">
                        <span>🌸</span>
                        <span>{flower.count} flowers</span>
                      </div>

                      <div className="absolute top-3 right-3 bg-stone-900/80 backdrop-blur-md text-white text-[10px] font-mono px-2 py-0.5 rounded-full">
                        {flower.category}
                      </div>
                    </div>
                  ) : (
                    <div className="h-28 w-full bg-gradient-to-r from-emerald-50 via-teal-50 to-pink-50 p-4 relative flex items-center justify-between border-b border-stone-100">
                      <div className="flex items-center gap-2">
                        <span className="text-3xl">🌸</span>
                        <div>
                          <span className="text-xs font-mono font-semibold text-emerald-800 bg-white/80 px-2 py-0.5 rounded-full">
                            {flower.count} spotted
                          </span>
                        </div>
                      </div>
                      <span className="text-[11px] font-mono bg-stone-900/10 text-stone-700 px-2.5 py-1 rounded-full font-semibold">
                        {flower.category}
                      </span>
                    </div>
                  )}

                  <div className="p-4 space-y-2">
                    <div>
                      <h4 className="font-bold text-stone-900 text-base group-hover:text-emerald-800 transition-colors">
                        {flower.name}
                      </h4>
                      <div className="flex items-center gap-1.5 text-xs text-stone-500 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="font-medium text-stone-700">{flower.locationName}</span>
                      </div>
                    </div>

                    {flower.notes && (
                      <p className="text-xs text-stone-600 italic bg-stone-50 p-2.5 rounded-xl border border-stone-100 leading-relaxed">
                        "{flower.notes}"
                      </p>
                    )}

                    <div className="pt-2 text-[11px] text-stone-400 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px] font-bold">
                          {flower.userName.charAt(0)}
                        </div>
                        <span className="text-stone-600 font-medium">Logged by {flower.userName}</span>
                      </div>
                      <span className="font-mono">
                        {new Date(flower.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Gen Z Emoji Reactions Bar */}
                <div className="p-3 bg-stone-50/70 border-t border-stone-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1 overflow-x-auto">
                    {reactionEmojis.map((r) => {
                      const count = flower.reactions[r.type];
                      return (
                        <button
                          key={r.type}
                          onClick={(e) => handleEmojiClick(e, flower.id, r.type)}
                          className="px-2 py-1 rounded-full bg-white hover:bg-emerald-50 border border-stone-200 hover:border-emerald-300 text-xs font-mono font-medium transition-all active:scale-95 cursor-pointer flex items-center gap-1 text-stone-700"
                          title={`React with ${r.label}`}
                        >
                          <span className="text-xs">{r.emoji}</span>
                          <span className="text-[10px]">{count}</span>
                        </button>
                      );
                    })}
                  </div>

                  {currentUserRole === 'admin' && onDeleteFlower && (
                    <button
                      onClick={() => onDeleteFlower(flower.id)}
                      className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer shrink-0"
                      title="Admin: Remove entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
