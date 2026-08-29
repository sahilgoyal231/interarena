import axios from 'axios';

const BASE_URL = 'http://localhost:3000'; // Make sure the server is running on 3000
const CONCURRENT_USERS = 50;

async function executeCode(userId: number) {
  const start = Date.now();
  try {
    const response = await axios.post(`${BASE_URL}/api/execute`, {
      language: 'python',
      code: 'print("Hello from user " + str(' + userId + '))'
    });
    const latency = Date.now() - start;
    return { success: true, latency, type: 'EXECUTE' };
  } catch (error: any) {
    const latency = Date.now() - start;
    return { success: false, latency, type: 'EXECUTE', error: error.message };
  }
}

async function fetchMoaSection(userId: number) {
  const start = Date.now();
  try {
    const response = await axios.get(`${BASE_URL}/api/moa/section?type=DEBUG_CODE&language=python&limit=10&difficulty=Advanced`);
    const latency = Date.now() - start;
    return { success: true, latency, type: 'MOA_FETCH' };
  } catch (error: any) {
    const latency = Date.now() - start;
    return { success: false, latency, type: 'MOA_FETCH', error: error.message };
  }
}

async function runStressTest() {
  console.log(`🚀 Starting Stress Test with ${CONCURRENT_USERS} concurrent users...`);
  
  const tasks = [];
  
  for (let i = 0; i < CONCURRENT_USERS; i++) {
    // 50 users running code
    tasks.push(executeCode(i));
    // 50 users generating MOA sections (heavy DB + AI generation query)
    tasks.push(fetchMoaSection(i));
  }
  
  const startTime = Date.now();
  const results = await Promise.all(tasks);
  const totalTime = Date.now() - startTime;
  
  let successCount = 0;
  let failureCount = 0;
  let maxLatency = 0;
  let totalLatency = 0;
  
  const errors = new Set();
  
  results.forEach(r => {
    if (r.success) {
      successCount++;
    } else {
      failureCount++;
      errors.add(r.error);
    }
    
    totalLatency += r.latency;
    if (r.latency > maxLatency) maxLatency = r.latency;
  });
  
  console.log(`\n📊 STRESS TEST RESULTS:`);
  console.log(`- Total Requests: ${CONCURRENT_USERS * 2}`);
  console.log(`- Successful: ${successCount}`);
  console.log(`- Failed: ${failureCount}`);
  console.log(`- Total Time: ${totalTime}ms`);
  console.log(`- Average Latency: ${Math.round(totalLatency / (CONCURRENT_USERS * 2))}ms`);
  console.log(`- Max Latency: ${maxLatency}ms`);
  
  if (failureCount > 0) {
    console.log(`\n⚠️ ERRORS ENCOUNTERED:`);
    errors.forEach(e => console.log(`- ${e}`));
  }
}

runStressTest();
