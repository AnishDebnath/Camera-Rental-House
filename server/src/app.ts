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

// Allow localhost:* and any private-network IP (192.168.x.x, 10.x.x.x, 172.16-31.x.x)
// so the app works both on localhost and when accessed over the local network.
const PRIVATE_IP_RE = /^https?:\/\/(localhost|127\.0\.0\.1|192\.168\.\d{1,3}\.\d{1,3}|10\.\d{1,3}\.\d{1,3}\.\d{1,3}|172\.(1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3})(:\d+)?$/;

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server / Postman requests (no Origin header)
      if (!origin) return callback(null, true);
      // Allow explicitly listed origins from env
      if (process.env.ALLOWED_ORIGINS) {
        const list = process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim());
        if (list.includes(origin)) return callback(null, true);
      }
      // Allow any private-network or localhost origin
      if (PRIVATE_IP_RE.test(origin)) return callback(null, true);
      callback(new Error(`CORS: origin '${origin}' not allowed`));
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'camera-rental-house-server',
    requestId: crypto.randomUUID(),
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/rentals', authMiddleware, roleMiddleware(['user']), rentalsRoutes);
app.use('/api/manage', authMiddleware, roleMiddleware(['admin', 'manager']), manageRoutes);
app.use('/api/admin', authMiddleware, adminRoutes);

app.use((error: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('SERVER ERROR:', error);
  return res.status(500).json({
    message: error?.message || 'Internal server error.',
    error: error // temporarily exposing error for debugging
  });
});

export default app;

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  const port = Number(process.env.PORT || 5000);
  // Listen on 0.0.0.0 so the server is reachable from other devices on the LAN
  app.listen(port, '0.0.0.0', () => {
    console.log(`Camera Rental House server listening on http://0.0.0.0:${port}`);
  });
}
