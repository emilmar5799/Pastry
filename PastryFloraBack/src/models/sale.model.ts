export interface Sale {
  id: number;
  branch_id: number;
  sold_by: number;
  total: number;
  status: 'ACTIVE' | 'CANCELLED';
  created_at: Date;
}
