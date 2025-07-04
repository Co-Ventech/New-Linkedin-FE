  
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Public routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/test-token', authMiddleware, (req, res) => {
  res.json({
    success: true,
    message: 'Token is valid',
    user: req.user
  });
});
// Protected routes
// router.get('/profile', authMiddleware, authController.getProfile);
router.get('/dashboard', authMiddleware, authController.dashboard);

module.exports = router;


