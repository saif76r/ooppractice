export type GameModeType = 
  | 'lesson'
  | 'code_builder'
  | 'bug_hunter'
  | 'predict_output'
  | 'memory_match'
  | 'dungeon_escape'
  | 'boss_battle'
  | 'coding_arena'
  | 'architecture';

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  isHidden?: boolean;
  description: string;
}

export interface Mission {
  id: string;
  levelId: number;
  number: number;
  title: string;
  mode: GameModeType;
  storyIntro: string;
  conceptSummary: string;
  instructions: string;
  tasks?: string[];
  xpReward: number;
  starterCode?: string;
  solutionCode?: string;
  testCases?: TestCase[];
  hints: string[];
  explanation: string;
  // Specific mode payload
  codeBuilderBlocks?: { id: string; code: string; correctOrder: number }[];
  bugHunterOptions?: { id: string; line: number; errorDesc: string; fixedCode: string; isActualBug: boolean }[];
  predictOptions?: { text: string; isCorrect: boolean }[];
  memoryPairs?: { id: string; term: string; match: string; category: string }[];
  dungeonRooms?: { id: string; title: string; puzzle: string; options: string[]; answerIndex: number }[];
}

export interface Level {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  realmName: string;
  iconName: string;
  description: string;
  topics: string[];
  story: string;
  missions: Mission[];
  bossChallenge: {
    title: string;
    description: string;
    tasks?: string[];
    starterCode: string;
    testCases: TestCase[];
    hints: string[];
  };
  totalXP: number;
  requiredLevelToUnlock: number;
  prerequisiteLevelId?: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'curriculum' | 'skill' | 'streak' | 'combat' | 'campaign';
  icon: string;
  xpBonus: number;
  isUnlocked: boolean;
  unlockedAt?: string;
}

export interface UserProgress {
  userId: string;
  displayName: string;
  avatarId: string;
  level: number;
  currentXP: number;
  streakDays: number;
  lastActiveDate: string;
  completedMissionIds: string[];
  completedLevelIds: number[];
  unlockedLevelIds: number[];
  achievements: string[];
  campaignCheckpoint: {
    stage: number;
    completedStages: number[];
    dragonDefeated: boolean;
    bossHealthRemaining: number;
    savedCodeByStage: Record<number, string>;
  };
  submissionHistory: {
    id: string;
    timestamp: string;
    missionId: string;
    passed: boolean;
    stdout: string;
  }[];
}

export interface ExecutionResult {
  success: boolean;
  compilationError?: string;
  runtimeError?: string;
  stdout: string;
  stderr: string;
  executionTimeMs: number;
  testResults: {
    testCaseId: string;
    description: string;
    passed: boolean;
    input: string;
    expected: string;
    actual: string;
    isHidden: boolean;
  }[];
  allTestsPassed: boolean;
  xpAwarded?: number;
}
