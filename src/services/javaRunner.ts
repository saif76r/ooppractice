import { ExecutionResult, TestCase } from '../types';
<<<<<<< HEAD
import { executeJavaAST } from './javaInterpreter';

function evaluateJavaLocally(code: string): ExecutionResult {
  const res = executeJavaAST(code);
  return {
    success: res.success,
    compilationError: res.compilationError || undefined,
    runtimeError: res.runtimeError || undefined,
    stdout: res.stdout,
    stderr: res.stderr,
    executionTimeMs: res.executionTimeMs,
=======

function evaluateJavaLocally(code: string, startTime: number): ExecutionResult {
  if (!code.includes('class Main')) {
    return {
      success: false,
      compilationError: 'Main.java:1: error: class Main is public, should be declared in a file named Main.java',
      stdout: '',
      stderr: 'Main.java:1: error: class Main is missing',
      executionTimeMs: Date.now() - startTime,
      testResults: [],
      allTestsPassed: false,
    };
  }

  let braceDepth = 0;
  for (const ch of code) {
    if (ch === '{') braceDepth++;
    if (ch === '}') braceDepth--;
  }
  if (braceDepth !== 0) {
    return {
      success: false,
      compilationError: 'Main.java: error: reached end of file while parsing (unbalanced curly braces)',
      stdout: '',
      stderr: 'Main.java: error: reached end of file while parsing',
      executionTimeMs: Date.now() - startTime,
      testResults: [],
      allTestsPassed: false,
    };
  }

  const lines: string[] = [];
  const printRegex = /System\.out\.print(ln)?\s*\(([\s\S]*?)\)\s*;/g;
  let match: RegExpExecArray | null;
  while ((match = printRegex.exec(code)) !== null) {
    const isLn = match[1] === 'ln';
    const rawArg = match[2].trim();
    const cleaned = rawArg
      .split('+')
      .map((part) => {
        const p = part.trim();
        if ((p.startsWith('"') && p.endsWith('"')) || (p.startsWith("'") && p.endsWith("'"))) {
          return p.slice(1, -1);
        }
        return p;
      })
      .join('');
    lines.push(cleaned + (isLn ? '\n' : ''));
  }

  return {
    success: true,
    compilationError: undefined,
    runtimeError: undefined,
    stdout: lines.join(''),
    stderr: '',
    executionTimeMs: Date.now() - startTime,
>>>>>>> 6a506dd38b589a6991af7f5686d901b239d59e23
    testResults: [],
    allTestsPassed: false,
  };
}

export async function runJavaCode(code: string, stdin: string = ''): Promise<ExecutionResult> {
<<<<<<< HEAD
=======
  const startTime = Date.now();
>>>>>>> 6a506dd38b589a6991af7f5686d901b239d59e23
  try {
    const response = await fetch('/api/java/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, stdin }),
    });

    if (!response.ok) {
<<<<<<< HEAD
      return evaluateJavaLocally(code);
=======
      return evaluateJavaLocally(code, startTime);
>>>>>>> 6a506dd38b589a6991af7f5686d901b239d59e23
    }

    const data = await response.json();
    return {
      success: data.success,
      compilationError: data.compilationError,
      runtimeError: data.runtimeError,
      stdout: data.stdout || '',
      stderr: data.stderr || '',
      executionTimeMs: data.executionTimeMs || 0,
      testResults: [],
      allTestsPassed: false,
    };
  } catch {
<<<<<<< HEAD
    return evaluateJavaLocally(code);
=======
    return evaluateJavaLocally(code, startTime);
>>>>>>> 6a506dd38b589a6991af7f5686d901b239d59e23
  }
}

export async function testJavaChallenge(
  code: string,
  testCases: TestCase[],
  missionId: string
): Promise<ExecutionResult> {
<<<<<<< HEAD
=======
  const startTime = Date.now();
>>>>>>> 6a506dd38b589a6991af7f5686d901b239d59e23
  try {
    const response = await fetch('/api/java/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, testCases, missionId }),
    });

    if (response.ok) {
      return await response.json();
    }
  } catch {
<<<<<<< HEAD
    // Fall through to local AST test runner
  }

  const localExec = evaluateJavaLocally(code);
=======
    // Fall through to local test runner
  }

  const localExec = evaluateJavaLocally(code, startTime);
>>>>>>> 6a506dd38b589a6991af7f5686d901b239d59e23
  if (localExec.compilationError) {
    return localExec;
  }

<<<<<<< HEAD
  const normalizeOut = (s: string) =>
    s
      .replace(/\r\n/g, '\n')
      .split('\n')
      .map((line) => line.trimEnd())
      .join('\n')
      .trim();

  const actualOutput = normalizeOut(localExec.stdout || '');
  let allPassed = true;
  const testResults = testCases.map((tc) => {
    const expectedOutput = normalizeOut(tc.expectedOutput || '');
=======
  const actualOutput = (localExec.stdout || '').trim().replace(/\r\n/g, '\n');
  let allPassed = true;
  const testResults = testCases.map((tc) => {
    const expectedOutput = (tc.expectedOutput || '').trim().replace(/\r\n/g, '\n');
>>>>>>> 6a506dd38b589a6991af7f5686d901b239d59e23
    const passed = actualOutput === expectedOutput;
    if (!passed) allPassed = false;
    return {
      testCaseId: tc.id,
      description: tc.description,
      passed,
      input: tc.input || '',
      expected: tc.isHidden ? '[HIDDEN TEST CASE]' : expectedOutput,
      actual: tc.isHidden && !passed ? '[OUTPUT MISMATCH]' : actualOutput,
      isHidden: !!tc.isHidden,
    };
  });

  if (testCases.length === 0) {
    allPassed = localExec.success;
  }

  return {
    ...localExec,
    success: allPassed,
    testResults,
    allTestsPassed: allPassed,
  };
}

export async function askAITutor(
  code: string,
  concept: string,
  question: string,
  errorLog?: string
): Promise<{ advice: string; hintTier?: number }> {
  try {
    const response = await fetch('/api/tutor/explain', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, concept, question, errorLog }),
    });

    if (!response.ok) {
      return {
        advice: 'Focus on the required method signature and ensure all syntax matches standard Java OOP guidelines.',
      };
    }

    const data = await response.json();
    return data;
  } catch {
    return {
      advice: 'The Arcane AI Tutor recommends double-checking access modifiers and class bracket closures.',
    };
  }
}
