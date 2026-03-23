import { Request, Response } from 'express'
import * as service from '../services/employee.service'

export const createEmployee = async (req: Request, res: Response) => {
  try {
    const result = await service.createEmployee(req.body)
    res.status(201).json({ message: 'Employee created', data: result })
  } catch (err: any) {
    res.status(400).json({ message: err.message })
  }
}

export const getEmployees = async (req: Request, res: Response) => {
  try {
    const role = req.query.role as string | undefined
    const active = req.query.active ? req.query.active === 'true' : undefined

    const employees = await service.getEmployees({ role, active })
    const employeesArray = Array.isArray(employees) ? employees : []
    res.json({ data: employeesArray, total: employeesArray.length })
  } catch (err: any) {
    res.status(500).json({ message: err.message })
  }
}

export const getEmployeeById = async (req: Request, res: Response) => {
  try {
    const employee = await service.getEmployeeById(Number(req.params.id))
    res.json({ data: employee })
  } catch (err: any) {
    res.status(404).json({ message: err.message })
  }
}

export const updateEmployee = async (req: Request, res: Response) => {
  try {
    await service.updateEmployee(Number(req.params.id), req.body)
    res.json({ message: 'Employee updated successfully' })
  } catch (err: any) {
    res.status(400).json({ message: err.message })
  }
}

export const deleteEmployee = async (req: Request, res: Response) => {
  try {
    await service.deleteEmployee(Number(req.params.id))
    res.json({ message: 'Employee deleted successfully' })
  } catch (err: any) {
    res.status(400).json({ message: err.message })
  }
}
