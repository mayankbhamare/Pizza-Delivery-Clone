const mongoose = require('mongoose');

const pizzaOptionSchema = mongoose.Schema({
    name: { type: String, required: true },
    category: {
        type: String,
        required: true,
        enum: ['base', 'sauce', 'cheese', 'veggies', 'meat']
    },
    price: { type: Number, required: true, default: 0 },
    stock: { type: Number, required: true, default: 0 },
    threshold: { type: Number, required: true, default: 10 }, // For low stock alert
    isLowStockAlertSent: { type: Boolean, default: false },
    image: { type: String }
}, {
    timestamps: true,
});

const PizzaOption = mongoose.model('PizzaOption', pizzaOptionSchema);
module.exports = PizzaOption;
