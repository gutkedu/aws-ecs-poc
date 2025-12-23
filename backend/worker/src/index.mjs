import { Consumer } from "sqs-consumer";

/**
 * SQS queue URL from environment variables
 * @type {string}
 */
const queueUrl = process.env.SQS_QUEUE_URL;

/**
 * SQS Consumer instance for processing messages
 * @type {Consumer}
 */
const app = Consumer.create({
  queueUrl: queueUrl,
  /**
   * Handle incoming SQS messages
   * @param {Object} message - The SQS message object
   * @param {function} done - Callback to mark message as processed
   */
  handleMessage: async (message, done) => {
    try {
      console.log("Received message:", message.Body);

      // Process the message
      const payload = JSON.parse(message.Body);
      console.log("Processing payload:", payload);

      // Add a random delay between 500ms to 5000ms to simulate work
      const delay = Math.floor(Math.random() * 4500) + 500;
      console.log(`Simulating work for ${delay} ms`);
      await new Promise((resolve) => setTimeout(resolve, delay));

      console.log("Message processed successfully");
      done(); // Mark as processed
    } catch (error) {
      console.error("Error processing message:", error);
      done(error); // Mark as failed
    }
  },
  sqs: {
    region: process.env.AWS_REGION || "us-east-1",
  },
});

/**
 * Handle SQS consumer errors
 * @param {Error} err - The error object
 */
app.on("error", (err) => {
  console.error("SQS Consumer error:", err.message);
});

/**
 * Handle message processing errors
 * @param {Error} err - The processing error
 */
app.on("processing_error", (err) => {
  console.error("Processing error:", err.message);
});

/**
 * Handle timeout errors
 * @param {Error} err - The timeout error
 */
app.on("timeout_error", (err) => {
  console.error("Timeout error:", err.message);
});

console.log("Worker started, listening to SQS...");

app.start();
