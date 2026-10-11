import React from 'react';
import { UserProgress } from '../../types';
import { Sparkles, Trophy, BookOpen, Map, Terminal, Flame, User } from 'lucide-react';

interface NavbarProps {
  progress: UserProgress;
  activeTab: 'dashboard' | 'map' | 'arena' | 'achievements' | 'campaign';
  onNavigate: (tab: 'dashboard' | 'map' | 'arena' | 'achievements' | 'campaign') => void;
  onOpenProfile: () => void;
  onOpenTutor: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  progress,
  activeTab,
  onNavigate,
  onOpenProfile,
  onOpenTutor,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#070913]/65 backdrop-blur-md border-b border-slate-800/70 px-4 md:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element, whitespace-nowrap shrink-0) */}
        <button
          onClick={() => onNavigate('dashboard')}
          className="text-left group cursor-pointer focus:outline-none"
        >
          <span className="font-display text-xl md:text-2xl font-bold tracking-tight text-white group-hover:text-indigo-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-sm bg-indigo-500 rotate-45 inline-block" />
            OOP QUEST
          </span>
        </button>

        {/* Zone 3: 1 Primary Action & Player Quick Stat */}
        <div className="flex items-center gap-3 shrink-0">
          {activeTab !== 'dashboard' && (
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-900 border border-slate-700/80 rounded-md hover:bg-slate-800 hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Home
            </button>
          )}

          {/* Player badge / Profile button */}
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-2.5 px-3 py-1.5 bg-slate-900/90 border border-slate-700/80 rounded-md hover:border-indigo-500/80 transition-colors whitespace-nowrap shrink-0 cursor-pointer text-left"
          >
            <div className="w-6 h-6 rounded-sm bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
              {progress.displayName.charAt(0).toUpperCase()}
            </div>
            <div className="hidden sm:block text-xs">
              <span className="font-semibold text-slate-200">Lvl {progress.level}</span>
              <span className="text-slate-500 mx-1">·</span>
              <span className="text-indigo-400 font-mono tabular-nums">{progress.currentXP} XP</span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
