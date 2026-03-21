import { db } from '../config/database';

export const createOrder = async (data: any): Promise<number> => {
  const [result]: any = await db.query(
    `INSERT INTO orders (
      branch_id, created_by, delivery_datetime, customer_name,
      customer_ci, phone, color, price, pieces,
      specifications, advance, event, warranty, type
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.branch_id,
      data.created_by,
      data.delivery_datetime,
      data.customer_name,
      data.customer_ci,
      data.phone,
      data.color,
      data.price,
      data.pieces,
      data.specifications,
      data.advance,
      data.event,
      data.warranty,
      data.type
    ]
  );

  return result.insertId;
};

export const findAllByBranch = async (branchId: number) => {
  const [rows] = await db.query(
    `SELECT * FROM orders
     WHERE branch_id = ?
     ORDER BY created_at DESC`,
    [branchId]
  );
  return rows;
};

export const findById = async (id: number) => {
  const [rows]: any = await db.query(
    `SELECT * FROM orders WHERE id = ?`,
    [id]
  );
  return rows[0];
};

export const updateOrder = async (id: number, data: any) => {
  await db.query(
    `UPDATE orders SET ? WHERE id = ?`,
    [data, id]
  );
};

export const updateStatus = async (
  id: number,
  status: 'FAILED' | 'DELIVERED' | 'DONE' | 'FINISHED'
) => {
  await db.query(
    `UPDATE orders SET status = ? WHERE id = ?`,
    [status, id]
  );
};
