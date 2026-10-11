import React, { useState, useEffect } from 'react';
import { UserProgress, Level, Mission, Achievement } from './types';
import { CURRICULUM } from './content/curriculum';
import { 
  getStoredProgress, recordMissionCompletion, saveProgressLocally 
} from './services/storage';

// Components
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Dashboard } from './components/dashboard/Dashboard';
import { AdventureMap } from './components/map/AdventureMap';
import { CodingArena } from './components/arena/CodingArena';
import { Level13Campaign } from './components/campaign/Level13Campaign';
import { AchievementsView } from './components/achievements/AchievementsView';
import { CodeBuilder } from './components/modes/CodeBuilder';
import { BugHunter } from './components/modes/BugHunter';
import { PredictOutput } from './components/modes/PredictOutput';
import { MemoryMatch } from './components/modes/MemoryMatch';
import { DungeonEscape } from './components/modes/DungeonEscape';
import { AITutorModal } from './components/tutor/AITutorModal';
import { ProfileModal } from './components/profile/ProfileModal';
import bgVideoUrl from './video/video.mp4';
import { Trophy, X } from 'lucide-react';

export default function App() {
  const [progress, setProgress] = useState<UserProgress>(getStoredProgress);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'map' | 'arena' | 'achievements' | 'campaign'>('dashboard');
  
  // Active learning context
  const [activeLevel, setActiveLevel] = useState<Level>(CURRICULUM[0]);
  const [activeMission, setActiveMission] = useState<Mission | undefined>(CURRICULUM[0].missions[0]);
  const [isBossMode, setIsBossMode] = useState<boolean>(false);

  // Modals
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isTutorOpen, setIsTutorOpen] = useState<boolean>(false);
  const [tutorContext, setTutorContext] = useState<{ code: string; errorLog?: string; concept?: string }>({
    code: '',
    errorLog: '',
    concept: 'Java OOP',
  });

  // Achievement unlock toast
  const [unlockedAchievementToast, setUnlockedAchievementToast] = useState<Achievement | null>(null);

  // Save changes locally
  const handleUpdateProgress = (updated: UserProgress) => {
    setProgress(updated);
    saveProgressLocally(updated);
  };

  // On mission or boss victory
  const handleMissionSuccess = (missionId: string, levelId: number, xpReward: number) => {
    const { updated, newlyUnlockedAchievements } = recordMissionCompletion(
      progress,
      missionId,
      levelId,
      xpReward
    );
    setProgress(updated);

    if (newlyUnlockedAchievements.length > 0) {
      setUnlockedAchievementToast(newlyUnlockedAchievements[0]);
      setTimeout(() => {
        setUnlockedAchievementToast(null);
      }, 5000);
    }
  };

  // Navigation helpers
  const handleSelectLevel = (level: Level) => {
    setActiveLevel(level);
    if (level.id === 18) {
      setActiveTab('campaign');
      return;
    }
    // Default to the first incomplete mission or mission 1
    const incomplete = level.missions.find((m) => !progress.completedMissionIds.includes(m.id)) || level.missions[0];
    setActiveMission(incomplete);
    setIsBossMode(false);
    setActiveTab('arena');
  };

  const handleSelectMission = (level: Level, missionId: string) => {
    setActiveLevel(level);
    const mission = level.missions.find((m) => m.id === missionId);
    if (mission) {
      setActiveMission(mission);
      setIsBossMode(false);
      setActiveTab('arena');
    }
  };

  const handleOpenTutorWithCode = (code: string, errorLog?: string) => {
    setTutorContext({
      code,
      errorLog: errorLog || '',
      concept: activeLevel?.title || 'Java OOP',
    });
    setIsTutorOpen(true);
  };

  // Render active workspace based on mission mode (Side Task Brief + Live Java IDE)
  const renderArenaOrMode = () => {
    return (
      <CodingArena
        level={activeLevel}
        mission={activeMission}
        isBossChallenge={isBossMode}
        progress={progress}
        onSuccess={handleMissionSuccess}
        onBackToMap={() => setActiveTab('map')}
        onOpenTutor={handleOpenTutorWithCode}
        onNextMission={() => {
          const nextIndex = activeLevel.missions.findIndex((m) => m.id === activeMission?.id) + 1;
          if (nextIndex < activeLevel.missions.length) {
            setActiveMission(activeLevel.missions[nextIndex]);
          } else {
            setIsBossMode(true);
          }
        }}
      />
    );
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-[#070913] text-slate-100 selection:bg-indigo-900 selection:text-white overflow-x-hidden">
      {/* Global Background Video */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <video
          src={bgVideoUrl}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-[#070913]/30" />
      </div>

      {/* Navigation Top Bar */}
      <Navbar
        progress={progress}
        activeTab={activeTab}
        onNavigate={setActiveTab}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenTutor={() => setIsTutorOpen(true)}
      />

      {/* Main View Area */}
      <main className="relative z-10 flex-1 pb-16">
        {activeTab === 'dashboard' && (
          <Dashboard
            progress={progress}
            onNavigateToMap={() => setActiveTab('map')}
            onNavigateToArena={() => setActiveTab('arena')}
            onNavigateToCampaign={() => setActiveTab('campaign')}
            onNavigateToAchievements={() => setActiveTab('achievements')}
            onSelectLevel={handleSelectLevel}
            onOpenProfile={() => setIsProfileOpen(true)}
          />
        )}

        {activeTab === 'map' && (
          <AdventureMap
            progress={progress}
            onSelectLevel={handleSelectLevel}
            onSelectMission={handleSelectMission}
          />
        )}

        {activeTab === 'arena' && renderArenaOrMode()}

        {activeTab === 'campaign' && (
          <Level13Campaign
            level={CURRICULUM.find((l) => l.id === 18) || CURRICULUM[CURRICULUM.length - 1]}
            progress={progress}
            onUpdateProgress={handleUpdateProgress}
            onOpenTutor={handleOpenTutorWithCode}
            onBackToMap={() => setActiveTab('map')}
          />
        )}

        {activeTab === 'achievements' && (
          <AchievementsView progress={progress} />
        )}
      </main>

      {/* Achievement Toast */}
      {unlockedAchievementToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-slate-900 border-2 border-amber-500 rounded-xl shadow-2xl flex items-center gap-3.5 max-w-sm animate-bounce">
          <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
            <Trophy className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[11px] font-mono text-amber-400 uppercase font-semibold">
              Achievement Unlocked!
            </div>
            <h4 className="text-xs font-bold text-white truncate">
              {unlockedAchievementToast.title}
            </h4>
            <p className="text-[11px] text-slate-400 line-clamp-1">
              {unlockedAchievementToast.description}
            </p>
          </div>
          <button
            onClick={() => setUnlockedAchievementToast(null)}
            className="text-slate-500 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Arcane AI Tutor Modal */}
      <AITutorModal
        isOpen={isTutorOpen}
        onClose={() => setIsTutorOpen(false)}
        currentCode={tutorContext.code}
        errorLog={tutorContext.errorLog}
        concept={tutorContext.concept}
      />

      {/* Profile & Settings Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        progress={progress}
        onUpdateProgress={handleUpdateProgress}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
