import { Router } from 'express'
import { prisma } from '../../config/prisma'
import { attachUser } from '../../middleware/auth.middleware'
import { safeParse } from '../../utils/safeJson'
import { handleError } from '../../utils/handleError'

const router = Router()

router.post('/', async (req, res) => {
    try {
        const { authId, userId, ...data } = req.body
        const idToUse = authId || userId

        if (!idToUse) {
            return res.status(400).json({ error: 'Missing authId from Firebase' })
        }

        const existing = await prisma.user.findUnique({
            where: { id: idToUse },
        })

        if (existing) {
            const updated = await prisma.user.update({
                where: { id: idToUse },
                data: { lastLogin: new Date() }
            })

            return res.json({
                ...updated,
                contact: safeParse(updated.contact, {}),
                business: safeParse(updated.business, {}),
                preferences: safeParse(updated.preferences, {}),
            })
        }

        const user = await prisma.user.create({
            data: {
                id: idToUse,
                ...data,
                contact: JSON.stringify(data.contact || {}),
                business: JSON.stringify(data.business || {}),
                preferences: JSON.stringify(data.preferences || {}),

                plan: data.plan || 'SILVER',
                status: data.status || 'ACTIVE',

                createdAt: new Date(),
                updatedAt: new Date(),
                lastLogin: new Date(),
            },
        })

        res.json({
            ...user,
            contact: safeParse(user.contact, {}),
            business: safeParse(user.business, {}),
            preferences: safeParse(user.preferences, {}),
        })
    } catch (error) {
        handleError(res, error, "Failed to create or update user");
    }
})

// users.routes.ts

router.patch('/me', attachUser, async (req, res) => {
    try {
        const userId = (req as any).userId;
        const data = req.body;

        const updated = await prisma.user.update({
            where: { id: userId },
            data: {
                name: data.name,
                contact: data.contact ? JSON.stringify(data.contact) : undefined,
                business: data.business ? JSON.stringify(data.business) : undefined,
                preferences: data.preferences ? JSON.stringify(data.preferences) : undefined,
                updatedAt: new Date(),
            },
        });

        res.json({
            ...updated,
            contact: safeParse(updated.contact, {}),
            business: safeParse(updated.business, {}),
            preferences: safeParse(updated.preferences, {}),
        });
    } catch (error) {
        handleError(res, error, "Failed to update profile");
    }
});

router.get('/me', attachUser, async (req, res) => {
    try {
        const userId = (req as any).userId

        if (!userId) return res.status(401).send('Unauthorized')

        const user = await prisma.user.findUnique({
            where: { id: userId },
        })

        if (!user) return res.status(404).send('User not found')

        res.json({
            ...user,
            contact: safeParse(user.contact, {}),
            business: safeParse(user.business, {}),
            preferences: safeParse(user.preferences, {}),
        })
    } catch (error) {
        handleError(res, error, "Failed to fetch user data");
    }
})

export default router