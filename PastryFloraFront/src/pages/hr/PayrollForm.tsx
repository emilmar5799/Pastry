// src/pages/hr/PayrollForm.tsx
import { useState } from 'react'
import { useEmployees } from '../../hooks/useEmployees'
import * as HRService from '../../services/hr.service'

interface PayrollFormProps {
  onSuccess: () => void
  onCancel: () => void
}

export default function PayrollForm({ onSuccess, onCancel }: PayrollFormProps) {
  const { employees } = useEmployees()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    employee_id: '',
    pay_period_start: '',
    pay_period_end: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      setLoading(true)

      if (!formData.employee_id || !formData.pay_period_start || !formData.pay_period_end) {
        setError('Todos los campos son requeridos')
        return
      }

      if (formData.pay_period_start >= formData.pay_period_end) {
        setError('La fecha de inicio debe ser anterior a la fecha de fin')
        return
      }

      await HRService.calculatePayroll({
        employee_id: Number(formData.employee_id),
        pay_period_start: formData.pay_period_start,
        pay_period_end: formData.pay_period_end
      })

      onSuccess()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al calcular nómina'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Calcular Nueva Nómina</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded p-4 mb-4 text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Empleado *</label>
          <select
            name="employee_id"
            value={formData.employee_id}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Seleccionar empleado...</option>
            {employees.map(emp => (
              <option key={emp.id} value={emp.user_id}>
                {emp.first_name} {emp.last_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Período Inicio *</label>
          <input
            type="date"
            name="pay_period_start"
            value={formData.pay_period_start}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Período Fin *</label>
          <input
            type="date"
            name="pay_period_end"
            value={formData.pay_period_end}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="md:col-span-2 flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 rounded-lg transition-colors"
          >
            {loading ? 'Calculando...' : 'Calcular Nómina'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 rounded-lg transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}
