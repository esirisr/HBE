import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/User.js';

// Fix for __dirname in ES Modules to locate the .env file correctly
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// This tells the script to look one level up (..) from /seeds to find the .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const createAdmin = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      console.error("❌ Error: MONGODB_URI is not defined in your .env file.");
      process.exit(1);
    }

    // 1. Connect to Database
    console.log("Connecting to MongoDB...");
    await mongoose.connect(mongoUri);
    console.log("✅ Database Connected.");

    // 2. Check if Admin already exists (to prevent duplicates)
    const adminExists = await User.findOne({ email: "admin@homeman.com" });
    if (adminExists) {
      console.log("ℹ️ Admin already exists in the database. Skipping creation.");
      process.exit(0);
    }

    // 3. Hash Password and Create User
    const hashed = await bcrypt.hash("admin123", 10);

    await User.create({
      name: "Super Admin",
      email: "admin@homeman.com",
      password: hashed,
      role: "admin",
      location: "hargeisa",
      skills: []
    });

    console.log("🚀 Admin created successfully!");
    process.exit(0); // Success exit

  } catch (error) {
    console.error("❌ Error during seeding:", error.message);
    process.exit(1); // Error exit
  }
};

createAdmin();