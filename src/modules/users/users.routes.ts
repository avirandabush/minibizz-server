import { Router } from 'express'
import { prisma } from '../../config/prisma'
import { attachUser } from '../../middleware/auth.middleware'

const router = Router()

router.post('/', async (req, res) => {
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
            contact: JSON.parse(updated.contact),
            business: JSON.parse(updated.business),
            preferences: JSON.parse(updated.preferences),
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
        contact: JSON.parse(user.contact),
        business: JSON.parse(user.business),
        preferences: JSON.parse(user.preferences),
    })
})

router.get('/me', attachUser, async (req, res) => {
    const userId = (req as any).userId

    if (!userId) return res.status(401).send('Unauthorized')

    const user = await prisma.user.findUnique({
        where: { id: userId },
    })

    if (!user) return res.status(404).send('User not found')

    res.json({
        ...user,
        contact: JSON.parse(user.contact),
        business: JSON.parse(user.business),
        preferences: JSON.parse(user.preferences),
    })
})

export default router