import { Request, Response, NextFunction } from 'express'

export function attachUser(req: Request, res: Response, next: NextFunction) {
    const userId = req.query.userId || req.body.userId

    if (!userId) {
        return res.status(401).send('Unauthorized')
    }

    ; (req as any).userId = userId
    next()
}