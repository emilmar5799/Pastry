import { db } from '../config/database'
import { User } from '../models/user.model'

/* ===================== USERS ===================== */

export const findUserByEmail = async (email: string): Promise<User | null> => {
  const [rows] = await db.query<any[]>(
    'SELECT * FROM users WHERE email = ? AND active = true',
    [email]
  )
  return rows.length ? rows[0] : null
}

export const findAllUsers = async (): Promise<any[]> => {
  const [rows] = await db.query<any[]>(
    `SELECT u.*,
      JSON_ARRAYAGG(p.phone) AS phones
     FROM users u
     LEFT JOIN user_phones p ON p.user_id = u.id
     WHERE u.active = true
     GROUP BY u.id`
  )
  return rows
}

export const findInactiveUsers = async (): Promise<any[]> => {
  const [rows] = await db.query<any[]>(
    `SELECT u.*,
      JSON_ARRAYAGG(p.phone) AS phones
     FROM users u
     LEFT JOIN user_phones p ON p.user_id = u.id
     WHERE u.active = false
     GROUP BY u.id`
  )
  return rows
}

export const findUserById = async (id: number): Promise<any | null> => {
  const [rows] = await db.query<any[]>(
    `SELECT u.*,
      JSON_ARRAYAGG(p.phone) AS phones
     FROM users u
     LEFT JOIN user_phones p ON p.user_id = u.id
     WHERE u.id = ?
     GROUP BY u.id`,
    [id]
  )
  return rows.length ? rows[0] : null
}

export const createUser = async (data: Partial<User>) => {
  const [result]: any = await db.query(
    `INSERT INTO users 
     (first_name, last_name, email, password, role)
     VALUES (?, ?, ?, ?, ?)`,
    [
      data.first_name,
      data.last_name,
      data.email,
      data.password,
      data.role
    ]
  )
  return result.insertId
}

export const updateUser = async (id: number, data: Partial<User>) => {
  await db.query(
    `UPDATE users 
     SET first_name=?, last_name=?, role=? 
     WHERE id=?`,
    [data.first_name, data.last_name, data.role, id]
  )
}

export const softDeleteUser = async (id: number) => {
  await db.query('UPDATE users SET active=false WHERE id=?', [id])
}

export const reactivateUser = async (id: number) => {
  await db.query('UPDATE users SET active=true WHERE id=?', [id])
}

/* ===================== PHONES ===================== */

export const insertPhones = async (userId: number, phones: string[]) => {
  if (!phones.length) return

  const values = phones.map(phone => [userId, phone])
  await db.query(
    'INSERT INTO user_phones (user_id, phone) VALUES ?',
    [values]
  )
}

export const deletePhonesByUser = async (userId: number) => {
  await db.query('DELETE FROM user_phones WHERE user_id=?', [userId])
}
