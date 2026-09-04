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
    let paizaLang = '';
    if (['javascript', 'js', 'node'].includes(lang)) {
      paizaLang = 'javascript';
    } else if (['c++', 'cpp'].includes(lang)) {
      paizaLang = 'cpp';
    } else if (lang === 'python') {
      paizaLang = 'python3';
    } else if (lang === 'java') {
      paizaLang = 'java';
    } else {
      return NextResponse.json({ error: 'Unsupported language' }, { status: 400 });
    }

    const stream = new ReadableStream({
      async start(controller) {
        const startTime = performance.now();
        
        try {
          const createRes = await fetch('https://api.paiza.io/runners/create', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              source_code: code,
              language: paizaLang,
              input: stdin || "",
              api_key: "guest"
            })
          });

          if (!createRes.ok) {
            throw new Error(`Execution API error: ${createRes.statusText}`);
          }

          const createData = await createRes.json();
          if (createData.error) {
             throw new Error(createData.error);
          }

          const jobId = createData.id;
          let completed = false;
          let detailsData: any = null;

          for (let i = 0; i < 20; i++) { // max 10 seconds wait
            await new Promise(resolve => setTimeout(resolve, 500));
            const detailsRes = await fetch(`https://api.paiza.io/runners/get_details?id=${jobId}&api_key=guest`);
            if (detailsRes.ok) {
              detailsData = await detailsRes.json();
              if (detailsData.status === 'completed') {
                completed = true;
                break;
              }
            }
          }

          if (!completed) {
            controller.enqueue(`data: ${JSON.stringify({ type: 'stderr', data: '\\nExecution Timed Out\\n' })}\n\n`);
          } else {
            if (detailsData.build_exit_code && detailsData.build_exit_code !== 0) {
              controller.enqueue(`data: ${JSON.stringify({ type: 'stderr', data: detailsData.build_stderr || 'Compile error' })}\n\n`);
            } else {
              if (detailsData.stdout) {
                controller.enqueue(`data: ${JSON.stringify({ type: 'stdout', data: detailsData.stdout })}\n\n`);
              }
              if (detailsData.stderr) {
                controller.enqueue(`data: ${JSON.stringify({ type: 'stderr', data: detailsData.stderr })}\n\n`);
              }
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
