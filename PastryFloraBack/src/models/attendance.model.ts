export interface Attendance {
  id: number;
  employee_id: number;
  date: Date;
  check_in?: string;
  check_out?: string;
  hours_worked: number;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'HALF_DAY';
  created_at: Date;
  updated_at: Date;
}

export interface AttendanceSummary {
  total_hours: number;
  total_days: number;
  present_days: number;
  absent_days: number;
  late_days: number;
  half_days: number;
}
