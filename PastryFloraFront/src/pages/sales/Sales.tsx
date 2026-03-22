import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SaleService from '../../services/sale.service'
import type { Sale } from '../../types/Sale'
import { useModal } from '../../hooks/useModal'
import Modal, { ModalButtons } from '../../components/ui/Modal'
import {
  ShoppingCartIcon,
  PlusCircleIcon,
  EyeIcon,
  TrashIcon,
  ArrowPathIcon,
  ReceiptPercentIcon,
  CalendarDaysIcon,
  UserIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline'

export default function Sales() {
  const [sales, setSales] = useState<Sale[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const {
    modalConfig,
    isModalOpen,
    isLoading,
    showModal,
    hideModal,
    handleConfirm
  } = useModal()

  const loadSales = async () => {
    setLoading(true)
    try {
      const data = await SaleService.getAll()
      setSales(data)
    } catch (err: any) {
      showModal({
        title: 'Error',
        message: `Error al cargar ventas: ${err.message}`,
        type: 'danger',
        confirmText: 'Reintentar',
        showCancel: false,
        onConfirm: loadSales
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSales()
  }, [])

  const handleDeleteSale = (sale: Sale) => {
    showModal({
      title: 'Eliminar Venta',
      message: `¿Estás seguro de eliminar PERMANENTEMENTE la venta #${sale.id} por Bs ${sale.total}?`,
      type: 'danger',
      confirmText: 'Sí, eliminar',
      showCancel: true,
      onConfirm: async () => {
        try {
          await SaleService.cancel(sale.id) // Map delete to cancel service method (which calls DELETE)
          showModal({
            title: 'Venta Eliminada',
            message: `La venta #${sale.id} ha sido eliminada correctamente.`,
            type: 'success',
            confirmText: 'Aceptar',
            showCancel: false,
            onConfirm: loadSales
          })
        } catch (err: any) {
          showModal({
            title: 'Error',
            message: `Error al eliminar venta: ${err.message}`,
            type: 'danger',
            confirmText: 'Reintentar',
            showCancel: true,
            onConfirm: () => handleDeleteSale(sale)
          })
        }
      }
    })
  }

  const totalRevenue = sales.reduce((sum, sale) => sum + Number(sale.total), 0)

  const formatLocalDateTime = (dateString: string): string => {
    try {
      const date = new Date(dateString)
      const day = date.getDate().toString().padStart(2, '0')
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const year = date.getFullYear()
      const hours = date.getHours().toString().padStart(2, '0')
      const minutes = date.getMinutes().toString().padStart(2, '0')
      return `${day}/${month}/${year} ${hours}:${minutes}`
    } catch (error) {
      return dateString
    }
  }

  const getTimeAgo = (dateString: string): string => {
    try {
      const date = new Date(dateString)
      const now = new Date()
      const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
      
      if (diffInSeconds < 60) return 'hace unos segundos'
      if (diffInSeconds < 3600) return `hace ${Math.floor(diffInSeconds / 60)} minutos`
      if (diffInSeconds < 86400) return `hace ${Math.floor(diffInSeconds / 3600)} horas`
      if (diffInSeconds < 2592000) return `hace ${Math.floor(diffInSeconds / 86400)} días`
      
      return `hace ${Math.floor(diffInSeconds / 2592000)} meses`
    } catch (error) {
      return 'fecha desconocida'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando ventas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Modal
        isOpen={isModalOpen}
        onClose={hideModal}
        title={modalConfig?.title || ''}
        type={modalConfig?.type || 'info'}
        maxWidth="md"
      >
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            {modalConfig?.message}
          </p>
          <ModalButtons
            onConfirm={modalConfig?.onConfirm ? handleConfirm : undefined}
            onCancel={modalConfig?.showCancel ? hideModal : undefined}
            confirmText={modalConfig?.confirmText}
            confirmType={modalConfig?.type === 'danger' ? 'danger' : 'primary'}
            loading={isLoading}
            showCancel={modalConfig?.showCancel}
          />
        </div>
      </Modal>

      <div className="bg-gradient-to-r from-purple-500/10 to-purple-600/5 rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <ShoppingCartIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Gestión de Ventas</h1>
              <p className="text-gray-600 mt-1">Administra y revisa el historial de ventas</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={loadSales}
              disabled={loading || isLoading}
              className="p-3 text-gray-600 hover:text-purple-600 hover:bg-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              title="Refrescar lista"
            >
              <ArrowPathIcon className="w-6 h-6" />
            </button>
            <button
              onClick={() => navigate('/sales/new')}
              className="bg-gradient-to-r from-purple-500 to-purple-600 text-white font-medium py-2.5 px-5 rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
            >
              <PlusCircleIcon className="w-5 h-5" />
              Nueva Venta
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="font-bold text-gray-700 mb-4">Resumen General</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Total ventas</p>
                  <p className="text-2xl font-bold text-gray-800">{sales.length}</p>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <ShoppingCartIcon className="w-5 h-5 text-green-600" />
                </div>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Ingreso total</p>
                  <p className="text-2xl font-bold text-gray-800">Bs {totalRevenue.toFixed(2)}</p>
                </div>
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <ReceiptPercentIcon className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </div>
          </div>
          <div className="bg-purple-50 rounded-xl p-5">
            <h4 className="font-medium text-purple-800 mb-2">💡 Tips</h4>
            <ul className="text-sm text-purple-700 space-y-2">
              <li>• Puedes buscar detalles del cliente entrando en "Ver detalles".</li>
              <li>• Las eliminaciones de venta no son reversibles. Ojo con los tickets vinculados.</li>
            </ul>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Historial</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {sales.length} venta{sales.length !== 1 ? 's' : ''} encontrada{sales.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              {sales.length === 0 ? (
                <div className="py-12 px-6 text-center">
                  <ShoppingCartIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg font-medium mb-2">
                    Aún no hay ventas registradas
                  </p>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metadatos</th>
                      <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente/Empleado</th>
                      <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total & Pago</th>
                      <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {sales.map(sale => (
                      <tr key={sale.id} className="hover:bg-gray-50 transition-colors group">
                        <td className="py-4 px-6">
                          <div>
                            <p className="font-bold text-gray-900">Venta #{sale.id}</p>
                            <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                              <CalendarDaysIcon className="w-3 h-3" />
                              <span>{formatLocalDateTime(sale.sale_date)} ({getTimeAgo(sale.sale_date)})</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                           <div className="flex flex-col gap-1">
                              <span className="flex items-center text-sm font-medium text-gray-900 gap-1"><UserIcon className="w-4 h-4 text-purple-500" /> {sale.customer_name || 'Al Paso'}</span>
                              <span className="text-xs text-gray-500">Atendido por: {sale.employee_name || `Emp #${sale.employee_id}`}</span>
                           </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex flex-col gap-1">
                            <span className="font-bold text-green-600 text-lg flex items-center gap-1">Bs {sale.total}</span>
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold bg-blue-100 text-blue-800 w-max border border-blue-200">
                                <BanknotesIcon className="w-3 h-3" /> {sale.payment_method || 'Efectivo'}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex gap-1.5">
                            <button onClick={() => navigate(`/sales/${sale.id}`)} className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-xl transition-all hover:shadow-sm active:scale-95" title="Ver detalles">
                              <EyeIcon className="w-5 h-5" />
                            </button>
                            <button onClick={() => handleDeleteSale(sale)} className="p-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-all hover:shadow-sm active:scale-95" title="Eliminar venta">
                              <TrashIcon className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}