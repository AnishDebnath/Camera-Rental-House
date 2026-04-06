import crypto from 'crypto';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import authRoutes from './routes/auth.ts';
import productsRoutes from './routes/products.ts';
import rentalsRoutes from './routes/rentals.ts';
import adminRoutes from './routes/admin.ts';
import manageRoutes from './routes/manage.ts';
import authMiddleware from './middleware/authMiddleware.ts';
import roleMiddleware from './middleware/roleMiddleware.ts';

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
    credentials: true,
  }),
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'cinekit-server',
    requestId: crypto.randomUUID(),
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/rentals', authMiddleware, roleMiddleware(['user']), rentalsRoutes);
app.use('/api/manage', authMiddleware, roleMiddleware(['admin', 'manager']), manageRoutes);
app.use('/api/admin', authMiddleware, adminRoutes);

app.use((error: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(error);
  return res.status(500).json({ message: error?.message || 'Internal server error.' });
});

export default app;

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  const port = Number(process.env.PORT || 5000);
  app.listen(port, () => {
    console.log(`CineKit server listening on port ${port}`);
  });
}
