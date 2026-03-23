import * as employeeRepository from '../repositories/employee.repository'

// Crear un nuevo empleado (registro en tabla users y employees)
export const createEmployee = async (employeeData: {
  first_name: string
  last_name: string
  email: string
  role: string
  salary: number | string
  hire_date: string
}) => {
  // Validaciones
  if (!employeeData.first_name || !employeeData.last_name) {
    throw new Error('Nombre y apellido son requeridos')
  }

  if (!employeeData.email) {
    throw new Error('Email es requerido')
  }

  if (!employeeData.hire_date) {
    throw new Error('Fecha de contratación es requerida')
  }

  // Verificar que el email no exista
  const existingEmployee = await employeeRepository.getEmployeeByEmail(employeeData.email)
  if (existingEmployee) {
    throw new Error('El email ya está registrado')
  }

  const result = await employeeRepository.createEmployee({
    first_name: employeeData.first_name,
    last_name: employeeData.last_name,
    email: employeeData.email,
    role: employeeData.role || 'SELLER',
    salary: employeeData.salary ? Number(employeeData.salary) : 0,
    hire_date: employeeData.hire_date
  })

  return result
}

export const getEmployees = async (filters?: { role?: string; active?: boolean }) => {
  const employees = await employeeRepository.getEmployees(filters)
  return employees
}

export const getEmployeeById = async (id: number) => {
  const employee = await employeeRepository.getEmployeeById(id)
  if (!employee) {
    throw new Error('Employee not found')
  }
  return employee
}

export const updateEmployee = async (id: number, updates: any) => {
  const employee = await employeeRepository.getEmployeeById(id)
  if (!employee) {
    throw new Error('Employee not found')
  }

  const result = await employeeRepository.updateEmployee(id, updates)
  return result
}

export const deleteEmployee = async (id: number) => {
  const employee = await employeeRepository.getEmployeeById(id)
  if (!employee) {
    throw new Error('Employee not found')
  }

  const result = await employeeRepository.deleteEmployee(id)
  return result
}
