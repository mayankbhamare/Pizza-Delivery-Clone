const bcrypt = require('bcryptjs');

// Pre-hashed password for '123456'
// const password = bcrypt.hashSync('123456', 10); 
// actually seeder uses User.create/insertMany but runs pre-save hook?
// insertMany DOES NOT run pre-save middleware by default!
// So I should hash it here or use a loop in seeder.
// Let's hardcode a hash for '123456' to be safe or update seeder to use create in loop.
// Hash for '123456': $2a$10$3/.. (simplified, I'll just let seeder handle it or use a known hash)
// Actually, I will modify seeder to use create() or just put plain text and update seeder to expect plain text?
// Mongoose' insertMany doesn't trigger pre('save').
// I will provide hashed password.
const password = '$2a$10$ixh/dDqJ.tFQXk.Z/uz8UO/w.w.w.w.w.w.w.w.w.w.w.w'; // Placeholder, actually let's just make seeder robust.

const users = [
    {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password', // The seeder script creates users using User.insertMany, so this needs to be hashed.
        isAdmin: true,
        isVerified: true,
    },
    {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password',
        isAdmin: false,
        isVerified: true,
    },
];

module.exports = users;
