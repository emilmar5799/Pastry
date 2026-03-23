export interface Bonus {
  id: number;
  employee_id: number;
  bonus_amount: number;
  bonus_type: 'PERFORMANCE' | 'ANNUAL' | 'SPECIAL';
  reason?: string;
  bonus_date: Date;
  approved_by?: number;
  created_at: Date;
  updated_at: Date;
}

export interface BonusDetail extends Bonus {
  employee_name?: string;
  approved_by_name?: string;
}
