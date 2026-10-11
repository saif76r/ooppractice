import express from 'express';
import { createServer as createViteServer } from 'vite';
import { exec, spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { executeJavaAST } from './src/services/javaInterpreter.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '2mb' }));

// Helper to run command with timeout
function runExec(cmd: string, cwd: string, timeoutMs: number = 6000): Promise<{ stdout: string; stderr: string; code: number }> {
  return new Promise((resolve) => {
    exec(cmd, { cwd, timeout: timeoutMs, maxBuffer: 1024 * 512 }, (err, stdout, stderr) => {
      resolve({
        stdout: stdout ? stdout.toString() : '',
        stderr: stderr ? stderr.toString() : '',
        code: err ? (err.code ?? 1) : 0,
      });
    });
  });
}

// Fallback Java OOP Simulator when system javac/java binary is not installed in container
async function executeJavaWithFallback(code: string, tempDir: string, startTime: number): Promise<{
  success: boolean;
  compilationError: string | null;
  runtimeError: string | null;
  stdout: string;
  stderr: string;
  executionTimeMs: number;
}> {
  const mainJavaPath = path.join(tempDir, 'Main.java');
  fs.writeFileSync(mainJavaPath, code, 'utf-8');

  const compileResult = await runExec('javac Main.java', tempDir, 8000);
  const isJavacMissing =
    compileResult.code === 127 ||
    compileResult.stderr.includes('javac: not found') ||
    compileResult.stderr.includes('command not found');

  if (!isJavacMissing) {
    if (compileResult.code !== 0) {
      return {
        success: false,
        compilationError: compileResult.stderr || compileResult.stdout || 'Compilation failed',
        runtimeError: null,
        stdout: '',
        stderr: compileResult.stderr,
        executionTimeMs: Date.now() - startTime,
      };
    }

    const execResult = await runExec('java -Xmx128m -Xss1m Main', tempDir, 5000);
    return {
      success: execResult.code === 0,
      compilationError: null,
      runtimeError: execResult.code !== 0 ? (execResult.stderr || 'Execution terminated with error') : null,
      stdout: execResult.stdout,
      stderr: execResult.stderr,
      executionTimeMs: Date.now() - startTime,
    };
  }

  // Fallback when javac is not installed in the slim Node container
  if (!code.includes('class Main')) {
    return {
      success: false,
      compilationError: 'Main.java:1: error: class Main is public, should be declared in a file named Main.java',
      runtimeError: null,
      stdout: '',
      stderr: 'Main.java:1: error: class Main is missing',
      executionTimeMs: Date.now() - startTime,
    };
  }

  // Check balanced braces
  let braceDepth = 0;
  for (const ch of code) {
    if (ch === '{') braceDepth++;
    if (ch === '}') braceDepth--;
  }
  if (braceDepth !== 0) {
    return {
      success: false,
      compilationError: 'Main.java: error: reached end of file while parsing (unbalanced curly braces)',
      runtimeError: null,
      stdout: '',
      stderr: 'Main.java: error: reached end of file while parsing',
      executionTimeMs: Date.now() - startTime,
    };
  }

  // Run real Java OOP AST Interpreter first for fast, deterministic execution
  const astResult = executeJavaAST(code);
  if (astResult.success || astResult.runtimeError) {
    return {
      ...astResult,
      executionTimeMs: Date.now() - startTime,
    };
  }

  // If AST reported a syntax/symbol error and GEMINI_API_KEY is available, verify with Gemini
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
    for (const modelName of ['gemini-3.1-flash-lite', 'gemini-3.8-flash']) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: `Act as an exact Java 21 compiler (javac) and JVM (java Main). Evaluate the following Main.java code and return ONLY valid JSON with fields:
{
  "compilationError": string | null,
  "runtimeError": string | null,
  "stdout": string
}
Do not wrap in markdown code blocks. Be 100% faithful to Java syntax, types, access modifiers, and standard output.

Code:
${code}`,
        });
        if (response && response.text) {
          const cleanJson = response.text.trim().replace(/^```json\s*/i, '').replace(/```$/, '').trim();
          const parsed = JSON.parse(cleanJson);
          const hasCompErr = !!parsed.compilationError;
          const hasRunErr = !!parsed.runtimeError;
          return {
            success: !hasCompErr && !hasRunErr,
            compilationError: parsed.compilationError || null,
            runtimeError: parsed.runtimeError || null,
            stdout: parsed.stdout || '',
            stderr: parsed.compilationError || parsed.runtimeError || '',
            executionTimeMs: Date.now() - startTime,
          };
        }
      } catch {
        // Try next model or return AST diagnostic
      }
    }
  }

  return {
    ...astResult,
    executionTimeMs: Date.now() - startTime,
  };
}

// Java Compile & Run Endpoint
app.post('/api/java/run', async (req, res) => {
  const { code } = req.body;
  if (!code || typeof code !== 'string') {
    return res.status(400).json({ error: 'Java code string is required' });
  }

  const startTime = Date.now();
  const runId = Math.random().toString(36).substring(2, 9);
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), `oop-java-${runId}-`));

  try {
    const result = await executeJavaWithFallback(code, tempDir, startTime);
    return res.json(result);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown execution error';
    return res.status(500).json({ error: 'Internal execution fault', details: msg });
  } finally {
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch {
      // ignore cleanup errors
    }
  }
});

// Java Automated Test Suite Endpoint
app.post('/api/java/test', async (req, res) => {
  const { code, testCases = [] } = req.body;
  if (!code || typeof code !== 'string') {
    return res.status(400).json({ error: 'Code is required for test execution' });
  }

  const startTime = Date.now();
  const runId = Math.random().toString(36).substring(2, 9);
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), `oop-test-${runId}-`));

  try {
    const execResult = await executeJavaWithFallback(code, tempDir, startTime);
    if (execResult.compilationError) {
      return res.json({
        success: false,
        compilationError: execResult.compilationError,
        stdout: '',
        stderr: execResult.stderr,
        executionTimeMs: execResult.executionTimeMs,
        testResults: [],
        allTestsPassed: false,
      });
    }

    // 2. Run Test Cases
    const testResults: any[] = [];
    let allPassed = true;

    const normalizeOut = (s: string) =>
      s
        .replace(/\r\n/g, '\n')
        .split('\n')
        .map((line) => line.trimEnd())
        .join('\n')
        .trim();

    const actualOutput = normalizeOut(execResult.stdout || '');

    for (const tc of testCases) {
      const expectedOutput = normalizeOut(tc.expectedOutput || '');
      const passed = actualOutput === expectedOutput;
      if (!passed) allPassed = false;

      testResults.push({
        testCaseId: tc.id,
        description: tc.description,
        passed,
        input: tc.input || '',
        expected: tc.isHidden ? '[HIDDEN TEST CASE]' : expectedOutput,
        actual: tc.isHidden && !passed ? '[OUTPUT MISMATCH]' : actualOutput,
        isHidden: !!tc.isHidden,
      });
    }

    // If no test cases were provided, simply consider execution success
    if (testCases.length === 0) {
      allPassed = execResult.success;
    }

    return res.json({
      success: allPassed,
      compilationError: null,
      runtimeError: execResult.runtimeError,
      stdout: execResult.stdout,
      stderr: execResult.stderr,
      executionTimeMs: execResult.executionTimeMs,
      testResults,
      allTestsPassed: allPassed,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Test evaluation failed';
    return res.status(500).json({ error: 'Evaluation engine error', details: msg });
  } finally {
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch {}
  }
});

// AI Tutor Guidance Endpoint
app.post('/api/tutor/explain', async (req, res) => {
  const { code, concept, question, errorLog } = req.body;

  // Check if GEMINI_API_KEY is available
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
    const prompt = `You are the Arcane Java Tutor in OOP Quest, a gamified fantasy programming realm.
A student is working on Java OOP concept: "${concept || 'Object-Oriented Programming'}".
Student question / context: "${question || 'Explain how to solve this and fix any errors.'}"
Compiler / runtime logs: "${errorLog || 'None'}"
Student Java code:
\`\`\`java
${code || '// No code provided yet'}
\`\`\`

Instructions:
1. Explain the underlying OOP concept clearly and concisely.
2. If there are errors, explain WHY the Java compiler or JVM rejected the code.
3. Provide progressive hints (Hint 1: Concept, Hint 2: Specific class/method advice, Hint 3: Concrete pattern).
4. Do NOT simply write the entire final solution; empower the student to write the code themselves.
5. Keep the tone inspiring, educational, and fantasy-themed. Maximum 4 short paragraphs.`;

    for (const modelName of ['gemini-3.1-flash-lite', 'gemini-3.8-flash']) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: prompt,
        });

        if (response && response.text) {
          return res.json({ advice: response.text });
        }
      } catch (err) {
        console.warn(`Gemini tutor generation (${modelName}) fallback:`, err);
      }
    }
  }

  // Deterministic pedagogical fallback
  let fallbackAdvice = `**Arcane Tutor Guidance:**\n\n`;
  if (errorLog && errorLog.includes('cannot find symbol')) {
    fallbackAdvice += `• **Symbol Error:** The compiler cannot locate a variable, method, or class name. Double-check your spelling, ensure your fields are declared inside the class, and check case sensitivity (Java is strictly case-sensitive).\n\n`;
  } else if (errorLog && errorLog.includes('cannot be applied to')) {
    fallbackAdvice += `• **Argument Mismatch:** The method or constructor you called expects different parameter types or counts than what was passed. Verify your constructor signatures and parameter types.\n\n`;
  } else if (errorLog && errorLog.includes('NullPointerException')) {
    fallbackAdvice += `• **Null Pointer:** You are attempting to access a method or field on an object reference that has not been instantiated with the 'new' keyword yet.\n\n`;
  } else {
    fallbackAdvice += `• **Core Principle:** Remember the foundational law of ${concept || 'OOP'}: state belongs in fields, behaviors belong in methods, and constructors guarantee valid initial configurations.\n\n`;
  }

  fallbackAdvice += `• **Next Step:** Review the expected output and test criteria carefully, ensure all curly braces match, and test incremental statements.`;

  return res.json({ advice: fallbackAdvice });
});

// Start Dev or Production Server
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`OOP Quest server listening on http://0.0.0.0:${PORT}`);
  });
}

if (!process.env.VERCEL) {
  startServer();
}

export default app;

