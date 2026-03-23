import {  db} from '../config/database'
import { Attendance, AttendanceSummary } from '../models/attendance.model'

export const createAttendance = async (attendanceData: Omit<Attendance, 'id' | 'created_at' | 'updated_at'>) => {
  const { employee_id, date, check_in, check_out, hours_worked, status } = attendanceData
  const query = `
    INSERT INTO attendance (employee_id, date, check_in, check_out, hours_worked, status)
    VALUES (?, ?, ?, ?, ?, ?)
  `
  const [result] = await db.query(query, [
    employee_id,
    date,
    check_in || null,
    check_out || null,
    hours_worked,
    status
  ])
  return result
}

export const getAttendanceRecords = async (filters?: {
  employee_id?: number
  date_from?: Date
  date_to?: Date
  status?: string
}) => {
  let query = `
    SELECT a.*, u.first_name, u.last_name, u.email
    FROM attendance a
    JOIN users u ON a.employee_id = u.id
    WHERE 1=1
  `
  const params: any[] = []

  if (filters?.employee_id) {
    query += ` AND a.employee_id = ?`
    params.push(filters.employee_id)
  }

  if (filters?.date_from) {
    query += ` AND a.date >= ?`
    params.push(filters.date_from)
  }

  if (filters?.date_to) {
    query += ` AND a.date <= ?`
    params.push(filters.date_to)
  }

  if (filters?.status) {
    query += ` AND a.status = ?`
    params.push(filters.status)
  }

  query += ` ORDER BY a.date DESC`

  const [rows] = await db.query(query, params)
  return rows as any[]
}

export const getAttendanceById = async (id: number) => {
  const query = `
    SELECT a.*, u.first_name, u.last_name, u.email
    FROM attendance a
    JOIN users u ON a.employee_id = u.id
    WHERE a.id = ?
  `
  const [rows] = await db.query(query, [id])
  return (rows as any[])[0] || null
}

export const getAttendanceSummary = async (employeeId: number, monthStart: Date, monthEnd: Date) => {
  const query = `
    SELECT 
      SUM(hours_worked) as total_hours,
      COUNT(*) as total_days,
      SUM(CASE WHEN status = 'PRESENT' THEN 1 ELSE 0 END) as present_days,
      SUM(CASE WHEN status = 'ABSENT' THEN 1 ELSE 0 END) as absent_days,
      SUM(CASE WHEN status = 'LATE' THEN 1 ELSE 0 END) as late_days,
      SUM(CASE WHEN status = 'HALF_DAY' THEN 1 ELSE 0 END) as half_days
    FROM attendance
    WHERE employee_id = ? AND date BETWEEN ? AND ?
  `
  const [rows] = await db.query(query, [employeeId, monthStart, monthEnd])
  return (rows as any[])[0] as AttendanceSummary
}

export const updateAttendance = async (id: number, updates: Partial<Attendance>) => {
  const allowedFields = ['check_in', 'check_out', 'hours_worked', 'status']
  const fields: string[] = []
  const values: any[] = []

  for (const [key, value] of Object.entries(updates)) {
    if (allowedFields.includes(key)) {
      fields.push(`${key} = ?`)
      values.push(value)
    }
  }

  if (fields.length === 0) return null

  values.push(id)
  const query = `UPDATE attendance SET ${fields.join(', ')} WHERE id = ?`
  const [result] = await db.query(query, values)
  return result
}

export const deleteAttendance = async (id: number) => {
  const query = `DELETE FROM attendance WHERE id = ?`
  const [result] = await db.query(query, [id])
  return result
}
