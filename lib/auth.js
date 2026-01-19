/**
 * Authentication utilities
 * JWT token verification for API routes
 */
import { jwtVerify } from 'jose';

/**
 * Verify JWT token from request
 * @param {Request} req - Request object with Authorization header or cookie
 * @returns {Object|null} - Decoded user payload or null
 */
export async function verifyToken(req) {
  try {
    // Get token from Authorization header or cookie
    let token = null;

    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    } else if (req.headers.cookie) {
      // Parse cookie manually if cookies not parsed
      const cookies = req.headers.cookie.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split('=');
        acc[key] = value;
        return acc;
      }, {});
      token = cookies.token;
    }

    if (!token) {
      return null;
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'amulet-secret-key');
    const { payload } = await jwtVerify(token, secret);

    return payload;
  } catch (error) {
    console.error('Token verification error:', error.message);
    return null;
  }
}

/**
 * Middleware to require authentication
 * Use in API routes: const user = await requireAuth(req, res);
 */
export async function requireAuth(req, res) {
  const user = await verifyToken(req);
  if (!user) {
    res.status(401).json({ message: 'Unauthorized' });
    return null;
  }
  return user;
}
