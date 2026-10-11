import React, { useState } from 'react';
import { UserProgress } from '../../types';
import { ACHIEVEMENTS } from '../../content/achievements';
import { 
  Trophy, Sparkles, Hammer, Shield, Crown, Swords, 
  Scroll, Zap, Boxes, Award, Flame, CheckCircle2, Lock
} from 'lucide-react';

interface AchievementsViewProps {
  progress: UserProgress;
}

export const AchievementsView: React.FC<AchievementsViewProps> = ({ progress }) => {
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-indigo-400" />;
      case 'Hammer': return <Hammer className="w-5 h-5 text-amber-400" />;
      case 'Shield': return <Shield className="w-5 h-5 text-blue-400" />;
      case 'Crown': return <Crown className="w-5 h-5 text-amber-300" />;
      case 'Swords': return <Swords className="w-5 h-5 text-red-400" />;
      case 'Scroll': return <Scroll className="w-5 h-5 text-purple-400" />;
      case 'Zap': return <Zap className="w-5 h-5 text-yellow-400" />;
      case 'Boxes': return <Boxes className="w-5 h-5 text-cyan-400" />;
      case 'Award': return <Award className="w-5 h-5 text-emerald-400" />;
      case 'Trophy': return <Trophy className="w-5 h-5 text-amber-400" />;
      case 'Flame': return <Flame className="w-5 h-5 text-orange-400" />;
      default: return <CheckCircle2 className="w-5 h-5 text-indigo-400" />;
    }
  };

  const filteredAchievements = ACHIEVEMENTS.filter((a) => {
    const isUnlocked = progress.achievements.includes(a.id);
    if (filter === 'unlocked') return isUnlocked;
    if (filter === 'locked') return !isUnlocked;
    return true;
  });

  const unlockedCount = ACHIEVEMENTS.filter((a) => progress.achievements.includes(a.id)).length;

  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-4 md:px-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 mb-1">
            <span>HALL OF TRIUMPHS</span>
            <span>·</span>
            <span>{unlockedCount}/{ACHIEVEMENTS.length} UNLOCKED</span>
          </div>
          <h1 className="text-2xl font-display font-bold text-white">
            Grandmaster Achievements
          </h1>
        </div>

        {/* Filter Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              filter === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            All ({ACHIEVEMENTS.length})
          </button>
          <button
            onClick={() => setFilter('unlocked')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              filter === 'unlocked' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Unlocked ({unlockedCount})
          </button>
          <button
            onClick={() => setFilter('locked')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              filter === 'locked' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Locked ({ACHIEVEMENTS.length - unlockedCount})
          </button>
        </div>
      </div>

      {/* Grid of Achievement Badges */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAchievements.map((ach) => {
          const isUnlocked = progress.achievements.includes(ach.id);
          return (
            <div
              key={ach.id}
              className={`p-4 rounded-xl border transition-all ${
                isUnlocked
                  ? 'bg-[#0b0e1b] border-indigo-900/60 shadow-md shadow-indigo-950/20'
                  : 'bg-[#070913] border-slate-900 opacity-60'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 border ${
                    isUnlocked
                      ? 'bg-slate-900 border-indigo-500/40'
                      : 'bg-slate-950 border-slate-800 text-slate-600'
                  }`}
                >
                  {isUnlocked ? getIcon(ach.icon) : <Lock className="w-4 h-4 text-slate-600" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-semibold text-white truncate">
                      {ach.title}
                    </h4>
                    <span className="font-mono text-xs text-amber-400 shrink-0">
                      +{ach.xpBonus} XP
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {ach.description}
                  </p>

                  <div className="mt-2.5 flex items-center gap-2 text-[11px]">
                    <span className="text-slate-500 capitalize">{ach.category}</span>
                    <span className="text-slate-700">·</span>
                    <span className={isUnlocked ? 'text-emerald-400 font-medium' : 'text-slate-600'}>
                      {isUnlocked ? 'Unlocked' : 'Locked'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
