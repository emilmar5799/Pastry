// src/pages/hr/EmployeesTable.tsx
import type { EmployeeWithUser } from '../../types/HR'
import {
  PencilIcon,
  TrashIcon,
  EyeIcon,
  UserCircleIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline'

interface EmployeesTableProps {
  employees: EmployeeWithUser[]
  onEdit: (employee: EmployeeWithUser) => void
  onDelete: (id: number, name: string) => void
  onView: (id: number) => void
}

export default function EmployeesTable({
  employees,
  onEdit,
  onDelete,
  onView
}: EmployeesTableProps) {
  // Función para formatear el rol
  const formatRole = (role: string) => {
    const rolesMap: Record<string, string> = {
      'ADMIN': 'Administrador',
      'SUPERVISOR': 'Supervisor',
      'CONTADOR': 'Contador',
      'PANADERO': 'Panadero',
      'DECORADOR': 'Decorador',
      'SELLER': 'Vendedor',
      'REFILL': 'Rellenador'
    }
    return rolesMap[role] || role
  }

  // Función para obtener el color del badge según el rol
  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      'ADMIN': 'bg-purple-100 text-purple-800 border border-purple-200',
      'SUPERVISOR': 'bg-blue-100 text-blue-800 border border-blue-200',
      'CONTADOR': 'bg-indigo-100 text-indigo-800 border border-indigo-200',
      'PANADERO': 'bg-orange-100 text-orange-800 border border-orange-200',
      'DECORADOR': 'bg-pink-100 text-pink-800 border border-pink-200',
      'SELLER': 'bg-green-100 text-green-800 border border-green-200',
      'REFILL': 'bg-amber-100 text-amber-800 border border-amber-200'
    }
    return colors[role] || 'bg-gray-100 text-gray-800 border border-gray-200'
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Empleados</h2>
            <p className="text-sm text-gray-600 mt-1">
              {employees.length} empleado{employees.length !== 1 ? 's' : ''} registrado{employees.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Empleado
              </th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contacto
              </th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cargo
              </th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contrato & Salario
              </th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {employees.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 px-6 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <UserCircleIcon className="w-16 h-16 text-gray-300 mb-4" />
                    <p className="text-gray-400 text-lg font-medium">No hay empleados registrados</p>
                  </div>
                </td>
              </tr>
            ) : (
              employees.map(emp => (
                <tr key={emp.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-600/20 to-blue-600/10 rounded-full flex items-center justify-center mr-3 group-hover:scale-105 transition-transform">
                        <span className="font-bold text-blue-600">
                          {emp.first_name[0]}{emp.last_name[0]}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {emp.first_name} {emp.last_name}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          <span className="font-medium">ID: {emp.id}</span> • 
                          Ingreso: {new Date(emp.hire_date).toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2 text-gray-600">
                      <EnvelopeIcon className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium">{emp.email}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getRoleColor(emp.role)}`}>
                      {formatRole(emp.role)}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm text-gray-700">
                        {emp.contract_type === 'FULL_TIME' ? 'Tiempo Completo' : emp.contract_type === 'PART_TIME' ? 'Medio Tiempo' : 'Contrato'}
                      </span>
                      <span className="font-semibold text-gray-900 text-sm">
                        Bs. {emp.salary ? Number(emp.salary).toFixed(2) : '0.00'}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => onView(emp.id)}
                        className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-xl transition-all hover:shadow-sm active:scale-95"
                        title="Ver detalle"
                      >
                        <EyeIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => onEdit(emp)}
                        className="p-2.5 text-green-600 hover:bg-green-50 rounded-xl transition-all hover:shadow-sm active:scale-95"
                        title="Editar"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => onDelete(emp.id, `${emp.first_name} ${emp.last_name}`)}
                        className="p-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-all hover:shadow-sm active:scale-95"
                        title="Eliminar"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
