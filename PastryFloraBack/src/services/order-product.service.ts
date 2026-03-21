import * as repo from '../repositories/order-product.repository';

export const addProducts = async (
  orderId: number,
  products: { product_id: number; quantity: number }[]
) => {
  if (!products || products.length === 0) {
    throw new Error('Products are required');
  }

  await repo.insertOrderProducts(orderId, products);
};

export const listProducts = async (orderId: number) => {
  return repo.findByOrderId(orderId);
};

export const updateProduct = async (
  id: number,
  quantity: number
) => {
  if (quantity <= 0) {
    throw new Error('Quantity must be greater than 0');
  }

  await repo.updateQuantity(id, quantity);
};

export const deleteProduct = async (id: number) => {
  await repo.deleteOrderProduct(id);
};
