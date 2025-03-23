// // getTranscript.js
// import axios from "axios";
// export default async function getTranscript(videoUrl, transcriptApiKey) {
//     try {
//       const options = {
//         method: 'GET',
//         url: "https://youtube-transcript3.p.rapidapi.com/api/transcript",
//         params: { url: videoUrl, chunkSize: '500' },
//         headers: {
//           'x-rapidapi-key': transcriptApiKey,
//           'x-rapidapi-host': 'youtube-transcript3.p.rapidapi.com'
//         }
//       };
//       const response = await axios.request(options);
//       console.log("Transcript extracted:", response.data.content); // Debug log
//       return response.data.content;
//     } catch (err) {
//       console.error("Error fetching transcript:", err);
//       return '';
//     }
//   }
  
// import axios from "axios";

// export default async function getTranscript(videoUrl, transcriptApiKey) {
//   try {
//     // Extract the video ID from the video URL
//     const urlObj = new URL(videoUrl);
//     const videoId = urlObj.searchParams.get("v");
//     if (!videoId) {
//       throw new Error("Video ID not found in URL.");
//     }

//     // Build the request options with videoId
//     const options = {
//       method: 'GET',
//       url: "https://youtube-transcript3.p.rapidapi.com/api/transcript",
//       params: { 
//         videoId: videoId,   // Use videoId instead of the full URL
//         chunkSize: '500' 
//       },
//       headers: {
//         'x-rapidapi-key': transcriptApiKey,
//         'x-rapidapi-host': 'youtube-transcript3.p.rapidapi.com'
//       }
//     };

//     const response = await axios.request(options);
//     // Adjust property based on the API response structure
//     const transcript = response.data.content || response.data.transcript;
//     console.log("Transcript extracted:", transcript);
//     return transcript;
//   } catch (err) {
//     console.error(
//       "Error fetching transcript:",
//       err.response ? err.response.data : err.message
//     );
//     return '';
//   }
// }
import axios from "axios";

export default async function getTranscript(videoIdOrUrl, transcriptApiKey) {
  try {
    // Determine if the input is a full URL or just a video ID
    let videoId = videoIdOrUrl;
    
    // Check if the input is a URL and extract the video ID if needed
    if (videoIdOrUrl.includes('youtube.com') || videoIdOrUrl.includes('youtu.be')) {
      const urlObj = new URL(videoIdOrUrl);
      
      if (videoIdOrUrl.includes('youtube.com')) {
        videoId = urlObj.searchParams.get("v");
      } else if (videoIdOrUrl.includes('youtu.be')) {
        // Handle youtu.be short links
        videoId = urlObj.pathname.substring(1);
      }
      
      if (!videoId) {
        throw new Error("Video ID not found in URL.");
      }
    }

    // Build the request options with videoId
    const options = {
      method: 'GET',
      url: "https://youtube-transcript3.p.rapidapi.com/api/transcript",
      params: {
        videoId: videoId, // Use extracted videoId
        chunkSize: '500'
      },
      headers: {
        'x-rapidapi-key': transcriptApiKey,
        'x-rapidapi-host': 'youtube-transcript3.p.rapidapi.com'
      }
    };

    const response = await axios.request(options);
    // Adjust property based on the API response structure
    const transcript = response.data.content || response.data.transcript;
    console.log("Transcript extracted successfully");
    return transcript;
  } catch (err) {
    console.error(
      "Error fetching transcript:",
      err.response ? err.response.data : err.message
    );
    throw err; // Propagate the error to allow proper retry logic
  }
}