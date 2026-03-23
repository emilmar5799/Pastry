import * as payrollRepository from '../repositories/payroll.repository'
import * as userRepository from '../repositories/user.repository'
import { Payroll } from '../models/payroll.model'

export const calculatePayroll = async (employeeId: number, payPeriodStart: Date, payPeriodEnd: Date) => {
  if (!employeeId || !payPeriodStart || !payPeriodEnd) {
    throw new Error('Missing required fields: employeeId, payPeriodStart, payPeriodEnd')
  }

  if (payPeriodStart >= payPeriodEnd) {
    throw new Error('payPeriodStart must be before payPeriodEnd')
  }

  const user = await userRepository.findUserById(employeeId)
  if (!user) {
    throw new Error('Employee not found')
  }

  if (!user.salary) {
    throw new Error('Employee has no salary defined')
  }

  const existing = await payrollRepository.getPayrollByEmployeeAndPeriod(
    employeeId,
    payPeriodStart,
    payPeriodEnd
  )

  if (existing) {
    throw new Error('Payroll for this period already exists')
  }

  const isDecember = payPeriodEnd.getMonth() === 11
  const bonus = isDecember ? 700.00 : 0.00
  const deductions = 0
  const netSalary = user.salary + bonus - deductions

  const payroll = await payrollRepository.createPayroll({
    employee_id: employeeId,
    pay_period_start: payPeriodStart,
    pay_period_end: payPeriodEnd,
    base_salary: user.salary,
    bonus,
    deductions,
    net_salary: netSalary,
    status: 'PENDING'
  })

  return payroll
}

export const getPayroll = async (filters?: {
  employee_id?: number
  status?: string
  pay_period_start?: Date
  pay_period_end?: Date
}) => {
  const payroll = await payrollRepository.getPayroll(filters)
  return payroll
}

export const getPayrollById = async (id: number) => {
  const payroll = await payrollRepository.getPayrollById(id)
  if (!payroll) {
    throw new Error('Payroll not found')
  }
  return payroll
}

export const updatePayroll = async (id: number, updates: Partial<Payroll>) => {
  const payroll = await payrollRepository.getPayrollById(id)
  if (!payroll) {
    throw new Error('Payroll not found')
  }

  if (updates.base_salary || updates.pay_period_start || updates.pay_period_end) {
    throw new Error('Cannot modify base_salary or period')
  }

  const result = await payrollRepository.updatePayroll(id, updates)
  return result
}

export const markAsPaid = async (id: number, userId: number) => {
  const payroll = await payrollRepository.getPayrollById(id)
  if (!payroll) {
    throw new Error('Payroll not found')
  }

  const result = await payrollRepository.updatePayroll(id, {
    status: 'PAID',
    paid_date: new Date(),
    paid_by_user_id: userId
  })

  return result
}

export const deletePayroll = async (id: number) => {
  const payroll = await payrollRepository.getPayrollById(id)
  if (!payroll) {
    throw new Error('Payroll not found')
  }

  if (payroll.status === 'PAID') {
    throw new Error('Cannot delete paid payroll')
  }

  const result = await payrollRepository.deletePayroll(id)
  return result
}
