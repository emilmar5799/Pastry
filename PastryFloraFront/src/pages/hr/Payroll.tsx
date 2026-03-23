// src/pages/hr/Payroll.tsx
import { useState } from 'react'
import { usePayroll } from '../../hooks/usePayroll'
import * as HRService from '../../services/hr.service'
import { ArrowPathIcon, ExclamationTriangleIcon, CheckIcon, TrashIcon } from '@heroicons/react/24/outline'

export default function PayrollPage() {
  const { payroll, loading, error, refresh } = usePayroll()
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const handleMarkAsPaid = (id: number) => {
    if (window.confirm('¿Deseas marcar esta nómina como pagada?')) {
      HRService.markPayrollAsPaid(id)
        .then(() => {
          setSuccessMessage('Nómina marcada como pagada')
          setTimeout(() => setSuccessMessage(null), 3000)
          refresh()
        })
        .catch((err) => {
          const msg = err instanceof Error ? err.message : 'Error al marcar como pagada'
          alert(`Error: ${msg}`)
        })
    }
  }

  const handleDelete = (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar esta nómina?')) {
      HRService.deletePayroll(id)
        .then(() => {
          setSuccessMessage('Nómina eliminada correctamente')
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
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Nóminas</h1>
          <p className="text-gray-600 mt-1">Cálculo y administración de salarios</p>
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
          <p className="text-gray-500 mt-3">Cargando nóminas...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-gray-600 text-sm">Nóminas Pendientes</div>
              <div className="text-2xl font-bold text-orange-600">
                {payroll?.filter((p: any) => p.status === 'PENDING').length || 0}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-gray-600 text-sm">Nóminas Pagadas</div>
              <div className="text-2xl font-bold text-green-600">
                {payroll?.filter((p: any) => p.status === 'PAID').length || 0}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-gray-600 text-sm">Bonos Totales</div>
              <div className="text-2xl font-bold text-blue-600">
                Bs. {payroll?.reduce((sum: number, p: any) => sum + Number(p.bonus || 0), 0).toFixed(2) || '0.00'}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-gray-600 text-sm">Neto Total</div>
              <div className="text-2xl font-bold text-purple-600">
                Bs. {payroll?.reduce((sum: number, p: any) => sum + Number(p.net_salary || 0), 0).toFixed(2) || '0.00'}
              </div>
            </div>
          </div>

          {payroll && payroll.length > 0 ? (
            <div className="overflow-x-auto bg-white rounded-lg shadow">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-6 font-semibold text-gray-700">Empleado</th>
                    <th className="text-left py-3 px-6 font-semibold text-gray-700">Período</th>
                    <th className="text-right py-3 px-6 font-semibold text-gray-700">Salario Base</th>
                    <th className="text-right py-3 px-6 font-semibold text-gray-700">Bonos</th>
                    <th className="text-right py-3 px-6 font-semibold text-gray-700">Neto</th>
                    <th className="text-left py-3 px-6 font-semibold text-gray-700">Estado / Pago</th>
                    <th className="text-center py-3 px-6 font-semibold text-gray-700">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {payroll.map((p: any) => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="py-4 px-6 font-medium">{p.employee_name}</td>
                      <td className="py-4 px-6 text-sm">{new Date(p.pay_period_start).toLocaleDateString()} a {new Date(p.pay_period_end).toLocaleDateString()}</td>
                      <td className="py-4 px-6 text-right">Bs. {Number(p.base_salary || 0).toFixed(2)}</td>
                      <td className="py-4 px-6 text-right font-semibold">Bs. {Number(p.bonus || 0).toFixed(2)}</td>
                      <td className="py-4 px-6 text-right font-semibold text-blue-600">Bs. {Number(p.net_salary || 0).toFixed(2)}</td>
                      <td className="py-4 px-6">
                        <div className="flex flex-col gap-1">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium w-max ${
                            p.status === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {p.status === 'PAID' ? 'Pagada' : 'Pendiente'}
                          </span>
                          {p.status === 'PAID' && p.payment_date && (
                            <div className="text-xs text-gray-500 mt-1">
                              <div>{new Date(p.payment_date).toLocaleString()}</div>
                              <div className="font-medium text-gray-700">Por: {p.paid_by_name}</div>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6 flex justify-center gap-2">
                        {p.status === 'PENDING' && (
                          <button
                            onClick={() => handleMarkAsPaid(p.id)}
                            className="text-green-600 hover:text-green-900 p-2 rounded hover:bg-green-50"
                            title="Marcar pagada"
                          >
                            <CheckIcon className="w-5 h-5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(p.id)}
                          disabled={p.status === 'PAID'}
                          className="text-red-600 hover:text-red-900 p-2 rounded hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Eliminar"
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
              No hay nóminas registradas
            </div>
          )}
        </>
      )}
    </div>
  )
}
