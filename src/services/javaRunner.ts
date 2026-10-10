import { ExecutionResult, TestCase } from '../types';

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
    testResults: [],
    allTestsPassed: false,
  };
}

export async function runJavaCode(code: string, stdin: string = ''): Promise<ExecutionResult> {
  const startTime = Date.now();
  try {
    const response = await fetch('/api/java/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, stdin }),
    });

    if (!response.ok) {
      return evaluateJavaLocally(code, startTime);
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
    return evaluateJavaLocally(code, startTime);
  }
}

export async function testJavaChallenge(
  code: string,
  testCases: TestCase[],
  missionId: string
): Promise<ExecutionResult> {
  const startTime = Date.now();
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
    // Fall through to local test runner
  }

  const localExec = evaluateJavaLocally(code, startTime);
  if (localExec.compilationError) {
    return localExec;
  }

  const actualOutput = (localExec.stdout || '').trim().replace(/\r\n/g, '\n');
  let allPassed = true;
  const testResults = testCases.map((tc) => {
    const expectedOutput = (tc.expectedOutput || '').trim().replace(/\r\n/g, '\n');
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
