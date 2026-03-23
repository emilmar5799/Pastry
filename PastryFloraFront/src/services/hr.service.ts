// src/services/hr.service.ts
import api from '../api/axios'
import type {
  EmployeeWithUser,
  Attendance,
  AttendanceSummary,
  Payroll,
  PayrollDetail,
  BonusDetail,
  CreateEmployeePayload,
  UpdateEmployeePayload,
  CreateAttendancePayload,
  CreatePayrollPayload,
  CreateBonusPayload
} from '../types/HR'

// ============================================================
// EMPLEADOS
// ============================================================

export const getEmployees = async (filters?: {
  department?: string
  active?: boolean
}): Promise<{ data: EmployeeWithUser[]; total: number }> => {
  const params = new URLSearchParams()
  if (filters?.department) params.append('department', filters.department)
  if (filters?.active !== undefined) params.append('active', String(filters.active))

  const { data } = await api.get('/hr/employees', { params })
  return data
}

export const getEmployeeById = async (id: number): Promise<{ data: EmployeeWithUser }> => {
  const { data } = await api.get(`/hr/employees/${id}`)
  return data
}

export const createEmployee = async (payload: CreateEmployeePayload): Promise<{ data: any }> => {
  const { data } = await api.post('/hr/employees', payload)
  return data
}

export const updateEmployee = async (
  id: number,
  payload: UpdateEmployeePayload
): Promise<{ message: string }> => {
  const { data } = await api.put(`/hr/employees/${id}`, payload)
  return data
}

export const deleteEmployee = async (id: number): Promise<{ message: string }> => {
  const { data } = await api.delete(`/hr/employees/${id}`)
  return data
}

// ============================================================
// ASISTENCIA
// ============================================================

export const getAttendanceRecords = async (filters?: {
  employee_id?: number
  date_from?: string
  date_to?: string
  status?: string
}): Promise<{ data: Attendance[]; total: number }> => {
  const params = new URLSearchParams()
  if (filters?.employee_id) params.append('employee_id', String(filters.employee_id))
  if (filters?.date_from) params.append('date_from', filters.date_from)
  if (filters?.date_to) params.append('date_to', filters.date_to)
  if (filters?.status) params.append('status', filters.status)

  const { data } = await api.get('/hr/attendance', { params })
  return data
}

export const getAttendanceById = async (id: number): Promise<{ data: Attendance }> => {
  const { data } = await api.get(`/hr/attendance/${id}`)
  return data
}

export const getAttendanceSummary = async (
  employeeId: number,
  year?: number,
  month?: number
): Promise<{ data: AttendanceSummary }> => {
  const params = new URLSearchParams()
  if (year) params.append('year', String(year))
  if (month) params.append('month', String(month))

  const { data } = await api.get(`/hr/attendance/summary/${employeeId}`, { params })
  return data
}

export const createAttendance = async (
  payload: CreateAttendancePayload
): Promise<{ message: string; data: any }> => {
  const { data } = await api.post('/hr/attendance', payload)
  return data
}

export const updateAttendance = async (
  id: number,
  payload: Partial<CreateAttendancePayload>
): Promise<{ message: string }> => {
  const { data } = await api.put(`/hr/attendance/${id}`, payload)
  return data
}

export const deleteAttendance = async (id: number): Promise<{ message: string }> => {
  const { data } = await api.delete(`/hr/attendance/${id}`)
  return data
}

// ============================================================
// SALARIOS
// ============================================================

export const getPayroll = async (filters?: {
  employee_id?: number
  status?: string
  pay_period_start?: string
  pay_period_end?: string
}): Promise<{ data: PayrollDetail[]; total: number }> => {
  const params = new URLSearchParams()
  if (filters?.employee_id) params.append('employee_id', String(filters.employee_id))
  if (filters?.status) params.append('status', filters.status)
  if (filters?.pay_period_start) params.append('pay_period_start', filters.pay_period_start)
  if (filters?.pay_period_end) params.append('pay_period_end', filters.pay_period_end)

  const { data } = await api.get('/hr/payroll', { params })
  return data
}

export const getPayrollById = async (id: number): Promise<{ data: PayrollDetail }> => {
  const { data } = await api.get(`/hr/payroll/${id}`)
  return data
}

export const calculatePayroll = async (
  payload: CreatePayrollPayload
): Promise<{ message: string; data: any }> => {
  const { data } = await api.post('/hr/payroll', payload)
  return data
}

export const updatePayroll = async (
  id: number,
  payload: Partial<Payroll>
): Promise<{ message: string }> => {
  const { data } = await api.put(`/hr/payroll/${id}`, payload)
  return data
}

export const markPayrollAsPaid = async (id: number): Promise<{ message: string }> => {
  const { data } = await api.patch(`/hr/payroll/${id}/mark-paid`)
  return data
}

export const deletePayroll = async (id: number): Promise<{ message: string }> => {
  const { data } = await api.delete(`/hr/payroll/${id}`)
  return data
}

// ============================================================
// BONIFICACIONES
// ============================================================

export const getBonuses = async (filters?: {
  employee_id?: number
  bonus_type?: string
  date_from?: string
  date_to?: string
}): Promise<{ data: BonusDetail[]; total: number }> => {
  const params = new URLSearchParams()
  if (filters?.employee_id) params.append('employee_id', String(filters.employee_id))
  if (filters?.bonus_type) params.append('bonus_type', filters.bonus_type)
  if (filters?.date_from) params.append('date_from', filters.date_from)
  if (filters?.date_to) params.append('date_to', filters.date_to)

  const { data } = await api.get('/hr/bonuses', { params })
  return data
}

export const getBonusById = async (id: number): Promise<{ data: BonusDetail }> => {
  const { data } = await api.get(`/hr/bonuses/${id}`)
  return data
}

export const getBonusesByEmployee = async (
  employeeId: number
): Promise<{ data: BonusDetail[]; total: number }> => {
  const { data } = await api.get(`/hr/bonuses/employee/${employeeId}`)
  return data
}

export const createBonus = async (payload: CreateBonusPayload): Promise<{ message: string; data: any }> => {
  const { data } = await api.post('/hr/bonuses', payload)
  return data
}

export const updateBonus = async (
  id: number,
  payload: Partial<CreateBonusPayload>
): Promise<{ message: string }> => {
  const { data } = await api.put(`/hr/bonuses/${id}`, payload)
  return data
}

export const deleteBonus = async (id: number): Promise<{ message: string }> => {
  const { data } = await api.delete(`/hr/bonuses/${id}`)
  return data
}
