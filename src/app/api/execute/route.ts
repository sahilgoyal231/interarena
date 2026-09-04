import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { auth } from '@clerk/nextjs/server';

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { language, code, stdin } = await request.json();

    let lang = language.toLowerCase();
    if (['javascript', 'js', 'node'].includes(lang)) {
      lang = 'javascript';
    } else if (['c++', 'cpp'].includes(lang)) {
      lang = 'c++';
    } else if (lang === 'python') {
      lang = 'python';
    } else if (lang === 'java') {
      lang = 'java';
    } else {
      return NextResponse.json({ error: 'Unsupported language' }, { status: 400 });
    }

    const stream = new ReadableStream({
      async start(controller) {
        const startTime = performance.now();
        
        try {
          const response = await fetch('https://emkc.org/api/v2/piston/execute', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              language: lang,
              version: '*',
              files: [
                {
                  content: code
                }
              ],
              stdin: stdin || "",
            })
          });

          if (!response.ok) {
            throw new Error(`Piston API error: ${response.statusText}`);
          }

          const data = await response.json();

          if (data.compile && data.compile.code !== 0) {
            controller.enqueue(`data: ${JSON.stringify({ type: 'stderr', data: data.compile.stderr })}\n\n`);
          } else if (data.run) {
            if (data.run.stdout) {
              controller.enqueue(`data: ${JSON.stringify({ type: 'stdout', data: data.run.stdout })}\n\n`);
            }
            if (data.run.stderr) {
              controller.enqueue(`data: ${JSON.stringify({ type: 'stderr', data: data.run.stderr })}\n\n`);
            }
            if (data.run.signal === "SIGKILL") {
               controller.enqueue(`data: ${JSON.stringify({ type: 'stderr', data: '\\nExecution Timed Out\\n' })}\n\n`);
            }
          }
        } catch (err: any) {
          const msg = err instanceof Error ? err.message : String(err);
          controller.enqueue(`data: ${JSON.stringify({ type: 'stderr', data: msg })}\n\n`);
        }

        const executionTime = Math.round(performance.now() - startTime);
        controller.enqueue(`data: ${JSON.stringify({ type: 'done', executionTime })}\n\n`);
        controller.close();
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
