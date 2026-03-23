import * as attendanceRepository from '../repositories/attendance.repository'
import * as employeeRepository from '../repositories/employee.repository'
import { Attendance } from '../models/attendance.model'

// Calcular horas trabajadas y estado
const calculateHoursAndStatus = (checkIn: string, checkOut: string, date: Date) => {
  if (!checkIn) return { hours_worked: 0, status: 'ABSENT' }
  if (!checkOut) return { hours_worked: 0, status: 'PRESENT' }

  const [inHour, inMin] = checkIn.split(':').map(Number)
  const [outHour, outMin] = checkOut.split(':').map(Number)

  const checkInTime = inHour + inMin / 60
  const checkOutTime = outHour + outMin / 60
  const hoursWorked = Math.max(0, checkOutTime - checkInTime)

  let status = 'PRESENT'
  if (checkInTime > 9) status = 'LATE'
  if (hoursWorked < 4) status = 'HALF_DAY'

  return { hours_worked: hoursWorked, status }
}

export const createAttendance = async (attendanceData: any) => {
  // Validaciones
  if (!attendanceData.employee_id || !attendanceData.date) {
    throw new Error('Missing required fields: employee_id, date')
  }

  const employee = await employeeRepository.getEmployeeById(attendanceData.employee_id)
  if (!employee) {
    throw new Error('Employee not found')
  }

  if (new Date(attendanceData.date) > new Date()) {
    throw new Error('date cannot be in the future')
  }

  const { hours_worked, status } = calculateHoursAndStatus(
    attendanceData.check_in || '',
    attendanceData.check_out || '',
    attendanceData.date
  )

  const result = await attendanceRepository.createAttendance({
    employee_id: attendanceData.employee_id,
    date: attendanceData.date,
    check_in: attendanceData.check_in || null,
    check_out: attendanceData.check_out || null,
    hours_worked,
    status: attendanceData.status || status
  })

  return result
}

export const getAttendanceRecords = async (filters?: {
  employee_id?: number
  date_from?: Date
  date_to?: Date
  status?: string
}) => {
  const records = await attendanceRepository.getAttendanceRecords(filters)
  return records
}

export const getAttendanceById = async (id: number) => {
  const record = await attendanceRepository.getAttendanceById(id)
  if (!record) {
    throw new Error('Attendance record not found')
  }
  return record
}

export const getMonthlySummary = async (employeeId: number, year: number, month: number) => {
  const monthStart = new Date(year, month - 1, 1)
  const monthEnd = new Date(year, month, 0)

  const summary = await attendanceRepository.getAttendanceSummary(employeeId, monthStart, monthEnd)
  return summary
}

export const updateAttendance = async (id: number, updates: Partial<Attendance>) => {
  const record = await attendanceRepository.getAttendanceById(id)
  if (!record) {
    throw new Error('Attendance record not found')
  }

  // Si se actualizan check_in o check_out, recalcular horas
  if (updates.check_in || updates.check_out) {
    const { hours_worked, status } = calculateHoursAndStatus(
      updates.check_in || record.check_in || '',
      updates.check_out || record.check_out || '',
      record.date
    )
    updates.hours_worked = hours_worked
    if (!updates.status) updates.status = status as any
  }

  const result = await attendanceRepository.updateAttendance(id, updates)
  return result
}

export const deleteAttendance = async (id: number) => {
  const record = await attendanceRepository.getAttendanceById(id)
  if (!record) {
    throw new Error('Attendance record not found')
  }

  const result = await attendanceRepository.deleteAttendance(id)
  return result
}
