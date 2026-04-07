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

        const payments = await prisma.payment.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        })

        const formattedPayments = payments.map(p => ({
            ...p,
            items: safeParse(p.items, []),
            summary: safeParse(p.summary, { subtotal: 0, discount: 0, total: 0 }),
        }))

        res.json(formattedPayments);
    } catch (error) {
        handleError(res, error, "Failed to fetch payments");
    }
})

router.get('/:id', async (req, res) => {
    try {
        const userId = (req as any).userId

        const payment = await prisma.payment.findFirst({
            where: {
                id: req.params.id,
                userId,
            },
        })

        if (!payment) {
            return res.status(404).json({ error: "Payment not found" })
        }

        res.json({
            ...payment,
            items: safeParse(payment.items, []),
            summary: safeParse(payment.summary, { subtotal: 0, discount: 0, total: 0 }),
        })
    } catch (error) {
        handleError(res, error, "Failed to fetch payment");
    }
})

router.post('/', async (req, res) => {
    try {
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
            items: safeParse(payment.items, []),
            summary: safeParse(payment.summary, { subtotal: 0, discount: 0, total: 0 }),
        })
    } catch (error) {
        handleError(res, error, "Failed to create payment");
    }
})

router.patch('/:id', async (req, res) => {
    try {
        const userId = (req as any).userId

        const updated = await prisma.payment.update({
            where: {
                id: req.params.id,
                userId,
            },
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
            items: safeParse(updated.items, []),
            summary: safeParse(updated.summary, { subtotal: 0, discount: 0, total: 0 }),
        })
    } catch (error) {
        handleError(res, error, "Failed to update payment");
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const userId = (req as any).userId

        await prisma.payment.delete({
            where: {
                id: req.params.id,
                userId,
            },
        })

        res.json({ success: true })
    } catch (error) {
        handleError(res, error, "Failed to delete payment");
    }
})

export default router