const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    orderItems: [
        {
            name: { type: String, required: true },
            quantity: { type: Number, required: true },
            image: { type: String },
            price: { type: Number, required: true },
            options: {
                base: { type: String },
                sauce: { type: String },
                cheese: { type: String },
                veggies: [{ type: String }],
                meat: [{ type: String }]
            } // For custom pizzas
        }
    ],
    shippingAddress: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true },
    },
    paymentMethod: { type: String, required: true },
    paymentResult: {
        id: { type: String },
        status: { type: String },
        update_time: { type: String },
        email_address: { type: String },
    },
    totalPrice: { type: Number, required: true, default: 0.0 },
    isPaid: { type: Boolean, required: true, default: false },
    paidAt: { type: Date },
    status: {
        type: String,
        required: true,
        default: 'Received',
        enum: ['Received', 'In Kitchen', 'Sent to Delivery', 'Delivered']
    },
}, {
    timestamps: true,
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
