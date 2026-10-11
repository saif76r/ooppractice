import React, { useState } from 'react';
import { Mission, UserProgress } from '../../types';
import confetti from 'canvas-confetti';
import { CheckCircle2, ChevronLeft, Lock, Unlock, ShieldAlert, ArrowRight } from 'lucide-react';

interface DungeonEscapeProps {
  mission: Mission;
  progress: UserProgress;
  onSuccess: (missionId: string, levelId: number, xpReward: number) => void;
  onBackToMap: () => void;
}

export const DungeonEscape: React.FC<DungeonEscapeProps> = ({
  mission,
  progress,
  onSuccess,
  onBackToMap,
}) => {
  const rooms = mission.dungeonRooms || [];
  const [currentRoomIdx, setCurrentRoomIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ isSuccess: boolean; text: string } | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(
    progress.completedMissionIds.includes(mission.id)
  );

  const activeRoom = rooms[currentRoomIdx];

  const handleUnlockRoom = () => {
    if (selectedOption === null || !activeRoom) return;

    if (selectedOption === activeRoom.answerIndex) {
      if (currentRoomIdx < rooms.length - 1) {
        setFeedback({
          isSuccess: true,
          text: `Chamber unlocked! Advancing to the next chamber...`,
        });
        setTimeout(() => {
          setCurrentRoomIdx((prev) => prev + 1);
          setSelectedOption(null);
          setFeedback(null);
        }, 1000);
      } else {
        setIsCompleted(true);
        setFeedback({
          isSuccess: true,
          text: `All chambers cleared! The dungeon doors burst open.`,
        });
        try {
          confetti({ particleCount: 80, spread: 70 });
        } catch {}
        onSuccess(mission.id, mission.levelId, mission.xpReward);
      }
    } else {
      setFeedback({
        isSuccess: false,
        text: 'The chamber wards reject that answer. Consider the memory rules of the JVM.',
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
              MISSION {mission.number} · DUNGEON ESCAPE
            </div>
            <h1 className="text-xl font-display font-bold text-white mt-0.5">
              {mission.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400">
            Chamber {currentRoomIdx + 1}/{rooms.length}
          </span>
          <button
            onClick={handleUnlockRoom}
            disabled={selectedOption === null || isCompleted}
            className="px-4 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm shadow-indigo-900 disabled:opacity-50"
          >
            <Unlock className="w-3.5 h-3.5" />
            <span>Unlock Ward</span>
          </button>
        </div>
      </div>

      {/* Narrative */}
      <div className="p-4 bg-[#0b0e1b] border border-slate-800 rounded-lg mb-6 text-xs text-slate-300">
        <p className="leading-relaxed">{mission.storyIntro}</p>
      </div>

      {/* Chamber Puzzle Box */}
      {activeRoom && (
        <div className="p-6 bg-[#080b14] border border-slate-800 rounded-xl mb-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-display font-semibold text-indigo-400 uppercase tracking-wider">
              {activeRoom.title}
            </span>
            <Lock className="w-4 h-4 text-slate-600" />
          </div>

          <p className="text-sm font-medium text-slate-100 leading-relaxed">
            {activeRoom.puzzle}
          </p>

          {/* Options */}
          <div className="space-y-2.5 pt-2">
            {activeRoom.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              return (
                <div
                  key={idx}
                  onClick={() => {
                    setSelectedOption(idx);
                    setFeedback(null);
                  }}
                  className={`p-3.5 rounded-lg border text-xs transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-slate-900 border-indigo-500 text-indigo-300 ring-1 ring-indigo-500/50'
                      : 'bg-[#05070d] border-slate-800/80 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span>{opt}</span>
                  <span className="text-slate-600 font-mono text-[11px]">[{idx + 1}]</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Feedback banner */}
      {feedback && (
        <div
          className={`p-4 rounded-lg text-xs flex items-center gap-2.5 mb-4 ${
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
