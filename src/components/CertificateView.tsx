import React, { useState } from 'react';
import { Award, Printer, Sparkles, Download, CheckCircle, Shield } from 'lucide-react';
import { CampusProfile, FlowerSpecimen } from '../types';
import { playCelebrationSound } from '../utils/audio';
import { firePetalConfetti } from '../utils/confetti';

interface CertificateViewProps {
  campusProfile: CampusProfile;
  specimens: FlowerSpecimen[];
}

export const CertificateView: React.FC<CertificateViewProps> = ({
  campusProfile,
  specimens,
}) => {
  const [studentName, setStudentName] = useState<string>('Arun K. Menon');
  const [studentId, setStudentId] = useState<string>('VAST-CS-2026-042');
  const [department, setDepartment] = useState<string>('Computer Science & Engineering');
  const [selectedDegree, setSelectedDegree] = useState<string>(
    'Bachelor of Campus Flora Investigation (Honors in Petal Accounting)'
  );

  const totalFlowers = specimens.reduce((sum, s) => sum + s.count, 0);
  const totalPetals = specimens.reduce((sum, s) => sum + s.totalPetals, 0);

  const handlePrint = () => {
    playCelebrationSound();
    firePetalConfetti();
    window.print();
  };

  const handleCelebrate = () => {
    playCelebrationSound();
    firePetalConfetti();
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-emerald-600 mb-1">
            Bureau of Honorary Diplomas
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight">
            Diploma of Pointless Botanical Achievement
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Fill in your details below to generate an unaccredited, legally binding collegiate certificate.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCelebrate}
            className="px-3.5 py-2 text-xs font-semibold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Celebrate</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 text-xs font-bold text-stone-900 bg-emerald-400 hover:bg-emerald-300 rounded-lg shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save Diploma</span>
          </button>
        </div>
      </div>

      {/* Customization Inputs (Hidden in Print) */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4 print:hidden">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-stone-500">
          Certificate Customization
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-stone-600 mb-1">
              Recipient Name
            </label>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="w-full text-xs font-medium bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:outline-emerald-500"
              placeholder="Your Full Name"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-stone-600 mb-1">
              Roll No / Student ID
            </label>
            <input
              type="text"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="w-full text-xs font-mono bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:outline-emerald-500"
              placeholder="e.g. VAST-2026-CS"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-stone-600 mb-1">
              College Department
            </label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full text-xs font-medium bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:outline-emerald-500"
              placeholder="e.g. Mechanical Engineering"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-stone-600 mb-1">
            Degree Title / Accreditation
          </label>
          <select
            value={selectedDegree}
            onChange={(e) => setSelectedDegree(e.target.value)}
            className="w-full text-xs font-medium bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:outline-emerald-500"
          >
            <option value="Bachelor of Campus Flora Investigation (Honors in Petal Accounting)">
              Bachelor of Campus Flora Investigation (Honors in Petal Accounting)
            </option>
            <option value="Distinguished Observer of Unproductive Collegiate Botany">
              Distinguished Observer of Unproductive Collegiate Botany
            </option>
            <option value="Supreme Guardian of Unplucked Chembarathi & Bougainvillea">
              Supreme Guardian of Unplucked Chembarathi & Bougainvillea
            </option>
            <option value="Master of Bunking Classes to Catalog Canteen Marigolds">
              Master of Bunking Classes to Catalog Canteen Marigolds
            </option>
          </select>
        </div>
      </div>

      {/* The Printable Ornamental Diploma */}
      <div className="bg-[#fcfbf7] border-8 border-double border-stone-800 p-8 sm:p-14 rounded-2xl shadow-xl max-w-4xl mx-auto text-stone-900 relative overflow-hidden select-none print:m-0 print:border-4 print:shadow-none">
        {/* Subtle Watermark Flower */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
          <Award className="w-96 h-96" />
        </div>

        {/* Certificate Header */}
        <div className="text-center space-y-2 border-b-2 border-stone-300 pb-6">
          <div className="text-xs uppercase tracking-widest font-mono text-stone-500">
            The Officially Unofficial Council for Non-Essential Academic Pursuit
          </div>
          <div className="text-sm font-serif italic text-stone-600">
            Affiliated to the University of Procrastination & Canteen Chai
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-950 tracking-tight uppercase">
            {campusProfile.collegeName}
          </h2>
          <div className="text-[11px] font-mono text-stone-400">
            {campusProfile.location} · ESTD. {campusProfile.establishedYear}
          </div>
        </div>

        {/* Certificate Body */}
        <div className="text-center my-8 space-y-5">
          <p className="text-xs sm:text-sm uppercase tracking-widest text-stone-500 font-mono">
            This solemn diploma is conferred upon
          </p>

          <div className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-stone-900 tracking-tight underline decoration-emerald-600/40 decoration-2 underline-offset-8">
            {studentName || 'Distinguished Scholar'}
          </div>

          <div className="text-xs font-mono text-stone-500">
            ROLL NO: <span className="font-bold text-stone-800">{studentId || 'VAST-2026-00'}</span> · DEPT OF {department.toUpperCase()}
          </div>

          <p className="text-sm text-stone-700 max-w-xl mx-auto leading-relaxed pt-2">
            who, through relentless dedication, profound negligence of end-semester examinations, and sheer botanical curiosity,
            successfully participated in mathematically surveying the floral population of the campus, having verified:
          </p>

          <div className="inline-flex items-center gap-6 py-2 px-6 rounded-xl bg-stone-100/80 border border-stone-300 text-xs font-mono font-bold text-stone-800">
            <div>
              <span>CAMPUS FLOWERS: </span>
              <span className="text-emerald-700 font-bold">{totalFlowers.toLocaleString()}</span>
            </div>
            <span aria-hidden="true">·</span>
            <div>
              <span>PETALS AUDITED: </span>
              <span className="text-emerald-700 font-bold">{totalPetals.toLocaleString()}</span>
            </div>
          </div>

          <div className="pt-2">
            <p className="text-xs font-mono uppercase tracking-wider text-stone-500">
              And is hereby granted the title of:
            </p>
            <div className="mt-1 text-base sm:text-lg font-serif font-bold text-stone-900 italic max-w-lg mx-auto">
              "{selectedDegree}"
            </div>
          </div>
        </div>

        {/* Certificate Seal & Signatures */}
        <div className="mt-10 pt-6 border-t-2 border-stone-300 flex flex-col sm:flex-row items-center justify-between gap-6 text-center">
          {/* Signatory 1 */}
          <div className="space-y-1">
            <div className="text-sm font-serif italic font-bold text-stone-800 font-script border-b border-stone-400 pb-1 px-4">
              Prof. Bunkeshwar Varma
            </div>
            <div className="text-[10px] font-mono uppercase text-stone-500">
              Dean of Pointless Endeavors
            </div>
          </div>

          {/* Official Gold Seal Badge */}
          <div className="w-20 h-20 rounded-full border-4 border-amber-600/70 bg-gradient-to-tr from-amber-500 to-yellow-300 shadow-md flex flex-col items-center justify-center text-amber-950 p-1 shrink-0">
            <Shield className="w-5 h-5 text-amber-900 mb-0.5" />
            <span className="text-[8px] font-bold uppercase tracking-wider font-mono">
              OFFICIAL
            </span>
            <span className="text-[7px] font-mono">SEAL · 2026</span>
          </div>

          {/* Signatory 2 */}
          <div className="space-y-1">
            <div className="text-sm font-serif italic font-bold text-stone-800 font-script border-b border-stone-400 pb-1 px-4">
              Watchman Appukuttan Nair
            </div>
            <div className="text-[10px] font-mono uppercase text-stone-500">
              Chief Security Whistle Commissioner
            </div>
          </div>
        </div>

        {/* Verification Footer Hash */}
        <div className="mt-6 text-center text-[9px] font-mono text-stone-400">
          VERIFICATION HASH: 0xFL0WER_{Math.abs(studentName.length * 9942).toString(16).toUpperCase()}_VAST · NOT VALID FOR EMPLOYMENT ANYWHERE
        </div>
      </div>
    </div>
  );
};
