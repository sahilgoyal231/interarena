import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { writeFile, rm } from 'fs/promises';
import path from 'path';
import os from 'os';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { language, code, stdin } = await request.json();

    const id = crypto.randomUUID();
    const tempDir = os.tmpdir();
    
    let extension = '';
    let runCommand = '';
    
    switch (language.toLowerCase()) {
      case 'javascript':
      case 'js':
      case 'node':
        extension = '.js';
        runCommand = `node "{FILE}"`;
        break;
      case 'python':
        extension = '.py';
        runCommand = `python3 "{FILE}"`;
        break;
      case 'c++':
      case 'cpp':
        extension = '.cpp';
        runCommand = `g++ "{FILE}" -o "{FILE_NO_EXT}" && "{FILE_NO_EXT}"`;
        break;
      case 'java':
        extension = '.java';
        runCommand = `javac "{FILE}" && java -cp "{DIR}" Main`;
        break;
      default:
        return NextResponse.json({ error: 'Unsupported language' }, { status: 400 });
    }

    let finalCode = code;
    let filename = `${id}${extension}`;

    if (language.toLowerCase() === 'java') {
      const safeId = id.replace(/-/g, '');
      filename = `Main${safeId}.java`;
      finalCode = code.replace(/public class Main/g, `public class Main${safeId}`);
      runCommand = `javac "{FILE}" && java -cp "{DIR}" Main${safeId}`;
    }

    const filePath = path.join(tempDir, filename);
    const fileNoExt = path.join(tempDir, id);

    await writeFile(filePath, finalCode);

    let finalCommand = runCommand
      .replace(/{FILE}/g, filePath)
      .replace(/{FILE_NO_EXT}/g, fileNoExt)
      .replace(/{DIR}/g, tempDir);

    const startTime = performance.now();

    return await new Promise<Response>((resolve) => {
      const child = exec(finalCommand, { timeout: 5000, maxBuffer: 1024 * 1024 }, async (error, stdout, stderr) => {
        const executionTime = Math.round(performance.now() - startTime);
        
        try {
          await rm(filePath, { force: true });
          if (language.toLowerCase() === 'c++') await rm(fileNoExt, { force: true });
          if (language.toLowerCase() === 'java') {
            const safeId = id.replace(/-/g, '');
            await rm(path.join(tempDir, `Main${safeId}.class`), { force: true });
          }
        } catch (e) {
            console.error("Cleanup error", e);
        }

        if (error && error.killed) {
           return resolve(NextResponse.json({ stdout: '', stderr: 'Execution Timed Out (5s limit)', executionTime }));
        }

        if (error && stderr === '') {
            stderr = error.message;
        }

        resolve(NextResponse.json({ stdout, stderr, executionTime }));
      });

      if (stdin && child.stdin) {
        child.stdin.write(stdin);
        child.stdin.end();
      }
    });

  } catch (error: any) {
    console.error("Execution API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
