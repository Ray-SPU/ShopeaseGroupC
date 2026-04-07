const express = require('express');
const router = express.Router();
const pool = require('../db');

/**
 * @swagger
 * /api/addresses:
 *   get:
 *     summary: Get all addresses
 *     description: Returns a list of all addresses in ShopEase
 *     responses:
 *       200:
 *         description: A list of addresses
 */
router.get('/', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT a.address_id, a.street, a.city, a.postal_code, a.address_type,
                   u.first_name, u.last_name, u.email,
                   c.country_name, r.region_name
            FROM addresses a
            JOIN users u ON u.user_id = a.user_id
            JOIN countries c ON c.country_id = a.country_id
            JOIN regions r ON r.region_id = c.region_id
            ORDER BY a.address_id
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /api/addresses/{id}:
 *   get:
 *     summary: Get address by ID
 *     description: Returns a specific address with user and location details
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Address details
 *       404:
 *         description: Address not found
 */
router.get('/:id', async (req, res) => {
    try {
        const addressId = req.params.id;

        const result = await pool.query(`
            SELECT a.address_id, a.street, a.city, a.postal_code, a.address_type,
                   u.user_id, u.first_name, u.last_name, u.email,
                   c.country_name, r.region_name
            FROM addresses a
            JOIN users u ON u.user_id = a.user_id
            JOIN countries c ON c.country_id = a.country_id
            JOIN regions r ON r.region_id = c.region_id
            WHERE a.address_id = $1
        `, [addressId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Address not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;