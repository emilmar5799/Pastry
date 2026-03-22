import { db } from '../config/database';

export const insertSaleProducts = async (
  saleId: number,
  products: {
    product_id: number;
    quantity: number;
    unit_price: number;
    subtotal: number;
  }[]
) => {
  const values = products.map(p => [
    saleId,
    p.product_id,
    p.quantity,
    p.unit_price,
    p.subtotal
  ]);

  await db.query(
    `INSERT INTO sale_products
     (sale_id, product_id, quantity, unit_price, subtotal)
     VALUES ?`,
    [values]
  );
};

export const findProductsBySale = async (saleId: number) => {
  const [rows] = await db.query(
    `SELECT sp.*, p.name
     FROM sale_products sp
     JOIN products p ON p.id = sp.product_id
     WHERE sp.sale_id = ?`,
    [saleId]
  );
  return rows;
};

export const deleteSaleProduct = async (id: number) => {
  await db.query(
    `DELETE FROM sale_products WHERE id = ?`,
    [id]
  );
};
