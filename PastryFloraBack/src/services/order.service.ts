import * as repo from '../repositories/order.repository';

export const createOrder = async (
  user: { userId: number; branchId: number },
  data: any
) => {
  if (data.advance <= 0) {
    throw new Error('Advance must be greater than 0');
  }

  // IMPORTANTE: Usar la fecha del frontend, no la fecha actual
  // Ajustar hora Bolivia → UTC (+4 horas)
  const deliveryDate = data.delivery_datetime 
    ? addHours(new Date(data.delivery_datetime), 4)
    : addHours(new Date(), 4); // Si no viene fecha, usar actual +4

  const orderId = await repo.createOrder({
    ...data,
    branch_id: user.branchId,
    created_by: user.userId,
    delivery_datetime: deliveryDate // Usar la fecha ajustada
  });

  return {
    id: orderId,
    message: 'Order created successfully'
  };
};

export const listOrders = async (branchId: number) => {
  return repo.findAllByBranch(branchId);
};

export const getOrder = async (id: number) => {
  const order = await repo.findById(id);
  if (!order) throw new Error('Order not found');
  return order;
};

export const updateOrder = async (id: number, data: any) => {
  // Si viene delivery_datetime, ajustarlo también
  if (data.delivery_datetime) {
    data.delivery_datetime = addHours(new Date(data.delivery_datetime), 4);
  }
  
  await repo.updateOrder(id, data);
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

const addHours = (date: Date, hours: number) => {
  const result = new Date(date);
  result.setHours(result.getHours() + hours);
  return result;
};