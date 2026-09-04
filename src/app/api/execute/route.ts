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
    let compiler = '';
    
    if (['javascript', 'js', 'node'].includes(lang)) {
      compiler = 'nodejs-16.14.0';
    } else if (['c++', 'cpp'].includes(lang)) {
      compiler = 'gcc-head';
    } else if (lang === 'python') {
      compiler = 'cpython-3.10.0';
    } else if (lang === 'java') {
      compiler = 'openjdk-head';
    } else {
      return NextResponse.json({ error: 'Unsupported language' }, { status: 400 });
    }

    const stream = new ReadableStream({
      async start(controller) {
        const startTime = performance.now();
        
        try {
          const response = await fetch('https://wandbox.org/api/compile.json', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              code: code,
              compiler: compiler,
              stdin: stdin || "",
            })
          });

          if (!response.ok) {
            throw new Error(`Execution API error: ${response.statusText}`);
          }

          const data = await response.json();

          if (data.compiler_error && data.status !== "0" && !data.program_message && !data.program_error) {
             controller.enqueue(`data: ${JSON.stringify({ type: 'stderr', data: data.compiler_error })}\n\n`);
          } else {
             if (data.program_message) {
                controller.enqueue(`data: ${JSON.stringify({ type: 'stdout', data: data.program_message })}\n\n`);
             }
             if (data.program_error) {
                controller.enqueue(`data: ${JSON.stringify({ type: 'stderr', data: data.program_error })}\n\n`);
             }
             // For interpreted languages, errors might appear in compiler_error
             if (data.compiler_error && !data.program_error && data.status !== "0") {
                controller.enqueue(`data: ${JSON.stringify({ type: 'stderr', data: data.compiler_error })}\n\n`);
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
