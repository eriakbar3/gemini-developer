import { NextResponse } from 'next/server';
import { withRole } from '../../middleware/auth';

// Static users database
const STATIC_USERS = [
  {
    id: 1,
    username: "admin",
    name: "Administrator",
    email: "admin@gemini.local",
    role: "admin",
    createdAt: "2025-01-01T00:00:00Z"
  },
  {
    id: 2,
    username: "user",
    name: "User",
    email: "user@gemini.local",
    role: "user",
    createdAt: "2025-01-02T00:00:00Z"
  },
  {
    id: 3,
    username: "demo",
    name: "Demo User",
    email: "demo@gemini.local",
    role: "demo",
    createdAt: "2025-01-03T00:00:00Z"
  }
];

async function handler(request) {
  try {
    // User is already verified and role-checked by withRole middleware
    const currentUser = request.user;

    // Return all users (without passwords)
    return NextResponse.json(
      {
        success: true,
        users: STATIC_USERS,
        requestedBy: {
          id: currentUser.id,
          name: currentUser.name,
          role: currentUser.role
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Export protected route - only accessible by admin role
export const GET = withRole(handler, ['admin']);
