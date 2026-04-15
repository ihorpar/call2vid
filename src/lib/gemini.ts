import { GoogleGenAI, Type } from "@google/genai";
import { Scene } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateScenesFromTranscript(transcript: string): Promise<Scene[]> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze the following call center transcript and convert it into a sequence of video scenes.
    
    Rules:
    1. Each spoken line should be a 'transcript' scene. Assign the role 'agent' or 'user' appropriately.
    2. Insert 'feature' scenes (role: 'system') where the AI is performing an action (e.g., "AI is checking the customer", "looking for an open slot", "booking appointment").
    3. If the transcript includes timestamps (e.g., [0.0 - 3.5]), calculate the exact durationInFrames for each scene (duration in seconds * 30).
    4. CRITICAL FOR AUDIO SYNC: The scenes will be played sequentially. If there is a time gap between one spoken line and the next, you MUST either insert a 'feature' scene to fill the gap, or extend the duration of the previous scene, so that the next scene starts at the exact correct time in the audio.
    5. If no timestamps are provided, estimate a reasonable duration (60-180 frames).
    
    Transcript:
    ${transcript}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING, description: "A unique random string ID" },
            type: { type: Type.STRING, description: "'transcript' or 'feature'" },
            role: { type: Type.STRING, description: "'agent', 'user', or 'system'" },
            text: { type: Type.STRING, description: "The text to display" },
            durationInFrames: { type: Type.INTEGER, description: "Duration in frames (30fps)" }
          },
          required: ["id", "type", "role", "text", "durationInFrames"]
        }
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from Gemini");
  
  try {
    const scenes = JSON.parse(text) as Scene[];
    return scenes;
  } catch (e) {
    console.error("Failed to parse scenes", e);
    throw new Error("Failed to parse scenes from Gemini");
  }
}

export async function transcribeAudio(base64Audio: string, mimeType: string): Promise<string> {
  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-lite-preview",
    contents: {
      parts: [
        {
          inlineData: {
            data: base64Audio,
            mimeType: mimeType,
          },
        },
        {
          text: "Please transcribe this audio file with speaker diarization. You MUST include timestamps in total seconds for each line. Format exactly like this:\n[0.0 - 4.5] Agent: Hello, thanks for calling.\n[5.0 - 7.5] User: Hi, I need help.\n[8.0 - 11.5] Agent: How can I help today?\n\nCRITICAL: Use total seconds (e.g., 65.5, 11.0). Do NOT use minutes (like 1:05). Do NOT write 0.11 for 11 seconds, write 11.0.",
        },
      ],
    },
  });

  const text = response.text;
  if (!text) throw new Error("No response from Gemini");
  return text.trim();
}
