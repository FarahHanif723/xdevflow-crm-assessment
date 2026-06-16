const express = require('express');
const router = express.Router();
const { register, login, getUsers, updateUserRole } = require('../controllers/authController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/users', protect, adminOnly, getUsers);
router.put('/users/:id/role', protect, adminOnly, updateUserRole);

module.exports = router;