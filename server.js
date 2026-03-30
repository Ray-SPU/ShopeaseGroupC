const express = require('express');
require('dotenv').config();
require('./db');

const { specs, swaggerUi } = require('./swagger');

const app = express();
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.get('/', (req, res) => {
    res.json({ message: '🛒 Welcome to ShopEase API!' });
});

const ordersRoute = require('./routes/orders');
const productsRoute = require('./routes/products');
const analyticsRoute = require('./routes/analytics');

app.use('/api/orders', ordersRoute);
app.use('/api/products', productsRoute);
app.use('/api/analytics', analyticsRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 ShopEase API running on http://localhost:${PORT}`);
});