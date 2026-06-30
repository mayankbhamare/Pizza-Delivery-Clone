const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const API_URL = 'http://localhost:5000/api';

const testOrderFlow = async () => {
    try {
        // 1. Login to get token (assuming a user exists, if not we need to register one)
        // We'll use a hardcoded credential or try to find one. 
        // For this script, let's assume the user from 'makeAdmin' exists.
        // I'll try to login with a known test account or just fail and ask to register manually.
        // BETTER: Use the database directly to get a user and generate a token, bypassing login?
        // No, let's test the endpoint as a client.

        // Let's assume we can use the user we just made admin.
        // Wait, I don't know their password. 
        // Strategy: Create a NEW user for testing purposes.

        const testUser = {
            name: 'Test User',
            email: `testorder_${Date.now()}@example.com`,
            password: 'password123'
        };

        console.log('1. Registering new test user...');
        let token;
        try {
            const regRes = await axios.post(`${API_URL}/auth/register`, testUser);
            token = regRes.data.token;
            console.log('   Registration successful. Token received.');
        } catch (e) {
            console.log('   Registration failed (maybe exists). Trying login...');
            const loginRes = await axios.post(`${API_URL}/auth/login`, { email: testUser.email, password: testUser.password });
            token = loginRes.data.token;
            console.log('   Login successful.');
        }

        // 2. Fetch Inventory to get an item ID
        console.log('2. Fetching Inventory...');
        const invRes = await axios.get(`${API_URL}/inventory`);
        if (invRes.data.length === 0) throw new Error('Inventory is empty');
        const pizzaItem = invRes.data[0]; // Thin Crust or something
        console.log(`   Found item: ${pizzaItem.name} (${pizzaItem._id})`);

        // 3. Place Order
        console.log('3. Placing Order...');
        const orderPayload = {
            orderItems: [{
                name: 'Test Pizza',
                quantity: 1,
                price: 500,
                image: '',
                options: {
                    base: pizzaItem.name,
                    sauce: 'Test Sauce',
                    cheese: 'Test Cheese',
                    veggies: ['Test Veggie'],
                    meat: []
                }
            }],
            shippingAddress: {
                address: '123 Test St',
                city: 'Testville',
                postalCode: '12345',
                country: 'Testland'
            },
            paymentMethod: 'Test',
            totalPrice: 500,
            itemsPrice: 500,
            taxPrice: 0,
            shippingPrice: 0
        };

        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };

        const orderRes = await axios.post(`${API_URL}/orders`, orderPayload, config);
        console.log('   Order Placed Successfully!', orderRes.data._id);

    } catch (error) {
        if (error.response) {
            console.log('TEST FAILED Status:', error.response.status);
            console.log('TEST FAILED Data:', error.response.data);
        } else {
            console.error('TEST FAILED Message:', error.message);
        }
    }
};

testOrderFlow();
