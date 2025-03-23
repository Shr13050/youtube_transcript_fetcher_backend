// // generateNotes.js
// import Groq from 'groq-sdk';

// export default async function generateNotes(groqApiKey, transcript) {
//   // Initialize the Groq client with your Gemini API key
//   const groq = new Groq({ apiKey: groqApiKey });

//   // Combine transcript lines into a single string. If your transcript is an array, join its elements;
//   // otherwise, use it directly.
//   const inputText = Array.isArray(transcript)
//     ? transcript.map(line => line.text).join("\n")
//     : transcript;

//   // Define prompts for Gemini
//   const userPrompt = `Please structure the following transcript into notes adhering to the guidelines below:

// ${inputText}`;

//   const systemPrompt = `
// You are an intelligent assistant specialized in converting YouTube video transcripts into detailed, structured notes. 
// 1. If the transcript is not in English, translate it first.
// 2. Break the transcript into sections with descriptive headings and detailed content.
// Output only a valid JSON array of objects. Each object must have:
// - "heading": A concise title.
// - "content": A detailed explanation with line breaks for clarity.
// Ensure the JSON is syntactically valid.`;

//   let attempts = 0;
//   const maxAttempts = 3;

//   while (attempts < maxAttempts) {
//     try {
//       const result = await groq.chat.completions.create({
//         model: "gemma2-9b-it", // Using Gemini model
//         messages: [
//           { role: "system", content: systemPrompt },
//           { role: "user", content: userPrompt },
//         ],
//       });

//       let notes;
//       try {
//         // Attempt to parse the response as JSON directly
//         notes = JSON.parse(result.choices[0].message.content);
//       } catch (jsonError) {
//         console.warn("Invalid JSON response. Attempting to extract JSON manually.");
//         const jsonMatch = result.choices[0].message.content.match(/\[.*\]/s);
//         if (jsonMatch) {
//           notes = JSON.parse(jsonMatch[0]);
//         } else {
//           throw new Error("Could not extract valid JSON from response.");
//         }
//       }
//       return notes;
//     } catch (err) {
//       attempts++;
//       console.error(`Attempt ${attempts} failed:`, err);
//       if (attempts === maxAttempts) {
//         console.error("Max attempts reached. Note generation failed.");
//         return null;
//       }
//     }
//   }
// }

// Import the Google Gemini API SDK
// import { GoogleGenerativeAI } from "@google/generative-ai";

// export default async function generateNotes(geminiApiKey, transcript) {
//   console.log("generateNotes called with transcript:", typeof transcript);
//   console.log("Transcript sample:", transcript.substring(0, 100) + "...");

//   try {
//     // Initialize the Gemini API client
//     const genAI = new GoogleGenerativeAI(geminiApiKey);
//     const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

//     // Make sure transcript is a string
//     const inputText = typeof transcript === 'string' 
//       ? transcript 
//       : Array.isArray(transcript)
//         ? transcript.map(line => line.text || line).join("\n")
//         : JSON.stringify(transcript);

//     console.log("Input text prepared, length:", inputText.length);

//     // Define content for the generation request
//     const prompt = `
// You are an intelligent assistant specialized in converting YouTube video transcripts into detailed, structured notes. 
// Please structure the following transcript into notes:

// 1. If the transcript is not in English, translate it first.
// 2. Break the transcript into sections with descriptive headings and detailed content.
// 3. Output only a valid JSON array of objects. Each object must have:
//    - "heading": A concise title.
//    - "content": A detailed explanation with line breaks for clarity.
// 4. Ensure the JSON is syntactically valid.

// Transcript:
// ${inputText}

// Return only a valid JSON array of heading and content objects.`;

//     console.log("Sending request to Gemini API...");
    
//     // Generate content using Gemini
//     const result = await model.generateContent(prompt);
//     const response = await result.response;
//     const responseText = response.text();
    
//     console.log("Received response from Gemini");
//     console.log("Raw response:", responseText.substring(0, 100) + "...");

//     let notes;
//     try {
//       // Attempt to parse the response as JSON directly
//       notes = JSON.parse(responseText);
//       console.log("Successfully parsed JSON response");
//     } catch (jsonError) {
//       console.warn("Invalid JSON response. Attempting to extract JSON manually.");
//       // Try to find JSON array in the response
//       const jsonMatch = responseText.match(/\[\s*{.*}\s*\]/s);
//       if (jsonMatch) {
//         try {
//           notes = JSON.parse(jsonMatch[0]);
//           console.log("Successfully extracted and parsed JSON from response");
//         } catch (extractError) {
//           console.error("Failed to parse extracted JSON:", extractError);
//           return null;
//         }
//       } else {
//         console.error("Could not extract valid JSON from response.");
//         return null;
//       }
//     }
    
//     return notes;
//   } catch (err) {
//     console.error("Error in generateNotes:", err);
//     return null;
//   }
// }
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import dotenv from "dotenv";

// dotenv.config();

// export default async function generateNotes(transcript) {
//   // Directly fetch the key from the environment
//   const geminiApiKey = process.env.GEMINI_API_KEY;
  
//   console.log("generateNotes called with transcript:", typeof transcript);
//   console.log("Transcript sample:", transcript.substring(0, 100) + "...");
  
//   try {
//     // Initialize the Gemini API client
//     const genAI = new GoogleGenerativeAI(geminiApiKey);
//     const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
//     // Prepare the input text
//     const inputText = typeof transcript === 'string'
//       ? transcript
//       : Array.isArray(transcript)
//         ? transcript.map(line => line.text || line).join("\n")
//         : JSON.stringify(transcript);
    
//     console.log("Input text prepared, length:", inputText.length);
    
//     // Define the generation prompt
//     const prompt = `
// You are an intelligent assistant specialized in converting YouTube video transcripts into detailed, structured notes. 
// Please structure the following transcript into notes:

// 1. If the transcript is not in English, translate it first.
// 2. Break the transcript into sections with descriptive headings and detailed content.
// 3. Output only a valid JSON array of objects. Each object must have:
//    - "heading": A concise title.
//    - "content": A detailed explanation with line breaks for clarity.
// 4. Ensure the JSON is syntactically valid.

// Transcript:
// ${inputText}

// Return only a valid JSON array of heading and content objects.`;
    
//     console.log("Sending request to Gemini API...");
    
//     // Generate content using Gemini
//     const result = await model.generateContent(prompt);
//     const response = await result.response;
//     const responseText = await response.text();
    
//     console.log("Received response from Gemini");
//     console.log("Raw response:", responseText.substring(0, 100) + "...");
    
//     let notes;
//     try {
//       // Try to parse the response as JSON directly
//       notes = JSON.parse(responseText);
//       console.log("Successfully parsed JSON response");
//     } catch (jsonError) {
//       console.warn("Invalid JSON response. Attempting to extract JSON manually.");
//       const jsonMatch = responseText.match(/\[\s*{.*}\s*\]/s);
//       if (jsonMatch) {
//         try {
//           notes = JSON.parse(jsonMatch[0]);
//           console.log("Successfully extracted and parsed JSON from response");
//         } catch (extractError) {
//           console.error("Failed to parse extracted JSON:", extractError);
//           return null;
//         }
//       } else {
//         console.error("Could not extract valid JSON from response.");
//         return null;
//       }
//     }
    
//     return notes;
//   } catch (err) {
//     console.error("Error in generateNotes:", err);
//     return null;
//   }
// }

import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

export default async function generateNotes(transcript) {
  // Directly fetch the key from the environment
  const geminiApiKey = process.env.GEMINI_API_KEY;
  
  console.log("generateNotes called with transcript type:", typeof transcript);
  
  // Safely log a sample of the transcript
  if (typeof transcript === 'string') {
    console.log("Transcript sample:", transcript.substring(0, 100) + "...");
  } else if (Array.isArray(transcript)) {
    console.log("Transcript is an array with", transcript.length, "items");
  } else {
    console.log("Transcript is an object of type:", typeof transcript);
  }
  
  try {
    // Initialize the Gemini API client
    const genAI = new GoogleGenerativeAI(geminiApiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    // Prepare the input text
    const inputText = typeof transcript === 'string'
      ? transcript
      : Array.isArray(transcript)
        ? transcript.map(line => line.text || String(line)).join("\n")
        : JSON.stringify(transcript);
    
    console.log("Input text prepared, length:", inputText.length);
    
    // Define the generation prompt
    const prompt = `
You are an intelligent assistant specialized in converting YouTube video transcripts into detailed, structured notes.  
Please structure the following transcript into notes:

1. If the transcript is not in English, translate it first.
2. Break the transcript into sections with descriptive headings and detailed content.
3. Output only a valid JSON array of objects. Each object must have:
   - "heading": A concise title.
   - "content": A detailed explanation with line breaks for clarity.
4. Ensure the JSON is syntactically valid.

Transcript:
${inputText}

Return only a valid JSON array of heading and content objects.`;
    
    console.log("Sending request to Gemini API...");
    
    // Generate content using Gemini
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = await response.text();
    
    console.log("Received response from Gemini");
    console.log("Raw response sample:", responseText.substring(0, 100) + "...");
    
    let notes;
    try {
      // Try to parse the response as JSON directly
      notes = JSON.parse(responseText);
      console.log("Successfully parsed JSON response");
    } catch (jsonError) {
      console.warn("Invalid JSON response. Attempting to extract JSON manually.");
      const jsonMatch = responseText.match(/\[\s*{.*}\s*\]/s);
      if (jsonMatch) {
        try {
          notes = JSON.parse(jsonMatch[0]);
          console.log("Successfully extracted and parsed JSON from response");
        } catch (extractError) {
          console.error("Failed to parse extracted JSON:", extractError);
          return null;
        }
      } else {
        console.error("Could not extract valid JSON from response.");
        return null;
      }
    }
    
    return notes;
  } catch (err) {
    console.error("Error in generateNotes:", err);
    return null;
  }
}