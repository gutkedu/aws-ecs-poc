import express from "express";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

const app = express();
const port = process.env.PORT || 3000;

const sqsClient = new SQSClient({
  region: process.env.AWS_REGION || "us-east-1",
});
const queueUrl = process.env.SQS_QUEUE_URL; // ECS Task Definition should set this env variable

app.use(express.json());

/**
 * Health check endpoint
 * @returns {Object} Status response
 */
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

/**
 * Endpoint to handle messages - sends to SQS
 * @param {Object} req.body - The message payload
 * @returns {Object} Confirmation response
 */
app.post("/messages", async (req, res) => {
  const payload = req.body;
  try {
    const command = new SendMessageCommand({
      QueueUrl: queueUrl,
      MessageBody: JSON.stringify(payload),
    });
    await sqsClient.send(command);
    console.log("Message sent to SQS:", payload);
    res.status(200).json({ message: "Message sent to queue", payload });
  } catch (error) {
    console.error("Error sending message to SQS:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
