import { Router } from 'express'
import { prisma } from '../../config/prisma'
import { attachUser } from '../../middleware/auth.middleware'

const router = Router()
router.use(attachUser)

router.get('/', async (req, res) => {
    const userId = (req as any).userId

    const payments = await prisma.payment.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
    })

    res.json(
        payments.map(p => ({
            ...p,
            items: JSON.parse(p.items),
            summary: JSON.parse(p.summary),
        }))
    )
})

router.post('/', async (req, res) => {
    const userId = (req as any).userId

    const payment = await prisma.payment.create({
        data: {
            userId,
            customerId: req.body.customerId,

            items: JSON.stringify(req.body.items),
            summary: JSON.stringify(req.body.summary),

            method: req.body.method,
            status: req.body.status,
            date: new Date(req.body.date),

            referenceNumber: req.body.referenceNumber,

            createdAt: new Date(),
            updatedAt: new Date(),
        },
    })

    res.json({
        ...payment,
        items: JSON.parse(payment.items),
        summary: JSON.parse(payment.summary),
    })
})

router.patch('/:id', async (req, res) => {
    const updated = await prisma.payment.update({
        where: { id: req.params.id },
        data: {
            items: req.body.items
                ? JSON.stringify(req.body.items)
                : undefined,
            summary: req.body.summary
                ? JSON.stringify(req.body.summary)
                : undefined,
            status: req.body.status,
            method: req.body.method,
            updatedAt: new Date(),
        },
    })

    res.json({
        ...updated,
        items: JSON.parse(updated.items),
        summary: JSON.parse(updated.summary),
    })
})

router.delete('/:id', async (req, res) => {
    await prisma.payment.delete({
        where: { id: req.params.id },
    })

    res.json({ success: true })
})

export default router