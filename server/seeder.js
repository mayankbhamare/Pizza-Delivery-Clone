const mongoose = require('mongoose');
const dotenv = require('dotenv');
const users = require('./data/users');
const pizzaOptions = require('./data/pizzaOptions');
const User = require('./models/User');
const PizzaOption = require('./models/PizzaOption');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const importData = async () => {
    try {
        await User.deleteMany();
        await PizzaOption.deleteMany();

        // await User.insertMany(users); // insertMany doesn't hash passwords!

        // Loop and create users to trigger pre-save hook
        for (const user of users) {
            await User.create(user);
        }

        console.log('Users Imported!');

        await PizzaOption.insertMany(pizzaOptions);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await User.deleteMany();
        await PizzaOption.deleteMany();

        console.log('Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
