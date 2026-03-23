// src/hooks/useEmployees.ts
import { useState, useEffect } from 'react'
import type { EmployeeWithUser } from '../types/HR'
import * as HRService from '../services/hr.service'

export function useEmployees() {
  const [employees, setEmployees] = useState<EmployeeWithUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEmployees = async (filters?: { department?: string; active?: boolean }) => {
    try {
      setLoading(true)
      setError(null)
      const response = await HRService.getEmployees(filters)
      setEmployees(response.data)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error fetching employees'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const refresh = async () => {
    await fetchEmployees()
  }

  useEffect(() => {
    fetchEmployees()
  }, [])

  return { employees, loading, error, refresh, fetchEmployees }
}
