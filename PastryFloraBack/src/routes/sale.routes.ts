import { Router } from 'express';
import * as controller from '../controllers/sale.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { allowRoles } from '../middlewares/role.middleware';

const router = Router();

router.use(authMiddleware);

// TODOS venden
router.post('/', controller.create);

// ADMIN + SUPERVISOR

router.get('/', controller.list);
router.get('/:id', controller.getById);
router.put('/:id', controller.update);
router.use(allowRoles('ADMIN', 'SUPERVISOR'));
router.delete('/:id', controller.remove);

export default router;
