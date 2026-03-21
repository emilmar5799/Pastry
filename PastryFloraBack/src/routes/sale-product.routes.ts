import { Router } from 'express';
import { remove } from '../controllers/sale-product.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { allowRoles } from '../middlewares/role.middleware';

const router = Router();

router.use(authMiddleware);
router.use(allowRoles('ADMIN', 'SUPERVISOR'));

router.delete('/products/:id', remove);

export default router;
