import { Router } from 'express';
import { attachUser } from '../../middleware/auth.middleware';
import * as service from './customers.service';
import * as validation from './customers.validation';
import { handleError } from '../../utils/handleError';

const router = Router();
router.use(attachUser);

router.get('/', async (req, res) => {
    try {
        const data = await service.getCustomers((req as any).userId);
        res.json(data);
    } catch (err) {
        handleError(res, err, 'Failed to fetch customers');
    }
});

router.get('/:id', async (req, res) => {
    try {
        const data = await service.getCustomer((req as any).userId, req.params.id);
        res.json(data);
    } catch (err) {
        handleError(res, err, 'Failed to fetch customer');
    }
});

router.post('/', async (req, res) => {
    try {
        const error = validation.validateCustomer(req.body);
        if (error) return res.status(400).json({ error });

        const data = await service.createCustomer((req as any).userId, req.body);
        res.json(data);
    } catch (err) {
        handleError(res, err, 'Failed to create customer');
    }
});

router.patch('/:id', async (req, res) => {
    try {
        const error = validation.validateCustomer(req.body);
        if (error) return res.status(400).json({ error });

        const data = await service.updateCustomer((req as any).userId, req.params.id, req.body);
        res.json(data);
    } catch (err) {
        handleError(res, err, 'Failed to update customer');
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await service.deleteCustomer((req as any).userId, req.params.id);
        res.json({ success: true });
    } catch (err) {
        handleError(res, err, 'Failed to delete customer');
    }
});

export default router;