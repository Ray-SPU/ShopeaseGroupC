const express = require('express');
const router = express.Router();
const pool = require('../db');

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     description: Returns a list of all users in ShopEase
 *     responses:
 *       200:
 *         description: A list of users
 */
router.get('/', async (req, res) => {
    try {
        console.log('Users route called');
        const result = await pool.query(`
            SELECT user_id, first_name, last_name, email, phone, created_at
            FROM users
            ORDER BY created_at DESC
        `);
        console.log('Users query result:', result.rows.length);
        res.json(result.rows);
    } catch (err) {
        console.error('Users route error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     description: Returns a specific user with their addresses
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User details with addresses
 *       404:
 *         description: User not found
 */
router.get('/:id', async (req, res) => {
    try {
        const userId = req.params.id;

        // Get user details
        const userResult = await pool.query(`
            SELECT user_id, first_name, last_name, email, phone, created_at
            FROM users
            WHERE user_id = $1
        `, [userId]);

        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Get user addresses
        const addressesResult = await pool.query(`
            SELECT a.address_id, a.street, a.city, a.postal_code, a.address_type,
                   c.country_name, r.region_name
            FROM addresses a
            JOIN countries c ON c.country_id = a.country_id
            JOIN regions r ON r.region_id = c.region_id
            WHERE a.user_id = $1
        `, [userId]);

        const user = userResult.rows[0];
        user.addresses = addressesResult.rows;

        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;