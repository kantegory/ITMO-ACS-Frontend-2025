import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import SETTINGS from '../config/settings'

export function authMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
    ) {
    const header = req.header('Authorization')

    if (!header || !header.startsWith('Bearer ')) {
        res.status(401).json({ message: 'Missing or invalid Authorization header' })
        return
    }

    const token = header.slice(7)

    try {
        const decoded = jwt.verify(token, SETTINGS.JWT_SECRET_KEY) as any

        ;(req as any).user = {
        userId: decoded.userId ?? decoded.user_id ?? decoded.id,
        email: decoded.email,
        }

        next()
    } catch (err) {
        res.status(401).json({ message: 'Invalid or expired token' })
    }
}
