export interface Sale {
  id: number
  branch_id: number
  employee_id: number
  customer_id?: number | null
  total: number
  payment_method?: string | null
  customer_name?: string
  employee_name?: string
  sale_date: string
}

export interface SaleProduct {
  id: number
  sale_id: number
  product_id: number
  name: string
  quantity: number
  unit_price: number
  subtotal: number
}
