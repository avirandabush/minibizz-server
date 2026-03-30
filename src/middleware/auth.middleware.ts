import { Request, Response, NextFunction } from 'express'
import admin from 'firebase-admin'

admin.initializeApp({
    credential: admin.credential.cert(require('../config/serviceAccountKey.json')),
})

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