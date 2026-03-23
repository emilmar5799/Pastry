import { db } from '../config/database'
import { Payroll, PayrollDetail } from '../models/payroll.model'

export const createPayroll = async (payrollData: Omit<Payroll, 'id' | 'created_at' | 'updated_at'>) => {
  const {
    employee_id,
    pay_period_start,
    pay_period_end,
    base_salary,
    bonus,
    deductions,
    net_salary,
    status
  } = payrollData

  const query = `
    INSERT INTO payroll 
    (employee_id, pay_period_start, pay_period_end, base_salary, bonus, deductions, net_salary, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `

  const [result] = await db.query(query, [
    employee_id,
    pay_period_start,
    pay_period_end,
    base_salary,
    bonus,
    deductions,
    net_salary,
    status
  ])

  return result
}

export const getPayroll = async (filters?: {
  employee_id?: number
  status?: string
  pay_period_start?: Date
  pay_period_end?: Date
}) => {
  let query = `
    SELECT p.*, u.first_name, u.last_name, u.email,
           IFNULL(CONCAT(pu.first_name, ' ', pu.last_name), '-') as paid_by_name,
           CONCAT(u.first_name, ' ', u.last_name) as employee_name
    FROM payroll p
    JOIN users u ON p.employee_id = u.id
    LEFT JOIN users pu ON p.paid_by_user_id = pu.id
    WHERE 1=1
  `
  const params: any[] = []

  if (filters?.employee_id) {
    query += ` AND p.employee_id = ?`
    params.push(filters.employee_id)
  }

  if (filters?.status) {
    query += ` AND p.status = ?`
    params.push(filters.status)
  }

  if (filters?.pay_period_start) {
    query += ` AND p.pay_period_start >= ?`
    params.push(filters.pay_period_start)
  }

  if (filters?.pay_period_end) {
    query += ` AND p.pay_period_end <= ?`
    params.push(filters.pay_period_end)
  }

  query += ` ORDER BY p.pay_period_start DESC`

  const [rows] = await db.query(query, params)
  return rows as PayrollDetail[]
}

export const getPayrollById = async (id: number) => {
  const query = `
    SELECT p.*, u.first_name, u.last_name, u.email,
           IFNULL(CONCAT(pu.first_name, ' ', pu.last_name), '-') as paid_by_name,
           CONCAT(u.first_name, ' ', u.last_name) as employee_name
    FROM payroll p
    JOIN users u ON p.employee_id = u.id
    LEFT JOIN users pu ON p.paid_by_user_id = pu.id
    WHERE p.id = ?
  `
  const [rows] = await db.query(query, [id])
  return (rows as PayrollDetail[])[0] || null
}

export const getPayrollByEmployeeAndPeriod = async (employeeId: number, periodStart: Date, periodEnd: Date) => {
  const query = `
    SELECT * FROM payroll
    WHERE employee_id = ? AND pay_period_start = ? AND pay_period_end = ?
  `
  const [rows] = await db.query(query, [employeeId, periodStart, periodEnd])
  return (rows as Payroll[])[0] || null
}

export const updatePayroll = async (id: number, updates: Partial<Payroll>) => {
  const allowedFields = ['bonus', 'deductions', 'net_salary', 'paid_date', 'status', 'paid_by_user_id']
  const fields: string[] = []
  const values: any[] = []

  for (const [key, value] of Object.entries(updates)) {
    if (allowedFields.includes(key)) {
      fields.push(`${key} = ?`)
      values.push(value)
    }
  }

  if (fields.length === 0) return null

  values.push(id)
  const query = `UPDATE payroll SET ${fields.join(', ')} WHERE id = ?`
  const [result] = await db.query(query, values)
  return result
}

export const deletePayroll = async (id: number) => {
  const query = `DELETE FROM payroll WHERE id = ?`
  const [result] = await db.query(query, [id])
  return result
}
