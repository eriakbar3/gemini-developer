# Gemini Chat Application

A beautiful, production-ready chat interface powered by Google's Gemini AI, built with Next.js. Features a modern, responsive UI inspired by Google's Gemini aesthetic, with smooth animations and elegant design.

![Gemini Chat](https://img.shields.io/badge/Next.js-15.5.5-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.1.0-blue?style=flat-square&logo=react)
![Google Gemini](https://img.shields.io/badge/Google-Gemini-4285F4?style=flat-square&logo=google)

## Features

- **Real-time AI Chat**: Engage in conversations with Google's Gemini AI model
- **Persistent Chat History**: All conversations are saved locally in a JSON file
- **Beautiful UI/UX**: Modern, responsive design with soft gradients and smooth animations
- **Loading Indicators**: Animated typing indicators while waiting for AI responses
- **Clear Chat History**: Easy option to clear all conversation history
- **Dark Mode Support**: Automatically adapts to system dark mode preferences
- **Mobile Responsive**: Fully optimized for mobile, tablet, and desktop devices
- **Error Handling**: Comprehensive error handling for API requests and file operations

## Tech Stack

- **Frontend**: Next.js 15.5.5 with React 19
- **Styling**: Tailwind CSS v4 with custom CSS
- **AI Model**: Google Gemini Pro API
- **Storage**: Local JSON file (no external database required)
- **Language**: JavaScript

## Project Structure

```
my-gemini/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.js          # API endpoint for Gemini integration
│   ├── components/
│   │   ├── ChatInterface.js      # Main chat UI component
│   │   ├── ChatMessage.js        # Individual message component
│   │   └── LoadingIndicator.js   # Typing animation component
│   ├── globals.css               # Global styles with animations
│   ├── layout.js                 # Root layout
│   └── page.js                   # Home page
├── data/
│   └── chat-history.json         # Local storage for conversations
├── .env.local                    # Environment variables (API key)
├── .env.example                  # Example environment file
└── package.json                  # Dependencies
```

## Prerequisites

- Node.js 18.17 or later
- npm, yarn, pnpm, or bun package manager
- Google Gemini API key

## Installation

### 1. Clone or Download the Project

If you haven't already, ensure you're in the project directory:

```bash
cd my-gemini
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Get Your Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

### 4. Configure Environment Variables

Open the `.env.local` file in the root directory and add your API key:

```bash
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

**Important**: Replace `your_actual_gemini_api_key_here` with your real Gemini API key.

### 5. Run the Development Server

```bash
npm run dev
```

The application will start at [http://localhost:3000](http://localhost:3000)

## Usage

### Starting a Conversation

1. Open your browser and navigate to `http://localhost:3000`
2. You'll see a clean, empty chat interface with the message "Hello, how can I help you today?"
3. Type your message in the input field at the bottom
4. Press Enter or click the send button (arrow icon)
5. Wait for the AI response (you'll see an animated typing indicator)

### Clearing Chat History

- Click the "Clear chat" button in the header (trash icon)
- Confirm the action when prompted
- All conversation history will be permanently deleted

### Chat Persistence

- All conversations are automatically saved to `data/chat-history.json`
- Reload the page, and your conversation history will be restored
- Chat history persists across browser sessions

## API Endpoints

### POST `/api/chat`

Send a message and receive an AI response.

**Request Body**:
```json
{
  "message": "Your question here"
}
```

**Response**:
```json
{
  "success": true,
  "response": "AI response here",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### GET `/api/chat`

Retrieve all chat history.

**Response**:
```json
{
  "success": true,
  "conversations": [
    {
      "id": 1234567890,
      "timestamp": "2024-01-15T10:30:00.000Z",
      "userMessage": "Hello",
      "aiResponse": "Hi! How can I help you?"
    }
  ]
}
```

### DELETE `/api/chat`

Clear all chat history.

**Response**:
```json
{
  "success": true,
  "message": "Chat history cleared successfully"
}
```

## Building for Production

### Build the Application

```bash
npm run build
```

### Start the Production Server

```bash
npm start
```

The production build will be optimized and ready to deploy.

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Visit [Vercel](https://vercel.com)
3. Import your repository
4. Add your environment variable:
   - Key: `GEMINI_API_KEY`
   - Value: Your Gemini API key
5. Deploy!

### Deploy to Other Platforms

This Next.js application can be deployed to any platform that supports Node.js:
- Netlify
- Railway
- Render
- DigitalOcean App Platform
- AWS, Google Cloud, Azure

**Important**: Always set the `GEMINI_API_KEY` environment variable in your deployment platform.

## Customization

### Changing Colors and Themes

Edit `app/globals.css` to customize:
- Color schemes (`:root` variables)
- Gradients (`.header-title h1`, `.user-avatar`, `.ai-avatar`)
- Animations (keyframes)
- Dark mode colors (`@media (prefers-color-scheme: dark)`)

### Modifying AI Behavior

Edit `app/api/chat/route.js`:
- Change the model: Replace `"gemini-pro"` with other Gemini models
- Add system prompts or context
- Adjust response formatting

### UI Layout Changes

Edit the components:
- `app/components/ChatInterface.js` - Main layout and logic
- `app/components/ChatMessage.js` - Message bubble design
- `app/components/LoadingIndicator.js` - Loading animation

## Troubleshooting

### "Gemini API key is not configured"

- Ensure you've created the `.env.local` file
- Verify the API key is correct (no extra spaces)
- Restart the development server after adding the key

### Chat history not persisting

- Check that the `data/` directory exists
- Verify file permissions allow read/write access
- Check browser console for errors

### API errors

- Verify your API key is valid and active
- Check your internet connection
- Ensure you haven't exceeded API rate limits
- Review Google AI Studio for API status

## Performance Optimization

- Messages are loaded from JSON file only once on mount
- Smooth scrolling with React refs
- Optimized animations using CSS transforms
- Responsive images and lazy loading
- Production build includes automatic Next.js optimizations

## Security Notes

- Never commit `.env.local` to version control (already in `.gitignore`)
- Store API keys securely
- The chat history file contains conversation data - secure it appropriately
- Consider adding authentication for production use
- Implement rate limiting for API endpoints in production

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

Feel free to submit issues, fork the repository, and create pull requests for any improvements.

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Built with [Next.js](https://nextjs.org)
- Powered by [Google Gemini](https://ai.google.dev)
- Styled with [Tailwind CSS](https://tailwindcss.com)
- UI inspired by Google's Gemini interface

## Support

If you encounter any issues or have questions:
1. Check the troubleshooting section above
2. Review the [Gemini API documentation](https://ai.google.dev/docs)
3. Check the [Next.js documentation](https://nextjs.org/docs)

---

Made with ♥ using Next.js and Google Gemini AI
