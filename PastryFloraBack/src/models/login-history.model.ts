export interface LoginHistory {
  id: number;
  user_id: number;
  branch_id: number;
  login_at: Date;
  ip_address?: string;
  user_agent?: string;
}
