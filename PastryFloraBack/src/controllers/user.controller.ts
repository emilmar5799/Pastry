import { Request, Response } from 'express'
import * as service from '../services/user.service'

// Crear usuario
export const createUser = async (req: Request, res: Response) => {
  try {
    const result = await service.createUser(req.body)
    res.status(201).json(result)
  } catch (err: any) {
    res.status(400).json({ message: err.message })
  }
}

// Listar activos
export const getUsers = async (_req: Request, res: Response) => {
  try {
    const users = await service.getUsers()
    res.json(users)
  } catch {
    res.status(500).json({ message: 'Failed to fetch users' })
  }
}

// Listar inactivos
export const getInactiveUsers = async (_req: Request, res: Response) => {
  try {
    const users = await service.getInactiveUsers()
    res.json(users)
  } catch {
    res.status(500).json({ message: 'Failed to fetch inactive users' })
  }
}

// Detalle
export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await service.getUserById(Number(req.params.id))
    res.json(user)
  } catch (err: any) {
    res.status(404).json({ message: err.message })
  }
}

// Actualizar
export const updateUser = async (req: Request, res: Response) => {
  try {
    await service.updateUser(Number(req.params.id), req.body)
    res.json({ message: 'User updated successfully' })
  } catch (err: any) {
    res.status(400).json({ message: err.message })
  }
}

// Soft delete
export const deleteUser = async (req: Request, res: Response) => {
  try {
    await service.deleteUser(Number(req.params.id))
    res.json({ message: 'User deactivated' })
  } catch (err: any) {
    res.status(400).json({ message: err.message })
  }
}

// Reactivar
export const reactivateUser = async (req: Request, res: Response) => {
  try {
    await service.reactivateUser(Number(req.params.id))
    res.json({ message: 'User reactivated' })
  } catch (err: any) {
    res.status(400).json({ message: err.message })
  }
}
