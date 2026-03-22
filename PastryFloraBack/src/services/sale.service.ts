import * as saleRepo from '../repositories/sale.repository';
import * as saleProductRepo from '../repositories/sale-product.repository';

export const createSale = async (
  branchId: number,
  employeeId: number,
  products: {
    product_id: number;
    quantity: number;
    unit_price: number;
  }[],
  customerId?: number,
  paymentMethod?: string
) => {
  if (!products || products.length === 0) {
    throw new Error('Sale must have products');
  }

  const productsWithSubtotal = products.map(p => ({
    ...p,
    subtotal: p.quantity * p.unit_price
  }));

  const total = productsWithSubtotal.reduce(
    (sum, p) => sum + p.subtotal,
    0
  );

  const saleId = await saleRepo.createSale(
    branchId,
    employeeId,
    total,
    customerId,
    paymentMethod
  );

  await saleProductRepo.insertSaleProducts(saleId, productsWithSubtotal);

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
    unit_price: number;
  }[]
) => {
  const total = products.reduce(
    (sum, p) => sum + p.quantity * p.unit_price,
    0
  );

  await saleRepo.updateSale(id, total);
};

export const deleteSale = (id: number) =>
  saleRepo.deleteSale(id);

export const deleteSaleProduct = (id: number) =>
  saleProductRepo.deleteSaleProduct(id);
