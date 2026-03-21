import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import * as service from '../services/report.service';

export const generalReport = async (
  req: AuthRequest,
  res: Response
) => {
  const { start, end, branchId } = req.query;

  if (!start || !end) {
    return res.status(400).json({
      message: 'start and end dates are required'
    });
  }

  const report = await service.generalReport(
    req.user!,
    String(start),
    String(end),
    branchId ? Number(branchId) : undefined
  );

  res.json(report);
};

export const dailyIncomeReport = async (
  req: AuthRequest,
  res: Response
) => {
  const { start, end, branchId } = req.query;

  if (!start || !end) {
    return res.status(400).json({
      message: 'start and end dates are required'
    });
  }

  const report = await service.dailyIncomeReport(
    req.user!,
    String(start),
    String(end),
    branchId ? Number(branchId) : undefined
  );

  res.json(report);
};
