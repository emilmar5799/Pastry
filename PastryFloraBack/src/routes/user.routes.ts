import { Router } from 'express'
import * as controller from '../controllers/user.controller'
import { authMiddleware } from '../middlewares/auth.middleware'
import { allowRoles } from '../middlewares/role.middleware'

const router = Router()

router.use(authMiddleware)

// GET endpoints: ADMIN y SUPERVISOR
router.get('/', allowRoles('ADMIN', 'SUPERVISOR'), controller.getUsers)
router.get('/inactive', allowRoles('ADMIN', 'SUPERVISOR'), controller.getInactiveUsers)
router.get('/:id', allowRoles('ADMIN', 'SUPERVISOR'), controller.getUserById)

// POST, PUT, DELETE: Solo ADMIN
router.post('/', allowRoles('ADMIN'), controller.createUser)
router.put('/:id', allowRoles('ADMIN'), controller.updateUser)
router.delete('/:id', allowRoles('ADMIN'), controller.deleteUser)
router.patch('/:id/reactivate', allowRoles('ADMIN'), controller.reactivateUser)

export default router
