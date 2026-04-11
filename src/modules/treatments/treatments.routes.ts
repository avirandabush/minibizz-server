// import { Router } from 'express'
// import { prisma } from '../../config/prisma'
// import { attachUser } from '../../middleware/auth.middleware'
// import { safeParse } from '../../utils/safeJson'
// import { handleError } from '../../utils/handleError'

// const router = Router()
// router.use(attachUser)

// router.get('/', async (req, res) => {
//     try {
//         const userId = (req as any).userId

//         const treatments = await prisma.treatment.findMany({
//             where: { userId },
//         })

//         res.json(
//             treatments.map(t => ({
//                 ...t,
//                 specs: safeParse(t.specs, {}),
//             }))
//         )
//     } catch (error) {
//         handleError(res, error, "Failed to fetch treatments");
//     }
// })

// router.post('/', async (req, res) => {
//     try {
//         const userId = (req as any).userId

//         const treatment = await prisma.treatment.create({
//             data: {
//                 userId,
//                 name: req.body.name,
//                 description: req.body.description,

//                 isFavorite: req.body.isFavorite ?? false,
//                 isActive: req.body.isActive ?? true,

//                 specs: JSON.stringify(req.body.specs),
//                 color: req.body.color,

//                 createdAt: new Date(),
//                 updatedAt: new Date(),
//             },
//         })

//         res.json({
//             ...treatment,
//             specs: safeParse(treatment.specs, {}),
//         })
//     } catch (error) {
//         handleError(res, error, "Failed to create treatment");
//     }
// })

// router.patch('/:id', async (req, res) => {
//     try {
//         const userId = (req as any).userId

//         const updated = await prisma.treatment.update({
//             where: {
//                 id: req.params.id,
//                 userId,
//             },
//             data: {
//                 name: req.body.name,
//                 description: req.body.description,
//                 isFavorite: req.body.isFavorite,
//                 isActive: req.body.isActive,
//                 specs: req.body.specs
//                     ? JSON.stringify(req.body.specs)
//                     : undefined,
//                 color: req.body.color,
//                 updatedAt: new Date(),
//             },
//         })

//         res.json({
//             ...updated,
//             specs: safeParse(updated.specs, {}),
//         })
//     } catch (error) {
//         handleError(res, error, "Failed to update treatment");
//     }
// })

// router.delete('/:id', async (req, res) => {
//     try {
//         const userId = (req as any).userId

//         await prisma.treatment.delete({
//             where: {
//                 id: req.params.id,
//                 userId,
//             },
//         })

//         res.json({ success: true })
//     } catch (error) {
//         handleError(res, error, "Failed to delete treatment");
//     }
// })

// export default router

import { Router } from 'express';
import { attachUser } from '../../middleware/auth.middleware';
import * as service from './treatments.service';
import * as validation from './treatments.validation';
import { handleError } from '../../utils/handleError';

const router = Router();
router.use(attachUser);

router.get('/', async (req, res) => {
    try {
        const data = await service.getTreatments((req as any).userId);
        res.json(data);
    } catch (err) {
        handleError(res, err, 'Failed to fetch treatments');
    }
});

router.post('/', async (req, res) => {
    try {
        const error = validation.validateTreatment(req.body);
        if (error) return res.status(400).json({ error });

        const data = await service.createTreatment((req as any).userId, req.body);
        res.json(data);
    } catch (err) {
        handleError(res, err, 'Failed to create treatment');
    }
});

router.patch('/:id', async (req, res) => {
    try {
        const error = validation.validateTreatment(req.body);
        if (error) return res.status(400).json({ error });

        const data = await service.updateTreatment((req as any).userId, req.params.id, req.body);
        res.json(data);
    } catch (err) {
        handleError(res, err, 'Failed to update treatment');
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await service.deleteTreatment((req as any).userId, req.params.id);
        res.json({ success: true });
    } catch (err) {
        handleError(res, err, 'Failed to delete treatment');
    }
});

export default router;