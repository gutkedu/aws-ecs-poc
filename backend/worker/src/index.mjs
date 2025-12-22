import { SQSClient, ReceiveMessageCommand } from "@aws-sdk/client-sqs";

/**
 * Worker to process messages from SQS
 */
const sqsClient = new SQSClient({
  region: process.env.AWS_REGION || "us-east-1",
});
const queueUrl = process.env.SQS_QUEUE_URL; // Set this later

console.log("Worker started, waiting for messages...");

// For now, just log. Later, poll SQS.
setInterval(() => {
  console.log("Worker is running...");
}, 10000);
