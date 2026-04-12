import admin from 'firebase-admin';
import { AppError } from '../utils/appError';

const getServiceAccount = () => {
    if (!process.env.FB_PROJECT_ID || !process.env.FB_PRIVATE_KEY || !process.env.FB_CLIENT_EMAIL) {
        throw new Error('Missing Firebase environment variables');
    }

    return {
        projectId: process.env.FB_PROJECT_ID,
        clientEmail: process.env.FB_CLIENT_EMAIL,
        privateKey: process.env.FB_PRIVATE_KEY.replace(/\\n/g, '\n'),
    };
};

export function initializeFirebase() {
    if (admin.apps.length > 0) return admin;

    try {
        const serviceAccount = getServiceAccount();

        return admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
    } catch (error) {
        throw new AppError(500, 'Critical: Failed to initialize Firebase Admin.');
    }
}

export function getAuth() {
    initializeFirebase()
    return admin.auth()
}