import api from '../api/axios';
import type { Order } from '../types/order';

export interface CreateOrderData {
  type: 'SMALL' | 'LARGE';
  delivery_date: string;
  customer_id: number;
  color?: string;
  price?: number;
  pieces?: number;
  specifications?: string;
  advance: number;
  event_type?: string;
  warranty?: string;
  products?: { product_id: number; quantity: number }[];
}

export interface UpdateOrderData {
  type?: 'SMALL' | 'LARGE';
  delivery_date?: string;
  customer_id?: number;
  color?: string;
  price?: number;
  pieces?: number;
  specifications?: string;
  advance?: number;
  event_type?: string;
  warranty?: string;
  status?: Order['status'];
  products?: { product_id: number; quantity: number }[];
}

export const OrderService = {
  getAll(): Promise<Order[]> {
    return api.get('/orders').then((r: any) => r.data);
  },

  getById(id: number): Promise<Order> {
    return api.get(`/orders/${id}`).then((r: any) => r.data);
  },

  create(data: CreateOrderData) {
    return api.post('/orders', data).then((r: any) => r.data);
  },

  update(id: number, data: UpdateOrderData) {
    return api.put(`/orders/${id}`, data).then((r: any) => r.data);
  },

  remove(id: number) {
    return api.delete(`/orders/${id}`).then((r: any) => r.data);
  },

  markAsFailed(id: number) {
    return api.patch(`/orders/${id}/failed`).then((r: any) => r.data);
  },

  markAsDone(id: number) {
    return api.patch(`/orders/${id}/done`).then((r: any) => r.data);
  },

  markAsDelivered(id: number) {
    return api.patch(`/orders/${id}/delivered`).then((r: any) => r.data);
  },

  markAsFinished(id: number) {
    return api.patch(`/orders/${id}/finished`).then((r: any) => r.data);
  }
};