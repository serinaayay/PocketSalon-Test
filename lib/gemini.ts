import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini with the provided API key
// Note: In a production app, this should be in an environment variable
const GEMINI_API_KEY = 'AIzaSyBSsAxaRhoQDSIu-gsyGYHqK_Nzl3FSuGM';

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
// Use gemini-2.0-flash as it's available for this key
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

export async function askGemini(question: string): Promise<string> {
  try {
    // Provide a light system prompt so Gemini can flexibly answer
    const systemPrompt = `
You are PocketSalon's friendly AI assistant.
- Prioritize hair, scalp, beauty, and wellness topics when relevant.
- If the user asks about something else, do your best to help with accurate, concise guidance.
- Use a warm, encouraging tone and bullet points when they keep things readable.
- Avoid sharing personal medical advice—suggest seeing a professional if issues sound serious.
- Do not mention that you are Gemini or from Google.

User Question: ${question}
`;

    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    const text = response.text();
    
    return text.trim();
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    // Throw specific error to be handled by the caller
    throw new Error('Failed to get response from AI');
  }
}
