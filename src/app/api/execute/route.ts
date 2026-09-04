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
    let ocLang = '';
    let fileName = '';
    
    if (['javascript', 'js', 'node'].includes(lang)) {
      ocLang = 'nodejs';
      fileName = 'index.js';
    } else if (['c++', 'cpp'].includes(lang)) {
      ocLang = 'cpp';
      fileName = 'main.cpp';
    } else if (lang === 'python') {
      ocLang = 'python';
      fileName = 'main.py';
    } else if (lang === 'java') {
      ocLang = 'java';
      fileName = 'Main.java';
    } else {
      return NextResponse.json({ error: 'Unsupported language' }, { status: 400 });
    }

    const stream = new ReadableStream({
      async start(controller) {
        const startTime = performance.now();
        
        try {
          const response = await fetch('https://onecompiler.com/api/code/exec', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
              'Origin': 'https://onecompiler.com',
              'Referer': 'https://onecompiler.com/'
            },
            body: JSON.stringify({
              language: ocLang,
              files: [
                {
                  name: fileName,
                  content: code
                }
              ],
              stdin: stdin || ""
            })
          });

          if (!response.ok) {
             throw new Error(`Execution API error: ${response.statusText} (${response.status})`);
          }

          const data = await response.json();
          
          if (data.exception && data.exception.length > 0) {
            controller.enqueue(`data: ${JSON.stringify({ type: 'stderr', data: data.exception })}\n\n`);
          } else if (data.stderr && data.stderr.length > 0) {
            controller.enqueue(`data: ${JSON.stringify({ type: 'stderr', data: data.stderr })}\n\n`);
          }
          
          if (data.stdout && data.stdout.length > 0) {
             controller.enqueue(`data: ${JSON.stringify({ type: 'stdout', data: data.stdout })}\n\n`);
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
