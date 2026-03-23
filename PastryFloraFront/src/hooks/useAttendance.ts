// src/hooks/useAttendance.ts
import { useState, useEffect } from 'react'
import type { Attendance } from '../types/HR'
import * as HRService from '../services/hr.service'

export function useAttendance() {
  const [records, setRecords] = useState<Attendance[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAttendance = async (filters?: {
    employee_id?: number
    date_from?: string
    date_to?: string
    status?: string
  }) => {
    try {
      setLoading(true)
      setError(null)
      const response = await HRService.getAttendanceRecords(filters)
      setRecords(response.data)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error fetching attendance records'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const refresh = async () => {
    await fetchAttendance()
  }

  useEffect(() => {
    fetchAttendance()
  }, [])

  return { records, loading, error, refresh, fetchAttendance }
}
