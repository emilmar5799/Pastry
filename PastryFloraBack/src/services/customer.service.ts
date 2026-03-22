import * as repo from '../repositories/customer.repository';
import { Customer } from '../models/customer.model';

export const createCustomer = async (data: Partial<Customer>) => {
  if (!data.name) throw new Error('Customer name is required');
  const id = await repo.createCustomer(data);
  return { id, message: 'Customer created successfully' };
};

export const listCustomers = async () => {
  return await repo.findAllCustomers();
};
