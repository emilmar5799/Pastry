import { Router } from 'express';
import * as controller from '../controllers/order.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { allowRoles } from '../middlewares/role.middleware';

const router = Router();

router.use(authMiddleware);

// ADMIN, SUPERVISOR, SELLER
router.post('/', allowRoles('ADMIN', 'SUPERVISOR', 'SELLER', 'REFILL'), controller.create);
router.get('/', allowRoles('ADMIN', 'SUPERVISOR', 'SELLER', 'REFILL'), controller.list);
router.get('/:id', allowRoles('ADMIN', 'SUPERVISOR', 'SELLER', 'REFILL'), controller.get);
router.put('/:id', allowRoles('ADMIN', 'SUPERVISOR', 'SELLER', 'REFILL'), controller.update);

// STATUS PATCHES (ADMIN + SUPERVISOR)
router.patch('/:id/failed', allowRoles('ADMIN', 'SUPERVISOR'), controller.markFailed);
router.patch('/:id/delivered', allowRoles('ADMIN', 'SUPERVISOR'), controller.markDelivered);
router.patch('/:id/done', allowRoles('ADMIN', 'SUPERVISOR'), controller.markDone);
router.patch('/:id/finished', allowRoles('ADMIN', 'SUPERVISOR'), controller.markFinished);

export default router;
