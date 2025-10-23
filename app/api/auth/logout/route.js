import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // In a real app, you would invalidate the token here
    // For static auth, we just return success
    return NextResponse.json(
      {
        success: true,
        message: "Logged out successfully"
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
