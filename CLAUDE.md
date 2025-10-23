# CLAUDE.md
This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
Next.js 15 + React 19 app with Ant Design UI and Google Gemini AI integration. Gemini-inspired chat interface with authentication, chat history, and specialized tools (commit generator, prompt maker).

## Build/Run Commands
- `npm run dev` - Start dev server on port 3004 with turbopack
- `npm run build` - Build production bundle with turbopack
- `npm start` - Start production server
- No test or lint commands configured

## Environment Setup
- Requires `.env` file with `GEMINI_API_KEY` (see `.env.example`)
- Chat history stored in `data/chat-history.json` (auto-created)

## Code Style
- **Language**: JavaScript (no TypeScript)
- **Strings**: Use double quotes
- **Semicolons**: Required
- **Client Components**: Add "use client" directive at top
- **Imports**: Group by external packages, then local components/utils
- **Components**: Functional components with hooks, located in `app/components/`
- **API Routes**: Located in `app/api/`, use Next.js App Router pattern
- **Styling**: Use Ant Design components + design tokens from `app/design-tokens.js`
- **Colors/Theme**: Always reference designTokens, not hardcoded values

## Architecture
- **Contexts**: AuthContext, ChatContext, ThemeProvider for global state
- **Layout**: MainLayout with sidebar navigation, supports dark mode
- **API**: File-based storage (JSON), Gemini AI via `@google/genai` package
- **Authentication**: Token-based auth with localStorage persistence
