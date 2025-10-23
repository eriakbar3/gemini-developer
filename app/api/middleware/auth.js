import { NextResponse } from 'next/server';

// Static users database (same as in login route)
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

/**
 * Middleware function to verify authentication token
 * @param {Request} request - The incoming request
 * @returns {Object|null} - User object if authenticated, null otherwise
 */
export async function verifyAuth(request) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    try {
      // Decode the simple base64 token
      const decoded = Buffer.from(token, 'base64').toString('utf-8');
      const [userId] = decoded.split(':');

      // Find user by ID
      const user = STATIC_USERS.find(u => u.id === parseInt(userId));

      if (!user) {
        return null;
      }

      // Remove password from user object
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;

    } catch (decodeError) {
      return null;
    }

  } catch (error) {
    console.error('Auth verification error:', error);
    return null;
  }
}

/**
 * Middleware wrapper for protected routes
 * @param {Function} handler - The route handler function
 * @returns {Function} - Wrapped handler with auth check
 */
export function withAuth(handler) {
  return async (request, context) => {
    const user = await verifyAuth(request);

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Attach user to request for handler to use
    request.user = user;
    return handler(request, context);
  };
}

/**
 * Middleware wrapper for role-based access
 * @param {Function} handler - The route handler function
 * @param {Array<string>} allowedRoles - Array of allowed roles
 * @returns {Function} - Wrapped handler with auth and role check
 */
export function withRole(handler, allowedRoles = []) {
  return async (request, context) => {
    const user = await verifyAuth(request);

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      return NextResponse.json(
        { success: false, error: "Forbidden - Insufficient permissions" },
        { status: 403 }
      );
    }

    // Attach user to request for handler to use
    request.user = user;
    return handler(request, context);
  };
}
