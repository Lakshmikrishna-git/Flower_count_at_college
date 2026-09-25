import React, { useState } from 'react';
import { X, Sparkles, Camera, MapPin, Check, Plus, AlertCircle } from 'lucide-react';
import { FlowerEntry } from '../types/flower';
import { CAMPUS_CAMPUS_LOCATIONS, FLOWER_CATEGORIES } from '../data/flowerConstants';
import confetti from 'canvas-confetti';

interface AddFlowerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveFlower: (flowerData: Omit<FlowerEntry, 'id' | 'timestamp' | 'reactions'>) => void;
  preselectedCoords?: { lat: number; lng: number; location: string } | null;
  currentUserRole: 'user' | 'admin';
  currentUserName: string;
}

export const AddFlowerModal: React.FC<AddFlowerModalProps> = ({
  isOpen,
  onClose,
  onSaveFlower,
  preselectedCoords,
  currentUserRole,
  currentUserName,
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState<string>('Scarlet Hibiscus');
  const [category, setCategory] = useState<string>('Hibiscus');
  const [locationName, setLocationName] = useState<string>(
    preselectedCoords?.location || CAMPUS_CAMPUS_LOCATIONS[0].name
  );
  const [lat, setLat] = useState<number>(preselectedCoords?.lat || CAMPUS_CAMPUS_LOCATIONS[0].lat);
  const [lng, setLng] = useState<number>(preselectedCoords?.lng || CAMPUS_CAMPUS_LOCATIONS[0].lng);
  const [count, setCount] = useState<number>(5);
  const [notes, setNotes] = useState<string>('Spotted right along the sunny path in full morning bloom!');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [userName, setUserName] = useState<string>(currentUserName);

  // AI-based flower suggestion (keyword matching + smart auto-completion)
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);

  const handleNameChange = (val: string) => {
    setName(val);
    const lower = val.toLowerCase();

    // AI Keyword auto-suggestion
    if (lower.includes('hibis') || lower.includes('chemba') || lower.includes('red')) {
      setCategory('Hibiscus');
      setAiSuggestion('AI Match: Detected Hibiscus (Malvaceae family)!');
    } else if (lower.includes('boug') || lower.includes('paper') || lower.includes('pink') || lower.includes('bract')) {
      setCategory('Bougainvillea');
      setAiSuggestion('AI Match: Detected Bougainvillea paper flower!');
    } else if (lower.includes('mari') || lower.includes('orange') || lower.includes('chrysanth') || lower.includes('tagetes')) {
      setCategory('Marigold');
      setAiSuggestion('AI Match: Detected Marigold (Tagetes)!');
    } else if (lower.includes('plumeria') || lower.includes('frangi') || lower.includes('white') || lower.includes('champa')) {
      setCategory('Frangipani');
      setAiSuggestion('AI Match: Detected Plumeria / Frangipani!');
    } else if (lower.includes('rose') || lower.includes('gulab')) {
      setCategory('Rose');
      setAiSuggestion('AI Match: Detected Garden Rose!');
    } else if (lower.includes('jas') || lower.includes('mulla') || lower.includes('mallika')) {
      setCategory('Jasmine');
      setAiSuggestion('AI Match: Detected Fragrant Jasmine!');
    } else if (lower.includes('sun') || lower.includes('tecoma') || lower.includes('bell')) {
      setCategory('Sunflower');
      setAiSuggestion('AI Match: Detected Yellow Sunburst/Tecoma!');
    } else if (lower.includes('touch') || lower.includes('mimosa') || lower.includes('wild') || lower.includes('glory')) {
      setCategory('Wildflower');
      setAiSuggestion('AI Match: Detected Campus Wildflower / Mimosa!');
    } else {
      setAiSuggestion(null);
    }
  };

  const handleLocationSelect = (locName: string) => {
    setLocationName(locName);
    const found = CAMPUS_CAMPUS_LOCATIONS.find((l) => l.name === locName);
    if (found) {
      setLat(found.lat);
      setLng(found.lng);
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#34d399', '#f472b6', '#fde047', '#38bdf8'],
    });

    onSaveFlower({
      name: name.trim() || 'Campus Blossom',
      category,
      locationName,
      lat,
      lng,
      count: Math.max(1, count),
      notes: notes.trim() || undefined,
      imageUrl: imageUrl.trim() || undefined,
      userName: userName.trim() || 'Campus Scout',
      userRole: currentUserRole,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full border border-stone-200 shadow-2xl overflow-hidden my-6 animate-scale-in">
        {/* Modal Top Bar */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-lg">
              🌸
            </div>
            <div>
              <h2 className="font-bold text-base tracking-tight font-serif">
                Add Flower Sighting
              </h2>
              <p className="text-[11px] text-emerald-100 font-mono">
                Logged to college SQLite database
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-full text-emerald-100 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Flower Name Input + AI Auto-Suggestion */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
              Flower Name / Variety *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Red Tropical Hibiscus, Golden Marigold"
              className="w-full text-xs font-semibold bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-stone-900 focus:outline-emerald-500"
            />

            {aiSuggestion && (
              <div className="mt-1.5 flex items-center gap-1.5 text-xs text-emerald-700 font-medium bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>{aiSuggestion}</span>
              </div>
            )}
          </div>

          {/* Category Selector */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Category
            </label>
            <div className="grid grid-cols-4 gap-2">
              {FLOWER_CATEGORIES.map((cat) => {
                const isSelected = category === cat.name;
                return (
                  <button
                    type="button"
                    key={cat.name}
                    onClick={() => setCategory(cat.name)}
                    className={`py-2 px-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer flex flex-col items-center gap-1 ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-2xs'
                        : 'border-stone-200 bg-stone-50/50 hover:bg-stone-100 text-stone-600'
                    }`}
                  >
                    <span className="text-base">{cat.emoji}</span>
                    <span className="text-[10px] truncate max-w-[65px]">{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Location & Count Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Campus Location *
              </label>
              <select
                value={locationName}
                onChange={(e) => handleLocationSelect(e.target.value)}
                className="w-full text-xs font-semibold bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-stone-900 focus:outline-emerald-500"
              >
                {CAMPUS_CAMPUS_LOCATIONS.map((loc) => (
                  <option key={loc.name} value={loc.name}>
                    {loc.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Flower Count (Number) *
              </label>
              <input
                type="number"
                min={1}
                max={500}
                required
                value={count}
                onChange={(e) => setCount(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full text-xs font-mono font-bold bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-stone-900 focus:outline-emerald-500"
              />
            </div>
          </div>

          {/* Coordinates read-only display */}
          <div className="flex items-center gap-2 text-[11px] font-mono text-stone-400 bg-stone-50 p-2 rounded-xl border border-stone-100">
            <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>GeoTag: [{lat.toFixed(4)}, {lng.toFixed(4)}]</span>
          </div>

          {/* Field Photo Upload */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
              Flower Photo (Optional)
            </label>
            <div className="flex items-center gap-3">
              {imageUrl ? (
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden border border-stone-200 shrink-0">
                  <img src={imageUrl} alt="preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setImageUrl('')}
                    className="absolute top-1 right-1 p-0.5 bg-black/60 text-white rounded-full text-xs cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <label className="w-20 h-20 rounded-2xl border-2 border-dashed border-emerald-300 hover:border-emerald-500 bg-emerald-50/30 flex flex-col items-center justify-center cursor-pointer text-emerald-600 transition-colors shrink-0">
                  <Camera className="w-5 h-5 mb-1" />
                  <span className="text-[9px] font-mono uppercase font-bold">Add Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="hidden"
                  />
                </label>
              )}
              <div className="text-xs text-stone-500 leading-tight">
                Upload a picture of the blossom directly from your phone camera or select from storage.
              </div>
            </div>
          </div>

          {/* Observer Name & Role */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Your Name
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full text-xs font-semibold bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-stone-900 focus:outline-emerald-500"
                placeholder="e.g. Ananya K."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Posting Role
              </label>
              <div className="h-10 flex items-center px-3 bg-stone-100 rounded-xl text-xs font-bold text-stone-700 font-mono">
                {currentUserRole === 'admin' ? '🛡️ Admin Scout' : '🌱 Student Scout'}
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
              Field Observations
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Catching morning sun near the canteen parotta counter..."
              className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:outline-emerald-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-stone-600 hover:text-stone-900 rounded-full transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-full shadow-md transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Record Flower Sighting 🌸</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
