const express = require('express');
require('dotenv').config();
require('./db');

const app = express();
app.use(express.json());

// Load routes first
const ordersRoute = require('./routes/orders');
const productsRoute = require('./routes/products');
const analyticsRoute = require('./routes/analytics');
const usersRoute = require('./routes/users');
const categoriesRoute = require('./routes/categories');
const addressesRoute = require('./routes/addresses');

console.log('Routes loaded successfully');

app.use('/api/orders', ordersRoute);
app.use('/api/products', productsRoute);
app.use('/api/analytics', analyticsRoute);
app.use('/api/users', usersRoute);
app.use('/api/categories', categoriesRoute);
app.use('/api/addresses', addressesRoute);

// Test route
app.get('/api/test', (req, res) => {
    res.json({ message: 'Test route works!' });
});

console.log('Routes mounted successfully');

// Swagger after API routes
const { specs, swaggerUi } = require('./swagger');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.get('/', (req, res) => {
    res.json({ message: '🛒 Welcome to ShopEase API!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 ShopEase API running on http://localhost:${PORT}`);
    console.log(`📚 Swagger docs available at http://localhost:${PORT}/api-docs`);
});