import React, { useState } from 'react';
import { X, Download, Upload, Copy, RotateCcw, Check, School, Building2 } from 'lucide-react';
import { CampusProfile, FlowerSpecimen, CampusZone } from '../types';

interface CollegeSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  campusProfile: CampusProfile;
  onUpdateCampusProfile: (profile: CampusProfile) => void;
  specimens: FlowerSpecimen[];
  zones: CampusZone[];
  onImportSpecimens: (specimens: FlowerSpecimen[]) => void;
  onResetDefaults: () => void;
}

export const CollegeSettingsModal: React.FC<CollegeSettingsModalProps> = ({
  isOpen,
  onClose,
  campusProfile,
  onUpdateCampusProfile,
  specimens,
  zones,
  onImportSpecimens,
  onResetDefaults,
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState(campusProfile.collegeName);
  const [shortCode, setShortCode] = useState(campusProfile.shortCode);
  const [location, setLocation] = useState(campusProfile.location);
  const [studentBodyCount, setStudentBodyCount] = useState(campusProfile.studentBodyCount);
  const [copied, setCopied] = useState(false);

  const totalFlowers = specimens.reduce((sum, s) => sum + s.count, 0);
  const totalPetals = specimens.reduce((sum, s) => sum + s.totalPetals, 0);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateCampusProfile({
      ...campusProfile,
      collegeName: name.trim() || 'Engineering College',
      shortCode: shortCode.trim() || 'COLLEGE',
      location: location.trim() || 'Campus Grounds',
      studentBodyCount: Math.max(10, studentBodyCount),
    });
    onClose();
  };

  const handleExportJSON = () => {
    const data = {
      campusProfile,
      specimens,
      zones,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${campusProfile.shortCode}_campus_flower_census_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed.specimens)) {
          onImportSpecimens(parsed.specimens);
          if (parsed.campusProfile) {
            onUpdateCampusProfile(parsed.campusProfile);
          }
          alert('Successfully imported flower census records!');
          onClose();
        } else if (Array.isArray(parsed)) {
          onImportSpecimens(parsed);
          alert('Successfully imported flower specimens!');
          onClose();
        }
      } catch (err) {
        alert('Invalid JSON file format.');
      }
    };
    reader.readAsText(file);
  };

  const handleCopyWhatsAppBulletin = () => {
    const text = `🌸 *${campusProfile.shortCode} OFFICIAL CAMPUS FLOWER CENSUS BULLETIN* 🌸\n` +
      `------------------------------------------\n` +
      `College: ${campusProfile.collegeName}\n` +
      `Total Audited Flowers: *${totalFlowers.toLocaleString()}*\n` +
      `Total Petals Calculated: *${totalPetals.toLocaleString()}*\n` +
      `Flowers Per Student: *${(totalFlowers / campusProfile.studentBodyCount).toFixed(3)}*\n` +
      `Current Status: All students are strongly advised to stop studying for internals and count hibiscus near the workshop.\n` +
      `------------------------------------------\n` +
      `Verified by the Chief Petal Auditor 🌺`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-stone-200 shadow-2xl overflow-hidden my-6">
        <div className="px-6 py-4 bg-stone-900 text-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <School className="w-5 h-5 text-emerald-400" />
            <h2 className="font-serif font-bold text-base text-stone-100">
              Campus Profile & Census Settings
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Edit Campus Details */}
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              College Campus Identity
            </h3>

            <div>
              <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                College Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs font-medium bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:outline-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                  Acronym / Code
                </label>
                <input
                  type="text"
                  required
                  value={shortCode}
                  onChange={(e) => setShortCode(e.target.value)}
                  className="w-full text-xs font-mono font-bold bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:outline-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                  Student Count
                </label>
                <input
                  type="number"
                  min={10}
                  value={studentBodyCount}
                  onChange={(e) => setStudentBodyCount(parseInt(e.target.value) || 1000)}
                  className="w-full text-xs font-mono bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:outline-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                Campus Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full text-xs bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:outline-emerald-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 text-xs font-bold text-stone-900 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors cursor-pointer"
            >
              Update Campus Profile
            </button>
          </form>

          {/* Social Share & Broadcast */}
          <div className="pt-4 border-t border-stone-200 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Broadcast to Class Groups
            </h3>
            <p className="text-xs text-stone-500">
              Generate a formatted census report summary ready to paste into your college WhatsApp class groups:
            </p>
            <button
              type="button"
              onClick={handleCopyWhatsAppBulletin}
              className="w-full py-2 px-3 rounded-lg border border-stone-300 hover:border-emerald-500 hover:bg-emerald-50/50 text-stone-800 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-stone-500" />
                  <span>Copy WhatsApp Census Bulletin</span>
                </>
              )}
            </button>
          </div>

          {/* Export & Import Data */}
          <div className="pt-4 border-t border-stone-200 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Data Management
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleExportJSON}
                className="py-2 px-3 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export JSON</span>
              </button>

              <label className="py-2 px-3 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-center">
                <Upload className="w-3.5 h-3.5" />
                <span>Import JSON</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportJSON}
                  className="hidden"
                />
              </label>
            </div>

            <button
              type="button"
              onClick={() => {
                if (confirm('Reset all flower census data back to initial campus presets?')) {
                  onResetDefaults();
                  onClose();
                }
              }}
              className="w-full py-2 px-3 rounded-lg text-rose-600 hover:bg-rose-50 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Default Campus Data</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
