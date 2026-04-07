const fs = require('fs');
const path = require('path');
const pool = require('./db');

async function loadSeedData() {
    try {
        console.log('Loading seed data...');

        // Read the seed.sql file
        const seedSQL = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf8');

        // Split by semicolon and execute each statement
        const statements = seedSQL.split(';').filter(stmt => stmt.trim().length > 0);

        for (let i = 0; i < statements.length; i++) {
            const statement = statements[i].trim();
            if (statement) {
                console.log(`Executing statement ${i + 1}/${statements.length}...`);
                await pool.query(statement);
            }
        }

        console.log('✅ Seed data loaded successfully!');

        // Verify data was loaded
        const regions = await pool.query('SELECT COUNT(*) as count FROM regions');
        const countries = await pool.query('SELECT COUNT(*) as count FROM countries');
        const users = await pool.query('SELECT COUNT(*) as count FROM users');
        const products = await pool.query('SELECT COUNT(*) as count FROM products');
        const orders = await pool.query('SELECT COUNT(*) as count FROM orders');

        console.log(`📊 Database summary:`);
        console.log(`   Regions: ${regions.rows[0].count}`);
        console.log(`   Countries: ${countries.rows[0].count}`);
        console.log(`   Users: ${users.rows[0].count}`);
        console.log(`   Products: ${products.rows[0].count}`);
        console.log(`   Orders: ${orders.rows[0].count}`);

    } catch (error) {
        console.error('❌ Error loading seed data:', error);
    } finally {
        pool.end();
    }
}

loadSeedData();