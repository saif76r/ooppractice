import React, { useState } from 'react';
import { Level, UserProgress, ExecutionResult } from '../../types';
import { JavaEditor } from '../editor/JavaEditor';
import { runJavaCode, testJavaChallenge } from '../../services/javaRunner';
import { saveCampaignStage } from '../../services/storage';
import { ETERNAL_KINGDOM_CAPSTONES } from '../../content/eternalKingdomCapstones';
import confetti from 'canvas-confetti';
import { 
  Crown, Play, CheckCircle2, RotateCcw, Shield, Sparkles, 
  Terminal, ChevronRight, Award, Trophy, AlertTriangle, ShieldCheck, Zap, Code, Copy
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

  const getCapstoneSpec = (stage: number) => {
    return ETERNAL_KINGDOM_CAPSTONES[stage - 1] || ETERNAL_KINGDOM_CAPSTONES[0];
  };

  // Start with a clean editor so the student writes their own code
  const getStageCode = (stage: number) => {
    const spec = getCapstoneSpec(stage);
    const saved = checkpoint.savedCodeByStage[stage];
    // Ignore previously auto-injected solution code so the editor starts clean
    if (
      saved &&
      saved.trim() !== spec.fullProjectCode.trim() &&
      !saved.includes('// 1. CUSTOM EXCEPTIONS (REGISTRATION & EXAM SUBMISSION REJECTION RULES)') &&
      !saved.includes('// 1. CUSTOM EXCEPTIONS (APPOINTMENT & PROCEDURE REJECTION RULES)') &&
      !saved.includes('// 1. CUSTOM EXCEPTIONS (BORROWING & RETURN REJECTION RULES)') &&
      !saved.includes('// 1. CUSTOM EXCEPTIONS (ORDER & DELIVERY REJECTION RULES)') &&
      !saved.includes('// 1. CUSTOM EXCEPTIONS (BOOKING & SERVICE REJECTION RULES)') &&
      !saved.includes('Click "Full Project" button above')
    ) {
      return saved;
    }
    return spec.skeletonCode;
  };

  const [code, setCode] = useState<string>(getStageCode(currentStage));

  const activeSpec = getCapstoneSpec(currentStage);

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
      const runRes = await runJavaCode(code);
      if (runRes.compilationError || runRes.runtimeError) {
        setExecResult(runRes);
        return;
      }

      const normalizeOut = (s: string) =>
        s
          .replace(/\r\n/g, '\n')
          .split('\n')
          .map((line) => line.trimEnd())
          .join('\n')
          .trim();

      const actualOut = normalizeOut(runRes.stdout || '');
      const expectedOut = normalizeOut(activeSpec.expectedOutput || '');
      const outputMatchesExactly = actualOut.length > 0 && actualOut === expectedOut;

      // Strip comments before checking OOP constructs
      const cleanCode = code
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/\/\/.*$/gm, '');

      const classMatches = cleanCode.match(/\b(class|abstract\s+class|interface)\s+[A-Za-z_]\w*/g) || [];
      const hasEncapsulation = /\bprivate\s+[A-Za-z0-9_<>\[\]]+\s+[A-Za-z_]\w*/.test(cleanCode);
      const hasAbstractAndInheritance =
        /\babstract\s+class\s+[A-Za-z_]\w*/.test(cleanCode) &&
        /\bextends\s+[A-Za-z_]\w*/.test(cleanCode);
      const hasInterface =
        /\binterface\s+[A-Za-z_]\w*/.test(cleanCode) &&
        /\bimplements\s+[A-Za-z_]\w*/.test(cleanCode);
      const hasExceptionHandling =
        /\bextends\s+(Exception|RuntimeException)\b/.test(cleanCode) &&
        /\bthrow\s+new\s+/.test(cleanCode) &&
        /\btry\s*\{/.test(cleanCode) &&
        /\bcatch\s*\(/.test(cleanCode);
      const hasRelationshipsAndOutput =
        classMatches.length >= 5 && actualOut.length > 0;

      const allOopPillarsPresent =
        hasEncapsulation &&
        hasAbstractAndInheritance &&
        hasInterface &&
        hasExceptionHandling &&
        hasRelationshipsAndOutput;

      const allPassed = outputMatchesExactly || allOopPillarsPresent;

      const testResults = outputMatchesExactly
        ? [
            {
              testCaseId: 'output_match',
              description: `Output Verification: Matches Expected Output for ${activeSpec.title}`,
              passed: true,
              actualOutput: actualOut,
              expectedOutput: expectedOut,
            },
          ]
        : [
            {
              testCaseId: 'output_match',
              description: 'Console Output Match (or implement all OOP concepts below with custom output)',
              passed: outputMatchesExactly || allOopPillarsPresent,
              actualOutput: actualOut,
              expectedOutput: expectedOut,
            },
            {
              testCaseId: 'oop_encapsulation',
              description: 'Encapsulation: Private fields & protected data access',
              passed: hasEncapsulation,
              actualOutput: hasEncapsulation ? 'Verified' : 'Missing private fields',
              expectedOutput: 'Verified',
            },
            {
              testCaseId: 'oop_inheritance',
              description: 'Abstract Class, Inheritance & Method Overriding (abstract class + extends)',
              passed: hasAbstractAndInheritance,
              actualOutput: hasAbstractAndInheritance ? 'Verified' : 'Missing abstract class or extends',
              expectedOutput: 'Verified',
            },
            {
              testCaseId: 'oop_interface',
              description: 'Interface & Polymorphism (interface + implements)',
              passed: hasInterface,
              actualOutput: hasInterface ? 'Verified' : 'Missing interface or implements',
              expectedOutput: 'Verified',
            },
            {
              testCaseId: 'oop_exceptions',
              description: 'Custom Exceptions & Exception Handling (extends Exception, throw, try-catch)',
              passed: hasExceptionHandling,
              actualOutput: hasExceptionHandling ? 'Verified' : 'Missing custom exception or try-catch',
              expectedOutput: 'Verified',
            },
          ];

      const verifyResult: ExecutionResult = {
        ...runRes,
        testResults,
        allTestsPassed: allPassed,
      };
      setExecResult(verifyResult);

      if (allPassed) {
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

  const stagesList = ETERNAL_KINGDOM_CAPSTONES.map((c) => ({
    num: c.stageNumber,
    title: c.title,
    topic: c.topic,
    badge: c.lineCountBadge,
  }));

  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-4 md:px-8">
      {/* Campaign Banner Header */}
      <div className="relative rounded-2xl border border-amber-600/40 bg-gradient-to-r from-[#0d091a] via-[#140e29] to-[#0d091a] p-6 md:p-8 mb-8 overflow-hidden shadow-2xl">
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-8 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
              <Crown className="w-4 h-4 text-amber-400" />
              <span>LEVEL 18 · THE FINAL EPIC CAMPAIGN</span>
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
                <span className="font-mono text-slate-400">PROJECT 0{s.num}</span>
                {isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <span className="text-[10px] font-mono text-amber-400/90">{s.badge}</span>
                )}
              </div>
              <h4 className="text-xs font-semibold text-slate-100 truncate">{s.title}</h4>
              <p className="text-[11px] text-slate-400 truncate mt-0.5">{s.topic}</p>
            </button>
          );
        })}
      </div>

      {/* Campaign Coding Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Stage Objective */}
        <div className="lg:col-span-5 bg-[#0b0e1b]/55 backdrop-blur-md border border-slate-800/80 rounded-xl p-5 md:p-6 flex flex-col justify-between max-h-[calc(100vh-90px)] overflow-y-auto sticky top-20">
          <div className="space-y-5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-mono font-semibold text-amber-400 uppercase tracking-wider px-2.5 py-1 rounded-md bg-amber-950/50 border border-amber-800/60">
                Project {currentStage} · {activeSpec.lineCountBadge}
              </span>
              <span className="text-xs font-mono text-indigo-300 font-semibold">+500 XP</span>
            </div>

            <h2 className="text-lg md:text-xl font-display font-bold text-white leading-snug">
              {activeSpec.title}
            </h2>

            {/* Full Enterprise Problem Specification */}
            <div className="space-y-2.5">
              <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider block">
                Problem Scenario
              </span>
              <div className="text-sm text-slate-200 leading-7 tracking-[0.01em] break-words whitespace-pre-line">
                {activeSpec.problemStatement}
              </div>
            </div>

            {/* Mandatory Rejection Rules */}
            <div className="p-4 rounded-xl bg-amber-950/25 border border-amber-800/50 space-y-2">
              <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>Rejection Conditions</span>
              </span>
              <div className="space-y-2">
                {activeSpec.rejectionRules.map((rule, i) => (
                  <p key={i} className="text-xs md:text-[13.5px] text-amber-100/95 leading-relaxed">
                    • {rule}
                  </p>
                ))}
              </div>
            </div>

            {/* Architecture Implementation Tasks */}
            <div className="space-y-3">
              <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider block">
                Task
              </span>
              <div className="space-y-2.5">
                {activeSpec.tasks.map((t, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs md:text-[13.5px] text-slate-200 flex items-start gap-3">
                    <span className="w-5 h-5 rounded-md bg-slate-800 text-slate-300 border border-slate-700 flex items-center justify-center shrink-0 text-[11px] font-mono font-semibold mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed tracking-[0.01em] break-words">{t}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Demonstrated OOP Pillars */}
            <div className="p-4 rounded-xl bg-indigo-950/25 border border-indigo-800/40 space-y-2">
              <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider block">
                Required OOP Concepts
              </span>
              <div className="grid grid-cols-1 gap-1.5">
                {activeSpec.oopPillars.map((pillar, i) => (
                  <div key={i} className="text-xs md:text-[13px] text-slate-200 flex items-start gap-2 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                    <span>{pillar}</span>
                  </div>
                ))}
              </div>
            </div>

            {isDragonDefeated && (
              <div className="p-4 bg-amber-950/40 border border-amber-800/80 rounded-lg text-xs text-amber-200 space-y-2">
                <div className="flex items-center gap-2 font-display font-bold text-sm text-amber-300">
                  <Trophy className="w-5 h-5 text-amber-400" />
                  <span>CAMPAIGN MASTERED!</span>
                </div>
                <p className="text-xs text-amber-200/80 leading-relaxed">
                  You have completed all 5 Java OOP Capstone Systems and mastered all 18 realms of Object-Oriented Programming!
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
          <div className="flex flex-wrap items-center justify-between gap-2 pb-1">
            <div className="flex items-center gap-2 text-xs text-slate-300 font-mono">
              <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-white font-medium">
                Main.java
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => {
                  setCode(activeSpec.skeletonCode);
                  setExecResult(null);
                }}
                className="px-2.5 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded transition-colors flex items-center gap-1 cursor-pointer"
                title="Reset editor to clean starter template"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
              <button
                onClick={handleRun}
                disabled={isRunning || isVerifying}
                className="px-3 py-1.5 text-xs text-slate-200 bg-slate-800 hover:bg-slate-700 rounded transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                <Play className="w-3 h-3 fill-current text-indigo-400" />
                <span>{isRunning ? 'Running...' : 'Run Code'}</span>
              </button>
              <button
                onClick={handleVerifyStage}
                disabled={isRunning || isVerifying}
                className="px-4 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{isVerifying ? 'Verifying...' : `Verify Project ${currentStage}`}</span>
              </button>
            </div>
          </div>

          <div className="min-h-[540px] h-[620px] resize-y overflow-hidden">
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
              <div className="space-y-3">
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
                      <span className="font-semibold">{t.passed ? 'PASSED' : 'MISSING'}</span>
                    </div>
                  ))}
                </div>
                {execResult.stdout && (
                  <pre className="text-slate-200 whitespace-pre-wrap leading-5 bg-[#05070d]/80 p-3 rounded border border-slate-800/80">
                    {execResult.stdout}
                  </pre>
                )}
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
