import React, { useState } from 'react';
import { Level, UserProgress, ExecutionResult } from '../../types';
import { JavaEditor } from '../editor/JavaEditor';
import { runJavaCode, testJavaChallenge } from '../../services/javaRunner';
import { saveCampaignStage } from '../../services/storage';
import confetti from 'canvas-confetti';
import { 
  Crown, Play, CheckCircle2, RotateCcw, Shield, Sparkles, 
  Terminal, ChevronRight, Award, Trophy, AlertTriangle, ShieldCheck, Zap
} from 'lucide-react';

interface Level13CampaignProps {
  level: Level;
  progress: UserProgress;
  onUpdateProgress: (updated: UserProgress) => void;
  onOpenTutor: (code: string, errorLog?: string) => void;
  onBackToMap: () => void;
}

export const Level13Campaign: React.FC<Level13CampaignProps> = ({
  level,
  progress,
  onUpdateProgress,
  onOpenTutor,
  onBackToMap,
}) => {
  const checkpoint = progress.campaignCheckpoint;
  const [currentStage, setCurrentStage] = useState<number>(checkpoint.stage || 1);
  const [bossHp, setBossHp] = useState<number>(checkpoint.bossHealthRemaining ?? 1500);
  const [isDragonDefeated, setIsDragonDefeated] = useState<boolean>(checkpoint.dragonDefeated ?? false);
  const [activeTab, setActiveTab] = useState<'console' | 'tests'>('console');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [execResult, setExecResult] = useState<ExecutionResult | null>(null);

  // Starter code tailored for the active stage (Clean boilerplate - NO answers pre-filled!)
  const getStageCode = (stage: number) => {
    if (checkpoint.savedCodeByStage[stage]) {
      return checkpoint.savedCodeByStage[stage];
    }
    if (stage === 1) {
      return `public class Main {
    public static void main(String[] args) {
        // Read the brief task on the left and write your code here
        
    }
}

// Define WorldEntity class here
`;
    } else if (stage === 2) {
      return `public class Main {
    public static void main(String[] args) {
        // Read the brief task on the left and write your code here
        
    }
}

// Define AttackSkill interface, PhysicalStrike, and SolarBeam classes here
`;
    } else if (stage === 3) {
      return `import java.util.*;

public class Main {
    public static void main(String[] args) {
        // Read the brief task on the left and write your code here
        
    }
}

// Define InventoryFullException and Inventory classes here
`;
    } else if (stage === 4) {
      return `public class Main {
    public static void main(String[] args) {
        // Read the brief task on the left and write your code here
        
    }
}

// Define DungeonSentinel class here
`;
    } else {
      // Stage 5: Final Eclipse Dragon Boss Engine
      return `public class Main {
    public static void main(String[] args) {
        // Read the brief task on the left and write your code here
        
    }
}

// Define EclipseDragon class here
`;
    }
  };

  const [code, setCode] = useState<string>(getStageCode(currentStage));

  const handleStageSelect = (stage: number) => {
    setCurrentStage(stage);
    setCode(getStageCode(stage));
    setExecResult(null);
  };

  const handleRun = async () => {
    setIsRunning(true);
    setActiveTab('console');
    try {
      const res = await runJavaCode(code);
      setExecResult(res);
    } finally {
      setIsRunning(false);
    }
  };

  const handleVerifyStage = async () => {
    setIsVerifying(true);
    setActiveTab('tests');
    try {
      const missionId = `campaign_stage_${currentStage}`;
      const stageTests = currentStage === 5 
        ? level.bossChallenge.testCases 
        : [
            {
              id: `c13_s${currentStage}_t1`,
              input: '',
              expectedOutput: currentStage === 1
                ? 'Entity Created: Solaris [HP: 250]\nAfter Sacred Heal: 300'
                : currentStage === 2
                ? 'Skill 1: 100\nSkill 2: 200'
                : currentStage === 3
                ? 'Slots filled: 2\nException handled: Inventory capacity exceeded (2)'
                : 'Sentinel calibrated: true',
              description: `Automated test contract for Stage ${currentStage}`,
            },
          ];

      const res = await testJavaChallenge(code, stageTests, missionId);
      setExecResult(res);

      if (res.allTestsPassed) {
        const isDragonDefeat = currentStage === 5;
        const newBossHp = isDragonDefeat ? 0 : Math.max(0, 1500 - (currentStage * 300));
        setBossHp(newBossHp);
        if (isDragonDefeat) {
          setIsDragonDefeated(true);
        }

        try {
          confetti({
            particleCount: isDragonDefeat ? 150 : 80,
            spread: 80,
            origin: { y: 0.5 },
          });
        } catch {}

        const updated = saveCampaignStage(progress, currentStage, code, newBossHp, isDragonDefeat);
        onUpdateProgress(updated);
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const stagesList = [
    { num: 1, title: 'Stage 1: World Creation', topic: 'Classes, Objects & Encapsulation' },
    { num: 2, title: 'Stage 2: The Combat Engine', topic: 'Dynamic Dispatch & Interfaces' },
    { num: 3, title: 'Stage 3: The Living Kingdom', topic: 'Collections & Custom Exceptions' },
    { num: 4, title: 'Stage 4: The Endless Dungeon', topic: 'Hidden Test Suite & Robustness' },
    { num: 5, title: 'Stage 5: The Eclipse Dragon', topic: 'Multi-Phase Combat Boss Loop' },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-4 md:px-8">
      {/* Campaign Banner Header */}
      <div className="relative rounded-2xl border border-amber-600/40 bg-gradient-to-r from-[#0d091a] via-[#140e29] to-[#0d091a] p-6 md:p-8 mb-8 overflow-hidden shadow-2xl">
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-8 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
              <Crown className="w-4 h-4 text-amber-400" />
              <span>LEVEL 13 · THE FINAL EPIC CAMPAIGN</span>
              <span>·</span>
              <span className="text-slate-400">CHECKPOINT PERSISTENCE ACTIVE</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-display font-extrabold text-white tracking-tight">
              The Eternal Kingdom
            </h1>
            <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed">
              The climax of your OOP journey. Construct the complete 5-stage Java RPG engine to shatter the Cosmic Barrier and defeat the Eclipse Dragon.
            </p>

            {/* Boss Status HUD Bar */}
            <div className="pt-2">
              <div className="flex items-center justify-between text-xs font-mono text-slate-300 mb-1.5">
                <span className="font-semibold text-amber-300">
                  {isDragonDefeated ? 'ECLIPSE DRAGON DEFEATED' : 'BOSS: THE ECLIPSE DRAGON'}
                </span>
                <span className="tabular-nums">
                  {bossHp} / 1500 HP {bossHp <= 1000 && bossHp > 0 && '(Cosmic Barrier Active)'}
                </span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800">
                <div
                  className={`h-full transition-all duration-500 ${
                    isDragonDefeated ? 'bg-emerald-500' : 'bg-gradient-to-r from-purple-600 to-indigo-500'
                  }`}
                  style={{ width: `${Math.round((bossHp / 1500) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Boss Portrait Image Generated for the Platform */}
          <div className="md:col-span-4 flex justify-center">
            <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-xl overflow-hidden border-2 border-indigo-500/50 shadow-xl shadow-purple-950/60 bg-slate-950">
              <img
                src="/src/assets/images/boss_eclipse_dragon_1791652017510.jpg"
                alt="The Eclipse Dragon Boss"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
              {isDragonDefeated && (
                <div className="absolute inset-0 bg-emerald-950/80 backdrop-blur-xs flex flex-col items-center justify-center text-center p-2">
                  <Trophy className="w-8 h-8 text-amber-300 mb-1" />
                  <span className="font-display font-bold text-xs text-white">VANQUISHED</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stage Stepper Navigation */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
        {stagesList.map((s) => {
          const isDone = checkpoint.completedStages.includes(s.num);
          const isCurrent = currentStage === s.num;
          return (
            <button
              key={s.num}
              onClick={() => handleStageSelect(s.num)}
              className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                isCurrent
                  ? 'bg-indigo-950/70 border-indigo-500 ring-1 ring-indigo-500/50'
                  : isDone
                  ? 'bg-[#0b0e1b] border-emerald-800/60 hover:border-emerald-700'
                  : 'bg-[#080b14] border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-mono text-slate-500">STAGE 0{s.num}</span>
                {isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-slate-700" />
                )}
              </div>
              <h4 className="text-xs font-semibold text-slate-200 truncate">{s.title}</h4>
              <p className="text-[10px] text-slate-400 truncate mt-0.5">{s.topic}</p>
            </button>
          );
        })}
      </div>

      {/* Campaign Coding Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Stage Objective */}
        <div className="lg:col-span-5 bg-[#0b0e1b]/55 backdrop-blur-md border border-slate-800/80 rounded-lg p-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-medium text-amber-400 uppercase tracking-wider">
                Stage {currentStage} Protocol
              </span>
              <span className="text-xs font-mono text-slate-500">Auto-Checkpoint Saved</span>
            </div>

            <h2 className="text-lg font-display font-bold text-white">
              {stagesList[currentStage - 1].title}
            </h2>

            <p className="text-xs text-slate-300 leading-relaxed">
              {currentStage === 5
                ? 'Confront the Eclipse Dragon. Implement the EclipseDragon and EclipseEngine combat loop. When HP falls <= 1000, trigger the cosmic barrier to deflect ordinary attacks and require magical piercing strikes.'
                : currentStage === 1
                ? 'Construct the foundational WorldEntity hierarchy with private fields, encapsulation, and validated heal mutator.'
                : currentStage === 2
                ? 'Build the polymorphic AttackSkill contract and concrete implementations demonstrating dynamic dispatch.'
                : currentStage === 3
                ? 'Implement the inventory collection system with capacity checks and the custom InventoryFullException.'
                : 'Configure the defensive sentinel and pass all edge-case validation checks to access the final peak.'}
            </p>

            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                Requirements
              </span>
              <div className="space-y-1.5">
                {[
                  currentStage === 1 ? [
                    'Create WorldEntity with private String name and private int hp',
                    'Implement constructor WorldEntity(String name, int initialHp)',
                    'Implement public getters: getName() and getHp()',
                    'Implement void heal(int amount) adding to hp if amount > 0',
                    'In main(), instantiate Solaris (250 HP), print creation status, heal 50, and print updated HP'
                  ] : currentStage === 2 ? [
                    'Create interface AttackSkill with method: int execute(int basePower)',
                    'Create class PhysicalStrike implementing AttackSkill returning basePower',
                    'Create class SolarBeam implementing AttackSkill returning basePower * 2',
                    'In main(), instantiate both skills and print Skill 1 and Skill 2 with base 100'
                  ] : currentStage === 3 ? [
                    'Create custom exception InventoryFullException extends RuntimeException',
                    'Create class Inventory with private int capacity and List<String> items',
                    'Implement void addItem(String item) throwing InventoryFullException when full',
                    'Implement int getItemCount() returning items.size()',
                    'In main(), add 2 items to Inventory(2), print slots filled, attempt adding 3rd in try-catch and print exception message'
                  ] : currentStage === 4 ? [
                    'Create class DungeonSentinel with private int defense = 0',
                    'Implement void calibrateDefense(int val) setting defense if val > 0',
                    'Implement boolean isReady() returning defense >= 100',
                    'In main(), calibrate with 150 and print: "Sentinel calibrated: " + sentinel.isReady()'
                  ] : [
                    'Create EclipseDragon class with 300 HP and void takeDamage(int amount)',
                    'In main(), deal 100 damage 3 times and print Dragon HP after each strike',
                    'When HP is 0, print: "Victory! The Eclipse Dragon has fallen!"'
                  ]
                ][0].map((t, idx) => (
                  <div key={idx} className="p-2.5 rounded bg-slate-900/60 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
                    <span className="w-4 h-4 rounded bg-slate-800 text-slate-400 border border-slate-700 flex items-center justify-center shrink-0 text-[10px] font-mono mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{t}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Expected Console Output */}
            <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-lg space-y-1.5 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-[11px] font-semibold block">
                  Expected Console Output
                </span>
                <button
                  onClick={() => {
                    const text = currentStage === 1
                      ? 'Entity Created: Solaris [HP: 250]\nAfter Sacred Heal: 300'
                      : currentStage === 2
                      ? 'Skill 1: 100\nSkill 2: 200'
                      : currentStage === 3
                      ? 'Slots filled: 2\nException handled: Inventory capacity exceeded (2)'
                      : currentStage === 4
                      ? 'Sentinel calibrated: true'
                      : 'Dragon HP: 200\nDragon HP: 100\nDragon HP: 0\nVictory! The Eclipse Dragon has fallen!';
                    navigator.clipboard.writeText(text);
                  }}
                  className="text-[10px] text-slate-400 hover:text-white cursor-pointer transition-colors"
                >
                  Copy
                </button>
              </div>
              <pre className="bg-[#05070d] p-2 rounded text-slate-200 text-[11px] whitespace-pre-wrap border border-slate-800 leading-relaxed">
                {currentStage === 1
                  ? 'Entity Created: Solaris [HP: 250]\nAfter Sacred Heal: 300'
                  : currentStage === 2
                  ? 'Skill 1: 100\nSkill 2: 200'
                  : currentStage === 3
                  ? 'Slots filled: 2\nException handled: Inventory capacity exceeded (2)'
                  : currentStage === 4
                  ? 'Sentinel calibrated: true'
                  : 'Dragon HP: 200\nDragon HP: 100\nDragon HP: 0\nVictory! The Eclipse Dragon has fallen!'}
              </pre>
            </div>

            {isDragonDefeated && (
              <div className="p-4 bg-amber-950/40 border border-amber-800/80 rounded-lg text-xs text-amber-200 space-y-2">
                <div className="flex items-center gap-2 font-display font-bold text-sm text-amber-300">
                  <Trophy className="w-5 h-5 text-amber-400" />
                  <span>CAMPAIGN MASTERED!</span>
                </div>
                <p className="text-[11px] text-amber-200/80">
                  You have defeated the Eclipse Dragon and demonstrated mastery across all 13 realms of Object-Oriented Programming!
                </p>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="pt-4 flex items-center justify-between">
            <button
              onClick={onBackToMap}
              className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              Return to Map
            </button>
          </div>
        </div>

        {/* Right: Code Editor & Execution Diagnostics */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <div className="flex items-center justify-between pb-1">
            <div className="text-xs text-slate-400 font-mono">
              Java RPG Engine Code: Main.java
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (confirm('Start with a blank file?')) {
                    setCode(`public class Main {\n    public static void main(String[] args) {\n        // Write your code here from scratch\n        \n    }\n}\n`);
                    setExecResult(null);
                  }
                }}
                className="px-2.5 py-1.5 text-xs text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800 rounded transition-colors cursor-pointer"
                title="Start from clean blank template"
              >
                <span>Blank</span>
              </button>
              <button
                onClick={() => {
                  if (confirm('Reset to stage starter template?')) {
                    setCode(getStageCode(currentStage));
                    setExecResult(null);
                  }
                }}
                className="px-2.5 py-1.5 text-xs text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800 rounded transition-colors flex items-center gap-1 cursor-pointer"
                title="Reset code template"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
              <button
                onClick={handleRun}
                disabled={isRunning || isVerifying}
                className="px-3 py-1.5 text-xs text-slate-200 bg-slate-800 hover:bg-slate-700 rounded transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                <Play className="w-3 h-3 fill-current text-indigo-400" />
                <span>{isRunning ? 'Running...' : 'Run'}</span>
              </button>
              <button
                onClick={handleVerifyStage}
                disabled={isRunning || isVerifying}
                className="px-4 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{isVerifying ? 'Verifying...' : `Verify Stage ${currentStage}`}</span>
              </button>
            </div>
          </div>

          <div className="h-[420px]">
            <JavaEditor code={code} onChange={setCode} onRunShortcut={handleRun} />
          </div>

          {/* Execution Results View */}
          <div className="bg-[#0b0e1b]/55 backdrop-blur-md border border-slate-800/80 rounded-lg p-3 font-mono text-xs min-h-[160px] overflow-y-auto">
            <div className="text-slate-500 text-[11px] mb-2 font-mono flex items-center justify-between">
              <span>Execution Output & Test Diagnostics</span>
              {execResult?.executionTimeMs !== undefined && (
                <span>{execResult.executionTimeMs}ms</span>
              )}
            </div>

            {execResult?.compilationError ? (
              <pre className="text-red-400 whitespace-pre-wrap text-[11px] bg-red-950/20 p-2 rounded">
                {execResult.compilationError}
              </pre>
            ) : execResult?.runtimeError ? (
              <pre className="text-amber-400 whitespace-pre-wrap text-[11px] bg-amber-950/20 p-2 rounded">
                {execResult.runtimeError}
              </pre>
            ) : execResult?.testResults && execResult.testResults.length > 0 ? (
              <div className="space-y-1.5">
                {execResult.testResults.map((t, i) => (
                  <div
                    key={i}
                    className={`p-2 rounded text-[11px] flex items-center justify-between ${
                      t.passed
                        ? 'bg-emerald-950/30 text-emerald-300'
                        : 'bg-red-950/30 text-red-300'
                    }`}
                  >
                    <span>{t.description}</span>
                    <span className="font-semibold">{t.passed ? 'PASSED' : 'FAILED'}</span>
                  </div>
                ))}
              </div>
            ) : execResult?.stdout ? (
              <pre className="text-slate-200 whitespace-pre-wrap leading-5">
                {execResult.stdout}
              </pre>
            ) : (
              <div className="text-slate-600 italic">
                Awaiting execution. Run or verify stage code against OpenJDK 17 test harness.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
