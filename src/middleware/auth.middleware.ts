import { Request, Response, NextFunction } from 'express'
import admin from 'firebase-admin'

// admin.initializeApp({
//     credential: admin.credential.cert(require('../config/serviceAccountKey.json')),
// })

if (!admin.apps.length) {
  try {
    const serviceAccountVar = process.env.FIREBASE_SERVICE_ACCOUNT;
    
    if (serviceAccountVar) {
      // בשרת (Render): קורא מהזיכרון (משתנה סביבה)
      const serviceAccount = JSON.parse(serviceAccountVar);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } else {
      // במחשב שלך: קורא מהקובץ הפיזי
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
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        (req as any).userId = decodedToken.uid;
        next();
    } catch (error) {
        console.error('Error verifying Firebase token:', error);
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
}