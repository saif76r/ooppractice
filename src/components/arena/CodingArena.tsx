import React, { useState, useEffect } from 'react';
import { Level, Mission, ExecutionResult, TestCase, UserProgress } from '../../types';
import { JavaEditor } from '../editor/JavaEditor';
import { runJavaCode, testJavaChallenge } from '../../services/javaRunner';
import confetti from 'canvas-confetti';
import { 
  Play, CheckCircle2, RotateCcw, Lightbulb, Terminal as TerminalIcon, 
  HelpCircle, ChevronLeft, Sparkles, Check, X, ShieldAlert, Clock, 
  ArrowRight, ListChecks, Code, BookOpen, ChevronDown, ChevronUp, Copy, CheckCheck, Eye
} from 'lucide-react';

interface CodingArenaProps {
  level: Level;
  mission?: Mission;
  isBossChallenge?: boolean;
  progress: UserProgress;
  onSuccess: (missionId: string, levelId: number, xpReward: number) => void;
  onBackToMap: () => void;
  onOpenTutor: (code: string, errorLog?: string) => void;
  onNextMission?: () => void;
}

export const CodingArena: React.FC<CodingArenaProps> = ({
  level,
  mission: initialMission,
  isBossChallenge: initialIsBoss = false,
  progress,
  onSuccess,
  onBackToMap,
  onOpenTutor,
}) => {
  // Active mission state (can be switched directly in the sidebar)
  const [isBossMode, setIsBossMode] = useState<boolean>(initialIsBoss);
  const [activeMission, setActiveMission] = useState<Mission | undefined>(
    initialMission || level.missions[0]
  );

  // Compute active task details
  const activeTitle = isBossMode
    ? level.bossChallenge.title
    : activeMission?.title || level.title;

  const defaultStarterCode = isBossMode
    ? level.bossChallenge.starterCode
    : activeMission?.starterCode || `public class Main {\n    public static void main(String[] args) {\n        // Write your code here based on the brief task on the left\n        \n    }\n}\n`;

  const activeTestCases: TestCase[] = isBossMode
    ? level.bossChallenge.testCases
    : activeMission?.testCases || [];

  const activeHints = isBossMode
    ? level.bossChallenge.hints
    : activeMission?.hints || [];

  // Helper to extract or generate structured tasks checklist
  const getTasksList = (): string[] => {
    if (isBossMode && level.bossChallenge.tasks && level.bossChallenge.tasks.length > 0) {
      return level.bossChallenge.tasks;
    }
    if (!isBossMode && activeMission?.tasks && activeMission.tasks.length > 0) {
      return activeMission.tasks;
    }
    if (!isBossMode && activeMission?.mode === 'predict_output') {
      return [
        'Inspect the provided Java code snippet',
        'Trace execution order, variable binding & compiler rules',
        'Select the exact console output option',
        'Confirm prediction to unlock explanation & XP',
      ];
    }
    // Fallback: create clear bullet points from description
    const rawDesc = isBossMode ? level.bossChallenge.description : (activeMission?.instructions || '');
    const sentences = rawDesc.split(/(?<=[.?!])\s+/).filter((s) => s.trim().length > 5);
    if (sentences.length > 0) {
      return sentences.slice(0, 4);
    }
    return [
      'Write the required Java class definition',
      'Declare instance fields and access modifiers',
      'Implement behaviors and methods',
      'Execute and match the expected output test contract',
    ];
  };

  const tasksList = getTasksList();

  // State
  const [code, setCode] = useState<string>(defaultStarterCode);
  const [activeConsoleTab, setActiveConsoleTab] = useState<'console' | 'tests'>('console');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [execResult, setExecResult] = useState<ExecutionResult | null>(null);
  const [unlockedHintIndex, setUnlockedHintIndex] = useState<number>(-1);
  const [isHintsOpen, setIsHintsOpen] = useState<boolean>(false);
  const [copiedTemplate, setCopiedTemplate] = useState<boolean>(false);
  const [selectedPredictIdx, setSelectedPredictIdx] = useState<number | null>(null);
  const [predictFeedback, setPredictFeedback] = useState<{ isSuccess: boolean; text: string } | null>(null);

  // When switching mission or boss mode, sync code
  useEffect(() => {
    const nextCode = isBossMode
      ? level.bossChallenge.starterCode
      : activeMission?.starterCode || `public class Main {\n    public static void main(String[] args) {\n        // Write your code here based on the brief task on the left\n        \n    }\n}\n`;
    setCode(nextCode);
    setExecResult(null);
    setUnlockedHintIndex(-1);
    setIsHintsOpen(false);
    setSelectedPredictIdx(null);
    setPredictFeedback(null);
  }, [isBossMode, activeMission, level]);

  const activeMissionId = isBossMode ? `boss_level_${level.id}` : (activeMission?.id || `m_${level.id}`);
  const isCurrentTaskCompleted = progress.completedMissionIds.includes(activeMissionId);

  // Verify Predict Output Task
  const handleVerifyPrediction = () => {
    if (selectedPredictIdx === null || !activeMission?.predictOptions) return;
    const chosen = activeMission.predictOptions[selectedPredictIdx];

    if (chosen.isCorrect) {
      setPredictFeedback({
        isSuccess: true,
        text: `Accurate prediction! ${activeMission.explanation}`,
      });
      try {
        confetti({
          particleCount: 85,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {}
      onSuccess(activeMissionId, level.id, activeMission.xpReward);
    } else {
      setPredictFeedback({
        isSuccess: false,
        text: activeMission.hints?.[0] || 'Incorrect prediction. Trace the execution flow and Java rules carefully!',
      });
    }
  };

  // Switch between missions directly in the sidebar
  const handleSelectMissionTab = (m: Mission) => {
    setIsBossMode(false);
    setActiveMission(m);
  };

  const handleSelectBossTab = () => {
    setIsBossMode(true);
    setActiveMission(undefined);
  };

  // Run Code on OpenJDK 17
  const handleRun = async () => {
    setIsRunning(true);
    setActiveConsoleTab('console');
    try {
      const result = await runJavaCode(code);
      setExecResult(result);
    } finally {
      setIsRunning(false);
    }
  };

  // Submit and verify against test cases
  const handleSubmit = async () => {
    setIsVerifying(true);
    setActiveConsoleTab('tests');
    try {
      const result = await testJavaChallenge(code, activeTestCases, activeMissionId);
      setExecResult(result);

      if (result.allTestsPassed) {
        try {
          confetti({
            particleCount: 90,
            spread: 75,
            origin: { y: 0.6 },
          });
        } catch {}

        const xp = isBossMode ? 200 : (activeMission?.xpReward || 75);
        onSuccess(activeMissionId, level.id, xp);
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResetCode = () => {
    if (confirm('Reset code back to original starter template?')) {
      setCode(defaultStarterCode);
      setExecResult(null);
    }
  };

  const handleCopyStarter = () => {
    navigator.clipboard.writeText(defaultStarterCode);
    setCopiedTemplate(true);
    setTimeout(() => setCopiedTemplate(false), 2000);
  };

  // Move to next mission in this level
  const handleAdvanceToNextTask = () => {
    if (isBossMode) {
      // Completed boss: return to map
      onBackToMap();
      return;
    }
    const curIdx = level.missions.findIndex((m) => m.id === activeMission?.id);
    if (curIdx >= 0 && curIdx < level.missions.length - 1) {
      setActiveMission(level.missions[curIdx + 1]);
    } else {
      // Last mission cleared: switch to Boss Battle!
      handleSelectBossTab();
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-5 px-3 md:px-8">
      {/* Top Header / Breadcrumb & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToMap}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-md transition-colors cursor-pointer"
            title="Return to Adventure Map"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-indigo-400">
              <span>LEVEL {level.id < 10 ? `0${level.id}` : level.id}: {level.title.toUpperCase()}</span>
              <span>·</span>
              <span className="text-slate-400">{level.realmName}</span>
            </div>
            <h1 className="text-base md:text-lg font-display font-bold text-white mt-0.5">
              {activeTitle}
            </h1>
          </div>
        </div>

        {/* Global Toolbar */}
        <div className="flex items-center gap-2">
          {!isBossMode && activeMission?.mode === 'predict_output' ? (
            <>
              <button
                onClick={handleRun}
                disabled={isRunning}
                className="px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                title="Execute code snippet in real OpenJDK 17 environment"
              >
                <Play className="w-3.5 h-3.5 fill-current text-indigo-400" />
                <span>{isRunning ? 'Running...' : 'Run in Sandbox'}</span>
              </button>

              <button
                onClick={handleVerifyPrediction}
                disabled={selectedPredictIdx === null || isCurrentTaskCompleted}
                className="px-4 py-1.5 text-xs font-medium text-white bg-purple-600 hover:bg-purple-500 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm shadow-purple-900 disabled:opacity-50"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Confirm Output</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  if (confirm('Start with a blank file?')) {
                    setCode(`public class Main {\n    public static void main(String[] args) {\n        // Write your code here from scratch\n        \n    }\n}\n`);
                    setExecResult(null);
                  }
                }}
                className="px-2.5 py-1.5 text-xs text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
                title="Start from clean blank template"
              >
                <span>Blank</span>
              </button>

              <button
                onClick={handleResetCode}
                className="px-2.5 py-1.5 text-xs text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Reset to Starter Skeleton"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>

              <button
                onClick={handleRun}
                disabled={isRunning || isVerifying}
                className="px-3.5 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5 fill-current text-indigo-400" />
                <span>{isRunning ? 'Running...' : 'Run Code'}</span>
              </button>

              <button
                onClick={handleSubmit}
                disabled={isRunning || isVerifying}
                className="px-4 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm shadow-indigo-900 disabled:opacity-50"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{isVerifying ? 'Checking...' : 'Check & Submit'}</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Two-Panel Layout: LEFT = BRIEF TASK, RIGHT = JAVA IDE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* ========================================================= */}
        {/* LEFT PANEL: BRIEF TASKS SIDEBAR (Width 5 cols on lg)      */}
        {/* ========================================================= */}
        <div className="lg:col-span-5 bg-[#0b0e1b]/55 backdrop-blur-md border border-slate-800/80 rounded-xl overflow-hidden shadow-xl flex flex-col space-y-5 p-5 md:p-6 sticky top-20 max-h-[calc(100vh-100px)] overflow-y-auto">
          
          {/* Mission Stepper Tabs */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs font-mono text-slate-300">
              <span className="font-semibold uppercase tracking-wider text-indigo-400">
                Level Tasks & Missions
              </span>
              <span className="text-slate-400">
                {progress.completedMissionIds.filter((id) =>
                  level.missions.some((m) => m.id === id) || id === `boss_level_${level.id}`
                ).length} / {level.missions.length + 1} Cleared
              </span>
            </div>

            {/* Stepper Buttons */}
            <div className="flex flex-wrap gap-2 p-2 bg-slate-950/45 rounded-xl border border-slate-800/70">
              {level.missions.map((m, idx) => {
                const isSelected = !isBossMode && activeMission?.id === m.id;
                const isDone = progress.completedMissionIds.includes(m.id);
                const isPredict = m.mode === 'predict_output';
                return (
                  <button
                    key={m.id}
                    onClick={() => handleSelectMissionTab(m)}
                    className={`px-3 py-1.5 text-xs rounded-lg transition-all flex items-center gap-1.5 cursor-pointer font-medium tracking-wide ${
                      isSelected
                        ? isPredict
                          ? 'bg-purple-600 text-white shadow-sm ring-1 ring-purple-400/50'
                          : 'bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-400/50'
                        : isDone
                        ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-900/60'
                        : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
                    }`}
                  >
                    {isDone ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <span className="text-[11px] font-mono opacity-80">{idx + 1}.</span>
                    )}
                    <span>Task {idx + 1}</span>
                    {isPredict && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-800/60 font-mono">
                        Output
                      </span>
                    )}
                  </button>
                );
              })}

              {/* Boss Challenge Tab */}
              <button
                onClick={handleSelectBossTab}
                className={`px-3 py-1.5 text-xs rounded-lg transition-all flex items-center gap-1.5 cursor-pointer font-medium tracking-wide ${
                  isBossMode
                    ? 'bg-amber-600 text-white shadow-sm'
                    : progress.completedMissionIds.includes(`boss_level_${level.id}`)
                    ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-900/60'
                    : 'text-amber-400/90 hover:text-amber-300 hover:bg-amber-950/30'
                }`}
              >
                <span>Boss</span>
              </button>
            </div>
          </div>

          {/* Active Mission Brief Header */}
          <div className="p-5 bg-slate-900/45 border border-slate-800/80 rounded-xl space-y-3.5">
            <div className="flex items-center justify-between gap-2">
              <span className={`text-[11px] font-mono px-2.5 py-1 rounded-md border font-semibold uppercase tracking-wider ${
                isBossMode
                  ? 'bg-amber-950/60 border-amber-800 text-amber-300'
                  : activeMission?.mode === 'predict_output'
                  ? 'bg-purple-950/60 border-purple-800 text-purple-300'
                  : 'bg-slate-800/80 border-slate-700/80 text-indigo-300'
              }`}>
                {isBossMode
                  ? 'Boss Challenge'
                  : activeMission?.mode === 'predict_output'
                  ? `Task ${activeMission?.number || 1} · Output Finding Trial`
                  : `Task ${activeMission?.number || 1}`}
              </span>
              <span className="text-xs font-mono text-indigo-300 font-semibold">
                +{isBossMode ? 200 : (activeMission?.xpReward || 75)} XP
              </span>
            </div>
            
            <div className="space-y-2.5">
              <h2 className="text-base md:text-lg font-bold text-white leading-snug tracking-tight">
                {activeTitle}
              </h2>
              {!isBossMode && activeMission?.conceptSummary && (
                <div className="text-xs text-indigo-200/90 bg-indigo-950/35 border border-indigo-800/40 rounded-lg px-3 py-2 leading-relaxed">
                  {activeMission.conceptSummary}
                </div>
              )}
              {/* Primary Objective Description */}
              <p className="text-sm text-slate-200 leading-7 font-normal tracking-[0.01em] break-words whitespace-pre-line">
                {isBossMode ? level.bossChallenge.description : (activeMission?.instructions || activeMission?.storyIntro)}
              </p>
            </div>
          </div>

          {/* SPECIFIC REQUIRED TASKS CHECKLIST */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-200 flex items-center gap-2 uppercase tracking-wider">
                <ListChecks className="w-4 h-4 text-indigo-400" />
                <span>Requirements</span>
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {(activeMission?.mode === 'predict_output' ? isCurrentTaskCompleted : (execResult?.allTestsPassed || isCurrentTaskCompleted))
                  ? `${tasksList.length}/${tasksList.length} Complete`
                  : `0/${tasksList.length} Complete`}
              </span>
            </div>

            <div className="space-y-2.5">
              {tasksList.map((taskText, idx) => {
                const isTaskDone = activeMission?.mode === 'predict_output'
                  ? isCurrentTaskCompleted
                  : (execResult?.allTestsPassed || isCurrentTaskCompleted);
                return (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-xl border text-xs md:text-[13.5px] transition-colors flex items-start gap-3 ${
                      isTaskDone
                        ? 'bg-emerald-950/25 border-emerald-800/50 text-emerald-200'
                        : 'bg-slate-900/40 border-slate-800/70 text-slate-200'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 text-[11px] font-mono font-semibold ${
                        isTaskDone
                          ? 'bg-emerald-600 text-white'
                          : 'border border-slate-700 bg-slate-800/80 text-slate-300'
                      }`}
                    >
                      {isTaskDone ? (
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      ) : (
                        idx + 1
                      )}
                    </div>
                    <div className="flex-1 leading-relaxed tracking-[0.01em] text-slate-100 break-words">
                      {taskText}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Expected Output Contract Box */}
          {activeTestCases.length > 0 && !activeTestCases[0].isHidden && (
            <div className="p-4 bg-slate-900/45 border border-slate-800/80 rounded-xl space-y-2.5 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 text-xs font-semibold flex items-center gap-2">
                  <Code className="w-4 h-4 text-indigo-400" />
                  <span>Expected Console Output</span>
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(activeTestCases[0].expectedOutput);
                  }}
                  className="text-xs text-slate-300 hover:text-white flex items-center gap-1.5 cursor-pointer transition-colors"
                  title="Copy expected output"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </button>
              </div>
              <pre className="bg-[#05070d]/65 p-3.5 rounded-lg text-slate-100 text-xs whitespace-pre-wrap border border-slate-800/70 font-mono leading-6 tracking-wide">
                {activeTestCases[0].expectedOutput}
              </pre>
            </div>
          )}

          {/* Hints Accordion */}
          {activeHints.length > 0 && (
            <div className="border border-slate-800/80 rounded-lg bg-slate-900/40 overflow-hidden">
              <button
                onClick={() => setIsHintsOpen(!isHintsOpen)}
                className="w-full p-2.5 flex items-center justify-between text-xs text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-1.5 font-medium">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                  <span>Need guidance? ({activeHints.length} hint{activeHints.length > 1 ? 's' : ''})</span>
                </span>
                {isHintsOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {isHintsOpen && (
                <div className="p-3 pt-0 space-y-2 border-t border-slate-800">
                  {activeHints.map((hint, idx) => {
                    const isRevealed = idx <= unlockedHintIndex;
                    return (
                      <div
                        key={idx}
                        className={`p-2 rounded text-xs ${
                          isRevealed
                            ? 'bg-slate-900 text-indigo-200 border border-slate-800'
                            : 'bg-slate-950/60 text-slate-500 border border-slate-900'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[11px] font-medium mb-0.5">
                          <span>Hint {idx + 1}</span>
                          {!isRevealed && (
                            <button
                              onClick={() => setUnlockedHintIndex(idx)}
                              className="text-indigo-400 hover:underline cursor-pointer text-[10px]"
                            >
                              Reveal Hint
                            </button>
                          )}
                        </div>
                        {isRevealed ? (
                          <p className="text-[11px] text-slate-300 leading-relaxed">{hint}</p>
                        ) : (
                          <span className="italic text-[10px] text-slate-500">Click to reveal clue</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}



          {/* Completion Banner with "Next Task" advancement */}
          {(execResult?.allTestsPassed || isCurrentTaskCompleted) && (
            <div className="p-3.5 bg-emerald-950/40 border border-emerald-800/80 rounded-lg text-xs text-emerald-300 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-semibold">Task Verified & Completed!</span>
              </div>
              <button
                onClick={handleAdvanceToNextTask}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm"
              >
                <span>{isBossMode ? 'Back to Map' : 'Next Task'}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* RIGHT PANEL: LIVE JAVA CODE EDITOR + OUTPUT TERMINAL      */}
        {/* ========================================================= */}
        <div className="lg:col-span-7 flex flex-col space-y-3">
          
          {/* File Tab & Shortcut Help */}
          <div className="flex items-center justify-between bg-[#080b14]/60 backdrop-blur-md border border-slate-800/80 rounded-t-lg px-3 py-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900/75 border border-slate-700/80 text-white font-mono font-medium">
                <Code className="w-3.5 h-3.5 text-indigo-400" />
                <span>Main.java</span>
              </span>
              <span className="text-[11px] text-purple-400 font-mono hidden sm:inline">
                {!isBossMode && activeMission?.mode === 'predict_output'
                  ? 'Output Prediction Trial'
                  : '(OpenJDK 17 Target)'}
              </span>
            </div>

            <div className="flex items-center gap-3 text-[11px] text-slate-300 font-mono">
              <button
                onClick={handleCopyStarter}
                className="hover:text-white flex items-center gap-1 cursor-pointer"
                title="Copy code"
              >
                {copiedTemplate ? <CheckCheck className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedTemplate ? 'Copied' : 'Copy'}</span>
              </button>
              {(!isBossMode && activeMission?.mode === 'predict_output') ? (
                <span className="hidden sm:inline text-slate-400">Trace stdout</span>
              ) : (
                <span className="hidden sm:inline">Ctrl+Enter to Run</span>
              )}
            </div>
          </div>

          {!isBossMode && activeMission?.mode === 'predict_output' ? (
            <div className="bg-[#080b14]/55 backdrop-blur-md border border-t-0 border-slate-800/80 rounded-b-lg p-4 space-y-4">
              {/* Code Snippet Box */}
              <div className="p-3.5 bg-[#05070d]/55 border border-slate-800/80 rounded-lg font-mono text-xs text-slate-200 overflow-x-auto max-h-[240px]">
                <div className="text-slate-400 text-[10px] uppercase tracking-wider mb-1.5 font-sans font-semibold flex items-center justify-between">
                  <span>// Java Code Under Execution:</span>
                  <span className="text-slate-500 font-mono">OpenJDK 17 Target</span>
                </div>
                <pre className="whitespace-pre leading-relaxed font-mono text-slate-100">
                  {code}
                </pre>
              </div>

              {/* Multiple Choice Options for Console Output */}
              <div>
                <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider block mb-2">
                  Select Expected Console Output:
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {(activeMission?.predictOptions || []).map((opt, idx) => {
                    const isSelected = selectedPredictIdx === idx;
                    const letter = String.fromCharCode(65 + idx);
                    return (
                      <div
                        key={idx}
                        onClick={() => {
                          setSelectedPredictIdx(idx);
                          setPredictFeedback(null);
                        }}
                        className={`p-3 rounded-lg border text-xs font-mono transition-all cursor-pointer flex items-start gap-3 ${
                          isSelected
                            ? 'bg-purple-950/50 border-purple-500 text-purple-200 ring-1 ring-purple-500/60 shadow-md shadow-purple-950/50'
                            : 'bg-slate-900/50 border-slate-800/80 text-slate-200 hover:border-slate-700 hover:bg-slate-800/60'
                        }`}
                      >
                        <span
                          className={`w-5 h-5 rounded flex items-center justify-center shrink-0 mt-0.5 text-[11px] font-sans font-bold ${
                            isSelected
                              ? 'bg-purple-600 text-white'
                              : 'bg-slate-800 border border-slate-700 text-slate-400'
                          }`}
                        >
                          {letter}
                        </span>
                        <div className="flex-1 whitespace-pre-wrap leading-relaxed">
                          {opt.text}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Predict Output Feedback */}
              {predictFeedback && (
                <div
                  className={`p-3.5 rounded-lg text-xs flex items-start gap-2.5 ${
                    predictFeedback.isSuccess
                      ? 'bg-emerald-950/50 border border-emerald-800 text-emerald-300'
                      : 'bg-red-950/50 border border-red-900 text-red-300'
                  }`}
                >
                  {predictFeedback.isSuccess ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  )}
                  <div className="leading-relaxed">
                    {predictFeedback.text}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Code Editor */
            <div className="h-[430px] rounded-b-lg overflow-hidden border border-t-0 border-slate-800/80">
              <JavaEditor code={code} onChange={setCode} onRunShortcut={handleRun} />
            </div>
          )}

          {/* Bottom Execution Console & Test Output */}
          <div className="bg-[#0b0e1b]/55 backdrop-blur-md border border-slate-800/80 rounded-lg overflow-hidden flex flex-col min-h-[220px]">
            {/* Console Tabs */}
            <div className="flex items-center justify-between bg-[#080b14]/50 border-b border-slate-800/80 px-3 py-1.5 text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveConsoleTab('console')}
                  className={`px-2.5 py-1 rounded transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeConsoleTab === 'console'
                      ? 'bg-slate-800/80 text-white font-medium'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <TerminalIcon className="w-3.5 h-3.5" />
                  <span>Terminal Output</span>
                </button>

                <button
                  onClick={() => setActiveConsoleTab('tests')}
                  className={`px-2.5 py-1 rounded transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeConsoleTab === 'tests'
                      ? 'bg-slate-800/80 text-white font-medium'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Test Results</span>
                  {execResult?.testResults && (
                    <span className="font-mono text-[10px] bg-slate-900/80 px-1.5 py-0.2 rounded text-indigo-300">
                      {execResult.testResults.filter((t) => t.passed).length}/{execResult.testResults.length}
                    </span>
                  )}
                </button>
              </div>

              {execResult?.executionTimeMs !== undefined && (
                <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{execResult.executionTimeMs}ms</span>
                </div>
              )}
            </div>

            {/* Console Content */}
            <div className="p-3.5 font-mono text-xs overflow-y-auto max-h-[200px] flex-1">
              {activeConsoleTab === 'console' && (
                <div>
                  {execResult?.compilationError ? (
                    <div className="text-red-400 space-y-1">
                      <div className="flex items-center gap-1.5 font-semibold text-red-300">
                        <ShieldAlert className="w-3.5 h-3.5" />
                        <span>Compilation Error:</span>
                      </div>
                      <pre className="whitespace-pre-wrap text-[11px] bg-red-950/30 p-2 rounded border border-red-900/50">
                        {execResult.compilationError}
                      </pre>
                    </div>
                  ) : execResult?.runtimeError ? (
                    <div className="text-amber-400 space-y-1">
                      <span className="font-semibold">Runtime Exception:</span>
                      <pre className="whitespace-pre-wrap text-[11px] bg-amber-950/30 p-2 rounded border border-amber-900/50">
                        {execResult.runtimeError}
                      </pre>
                    </div>
                  ) : execResult?.stdout ? (
                    <pre className="text-slate-100 whitespace-pre-wrap leading-5">
                      {execResult.stdout}
                    </pre>
                  ) : (
                    <div className="text-slate-400 italic">
                      Click "Run Code" to compile and run with OpenJDK 17, or "Check & Submit" to verify tasks.
                    </div>
                  )}
                </div>
              )}

              {activeConsoleTab === 'tests' && (
                <div>
                  {!execResult?.testResults || execResult.testResults.length === 0 ? (
                    <div className="text-slate-400 italic">
                      No test verification performed yet. Click "Check & Submit" above.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {execResult.testResults.map((t, idx) => (
                        <div
                          key={t.testCaseId || idx}
                          className={`p-2.5 rounded border text-[11px] ${
                            t.passed
                              ? 'bg-emerald-950/20 border-emerald-900/40 text-emerald-300'
                              : 'bg-red-950/20 border-red-900/40 text-red-300'
                          }`}
                        >
                          <div className="flex items-center justify-between font-semibold">
                            <span className="flex items-center gap-1.5">
                              {t.passed ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <X className="w-3.5 h-3.5 text-red-400" />}
                              <span>{t.description || `Test Case #${idx + 1}`}</span>
                            </span>
                            <span>{t.passed ? 'PASSED' : 'FAILED'}</span>
                          </div>
                          {!t.passed && !t.isHidden && (
                            <div className="mt-1.5 text-slate-400 text-[10px] space-y-0.5 bg-slate-950/60 p-2 rounded border border-slate-900">
                              <div>Expected: <span className="text-slate-200">{t.expected}</span></div>
                              <div>Actual Output: <span className="text-red-300">{t.actual}</span></div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
