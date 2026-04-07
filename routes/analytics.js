const express = require('express');
const router = express.Router();
const pool = require('../db');

/**
 * @swagger
 * /api/analytics/top-regions:
 *   get:
 *     summary: Get top regions by revenue
 *     description: Returns total revenue grouped by region
 *     responses:
 *       200:
 *         description: A list of regions with total revenue
 */
router.get('/top-regions', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT r.region_name,
                   SUM(oi.total_revenue) AS total_revenue,
                   SUM(oi.total_profit) AS total_profit,
                   COUNT(DISTINCT o.order_id) AS total_orders
            FROM order_items oi
            JOIN orders o ON o.order_id = oi.order_id
            JOIN countries c ON c.country_id = o.country_id
            JOIN regions r ON r.region_id = c.region_id
            GROUP BY r.region_name
            ORDER BY total_revenue DESC
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /api/analytics/top-products:
 *   get:
 *     summary: Get top products by profit
 *     description: Returns total units sold and profit grouped by product
 *     responses:
 *       200:
 *         description: A list of products with total profit
 */
router.get('/top-products', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT p.item_type,
                   c.category_name,
                   SUM(oi.units_sold) AS total_units_sold,
                   SUM(oi.total_revenue) AS total_revenue,
                   SUM(oi.total_profit) AS total_profit
            FROM order_items oi
            JOIN products p ON p.product_id = oi.product_id
            LEFT JOIN categories c ON c.category_id = p.category_id
            GROUP BY p.product_id, p.item_type, c.category_name
            ORDER BY total_profit DESC
            LIMIT 20
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /api/analytics/top-customers:
 *   get:
 *     summary: Get top customers by total spending
 *     description: Returns customers with highest total revenue
 *     responses:
 *       200:
 *         description: A list of top customers
 */
router.get('/top-customers', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT u.first_name, u.last_name, u.email,
                   COUNT(DISTINCT o.order_id) AS total_orders,
                   SUM(oi.total_revenue) AS total_spent,
                   SUM(oi.total_profit) AS total_profit_generated,
                   MAX(o.order_date) AS last_order_date
            FROM users u
            JOIN orders o ON o.user_id = u.user_id
            JOIN order_items oi ON oi.order_id = o.order_id
            GROUP BY u.user_id, u.first_name, u.last_name, u.email
            ORDER BY total_spent DESC
            LIMIT 20
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /api/analytics/sales-by-category:
 *   get:
 *     summary: Get sales performance by product category
 *     description: Returns revenue and profit by category
 *     responses:
 *       200:
 *         description: Sales data by category
 */
router.get('/sales-by-category', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT c.category_name,
                   COUNT(DISTINCT p.product_id) AS total_products,
                   SUM(oi.units_sold) AS total_units_sold,
                   SUM(oi.total_revenue) AS total_revenue,
                   SUM(oi.total_profit) AS total_profit
            FROM categories c
            JOIN products p ON p.category_id = c.category_id
            JOIN order_items oi ON oi.product_id = p.product_id
            GROUP BY c.category_id, c.category_name
            ORDER BY total_revenue DESC
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /api/analytics/monthly-revenue:
 *   get:
 *     summary: Get monthly revenue trends
 *     description: Returns revenue data grouped by month
 *     responses:
 *       200:
 *         description: Monthly revenue data
 */
router.get('/monthly-revenue', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                DATE_TRUNC('month', o.order_date) AS month,
                COUNT(DISTINCT o.order_id) AS total_orders,
                SUM(oi.total_revenue) AS total_revenue,
                SUM(oi.total_profit) AS total_profit,
                AVG(oi.total_revenue) AS avg_order_value
            FROM orders o
            JOIN order_items oi ON oi.order_id = o.order_id
            GROUP BY DATE_TRUNC('month', o.order_date)
            ORDER BY month DESC
            LIMIT 12
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;