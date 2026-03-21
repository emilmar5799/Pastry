import * as saleRepo from '../repositories/sale.repository';
import * as saleProductRepo from '../repositories/sale-product.repository';

export const createSale = async (
  branchId: number,
  soldBy: number,
  products: {
    product_id: number;
    quantity: number;
    price_at_sale: number;
  }[]
) => {
  if (!products || products.length === 0) {
    throw new Error('Sale must have products');
  }

  const total = products.reduce(
    (sum, p) => sum + p.quantity * p.price_at_sale,
    0
  );

  const saleId = await saleRepo.createSale(
    branchId,
    soldBy,
    total
  );

  await saleProductRepo.insertSaleProducts(saleId, products);

  return { id: saleId, total };
};

export const listSales = (branchId: number) =>
  saleRepo.findAllSalesByBranch(branchId);

export const getSaleDetail = async (id: number) => {
  const sale = await saleRepo.findSaleById(id);
  if (!sale) throw new Error('Sale not found');

  const products = await saleProductRepo.findProductsBySale(id);

  return { ...sale, products };
};

export const updateSale = async (
  id: number,
  products: {
    product_id: number;
    quantity: number;
    price_at_sale: number;
  }[]
) => {
  const total = products.reduce(
    (sum, p) => sum + p.quantity * p.price_at_sale,
    0
  );

  await saleRepo.updateSale(id, total);
};

export const cancelSale = (id: number) =>
  saleRepo.cancelSale(id);

export const deleteSaleProduct = (id: number) =>
  saleProductRepo.deleteSaleProduct(id);
