import { db } from '../config/database'
import { User } from '../models/user.model'

/* ===================== USERS ===================== */

export const findUserByEmail = async (email: string): Promise<User | null> => {
  const [rows] = await db.query<any[]>(
    'SELECT * FROM users WHERE email = ? AND active = 1',
    [email]
  )
  return rows.length ? rows[0] : null
}

export const findAllUsers = async (): Promise<any[]> => {
  const [rows] = await db.query<any[]>(
    `SELECT * FROM users WHERE active = 1`
  )
  return rows
}

export const findInactiveUsers = async (): Promise<any[]> => {
  const [rows] = await db.query<any[]>(
    `SELECT * FROM users WHERE active = 0`
  )
  return rows
}

export const findUserById = async (id: number): Promise<any | null> => {
  const [rows] = await db.query<any[]>(
    `SELECT * FROM users WHERE id = ?`,
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
  await db.query('UPDATE users SET active=0 WHERE id=?', [id])
}

export const reactivateUser = async (id: number) => {
  await db.query('UPDATE users SET active=1 WHERE id=?', [id])
}

/* ===================== END ===================== */
