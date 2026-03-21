import { db } from '../config/database';

/* =========================
   SALES
========================= */
export const salesSummary = async (
  start: string,
  end: string,
  branchId?: number
) => {
  const params: any[] = [start, end];
  let branchFilter = '';

  if (branchId) {
    branchFilter = 'AND branch_id = ?';
    params.push(branchId);
  }

  const [rows]: any = await db.query(
    `
    SELECT 
      COUNT(*) AS total_sales,
      IFNULL(SUM(total), 0) AS total_amount
    FROM sales
    WHERE status = 'ACTIVE'
      AND created_at BETWEEN ? AND ?
      ${branchFilter}
    `,
    params
  );

  return rows[0];
};

/* =========================
   COMPLETED ORDERS
========================= */
export const completedOrdersSummary = async (
  start: string,
  end: string,
  branchId?: number
) => {
  const params: any[] = [start, end];
  let branchFilter = '';

  if (branchId) {
    branchFilter = 'AND branch_id = ?';
    params.push(branchId);
  }

  const [rows]: any = await db.query(
    `
    SELECT 
      COUNT(*) AS total_orders,
      IFNULL(SUM(price), 0) AS total_amount
    FROM orders
    WHERE status IN ('DONE','DELIVERED','FINISHED')
      AND created_at BETWEEN ? AND ?
      ${branchFilter}
    `,
    params
  );

  return rows[0];
};

/* =========================
   PENDING ADVANCES
========================= */
export const pendingAdvancesSummary = async (
  start: string,
  end: string,
  branchId?: number
) => {
  const params: any[] = [start, end];
  let branchFilter = '';

  if (branchId) {
    branchFilter = 'AND branch_id = ?';
    params.push(branchId);
  }

  const [rows]: any = await db.query(
    `
    SELECT 
      COUNT(*) AS total_orders,
      IFNULL(SUM(advance), 0) AS total_advance
    FROM orders
    WHERE status = 'DEFAULT'
      AND created_at BETWEEN ? AND ?
      ${branchFilter}
    `,
    params
  );

  return rows[0];
};

/* =========================
   DAILY INCOME (SALES)
========================= */
export const incomeByDay = async (
  start: string,
  end: string,
  branchId?: number
) => {
  const params: any[] = [start, end];
  let branchFilter = '';

  if (branchId) {
    branchFilter = 'AND branch_id = ?';
    params.push(branchId);
  }

  const [rows] = await db.query(
    `
    SELECT 
      DATE(created_at) AS day,
      SUM(total) AS amount
    FROM sales
    WHERE status = 'ACTIVE'
      AND created_at BETWEEN ? AND ?
      ${branchFilter}
    GROUP BY DATE(created_at)
    ORDER BY amount DESC
    `,
    params
  );

  return rows as any[];
};
