import { Router } from 'express'
import { prisma } from '../../config/prisma'
import { attachUser } from '../../middleware/auth.middleware'

const router = Router()
router.use(attachUser)

router.get('/', async (req, res) => {
    const userId = (req as any).userId

    const customers = await prisma.customer.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
    })

    res.json(
        customers.map(c => ({
            ...c,
            personal: JSON.parse(c.personal),
            contact: JSON.parse(c.contact),
            stats: JSON.parse(c.stats),
        }))
    )
})

router.get('/:id', async (req, res) => {
    const userId = (req as any).userId

    const c = await prisma.customer.findFirst({
        where: { id: req.params.id, userId },
    })

    if (!c) return res.status(404).send('Not found')

    res.json({
        ...c,
        personal: JSON.parse(c.personal),
        contact: JSON.parse(c.contact),
        stats: JSON.parse(c.stats),
    })
})

router.post('/', async (req, res) => {
    const userId = (req as any).userId

    const customer = await prisma.customer.create({
        data: {
            userId,
            personal: JSON.stringify(req.body.personal),
            contact: JSON.stringify(req.body.contact),
            stats: JSON.stringify(req.body.stats || {}),

            leadSource: req.body.leadSource,
            isActive: req.body.isActive ?? true,

            createdAt: new Date(),
            updatedAt: new Date(),
        },
    })

    res.json({
        ...customer,
        personal: JSON.parse(customer.personal),
        contact: JSON.parse(customer.contact),
        stats: JSON.parse(customer.stats),
    })
})

router.patch('/:id', async (req, res) => {
    const userId = (req as any).userId

    const updated = await prisma.customer.update({
        where: { id: req.params.id },
        data: {
            personal: req.body.personal
                ? JSON.stringify(req.body.personal)
                : undefined,
            contact: req.body.contact
                ? JSON.stringify(req.body.contact)
                : undefined,
            stats: req.body.stats
                ? JSON.stringify(req.body.stats)
                : undefined,

            leadSource: req.body.leadSource,
            isActive: req.body.isActive,

            updatedAt: new Date(),
        },
    })

    res.json({
        ...updated,
        personal: JSON.parse(updated.personal),
        contact: JSON.parse(updated.contact),
        stats: JSON.parse(updated.stats),
    })
})

router.delete('/:id', async (req, res) => {
    await prisma.customer.delete({
        where: { id: req.params.id },
    })

    res.json({ success: true })
})

export default router