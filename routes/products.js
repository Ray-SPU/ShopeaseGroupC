const express = require('express');
const router = express.Router();
const pool = require('../db');

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     description: Returns a list of all product types in ShopEase
 *     responses:
 *       200:
 *         description: A list of products
 */
router.get('/', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT product_id, item_type, unit_price, unit_cost
            FROM products
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;