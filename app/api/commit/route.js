import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

// Initialize Gemini API
const genai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// POST endpoint - Generate commit message from git diff
export async function POST(request) {
  try {
    const { gitDiff } = await request.json();

    if (!gitDiff || gitDiff.trim() === "") {
      return NextResponse.json(
        { error: "Git diff is required" },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Gemini API key is not configured" },
        { status: 500 }
      );
    }

    // Create a specialized prompt for generating commit messages
    const prompt = `You are a helpful assistant that generates conventional commit messages based on git diffs.

Given the following git diff, generate a clear and concise commit message following these guidelines:
1. Use conventional commits format: <type>(<scope>): <subject>
2. Types: feat, fix, docs, style, refactor, test, chore, perf
3. Keep the subject line under 50 characters
4. Optionally add a body explaining the changes in more detail
5. If there are breaking changes, add "BREAKING CHANGE:" in the footer

Git Diff:
\`\`\`
${gitDiff}
\`\`\`

Please generate:
1. A short commit message (subject line only)
2. A detailed commit message (with body and optional footer)

Format your response as JSON:
{
  "short": "the short commit message",
  "detailed": "the detailed commit message with body"
}`;

    // Generate response from Gemini
    const response = await genai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    let aiResponse = response.text;

    // Try to parse JSON from the response
    // Sometimes AI wraps JSON in markdown code blocks
    let commitMessages;
    try {
      // Remove markdown code blocks if present
      const jsonMatch = aiResponse.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
      if (jsonMatch) {
        commitMessages = JSON.parse(jsonMatch[1]);
      } else {
        commitMessages = JSON.parse(aiResponse);
      }
    } catch (parseError) {
      // If parsing fails, create a structured response from the text
      const lines = aiResponse.split('\n').filter(line => line.trim());
      commitMessages = {
        short: lines[0] || aiResponse.substring(0, 50),
        detailed: aiResponse
      };
    }

    return NextResponse.json({
      success: true,
      commitMessages,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in commit API:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate commit message" },
      { status: 500 }
    );
  }
}
