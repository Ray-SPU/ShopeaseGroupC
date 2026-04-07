const express = require('express');
const router = express.Router();
const pool = require('../db');

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     description: Returns a list of all products in ShopEase with category information
 *     responses:
 *       200:
 *         description: A list of products
 */
router.get('/', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT p.product_id, p.item_type, p.unit_price, p.unit_cost,
                   c.category_name, c.description as category_description
            FROM products p
            LEFT JOIN categories c ON c.category_id = p.category_id
            ORDER BY p.product_id
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get product by ID
 *     description: Returns a specific product with category and sales information
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product details with sales data
 *       404:
 *         description: Product not found
 */
router.get('/:id', async (req, res) => {
    try {
        const productId = req.params.id;

        // Get product details
        const productResult = await pool.query(`
            SELECT p.product_id, p.item_type, p.unit_price, p.unit_cost,
                   c.category_name, c.description as category_description
            FROM products p
            LEFT JOIN categories c ON c.category_id = p.category_id
            WHERE p.product_id = $1
        `, [productId]);

        if (productResult.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Get sales statistics for this product
        const salesResult = await pool.query(`
            SELECT
                COUNT(DISTINCT oi.order_id) as total_orders,
                SUM(oi.units_sold) as total_units_sold,
                SUM(oi.total_revenue) as total_revenue,
                SUM(oi.total_profit) as total_profit
            FROM order_items oi
            WHERE oi.product_id = $1
        `, [productId]);

        const product = productResult.rows[0];
        product.sales_stats = salesResult.rows[0];

        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;