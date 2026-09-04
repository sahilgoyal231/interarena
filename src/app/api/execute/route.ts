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
    
    // JS runs natively in Vercel Node
    if (['javascript', 'js', 'node'].includes(lang)) {
      const stream = new ReadableStream({
        async start(controller) {
          const startTime = performance.now();
          try {
            // Very simple console hijack for evaluating JS locally
            let output = '';
            const originalLog = console.log;
            console.log = (...args) => { output += args.join(' ') + '\\n'; };
            try {
              // eslint-disable-next-line no-eval
              eval(code);
              if (output) controller.enqueue(`data: ${JSON.stringify({ type: 'stdout', data: output })}\n\n`);
            } catch (err: any) {
              controller.enqueue(`data: ${JSON.stringify({ type: 'stderr', data: err.message })}\n\n`);
            } finally {
              console.log = originalLog;
            }
          } catch (e: any) {
            controller.enqueue(`data: ${JSON.stringify({ type: 'stderr', data: e.message })}\n\n`);
          }
          const executionTime = Math.round(performance.now() - startTime);
          controller.enqueue(`data: ${JSON.stringify({ type: 'done', executionTime })}\n\n`);
          controller.close();
        }
      });
      return new Response(stream, {
        headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', 'Connection': 'keep-alive' },
      });
    }

    let compilerId = '';
    let godboltLang = '';
    if (['c++', 'cpp'].includes(lang)) {
      compilerId = 'g132';
      godboltLang = 'c++';
    } else if (lang === 'python') {
      compilerId = 'python311';
      godboltLang = 'python';
    } else if (lang === 'java') {
      compilerId = 'java2101';
      godboltLang = 'java';
    } else {
      return NextResponse.json({ error: 'Unsupported language' }, { status: 400 });
    }

    const stream = new ReadableStream({
      async start(controller) {
        const startTime = performance.now();
        
        try {
          const response = await fetch(`https://godbolt.org/api/compiler/${compilerId}/compile`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              source: code,
              compiler: compilerId,
              options: {
                userArguments: "",
                executeParameters: { args: "", stdin: stdin || "" },
                compilerOptions: { executorRequest: true },
                filters: { execute: true },
                tools: []
              },
              lang: godboltLang,
              allowStoreCodeDebug: true
            })
          });

          if (!response.ok) {
            throw new Error(`Execution API error: ${response.statusText}`);
          }

          const data = await response.json();
          
          if (data.buildResult && data.buildResult.code !== 0) {
            const buildErr = data.buildResult.stderr?.map((e: any) => e.text).join('\\n') || 'Compile error';
            controller.enqueue(`data: ${JSON.stringify({ type: 'stderr', data: buildErr })}\n\n`);
          } else {
            if (data.stdout && data.stdout.length > 0) {
              controller.enqueue(`data: ${JSON.stringify({ type: 'stdout', data: data.stdout.map((e: any) => e.text).join('\\n') + '\\n' })}\n\n`);
            }
            if (data.stderr && data.stderr.length > 0) {
              controller.enqueue(`data: ${JSON.stringify({ type: 'stderr', data: data.stderr.map((e: any) => e.text).join('\\n') + '\\n' })}\n\n`);
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
