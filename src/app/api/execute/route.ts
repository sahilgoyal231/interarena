import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import child_process from 'child_process';
import { writeFile, rm } from 'fs/promises';
import { promisify } from 'util';
import path from 'path';
import os from 'os';
import crypto from 'crypto';
import { auth } from '@clerk/nextjs/server';

const execPromise = promisify(child_process.exec);

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { language, code, stdin } = await request.json();

    const id = crypto.randomUUID();
    const tempDir = os.tmpdir();
    
    let extension = '';
    const lang = language.toLowerCase();
    
    if (['javascript', 'js', 'node'].includes(lang)) {
      extension = '.js';
    } else if (lang === 'python') {
      extension = '.py';
    } else if (['c++', 'cpp'].includes(lang)) {
      extension = '.cpp';
    } else if (lang === 'java') {
      extension = '.java';
    } else {
      return NextResponse.json({ error: 'Unsupported language' }, { status: 400 });
    }

    let finalCode = code;
    const safeId = id.replace(/-/g, '');
    const filename = lang === 'java' ? `Main${safeId}.java` : `${id}${extension}`;

    if (lang === 'java') {
      finalCode = code.replace(/public class Main/g, `public class Main${safeId}`);
    }

    const filePath = path.join(tempDir, filename);
    const fileNoExt = path.join(tempDir, id);

    await writeFile(filePath, finalCode);

    const stream = new ReadableStream({
      async start(controller) {
        const cleanup = async () => {
          try {
            await rm(filePath, { force: true });
            if (['c++', 'cpp'].includes(lang)) await rm(fileNoExt, { force: true });
            if (lang === 'java') await rm(path.join(tempDir, `Main${safeId}.class`), { force: true });
          } catch (e) {
            console.error("Cleanup error", e);
          }
        };

        const startTime = performance.now();
        let command = '';
        let args: string[] = [];

        // Pre-compile steps for compiled languages
        try {
          if (['c++', 'cpp'].includes(lang)) {
            await execPromise(`g++ "${filePath}" -o "${fileNoExt}"`, { timeout: 10000 });
            command = fileNoExt;
            args = [];
          } else if (lang === 'java') {
            await execPromise(`javac "${filePath}"`, { timeout: 10000 });
            command = 'java';
            args = [String.fromCharCode(45, 99, 112), tempDir, `Main${safeId}`];
          } else if (['javascript', 'js', 'node'].includes(lang)) {
            command = 'node';
            args = [filePath];
          } else if (lang === 'python') {
            command = 'python3';
            args = [filePath];
          }
        } catch (compileErr: any) {
          // Send compile error as stderr
          const msg = compileErr instanceof Error ? compileErr.message : String(compileErr);
          controller.enqueue(`data: ${JSON.stringify({ type: 'stderr', data: msg })}\n\n`);
          const executionTime = Math.round(performance.now() - startTime);
          controller.enqueue(`data: ${JSON.stringify({ type: 'done', executionTime })}\n\n`);
          controller.close();
          await cleanup();
          return;
        }

        // Spawn execution
        let isKilled = false;
        const child = child_process.spawn(command, args as never /* turbopackIgnore: true */, { stdio: ['pipe', 'pipe', 'pipe'] });

        // Hard 5-second timeout with SIGKILL to prevent zombies
        const timeoutId = setTimeout(() => {
          isKilled = true;
          child.kill('SIGKILL');
          controller.enqueue(`data: ${JSON.stringify({ type: 'stderr', data: '\nExecution Timed Out (5s limit)\n' })}\n\n`);
        }, 5000);

        child.stdout.on('data', (data) => {
          controller.enqueue(`data: ${JSON.stringify({ type: 'stdout', data: data.toString() })}\n\n`);
        });

        child.stderr.on('data', (data) => {
          controller.enqueue(`data: ${JSON.stringify({ type: 'stderr', data: data.toString() })}\n\n`);
        });

        child.on('error', (err) => {
          controller.enqueue(`data: ${JSON.stringify({ type: 'stderr', data: err.message })}\n\n`);
        });

        child.on('close', async () => {
          clearTimeout(timeoutId);
          const executionTime = Math.round(performance.now() - startTime);
          controller.enqueue(`data: ${JSON.stringify({ type: 'done', executionTime })}\n\n`);
          controller.close();
          await cleanup();
        });

        if (stdin && child.stdin) {
          child.stdin.write(stdin);
          child.stdin.end();
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error: any) {
    console.error("Execution API Error:", error);
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
