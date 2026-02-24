import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

// Import Routes
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js'; 
import userRoutes from './routes/userRoutes.js'; 
import proRoutes from './routes/proRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';

dotenv.config();
const app = express();

// 1. UPDATED ALLOWED ORIGINS
const allowedOrigins = [
  "http://localhost:5173",                 // Local development
  "https://hfe.up.railway.app",            // Previous production URL
  "https://hfe-production.up.railway.app", // CURRENT production URL (from your error)
  process.env.FRONTEND_URL                 // Best practice: Set this in Railway Variables
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error(`CORS Error: Origin ${origin} not allowed`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

app.use(express.json());

// Database Connection
connectDB();

// Mounting Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin/analytics', analyticsRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes); 
app.use('/api/pros', proRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
