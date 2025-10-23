import { NextResponse } from 'next/server';

// Static users database
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

export async function POST(request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // Validation
    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: "Username and password are required" },
        { status: 400 }
      );
    }

    // Find user
    const user = STATIC_USERS.find(
      u => u.username === username && u.password === password
    );

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid username or password" },
        { status: 401 }
      );
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    // Generate a simple static token (in production, use JWT)
    const token = Buffer.from(`${user.id}:${user.username}:${Date.now()}`).toString('base64');

    return NextResponse.json(
      {
        success: true,
        user: userWithoutPassword,
        token: token
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
