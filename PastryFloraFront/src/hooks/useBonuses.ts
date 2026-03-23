// src/hooks/useBonuses.ts
import { useState, useEffect } from 'react'
import type { BonusDetail } from '../types/HR'
import * as HRService from '../services/hr.service'

export function useBonuses() {
  const [bonuses, setBonuses] = useState<BonusDetail[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBonuses = async (filters?: {
    employee_id?: number
    bonus_type?: string
    date_from?: string
    date_to?: string
  }) => {
    try {
      setLoading(true)
      setError(null)
      const response = await HRService.getBonuses(filters)
      setBonuses(response.data)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error fetching bonuses'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const refresh = async () => {
    await fetchBonuses()
  }

  useEffect(() => {
    fetchBonuses()
  }, [])

  return { bonuses, loading, error, refresh, fetchBonuses }
}
