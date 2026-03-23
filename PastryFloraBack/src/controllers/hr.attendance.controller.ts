import { Request, Response } from 'express'
import * as service from '../services/attendance.service'

export const createAttendance = async (req: Request, res: Response) => {
  try {
    const result = await service.createAttendance(req.body)
    res.status(201).json({ message: 'Attendance record created', data: result })
  } catch (err: any) {
    res.status(400).json({ message: err.message })
  }
}

export const getAttendanceRecords = async (req: Request, res: Response) => {
  try {
    const employee_id = req.query.employee_id ? Number(req.query.employee_id) : undefined
    const date_from = req.query.date_from ? new Date(req.query.date_from as string) : undefined
    const date_to = req.query.date_to ? new Date(req.query.date_to as string) : undefined
    const status = req.query.status as string | undefined

    const records = await service.getAttendanceRecords({
      employee_id,
      date_from,
      date_to,
      status
    })

    res.json({ data: records, total: records.length })
  } catch (err: any) {
    res.status(500).json({ message: err.message })
  }
}

export const getAttendanceById = async (req: Request, res: Response) => {
  try {
    const record = await service.getAttendanceById(Number(req.params.id))
    res.json({ data: record })
  } catch (err: any) {
    res.status(404).json({ message: err.message })
  }
}

export const getAttendanceSummary = async (req: Request, res: Response) => {
  try {
    const employeeId = Number(req.params.employee_id)
    const year = Number(req.query.year) || new Date().getFullYear()
    const month = Number(req.query.month) || new Date().getMonth() + 1

    const summary = await service.getMonthlySummary(employeeId, year, month)
    res.json({ data: summary })
  } catch (err: any) {
    res.status(400).json({ message: err.message })
  }
}

export const updateAttendance = async (req: Request, res: Response) => {
  try {
    await service.updateAttendance(Number(req.params.id), req.body)
    res.json({ message: 'Attendance record updated successfully' })
  } catch (err: any) {
    res.status(400).json({ message: err.message })
  }
}

export const deleteAttendance = async (req: Request, res: Response) => {
  try {
    await service.deleteAttendance(Number(req.params.id))
    res.json({ message: 'Attendance record deleted successfully' })
  } catch (err: any) {
    res.status(400).json({ message: err.message })
  }
}
