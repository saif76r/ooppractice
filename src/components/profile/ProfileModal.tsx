import React, { useState } from 'react';
import { UserProgress } from '../../types';
import { CURRICULUM } from '../../content/curriculum';
import { X, User, Flame, Trophy, Award, Check, RotateCcw, Unlock } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: UserProgress;
  onUpdateProgress: (updated: UserProgress) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  progress,
  onUpdateProgress,
}) => {
  const [name, setName] = useState<string>(progress.displayName);

  if (!isOpen) return null;

  const handleSave = () => {
    onUpdateProgress({
      ...progress,
      displayName: name.trim() || 'Arcane Scholar',
    });
    onClose();
  };

  const handleUnlockAll = () => {
    const allIds = CURRICULUM.map((l) => l.id);
    onUpdateProgress({
      ...progress,
      unlockedLevelIds: allIds,
    });
    alert('All 13 levels unlocked for evaluation and testing!');
  };

  const handleReset = () => {
    if (confirm('Reset all progress back to Level 1 initial state?')) {
      onUpdateProgress({
        ...progress,
        currentXP: 0,
        level: 1,
        completedMissionIds: [],
        completedLevelIds: [],
        unlockedLevelIds: [1],
        achievements: [],
        campaignCheckpoint: {
          stage: 1,
          completedStages: [],
          dragonDefeated: false,
          bossHealthRemaining: 1500,
          savedCodeByStage: {},
        },
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#090c16] border border-slate-800 rounded-xl overflow-hidden shadow-2xl p-6 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-semibold text-white">Player Profile & Settings</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Name input */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-400">Display Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-2 text-xs text-white outline-none focus:border-indigo-500"
          />
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-slate-950 border border-slate-900 rounded-lg">
            <span className="text-slate-500 block">Current Rank</span>
            <span className="font-semibold text-white text-sm">Level {progress.level} Scholar</span>
          </div>
          <div className="p-3 bg-slate-950 border border-slate-900 rounded-lg">
            <span className="text-slate-500 block">Total Experience</span>
            <span className="font-semibold text-indigo-400 text-sm font-mono">{progress.currentXP} XP</span>
          </div>
        </div>

        {/* Testing & Evaluation Convenience Buttons */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">
            Evaluation & Testing Controls
          </span>
          <button
            onClick={handleUnlockAll}
            className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Unlock className="w-3.5 h-3.5 text-amber-400" />
            <span>Unlock All 13 Levels (Tester Mode)</span>
          </button>
          <button
            onClick={handleReset}
            className="w-full py-2 bg-red-950/40 hover:bg-red-950/70 border border-red-900/60 text-red-300 rounded text-xs font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Progress to Level 1</span>
          </button>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs text-slate-400 hover:text-white cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md text-xs font-medium cursor-pointer"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};
