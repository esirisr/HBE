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

// Connect to Database
connectDB();

const app = express();

// 1. DEFINE ALLOWED ORIGINS (No trailing slashes!)
const allowedOrigins = [
  "http://localhost:5173",
  "https://hfe.up.railway.app",
  "https://hfe-production.up.railway.app"
];

// 2. ROBUST CORS CONFIGURATION
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.error(`CORS Blocked for origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  optionsSuccessStatus: 200 // Some legacy browsers choke on 204
}));

// 3. MIDDLEWARE
app.use(express.json());

// 4. MOUNTING ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin/analytics', analyticsRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes); 
app.use('/api/pros', proRoutes);

// Health Check Route (To verify server is actually up)
app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
