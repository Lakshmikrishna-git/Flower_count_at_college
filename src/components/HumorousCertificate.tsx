import React, { useState } from 'react';
import { Award, Printer, Sparkles, Copy, Check, Shield, Download, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface HumorousCertificateProps {
  currentUserName: string;
  totalSightingsCount: number;
  totalFlowersCount: number;
}

export const HumorousCertificate: React.FC<HumorousCertificateProps> = ({
  currentUserName,
  totalSightingsCount,
  totalFlowersCount,
}) => {
  const [userName, setUserName] = useState<string>(currentUserName || 'Sneha Menon');
  const [selectedTitle, setSelectedTitle] = useState<string>('Certified Flower Disturber 🌸');
  const [selectedReason, setSelectedReason] = useState<string>(
    'for successfully interacting with an unnecessary number of campus flowers and contributing to the official Petal Count Database.'
  );
  const [copied, setCopied] = useState<boolean>(false);

  const [awardType, setAwardType] = useState<'standard' | 'unauthorized'>('unauthorized');

  const TITLE_OPTIONS = [
    'Certified Flower Disturber 🌸',
    'Unauthorized Flora Offender (Strictly Cautionary) 🚫',
    'Botanical Explorer (Unofficial)',
    'Professional Grass Toucher 🌿',
    'Flora Investigator Level 100 🔍',
    'Petal Count Contributor 🌺',
    'Honorary Plant Respecter 🌼',
    'Supreme Defender of Unplucked Chembarathi 🛡️',
    'Unauthorized Petal Auditor (Unaccredited Degree)',
  ];

  const REASON_OPTIONS = [
    'for successfully interacting with an unnecessary number of campus flowers and contributing to the official Petal Count Database.',
    'for receiving an Unauthorized Certification Award after lingering within 3 inches of campus flowers without prior written Dean permission.',
    'for excessive loitering near the Canteen marigold bushes while procrastinating semester lab manuals.',
    'for verifying that bougainvillea bracts are not actually true biological petals, yet counting them anyway.',
    'for achieving peak aura points by refusing to pluck flowers despite intense academic temptation.',
    'for spotting rare wildflowers behind the sports grounds while attempting to skip 8:30 AM lectures.',
    'for being caught on CCTV admiring Decennial Block hibiscus instead of writing Engineering Chemistry assignments.',
  ];

  const handlePrint = () => {
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#34d399', '#f472b6', '#fde047', '#38bdf8'],
    });
    window.print();
  };

  const handleCopyText = () => {
    const text = `📜 Certificate of Questionable Achievement 🌸\n` +
      `This certifies that ${userName}\n` +
      `has successfully unlocked the title: "${selectedTitle}"\n` +
      `Reason: ${selectedReason}\n` +
      `Verified blossoms audited: ${totalFlowersCount}\n` +
      `📌 This certificate has zero academic value but maximum vibes.`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-xs space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-600">
            <Sparkles className="w-3.5 h-3.5 text-rose-500" />
            <span>Bureau of Questionable Achievements</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold font-serif text-stone-900 tracking-tight mt-0.5">
            Humorous Campus Diploma Generator
          </h3>
          <p className="text-xs text-stone-500">
            Customize and print your officially unofficial Gen Z floral recognition certificate.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleCopyText}
            className="px-3.5 py-2 rounded-full border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-bold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-stone-400" />
                <span>Copy Text</span>
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm hover:shadow-md"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Diploma</span>
          </button>
        </div>
      </div>

      {/* Customization Inputs (Hidden in Print) */}
      <div className="bg-stone-50 p-4 sm:p-5 rounded-2xl border border-stone-200/80 space-y-3 print:hidden">
        {/* Certificate Style Toggle */}
        <div className="flex items-center justify-between pb-2 border-b border-stone-200">
          <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">
            Certificate Format:
          </span>
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-stone-200 text-xs">
            <button
              onClick={() => {
                setAwardType('unauthorized');
                setSelectedTitle('Unauthorized Flora Offender (Strictly Cautionary) 🚫');
                setSelectedReason('for receiving an Unauthorized Certification Award after lingering within 3 inches of campus flowers without prior written Dean permission.');
              }}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                awardType === 'unauthorized'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              🚨 Unauthorized Certification Award
            </button>
            <button
              onClick={() => {
                setAwardType('standard');
                setSelectedTitle('Certified Flower Disturber 🌸');
                setSelectedReason('for successfully interacting with an unnecessary number of campus flowers and contributing to the official Petal Count Database.');
              }}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                awardType === 'standard'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              🌸 Standard Questionable Diploma
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
              Recipient Name
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full text-xs font-semibold bg-white border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:outline-emerald-500"
              placeholder="e.g. Anand Menon"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
              Achievement Title
            </label>
            <select
              value={selectedTitle}
              onChange={(e) => setSelectedTitle(e.target.value)}
              className="w-full text-xs font-semibold bg-white border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:outline-emerald-500"
            >
              {TITLE_OPTIONS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
            Official Reason for Distinction
          </label>
          <select
            value={selectedReason}
            onChange={(e) => setSelectedReason(e.target.value)}
            className="w-full text-xs font-medium bg-white border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:outline-emerald-500"
          >
            {REASON_OPTIONS.map((r, i) => (
              <option key={i} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* The Printable Ornamental Diploma Card */}
      <div className={`relative bg-[#fdfcfa] border-4 ${awardType === 'unauthorized' ? 'border-rose-400 border-solid ring-8 ring-rose-50' : 'border-dashed border-stone-300'} rounded-3xl p-8 sm:p-12 text-center text-stone-900 shadow-sm overflow-hidden select-none print:m-0 print:border-4 print:shadow-none`}>
        {/* Subtle Background Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
          <Award className="w-80 h-80" />
        </div>

        {/* Diagonal "UNAUTHORIZED" Rubber Stamp for the requested Award */}
        {awardType === 'unauthorized' && (
          <div className="absolute top-8 right-6 sm:top-10 sm:right-10 rotate-[-14deg] border-4 border-rose-600 text-rose-600 font-mono font-black text-xs sm:text-sm px-4 py-1.5 rounded-lg uppercase tracking-widest opacity-85 shadow-xs pointer-events-none select-none">
            UNAUTHORIZED CERTIFICATE
          </div>
        )}

        {/* Certificate Header */}
        <div className="space-y-1.5 pb-4 border-b border-stone-200">
          <div className={`text-[11px] font-mono font-bold uppercase tracking-widest ${awardType === 'unauthorized' ? 'text-rose-700' : 'text-emerald-800'}`}>
            FlowerCount 🌸 · {awardType === 'unauthorized' ? 'ILLEGITIMATE CAMPUS CITATION' : 'Officially Unofficial Recognition'}
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight">
            {awardType === 'unauthorized' ? 'Unauthorized Certification Award 🚫' : 'Certificate of Questionable Achievement 🌸'}
          </h2>
          <p className="text-xs text-stone-500 italic">
            {awardType === 'unauthorized'
              ? 'Conferred without Dean approval by the Clandestine Council of Plant Touchers'
              : 'Conferred by the Autonomous Council of Non-Essential Botanical Endeavors'}
          </p>
        </div>

        {/* Recipient Announcement */}
        <div className="my-6 space-y-4">
          <p className="text-xs font-mono uppercase tracking-widest text-stone-400">
            This solemn document certifies that
          </p>

          <div className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 underline decoration-emerald-500/50 decoration-2 underline-offset-8">
            {userName || 'Distinguished Scout'}
          </div>

          <p className="text-xs sm:text-sm text-stone-600 max-w-lg mx-auto leading-relaxed pt-1">
            {selectedReason}
          </p>

          <div className="inline-block pt-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-stone-400 block mb-1">
              Achievement Unlocked:
            </span>
            <div className="px-5 py-2 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-emerald-900 font-bold text-base sm:text-lg font-serif shadow-2xs">
              {selectedTitle}
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div className="my-4 py-2 px-4 rounded-xl bg-stone-100/70 border border-stone-200 inline-flex items-center gap-6 text-xs font-mono text-stone-700">
          <div>
            <span>CAMPUS SIGHTINGS: </span>
            <strong className="text-emerald-700">{totalSightingsCount}</strong>
          </div>
          <span aria-hidden="true" className="text-stone-300">·</span>
          <div>
            <span>TOTAL BLOSSOMS: </span>
            <strong className="text-emerald-700">{totalFlowersCount}</strong>
          </div>
        </div>

        {/* Signatures & Seal */}
        <div className="mt-8 pt-6 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-center sm:text-left space-y-0.5">
            <div className="text-sm font-serif italic font-bold text-stone-800 border-b border-stone-300 pb-0.5 px-2">
              Prof. Chembarathi Varma
            </div>
            <div className="text-[10px] font-mono uppercase text-stone-400">
              Department of Flower Staring
            </div>
          </div>

          {/* Golden Seal */}
          <div className="w-16 h-16 rounded-full border-2 border-amber-500 bg-gradient-to-tr from-amber-400 to-yellow-200 shadow-xs flex flex-col items-center justify-center text-amber-950 p-1 shrink-0">
            <Shield className="w-4 h-4 text-amber-900 mb-0.5" />
            <span className="text-[7px] font-bold font-mono uppercase tracking-wider">
              VERIFIED
            </span>
            <span className="text-[6px] font-mono">100% VIBES</span>
          </div>

          <div className="text-center sm:text-right space-y-0.5">
            <div className="text-sm font-serif italic font-bold text-stone-800 border-b border-stone-300 pb-0.5 px-2">
              Security Whistle Officer
            </div>
            <div className="text-[10px] font-mono uppercase text-stone-400">
              Anti-Plucking Watchman Patrol
            </div>
          </div>
        </div>

        {/* Required Gen Z Disclaimer */}
        <div className="mt-8 pt-4 border-t border-stone-200 text-center">
          <p className="text-xs font-bold text-emerald-800 font-mono tracking-tight bg-emerald-50/80 py-1.5 px-4 rounded-full inline-block border border-emerald-200/60">
            📌 This certificate has zero academic value but maximum vibes.
          </p>
        </div>
      </div>
    </div>
  );
};
