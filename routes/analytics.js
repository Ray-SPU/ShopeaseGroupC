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
                   SUM(oi.total_revenue) AS total_revenue
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
                   SUM(oi.units_sold) AS total_units_sold,
                   SUM(oi.total_profit) AS total_profit
            FROM order_items oi
            JOIN products p ON p.product_id = oi.product_id
            GROUP BY p.item_type
            ORDER BY total_profit DESC
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;