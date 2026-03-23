import { useState, useEffect } from 'react'
import { PlusIcon, UserGroupIcon, PhoneIcon, IdentificationIcon, EnvelopeIcon } from '@heroicons/react/24/outline'
import { CustomerService } from '../../services/customer.service'
import type { Customer } from '../../types/customer'
import CustomerForm from './CustomerForm'
import { formatDateTimeForDisplay, utcToBoliviaTime } from '../../utils/dateUtils'

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)

  const loadCustomers = async () => {
    setLoading(true)
    try {
      const data = await CustomerService.getAll()
      setCustomers(data)
    } catch (error) {
      console.error('Error loading customers:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCustomers()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (isFormOpen) {
    return (
      <CustomerForm
        onClose={() => setIsFormOpen(false)}
        onSave={() => {
          setIsFormOpen(false)
          loadCustomers()
        }}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <UserGroupIcon className="w-8 h-8 text-primary" />
            Clientes
          </h1>
          <p className="text-gray-500 mt-1">
            Gestión de clientes y contactos
          </p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="sm:w-auto w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-primaryDark text-white px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 font-medium active:scale-95"
        >
          <PlusIcon className="w-5 h-5" />
          Nuevo Cliente
        </button>
      </div>

      {/* Grid de Clientes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {customers.map((customer) => (
          <div 
            key={customer.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow relative overflow-hidden group"
          >
             {/* Decoración superior */}
             <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-purple-400 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            
             <div className="flex items-start gap-4">
               <div className="w-12 h-12 rounded-xl bg-purple-50 flex flex-shrink-0 items-center justify-center border border-purple-100 text-purple-600 font-bold text-xl">
                 {customer.name.charAt(0).toUpperCase()}
               </div>
               <div className="flex-1 min-w-0">
                 <h3 className="text-lg font-bold text-gray-900 truncate" title={customer.name}>
                   {customer.name}
                 </h3>
                 <div className="text-xs text-gray-400 mt-1">
                   Registrado: {formatDateTimeForDisplay(utcToBoliviaTime(customer.registration_date))}
                 </div>
               </div>
             </div>

             <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                   <IdentificationIcon className="w-4 h-4 text-gray-400" />
                   <span className="font-medium">CI:</span>
                   <span>{customer.ci || 'No registrado'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                   <PhoneIcon className="w-4 h-4 text-gray-400" />
                   <span className="font-medium">Teléfono:</span>
                   <span>{customer.phone || 'No registrado'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                   <EnvelopeIcon className="w-4 h-4 text-gray-400" />
                   <span className="font-medium">Email:</span>
                   <span className="truncate">{customer.email || 'No registrado'}</span>
                </div>
             </div>
          </div>
        ))}

        {customers.length === 0 && (
          <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-dashed border-gray-300">
            <UserGroupIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No hay clientes registrados</p>
            <button
               onClick={() => setIsFormOpen(true)}
               className="mt-4 text-primary hover:text-primaryDark font-medium"
            >
               Registrar el primer cliente
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
