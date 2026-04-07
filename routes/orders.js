const express = require('express');
const router = express.Router();
const pool = require('../db');

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get all orders
 *     description: Returns a list of the first 20 orders in ShopEase with user and address details
 *     responses:
 *       200:
 *         description: A list of orders
 */
router.get('/', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT o.order_id, o.sales_channel, o.order_priority, o.order_date, o.ship_date,
                   o.payment_method, o.order_status,
                   u.first_name, u.last_name, u.email,
                   c.country_name, r.region_name,
                   sa.street as shipping_street, sa.city as shipping_city,
                   ba.street as billing_street, ba.city as billing_city
            FROM orders o
            JOIN users u ON u.user_id = o.user_id
            JOIN countries c ON c.country_id = o.country_id
            JOIN regions r ON r.region_id = c.region_id
            LEFT JOIN addresses sa ON sa.address_id = o.shipping_address_id
            LEFT JOIN addresses ba ON ba.address_id = o.billing_address_id
            ORDER BY o.order_date DESC
            LIMIT 20
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get order by ID
 *     description: Returns a specific order with all details and order items
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Order details with items
 *       404:
 *         description: Order not found
 */
router.get('/:id', async (req, res) => {
    try {
        const orderId = req.params.id;

        // Get order details
        const orderResult = await pool.query(`
            SELECT o.order_id, o.sales_channel, o.order_priority, o.order_date, o.ship_date,
                   o.payment_method, o.order_status,
                   u.first_name, u.last_name, u.email,
                   c.country_name, r.region_name,
                   sa.street as shipping_street, sa.city as shipping_city, sa.postal_code as shipping_postal,
                   ba.street as billing_street, ba.city as billing_city, ba.postal_code as billing_postal
            FROM orders o
            JOIN users u ON u.user_id = o.user_id
            JOIN countries c ON c.country_id = o.country_id
            JOIN regions r ON r.region_id = c.region_id
            LEFT JOIN addresses sa ON sa.address_id = o.shipping_address_id
            LEFT JOIN addresses ba ON ba.address_id = o.billing_address_id
            WHERE o.order_id = $1
        `, [orderId]);

        if (orderResult.rows.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Get order items
        const itemsResult = await pool.query(`
            SELECT oi.units_sold, oi.unit_price, oi.unit_cost, oi.total_revenue, oi.total_cost, oi.total_profit,
                   p.item_type, cat.category_name
            FROM order_items oi
            JOIN products p ON p.product_id = oi.product_id
            LEFT JOIN categories cat ON cat.category_id = p.category_id
            WHERE oi.order_id = $1
            ORDER BY oi.item_id
        `, [orderId]);

        const order = orderResult.rows[0];
        order.items = itemsResult.rows;

        res.json(order);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;