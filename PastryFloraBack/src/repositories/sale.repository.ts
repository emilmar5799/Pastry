import { db } from '../config/database';

export const createSale = async (
  branchId: number,
  employeeId: number,
  total: number,
  customerId?: number | null,
  paymentMethod?: string | null
) => {
  const [res]: any = await db.query(
    `INSERT INTO sales (branch_id, employee_id, total, customer_id, payment_method)
     VALUES (?, ?, ?, ?, ?)`,
    [branchId, employeeId, total, customerId, paymentMethod]
  );
  return res.insertId;
};

export const findAllSalesByBranch = async (branchId: number) => {
  const [rows] = await db.query(
    `SELECT s.*, 
            c.name as customer_name,
            CONCAT(u.first_name, ' ', u.last_name) as employee_name
     FROM sales s
     LEFT JOIN customers c ON s.customer_id = c.id
     JOIN users u ON s.employee_id = u.id
     WHERE s.branch_id = ? 
     ORDER BY s.sale_date DESC`,
    [branchId]
  );
  return rows;
};

export const findSaleById = async (id: number) => {
  const [rows]: any = await db.query(
    `SELECT s.*, 
            c.name as customer_name,
            CONCAT(u.first_name, ' ', u.last_name) as employee_name
     FROM sales s
     LEFT JOIN customers c ON s.customer_id = c.id
     JOIN users u ON s.employee_id = u.id
     WHERE s.id = ?`,
    [id]
  );
  return rows[0];
};

export const updateSale = async (id: number, total: number) => {
  await db.query(
    `UPDATE sales SET total = ? WHERE id = ?`,
    [total, id]
  );
};

export const deleteSale = async (id: number) => {
  await db.query(`DELETE FROM sale_products WHERE sale_id = ?`, [id]);
  await db.query(`DELETE FROM sales WHERE id = ?`, [id]);
};
