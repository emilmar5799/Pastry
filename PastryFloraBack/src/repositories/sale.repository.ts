import { db } from '../config/database';

export const createSale = async (
  branchId: number,
  soldBy: number,
  total: number
) => {
  const [res]: any = await db.query(
    `INSERT INTO sales (branch_id, sold_by, total)
     VALUES (?, ?, ?)`,
    [branchId, soldBy, total]
  );
  return res.insertId;
};

export const findAllSalesByBranch = async (branchId: number) => {
  const [rows] = await db.query(
    `SELECT * FROM sales WHERE branch_id = ? ORDER BY created_at DESC`,
    [branchId]
  );
  return rows;
};

export const findSaleById = async (id: number) => {
  const [rows]: any = await db.query(
    `SELECT * FROM sales WHERE id = ?`,
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

export const cancelSale = async (id: number) => {
  await db.query(
    `UPDATE sales SET status = 'CANCELLED' WHERE id = ?`,
    [id]
  );
};
