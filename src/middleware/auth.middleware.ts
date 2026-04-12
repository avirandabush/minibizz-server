import { Request, Response, NextFunction } from 'express'
import { getAuth } from '../config/firebase'
import { AppError } from '../utils/appError'
import { handleError } from '../utils/handleError'

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export async function attachUser(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    const devToken = req.headers['x-dev-token'];
    const masterKey = process.env.DEV_MASTER_KEY;

    const isLocal = req.hostname === 'localhost' || req.hostname === '127.0.0.1';
    if (process.env.NODE_ENV !== 'production' && isLocal && masterKey && devToken === masterKey) {
      req.userId = 'TEST_USER_123';
      return next();
    }

    if (!authHeader) {
      throw new AppError(401, 'Missing authorization header')
    }

    if (!authHeader.startsWith('Bearer ')) {
      throw new AppError(401, 'Malformed bearer token')
    }

    const token = authHeader.split(' ')[1];

    try {
      const decodedToken = await getAuth().verifyIdToken(token);
      req.userId = decodedToken.uid;
      next();
    } catch (firebaseError: any) {
      if (firebaseError.code?.startsWith('auth/')) {
        throw new AppError(401, 'Invalid or expired token');
      }
      throw new AppError(500, 'Internal authentication service error');
    }
  } catch (error) {
    handleError(res, error, 'Authentication failed');
  }
}