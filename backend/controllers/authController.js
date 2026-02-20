import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

/**
 * REGISTER USER
 */
export const register = async (req, res) => {
  try {
    const { name, email, password, role, location, phone } = req.body;

    // 1. Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }

    // 2. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create user with cleaned data
    const newUser = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: role || 'user', // Default role if none provided
      phone: phone || '',
      location: location ? location.toLowerCase().trim() : 'not specified'
    });

    res.status(201).json({ 
      success: true, 
      message: "User registered successfully",
      userId: newUser._id 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Registration failed", error: error.message });
  }
};

/**
 * LOGIN USER
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find user & include password (if your model has 'select: false' by default)
    const user = await User.findOne({ email: email.toLowerCase() });
    
    // 2. Validate user existence and password
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    // 3. Ensure JWT_SECRET is loaded from Railway environment
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing in environment variables!");
      return res.status(500).json({ success: false, message: "Server configuration error" });
    }

    // 4. Sign Token (Payload includes ID and Role for the 'protect' middleware)
    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    );

    // 5. Send Response
    res.json({ 
      success: true,
      token, 
      role: user.role, 
      user: { 
        id: user._id, 
        name: user.name, 
        location: user.location,
        email: user.email 
      } 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Login failed", error: error.message });
  }
};
