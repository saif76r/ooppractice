import React, { useState } from 'react';
import { Mission, UserProgress } from '../../types';
import confetti from 'canvas-confetti';
import { HelpCircle, CheckCircle2, ChevronLeft, ShieldAlert, Sparkles } from 'lucide-react';

interface PredictOutputProps {
  mission: Mission;
  progress: UserProgress;
  onSuccess: (missionId: string, levelId: number, xpReward: number) => void;
  onBackToMap: () => void;
}

export const PredictOutput: React.FC<PredictOutputProps> = ({
  mission,
  progress,
  onSuccess,
  onBackToMap,
}) => {
  const options = mission.predictOptions || [];
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(
    progress.completedMissionIds.includes(mission.id)
  );
  const [feedback, setFeedback] = useState<{ isSuccess: boolean; text: string } | null>(null);

  const handleVerify = () => {
    if (selectedIdx === null) return;
    const chosen = options[selectedIdx];

    if (chosen.isCorrect) {
      setIsCompleted(true);
      setFeedback({
        isSuccess: true,
        text: `Accurate prediction! ${mission.explanation}`,
      });
      try {
        confetti({ particleCount: 70, spread: 60 });
      } catch {}
      onSuccess(mission.id, mission.levelId, mission.xpReward);
    } else {
      setFeedback({
        isSuccess: false,
        text: mission.hints?.[0] || 'Incorrect prediction. Trace the Java execution flow carefully!',
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
              MISSION {mission.number} · PREDICT THE OUTPUT
            </div>
            <h1 className="text-xl font-display font-bold text-white mt-0.5">
              {mission.title}
            </h1>
          </div>
        </div>

        <button
          onClick={handleVerify}
          disabled={selectedIdx === null || isCompleted}
          className="px-4 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm shadow-indigo-900 disabled:opacity-50"
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Confirm Output</span>
        </button>
      </div>

      {/* Narrative */}
      <div className="p-4 bg-[#0b0e1b] border border-slate-800 rounded-lg mb-6 text-xs text-slate-300 space-y-2">
        <p className="leading-relaxed">{mission.instructions}</p>
        <p className="text-slate-400 italic">{mission.storyIntro}</p>
      </div>

      {/* Code Snippet Box */}
      <div className="mb-6 p-4 bg-[#080b14] border border-slate-800 rounded-lg font-mono text-xs text-slate-100">
        <div className="text-slate-500 text-[11px] mb-2 font-mono">// Code under execution</div>
        <pre className="whitespace-pre leading-5 text-slate-200">
          {mission.starterCode || mission.instructions}
        </pre>
      </div>

      {/* Prediction Choices */}
      <div className="space-y-3 mb-6">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
          Select Expected Console Output:
        </span>
        {options.map((opt, idx) => {
          const isSelected = selectedIdx === idx;
          return (
            <div
              key={idx}
              onClick={() => {
                setSelectedIdx(idx);
                setFeedback(null);
              }}
              className={`p-3.5 rounded-lg border font-mono text-xs transition-all cursor-pointer flex items-center justify-between ${
                isSelected
                  ? 'bg-slate-900 border-indigo-500 text-indigo-300 ring-1 ring-indigo-500/50'
                  : 'bg-[#080b14] border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <span>{opt.text}</span>
              <span className="text-slate-600 font-sans text-xs">Option {idx + 1}</span>
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
