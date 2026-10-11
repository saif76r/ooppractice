import React from 'react';
import { UserProgress, Level } from '../../types';
import { CURRICULUM } from '../../content/curriculum';
import { ACHIEVEMENTS } from '../../content/achievements';
import bgVideoUrl from '../../video/video.mp4';
import heroBgUrl from '../../assets/images/hero_fantasy_realm_1791652001782.jpg';
import avatarImgUrl from '../../assets/images/avatar_code_mage_1791652048175.jpg';
import { 
  Play, Flame, Trophy, Map, Terminal, 
  ChevronRight, Crown, CheckCircle2, Lock
} from 'lucide-react';

interface DashboardProps {
  progress: UserProgress;
  onNavigateToMap: () => void;
  onNavigateToArena: () => void;
  onNavigateToCampaign: () => void;
  onNavigateToAchievements: () => void;
  onSelectLevel: (level: Level) => void;
  onOpenProfile: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  progress,
  onNavigateToMap,
  onNavigateToArena,
  onNavigateToCampaign,
  onNavigateToAchievements,
  onSelectLevel,
  onOpenProfile,
}) => {
  // Find current in-progress or next available level
  const nextLevel = CURRICULUM.find(
    (l) => progress.unlockedLevelIds.includes(l.id) && !progress.completedLevelIds.includes(l.id)
  ) || CURRICULUM[0];

  const completedLevelCount = progress.completedLevelIds.length;
  const completedMissionsCount = progress.completedMissionIds.length;
  const recentAchievements = ACHIEVEMENTS.filter((a) => progress.achievements.includes(a.id)).slice(0, 3);

  // XP to next level
  const currentLvl = progress.level;
  const xpCurrent = progress.currentXP;
  const nextLvlXpTarget = Math.pow(currentLvl, 2) * 100;
  const prevLvlXpTarget = Math.pow(currentLvl - 1, 2) * 100;
  const xpInLevel = Math.max(0, xpCurrent - prevLvlXpTarget);
  const xpNeededInLevel = Math.max(100, nextLvlXpTarget - prevLvlXpTarget);
  const progressPercent = Math.min(100, Math.round((xpInLevel / xpNeededInLevel) * 100));

  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-4 md:px-8 space-y-8">
      {/* Hero Welcome Banner */}
      <div className="relative rounded-2xl border border-slate-700/70 bg-[#090c16]/45 backdrop-blur-xs overflow-hidden shadow-2xl">
        <div className="absolute inset-0 z-0">
          <video
            src={bgVideoUrl}
            poster={heroBgUrl}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#070913]/75 via-[#070913]/40 to-transparent" />
        </div>

        <div className="relative z-10 p-6 md:p-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-8 space-y-4">
            <h1 className="text-2xl md:text-4xl font-display font-extrabold text-white tracking-tight leading-tight">
              Master Java OOP Through an Epic Fantasy Quest
            </h1>

            <p className="text-xs md:text-sm text-slate-200 max-w-2xl leading-relaxed">
              Step into Olympia where encapsulation shields your heroes, polymorphism commands diverse combatants, and collections preserve infinite inventories. Write real Java code to unlock all {CURRICULUM.length} realms.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onSelectLevel(nextLevel)}
                className="py-2.5 px-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium text-xs md:text-sm transition-colors flex items-center gap-2 cursor-pointer shadow-lg shadow-indigo-950"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Continue: Level {nextLevel.id} — {nextLevel.title}</span>
              </button>

              <button
                onClick={onNavigateToMap}
                className="py-2.5 px-4 bg-slate-900/65 hover:bg-slate-800/80 backdrop-blur-sm border border-slate-700/80 text-slate-200 rounded-lg font-medium text-xs md:text-sm transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Map className="w-4 h-4 text-indigo-400" />
                <span>Explore All {CURRICULUM.length} Realms</span>
              </button>
            </div>
          </div>

          {/* Player Quick Profile Card */}
          <div className="md:col-span-4 bg-[#0b0e1b]/60 backdrop-blur-md border border-slate-700/70 p-5 rounded-xl space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-indigo-500/60 shrink-0">
                <img
                  src={avatarImgUrl}
                  alt="Player Avatar"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white truncate">
                    {progress.displayName}
                  </h3>
                  <button
                    onClick={onOpenProfile}
                    className="text-[11px] text-indigo-400 hover:underline cursor-pointer"
                  >
                    Edit
                  </button>
                </div>
                <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                  <span className="font-semibold text-indigo-300">Level {progress.level} Scholar</span>
                  <span>·</span>
                  <span className="flex items-center gap-1 text-amber-400">
                    <Flame className="w-3 h-3 fill-current" />
                    <span>{progress.streakDays}d Streak</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Level XP Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">XP Progress</span>
                <span className="text-indigo-300 tabular-nums font-semibold">
                  {progress.currentXP} XP
                </span>
              </div>
              <div className="w-full bg-slate-950/70 rounded-full h-2 overflow-hidden border border-slate-800/80">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Primary Navigation Card Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {/* Card 1: Adventure Map & Practice Arena */}
        <div
          onClick={onNavigateToMap}
          className="group bg-[#0b0e1b]/60 backdrop-blur-md border border-slate-800/80 hover:border-indigo-500/70 rounded-xl p-6 flex flex-col justify-between transition-all cursor-pointer shadow-lg hover:shadow-indigo-950/30"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-medium text-indigo-400 flex items-center gap-1.5">
                <Map className="w-4 h-4" />
                ADVENTURE MAP & PRACTICE
              </span>
              <span className="text-xs font-mono text-slate-300">
                {completedLevelCount}/{CURRICULUM.length} Realms
              </span>
            </div>

            <div>
              <h2 className="text-xl font-display font-bold text-white group-hover:text-indigo-300 transition-colors">
                Adventure Map
              </h2>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                Explore all {CURRICULUM.length} Java OOP levels, view mission challenges, and practice writing live Java code in the interactive Coding Arena.
              </p>
            </div>

            {/* Quick Level Preview List */}
            <div className="p-3 bg-slate-950/55 border border-slate-800/70 rounded-lg space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>ACTIVE LEVEL</span>
                <span className="text-indigo-400">{completedMissionsCount} Missions Done</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-200 truncate">
                  {nextLevel.id < 10 ? `0${nextLevel.id}` : nextLevel.id}. {nextLevel.title}
                </span>
                <span className="text-indigo-400 font-mono text-[11px] shrink-0">+{nextLevel.totalXP} XP</span>
              </div>
            </div>
          </div>

          <div className="pt-5 flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNavigateToMap();
              }}
              className="flex-1 py-2.5 px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Map className="w-3.5 h-3.5" />
              <span>View Levels</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelectLevel(nextLevel);
              }}
              className="py-2.5 px-3 bg-slate-900/70 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Terminal className="w-3.5 h-3.5 text-indigo-400" />
              <span>Practice</span>
            </button>
          </div>
        </div>

        {/* Card 2: Eternal Kingdom (Final Campaign) */}
        <div
          onClick={onNavigateToCampaign}
          className="group bg-gradient-to-b from-[#140e29]/65 to-[#0b0e1b]/60 backdrop-blur-md border border-amber-600/30 hover:border-amber-500/70 rounded-xl p-6 flex flex-col justify-between transition-all cursor-pointer shadow-lg hover:shadow-amber-950/20"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-medium text-amber-400 flex items-center gap-1.5">
                <Crown className="w-4 h-4" />
                FINAL CAMPAIGN
              </span>
              <span className="text-xs font-mono text-slate-300">LEVEL 18</span>
            </div>

            <div>
              <h2 className="text-xl font-display font-bold text-white group-hover:text-amber-300 transition-colors">
                Eternal Kingdom
              </h2>
              <p className="text-xs text-slate-200 mt-1.5 leading-relaxed">
                A comprehensive 5-stage RPG architecture challenge. Build world entities, design dynamic combat dispatch, protect collections, and slay the Eclipse Dragon.
              </p>
            </div>

            <div className="p-3 bg-slate-950/55 border border-slate-800/70 rounded-lg text-xs space-y-1.5">
              <div className="flex items-center justify-between text-slate-400">
                <span>Status</span>
                <span className="text-indigo-400 font-medium">
                  {progress.unlockedLevelIds.includes(18) ? 'Unlocked' : 'Requires Level 17'}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Boss Health</span>
                <span className="font-mono text-amber-300">
                  {progress.campaignCheckpoint.dragonDefeated
                    ? '0 (Defeated)'
                    : `${progress.campaignCheckpoint.bossHealthRemaining} HP`}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNavigateToCampaign();
              }}
              className="w-full py-2.5 px-4 bg-amber-600/90 hover:bg-amber-500 text-white rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Crown className="w-3.5 h-3.5" />
              <span>Enter Eternal Kingdom</span>
            </button>
          </div>
        </div>

        {/* Card 3: Achievements */}
        <div
          onClick={onNavigateToAchievements}
          className="group bg-[#0b0e1b]/60 backdrop-blur-md border border-slate-800/80 hover:border-emerald-500/60 rounded-xl p-6 flex flex-col justify-between transition-all cursor-pointer shadow-lg hover:shadow-emerald-950/20"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-medium text-emerald-400 flex items-center gap-1.5">
                <Trophy className="w-4 h-4" />
                HALL OF TRIUMPHS
              </span>
              <span className="text-xs font-mono text-slate-300">
                {progress.achievements.length}/{ACHIEVEMENTS.length} Unlocked
              </span>
            </div>

            <div>
              <h2 className="text-xl font-display font-bold text-white group-hover:text-emerald-300 transition-colors">
                Achievements
              </h2>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                Track your unlocked grandmaster badges, milestone XP bonuses, and OOP mastery accolades across all realms.
              </p>
            </div>

            <div className="p-3 bg-slate-950/55 border border-slate-800/70 rounded-lg space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>RECENT BADGES</span>
                <span className="text-amber-400">{progress.currentXP} Total XP</span>
              </div>
              {recentAchievements.length > 0 ? (
                <div className="space-y-1">
                  {recentAchievements.slice(0, 2).map((ach) => (
                    <div key={ach.id} className="flex items-center justify-between text-xs">
                      <span className="text-slate-200 font-medium truncate">{ach.title}</span>
                      <span className="text-amber-400 font-mono text-[11px] shrink-0">+{ach.xpBonus} XP</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-slate-500">
                  Complete your first mission to unlock badges!
                </div>
              )}
            </div>
          </div>

          <div className="pt-5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNavigateToAchievements();
              }}
              className="w-full py-2.5 px-4 bg-emerald-600/90 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>View All Achievements</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
