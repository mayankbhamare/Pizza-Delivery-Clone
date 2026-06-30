const pizzaOptions = [
    // Bases
    { name: 'Thin Crust', category: 'base', price: 50, stock: 100, threshold: 20, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500' },
    { name: 'Thick Crust', category: 'base', price: 60, stock: 100, threshold: 20, image: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=500' },
    { name: 'Cheese Burst', category: 'base', price: 100, stock: 50, threshold: 20, image: 'https://images.unsplash.com/photo-1593504049359-74330189a345?w=500' },
    { name: 'Wheat Thin Crust', category: 'base', price: 70, stock: 80, threshold: 20, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500' },
    { name: 'Multigrain', category: 'base', price: 80, stock: 60, threshold: 20, image: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=500' },
    { name: 'Gluten Free', category: 'base', price: 120, stock: 40, threshold: 10, image: 'https://images.unsplash.com/photo-1554433607-66b5efe9d304?w=500' },

    // Sauces
    { name: 'Marinara', category: 'sauce', price: 20, stock: 200, threshold: 30, image: 'https://images.unsplash.com/photo-1572449043416-55f4685c9bb7?w=500' },
    { name: 'Pesto', category: 'sauce', price: 30, stock: 150, threshold: 30, image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=500' },
    { name: 'White Garlic', category: 'sauce', price: 25, stock: 150, threshold: 30, image: 'https://images.unsplash.com/photo-1607532941433-304659e8198a?w=500' },
    { name: 'BBQ', category: 'sauce', price: 25, stock: 180, threshold: 30, image: 'https://images.unsplash.com/photo-1623653387945-2fd25214f8fc?w=500' },
    { name: 'Buffalo', category: 'sauce', price: 25, stock: 180, threshold: 30, image: 'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?w=500' },
    { name: 'Peri Peri', category: 'sauce', price: 35, stock: 120, threshold: 30, image: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=500' },

    // Cheese
    { name: 'Mozzarella', category: 'cheese', price: 40, stock: 300, threshold: 50, image: 'https://images.unsplash.com/photo-1559561853-08451507cbe7?w=500' },
    { name: 'Cheddar', category: 'cheese', price: 45, stock: 200, threshold: 50, image: 'https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?w=500' },
    { name: 'Parmesan', category: 'cheese', price: 50, stock: 150, threshold: 50, image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=500' },
    { name: 'Gouda', category: 'cheese', price: 55, stock: 100, threshold: 50, image: 'https://images.unsplash.com/photo-1617470703128-26a0fc9af10f?w=500' },
    { name: 'Vegan Cheese', category: 'cheese', price: 60, stock: 80, threshold: 50, image: 'https://images.unsplash.com/photo-1518047601542-79f18c655718?w=500' },
    { name: 'Blue Cheese', category: 'cheese', price: 70, stock: 60, threshold: 20, image: 'https://images.unsplash.com/photo-1626957341926-98752fc2ba90?w=500' },

    // Veggies
    { name: 'Tomatoes', category: 'veggies', price: 10, stock: 500, threshold: 100, image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500' },
    { name: 'Onions', category: 'veggies', price: 10, stock: 500, threshold: 100, image: 'https://images.unsplash.com/photo-1508747703725-719777637510?w=500' },
    { name: 'Olives', category: 'veggies', price: 20, stock: 300, threshold: 100, image: 'https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?w=500' },
    { name: 'Mushrooms', category: 'veggies', price: 20, stock: 300, threshold: 100, image: 'https://images.unsplash.com/photo-1519623286359-e9f3cbef015b?w=500' },
    { name: 'Bell Peppers', category: 'veggies', price: 15, stock: 400, threshold: 100, image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=500' },
    { name: 'Jalapenos', category: 'veggies', price: 15, stock: 350, threshold: 100, image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500' },
    { name: 'Corn', category: 'veggies', price: 10, stock: 450, threshold: 100, image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=500' },
    { name: 'Spinach', category: 'veggies', price: 15, stock: 200, threshold: 50, image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500' },
    { name: 'Pineapple', category: 'veggies', price: 25, stock: 150, threshold: 40, image: 'https://images.unsplash.com/photo-1490885578174-acda8905c2c6?w=500' },
    { name: 'Broccoli', category: 'veggies', price: 20, stock: 180, threshold: 40, image: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=500' },
    { name: 'Red Chilies', category: 'veggies', price: 10, stock: 300, threshold: 100, image: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=500' },
    { name: 'Zucchini', category: 'veggies', price: 20, stock: 200, threshold: 50, image: 'https://images.unsplash.com/photo-1557844352-761f2565b576?w=500' },

    // Meat
    { name: 'Pepperoni', category: 'meat', price: 50, stock: 200, threshold: 40, image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500' },
    { name: 'Chicken', category: 'meat', price: 40, stock: 250, threshold: 40, image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=500' },
    { name: 'Bacon', category: 'meat', price: 60, stock: 150, threshold: 40, image: 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=500' },
    { name: 'Sausage', category: 'meat', price: 45, stock: 200, threshold: 40, image: 'https://images.unsplash.com/photo-1544681280-d25a782adc9b?w=500' },
    { name: 'Ham', category: 'meat', price: 40, stock: 200, threshold: 40, image: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=500' },
    { name: 'Salami', category: 'meat', price: 55, stock: 180, threshold: 40, image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=500' },
];

module.exports = pizzaOptions;

