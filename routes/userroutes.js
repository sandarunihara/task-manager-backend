const express = require('express');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

// @route   GET /api/users
// @desc    Get all users (for admin assignment dropdown)
// @access  Admin only
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select('name email role').sort({ name: 1 });
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error fetching users' });
  }
});

module.exports = router;
