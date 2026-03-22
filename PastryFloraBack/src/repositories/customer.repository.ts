import { db } from '../config/database';
import { Customer } from '../models/customer.model';

export const createCustomer = async (data: Partial<Customer>): Promise<number> => {
  const [result]: any = await db.query(
    `INSERT INTO customers (name, phone, email, ci) VALUES (?, ?, ?, ?)`,
    [data.name, data.phone, data.email, data.ci]
  );
  return result.insertId;
};

export const findAllCustomers = async (): Promise<Customer[]> => {
  const [rows] = await db.query<any[]>(`SELECT * FROM customers ORDER BY registration_date DESC`);
  return rows;
};
