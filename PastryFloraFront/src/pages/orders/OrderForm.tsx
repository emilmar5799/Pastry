import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { OrderService, type CreateOrderData, type UpdateOrderData } from '../../services/order.service';
import { CustomerService } from '../../services/customer.service';
import ProductService from '../../services/product.service';
import type { Customer } from '../../types/customer';
import type { Product } from '../../types/Product';
import {
  ArrowLeftIcon,
  CalendarDaysIcon,
  UserIcon,
  PhoneIcon,
  TagIcon,
  DocumentTextIcon,
  CakeIcon,
  UsersIcon,
  GiftIcon,
  SparklesIcon,
  UserPlusIcon,
  ShoppingCartIcon,
  PlusCircleIcon,
  TrashIcon,
  MinusCircleIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';

interface OrderItem {
  product_id: number;
  name: string;
  quantity: number;
  unit_price: number;
}

interface OrderFormState {
  type: 'SMALL' | 'LARGE';
  delivery_date: string;
  
  customer_id: number | '';
  isNewCustomer: boolean;
  new_customer_name: string;
  new_customer_ci: string;
  new_customer_phone: string;

  color?: string;
  price?: number;
  pieces?: number;
  specifications?: string;
  advance: number;
  event_type?: string;
  warranty?: string;
}

const defaultFormState: OrderFormState = {
  type: 'SMALL',
  delivery_date: '',
  customer_id: '',
  isNewCustomer: false,
  new_customer_name: '',
  new_customer_ci: '',
  new_customer_phone: '',
  color: '',
  price: undefined,
  pieces: 1,
  specifications: '',
  advance: 0,
  event_type: '',
  warranty: ''
};

export default function OrderForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [items, setItems] = useState<OrderItem[]>([]);
  
  const [showProductList, setShowProductList] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const searchRef = useRef<HTMLDivElement>(null);

  const [formState, setFormState] = useState<OrderFormState>(defaultFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadInitialData();
    if (!id) {
      // Set default delivery datetime to tomorrow at 10:00 AM
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(10, 0, 0, 0);
      
      setFormState(prev => ({
        ...prev,
        delivery_date: tomorrow.toISOString().slice(0, 16)
      }));
    }
  }, [id]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowProductList(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [custData, prodData] = await Promise.all([
         CustomerService.getAll(),
         ProductService.getAll()
      ]);
      setCustomers(custData);
      
      const activeProducts = prodData.filter(p => p.status !== 'Inactivo');
      setProducts(activeProducts);
      setFilteredProducts(activeProducts);

      if (id) {
        const order = await OrderService.getById(Number(id));
        setFormState({
          type: order.type,
          delivery_date: new Date(order.delivery_date).toISOString().slice(0, 16),
          customer_id: order.customer_id,
          isNewCustomer: false,
          new_customer_name: '',
          new_customer_ci: '',
          new_customer_phone: '',
          color: order.color || '',
          price: order.price || undefined,
          pieces: order.pieces || 1,
          specifications: order.specifications || '',
          advance: order.advance,
          event_type: order.event_type || '',
          warranty: order.warranty || ''
        });

        // Set items
        if (order.products) {
           setItems(order.products.map(p => ({
              product_id: p.product_id,
              name: p.name || 'Desconocido',
              quantity: p.quantity,
              unit_price: p.price || 0
           })));
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductSearch = (value: string) => {
    setSearchTerm(value);
    const filtered = products.filter(p => 
      p.name.toLowerCase().includes(value.toLowerCase()) ||
      p.category?.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredProducts(filtered);
    setShowProductList(true);
  };

  const addProduct = (product: Product) => {
    setItems(current => {
      const existing = current.find(item => item.product_id === product.id);
      if (existing) {
        return current.map(item =>
          item.product_id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...current, {
        product_id: product.id,
        name: product.name,
        quantity: 1,
        unit_price: product.price
      }];
    });
    setSearchTerm('');
    setShowProductList(false);
  };

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      setItems(items.filter(item => item.product_id !== productId));
      return;
    }
    setItems(items.map(item =>
      item.product_id === productId
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formState.delivery_date) {
      newErrors.delivery_date = 'La fecha de entrega es requerida';
    }
    
    if (formState.isNewCustomer) {
      if (!formState.new_customer_name.trim()) newErrors.new_customer_name = 'Requerido';
    } else {
      if (!formState.customer_id) newErrors.customer_id = 'Seleccione un cliente';
    }

    if (formState.advance < 0) {
      newErrors.advance = 'El anticipo no puede ser negativo';
    }

    if (formState.type === 'LARGE') {
      if (!formState.event_type?.trim()) {
        newErrors.event_type = 'Requerido para pedidos grandes';
      }
      if (formState.price !== undefined && formState.price < 0) {
        newErrors.price = 'No puede ser negativo';
      }
      if (formState.pieces !== undefined && formState.pieces < 1) {
        newErrors.pieces = 'Al menos 1';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    try {
      let finalCustomerId = formState.customer_id as number;

      if (formState.isNewCustomer) {
        const newCustomer = await CustomerService.create({
          name: formState.new_customer_name.trim(),
          ci: formState.new_customer_ci.trim() || undefined,
          phone: formState.new_customer_phone.trim() || undefined
        });
        finalCustomerId = newCustomer.id;
      }

      const productsPayload = items.map(i => ({ product_id: i.product_id, quantity: i.quantity }));

      if (id) {
        const updateData: UpdateOrderData = {
          type: formState.type,
          delivery_date: formState.delivery_date,
          customer_id: finalCustomerId,
          color: formState.color?.trim() || undefined,
          price: formState.price || undefined,
          specifications: formState.specifications?.trim() || undefined,
          advance: formState.advance,
          products: productsPayload
        };

        if (formState.type === 'LARGE') {
          updateData.pieces = formState.pieces || undefined;
          updateData.event_type = formState.event_type?.trim() || undefined;
          updateData.warranty = formState.warranty?.trim() || undefined;
        }

        await OrderService.update(Number(id), updateData);
        alert('✅ Pedido actualizado correctamente');
      } else {
        const createData: CreateOrderData = {
          type: formState.type,
          delivery_date: formState.delivery_date,
          customer_id: finalCustomerId,
          advance: formState.advance,
          products: productsPayload
        };

        if (formState.color?.trim()) createData.color = formState.color.trim();
        if (formState.price !== undefined) createData.price = formState.price;
        if (formState.specifications?.trim()) createData.specifications = formState.specifications.trim();

        if (formState.type === 'LARGE') {
          if (formState.pieces) createData.pieces = formState.pieces;
          if (formState.event_type?.trim()) createData.event_type = formState.event_type.trim();
          if (formState.warranty?.trim()) createData.warranty = formState.warranty.trim();
        }

        await OrderService.create(createData);
        alert('✅ Pedido creado correctamente');
      }
      
      navigate('/orders');
    } catch (error: unknown) {
      console.error('Error saving order:', error);
      let errorMessage = 'Error al guardar';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        errorMessage = axiosError.response?.data?.message || errorMessage;
      }
      alert(`❌ Error: ${errorMessage}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = <K extends keyof OrderFormState>(field: K, value: OrderFormState[K]) => {
    setFormState(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const formatPrice = (price?: number): string => {
    if (price === undefined || price === null) return '0.00';
    const rounded = Math.round(price * 100) / 100;
    const integerPart = Math.floor(rounded);
    const decimalPart = Math.round((rounded - integerPart) * 100);
    if (decimalPart === 0) return `${integerPart}.00`;
    if (decimalPart < 10) return `${integerPart}.0${decimalPart}`;
    return `${integerPart}.${decimalPart}`;
  };

  const calculateRemaining = () => {
    if (!formState.price) return 0;
    return formState.price - formState.advance;
  };

  const eventTypesOptions = [
    { value: 'MATRIMONIO', label: '💍 Matrimonio' },
    { value: 'BAUTIZO', label: '👶 Bautizo' },
    { value: 'QUINCE_AÑOS', label: '🎂 15 Años' },
    { value: 'CUMPLEAÑOS', label: '🎉 Cumpleaños' },
    { value: 'ANIVERSARIO', label: '📅 Aniversario' },
    { value: 'GRADUACION', label: '🎓 Graduación' },
    { value: 'OTRO', label: '✨ Otro evento' }
  ];

  if (loading && id) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-500/10 to-purple-600/5 rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <CakeIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {id ? '✏️ Editar Pedido' : '➕ Nuevo Pedido'}
              </h1>
              <p className="text-gray-600 mt-1">
                {id ? 'Modifica los detalles del pedido' : 'Crea un nuevo pedido cruzando productos'}
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/orders')}
            className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Volver
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Información Principal</h2>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Tipo de Pedido *
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => handleChange('type', 'SMALL')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      formState.type === 'SMALL'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <TagIcon className={`w-5 h-5 ${formState.type === 'SMALL' ? 'text-blue-600' : 'text-gray-400'}`} />
                      <div className="text-left">
                        <p className="font-semibold text-gray-800">Pequeño</p>
                        <p className="text-sm text-gray-500">Tortas estándar</p>
                      </div>
                    </div>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => handleChange('type', 'LARGE')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      formState.type === 'LARGE'
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-300 hover:border-purple-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <CakeIcon className={`w-5 h-5 ${formState.type === 'LARGE' ? 'text-purple-600' : 'text-gray-400'}`} />
                      <div className="text-left">
                        <p className="font-semibold text-gray-800">Grande (Evento)</p>
                        <p className="text-sm text-gray-500">Bodas, xv años</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-700 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                       <UserIcon className="w-5 h-5 text-gray-500" />
                       Cliente
                    </span>
                    <button
                      type="button"
                      onClick={() => handleChange('isNewCustomer', !formState.isNewCustomer)}
                      className="text-sm text-purple-600 hover:text-purple-800 flex items-center gap-1"
                    >
                      <UserPlusIcon className="w-4 h-4" />
                      {formState.isNewCustomer ? 'Seleccionar existente' : 'Crear nuevo'}
                    </button>
                  </h3>
                  
                  {formState.isNewCustomer ? (
                    <div className="p-4 bg-purple-50 rounded-xl border border-purple-100 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo *</label>
                        <input
                          type="text"
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-purple-500 ${errors.new_customer_name ? 'border-red-300' : 'border-gray-300'}`}
                          value={formState.new_customer_name}
                          onChange={(e) => handleChange('new_customer_name', e.target.value)}
                        />
                        {errors.new_customer_name && <p className="text-red-500 text-xs mt-1">{errors.new_customer_name}</p>}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                         <div>
                           <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                           <input
                             type="text"
                             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500"
                             value={formState.new_customer_phone}
                             onChange={(e) => handleChange('new_customer_phone', e.target.value)}
                           />
                         </div>
                         <div>
                           <label className="block text-sm font-medium text-gray-700 mb-1">C.I.</label>
                           <input
                             type="text"
                             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500"
                             value={formState.new_customer_ci}
                             onChange={(e) => handleChange('new_customer_ci', e.target.value)}
                           />
                         </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <select
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 ${errors.customer_id ? 'border-red-300' : 'border-gray-300'}`}
                        value={formState.customer_id}
                        onChange={(e) => handleChange('customer_id', Number(e.target.value))}
                      >
                        <option value="">-- Seleccionar Cliente --</option>
                        {customers.map(c => (
                          <option key={c.id} value={c.id}>{c.name} {c.ci ? `(${c.ci})` : ''} {c.phone ? `- ${c.phone}` : ''}</option>
                        ))}
                      </select>
                      {errors.customer_id && <p className="text-red-500 text-sm mt-1">{errors.customer_id}</p>}
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                    <CalendarDaysIcon className="w-5 h-5 text-gray-500" />
                    Entrega
                  </h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fecha y Hora *
                    </label>
                    <input
                      type="datetime-local"
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 ${errors.delivery_date ? 'border-red-300' : 'border-gray-300'}`}
                      value={formState.delivery_date}
                      onChange={(e) => handleChange('delivery_date', e.target.value)}
                    />
                    {errors.delivery_date && <p className="text-red-500 text-sm mt-1">{errors.delivery_date}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Color dominante (Opcional)
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Ej: Azul pastel, Blanco"
                      value={formState.color}
                      onChange={(e) => handleChange('color', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Product Binder (Only for SMALL orders in this form) */}
              {formState.type === 'SMALL' && (
                <div className="mt-8 border-t border-gray-100 pt-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <ShoppingCartIcon className="w-6 h-6 text-purple-600" />
                  Productos del Pedido
                </h3>
                
                {/* Buscador de productos */}
                <div className="mb-6" ref={searchRef}>
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                      placeholder="Buscar producto por nombre o categoría..."
                      value={searchTerm}
                      onChange={(e) => handleProductSearch(e.target.value)}
                      onFocus={() => {
                        if (searchTerm) setShowProductList(true);
                        else {
                          setFilteredProducts(products);
                          setShowProductList(true);
                        }
                      }}
                    />
                    {showProductList && (
                      <div className="absolute z-10 w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 max-h-60 overflow-y-auto">
                        {filteredProducts.length > 0 ? (
                          filteredProducts.map(product => (
                            <button
                              key={product.id}
                              type="button"
                              onClick={() => addProduct(product)}
                              className="w-full text-left px-4 py-3 hover:bg-purple-50 border-b border-gray-50 last:border-0 flex justify-between items-center group transition-colors"
                            >
                              <div>
                                <p className="font-semibold text-gray-800">{product.name}</p>
                                <p className="text-sm text-gray-500">{product.category || 'Sin categoría'}</p>
                              </div>
                              <PlusCircleIcon className="w-6 h-6 text-purple-400 group-hover:text-purple-600 transition-colors" />
                            </button>
                          ))
                        ) : (
                          <div className="p-4 text-center text-gray-500">No se encontraron productos</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Lista de productos seleccionados */}
                <div className="space-y-3">
                  {items.map(item => (
                    <div key={item.product_id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">{item.name}</p>
                        <p className="text-sm text-gray-500">Precio Ref: Bs {formatPrice(item.unit_price)}</p>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="flex items-center bg-white border border-gray-300 rounded-lg overflow-hidden">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                            className="p-2 hover:bg-gray-100 text-gray-600 transition-colors"
                          >
                            <MinusCircleIcon className="w-5 h-5" />
                          </button>
                          <span className="w-12 text-center font-bold text-gray-800">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                            className="p-2 hover:bg-gray-100 text-gray-600 transition-colors"
                          >
                            <PlusCircleIcon className="w-5 h-5" />
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product_id, 0)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {items.length === 0 && (
                    <div className="text-center p-6 bg-gray-50 border border-dashed border-gray-300 rounded-xl">
                      <p className="text-gray-500">Aún no hay productos seleccionados para este pedido.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {formState.type === 'LARGE' && (
                <div className="mt-8 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                  <h3 className="font-semibold text-purple-800 mb-4">Información Adicional de Evento (Pedido Grande)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Evento *</label>
                      <select
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 ${errors.event_type ? 'border-red-300' : 'border-gray-300'}`}
                        value={formState.event_type}
                        onChange={(e) => handleChange('event_type', e.target.value)}
                      >
                        <option value="">Seleccione un evento</option>
                        {eventTypesOptions.map((opt) => (
                           <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Piezas Totales *</label>
                      <input
                        type="number" min="1"
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 ${errors.pieces ? 'border-red-300' : 'border-gray-300'}`}
                        value={formState.pieces}
                        onChange={(e) => handleChange('pieces', Number(e.target.value))}
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                       <label className="block text-sm font-medium text-gray-700 mb-2">Garantías (Opcional)</label>
                       <input
                         type="text"
                         className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                         placeholder="Equipos, depósitos, decoraciones en prenda"
                         value={formState.warranty}
                         onChange={(e) => handleChange('warranty', e.target.value)}
                       />
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Especificaciones / Detalles del moldeado
                </label>
                <textarea
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows={4}
                  placeholder="Instrucciones especiales, dedicatorias, sabor del relleno..."
                  value={formState.specifications}
                  onChange={(e) => handleChange('specifications', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Costos y Pagos</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                     <ClipboardDocumentListIcon className="w-4 h-4" /> Precio Total Negociado
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 font-medium">Bs</span>
                    </div>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 font-bold ${
                        errors.price ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="0.00"
                      value={formState.price === undefined ? '' : formState.price}
                      onChange={(e) => handleChange('price', e.target.value ? Number(e.target.value) : undefined)}
                    />
                  </div>
                  {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Anticipo Pagado
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 font-medium">Bs</span>
                    </div>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-green-700 font-bold ${
                        errors.advance ? 'border-red-300' : 'border-green-300 bg-green-50'
                      }`}
                      value={formState.advance}
                      onChange={(e) => handleChange('advance', Number(e.target.value))}
                    />
                  </div>
                  {errors.advance && <p className="text-red-500 text-sm mt-1">{errors.advance}</p>}
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600 font-medium">Saldo Pendiente:</span>
                    <span className="text-xl font-bold text-gray-800">
                      Bs {formatPrice(calculateRemaining())}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-4 rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all font-bold text-lg disabled:opacity-50"
                >
                  {submitting ? 'Guardando...' : id ? '✔️ Guardar Cambios' : '🚀 Registrar Pedido'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
