import * as repo from '../repositories/report.repository';
import { AuthRequest } from '../middlewares/auth.middleware';

// Función para ajustar fechas Bolivia → UTC para consultas DB
const adjustDateForBoliviaReport = (dateString: string, isEndDate = false): string => {
  const date = new Date(dateString);
  
  // RESTAR 4 horas: Bolivia (UTC-4) → UTC
  date.setHours(date.getHours() - 4);
  
  // Ajustar para cubrir todo el día Bolivia
  if (isEndDate) {
    // Para fecha final: 23:59:59.999 Bolivia
    date.setHours(23, 59, 59, 999);
  } else {
    // Para fecha inicial: 00:00:00.000 Bolivia
    date.setHours(0, 0, 0, 0);
  }
  
  return date.toISOString();
};

export const generalReport = async (
  user: AuthRequest['user'],
  start: string,
  end: string,
  branchId?: number
) => {
  if (!user || user.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }

  // Frontend envía: 2026-01-10T00:00:00 a 2026-01-10T23:59:59 (Bolivia)
  // Convertimos a:  2026-01-09T20:00:00 a 2026-01-10T19:59:59 (UTC)
  const adjustedStart = adjustDateForBoliviaReport(start, false);
  const adjustedEnd = adjustDateForBoliviaReport(end, true);

  console.log('Reporte - Ajuste de fechas:', {
    bolivia_range: `${start} a ${end}`,
    utc_range: `${adjustedStart} a ${adjustedEnd}`
  });

  const sales = await repo.salesSummary(adjustedStart, adjustedEnd, branchId);
  const orders = await repo.completedOrdersSummary(adjustedStart, adjustedEnd, branchId);
  const advances = await repo.pendingAdvancesSummary(adjustedStart, adjustedEnd, branchId);

  const totalGeneral =
    Number(sales.total_amount) +
    Number(orders.total_amount);

  return {
    sales,
    completed_orders: orders,
    pending_advances: advances,
    total_general: totalGeneral
  };
};

export const dailyIncomeReport = async (
  user: AuthRequest['user'],
  start: string,
  end: string,
  branchId?: number
) => {
  if (!user || user.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }

  const adjustedStart = adjustDateForBoliviaReport(start, false);
  const adjustedEnd = adjustDateForBoliviaReport(end, true);

  const days = await repo.incomeByDay(adjustedStart, adjustedEnd, branchId);

  const total = days.reduce(
    (sum, d) => sum + Number(d.amount),
    0
  );

  // IMPORTANTE: Ajustar las fechas devueltas para mostrar en Bolivia
  const adjustedDays = days.map(d => {
    const boliviaDate = new Date(d.day);
    // SUMAR 4 horas: UTC → Bolivia
    boliviaDate.setHours(boliviaDate.getHours() + 4);
    
    return {
      day: boliviaDate.toISOString().split('T')[0], // Solo fecha
      amount: d.amount,
      percentage: total
        ? Number(((d.amount / total) * 100).toFixed(2))
        : 0
    };
  });

  return adjustedDays;
};