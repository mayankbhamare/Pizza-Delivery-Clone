const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const PizzaOption = require('./models/PizzaOption');
const connectDB = require('./config/db');
const pizzaOptions = require('./data/pizzaOptions');
const usersData = require('./data/users');

dotenv.config();

const setup = async () => {
    try {
        await connectDB();

        console.log('--- Cleaning Database ---');
        await PizzaOption.deleteMany();

        await User.deleteMany();
        console.log('Database cleaned.');

        console.log('--- Seeding Pizza Options ---');
        await PizzaOption.insertMany(pizzaOptions);
        console.log(`${pizzaOptions.length} pizza options imported.`);

        console.log('--- Seeding Users ---');

        const specialUser = {
            name: 'Mayank Bhamare',
            email: 'mayankbhamare8@gmail.com',
            password: 'Pizza....',
            isAdmin: true,
            isVerified: true
        };

        const allUsers = [specialUser, ...usersData];


        for (const u of allUsers) {
            const exists = await User.findOne({ email: u.email });
            if (!exists) {
                await User.create(u);
                console.log(`User created: ${u.email}`);
            } else {
                console.log(`User already exists: ${u.email}`);
            }
        }

        console.log('Setup completed successfully!');
        process.exit();
    } catch (error) {
        console.error('Setup failed:', error);
        process.exit(1);
    }
};

setup();
