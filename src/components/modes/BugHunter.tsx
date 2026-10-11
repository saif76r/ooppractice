import React, { useState } from 'react';
import { Mission, UserProgress } from '../../types';
import confetti from 'canvas-confetti';
import { Bug, CheckCircle2, ChevronLeft, ShieldAlert } from 'lucide-react';

interface BugHunterProps {
  mission: Mission;
  progress: UserProgress;
  onSuccess: (missionId: string, levelId: number, xpReward: number) => void;
  onBackToMap: () => void;
}

export const BugHunter: React.FC<BugHunterProps> = ({
  mission,
  progress,
  onSuccess,
  onBackToMap,
}) => {
  const options = mission.bugHunterOptions || [];
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(
    progress.completedMissionIds.includes(mission.id)
  );
  const [feedback, setFeedback] = useState<{ isSuccess: boolean; text: string } | null>(null);

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setFeedback(null);
  };

  const handleVerify = () => {
    const chosen = options.find((o) => o.id === selectedId);
    if (!chosen) return;

    if (chosen.isActualBug) {
      setIsCompleted(true);
      setFeedback({
        isSuccess: true,
        text: `Bug neutralized! ${chosen.errorDesc} has been fixed with: ${chosen.fixedCode}`,
      });
      try {
        confetti({ particleCount: 70, spread: 60 });
      } catch {}
      onSuccess(mission.id, mission.levelId, mission.xpReward);
    } else {
      setFeedback({
        isSuccess: false,
        text: `Incorrect diagnosis. Line ${chosen.line} is functionally valid. Re-inspect memory and reference initialization.`,
      });
    }
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
              MISSION {mission.number} · BUG HUNTER
            </div>
            <h1 className="text-xl font-display font-bold text-white mt-0.5">
              {mission.title}
            </h1>
          </div>
        </div>

        <button
          onClick={handleVerify}
          disabled={!selectedId || isCompleted}
          className="px-4 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm shadow-indigo-900 disabled:opacity-50"
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Apply Patch</span>
        </button>
      </div>

      {/* Narrative */}
      <div className="p-4 bg-[#0b0e1b] border border-slate-800 rounded-lg mb-6 text-xs text-slate-300 space-y-2">
        <p className="leading-relaxed">{mission.instructions}</p>
        <p className="text-slate-400 italic">{mission.storyIntro}</p>
      </div>

      {/* Candidates */}
      <div className="space-y-3 mb-6">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
          Diagnostic Suspects
        </span>
        {options.map((opt) => {
          const isSelected = selectedId === opt.id;
          return (
            <div
              key={opt.id}
              onClick={() => handleSelect(opt.id)}
              className={`p-4 rounded-lg border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-slate-900/90 border-indigo-500 ring-1 ring-indigo-500/50'
                  : 'bg-[#080b14] border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-7 h-7 rounded flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    <Bug className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-mono text-slate-400">Line {opt.line}</span>
                    <h4 className="text-xs font-semibold text-slate-200 mt-0.5">
                      {opt.errorDesc}
                    </h4>
                  </div>
                </div>

                <div className="font-mono text-[11px] text-indigo-300 bg-slate-950 px-2 py-1 rounded border border-slate-900">
                  {opt.fixedCode}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Feedback banner */}
      {feedback && (
        <div
          className={`p-4 rounded-lg text-xs flex items-center gap-2.5 ${
            feedback.isSuccess
              ? 'bg-emerald-950/40 border border-emerald-800/80 text-emerald-300'
              : 'bg-red-950/40 border border-red-900/60 text-red-300'
          }`}
        >
          {feedback.isSuccess ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}
    </div>
  );
};
