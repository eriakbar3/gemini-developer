import { NextResponse } from 'next/server';
import { withAuth } from '../../middleware/auth';

// Static chat history data (for demonstration)
const CHAT_HISTORY = {
  1: [ // admin
    { id: 1, title: "How to use React Hooks", timestamp: "2025-10-15T10:30:00Z" },
    { id: 2, title: "Next.js App Router Guide", timestamp: "2025-10-15T14:20:00Z" },
    { id: 3, title: "Tailwind CSS Tips", timestamp: "2025-10-16T09:15:00Z" },
  ],
  2: [ // user
    { id: 4, title: "JavaScript Promises", timestamp: "2025-10-14T16:45:00Z" },
    { id: 5, title: "API Design Best Practices", timestamp: "2025-10-15T11:30:00Z" },
  ],
  3: [ // demo
    { id: 6, title: "Getting Started with AI", timestamp: "2025-10-16T08:00:00Z" },
  ]
};

async function handler(request) {
  try {
    // User is already verified by withAuth middleware
    const user = request.user;

    // Get chat history for this user
    const userHistory = CHAT_HISTORY[user.id] || [];

    return NextResponse.json(
      {
        success: true,
        history: userHistory,
        user: {
          id: user.id,
          name: user.name,
          role: user.role
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Get chat history error:', error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Export protected route
export const GET = withAuth(handler);
