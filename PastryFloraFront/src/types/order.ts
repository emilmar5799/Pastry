export type OrderStatus =
  | 'DEFAULT'
  | 'FAILED'
  | 'DONE'
  | 'DELIVERED'
  | 'FINISHED';

export type OrderType = 'SMALL' | 'LARGE';

export interface OrderProduct {
  id: number;
  product_id: number;
  quantity: number;
  name?: string;
  price?: number;
}

export interface Order {
  id: number;
  branch_id: number;
  employee_id: number;
  customer_id: number;

  delivery_date: string;
  customer_name: string;
  customer_ci?: string;
  phone?: string;
  color?: string;
  price?: number;
  pieces?: number;

  specifications?: string;
  advance: number;
  event_type?: string;
  warranty?: string;

  status: OrderStatus;
  type: OrderType;
  products: OrderProduct[];

  created_at: string;
}
