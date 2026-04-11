import { Request, Response, NextFunction } from 'express'
import admin from 'firebase-admin'
import { AppError } from '../utils/appError'
import { handleError } from '../utils/handleError'

if (!admin.apps.length) {
  try {
    const serviceAccountVar = process.env.FIREBASE_SERVICE_ACCOUNT;
    if (serviceAccountVar) {
      const serviceAccount = JSON.parse(serviceAccountVar);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } else {
      const serviceAccount = require('../config/serviceAccountKey.json');
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    }
  } catch (error) {
    console.error("Firebase Admin initialization error:", error);
  }
}

export async function attachUser(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    const devToken = req.headers['x-dev-token'];
    const masterKey = process.env.DEV_MASTER_KEY;

    if (process.env.NODE_ENV !== 'production' && masterKey && devToken === masterKey) {
      (req as any).userId = 'TEST_USER_123';
      return next();
    }

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError(401, 'No token provided');
    }

    const token = authHeader.split(' ')[1];

    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      (req as any).userId = decodedToken.uid;
      next();
    } catch (firebaseError) {
      throw new AppError(401, 'Invalid or expired token');
    }

  } catch (error) {
    handleError(res, error, 'Authentication failed');
  }
}