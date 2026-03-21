import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth.routes';
import productRoutes from './routes/product.routes';

import orderRoutes from './routes/order.routes';
import orderProductRoutes from './routes/order-product.routes';

import saleRoutes from './routes/sale.routes';
import saleProductRoutes from './routes/sale-product.routes';
import usersRoutes from './routes/user.routes';
import reportRoutes from './routes/report.routes';

const app = express();

app.use(express.json());

// si quieres leer formularios URL encoded
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://pastryflorafront.onrender.com'
  ],
  credentials: true
}));

//  AUTH
app.use('/api/auth', authRoutes);

//  CATALOG
app.use('/api/products', productRoutes);

//  ORDERS / RESERVATIONS
app.use('/api/orders', orderRoutes);
app.use('/api/orders', orderProductRoutes);

//  SALES
app.use('/api/sales', saleRoutes);
app.use('/api/sales', saleProductRoutes);

//  REPORTS (ADMIN ONLY)
app.use('/api/reports', reportRoutes);
//  USERS (ADMIN ONLY)
app.use('/api/users', usersRoutes);

//  Health check
app.get('/health', (_, res) => {
  res.json({ status: 'ok' });
});

export default app;
