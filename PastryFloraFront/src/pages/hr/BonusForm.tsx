// src/pages/hr/BonusForm.tsx
import { useState } from 'react'
import type { BonusDetail } from '../../types/HR'
import { useEmployees } from '../../hooks/useEmployees'
import * as HRService from '../../services/hr.service'

interface BonusFormProps {
  editingBonus?: BonusDetail | null
  onSuccess: () => void
  onCancel: () => void
}

export default function BonusForm({ editingBonus, onSuccess, onCancel }: BonusFormProps) {
  const { employees } = useEmployees()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    employee_id: editingBonus?.employee_id || '',
    bonus_amount: editingBonus?.bonus_amount || '',
    bonus_type: editingBonus?.bonus_type || 'PERFORMANCE',
    reason: editingBonus?.reason || '',
    bonus_date: editingBonus?.bonus_date || new Date().toISOString().split('T')[0]
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      setLoading(true)

      if (!formData.employee_id || !formData.bonus_amount) {
        setError('Empleado y monto son requeridos')
        return
      }

      const bonusAmount = Number(formData.bonus_amount)
      if (bonusAmount <= 0) {
        setError('El monto debe ser mayor a 0')
        return
      }

      if (formData.bonus_type === 'SPECIAL' && !formData.reason) {
        setError('Los bonos especiales requieren un motivo')
        return
      }

      if (editingBonus) {
        await HRService.updateBonus(editingBonus.id, {
          bonus_amount: bonusAmount,
          bonus_type: formData.bonus_type as any,
          reason: formData.reason || undefined,
          bonus_date: formData.bonus_date
        })
      } else {
        await HRService.createBonus({
          employee_id: Number(formData.employee_id),
          bonus_amount: bonusAmount,
          bonus_type: formData.bonus_type as any,
          reason: formData.reason || undefined,
          bonus_date: formData.bonus_date
        })
      }

      onSuccess()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al guardar bonificación'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">
        {editingBonus ? 'Editar Bonificación' : 'Nueva Bonificación'}
      </h2>

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
            disabled={!!editingBonus}
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
          <label className="block text-sm font-medium text-gray-700 mb-2">Monto *</label>
          <input
            type="number"
            name="bonus_amount"
            value={formData.bonus_amount}
            onChange={handleChange}
            required
            step="0.01"
            min="0"
            placeholder="0.00"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Bono *</label>
          <select
            name="bonus_type"
            value={formData.bonus_type}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="PERFORMANCE">Desempeño</option>
            <option value="ANNUAL">Anual</option>
            <option value="SPECIAL">Especial</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Fecha del Bono *</label>
          <input
            type="date"
            name="bonus_date"
            value={formData.bonus_date}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Motivo {formData.bonus_type === 'SPECIAL' && '*'}
          </label>
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            required={formData.bonus_type === 'SPECIAL'}
            placeholder="Descripción del bono..."
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="md:col-span-2 flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 rounded-lg transition-colors"
          >
            {loading ? 'Guardando...' : editingBonus ? 'Actualizar' : 'Crear'}
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
