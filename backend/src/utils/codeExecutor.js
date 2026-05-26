const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { v4: uuidv4 } = require('uuid');

const TIMEOUT_MS = 5000; // 5 second hard limit

/**
 * Sanitize code to remove dangerous operations
 */
const sanitizeCode = (code, language) => {
  // Common dangerous patterns
  const dangerousPatterns = {
    javascript: [
      /require\s*\(\s*['"]child_process['"]\s*\)/g,
      /require\s*\(\s*['"]fs['"]\s*\)/g,
      /process\.exit/g,
      /eval\s*\(/g,
      /Function\s*\(/g,
      /\bfetch\s*\(/g,
      /XMLHttpRequest/g,
      /require\s*\(\s*['"]http['"]\s*\)/g,
      /require\s*\(\s*['"]https['"]\s*\)/g,
      /require\s*\(\s*['"]net['"]\s*\)/g,
    ],
    python: [
      /import\s+os\b/g,
      /import\s+sys\b/g,
      /import\s+subprocess\b/g,
      /from\s+os\b/g,
      /from\s+sys\b/g,
      /from\s+subprocess\b/g,
      /open\s*\(/g,
      /__import__\s*\(/g,
      /exec\s*\(/g,
      /eval\s*\(/g,
      /import\s+socket\b/g,
      /import\s+requests\b/g,
    ],
    c: [/system\s*\(/g, /popen\s*\(/g, /execvp\s*\(/g, /fopen\s*\(/g],
    cpp: [/system\s*\(/g, /popen\s*\(/g, /execvp\s*\(/g, /fopen\s*\(/g],
    java: [
      /Runtime\.getRuntime\(\)/g,
      /ProcessBuilder/g,
      /new\s+File\s*\(/g,
      /FileOutputStream/g,
      /FileInputStream/g,
    ],
  };

  const patterns = dangerousPatterns[language] || [];
  for (const pattern of patterns) {
    if (pattern.test(code)) {
      return { safe: false, reason: `Potentially dangerous code pattern detected in ${language} code.` };
    }
  }

  return { safe: true };
};

/**
 * Execute a shell command with a timeout
 */
const executeCommand = (command, options = {}) => {
  return new Promise((resolve) => {
    const startTime = Date.now();

    const child = exec(
      command,
      {
        timeout: TIMEOUT_MS,
        maxBuffer: 1024 * 1024, // 1MB output limit
        ...options,
      },
      (error, stdout, stderr) => {
        const executionTime = Date.now() - startTime;

        if (error) {
          if (error.killed || error.signal === 'SIGTERM' || executionTime >= TIMEOUT_MS - 100) {
            resolve({
              output: '',
              error: 'Time limit exceeded (5 seconds)',
              executionTime,
              status: 'time-limit-exceeded',
            });
          } else if (stderr && stderr.trim()) {
            resolve({
              output: stdout || '',
              error: stderr.trim(),
              executionTime,
              status: 'runtime-error',
            });
          } else {
            resolve({
              output: stdout || '',
              error: error.message,
              executionTime,
              status: 'runtime-error',
            });
          }
        } else {
          resolve({
            output: stdout || '',
            error: stderr || '',
            executionTime,
            status: 'success',
          });
        }
      }
    );
  });
};

/**
 * Clean up temp files
 */
const cleanup = (files) => {
  for (const file of files) {
    try {
      if (fs.existsSync(file)) {
        fs.unlinkSync(file);
      }
    } catch (e) {
      // ignore cleanup errors
    }
  }
};

/**
 * Run JavaScript code
 */
const runJavaScript = async (code, input = '') => {
  const tmpDir = os.tmpdir();
  const fileId = uuidv4();
  const filePath = path.join(tmpDir, `cc_${fileId}.js`);
  const toClean = [filePath];

  try {
    // Wrap code to handle stdin input
    const wrappedCode = input
      ? `
const lines = ${JSON.stringify(input.trim().split('\n'))};
let lineIndex = 0;
const readline = () => lines[lineIndex++] || '';
const input_line = readline;
${code}
`
      : code;

    fs.writeFileSync(filePath, wrappedCode, 'utf-8');

    const result = await executeCommand(`node "${filePath}"`, { cwd: tmpDir });
    cleanup(toClean);
    return result;
  } catch (err) {
    cleanup(toClean);
    return { output: '', error: err.message, executionTime: 0, status: 'runtime-error' };
  }
};

/**
 * Run Python code
 */
const runPython = async (code, input = '') => {
  const tmpDir = os.tmpdir();
  const fileId = uuidv4();
  const filePath = path.join(tmpDir, `cc_${fileId}.py`);
  const inputPath = path.join(tmpDir, `cc_${fileId}.txt`);
  const toClean = [filePath, inputPath];

  try {
    fs.writeFileSync(filePath, code, 'utf-8');
    fs.writeFileSync(inputPath, input, 'utf-8');

    const pythonCmd = process.platform === 'win32' ? 'python' : 'python3';
    const command = `${pythonCmd} "${filePath}" < "${inputPath}"`;

    const result = await executeCommand(command, { cwd: tmpDir });
    cleanup(toClean);
    return result;
  } catch (err) {
    cleanup(toClean);
    return { output: '', error: err.message, executionTime: 0, status: 'runtime-error' };
  }
};

/**
 * Run C code
 */
const runC = async (code, input = '') => {
  const tmpDir = os.tmpdir();
  const fileId = uuidv4();
  const srcPath = path.join(tmpDir, `cc_${fileId}.c`);
  const exePath = path.join(tmpDir, `cc_${fileId}${process.platform === 'win32' ? '.exe' : ''}`);
  const inputPath = path.join(tmpDir, `cc_${fileId}_in.txt`);
  const toClean = [srcPath, exePath, inputPath];

  try {
    fs.writeFileSync(srcPath, code, 'utf-8');
    fs.writeFileSync(inputPath, input, 'utf-8');

    // Compile
    const compileResult = await executeCommand(`gcc "${srcPath}" -o "${exePath}" -lm`, { cwd: tmpDir });

    if (compileResult.status !== 'success' || compileResult.error) {
      cleanup(toClean);
      return {
        output: '',
        error: compileResult.error || 'Compilation failed',
        executionTime: compileResult.executionTime,
        status: 'compilation-error',
      };
    }

    // Run
    const runCommand =
      process.platform === 'win32'
        ? `"${exePath}" < "${inputPath}"`
        : `"${exePath}" < "${inputPath}"`;

    const result = await executeCommand(runCommand, { cwd: tmpDir });
    cleanup(toClean);
    return result;
  } catch (err) {
    cleanup(toClean);
    return { output: '', error: err.message, executionTime: 0, status: 'runtime-error' };
  }
};

/**
 * Run C++ code
 */
const runCpp = async (code, input = '') => {
  const tmpDir = os.tmpdir();
  const fileId = uuidv4();
  const srcPath = path.join(tmpDir, `cc_${fileId}.cpp`);
  const exePath = path.join(tmpDir, `cc_${fileId}${process.platform === 'win32' ? '.exe' : ''}`);
  const inputPath = path.join(tmpDir, `cc_${fileId}_in.txt`);
  const toClean = [srcPath, exePath, inputPath];

  try {
    fs.writeFileSync(srcPath, code, 'utf-8');
    fs.writeFileSync(inputPath, input, 'utf-8');

    // Compile
    const compileResult = await executeCommand(`g++ -std=c++17 "${srcPath}" -o "${exePath}"`, { cwd: tmpDir });

    if (compileResult.status !== 'success' || compileResult.error) {
      cleanup(toClean);
      return {
        output: '',
        error: compileResult.error || 'Compilation failed',
        executionTime: compileResult.executionTime,
        status: 'compilation-error',
      };
    }

    // Run
    const result = await executeCommand(`"${exePath}" < "${inputPath}"`, { cwd: tmpDir });
    cleanup(toClean);
    return result;
  } catch (err) {
    cleanup(toClean);
    return { output: '', error: err.message, executionTime: 0, status: 'runtime-error' };
  }
};

/**
 * Run Java code
 */
const runJava = async (code, input = '') => {
  const tmpDir = os.tmpdir();
  const fileId = uuidv4();
  const javaDir = path.join(tmpDir, `cc_java_${fileId}`);
  const inputPath = path.join(tmpDir, `cc_${fileId}_in.txt`);
  const toClean = [javaDir, inputPath];

  try {
    // Extract class name
    const classMatch = code.match(/public\s+class\s+(\w+)/);
    const className = classMatch ? classMatch[1] : 'Solution';

    fs.mkdirSync(javaDir, { recursive: true });
    const srcPath = path.join(javaDir, `${className}.java`);
    fs.writeFileSync(srcPath, code, 'utf-8');
    fs.writeFileSync(inputPath, input, 'utf-8');

    // Compile
    const compileResult = await executeCommand(`javac "${srcPath}"`, { cwd: javaDir });

    if (compileResult.status !== 'success' || (compileResult.error && compileResult.error.trim())) {
      cleanup(toClean);
      return {
        output: '',
        error: compileResult.error || 'Compilation failed',
        executionTime: compileResult.executionTime,
        status: 'compilation-error',
      };
    }

    // Run
    const result = await executeCommand(`java -cp "${javaDir}" ${className} < "${inputPath}"`, { cwd: javaDir });

    // Cleanup class files
    try {
      const classFiles = fs.readdirSync(javaDir).filter((f) => f.endsWith('.class'));
      classFiles.forEach((f) => {
        try { fs.unlinkSync(path.join(javaDir, f)); } catch (e) {}
      });
    } catch (e) {}

    cleanup(toClean);
    return result;
  } catch (err) {
    cleanup(toClean);
    return { output: '', error: err.message, executionTime: 0, status: 'runtime-error' };
  }
};

/**
 * Main code executor
 * @param {string} code - Source code
 * @param {string} language - Language: javascript, python, c, cpp, java
 * @param {string} input - stdin input for the program
 * @returns {Promise<{output, error, executionTime, status}>}
 */
const executeCode = async (code, language, input = '') => {
  if (!code || code.trim().length === 0) {
    return { output: '', error: 'No code provided', executionTime: 0, status: 'runtime-error' };
  }

  const sanitizationResult = sanitizeCode(code, language);
  if (!sanitizationResult.safe) {
    return {
      output: '',
      error: sanitizationResult.reason,
      executionTime: 0,
      status: 'runtime-error',
    };
  }

  switch (language.toLowerCase()) {
    case 'javascript':
      return runJavaScript(code, input);
    case 'python':
      return runPython(code, input);
    case 'c':
      return runC(code, input);
    case 'cpp':
      return runCpp(code, input);
    case 'java':
      return runJava(code, input);
    default:
      return {
        output: '',
        error: `Unsupported language: ${language}. Supported: javascript, python, c, cpp, java`,
        executionTime: 0,
        status: 'runtime-error',
      };
  }
};

/**
 * Run code against multiple test cases
 * @returns {Promise<{passed, total, results, status}>}
 */
const runAgainstTestCases = async (code, language, testCases) => {
  const results = [];
  let passed = 0;

  for (const tc of testCases) {
    const result = await executeCode(code, language, tc.input);
    const actualOutput = (result.output || '').trim();
    const expectedOutput = (tc.expectedOutput || '').trim();
    const isCorrect = actualOutput === expectedOutput;

    if (isCorrect) passed++;

    results.push({
      input: tc.isHidden ? '[hidden]' : tc.input,
      expectedOutput: tc.isHidden ? '[hidden]' : expectedOutput,
      actualOutput: tc.isHidden && !isCorrect ? '[hidden]' : actualOutput,
      passed: isCorrect,
      executionTime: result.executionTime,
      error: result.error || null,
      status: result.status,
    });
  }

  const allPassed = passed === testCases.length;
  let overallStatus = 'wrong-answer';
  if (allPassed) overallStatus = 'accepted';
  else if (results.some((r) => r.status === 'time-limit-exceeded')) overallStatus = 'time-limit-exceeded';
  else if (results.some((r) => r.status === 'compilation-error')) overallStatus = 'compilation-error';
  else if (results.some((r) => r.status === 'runtime-error')) overallStatus = 'runtime-error';

  return {
    passed,
    total: testCases.length,
    results,
    status: overallStatus,
  };
};

module.exports = { executeCode, runAgainstTestCases };
