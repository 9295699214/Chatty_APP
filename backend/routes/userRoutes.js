const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth.middleware');
const User = require('../models/User'); // Adjust the path as needed

// ...existing code...

router.get('/auth-user', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ...existing code...

module.exports = router;
