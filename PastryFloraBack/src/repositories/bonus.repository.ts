import { db } from '../config/database'

// Bonificación fija anual
const ANNUAL_BONUS = 700

export const getBonuses = async (filters?: {
  employee_id?: number
  year?: number
}) => {
  let query = `
    SELECT 
      u.id as employee_id,
      u.first_name,
      u.last_name,
      u.email,
      u.salary,
      ${ANNUAL_BONUS} as annual_bonus,
      (u.salary + ${ANNUAL_BONUS}) / 12 as monthly_with_bonus,
      YEAR(u.created_at) as year
    FROM users u
    WHERE u.role IN ('SELLER', 'REFILL', 'CONTADOR', 'PANADERO', 'DECORADOR') AND u.active = 1
  `
  const params: any[] = []

  if (filters?.employee_id) {
    query += ` AND u.id = ?`
    params.push(filters.employee_id)
  }

  query += ` ORDER BY u.first_name ASC`

  const [rows] = await db.query(query, params)
  return rows as any[]
}

export const getBonusById = async (id: number) => {
  const query = `
    SELECT 
      u.id as employee_id,
      u.first_name,
      u.last_name,
      u.email,
      u.salary,
      ${ANNUAL_BONUS} as annual_bonus,
      (u.salary + ${ANNUAL_BONUS}) / 12 as monthly_with_bonus
    FROM users u
    WHERE u.id = ? AND u.role IN ('SELLER', 'REFILL', 'CONTADOR', 'PANADERO', 'DECORADOR') AND u.active = 1
  `
  const [rows] = await db.query(query, [id])
  return (rows as any[])[0] || null
}

export const getBonusesByEmployee = async (employeeId: number) => {
  return getBonusById(employeeId)
}

export const createBonus = async (data: any) => {
  // Solo devolver la información del empleado con la bonificación fija
  return getBonusById(data.employee_id)
}

export const updateBonus = async (id: number, updates: any) => {
  // No hay nada que actualizar, la bonificación es fija
  return getBonusById(id)
}

export const deleteBonus = async (id: number) => {
  // No se pueden eliminar bonificaciones fijas
  throw new Error('Cannot delete fixed bonus structure')
}

