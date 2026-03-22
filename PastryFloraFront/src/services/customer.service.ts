import api from '../api/axios';
import type { Customer } from '../types/customer';

export interface CreateCustomerData {
  name: string;
  phone?: string;
  ci?: string;
  email?: string;
}

export const CustomerService = {
  getAll(): Promise<Customer[]> {
    return api.get('/customers').then((r: any) => r.data);
  },

  create(data: CreateCustomerData): Promise<Customer> {
    return api.post('/customers', data).then((r: any) => r.data);
  }
};
