import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    const body = await request.json();
    const { inputText, language, aiModel } = body;

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
      chinese: "Chinese (中文)",
    };

    const targetLanguage = languageNames[language] || "English";

    // Build the meta-prompt
    const metaPrompt = `You are a world-class Prompt Engineer. Transform the given brief into one complete, well-structured, ready-to-use prompt for an advanced AI model. Rules: Output only pure Markdown. No explanations, comments, or extra text. Deliver a single, self-contained prompt ready for direct use.

User's Input:
"${inputText}"

Target Output Language: ${targetLanguage}`;

    let generatedPrompt;

    // Choose AI model based on user selection
    if (aiModel === "chatgpt") {
      // Check if OpenAI API key is configured
      if (!process.env.OPENAI_API_KEY) {
        return NextResponse.json(
          { success: false, error: "OpenAI API key is not configured" },
          { status: 500 }
        );
      }

      // Call ChatGPT API
      const completion = await openai.chat.completions.create({
        model: "gpt-5-chat-latest",
        messages: [
          {
            role: "user",
            content: metaPrompt,
          },
        ],
      });

      generatedPrompt = completion.choices[0].message.content;
    } else {
      // Default to Gemini
      if (!process.env.GEMINI_API_KEY) {
        return NextResponse.json(
          { success: false, error: "Gemini API key is not configured" },
          { status: 500 }
        );
      }

      // Call Gemini API
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const result = await model.generateContent(metaPrompt);
      const response = await result.response;
      generatedPrompt = response.text();
    }

    return NextResponse.json(
      {
        success: true,
        prompt: generatedPrompt.trim(),
        metadata: {
          inputText,
          language,
          aiModel,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Prompt generation error:", error);

    // Handle specific API errors
    if (error.message?.includes("API key")) {
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
