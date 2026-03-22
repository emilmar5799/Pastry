export interface Sale {
  id: number;
  sale_date: Date;
  customer_id?: number | null;
  employee_id: number;
  branch_id: number;
  total: number;
  payment_method?: string | null;
  customer_name?: string;
  employee_name?: string;
}
