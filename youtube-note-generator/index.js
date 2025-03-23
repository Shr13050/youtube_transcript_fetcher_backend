
import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import getTranscript from "./getTranscript.js";
import ApiKeyManager from "./apikeyManager.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Initialize API key manager for transcript service
const transcriptKeyManager = new ApiKeyManager(JSON.parse(process.env.TRANSCRIPT_API_KEY_JSON));

// Helper function to rotate keys
const getNextTranscriptKey = () => transcriptKeyManager.getNextKey();

// Function to retry transcript generation
async function tryGetTranscript(videoIdOrUrl, maxAttempts = 5) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const apiKey = getNextTranscriptKey();
    try {
      console.log(`Attempt ${attempt} using API key: ${apiKey.substring(0, 4)}...`);
      const transcript = await getTranscript(videoIdOrUrl, apiKey);
      if (transcript) return transcript;
    } catch (error) {
      console.log(`Attempt ${attempt} failed: ${error.message}`);
      // Continue to next attempt/key
    }
  }
  throw new Error('All transcript attempts failed');
}

// Welcome endpoint
app.get("/", (req, res) => {
  res.send("Welcome to the YouTube Transcript API");
});

// Transcript endpoint
app.post("/api/transcript", async (req, res) => {
  try {
    const { link } = req.body;
    if (!link) {
      return res.status(400).json({ message: "Link not provided" });
    }
    console.log(`Received request to fetch transcript for: ${link}`);
    
    // Fetch transcript with retries
    const transcript = await tryGetTranscript(link);
    
    res.status(200).json({
      message: "Success",
      link,
      transcript
    });
  } catch (err) {
    console.error("Error in /api/transcript endpoint:", err);
    res.status(500).json({ message: "Failed to fetch transcript", error: err.message });
  }
});

// Get transcript by video ID endpoint
app.get("/api/transcript/:videoId", async (req, res) => {
  try {
    const { videoId } = req.params;
    if (!videoId) {
      return res.status(400).json({ message: "Video ID not provided" });
    }
    console.log(`Received request to fetch transcript for video ID: ${videoId}`);
    
    // Create a YouTube URL from the video ID for the GET endpoint
    const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
    
    // Fetch transcript with retries
    const transcript = await tryGetTranscript(youtubeUrl);
    
    res.status(200).json({
      message: "Success",
      videoId,
      transcript
    });
  } catch (err) {
    console.error("Error in /api/transcript/:videoId endpoint:", err);
    res.status(500).json({ message: "Failed to fetch transcript", error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});