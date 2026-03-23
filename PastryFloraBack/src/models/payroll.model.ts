export interface Payroll {
  id: number;
  employee_id: number;
  pay_period_start: Date;
  pay_period_end: Date;
  base_salary: number;
  bonus: number;
  deductions: number;
  net_salary: number;
  paid_date?: Date;
  paid_by_user_id?: number;
  status: 'PENDING' | 'PAID' | 'CANCELLED';
  created_at: Date;
  updated_at: Date;
}

export interface PayrollCalculationInput {
  employee_id: number;
  pay_period_start: Date;
  pay_period_end: Date;
}

export interface PayrollDetail extends Payroll {
  employee_name?: string;
  email?: string;
  paid_by_name?: string;
}
