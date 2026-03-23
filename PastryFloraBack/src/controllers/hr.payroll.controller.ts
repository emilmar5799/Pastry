import { Request, Response } from 'express'
import * as service from '../services/payroll.service'

export const calculatePayroll = async (req: Request, res: Response) => {
  try {
    const { employee_id, pay_period_start, pay_period_end } = req.body

    const result = await service.calculatePayroll(
      employee_id,
      new Date(pay_period_start),
      new Date(pay_period_end)
    )

    res.status(201).json({ message: 'Payroll calculated', data: result })
  } catch (err: any) {
    res.status(400).json({ message: err.message })
  }
}

export const getPayroll = async (req: Request, res: Response) => {
  try {
    const employee_id = req.query.employee_id ? Number(req.query.employee_id) : undefined
    const status = req.query.status as string | undefined
    const pay_period_start = req.query.pay_period_start
      ? new Date(req.query.pay_period_start as string)
      : undefined
    const pay_period_end = req.query.pay_period_end
      ? new Date(req.query.pay_period_end as string)
      : undefined

    const payroll = await service.getPayroll({
      employee_id,
      status,
      pay_period_start,
      pay_period_end
    })

    res.json({ data: payroll, total: payroll.length })
  } catch (err: any) {
    res.status(500).json({ message: err.message })
  }
}

export const getPayrollById = async (req: Request, res: Response) => {
  try {
    const payroll = await service.getPayrollById(Number(req.params.id))
    res.json({ data: payroll })
  } catch (err: any) {
    res.status(404).json({ message: err.message })
  }
}

export const updatePayroll = async (req: Request, res: Response) => {
  try {
    await service.updatePayroll(Number(req.params.id), req.body)
    res.json({ message: 'Payroll updated successfully' })
  } catch (err: any) {
    res.status(400).json({ message: err.message })
  }
}

export const markAsPaid = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      throw new Error('Usuario no autenticado');
    }
    await service.markAsPaid(Number(req.params.id), userId)
    res.json({ message: 'Payroll marked as paid' })
  } catch (err: any) {
    res.status(400).json({ message: err.message })
  }
}

export const deletePayroll = async (req: Request, res: Response) => {
  try {
    await service.deletePayroll(Number(req.params.id))
    res.json({ message: 'Payroll deleted successfully' })
  } catch (err: any) {
    res.status(400).json({ message: err.message })
  }
}
