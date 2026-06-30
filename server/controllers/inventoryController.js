const asyncHandler = require('express-async-handler');
const PizzaOption = require('../models/PizzaOption');
const sendEmail = require('../utils/sendEmail');

// @desc    Fetch all pizza options
// @route   GET /api/inventory
// @access  Public
const getInventory = asyncHandler(async (req, res) => {
    const options = await PizzaOption.find({});
    res.json(options);
});

// @desc    Create a pizza option
// @route   POST /api/inventory
// @access  Private/Admin
const addInventoryItem = asyncHandler(async (req, res) => {
    const { name, category, price, stock, threshold } = req.body;

    const item = new PizzaOption({
        name,
        category,
        price,
        stock,
        threshold,
    });

    const createdItem = await item.save();
    res.status(201).json(createdItem);
});

// @desc    Update a pizza option
// @route   PUT /api/inventory/:id
// @access  Private/Admin
const updateInventoryItem = asyncHandler(async (req, res) => {
    const { name, category, price, stock, threshold } = req.body;
    const item = await PizzaOption.findById(req.params.id);

    if (item) {
        item.name = name;
        item.category = category;
        item.price = price;
        item.stock = stock;
        item.threshold = threshold;

        // Check stock threshold
        if (item.stock >= item.threshold) {
            item.isLowStockAlertSent = false;
        } else if (item.stock < item.threshold && !item.isLowStockAlertSent) {
            try {
                // Send to the "Admin" email (from env or hardcoded/user-settings if we had them)
                // In a real app, you'd probably query User.findOne({ isAdmin: true })
                await sendEmail({
                    email: process.env.EMAIL_USER,
                    subject: `Low Stock Alert: ${item.name}`,
                    message: `The stock for ${item.name} is low (${item.stock}). Please restock immediately.`,
                });
                item.isLowStockAlertSent = true;
            } catch (error) {
                console.error("Failed to send low stock email", error);
                // Don't block the update if email fails
            }
        }

        const updatedItem = await item.save();
        res.json(updatedItem);
    } else {
        res.status(404);
        throw new Error('Item not found');
    }
});

// @desc    Delete a pizza option
// @route   DELETE /api/inventory/:id
// @access  Private/Admin
const deleteInventoryItem = asyncHandler(async (req, res) => {
    const item = await PizzaOption.findById(req.params.id);

    if (item) {
        await item.deleteOne();
        res.json({ message: 'Item removed' });
    } else {
        res.status(404);
        throw new Error('Item not found');
    }
});

module.exports = {
    getInventory,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
};
