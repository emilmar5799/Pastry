import { db } from '../config/database';
import { Product } from '../models/product.model';

export const createProduct = async (
  name: string,
  price: number
): Promise<void> => {
  await db.query(
    `INSERT INTO products (name, price) VALUES (?, ?)`,
    [name, price]
  );
};

export const getAllProducts = async (): Promise<Product[]> => {
  const [rows] = await db.query(
    `SELECT * FROM products WHERE active = true`
  );
  return rows as Product[];
};

export const getProductById = async (
  id: number
): Promise<Product | null> => {
  const [rows]: any = await db.query(
    `SELECT * FROM products WHERE id = ? AND active = true`,
    [id]
  );
  return rows[0] || null;
};

export const updateProduct = async (
  id: number,
  name: string,
  price: number
): Promise<void> => {
  await db.query(
    `UPDATE products SET name = ?, price = ? WHERE id = ?`,
    [name, price, id]
  );
};

export const deleteProduct = async (id: number): Promise<void> => {
  await db.query(
    `UPDATE products SET active = false WHERE id = ?`,
    [id]
  );
};
