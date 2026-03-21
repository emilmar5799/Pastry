export interface Order {
  id: number;
  branch_id: number;
  created_by: number;

  delivery_datetime: Date;
  customer_name: string;
  customer_ci?: string;
  phone?: string;
  color?: string;
  price?: number;
  pieces?: number;

  specifications?: string;
  advance: number;
  event?: string;
  warranty?: string;

  status: 'DEFAULT' | 'FAILED' | 'DONE' | 'DELIVERED' | 'FINISHED';
  type: 'SMALL' | 'LARGE';

  created_at: Date;
}
