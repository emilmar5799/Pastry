import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { OrderService } from '../../services/order.service';
import ProductService from '../../services/product.service';
import type { Order } from '../../types/order';
import type { Product } from '../../types/Product';
import {
  ArrowLeftIcon,
  ShoppingCartIcon,
  PlusCircleIcon,
  MinusCircleIcon,
  TrashIcon,
  CakeIcon,
  ExclamationCircleIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline';

interface OrderItem {
  product_id: number;
  name: string;
  quantity: number;
  unit_price: number;
}

export default function OrderFill() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  const [order, setOrder] = useState<Order | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  
  const [items, setItems] = useState<OrderItem[]>([]);
  
  const [showProductList, setShowProductList] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const searchRef = useRef<HTMLDivElement>(null);

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
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

  const loadData = async () => {
    setLoading(true);
    try {
      if (!id) return;
      
      const [orderData, prodData] = await Promise.all([
        OrderService.getById(Number(id)),
        ProductService.getAll()
      ]);
      
      setOrder(orderData);
      
      const activeProducts = prodData.filter(p => p.status !== 'Inactivo');
      setProducts(activeProducts);
      setFilteredProducts(activeProducts);

      if (orderData.products && orderData.products.length > 0) {
        setItems(orderData.products.map(p => ({
          product_id: p.product_id,
          name: p.name || 'Desconocido',
          quantity: p.quantity,
          unit_price: p.price || 0
        })));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentTotalQuantity = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const targetPieces = order?.pieces || 0;
  const isFulfilled = currentTotalQuantity === targetPieces;
  const isOverfilled = currentTotalQuantity > targetPieces;

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
    // Si ya llegaste al limite, bloqueamos UI un poco, pero el validate final salva la integridad
    if (currentTotalQuantity >= targetPieces) {
       alert(`El pedido solo admite ${targetPieces} piezas. No puedes añadir más.`);
       return;
    }

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
    
    // Evitar sumar arriba de las piezas pedidas
    const currentItem = items.find(i => i.product_id === productId);
    const difference = newQuantity - (currentItem?.quantity || 0);
    
    if (currentTotalQuantity + difference > targetPieces) {
      alert(`El pedido solo requiere ${targetPieces} piezas totales.`);
      return;
    }

    setItems(items.map(item =>
      item.product_id === productId
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  const handleSubmit = async () => {
    if (!order) return;
    
    if (currentTotalQuantity !== targetPieces) {
      alert(`Error crítico: Debes rellenar exactamente ${targetPieces} piezas. Llevas ${currentTotalQuantity}.`);
      return;
    }

    setSubmitting(true);
    try {
      const productsPayload = items.map(i => ({ product_id: i.product_id, quantity: i.quantity }));

      await OrderService.update(order.id, {
        products: productsPayload
      });
      
      alert('✅ Detalles de pedido guardados correctamente. Relleno completado.');
      navigate(`/orders/${order.id}`);
    } catch (error) {
      console.error('Error saving order fill:', error);
      alert('❌ Ocurrió un error al guardar el relleno del pedido.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatPrice = (price?: number): string => {
    if (price === undefined || price === null) return '0.00';
    return price.toFixed(2);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!order) {
    return <div className="p-6 text-center text-gray-500">No se encontró el pedido</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500/10 to-purple-600/5 rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <ShoppingCartIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Rellenar Pedido #{order.id}
              </h1>
              <p className="text-gray-600 mt-1">
                Cliente: {order.customer_name}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
               if (currentTotalQuantity > 0 && currentTotalQuantity !== targetPieces) {
                  const conf = window.confirm("Relleno incompleto. Si sales, NO se guardarán los productos rellenados, perderás los cambios. ¿Deseas salir?");
                  if (!conf) return;
               }
               navigate(`/orders/${order.id}`)
            }}
            className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Volver
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        
        {/* Banner de progreso */}
        <div className={`mb-8 p-4 rounded-xl border flex items-center justify-between ${
           isFulfilled ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'
        }`}>
           <div className="flex items-center gap-3">
              {isFulfilled ? (
                 <CheckBadgeIcon className="w-8 h-8 text-green-500" />
              ) : (
                 <ExclamationCircleIcon className="w-8 h-8 text-amber-500" />
              )}
              <div>
                 <p className={`font-bold text-lg ${isFulfilled ? 'text-green-800' : 'text-amber-800'}`}>
                    Progreso del Relleno
                 </p>
                 <p className={`text-sm ${isFulfilled ? 'text-green-600' : 'text-amber-600'}`}>
                    El pedido estipula exactamente <strong>{targetPieces} piezas</strong>.
                 </p>
              </div>
           </div>
           <div className="text-right">
              <div className="text-sm text-gray-500">Total Seleccionado</div>
              <div className={`text-3xl font-black tracking-tight ${
                 isFulfilled ? 'text-green-600' : isOverfilled ? 'text-red-500' : 'text-amber-600'
              }`}>
                 {currentTotalQuantity} <span className="text-xl text-gray-400 font-medium">/ {targetPieces}</span>
              </div>
           </div>
        </div>

        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <CakeIcon className="w-6 h-6 text-purple-600" />
          Añadir Piezas al Pedido
        </h3>
        
        {/* Buscador de productos */}
        <div className="mb-6" ref={searchRef}>
          <div className="relative">
            <input
              type="text"
              disabled={isFulfilled}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                 isFulfilled ? 'bg-gray-100 border-green-300 cursor-not-allowed' : 'bg-gray-50 border-gray-300'
              }`}
              placeholder={isFulfilled ? "Relleno completado. No puedes buscar más." : "Buscar producto por nombre..."}
              value={searchTerm}
              onChange={(e) => handleProductSearch(e.target.value)}
              onFocus={() => {
                if (isFulfilled) return;
                if (searchTerm) setShowProductList(true);
                else {
                  setFilteredProducts(products);
                  setShowProductList(true);
                }
              }}
            />
            {showProductList && !isFulfilled && (
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
        <div className="space-y-3 mb-8">
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
                    disabled={isFulfilled}
                    onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                    className={`p-2 transition-colors ${
                       isFulfilled ? 'text-gray-300 bg-gray-50 cursor-not-allowed' : 'hover:bg-gray-100 text-gray-600'
                    }`}
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
              <p className="text-gray-500">Aún no has rellenado ninguna pieza.</p>
            </div>
          )}
        </div>

        <div className="border-t border-gray-100 pt-6">
           <button
             type="button"
             onClick={handleSubmit}
             disabled={submitting || !isFulfilled}
             className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-4 rounded-xl hover:shadow-lg transition-all font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
           >
             {submitting ? 'Guardando...' : '✔️ Guardar Relleno del Pedido'}
           </button>
           {!isFulfilled && (
             <p className="text-center text-sm text-red-500 mt-3 font-medium">
                Debes seleccionar exactamente {targetPieces} piezas para poder guardar.
             </p>
           )}
        </div>

      </div>
    </div>
  );
}
