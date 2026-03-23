// src/pages/hr/Employees.tsx
import { useState } from 'react'
import { useEmployees } from '../../hooks/useEmployees'
import type { EmployeeWithUser } from '../../types/HR'
import * as HRService from '../../services/hr.service'
import EmployeeForm from './EmployeeForm'
import EmployeesTable from './EmployeesTable'
import { UserPlusIcon, ArrowPathIcon, ExclamationTriangleIcon, UsersIcon } from '@heroicons/react/24/outline'

export default function Employees() {
  const { employees, loading, error, refresh } = useEmployees()
  const [editingEmployee, setEditingEmployee] = useState<EmployeeWithUser | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const handleDelete = (id: number, employeeName: string) => {
    if (window.confirm(`¿Estás seguro de eliminar a "${employeeName}"?`)) {
      HRService.deleteEmployee(id)
        .then(() => {
          setSuccessMessage('Empleado eliminado correctamente')
          setTimeout(() => setSuccessMessage(null), 3000)
          refresh()
        })
        .catch((err) => {
          const msg = err instanceof Error ? err.message : 'Error al eliminar empleado'
          alert(`Error: ${msg}`)
        })
    }
  }

  const handleEdit = (employee: EmployeeWithUser) => {
    setEditingEmployee(employee)
    setShowForm(true)
  }

  const handleFormSuccess = () => {
    setSuccessMessage(editingEmployee ? 'Empleado actualizado correctamente' : 'Empleado creado correctamente')
    setTimeout(() => setSuccessMessage(null), 3000)
    setShowForm(false)
    setEditingEmployee(null)
    refresh()
  }

  const handleFormCancel = () => {
    setShowForm(false)
    setEditingEmployee(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600/10 to-blue-600/5 rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center shadow-sm">
              <UsersIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Empleados</h1>
              <p className="text-gray-600 mt-1">Gestión rápida del personal</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setEditingEmployee(null)
                setShowForm(true)
              }}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 px-5 rounded-xl flex items-center gap-2 transition-all shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
            >
              <UserPlusIcon className="w-5 h-5" />
              Nuevo Empleado
            </button>
            <button
              onClick={refresh}
              disabled={loading}
              className="p-3 text-gray-500 hover:text-blue-600 hover:bg-white rounded-xl transition-all shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Actualizar"
            >
              <ArrowPathIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
          {successMessage}
        </div>
      )}

      {/* Errors */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3 items-start">
          <ExclamationTriangleIcon className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-900">Error al cargar empleados</h3>
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <EmployeeForm
          editingEmployee={editingEmployee}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      )}

      {/* Loading */}
      {loading ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-gray-500 mt-3">Cargando empleados...</p>
        </div>
      ) : (
        <EmployeesTable
          employees={employees}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={(id) => {
            console.log('Ver detalle:', id)
          }}
        />
      )}
    </div>
  )
}
