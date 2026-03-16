const { Pool } = require('pg');

const pool = new Pool({
    connectionString: `postgresql://postgres:password@localhost:5433/SHOPEASE`
});

pool.connect()
    .then(() => console.log('✅ Connected to ShopEase PostgreSQL database!'))
    .catch(err => console.error('❌ Connection error:', err.message));

module.exports = pool;