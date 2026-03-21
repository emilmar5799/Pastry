import { Router } from 'express';
import * as controller from '../controllers/report.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { allowRoles } from '../middlewares/role.middleware';

const router = Router();

router.use(authMiddleware);
router.use(allowRoles('ADMIN'));

router.get('/general', controller.generalReport);
router.get('/daily-income', controller.dailyIncomeReport);

export default router;
