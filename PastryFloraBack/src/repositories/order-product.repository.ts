import { db } from '../config/database';

export const insertOrderProducts = async (
  orderId: number,
  products: { product_id: number; quantity: number }[]
) => {
  const values = products.map(p => [
    orderId,
    p.product_id,
    p.quantity
  ]);

  await db.query(
    `INSERT INTO order_products (order_id, product_id, quantity)
     VALUES ?`,
    [values]
  );
};

export const findByOrderId = async (orderId: number) => {
  const [rows] = await db.query(
    `SELECT op.*, p.name, p.price
     FROM order_products op
     JOIN products p ON p.id = op.product_id
     WHERE op.order_id = ?`,
    [orderId]
  );
  return rows;
};

export const updateQuantity = async (
  id: number,
  quantity: number
) => {
  await db.query(
    `UPDATE order_products SET quantity = ? WHERE id = ?`,
    [quantity, id]
  );
};

export const deleteOrderProduct = async (id: number) => {
  await db.query(
    `DELETE FROM order_products WHERE id = ?`,
    [id]
  );
};

export const deleteByOrderId = async (orderId: number) => {
  await db.query(
    `DELETE FROM order_products WHERE order_id = ?`,
    [orderId]
  );
};
