import { NextResponse } from 'next/server';

// Static users database (same as login)
const STATIC_USERS = [
  {
    id: 1,
    username: "admin",
    password: "admin123",
    name: "Administrator",
    email: "admin@gemini.local",
    role: "admin",
    avatar: null
  },
  {
    id: 2,
    username: "user",
    password: "user123",
    name: "User",
    email: "user@gemini.local",
    role: "user",
    avatar: null
  },
  {
    id: 3,
    username: "demo",
    password: "demo123",
    name: "Demo User",
    email: "demo@gemini.local",
    role: "demo",
    avatar: null
  }
];

export async function GET(request) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: "No authorization token provided" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    try {
      // Decode the simple base64 token
      const decoded = Buffer.from(token, 'base64').toString('utf-8');
      const [userId] = decoded.split(':');

      // Find user by ID
      const user = STATIC_USERS.find(u => u.id === parseInt(userId));

      if (!user) {
        return NextResponse.json(
          { success: false, error: "Invalid token" },
          { status: 401 }
        );
      }

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;

      return NextResponse.json(
        {
          success: true,
          user: userWithoutPassword
        },
        { status: 200 }
      );

    } catch (decodeError) {
      return NextResponse.json(
        { success: false, error: "Invalid token format" },
        { status: 401 }
      );
    }

  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
