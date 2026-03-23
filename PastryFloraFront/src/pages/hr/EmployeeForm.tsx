// src/pages/hr/EmployeeForm.tsx
import { useState } from 'react'
import type { EmployeeWithUser } from '../../types/HR'
import * as HRService from '../../services/hr.service'

interface EmployeeFormProps {
  editingEmployee?: EmployeeWithUser | null
  onSuccess: () => void
  onCancel: () => void
}

export default function EmployeeForm({ editingEmployee, onSuccess, onCancel }: EmployeeFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    first_name: editingEmployee?.first_name || '',
    last_name: editingEmployee?.last_name || '',
    email: editingEmployee?.email || '',
    role: editingEmployee?.role || 'SELLER',
    salary: editingEmployee?.salary || '',
    hire_date: editingEmployee?.hire_date || ''
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

      if (editingEmployee) {
        // Actualizar
        await HRService.updateEmployee(editingEmployee.id, {
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          role: formData.role,
          salary: formData.salary ? Number(formData.salary) : 0
        })
      } else {
        // Crear nuevo empleado
        if (!formData.first_name || !formData.last_name || !formData.email) {
          setError('Nombre, apellido y email son requeridos')
          return
        }
        if (!formData.hire_date) {
          setError('Debe ingresar la fecha de contratación')
          return
        }

        await HRService.createEmployee({
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          role: formData.role,
          salary: formData.salary ? Number(formData.salary) : 0,
          hire_date: formData.hire_date
        })
      }

      onSuccess()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al guardar empleado'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">
        {editingEmployee ? 'Editar Empleado' : 'Nuevo Empleado'}
      </h2>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded p-4 mb-4 text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nombre *</label>
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            required
            placeholder="ej: Juan"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Apellido *</label>
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            required
            placeholder="ej: Pérez"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="ej: juan@example.com"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Rol *</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ADMIN">Administrador</option>
            <option value="SUPERVISOR">Supervisor</option>
            <option value="CONTADOR">Contador</option>
            <option value="PANADERO">Panadero</option>
            <option value="DECORADOR">Decorador</option>
            <option value="SELLER">Vendedor</option>
            <option value="REFILL">Rellenador</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Salario</label>
          <input
            type="number"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            step="0.01"
            min="0"
            placeholder="ej: 2500.00"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Contratación *</label>
          <input
            type="date"
            name="hire_date"
            value={formData.hire_date}
            onChange={handleChange}
            required={!editingEmployee}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="md:col-span-2 flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 rounded-lg transition-colors"
          >
            {loading ? 'Guardando...' : editingEmployee ? 'Actualizar' : 'Crear'}
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
