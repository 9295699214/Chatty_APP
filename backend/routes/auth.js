const express = require('express');
const router = express.Router();
const { getUserById, loginUser } = require('../controllers/userController'); // Adjust the path as needed
const { verifyToken } = require('../middleware/auth.middleware'); // Adjust the path as needed

// Route to get the authenticated user data
router.get('/user', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id; // Assuming the user ID is stored in req.user.id after token verification
    const user = await getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/auth-user', (req, res) => {
  console.log('Received request for /api/auth-user');
  res.setHeader('Cache-Control', 'no-store'); // Disable caching
  const authUser = {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
  };
  console.log('Sending response:', authUser);
  res.json(authUser);
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await loginUser(email, password);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = user.generateAuthToken(); // Assuming generateAuthToken is a method on the user model
    res.cookie('jwt_token', token, { httpOnly: true });
    console.log('User logged in:', user);
    res.json({ message: 'Login successful', user });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.use((req, res, next) => {
  console.log(`Request URL: ${req.originalUrl}`);
  console.log(`Request Method: ${req.method}`);
  next();
});

router.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).send('Server Error');
});

module.exports = router;
