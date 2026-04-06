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

        const customers = await prisma.customer.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        })

        res.json(
            customers.map(c => ({
                ...c,
                personal: safeParse(c.personal, {}),
                contact: safeParse(c.contact, {}),
                stats: safeParse(c.stats, {}),
            }))
        )
    } catch (error) {
        handleError(res, error, "Failed to fetch customers");
    }
})

router.get('/:id', async (req, res) => {
    try {
        const userId = (req as any).userId

        const c = await prisma.customer.findFirst({
            where: {
                id: req.params.id,
                userId,
            },
        })

        if (!c) return res.status(404).send('Not found')

        res.json({
            ...c,
            personal: safeParse(c.personal, {}),
            contact: safeParse(c.contact, {}),
            stats: safeParse(c.stats, {}),
        })
    } catch (error) {
        handleError(res, error, "Failed to fetch customer");
    }
})

router.post('/', async (req, res) => {
    try {
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
            personal: safeParse(customer.personal, {}),
            contact: safeParse(customer.contact, {}),
            stats: safeParse(customer.stats, {}),
        })
    } catch (error) {
        handleError(res, error, "Failed to create customer");
    }
})

router.patch('/:id', async (req, res) => {
    try {
        const userId = (req as any).userId

        const updated = await prisma.customer.update({
            where: {
                id: req.params.id,
                userId,
            },
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
            personal: safeParse(updated.personal, {}),
            contact: safeParse(updated.contact, {}),
            stats: safeParse(updated.stats, {}),
        })
    } catch (error) {
        handleError(res, error, "Failed to update customer");
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const userId = (req as any).userId

        await prisma.customer.delete({
            where: {
                id: req.params.id,
                userId,
            },
        })

        res.json({ success: true })
    } catch (error) {
        handleError(res, error, "Failed to delete customer");
    }
})

export default router