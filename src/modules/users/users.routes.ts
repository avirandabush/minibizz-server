import { Router } from 'express';
import { attachUser } from '../../middleware/auth.middleware';
import * as service from './users.service';
import * as validation from './users.validation';
import { handleError } from '../../utils/handleError';

const router = Router();

router.post('/', attachUser, async (req, res) => {
    try {
        const data = await service.syncUser((req as any).userId, req.body);
        res.json(data);
    } catch (err) {
        handleError(res, err, 'Failed to sync user');
    }
});

router.get('/me', attachUser, async (req, res) => {
    try {
        const data = await service.getUserProfile((req as any).userId);
        res.json(data);
    } catch (err) {
        handleError(res, err, 'Failed to fetch profile');
    }
});

router.patch('/me', attachUser, async (req, res) => {
    try {
        const error = validation.validateUpdateProfile(req.body);
        if (error) return res.status(400).json({ error });

        const data = await service.updateProfile((req as any).userId, req.body);
        res.json(data);
    } catch (err) {
        handleError(res, err, 'Failed to update profile');
    }
});

export default router;