import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { connectDB } from './config/db.js';
import { errorHandler } from './middlewares/errorHandler.js';
import authRoutes from './routes/auth.routes.js';
import petRoutes from './routes/pet.routes.js';
import productRoutes from './routes/product.routes.js';
import cartRoutes from './routes/cart.routes.js';
import orderRoutes from './routes/order.routes.js';
import adminRoutes from './routes/admin.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import settingRoutes from './routes/setting.routes.js';

const app = express();

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

app.use(cors({
  origin: process.env.ORIGIN,
  credentials: true
}))


app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '20mb' }));
app.use(cookieParser());

// App Routes
app.use('/api/auth', authRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/settings', settingRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// Centralized Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running at PORT : ${process.env.PORT}`);
    })
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();


