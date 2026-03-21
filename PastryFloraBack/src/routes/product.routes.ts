import { Router } from 'express';
import * as controller from '../controllers/product.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { allowRoles } from '../middlewares/role.middleware';

const router = Router();


router.use(authMiddleware);

router.get('/', controller.list);
router.use(allowRoles('ADMIN', 'SUPERVISOR'));

router.post('/', controller.create);

router.get('/:id', controller.getById);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);

export default router;
