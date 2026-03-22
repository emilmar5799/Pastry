import { db } from '../config/database';
import { Product } from '../models/product.model';

export const createProduct = async (
  name: string,
  price: number,
  description?: string,
  category?: string,
  status: string = 'Disponible'
): Promise<void> => {
  await db.query(
    `INSERT INTO products (name, description, price, category, status) VALUES (?, ?, ?, ?, ?)`,
    [name, description, price, category, status]
  );
};

export const getAllProducts = async (): Promise<Product[]> => {
  const [rows] = await db.query(
    `SELECT * FROM products WHERE status != 'Inactivo'`
  );
  return rows as Product[];
};

export const getProductById = async (
  id: number
): Promise<Product | null> => {
  const [rows]: any = await db.query(
    `SELECT * FROM products WHERE id = ? AND status != 'Inactivo'`,
    [id]
  );
  return rows[0] || null;
};

export const updateProduct = async (
  id: number,
  name: string,
  price: number,
  description?: string,
  category?: string,
  status?: string
): Promise<void> => {
  await db.query(
    `UPDATE products SET name = COALESCE(?, name), price = COALESCE(?, price), description = COALESCE(?, description), category = COALESCE(?, category), status = COALESCE(?, status) WHERE id = ?`,
    [name, price, description, category, status, id]
  );
};

export const deleteProduct = async (id: number): Promise<void> => {
  await db.query(
    `UPDATE products SET status = 'Inactivo' WHERE id = ?`,
    [id]
  );
};
