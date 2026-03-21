import { Request, Response } from 'express';
import * as service from '../services/sale.service';

export const remove = async (req: Request, res: Response) => {
  await service.deleteSaleProduct(Number(req.params.id));
  res.json({ message: 'Deleted' });
};
