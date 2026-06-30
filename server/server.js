const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();

connectDB().then(async () => {
    const PizzaOption = require('./models/PizzaOption');
    const pizzaOptions = require('./data/pizzaOptions');
    const count = await PizzaOption.countDocuments();
    if (count === 0) {
        console.log('Pizza options collection is empty. Seeding...');
        await PizzaOption.insertMany(pizzaOptions);
        console.log('Auto-seeding completed.');
    }
});

const app = express();

app.use(express.json());

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

app.use(cors({
    origin: '*',
    credentials: false,
}));

app.get('/', (req, res) => {
    res.send('API is running...');
});

const authRoutes = require('./routes/authRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const orderRoutes = require('./routes/orderRoutes');

const { notFound, errorHandler } = require('./middleware/errorMiddleware');

app.use('/api/auth', authRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/orders', orderRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
