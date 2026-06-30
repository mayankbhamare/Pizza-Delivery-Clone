const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const PizzaOption = require('../models/PizzaOption');
const crypto = require('crypto');
const Razorpay = require('razorpay');

const sendEmail = require('../utils/sendEmail');

// Helper to check and reduce stock
const checkAndReduceStock = async (orderItems) => {
    for (const item of orderItems) {
        const optionsToCheck = [];
        if (item.options.base) optionsToCheck.push(item.options.base);
        if (item.options.sauce) optionsToCheck.push(item.options.sauce);
        if (item.options.cheese) optionsToCheck.push(item.options.cheese);
        if (item.options.veggies) optionsToCheck.push(...item.options.veggies);
        if (item.options.meat) optionsToCheck.push(...item.options.meat);

        for (const optionName of optionsToCheck) {
            const stockItem = await PizzaOption.findOne({ name: optionName });
            if (!stockItem) continue;

            if (stockItem.stock < 1) {
                throw new Error(`Item ${optionName} is out of stock`);
            }

            stockItem.stock = stockItem.stock - 1;

            // Requirement 8: Schedule a notification to the admin email id when the available stock goes beyond the threshold value
            // We only send if it JUST dropped below threshold or is already below?
            // "goes beyond the threshold value" implies crossing the line.
            // Let's send if it is now < threshold.
            if (stockItem.stock < stockItem.threshold && !stockItem.isLowStockAlertSent) {
                try {
                    console.log(`Sending low stock email for ${stockItem.name}...`);
                    await sendEmail({
                        email: process.env.EMAIL_USER,
                        subject: `Low Stock Alert: ${stockItem.name}`,
                        message: `The stock for ${stockItem.name} has fallen below the threshold (${stockItem.threshold}). Current stock: ${stockItem.stock}. Please restock soon.`,
                    });

                    stockItem.isLowStockAlertSent = true;
                    console.log(`Low stock email sent for ${stockItem.name}`);
                } catch (error) {
                    console.error("Failed to send low stock email:", error.message);
                }
            }

            await stockItem.save();
        }
    }
};


// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
    try {
        const {
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
        } = req.body;

        if (orderItems && orderItems.length === 0) {
            res.status(400);
            throw new Error('No order items');
        } else {
            // Optimistic stock check (Should really be done before payment, but flow is usually:
            // Build -> Checkout (Payment) -> Order Created.
            // OR Build -> check stock -> Payment -> Deduct Stock.
            // If payment succeeds but stock is gone, we have an issue.
            // For this task, we will deduct stock *after* order placement, assuming successful payment flow triggers this.
            // Wait, normally we Create Order -> Pay. OR Pay -> Create Order.
            // Requirement 5: "In test mode, on clicking success, place and confirm the order."
            // So we verify payment and then place/confirm order.

            // Let's create the order first as "Not Paid" and "Pending Stock Deduction"? 
            // Or just deduct immediately if we trust the flow.
            // Let's deduct stock here.

            await checkAndReduceStock(orderItems);

            const order = new Order({
                orderItems,
                user: req.user._id,
                shippingAddress,
                paymentMethod,
                itemsPrice,
                taxPrice,
                shippingPrice,
                totalPrice,
                isPaid: true, // Since we are simulating "Clicking success... place order"
                paidAt: Date.now(),
                status: 'Received'
            });

            const createdOrder = await order.save();

            res.status(201).json(createdOrder);
        }
    } catch (error) {
        console.error("Order Creation Error:", error);

        // Log to file for debugging
        const fs = require('fs');
        fs.appendFileSync('order_error.log', `${new Date().toISOString()} - ${error.message}\n${error.stack}\n\n`);

        res.status(400);
        throw new Error(error.message);
    }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate(
        'user',
        'name email'
    );

    if (order) {
        res.json(order);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Update order to paid (Razorpay Webhook or verify route)
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
    // This might be used if we separate Order Creation and Payment.
    const order = await Order.findById(req.params.id);

    if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.email_address,
        };

        const updatedOrder = await order.save();

        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.status = req.body.status;
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({}).populate('user', 'id name');
    res.json(orders);
});


// @desc    Create Razorpay Order
// @route   POST /api/orders/razorpay
// @access  Private
const createRazorpayOrder = asyncHandler(async (req, res) => {
    const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
        amount: req.body.amount * 100, // Amount in paise
        currency: 'INR',
        receipt: crypto.randomBytes(10).toString('hex'),
    };

    try {
        const response = await razorpay.orders.create(options);
        res.json({
            id: response.id,
            currency: response.currency,
            amount: response.amount,
        });
    } catch (error) {
        console.error(error);
        res.status(500);
        throw new Error('Razorpay Order Creation Failed');
    }
});


module.exports = {
    addOrderItems,
    getOrderById,
    updateOrderToPaid,
    updateOrderStatus,
    getMyOrders,
    getOrders,
    createRazorpayOrder,
};
