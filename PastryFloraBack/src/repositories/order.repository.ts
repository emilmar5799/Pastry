import { db } from '../config/database';

export const createOrder = async (data: any): Promise<number> => {
  const [result]: any = await db.query(
    `INSERT INTO orders (
      branch_id, employee_id, customer_id, delivery_date, color, price, pieces,
      specifications, advance, event_type, warranty, type, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.branch_id,
      data.employee_id,
      data.customer_id,
      data.delivery_date,
      data.color,
      data.price,
      data.pieces,
      data.specifications,
      data.advance,
      data.event_type,
      data.warranty,
      data.type,
      data.status || 'DEFAULT'
    ]
  );

  return result.insertId;
};

export const findAllByBranch = async (branchId: number) => {
  const [rows] = await db.query(
    `SELECT o.*, c.name as customer_name, c.ci as customer_ci, c.phone as phone
     FROM orders o
     JOIN customers c ON c.id = o.customer_id
     WHERE o.branch_id = ?
     ORDER BY o.created_at DESC`,
    [branchId]
  );
  return rows;
};

export const findById = async (id: number) => {
  const [rows]: any = await db.query(
    `SELECT o.*, c.name as customer_name, c.ci as customer_ci, c.phone as phone
     FROM orders o
     JOIN customers c ON c.id = o.customer_id
     WHERE o.id = ?`,
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
