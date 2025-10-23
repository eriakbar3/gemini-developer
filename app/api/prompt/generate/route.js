import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(request) {
  try {
    const body = await request.json();
    const { inputText, language } = body;

    // Validation
    if (!inputText || !inputText.trim()) {
      return NextResponse.json(
        { success: false, error: "Input text is required" },
        { status: 400 }
      );
    }

    // Language mapping for better prompt generation
    const languageNames = {
      indonesian: "Bahasa Indonesia",
      english: "English",
      spanish: "Spanish (Español)",
      french: "French (Français)",
      german: "German (Deutsch)",
      japanese: "Japanese (日本語)",
      korean: "Korean (한국어)",
      chinese: "Chinese (中文)"
    };

    const targetLanguage = languageNames[language] || "English";

    // Build the meta-prompt for Gemini
    const metaPrompt = `You are an expert prompt engineer. Your task is to improve and optimize the user's input into a high-quality, effective prompt.

User's Input:
"${inputText}"

Target Output Language: ${targetLanguage}

Please generate an improved prompt that:
1. Clarifies the intent and makes it more specific
2. Adds necessary context and instructions
3. Makes the request clearer and more actionable
4. Is written in ${targetLanguage}
5. Maintains the user's original intent

Generate ONLY the improved prompt text, without any explanations or additional commentary. The output should be a ready-to-use prompt that can be copied and pasted directly into an AI chat.`;

    // Call Gemini API
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    const result = await model.generateContent(metaPrompt);
    const response = await result.response;
    const generatedPrompt = response.text();

    return NextResponse.json(
      {
        success: true,
        prompt: generatedPrompt.trim(),
        metadata: {
          inputText,
          language
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Prompt generation error:', error);

    // Handle specific Gemini API errors
    if (error.message?.includes('API key')) {
      return NextResponse.json(
        { success: false, error: "API key configuration error" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: false, error: error.message || "Failed to generate prompt" },
      { status: 500 }
    );
  }
}
