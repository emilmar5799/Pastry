import { useEffect, useState } from 'react'
import type { Product } from '../../types/Product'
import { XMarkIcon, CurrencyDollarIcon, TagIcon, DocumentTextIcon, Squares2X2Icon } from '@heroicons/react/24/outline'

interface Props {
  product: Product | null
  onSave: (data: { name: string; description?: string; price: number; category?: string; status: string }) => void
  onCancel: () => void
}

export default function ProductForm({ product, onSave, onCancel }: Props) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [price, setPrice] = useState<string>('')
  const [status, setStatus] = useState('Disponible')
  
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ name?: string; price?: string }>({})

  useEffect(() => {
    if (product) {
      setName(product.name)
      setDescription(product.description || '')
      setCategory(product.category || '')
      setPrice(product.price.toString())
      setStatus(product.status || 'Disponible')
    } else {
      setName('')
      setDescription('')
      setCategory('')
      setPrice('')
      setStatus('Disponible')
    }
    setErrors({})
  }, [product])

  const validateForm = () => {
    const newErrors: { name?: string; price?: string } = {}

    if (!name.trim()) {
      newErrors.name = 'El nombre es requerido'
    } else if (name.trim().length > 100) {
      newErrors.name = 'El nombre no puede exceder 100 caracteres'
    }

    if (!price.trim()) {
      newErrors.price = 'El precio es requerido'
    } else {
      const priceNum = parseFloat(price.replace(',', '.'))
      if (isNaN(priceNum)) {
        newErrors.price = 'Ingresa un número válido'
      } else if (priceNum < 0) {
        newErrors.price = 'El precio no puede ser negativo'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    const priceNum = parseFloat(price.replace(',', '.'))
    setLoading(true)
    try {
      await onSave({ 
        name: name.trim(), 
        description: description.trim() || undefined,
        category: category.trim() || undefined,
        price: priceNum,
        status
      })
    } catch (error) {
      console.error('Error saving product:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value
    value = value.replace(/[^0-9.,]/g, '')
    const normalizedValue = value.replace(',', '.')
    const parts = normalizedValue.split('.')
    if (parts.length > 2) {
      value = parts[0] + '.' + parts.slice(1).join('')
    }
    if (parts.length === 2 && parts[1].length > 2) {
      value = parts[0] + '.' + parts[1].substring(0, 2)
    }
    setPrice(value)
    if (errors.price && value) {
      const priceNum = parseFloat(normalizedValue)
      if (!isNaN(priceNum) && priceNum >= 0) {
        setErrors(prev => ({ ...prev, price: undefined }))
      }
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-fadeIn">
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TagIcon className="w-7 h-7" />
            <h2 className="text-xl font-bold">
              {product ? '✏️ Editar Producto' : '➕ Nuevo Producto'}
            </h2>
          </div>
          <button onClick={onCancel} className="p-1 hover:bg-white/20 rounded-lg transition-colors">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del Producto *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <TagIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 transition ${errors.name ? 'border-red-300' : 'border-gray-300'}`}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Precio (Bs) *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  inputMode="decimal"
                  className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 transition text-right font-mono ${errors.price ? 'border-red-300' : 'border-gray-300'}`}
                  value={price}
                  onChange={handlePriceChange}
                  required
                />
              </div>
              {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Disponible">Disponible</option>
                <option value="Agotado">Agotado</option>
                <option value="Inactivo">Inactivo</option>
              </select>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Squares2X2Icon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Ej: Tortas, Postres..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
              <div className="relative">
                <div className="absolute top-3 left-3 pointer-events-none">
                  <DocumentTextIcon className="h-5 w-5 text-gray-400" />
                </div>
                <textarea
                  rows={4}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-gray-100">
          <button type="button" onClick={onCancel} className="flex-1 py-3.5 border border-gray-300 rounded-xl hover:bg-gray-50">Cancelar</button>
          <button type="submit" disabled={loading} className="flex-1 bg-purple-600 text-white font-medium py-3.5 rounded-xl hover:bg-purple-700">
            {product ? 'Actualizar Producto' : 'Crear Producto'}
          </button>
        </div>
      </form>
    </div>
  )
}