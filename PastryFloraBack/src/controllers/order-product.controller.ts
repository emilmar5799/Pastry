import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import * as service from '../services/order-product.service';

export const add = async (req: AuthRequest, res: Response) => {
  await service.addProducts(
    Number(req.params.orderId),
    req.body.products
  );
  res.status(201).json({ message: 'Products added' });
};

export const set = async (req: AuthRequest, res: Response) => {
  await service.setProducts(
    Number(req.params.orderId),
    req.body.products
  );
  res.json({ message: 'Products replaced' });
};

export const list = async (req: AuthRequest, res: Response) => {
  res.json(await service.listProducts(Number(req.params.orderId)));
};

export const update = async (req: AuthRequest, res: Response) => {
  await service.updateProduct(
    Number(req.params.id),
    req.body.quantity
  );
  res.json({ message: 'Updated' });
};

export const remove = async (req: AuthRequest, res: Response) => {
  await service.deleteProduct(Number(req.params.id));
  res.json({ message: 'Deleted permanently' });
};
