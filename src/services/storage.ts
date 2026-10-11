import { UserProgress, Achievement } from '../types';
import { ACHIEVEMENTS } from '../content/achievements';
import { CURRICULUM } from '../content/curriculum';

const STORAGE_KEY = 'oop_quest_progress_v1';

export const INITIAL_USER_PROGRESS: UserProgress = {
  userId: 'player_hero_1',
  displayName: 'Arcane Scholar',
  avatarId: 'mage',
  level: 1,
  currentXP: 0,
  streakDays: 1,
  lastActiveDate: new Date().toISOString().split('T')[0],
  completedMissionIds: [],
  completedLevelIds: [],
  unlockedLevelIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
  achievements: [],
  campaignCheckpoint: {
    stage: 1,
    completedStages: [],
    dragonDefeated: false,
    bossHealthRemaining: 1500,
    savedCodeByStage: {},
  },
  submissionHistory: [],
};

export function getStoredProgress(): UserProgress {
  if (typeof window === 'undefined') return INITIAL_USER_PROGRESS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_USER_PROGRESS;
    const parsed = JSON.parse(raw);
    const all18 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
    const unlockedLevelIds = Array.from(
      new Set([...(parsed.unlockedLevelIds || []), ...all18])
    );
    return { ...INITIAL_USER_PROGRESS, ...parsed, unlockedLevelIds };
  } catch {
    return INITIAL_USER_PROGRESS;
  }
}

export function saveProgressLocally(progress: UserProgress): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (err) {
    console.error('Failed to save progress locally:', err);
  }
}

export function calculateLevelFromXP(xp: number): number {
  // Level threshold: Level 1: 0, Level 2: 200, Level 3: 500, Level 4: 900, etc.
  return Math.max(1, Math.floor(Math.sqrt(xp / 100)) + 1);
}

export function recordMissionCompletion(
  current: UserProgress,
  missionId: string,
  levelId: number,
  xpEarned: number
): { updated: UserProgress; newlyUnlockedAchievements: Achievement[]; newlyUnlockedLevelId?: number } {
  const isAlreadyCompleted = current.completedMissionIds.includes(missionId);
  const newCompletedMissions = isAlreadyCompleted
    ? current.completedMissionIds
    : [...current.completedMissionIds, missionId];

  const addedXP = isAlreadyCompleted ? 0 : xpEarned;
  const newXP = current.currentXP + addedXP;
  const newPlayerLevel = calculateLevelFromXP(newXP);

  // Check if all missions for this level are completed or boss defeated
  const levelData = CURRICULUM.find((l) => l.id === levelId);
  const isLevelCompleted = current.completedLevelIds.includes(levelId) || (
    levelData &&
    levelData.missions.every((m) => newCompletedMissions.includes(m.id))
  );

  const newCompletedLevels = isLevelCompleted && !current.completedLevelIds.includes(levelId)
    ? [...current.completedLevelIds, levelId]
    : current.completedLevelIds;

  // Level unlocking logic: next level unlocks if previous is completed
  let nextLevelToUnlock: number | undefined;
  const unlocked = new Set<number>(current.unlockedLevelIds);
  if (isLevelCompleted) {
    const nextId = levelId + 1;
    if (nextId <= CURRICULUM.length) {
      // Level 18 requires Level 17 completion
      if (nextId === 18) {
        if (newCompletedLevels.includes(17)) {
          unlocked.add(18);
          nextLevelToUnlock = 18;
        }
      } else {
        unlocked.add(nextId);
        nextLevelToUnlock = nextId;
      }
    }
  }

  // Achievement evaluations
  const newlyUnlockedAchievements: Achievement[] = [];
  const currentAchievements = new Set<string>(current.achievements);

  // Level 1 completion achievement
  if (newCompletedLevels.includes(1) && !currentAchievements.has('first_class')) {
    currentAchievements.add('first_class');
    const a = ACHIEVEMENTS.find((item) => item.id === 'first_class');
    if (a) newlyUnlockedAchievements.push(a);
  }

  // Level 2 completion achievement
  if (newCompletedLevels.includes(2) && !currentAchievements.has('constructor_forged')) {
    currentAchievements.add('constructor_forged');
    const a = ACHIEVEMENTS.find((item) => item.id === 'constructor_forged');
    if (a) newlyUnlockedAchievements.push(a);
  }

  // Level 4 (Encapsulation Citadel) completion achievement
  if (newCompletedLevels.includes(4) && !currentAchievements.has('citadel_defender')) {
    currentAchievements.add('citadel_defender');
    const a = ACHIEVEMENTS.find((item) => item.id === 'citadel_defender');
    if (a) newlyUnlockedAchievements.push(a);
  }

  // Level 17 (Master Trials) completion achievement
  if (newCompletedLevels.includes(17) && !currentAchievements.has('master_trials_victor')) {
    currentAchievements.add('master_trials_victor');
    const a = ACHIEVEMENTS.find((item) => item.id === 'master_trials_victor');
    if (a) newlyUnlockedAchievements.push(a);
  }

  const updated: UserProgress = {
    ...current,
    currentXP: newXP,
    level: newPlayerLevel,
    completedMissionIds: newCompletedMissions,
    completedLevelIds: newCompletedLevels,
    unlockedLevelIds: Array.from(unlocked),
    achievements: Array.from(currentAchievements),
  };

  saveProgressLocally(updated);
  return { updated, newlyUnlockedAchievements, newlyUnlockedLevelId: nextLevelToUnlock };
}

export function saveCampaignStage(
  current: UserProgress,
  stage: number,
  code: string,
  bossHealthRemaining: number,
  dragonDefeated: boolean
): UserProgress {
  const completedStages = new Set(current.campaignCheckpoint.completedStages);
  completedStages.add(stage);

  const updated: UserProgress = {
    ...current,
    campaignCheckpoint: {
      stage: Math.min(5, stage + 1),
      completedStages: Array.from(completedStages),
      dragonDefeated: current.campaignCheckpoint.dragonDefeated || dragonDefeated,
      bossHealthRemaining,
      savedCodeByStage: {
        ...current.campaignCheckpoint.savedCodeByStage,
        [stage]: code,
      },
    },
  };

  if (dragonDefeated && !current.achievements.includes('eclipse_slayer')) {
    updated.achievements = [...updated.achievements, 'eclipse_slayer'];
    updated.currentXP += 500;
  }

  saveProgressLocally(updated);
  return updated;
}
