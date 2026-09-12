import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';
import { generateCppDriver, generatePythonDriver, generateJavaDriver, generateJsDriver } from '@/lib/code-evaluator';

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { language, questionId } = body;
    let { code, stdin } = body;

    const lang = language.toLowerCase();
    
    // Dynamically generate the driver code using the Universal Regex Parser
    if (questionId) {
        try {
            const question = await prisma.question.findUnique({
                where: { id: questionId },
                select: { boilerPlateCode: true }
            });
            if (question?.boilerPlateCode) {
                if (lang.includes('c++') || lang.includes('cpp')) {
                    const result = generateCppDriver(question.boilerPlateCode, stdin);
                    if (result) {
                        const includes = `#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <map>\n#include <set>\n#include <queue>\n#include <stack>\n#include <algorithm>\n#include <cmath>\nusing namespace std;\n`;
                        code = `${includes}\n${code}\n${result.driverCode}`;
                        stdin = result.flattenedInput;
                    }
                } else if (lang.includes('python')) {
                    const driver = generatePythonDriver(question.boilerPlateCode, stdin);
                    code = `${code}\n${driver}`;
                    stdin = ""; // Python handles the original raw string in the driver
                } else if (lang.includes('java') && !lang.includes('script')) {
                    const result = generateJavaDriver(question.boilerPlateCode, stdin);
                    if (result) {
                        // Java user code typically contains the Solution class, but it might lack imports.
                        const imports = `import java.util.*;\nimport java.io.*;\n`;
                        code = `${imports}\n${code}\n${result.driverCode}`;
                        stdin = result.flattenedInput;
                    }
                } else if (lang.includes('javascript') || lang.includes('js')) {
                    // Prepend the target function extraction regex in JS driver
                    let jsDriver = generateJsDriver(question.boilerPlateCode, stdin);
                    
                    // Extract function name dynamically
                    const match = question.boilerPlateCode.match(/var\s+(\w+)\s*=\s*function/);
                    if (match) {
                        jsDriver += `\nif (typeof ${match[1]} === 'function') {\n    const args = Object.values(paramValues);\n    const res = ${match[1]}(...args);\n    if (res !== undefined && res !== null) {\n        console.log(Array.isArray(res) ? res.join(" ") : res);\n    } else if (Array.isArray(args[0])) {\n        console.log(args[0].join(" "));\n    }\n}\n`;
                    }
                    
                    code = `${code}\n${jsDriver}`;
                    stdin = "";
                }
            }
        } catch (error) {
            console.error("Failed to generate driver code:", error);
        }
    }
    
    // Mapping for OneCompiler (Fallback)
    let ocLang = '';
    let fileName = '';
    
    // Mapping for JDoodle (Primary)
    let jdLang = '';
    let jdVersion = '4'; // Default to version index 4

    if (['javascript', 'js', 'node'].includes(lang)) {
      ocLang = 'nodejs';
      fileName = 'index.js';
      jdLang = 'nodejs';
      jdVersion = '4'; 
    } else if (['c++', 'cpp'].includes(lang)) {
      ocLang = 'cpp';
      fileName = 'main.cpp';
      jdLang = 'cpp';
      jdVersion = '5'; // GCC 11
    } else if (lang === 'python') {
      ocLang = 'python';
      fileName = 'main.py';
      jdLang = 'python3';
      jdVersion = '4';
    } else if (lang === 'java') {
      ocLang = 'java';
      fileName = 'Main.java';
      jdLang = 'java';
      jdVersion = '4'; // JDK 17
    } else {
      return NextResponse.json({ error: 'Unsupported language' }, { status: 400 });
    }

    const stream = new ReadableStream({
      async start(controller) {
        const startTime = performance.now();

        // Provider 1: JDoodle API (Primary)
        async function runJDoodle(): Promise<{ stdout: string; stderr: string; exception: string }> {
          const clientId = process.env.JDOODLE_CLIENT_ID;
          const clientSecret = process.env.JDOODLE_CLIENT_SECRET;
          
          if (!clientId || !clientSecret) {
            throw new Error("JDoodle credentials missing");
          }

          const response = await fetch('https://api.jdoodle.com/v1/execute', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              clientId,
              clientSecret,
              script: code,
              language: jdLang,
              versionIndex: jdVersion,
              stdin: stdin || ""
            })
          });

          const data = await response.json();
          
          if (!response.ok || data.error) {
            throw new Error(`JDoodle API error: ${data.error || response.statusText}`);
          }

          // JDoodle returns stdout/stderr combined in 'output'
          return {
            stdout: data.output || '',
            stderr: '',
            exception: ''
          };
        }

        // Provider 2: OneCompiler API (Fallback)
        async function runOneCompiler(): Promise<{ stdout: string; stderr: string; exception: string }> {
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
              files: [{ name: fileName, content: code }],
              stdin: stdin || ""
            })
          });

          if (!response.ok) {
            throw new Error(`OneCompiler API error: ${response.statusText} (${response.status})`);
          }

          const data = await response.json();
          return {
            stdout: data.stdout || '',
            stderr: data.stderr || '',
            exception: data.exception || ''
          };
        }

        try {
          let executionResult: { stdout: string; stderr: string; exception: string } | null = null;
          
          try {
            // Try Primary Provider
            executionResult = await runJDoodle();
          } catch (primaryError) {
            console.warn("JDoodle API failed, falling back to OneCompiler...", primaryError);
            // Try Fallback Provider
            executionResult = await runOneCompiler();
          }

          if (executionResult.exception && executionResult.exception.length > 0) {
            controller.enqueue(`data: ${JSON.stringify({ type: 'stderr', data: executionResult.exception })}\n\n`);
          } else if (executionResult.stderr && executionResult.stderr.length > 0) {
            controller.enqueue(`data: ${JSON.stringify({ type: 'stderr', data: executionResult.stderr })}\n\n`);
          }
          
          if (executionResult.stdout && executionResult.stdout.length > 0) {
            controller.enqueue(`data: ${JSON.stringify({ type: 'stdout', data: executionResult.stdout })}\n\n`);
          }

        } catch (err: any) {
          // If BOTH providers fail
          console.error("All execution providers failed:", err);
          const msg = err instanceof Error ? err.message : String(err);
          controller.enqueue(`data: ${JSON.stringify({ type: 'stderr', data: "Service Unavailable: " + msg })}\n\n`);
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

