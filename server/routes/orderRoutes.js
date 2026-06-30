const express = require('express');
const router = express.Router();
const {
    addOrderItems,
    getOrderById,
    updateOrderToPaid,
    updateOrderStatus,
    getMyOrders,
    getOrders,
    createRazorpayOrder,
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders);
router.route('/myorders').get(protect, getMyOrders);
router.route('/razorpay').post(protect, createRazorpayOrder);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/pay').put(protect, updateOrderToPaid);
router.route('/:id/status').put(protect, admin, updateOrderStatus);

module.exports = router;
