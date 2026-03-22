import { Router } from 'express';
import * as controller from '../controllers/branch.controller';

const router = Router();
router.get('/', controller.list);

export default router;
