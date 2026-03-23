import * as bonusRepository from '../repositories/bonus.repository'
import * as employeeRepository from '../repositories/employee.repository'

// Bonificación anual fija en Bs
const ANNUAL_BONUS = 700

export const getBonuses = async (filters?: {
  employee_id?: number
  year?: number
}) => {
  const bonuses = await bonusRepository.getBonuses(filters)
  return bonuses.map(emp => ({
    ...emp,
    annual_bonus: ANNUAL_BONUS,
    monthly_bonus: ANNUAL_BONUS / 12
  }))
}

export const getBonusById = async (id: number) => {
  const bonus = await bonusRepository.getBonusById(id)
  if (!bonus) {
    throw new Error('Employee not found')
  }
  return {
    ...bonus,
    annual_bonus: ANNUAL_BONUS,
    monthly_bonus: ANNUAL_BONUS / 12
  }
}

export const getBonusesByEmployee = async (employeeId: number) => {
  const employee = await employeeRepository.getEmployeeById(employeeId)
  if (!employee) {
    throw new Error('Employee not found')
  }

  return {
    employee_id: employee.id,
    first_name: employee.first_name,
    last_name: employee.last_name,
    email: employee.email,
    salary: employee.salary,
    annual_bonus: ANNUAL_BONUS,
    monthly_bonus: ANNUAL_BONUS / 12,
    total_annual_earnings: employee.salary + ANNUAL_BONUS
  }
}

export const createBonus = async (bonusData: any) => {
  // Validar que empleado existe
  const employee = await employeeRepository.getEmployeeById(bonusData.employee_id)
  if (!employee) {
    throw new Error('Employee not found')
  }

  // Retornar información de bonificación fija
  return getBonusById(bonusData.employee_id)
}

export const updateBonus = async (id: number, updates: any) => {
  // No se puede actualizar bonificación fija
  return getBonusById(id)
}

export const deleteBonus = async (id: number) => {
  throw new Error('Cannot delete fixed bonus structure')
}
