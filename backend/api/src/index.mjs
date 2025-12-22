import express from "express";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

/**
 * Health check endpoint
 * @returns {Object} Status response
 */
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

/**
 * Endpoint to handle messages with unknown payload
 * @param {Object} req.body - The message payload
 * @returns {Object} Confirmation response
 */
app.post("/messages", (req, res) => {
  const payload = req.body;
  console.log("Received message:", payload);
  // For now, just log and respond
  res.status(200).json({ message: "Message received", payload });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
