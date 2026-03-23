// src/pages/hr/Attendance.tsx
import { useState, useMemo } from 'react'
import { useAttendance } from '../../hooks/useAttendance'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

export default function AttendancePage() {
  const { records, loading, error, refresh } = useAttendance()
  const [searchFilters, setSearchFilters] = useState({
    name: '',
    dateFrom: '',
    dateTo: '',
    checkInTime: '',
    checkOutTime: ''
  })

  // Filtrar registros según búsqueda
  const filteredRecords = useMemo(() => {
    return records.filter((record: any) => {
      const fullName = `${record.first_name} ${record.last_name}`.toLowerCase()
      const nameMatch = fullName.includes(searchFilters.name.toLowerCase())
      
      const dateMatch = 
        (!searchFilters.dateFrom || record.date >= searchFilters.dateFrom) &&
        (!searchFilters.dateTo || record.date <= searchFilters.dateTo)
      
      const checkInMatch = 
        !searchFilters.checkInTime || 
        (record.check_in && record.check_in.includes(searchFilters.checkInTime))
      
      const checkOutMatch = 
        !searchFilters.checkOutTime || 
        (record.check_out && record.check_out.includes(searchFilters.checkOutTime))
      
      return nameMatch && dateMatch && checkInMatch && checkOutMatch
    })
  }, [records, searchFilters])

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Control de Asistencia</h1>
        <p className="text-gray-600 mt-1">Visual de registros de entrada y salida de empleados</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}

      {/* Filtros de búsqueda */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">Búsqueda y Filtros</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Búsqueda por nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del Empleado
            </label>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nombre..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchFilters.name}
                onChange={e => setSearchFilters({ ...searchFilters, name: e.target.value })}
              />
            </div>
          </div>

          {/* Fecha desde */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Desde
            </label>
            <input
              type="date"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchFilters.dateFrom}
              onChange={e => setSearchFilters({ ...searchFilters, dateFrom: e.target.value })}
            />
          </div>

          {/* Fecha hasta */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hasta
            </label>
            <input
              type="date"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchFilters.dateTo}
              onChange={e => setSearchFilters({ ...searchFilters, dateTo: e.target.value })}
            />
          </div>

          {/* Hora entrada */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hora Entrada
            </label>
            <input
              type="time"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchFilters.checkInTime}
              onChange={e => setSearchFilters({ ...searchFilters, checkInTime: e.target.value })}
            />
          </div>

          {/* Hora salida */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hora Salida
            </label>
            <input
              type="time"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchFilters.checkOutTime}
              onChange={e => setSearchFilters({ ...searchFilters, checkOutTime: e.target.value })}
            />
          </div>
        </div>

        {/* Botón limpiar filtros */}
        <div className="flex justify-end">
          <button
            onClick={() => setSearchFilters({ name: '', dateFrom: '', dateTo: '', checkInTime: '', checkOutTime: '' })}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Limpiar filtros
          </button>
        </div>
      </div>

      {/* Tabla de asistencia */}
      {loading ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-gray-500 mt-3">Cargando registros...</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-semibold text-gray-800">
              Registros encontrados: <span className="text-blue-600">{filteredRecords.length}</span>
            </h3>
            <button
              onClick={refresh}
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Actualizar
            </button>
          </div>

          <div className="overflow-x-auto">
            {filteredRecords.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No hay registros que coincidan con los filtros seleccionados</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-6 font-semibold text-gray-700">Empleado</th>
                    <th className="text-left py-3 px-6 font-semibold text-gray-700">Fecha</th>
                    <th className="text-center py-3 px-6 font-semibold text-gray-700">Entrada</th>
                    <th className="text-center py-3 px-6 font-semibold text-gray-700">Salida</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredRecords.map((record: any) => (
                    <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6 font-medium text-gray-900">
                        {record.first_name} {record.last_name}
                      </td>
                      <td className="py-4 px-6 text-gray-700">
                        {new Date(record.date).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit'
                        })}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="inline-block bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                          {record.check_in ? record.check_in : '—'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="inline-block bg-orange-100 text-orange-800 text-sm font-medium px-3 py-1 rounded-full">
                          {record.check_out ? record.check_out : '—'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
