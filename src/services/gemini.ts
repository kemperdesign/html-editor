import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface Message {
  role: 'user' | 'model';
  text: string;
}

export async function chatWithAI(messages: Message[], context: string) {
  try {
    const systemInstruction = `
      You are Aura, an elite AI Guest Service Agent for high-end vacation rentals.
      Your goal is to provide helpful, professional, and accurate information to guests based on the property information provided.
      
      PROPERTY CONTEXT:
      ${context}

      GUIDELINES:
      1. Be warm and welcoming.
      2. If you don't know the answer based on the context, politely explain that you'll escalate the question to a manager.
      3. Use details about amenities, location, and house rules to add value to your answers.
      4. If asked about availability or quotes, refer to the available pricing data in the context if present, or suggest contact for exact details.
      5. Keep responses concise but thorough.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: messages.map(m => ({ role: m.role, parts: [{ text: m.text }] })),
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return response.text || "I'm sorry, I encountered an error processing your request.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "The assistant is currently offline. Please try again later.";
  }
}

export async function analyzePerformance(propertyData: any) {
  const prompt = `
    Analyze the following property performance data and provide 3 key insights for the owner.
    Data: ${JSON.stringify(propertyData)}
    
    Format as a brief list of actionable insights.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });
    return response.text || "Unable to generate insights.";
  } catch (error) {
    return "Error generating analysis.";
  }
}
