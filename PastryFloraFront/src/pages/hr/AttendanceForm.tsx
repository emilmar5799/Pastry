// src/pages/hr/AttendanceForm.tsx
import { useState } from 'react'
import type { Attendance } from '../../types/HR'
import { useEmployees } from '../../hooks/useEmployees'
import * as HRService from '../../services/hr.service'

interface AttendanceFormProps {
  editingRecord?: Attendance | null
  onSuccess: () => void
  onCancel: () => void
}

export default function AttendanceForm({ editingRecord, onSuccess, onCancel }: AttendanceFormProps) {
  const { employees } = useEmployees()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    employee_id: editingRecord?.employee_id || '',
    date: editingRecord?.date || new Date().toISOString().split('T')[0],
    check_in: editingRecord?.check_in || '',
    check_out: editingRecord?.check_out || ''
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

      if (editingRecord) {
        await HRService.updateAttendance(editingRecord.id, {
          employee_id: Number(formData.employee_id),
          date: formData.date,
          check_in: formData.check_in || undefined,
          check_out: formData.check_out || undefined
        })
      } else {
        if (!formData.employee_id) {
          setError('Debe seleccionar un empleado')
          return
        }
        await HRService.createAttendance({
          employee_id: Number(formData.employee_id),
          date: formData.date,
          check_in: formData.check_in || undefined,
          check_out: formData.check_out || undefined
        })
      }

      onSuccess()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al guardar asistencia'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">
        {editingRecord ? 'Editar Asistencia' : 'Nuevo Registro de Asistencia'}
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
          <label className="block text-sm font-medium text-gray-700 mb-2">Fecha *</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Hora de Entrada</label>
          <input
            type="time"
            name="check_in"
            value={formData.check_in}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Hora de Salida</label>
          <input
            type="time"
            name="check_out"
            value={formData.check_out}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="md:col-span-2 flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 rounded-lg transition-colors"
          >
            {loading ? 'Guardando...' : editingRecord ? 'Actualizar' : 'Crear'}
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
