import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import * as service from '../services/sale.service';

export const create = async (req: AuthRequest, res: Response) => {
  const { products, customerId, paymentMethod } = req.body;
  const result = await service.createSale(
    req.user!.branchId,
    req.user!.userId,
    products,
    customerId,
    paymentMethod
  );
  res.status(201).json(result);
};

export const list = async (req: AuthRequest, res: Response) => {
  res.json(await service.listSales(req.user!.branchId));
};

export const getById = async (req: AuthRequest, res: Response) => {
  res.json(await service.getSaleDetail(Number(req.params.id)));
};

export const update = async (req: AuthRequest, res: Response) => {
  await service.updateSale(
    Number(req.params.id),
    req.body.products
  );
  res.json({ message: 'Updated' });
};

export const remove = async (req: AuthRequest, res: Response) => {
  await service.deleteSale(Number(req.params.id));
  res.json({ message: 'Deleted' });
};
