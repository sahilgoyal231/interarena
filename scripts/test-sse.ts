import axios from 'axios';

async function runSSE() {
  const code = `
import time
print("Step 1", flush=True)
time.sleep(1)
print("Step 2", flush=True)
time.sleep(1)
print("Step 3", flush=True)
  `;
  
  const response = await fetch('http://localhost:3000/api/execute', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ language: 'python', code: code })
  });

  if (!response.body) return;
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  console.log("Listening to SSE stream...");
  
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    
    buffer += decoder.decode(value, { stream: true });
    let boundary = buffer.indexOf("\n\n");
    
    while (boundary !== -1) {
      const message = buffer.slice(0, boundary);
      buffer = buffer.slice(boundary + 2);
      console.log(`[${new Date().toISOString()}] Received chunk:`, message);
      boundary = buffer.indexOf("\n\n");
    }
  }
}

runSSE();
