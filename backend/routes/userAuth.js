const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Import User model


// POST /api/user/register
router.post('/user/register', async (req, res) => {
  const { username, email, password } = req.body;
  const existing = await User.findOne({ $or: [{ username }, { email }] });
  if (existing) return res.status(400).json({ message: 'Username or email already exists' });

  const newUser = new User({ username, email, password });
  await newUser.save();
  res.status(201).json({ message: 'User registered' });
});

// POST /api/user/login
router.post('/user/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email});
  if (!user || user.password !== password) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
  res.json({ message: 'User Login successful', username: user.username });
});

module.exports = router;
