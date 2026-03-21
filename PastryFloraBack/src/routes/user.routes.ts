import { Router } from 'express'
import * as controller from '../controllers/user.controller'
import { authMiddleware } from '../middlewares/auth.middleware'
import { allowRoles } from '../middlewares/role.middleware'

const router = Router()

router.use(authMiddleware)
router.use(allowRoles('ADMIN'))

router.post('/', controller.createUser)

router.get('/', controller.getUsers)
router.get('/inactive', controller.getInactiveUsers)
router.get('/:id', controller.getUserById)

router.put('/:id', controller.updateUser)

router.delete('/:id', controller.deleteUser)
router.patch('/:id/reactivate', controller.reactivateUser)

export default router
