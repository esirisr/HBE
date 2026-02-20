// controllers/authController.js
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

/**
 * REGISTER USER
 */
export const register = async (req, res) => {
  try {
    const { name, email, password, role, location, phone, skills } = req.body;

    // 1️⃣ Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }

    // 2️⃣ Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3️⃣ Create user
    const newUser = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: role || 'client', // Updated default role
      phone: phone || '',
      location: location ? location.toLowerCase().trim() : 'not specified',
      skills: role === 'pro' && skills ? [skills] : [] // Only store skills for pros
    });

    // 4️⃣ Respond
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

    // 1️⃣ Find user
    const user = await User.findOne({ email: email.toLowerCase() });

    // 2️⃣ Validate password
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    // 3️⃣ Check JWT_SECRET
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing in environment variables!");
      return res.status(500).json({ success: false, message: "Server configuration error" });
    }

    // 4️⃣ Sign token
    const token = jwt.sign(
      { id: user._id, role: user.role }, // Payload includes id + role
      process.env.JWT_SECRET,
      { expiresIn: '7d' } // Adjust expiration as needed
    );

    // 5️⃣ Send response
    res.json({ 
      success: true,
      token, 
      role: user.role, 
      user: { 
        id: user._id, 
        name: user.name, 
        location: user.location,
        email: user.email,
        skills: user.skills || []
      } 
    });

  } catch (error) {
    res.status(500).json({ success: false, message: "Login failed", error: error.message });
  }
};
