// src/pages/hr/Bonuses.tsx
import { useState } from 'react'
import { useBonuses } from '../../hooks/useBonuses'
import * as HRService from '../../services/hr.service'
import { ArrowPathIcon, ExclamationTriangleIcon, TrashIcon } from '@heroicons/react/24/outline'

export default function BonusesPage() {
  const { bonuses, loading, error, refresh } = useBonuses()
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const handleDelete = (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar esta bonificación?')) {
      HRService.deleteBonus(id)
        .then(() => {
          setSuccessMessage('Bonificación eliminada correctamente')
          setTimeout(() => setSuccessMessage(null), 3000)
          refresh()
        })
        .catch((err) => {
          const msg = err instanceof Error ? err.message : 'Error al eliminar'
          alert(`Error: ${msg}`)
        })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Bonificaciones</h1>
          <p className="text-gray-600 mt-1">Bonificación fija anual de 700 Bs</p>
        </div>
        <button
          onClick={refresh}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2 transition-colors"
        >
          <ArrowPathIcon className="w-5 h-5" />
          Actualizar
        </button>
      </div>

      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
          {successMessage}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
          <ExclamationTriangleIcon className="w-6 h-6 text-red-600 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-red-900">Error</h3>
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-gray-500 mt-3">Cargando bonificaciones...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-gray-600 text-sm">Bonificación Anual (Fija)</div>
              <div className="text-2xl font-bold text-green-600">700 Bs</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-gray-600 text-sm">Empleados con Bonificación</div>
              <div className="text-2xl font-bold text-blue-600">{bonuses.length || 0}</div>
            </div>
          </div>

          {bonuses && bonuses.length > 0 ? (
            <div className="overflow-x-auto bg-white rounded-lg shadow">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-6 font-semibold text-gray-700">Empleado</th>
                    <th className="text-right py-3 px-6 font-semibold text-gray-700">Bonificación Anual</th>
                    <th className="text-right py-3 px-6 font-semibold text-gray-700">Bonificación Mensual</th>
                    <th className="text-right py-3 px-6 font-semibold text-gray-700">Ingreso Total Anual</th>
                    <th className="text-center py-3 px-6 font-semibold text-gray-700">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {bonuses.map((bonus: any) => (
                    <tr key={bonus.employee_id} className="hover:bg-gray-50">
                      <td className="py-4 px-6 font-medium">
                        {bonus.first_name} {bonus.last_name}
                      </td>
                      <td className="py-4 px-6 text-right font-semibold text-green-600">
                        {bonus.annual_bonus.toFixed(2)} Bs
                      </td>
                      <td className="py-4 px-6 text-right text-gray-700">
                        {bonus.monthly_bonus.toFixed(2)} Bs
                      </td>
                      <td className="py-4 px-6 text-right font-semibold text-blue-600">
                        {bonus.total_annual_earnings.toFixed(2)} Bs
                      </td>
                      <td className="py-4 px-6 flex justify-center gap-2">
                        <button
                          onClick={() => handleDelete(bonus.employee_id)}
                          className="text-red-600 hover:text-red-900 p-2 rounded hover:bg-red-50"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
              No hay bonificaciones registradas
            </div>
          )}
        </>
      )}
    </div>
  )
}
