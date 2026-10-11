import React, { useState } from 'react';
import { Level, UserProgress } from '../../types';
import { CURRICULUM } from '../../content/curriculum';
import { 
  Lock, CheckCircle2, Play
} from 'lucide-react';

interface AdventureMapProps {
  progress: UserProgress;
  onSelectLevel: (level: Level) => void;
  onSelectMission: (level: Level, missionId: string) => void;
}

export const AdventureMap: React.FC<AdventureMapProps> = ({
  progress,
  onSelectLevel,
  onSelectMission,
}) => {
  const [selectedLevel, setSelectedLevel] = useState<Level>(CURRICULUM[0]);

  const getStatus = (level: Level) => {
    const isUnlocked = progress.unlockedLevelIds.includes(level.id);
    const isCompleted = progress.completedLevelIds.includes(level.id);
    const completedCount = level.missions.filter((m) => progress.completedMissionIds.includes(m.id)).length;
    const inProgress = isUnlocked && !isCompleted && completedCount > 0;

    if (isCompleted) return 'COMPLETED';
    if (inProgress) return 'IN_PROGRESS';
    if (isUnlocked) return 'AVAILABLE';
    return 'LOCKED';
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-4 md:px-8">
      {/* Map Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-medium text-indigo-400 mb-1">
          <span>THE GRAND CONTINENT OF OLYMPIA</span>
          <span>·</span>
          <span>{CURRICULUM.length} REALMS & MASTERY ARENAS</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-white tracking-tight">
          Adventure Map
        </h1>
        <p className="text-sm text-slate-400 mt-1 max-w-2xl">
          Traverse the {CURRICULUM.length} sacred territories of Object-Oriented Java, featuring dedicated 10-challenge Mastery Arenas for Constructor Overloading, Method Overloading, Method Overriding, Aggregation, and Composition.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: The 18 Realm Node Journey Grid */}
        <div className="lg:col-span-7 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {CURRICULUM.map((level) => {
              const status = getStatus(level);
              const isSelected = selectedLevel.id === level.id;
              const isLevel13 = level.id === 18;
              const completedCount = level.missions.filter((m) =>
                progress.completedMissionIds.includes(m.id)
              ).length;
              const totalMissions = level.missions.length;

              return (
                <button
                  key={level.id}
                  onClick={() => setSelectedLevel(level)}
                  className={`text-left p-4 rounded-lg border transition-all cursor-pointer relative overflow-hidden ${
                    isSelected
                      ? 'border-indigo-500 bg-slate-900/90 ring-1 ring-indigo-500/50 shadow-lg shadow-indigo-950/40'
                      : 'border-slate-800 bg-[#0b0e1b]/70 hover:border-slate-700 hover:bg-[#0f1426]'
                  } ${status === 'LOCKED' ? 'opacity-65' : 'opacity-100'} ${
                    isLevel13 ? 'sm:col-span-2 border-amber-600/40 bg-gradient-to-r from-[#120e29] to-[#1a1236]' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-mono text-slate-500">
                          {level.id < 10 ? `0${level.id}` : level.id}.
                        </span>
                        <span className="text-slate-400 font-medium">{level.realmName}</span>
                      </div>
                      <h3 className="font-semibold text-slate-100 text-sm mt-0.5">
                        {level.title}
                      </h3>
                    </div>

                    {/* Status marker */}
                    <div className="text-right shrink-0">
                      {status === 'COMPLETED' ? (
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Done
                        </span>
                      ) : status === 'LOCKED' ? (
                        <span className="text-xs text-slate-500">Locked</span>
                      ) : (
                        <span className="text-xs font-mono text-indigo-400">
                          {completedCount}/{totalMissions}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Progress bar inside node */}
                  <div className="w-full bg-slate-950 rounded-full h-1 mt-3 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        status === 'COMPLETED'
                          ? 'bg-emerald-500'
                          : isLevel13
                          ? 'bg-amber-500'
                          : 'bg-indigo-500'
                      }`}
                      style={{
                        width: `${status === 'COMPLETED' ? 100 : Math.round((completedCount / (totalMissions || 1)) * 100)}%`,
                      }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Realm Detail Panel */}
        <div className="lg:col-span-5 bg-[#0b0e1b]/65 backdrop-blur-md border border-slate-800/80 rounded-xl p-6 sticky top-20 shadow-xl">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2 text-xs font-mono text-indigo-400">
              <span>LEVEL {selectedLevel.id < 10 ? `0${selectedLevel.id}` : selectedLevel.id}</span>
              <span>·</span>
              <span>{selectedLevel.totalXP} TOTAL XP</span>
            </div>

            <span
              className={`text-xs px-2.5 py-0.5 rounded font-medium ${
                getStatus(selectedLevel) === 'COMPLETED'
                  ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                  : getStatus(selectedLevel) === 'AVAILABLE'
                  ? 'bg-blue-950/80 text-blue-300 border border-blue-800'
                  : getStatus(selectedLevel) === 'IN_PROGRESS'
                  ? 'bg-indigo-950/80 text-indigo-300 border border-indigo-800'
                  : 'bg-slate-900 text-slate-400 border border-slate-800'
              }`}
            >
              {getStatus(selectedLevel)}
            </span>
          </div>

          <h2 className="text-xl font-display font-bold text-white mb-1">
            {selectedLevel.title}
          </h2>
          <p className="text-xs text-indigo-300/80 font-medium mb-3">
            {selectedLevel.subtitle}
          </p>

          <p className="text-xs text-slate-300 leading-relaxed mb-4">
            {selectedLevel.story}
          </p>

          {/* Core Topics Checklist */}
          <div className="mb-5 bg-slate-950/60 p-3.5 rounded-lg border border-slate-900">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Architectural Topics
            </span>
            <div className="space-y-1.5">
              {selectedLevel.topics.map((t, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Missions List */}
          <div className="mb-6">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Level Missions ({selectedLevel.missions.length})
            </span>
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {selectedLevel.missions.map((m) => {
                const isDone = progress.completedMissionIds.includes(m.id);
                return (
                  <div
                    key={m.id}
                    onClick={() => onSelectMission(selectedLevel, m.id)}
                    className="flex items-center justify-between p-2.5 rounded-md bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 hover:bg-slate-800/50 transition-colors cursor-pointer text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <span className="w-4 h-4 rounded-full border border-slate-700 flex items-center justify-center text-[10px] text-slate-400 font-mono">
                          {m.number}
                        </span>
                      )}
                      <div>
                        <span className="font-medium text-slate-200 block">{m.title}</span>
                        <span className="text-slate-500 text-[11px] capitalize">{m.mode.replace('_', ' ')}</span>
                      </div>
                    </div>
                    <span className="font-mono text-indigo-400 tabular-nums">+{m.xpReward} XP</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action CTA */}
          <div className="pt-2">
            {getStatus(selectedLevel) === 'LOCKED' ? (
              <div className="p-3 bg-red-950/30 border border-red-900/50 rounded-lg text-xs text-red-300 flex items-center gap-2">
                <Lock className="w-4 h-4 text-red-400 shrink-0" />
                <span>
                  Prerequisite incomplete: Clear Level {selectedLevel.id - 1} to unlock this realm.
                </span>
              </div>
            ) : (
              <button
                onClick={() => onSelectLevel(selectedLevel)}
                className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-950"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Enter {selectedLevel.title}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
