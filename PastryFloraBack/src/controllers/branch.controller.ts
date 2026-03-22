import { Request, Response } from 'express';
import * as service from '../services/branch.service';

export const list = async (_req: Request, res: Response) => {
  try {
    const branches = await service.listBranches();
    res.json(branches);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
