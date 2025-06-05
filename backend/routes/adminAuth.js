const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin'); // Import User model

// POST /api/user/register
router.post('/admin/register', async (req, res) => {
  const { username, email, password } = req.body;
  const existing = await Admin.findOne({ $or: [{ username }, { email }] });
  if (existing) return res.status(400).json({ message: 'Adminname or email already exists' });

  const newAdmin = new Admin({ username, email, password });
  await newAdmin.save();
  res.status(201).json({ message: 'Admin registered' });
});

// POST /api/user/login
router.post('/admin/login', async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email });
  if (!admin || admin.password !== password) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
  res.json({ message: 'Admin Login successful', username: user.username });
});

module.exports = router;