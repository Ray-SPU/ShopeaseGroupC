const express = require('express');
const router = express.Router();
const pool = require('../db');

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories
 *     description: Returns a list of all product categories in ShopEase
 *     responses:
 *       200:
 *         description: A list of categories
 */
router.get('/', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT category_id, category_name, description
            FROM categories
            ORDER BY category_name
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Get category by ID
 *     description: Returns a specific category with its products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Category details with products
 *       404:
 *         description: Category not found
 */
router.get('/:id', async (req, res) => {
    try {
        const categoryId = req.params.id;

        // Get category details
        const categoryResult = await pool.query(`
            SELECT category_id, category_name, description
            FROM categories
            WHERE category_id = $1
        `, [categoryId]);

        if (categoryResult.rows.length === 0) {
            return res.status(404).json({ error: 'Category not found' });
        }

        // Get products in this category
        const productsResult = await pool.query(`
            SELECT product_id, item_type, unit_price, unit_cost
            FROM products
            WHERE category_id = $1
            ORDER BY item_type
        `, [categoryId]);

        const category = categoryResult.rows[0];
        category.products = productsResult.rows;

        res.json(category);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;