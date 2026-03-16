const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT o.order_id, c.country_name, o.sales_channel, 
                   o.order_priority, o.order_date, o.ship_date
            FROM orders o
            JOIN countries c ON c.country_id = o.country_id
            LIMIT 20
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;