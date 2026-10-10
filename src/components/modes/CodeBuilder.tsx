import React, { useState } from 'react';
import { Mission, UserProgress } from '../../types';
import confetti from 'canvas-confetti';
import { ArrowUp, ArrowDown, CheckCircle2, RotateCcw, ChevronLeft, Sparkles } from 'lucide-react';

interface CodeBuilderProps {
  mission: Mission;
  progress: UserProgress;
  onSuccess: (missionId: string, levelId: number, xpReward: number) => void;
  onBackToMap: () => void;
}

export const CodeBuilder: React.FC<CodeBuilderProps> = ({
  mission,
  progress,
  onSuccess,
  onBackToMap,
}) => {
  const initialBlocks = (mission.codeBuilderBlocks || []).map((b) => ({ ...b }));
  // Shuffle initially
  const [blocks, setBlocks] = useState(
    [...initialBlocks].sort(() => Math.random() - 0.5)
  );
  const [isCompleted, setIsCompleted] = useState<boolean>(
    progress.completedMissionIds.includes(mission.id)
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const moveUp = (index: number) => {
    if (index === 0) return;
    const copy = [...blocks];
    const temp = copy[index];
    copy[index] = copy[index - 1];
    copy[index - 1] = temp;
    setBlocks(copy);
    setErrorMessage(null);
  };

  const moveDown = (index: number) => {
    if (index === blocks.length - 1) return;
    const copy = [...blocks];
    const temp = copy[index];
    copy[index] = copy[index + 1];
    copy[index + 1] = temp;
    setBlocks(copy);
    setErrorMessage(null);
  };

  const handleVerify = () => {
    // Check if blocks match correctOrder 1..N
    let valid = true;
    for (let i = 0; i < blocks.length; i++) {
      if (blocks[i].correctOrder !== i + 1) {
        valid = false;
        break;
      }
    }

    if (valid) {
      setIsCompleted(true);
      setErrorMessage(null);
      try {
        confetti({ particleCount: 70, spread: 60 });
      } catch {}
      onSuccess(mission.id, mission.levelId, mission.xpReward);
    } else {
      setErrorMessage('The sequence is invalid. Check class enclosure, main method scope, and execution statements.');
    }
  };

  const handleReset = () => {
    setBlocks([...initialBlocks].sort(() => Math.random() - 0.5));
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
              MISSION {mission.number} · CODE BUILDER
            </div>
            <h1 className="text-xl font-display font-bold text-white mt-0.5">
              {mission.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Shuffle</span>
          </button>
          <button
            onClick={handleVerify}
            disabled={isCompleted}
            className="px-4 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm shadow-indigo-900 disabled:opacity-50"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Verify Sequence</span>
          </button>
        </div>
      </div>

      {/* Story & Instructions */}
      <div className="p-4 bg-[#0b0e1b] border border-slate-800 rounded-lg mb-6 text-xs text-slate-300 space-y-2">
        <p className="leading-relaxed">{mission.instructions}</p>
        <p className="text-slate-400 italic">{mission.storyIntro}</p>
      </div>

      {/* Code Blocks list */}
      <div className="space-y-2.5 mb-6">
        {blocks.map((block, idx) => (
          <div
            key={block.id}
            className="flex items-center justify-between p-3 bg-[#080b14] border border-slate-800/90 rounded-lg font-mono text-xs text-slate-200 hover:border-slate-700 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-slate-600 select-none w-5 text-right font-mono text-[11px]">
                {idx + 1}
              </span>
              <pre className="text-slate-100 whitespace-pre">{block.code}</pre>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => moveUp(idx)}
                disabled={idx === 0}
                className="p-1 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded transition-colors disabled:opacity-20 cursor-pointer"
                title="Move Up"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => moveDown(idx)}
                disabled={idx === blocks.length - 1}
                className="p-1 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded transition-colors disabled:opacity-20 cursor-pointer"
                title="Move Down"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
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
            <div>
              <span className="font-semibold block">Rune Sequence Perfectly Assembled!</span>
              <span className="text-emerald-400/80 text-[11px]">{mission.explanation}</span>
            </div>
          </div>
          <span className="font-mono font-semibold text-emerald-300">+{mission.xpReward} XP</span>
        </div>
      )}
    </div>
  );
};
