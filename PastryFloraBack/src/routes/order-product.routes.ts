import { Router } from 'express';
import * as controller from '../controllers/order-product.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { allowRoles } from '../middlewares/role.middleware';

const router = Router();

router.use(authMiddleware);
// REFILL solo puede listar
router.get('/:orderId/products',allowRoles('REFILL', 'SUPERVISOR', 'ADMIN'), controller.list);

// ADMIN y SUPERVISOR pueden hacer todo
router.post('/:orderId/products', allowRoles('ADMIN', 'SUPERVISOR'), controller.add);
router.put('/products/:id', allowRoles('ADMIN', 'SUPERVISOR'), controller.update);
router.delete('/products/:id', allowRoles('ADMIN', 'SUPERVISOR'), controller.remove);

export default router;