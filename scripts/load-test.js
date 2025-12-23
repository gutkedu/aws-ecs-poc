import fetch from "node-fetch";

const API_URL = "http://54.224.144.9:3000/messages";
const NUM_REQUESTS = 1000;

async function sendMessage(id) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: `Test message ${id} - ${new Date().toISOString()}`,
      }),
    });

    if (!response.ok) {
      console.error(
        `Request ${id} failed: ${response.status} ${response.statusText}`
      );
      return false;
    }

    const result = await response.json();
    console.log(`Request ${id} succeeded:`, result);
    return true;
  } catch (error) {
    console.error(`Request ${id} error:`, error.message);
    return false;
  }
}

async function runLoadTest() {
  console.log(`Starting load test with ${NUM_REQUESTS} concurrent requests...`);

  const startTime = Date.now();

  const promises = [];
  for (let i = 1; i <= NUM_REQUESTS; i++) {
    promises.push(sendMessage(i));
  }

  const results = await Promise.all(promises);

  const endTime = Date.now();
  const duration = (endTime - startTime) / 1000;

  const successful = results.filter(Boolean).length;
  const failed = NUM_REQUESTS - successful;

  console.log(`\nLoad test completed in ${duration.toFixed(2)} seconds`);
  console.log(`Successful requests: ${successful}`);
  console.log(`Failed requests: ${failed}`);
  console.log(`Requests per second: ${(NUM_REQUESTS / duration).toFixed(2)}`);
}

runLoadTest().catch(console.error);
