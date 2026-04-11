import { Response } from 'express';
import { AppError } from './appError';

export function handleError(res: Response, error: any, defaultMessage: string) {
  console.error(`[Error] ${defaultMessage}:`, error);

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({ error: error.message });
  }

  res.status(500).json({ error: defaultMessage });
}