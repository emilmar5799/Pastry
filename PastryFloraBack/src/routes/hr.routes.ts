import { Router } from 'express'
import * as employeeController from '../controllers/hr.employee.controller'
import * as attendanceController from '../controllers/hr.attendance.controller'
import * as payrollController from '../controllers/hr.payroll.controller'
import * as bonusController from '../controllers/hr.bonus.controller'
import { authMiddleware } from '../middlewares/auth.middleware'
import { allowRoles } from '../middlewares/role.middleware'

const router = Router()

// Aplicar autenticación a todas las rutas HR
router.use(authMiddleware)

// Permitir solo ADMIN y SUPERVISOR
router.use(allowRoles('ADMIN', 'SUPERVISOR'))

// ============================================================
// MÓDULO: EMPLEADOS
// ============================================================
router.post('/employees', employeeController.createEmployee)
router.get('/employees', employeeController.getEmployees)
router.get('/employees/:id', employeeController.getEmployeeById)
router.put('/employees/:id', employeeController.updateEmployee)
router.delete('/employees/:id', employeeController.deleteEmployee)

// ============================================================
// MÓDULO: ASISTENCIA
// ============================================================
router.post('/attendance', attendanceController.createAttendance)
router.get('/attendance', attendanceController.getAttendanceRecords)
router.get('/attendance/:id', attendanceController.getAttendanceById)
router.get('/attendance/summary/:employee_id', attendanceController.getAttendanceSummary)
router.put('/attendance/:id', attendanceController.updateAttendance)
router.delete('/attendance/:id', attendanceController.deleteAttendance)

// ============================================================
// MÓDULO: SALARIOS
// ============================================================
router.post('/payroll', payrollController.calculatePayroll)
router.get('/payroll', payrollController.getPayroll)
router.get('/payroll/:id', payrollController.getPayrollById)
router.put('/payroll/:id', payrollController.updatePayroll)
router.patch('/payroll/:id/mark-paid', payrollController.markAsPaid)
router.delete('/payroll/:id', payrollController.deletePayroll)

// ============================================================
// MÓDULO: BONIFICACIONES
// ============================================================
router.post('/bonuses', bonusController.createBonus)
router.get('/bonuses', bonusController.getBonuses)
router.get('/bonuses/:id', bonusController.getBonusById)
router.get('/bonuses/employee/:employee_id', bonusController.getBonusesbyEmployee)
router.put('/bonuses/:id', bonusController.updateBonus)
router.delete('/bonuses/:id', bonusController.deleteBonus)

export default router
