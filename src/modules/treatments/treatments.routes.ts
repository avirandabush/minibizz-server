import { Router } from 'express'
import { prisma } from '../../config/prisma'
import { attachUser } from '../../middleware/auth.middleware'

const router = Router()
router.use(attachUser)

router.get('/', async (req, res) => {
    const userId = (req as any).userId

    const treatments = await prisma.treatment.findMany({
        where: { userId },
    })

    res.json(
        treatments.map(t => ({
            ...t,
            specs: JSON.parse(t.specs),
        }))
    )
})

router.post('/', async (req, res) => {
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
        specs: JSON.parse(treatment.specs),
    })
})

router.patch('/:id', async (req, res) => {
    const updated = await prisma.treatment.update({
        where: { id: req.params.id },
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
        specs: JSON.parse(updated.specs),
    })
})

router.delete('/:id', async (req, res) => {
    await prisma.treatment.delete({
        where: { id: req.params.id },
    })

    res.json({ success: true })
})

export default router