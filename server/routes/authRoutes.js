const express = require('express');
const router = express.Router();
const {
    authUser,
    registerUser,
    getUserProfile,
    verifyEmail,
    forgotPassword,
    resetPassword,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', authUser);
router.route('/profile').get(protect, getUserProfile);
router.get('/verify/:token', verifyEmail);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:token', resetPassword);

module.exports = router;
