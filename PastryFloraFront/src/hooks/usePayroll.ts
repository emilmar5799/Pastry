// src/hooks/usePayroll.ts
import { useState, useEffect } from 'react'
import type { PayrollDetail } from '../types/HR'
import * as HRService from '../services/hr.service'

export function usePayroll() {
  const [payroll, setPayroll] = useState<PayrollDetail[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPayroll = async (filters?: {
    employee_id?: number
    status?: string
    pay_period_start?: string
    pay_period_end?: string
  }) => {
    try {
      setLoading(true)
      setError(null)
      const response = await HRService.getPayroll(filters)
      setPayroll(response.data)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error fetching payroll'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const refresh = async () => {
    await fetchPayroll()
  }

  useEffect(() => {
    fetchPayroll()
  }, [])

  return { payroll, loading, error, refresh, fetchPayroll }
}
