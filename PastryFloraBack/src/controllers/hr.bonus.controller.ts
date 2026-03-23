import { Request, Response } from 'express'
import * as service from '../services/bonus.service'

export const createBonus = async (req: Request, res: Response) => {
  try {
    const result = await service.createBonus(req.body)
    res.status(201).json({ message: 'Bonus created', data: result })
  } catch (err: any) {
    res.status(400).json({ message: err.message })
  }
}

export const getBonuses = async (req: Request, res: Response) => {
  try {
    const employee_id = req.query.employee_id ? Number(req.query.employee_id) : undefined
    const year = req.query.year ? Number(req.query.year) : undefined

    const bonuses = await service.getBonuses({
      employee_id,
      year
    })

    const bonusesArray = Array.isArray(bonuses) ? bonuses : (bonuses ? [bonuses] : [])
    res.json({ data: bonusesArray, total: bonusesArray.length })
  } catch (err: any) {
    res.status(500).json({ message: err.message })
  }
}

export const getBonusById = async (req: Request, res: Response) => {
  try {
    const bonus = await service.getBonusById(Number(req.params.id))
    res.json({ data: bonus })
  } catch (err: any) {
    res.status(404).json({ message: err.message })
  }
}

export const getBonusesbyEmployee = async (req: Request, res: Response) => {
  try {
    const bonuses = await service.getBonusesByEmployee(Number(req.params.employee_id))
    const bonusesArray = Array.isArray(bonuses) ? bonuses : (bonuses ? [bonuses] : [])
    res.json({ data: bonusesArray, total: bonusesArray.length })
  } catch (err: any) {
    res.status(500).json({ message: err.message })
  }
}

export const updateBonus = async (req: Request, res: Response) => {
  try {
    await service.updateBonus(Number(req.params.id), req.body)
    res.json({ message: 'Bonus updated successfully' })
  } catch (err: any) {
    res.status(400).json({ message: err.message })
  }
}

export const deleteBonus = async (req: Request, res: Response) => {
  try {
    await service.deleteBonus(Number(req.params.id))
    res.json({ message: 'Bonus deleted successfully' })
  } catch (err: any) {
    res.status(400).json({ message: err.message })
  }
}
