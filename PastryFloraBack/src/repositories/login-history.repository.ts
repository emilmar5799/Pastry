import { db } from '../config/database';

export const insertLoginHistory = async (
  userId: number,
  branchId: number,
  ip?: string,
  userAgent?: string
): Promise<void> => {
  await db.query(
    `INSERT INTO login_history (user_id, branch_id, ip_address, user_agent)
     VALUES (?, ?, ?, ?)`,
    [userId, branchId, ip, userAgent]
  );
};
