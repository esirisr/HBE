import express from 'express';
import jwt from 'jsonwebtoken';
const router = express.Router();

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // In a real app, check against MongoDB. For now:
  if (username === 'admin' && password === '12345') {
    const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600000 // 1 hour
    }).json({ success: true });
  } else {
    res.status(401).json({ message: 'Invalid Credentials' });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('token').json({ success: true });
});

export default router;