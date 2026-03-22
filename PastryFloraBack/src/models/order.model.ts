export interface Order {
  id: number;
  branch_id: number;
  employee_id: number;
  customer_id: number;
  
  delivery_date: Date;
  color?: string;
  price?: number;
  pieces?: number;

  specifications?: string;
  advance: number;
  event_type?: string;
  warranty?: string;

  status: 'DEFAULT' | 'FAILED' | 'DONE' | 'DELIVERED' | 'FINISHED';
  type: 'SMALL' | 'LARGE';

  created_at: Date;
}
