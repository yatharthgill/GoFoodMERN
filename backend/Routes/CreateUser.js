const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/UserSchema');
const { body, validationResult } = require('express-validator');
const EventEmitter = require('events');


EventEmitter.defaultMaxListeners = 15;

const JWT_SECRET = 'f91d0f8d285872e30752921acdbf8c72512cbf74d6f58df450b545857c6347a3';

// Route to create a new user
router.post(
  '/createuser',
  [
    body('email', 'Invalid email').isEmail(),
    body('name', 'Name must be at least 3 characters long').isLength({ min: 3 }),
    body('password', 'Password must be at least 8 characters long').isLength({ min: 8 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Check if the email already exists
      const existingUser = await User.findOne({ email: req.body.email });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already in use' });
      }

      // Hash the password before saving the user
      const salt = await bcrypt.genSalt(10);
      
      const hashedPassword = await bcrypt.hash(req.body.password, salt);

      // Create the new user
      const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        phone: req.body.phone,
        location: req.body.location,
      });

      // Generate a JWT token
      const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

      res.send({
        message: 'User created successfully',
        token,
        user,
      });
    } catch {
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// Route to login the user
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Compare the entered password with the hashed password
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const data = {
      user: {
        id: user.id,
      },
    };

    // Generate a JWT token
    const token = jwt.sign(data, JWT_SECRET, { expiresIn: '1h' });

    return res.send({
      message: 'User logged in successfully',
      authToken: token,
    });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// Middleware to verify the JWT token
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Access denied, no token provided' });
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified; 
    next();
  } catch {
    res.status(400).json({ error: 'Invalid token' });
  }
};

// Protected route example (requires valid JWT token)
router.get('/protected', authenticateToken, (req, res) => {
  res.send('This is a protected route');
});

// Route to delete a user (Protected)
// router.delete('/deleteuser', authenticateToken, async (req, res) => {
//   try {
//     const user = await User.findOneAndDelete({ email: req.body.email });

//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     res.json({ message: 'User deleted successfully', user });
//   } catch (error) {
//     console.error('Error deleting user:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

module.exports = router;