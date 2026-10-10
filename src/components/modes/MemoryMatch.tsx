import React, { useState } from 'react';
import { Mission, UserProgress } from '../../types';
import confetti from 'canvas-confetti';
import { CheckCircle2, ChevronLeft, RotateCcw } from 'lucide-react';

interface MemoryMatchProps {
  mission: Mission;
  progress: UserProgress;
  onSuccess: (missionId: string, levelId: number, xpReward: number) => void;
  onBackToMap: () => void;
}

export const MemoryMatch: React.FC<MemoryMatchProps> = ({
  mission,
  progress,
  onSuccess,
  onBackToMap,
}) => {
  const pairs = mission.memoryPairs || [];
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(
    progress.completedMissionIds.includes(mission.id)
  );

  const handleSelectTerm = (id: string) => {
    setSelectedTerm(id);
    setErrorMessage(null);
    if (selectedMatch) {
      evaluatePair(id, selectedMatch);
    }
  };

  const handleSelectMatch = (id: string) => {
    setSelectedMatch(id);
    setErrorMessage(null);
    if (selectedTerm) {
      evaluatePair(selectedTerm, id);
    }
  };

  const evaluatePair = (termId: string, matchId: string) => {
    if (termId === matchId) {
      const nextMatched = [...matchedIds, termId];
      setMatchedIds(nextMatched);
      setSelectedTerm(null);
      setSelectedMatch(null);

      if (nextMatched.length === pairs.length) {
        setIsCompleted(true);
        try {
          confetti({ particleCount: 70, spread: 60 });
        } catch {}
        onSuccess(mission.id, mission.levelId, mission.xpReward);
      }
    } else {
      setErrorMessage('Mismatch! The selected concept does not map to that definition.');
      setTimeout(() => {
        setSelectedTerm(null);
        setSelectedMatch(null);
      }, 900);
    }
  };

  const handleReset = () => {
    setSelectedTerm(null);
    setSelectedMatch(null);
    setMatchedIds([]);
    setErrorMessage(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 md:px-8">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToMap}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-md transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="text-xs font-mono text-indigo-400">
              MISSION {mission.number} · MEMORY MATCH
            </div>
            <h1 className="text-xl font-display font-bold text-white mt-0.5">
              {mission.title}
            </h1>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Match</span>
        </button>
      </div>

      <div className="p-4 bg-[#0b0e1b] border border-slate-800 rounded-lg mb-6 text-xs text-slate-300">
        <p className="leading-relaxed">{mission.instructions}</p>
      </div>

      {/* Grid Split: Terms on Left, Matches on Right */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Terms Column */}
        <div className="space-y-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            OOP Concepts ({matchedIds.length}/{pairs.length})
          </span>
          {pairs.map((p) => {
            const isMatched = matchedIds.includes(p.id);
            const isSelected = selectedTerm === p.id;
            return (
              <div
                key={p.id}
                onClick={() => !isMatched && handleSelectTerm(p.id)}
                className={`p-3.5 rounded-lg border font-mono text-xs transition-all cursor-pointer ${
                  isMatched
                    ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-300 line-through opacity-70'
                    : isSelected
                    ? 'bg-indigo-950/60 border-indigo-500 text-indigo-200 ring-1 ring-indigo-500/50'
                    : 'bg-[#080b14] border-slate-800 text-slate-200 hover:border-slate-700'
                }`}
              >
                {p.term}
              </div>
            );
          })}
        </div>

        {/* Matches Column (shuffled) */}
        <div className="space-y-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Definitions & Scopes
          </span>
          {pairs.map((p) => {
            const isMatched = matchedIds.includes(p.id);
            const isSelected = selectedMatch === p.id;
            return (
              <div
                key={p.id}
                onClick={() => !isMatched && handleSelectMatch(p.id)}
                className={`p-3.5 rounded-lg border text-xs leading-relaxed transition-all cursor-pointer ${
                  isMatched
                    ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-300 line-through opacity-70'
                    : isSelected
                    ? 'bg-indigo-950/60 border-indigo-500 text-indigo-200 ring-1 ring-indigo-500/50'
                    : 'bg-[#080b14] border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                {p.match}
              </div>
            );
          })}
        </div>
      </div>

      {/* Error or Success notification */}
      {errorMessage && (
        <div className="p-3 bg-red-950/40 border border-red-900/60 rounded-lg text-xs text-red-300 mb-4">
          {errorMessage}
        </div>
      )}

      {isCompleted && (
        <div className="p-4 bg-emerald-950/40 border border-emerald-800/80 rounded-lg text-xs text-emerald-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>All conceptual pairs matched! XP granted.</span>
          </div>
          <span className="font-mono font-semibold text-emerald-300">+{mission.xpReward} XP</span>
        </div>
      )}
    </div>
  );
};
