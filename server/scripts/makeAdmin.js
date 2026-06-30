const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');
const connectDB = require('../config/db');

// Load env vars from parent directory (server/.env)
dotenv.config({ path: path.join(__dirname, '../.env') });

const createAdmin = async () => {
    try {
        await connectDB();

        const adminEmail = 'admin@pizza.com';
        const adminPassword = 'admin123';

        let user = await User.findOne({ email: adminEmail });

        if (user) {
            user.role = 'admin';
            user.isAdmin = true;
            // user.password = adminPassword; // Ideally hash this if we were setting it, but schema pre-save handles hashing on modification. 
            // To reset password, we just set it.
            user.password = adminPassword;
            await user.save();
            console.log(`Admin user updated: ${adminEmail} (Password: ${adminPassword})`);
        } else {
            user = await User.create({
                name: 'Admin User',
                email: adminEmail,
                password: adminPassword,
                role: 'admin',
                isAdmin: true,
                isVerified: true
            });
            console.log(`Admin user created: ${adminEmail} (Password: ${adminPassword})`);
        }

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

createAdmin();
