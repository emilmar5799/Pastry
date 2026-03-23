import { db } from '../config/database'

// Obtener empleados con datos del usuario
export const getEmployees = async (filters?: { role?: string; active?: boolean }) => {
  let query = `
    SELECT 
      u.id,
      u.first_name,
      u.last_name,
      u.email,
      u.role,
      u.salary,
      u.active,
      e.hire_date,
      e.position,
      e.department,
      e.contract_type
    FROM users u
    LEFT JOIN employees e ON u.id = e.user_id
    WHERE u.role IN ('ADMIN', 'SUPERVISOR', 'SELLER', 'REFILL', 'CONTADOR', 'PANADERO', 'DECORADOR')
  `
  const params: any[] = []

  if (filters?.active !== undefined) {
    query += ` AND u.active = ?`
    params.push(filters.active ? 1 : 0)
  }

  if (filters?.role) {
    query += ` AND u.role = ?`
    params.push(filters.role)
  }

  query += ` ORDER BY u.first_name ASC`

  const [rows] = await db.query(query, params)
  return rows
}

export const getEmployeeById = async (id: number) => {
  const query = `
    SELECT 
      u.id,
      u.first_name,
      u.last_name,
      u.email,
      u.role,
      u.salary,
      u.active,
      e.hire_date,
      e.position,
      e.department,
      e.contract_type
    FROM users u
    LEFT JOIN employees e ON u.id = e.user_id
    WHERE u.id = ? AND u.role IN ('ADMIN', 'SUPERVISOR', 'SELLER', 'REFILL', 'CONTADOR', 'PANADERO', 'DECORADOR')
  `
  const [rows] = await db.query(query, [id])
  return (rows as any[])[0] || null
}

export const getEmployeeByEmail = async (email: string) => {
  const query = `
    SELECT 
      u.id,
      u.first_name,
      u.last_name,
      u.email,
      u.role,
      u.salary,
      u.active,
      e.hire_date,
      e.position,
      e.department,
      e.contract_type
    FROM users u
    LEFT JOIN employees e ON u.id = e.user_id
    WHERE u.email = ? AND u.role IN ('ADMIN', 'SUPERVISOR', 'SELLER', 'REFILL', 'CONTADOR', 'PANADERO', 'DECORADOR')
  `
  const [rows] = await db.query(query, [email])
  return (rows as any[])[0] || null
}

// Crear un nuevo usuario como empleado
export const createEmployee = async (data: { 
  first_name: string
  last_name: string
  email: string
  role: string
  salary: number
  hire_date: string
}) => {
  // Crear usuario en tabla users
  const [result]: any = await db.query(
    `INSERT INTO users (first_name, last_name, email, password, role, salary, active)
     VALUES (?, ?, ?, ?, ?, ?, 1)`,
    [
      data.first_name,
      data.last_name,
      data.email,
      'password123', // Password temporal
      data.role,
      data.salary || 0
    ]
  )

  const userId = result.insertId

  // Crear registro en tabla employees
  await db.query(
    `INSERT INTO employees (user_id, hire_date, position, department, contract_type)
     VALUES (?, ?, ?, ?, ?)`,
    [
      userId,
      data.hire_date,
      'Sin especificar',
      'Sin especificar',
      'FULL_TIME'
    ]
  )

  return userId
}

export const updateEmployee = async (id: number, data: any) => {
  const allowedFields = ['first_name', 'last_name', 'email', 'role', 'salary']
  const fields: string[] = []
  const values: any[] = []

  for (const [key, value] of Object.entries(data)) {
    if (allowedFields.includes(key)) {
      fields.push(`${key} = ?`)
      values.push(value)
    }
  }

  if (fields.length === 0) return null

  values.push(id)
  const query = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`
  const [result] = await db.query(query, values)
  return result
}

export const deleteEmployee = async (id: number) => {
  const query = `DELETE FROM employees WHERE user_id = ?`
  const [result] = await db.query(query, [id])
  return result
}
