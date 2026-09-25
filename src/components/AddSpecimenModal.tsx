import React, { useState } from 'react';
import { X, Sparkles, Upload, Camera, Flower, Check, AlertCircle } from 'lucide-react';
import { CampusZone, FlowerCondition, FlowerSpecimen } from '../types';
import { playStampSound, playCelebrationSound } from '../utils/audio';
import { firePetalConfetti } from '../utils/confetti';

interface AddSpecimenModalProps {
  isOpen: boolean;
  onClose: () => void;
  zones: CampusZone[];
  preselectedZoneId?: string;
  onSaveSpecimen: (specimen: Omit<FlowerSpecimen, 'id' | 'totalPetals' | 'dateAdded'>) => void;
  collegeName: string;
}

export const AddSpecimenModal: React.FC<AddSpecimenModalProps> = ({
  isOpen,
  onClose,
  zones,
  preselectedZoneId,
  onSaveSpecimen,
  collegeName,
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState<string>('Red Hibiscus');
  const [scientificName, setScientificName] = useState<string>('Hibiscus procrastinatus');
  const [zoneId, setZoneId] = useState<string>(preselectedZoneId || zones[0]?.id || '');
  const [count, setCount] = useState<number>(1);
  const [petalsPerFlower, setPetalsPerFlower] = useState<number>(5);
  const [color, setColor] = useState<string>('#ef4444');
  const [condition, setCondition] = useState<FlowerCondition>('thriving');
  const [finderName, setFinderName] = useState<string>('Campus Observer');
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [notes, setNotes] = useState<string>('');

  // AI Examination Result
  const [isExamining, setIsExamining] = useState<boolean>(false);
  const [examVerdict, setExamVerdict] = useState<{
    botanicalIdentity: string;
    scientificName: string;
    estimatedPetals: number;
    verdict: string;
    campusRiskLevel: string;
    academicEquivalent: string;
    uselessFunFact: string;
  } | null>(null);
  const [examError, setExamError] = useState<string | null>(null);

  const selectedZone = zones.find((z) => z.id === zoneId) || zones[0];

  // Sample archetypes for instant selection
  const SAMPLE_ARCHETYPES = [
    {
      name: 'Red Hibiscus (Chembarathi)',
      sci: 'Hibiscus procrastinatus',
      petals: 5,
      color: '#ef4444',
      image: '/src/assets/images/botanical_specimen_hibiscus_1790316203580.jpg',
    },
    {
      name: 'Campus Wall Bougainvillea',
      sci: 'Bougainvillea bunkeria',
      petals: 3,
      color: '#ec4899',
      image: '/src/assets/images/botanical_specimen_bougainvillea_1790316217851.jpg',
    },
    {
      name: 'Canteen Golden Marigold',
      sci: 'Tagetes chai-splatterus',
      petals: 42,
      color: '#f59e0b',
      image: '/src/assets/images/botanical_specimen_marigold_1790316233089.jpg',
    },
    {
      name: 'Touch-Me-Not (Mimosa)',
      sci: 'Mimosa social-anxietus',
      petals: 16,
      color: '#d946ef',
      image: undefined,
    },
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRunAIExamination = async () => {
    setIsExamining(true);
    setExamError(null);
    try {
      const res = await fetch('/api/examine-flower', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: imageBase64 || undefined,
          flowerName: name,
          zoneName: selectedZone.name,
          notes,
          collegeName,
        }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setExamVerdict(json.data);
        if (json.data.scientificName) setScientificName(json.data.scientificName);
        if (json.data.estimatedPetals) setPetalsPerFlower(json.data.estimatedPetals);
        if (json.data.botanicalIdentity && !name) setName(json.data.botanicalIdentity);
      } else {
        setExamError('Could not reach census bureau intelligence. Using local inspection.');
      }
    } catch (err: any) {
      setExamError('Census bureau offline. Manual inspection applied.');
    } finally {
      setIsExamining(false);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    playStampSound();
    firePetalConfetti();

    onSaveSpecimen({
      name: name.trim() || 'Unidentified Blossom',
      scientificName: scientificName.trim() || 'Flora incognita',
      zoneId: selectedZone.id,
      zoneName: selectedZone.name,
      count: Math.max(1, count),
      petalsPerFlower: Math.max(1, petalsPerFlower),
      color,
      condition,
      finderName: finderName.trim() || 'Campus Observer',
      imageUrl: imageBase64 || undefined,
      verdict: examVerdict?.verdict,
      academicEquivalent: examVerdict?.academicEquivalent,
      campusRisk: examVerdict?.campusRiskLevel,
      uselessFact: examVerdict?.uselessFunFact,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-stone-200 shadow-2xl overflow-hidden my-6">
        {/* Modal Top Bar */}
        <div className="px-6 py-4 bg-stone-900 text-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Flower className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-base text-stone-100 leading-tight">
                Official Specimen Audit
              </h2>
              <p className="text-[11px] text-stone-400">
                Register a newly sighted campus bloom
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSave} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Quick Archetype Picker */}
          <div>
            <span className="block text-[11px] font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
              Choose Campus Specimen or Custom:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {SAMPLE_ARCHETYPES.map((arch) => (
                <button
                  type="button"
                  key={arch.name}
                  onClick={() => {
                    setName(arch.name);
                    setScientificName(arch.sci);
                    setPetalsPerFlower(arch.petals);
                    setColor(arch.color);
                    if (arch.image) setImageBase64(arch.image);
                  }}
                  className={`p-2 rounded-xl text-left border text-xs transition-all cursor-pointer ${
                    name === arch.name
                      ? 'border-emerald-500 bg-emerald-50/50 text-emerald-950 font-medium'
                      : 'border-stone-200 hover:border-stone-300 text-stone-700 bg-stone-50'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: arch.color }} />
                    <span className="truncate font-semibold">{arch.name.split(' ')[0]}</span>
                  </div>
                  <div className="text-[10px] text-stone-400 font-mono">
                    {arch.petals} petals
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Image Upload or Camera Preview */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-500 mb-1">
              Field Photograph (Optional)
            </label>
            <div className="flex items-center gap-3">
              {imageBase64 ? (
                <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-stone-300 shrink-0">
                  <img
                    src={imageBase64}
                    alt="Specimen preview"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <button
                    type="button"
                    onClick={() => setImageBase64(null)}
                    className="absolute top-1 right-1 p-0.5 bg-black/60 text-white rounded-full text-xs"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <label className="w-20 h-20 rounded-xl border-2 border-dashed border-stone-300 hover:border-emerald-400 bg-stone-50 flex flex-col items-center justify-center cursor-pointer text-stone-400 hover:text-emerald-600 transition-colors shrink-0">
                  <Camera className="w-5 h-5 mb-1" />
                  <span className="text-[9px] uppercase font-mono font-medium">Add Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}

              <div className="flex-1">
                <p className="text-xs text-stone-500 leading-tight">
                  Upload a snapshot or camera capture of the flower on campus. Our AI Botanical Auditor can identify its petals and rate its procrastination potential.
                </p>
                <button
                  type="button"
                  onClick={handleRunAIExamination}
                  disabled={isExamining}
                  className="mt-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-stone-900 text-stone-100 hover:bg-stone-800 disabled:opacity-50 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{isExamining ? 'Auditing Specimen...' : 'Run AI Botanical Audit'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* AI Examination Result Card */}
          {examVerdict && (
            <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs space-y-2">
              <div className="flex items-center justify-between text-emerald-900 font-semibold">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Census Bureau Official Verdict:</span>
                </span>
                <span className="font-mono text-[11px] text-emerald-700">Verified</span>
              </div>
              <p className="text-stone-700 italic">"{examVerdict.verdict}"</p>
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-emerald-200/60 text-[11px]">
                <div>
                  <span className="font-semibold text-stone-600">Academic Equivalent: </span>
                  <span className="text-stone-800">{examVerdict.academicEquivalent}</span>
                </div>
                <div>
                  <span className="font-semibold text-stone-600">Patrol Risk: </span>
                  <span className="text-stone-800">{examVerdict.campusRiskLevel}</span>
                </div>
              </div>
            </div>
          )}

          {examError && (
            <div className="p-3 rounded-lg bg-stone-100 text-stone-600 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-stone-400 shrink-0" />
              <span>{examError}</span>
            </div>
          )}

          {/* Basic Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-500 mb-1">
                Specimen Common Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs font-medium bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:outline-emerald-500"
                placeholder="e.g. Red Hibiscus"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-500 mb-1">
                Humorous / Scientific Binomial
              </label>
              <input
                type="text"
                value={scientificName}
                onChange={(e) => setScientificName(e.target.value)}
                className="w-full text-xs font-mono italic bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:outline-emerald-500"
                placeholder="e.g. Hibiscus bunkeria"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-500 mb-1">
                Collegiate Sector *
              </label>
              <select
                value={zoneId}
                onChange={(e) => setZoneId(e.target.value)}
                className="w-full text-xs font-medium bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:outline-emerald-500"
              >
                {zones.map((zone) => (
                  <option key={zone.id} value={zone.id}>
                    {zone.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-500 mb-1">
                Condition / Academic State
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as FlowerCondition)}
                className="w-full text-xs font-medium bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:outline-emerald-500"
              >
                <option value="thriving">Thriving (Somehow healthy)</option>
                <option value="wilted_by_exams">Wilted by Semester Finals</option>
                <option value="soaked_in_chai">Soaked in Canteen Chai Steam</option>
                <option value="munched_by_caterpillar">Munched by Campus Fauna</option>
                <option value="legendary_bloom">Legendary Unkillable Bloom</option>
              </select>
            </div>
          </div>

          {/* Counts and Math */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-500 mb-1">
                Total Flowers
              </label>
              <input
                type="number"
                min={1}
                value={count}
                onChange={(e) => setCount(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full text-xs font-mono font-bold bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:outline-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-500 mb-1">
                Petals/Flower
              </label>
              <input
                type="number"
                min={1}
                value={petalsPerFlower}
                onChange={(e) => setPetalsPerFlower(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full text-xs font-mono font-bold bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:outline-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-500 mb-1">
                Petal Color
              </label>
              <div className="flex items-center gap-2 h-9">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-8 h-8 rounded border border-stone-300 cursor-pointer p-0"
                />
                <span className="text-[11px] font-mono text-stone-500 uppercase">{color}</span>
              </div>
            </div>
          </div>

          {/* Finder Name */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-500 mb-1">
              Field Observer / Student Name
            </label>
            <input
              type="text"
              value={finderName}
              onChange={(e) => setFinderName(e.target.value)}
              className="w-full text-xs font-medium bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:outline-emerald-500"
              placeholder="e.g. Rahul (S5 CSE)"
            />
          </div>

          {/* Modal Action Buttons */}
          <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-stone-900 bg-emerald-400 hover:bg-emerald-300 rounded-lg shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Seal into College Census</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
