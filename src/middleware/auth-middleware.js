import { admin } from '../application/firebase.js';
import { AuthenticationError } from '../error/authentication-error.js';

export const authMiddleware = async (req, res, next) => {
  const authHeader = req.get('Authorization');
  const token =
    authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) {
    next(
      new AuthenticationError(
        'You need to sign in to access this resource',
        'AUTH_REQUIRED'
      )
    );
  } else {
    try {
      const decoded = await admin.auth().verifyIdToken(token);
      console.log(decoded);
      req.user = decoded;
      next();
    } catch {
      next(
        new AuthenticationError('Invalid or expired token', 'INVALID_TOKEN')
      );
    }
  }
};
