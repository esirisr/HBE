import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

// Import Routes
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js'; 
import userRoutes from './routes/userRoutes.js'; 
import proRoutes from './routes/proRoutes.js'; // 1. ADD THIS IMPORT
import analyticsRoutes from './routes/analyticsRoutes.js'; // 1. ADD THIS IMPORT



dotenv.config();
const app = express();

const allowedOrigins = [
  "http://localhost:5173",          // Local development
  "https://hfe.up.railway.app"     // Production frontend
];
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);
app.use(express.json());

connectDB();

// Mounting Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin/analytics', analyticsRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes); 
app.use('/api/pros', proRoutes); // 2. ADD THIS MOUNTING LINE

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
