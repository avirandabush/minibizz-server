import { Router } from 'express'
import { prisma } from '../../config/prisma'
import { attachUser } from '../../middleware/auth.middleware'
import { safeParse } from '../../utils/safeJson'
import { handleError } from '../../utils/handleError'

const router = Router()
router.use(attachUser)

router.get('/', async (req, res) => {
    try {
        const userId = (req as any).userId

        const treatments = await prisma.treatment.findMany({
            where: { userId },
        })

        res.json(
            treatments.map(t => ({
                ...t,
                specs: safeParse(t.specs, {}),
            }))
        )
    } catch (error) {
        handleError(res, error, "Failed to fetch treatments");
    }
})

router.post('/', async (req, res) => {
    try {
        const userId = (req as any).userId

        const treatment = await prisma.treatment.create({
            data: {
                userId,
                name: req.body.name,
                description: req.body.description,

                isFavorite: req.body.isFavorite ?? false,
                isActive: req.body.isActive ?? true,

                specs: JSON.stringify(req.body.specs),
                color: req.body.color,

                createdAt: new Date(),
                updatedAt: new Date(),
            },
        })

        res.json({
            ...treatment,
            specs: safeParse(treatment.specs, {}),
        })
    } catch (error) {
        handleError(res, error, "Failed to create treatment");
    }
})

router.patch('/:id', async (req, res) => {
    try {
        const userId = (req as any).userId

        const updated = await prisma.treatment.update({
            where: {
                id: req.params.id,
                userId,
            },
            data: {
                name: req.body.name,
                description: req.body.description,
                isFavorite: req.body.isFavorite,
                isActive: req.body.isActive,
                specs: req.body.specs
                    ? JSON.stringify(req.body.specs)
                    : undefined,
                color: req.body.color,
                updatedAt: new Date(),
            },
        })

        res.json({
            ...updated,
            specs: safeParse(updated.specs, {}),
        })
    } catch (error) {
        handleError(res, error, "Failed to update treatment");
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const userId = (req as any).userId

        await prisma.treatment.delete({
            where: {
                id: req.params.id,
                userId,
            },
        })

        res.json({ success: true })
    } catch (error) {
        handleError(res, error, "Failed to delete treatment");
    }
})

export default router