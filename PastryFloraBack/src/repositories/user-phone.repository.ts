import { db } from '../config/database';

export const insertUserPhones = async (
  userId: number,
  phones: string[]
): Promise<void> => {
  const values = phones.map(phone => [userId, phone]);

  await db.query(
    `INSERT INTO user_phones (user_id, phone) VALUES ?`,
    [values]
  );
};

export const getUserPhones = async (userId: number) => {
  const [rows] = await db.query(
    `SELECT id, phone FROM user_phones WHERE user_id = ?`,
    [userId]
  );

  return rows;
};
