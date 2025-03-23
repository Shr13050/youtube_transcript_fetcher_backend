// // testTranscript.js
// import axios from "axios";
// import dotenv from "dotenv";

// dotenv.config(); // Loads environment variables from .env

// async function testTranscript() {
//   // Get the first API key from your environment variable JSON array
//   const transcriptApiKeys = JSON.parse(process.env.TRANSCRIPT_API_KEY_JSON);
//   const transcriptApiKey = transcriptApiKeys[0]; // Use the first key for testing

//   // Define your YouTube video URL (replace YOUR_VIDEO_ID with an actual video ID)
//   const videoUrl = "https://www.youtube.com/watch?v=XB9zg99x2jE&t=285s&pp=ygUJeW9sbyBzYW0g";

//   try {
//     const options = {
//       method: "GET",
//       url: "https://youtube-transcript3.p.rapidapi.com/api/transcript",
//       params: {
//         url: videoUrl,
//         chunkSize: "500"
//       },
//       headers: {
//         "x-rapidapi-key": transcriptApiKey,
//         "x-rapidapi-host": "youtube-transcript3.p.rapidapi.com"
//       }
//     };

//     const response = await axios.request(options);
//     console.log("Transcript Data:", response.data);
//   } catch (err) {
//     console.error(
//       "Error fetching transcript:",
//       err.response ? err.response.data : err.message
//     );
//   }
// }

// testTranscript();

// testTranscript.js
import axios from "axios";
import dotenv from "dotenv";

dotenv.config(); // Loads environment variables from .env

async function testTranscript() {
  // Get the first API key from your environment variable JSON array
  const transcriptApiKeys = JSON.parse(process.env.TRANSCRIPT_API_KEY_JSON);
  const transcriptApiKey = transcriptApiKeys[0]; // Use the first key for testing

  // Define your YouTube video URL (replace with your desired video URL)
  const videoUrl = "https://www.youtube.com/watch?v=TlB_eWDSMt4&pp=ygUQbm9kZSBqcyBvbmUgc2hvdA%3D%3D";
  
  // Extract the video ID from the URL
  const urlObj = new URL(videoUrl);
  const videoId = urlObj.searchParams.get("v");

  if (!videoId) {
    console.error("Unable to extract video ID from the provided URL.");
    return;
  }

  try {
    const options = {
      method: "GET",
      url: "https://youtube-transcript3.p.rapidapi.com/api/transcript",
      params: {
        videoId: videoId,  // Now sending the videoId instead of the full URL
        chunkSize: "500"
      },
      headers: {
        "x-rapidapi-key": transcriptApiKey,
        "x-rapidapi-host": "youtube-transcript3.p.rapidapi.com"
      }
    };

    const response = await axios.request(options);
    console.log("Transcript Data:", response.data);
  } catch (err) {
    console.error(
      "Error fetching transcript:",
      err.response ? err.response.data : err.message
    );
  }
}

testTranscript();
