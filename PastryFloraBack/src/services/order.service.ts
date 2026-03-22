import * as repo from '../repositories/order.repository';
import * as orderProductRepo from '../repositories/order-product.repository';

export const createOrder = async (
  user: { userId: number; branchId: number },
  data: any
) => {
  if (data.advance <= 0) {
    throw new Error('Advance must be greater than 0');
  }

  const deliveryDate = data.delivery_date 
    ? new Date(data.delivery_date)
    : new Date();

  // Separamos products del request
  const { products, ...orderData } = data;

  const orderId = await repo.createOrder({
    ...orderData,
    branch_id: user.branchId,
    employee_id: user.userId,
    delivery_date: deliveryDate // Usar la fecha ajustada
  });

  if (products && Array.isArray(products) && products.length > 0) {
    await orderProductRepo.insertOrderProducts(orderId, products);
  }

  return {
    id: orderId,
    message: 'Order created successfully'
  };
};

export const listOrders = async (branchId: number) => {
  const orders = await repo.findAllByBranch(branchId) as any[];
  for (const order of orders) {
    order.products = await orderProductRepo.findByOrderId(order.id);
  }
  return orders;
};

export const getOrder = async (id: number) => {
  const order = await repo.findById(id) as any;
  if (!order) throw new Error('Order not found');
  
  order.products = await orderProductRepo.findByOrderId(id);
  return order;
};

export const updateOrder = async (id: number, data: any) => {
  const { products, ...orderData } = data;

  if (Object.keys(orderData).length > 0) {
    if (orderData.delivery_date) {
      orderData.delivery_date = new Date(orderData.delivery_date);
    }
    
    await repo.updateOrder(id, orderData);
  }

  if (products && Array.isArray(products)) {
    // Si envían array vacío borra los preexistentes, o lo sobreescribe
    await orderProductRepo.deleteByOrderId(id);
    if (products.length > 0) {
      await orderProductRepo.insertOrderProducts(id, products);
    }
  }
};

export const markAsFailed = async (id: number) => {
  await repo.updateStatus(id, 'FAILED');
};

export const markAsDelivered = async (id: number) => {
  await repo.updateStatus(id, 'DELIVERED');
};

export const markAsDone = async (id: number) => {
  await repo.updateStatus(id, 'DONE');
};

export const markAsFinished = async (id: number) => {
  await repo.updateStatus(id, 'FINISHED');
};
