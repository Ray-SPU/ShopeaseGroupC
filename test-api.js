const axios = require('axios');

async function testAPI() {
    const baseURL = 'http://localhost:3000/api';

    try {
        console.log('Testing API endpoints...\n');

        // Test analytics endpoints
        console.log('1. Testing /analytics/top-regions');
        const regions = await axios.get(`${baseURL}/analytics/top-regions`);
        console.log(`   ✅ Found ${regions.data.length} regions`);
        console.log(`   Top region: ${regions.data[0]?.region_name} - $${regions.data[0]?.total_revenue?.toLocaleString()}\n`);

        console.log('2. Testing /analytics/top-products');
        const products = await axios.get(`${baseURL}/analytics/top-products`);
        console.log(`   ✅ Found ${products.data.length} products`);
        console.log(`   Top product: ${products.data[0]?.item_type} - $${products.data[0]?.total_profit?.toLocaleString()} profit\n`);

        console.log('3. Testing /analytics/top-customers');
        const customers = await axios.get(`${baseURL}/analytics/top-customers`);
        console.log(`   ✅ Found ${customers.data.length} customers`);
        console.log(`   Top customer: ${customers.data[0]?.first_name} ${customers.data[0]?.last_name} - $${customers.data[0]?.total_spent?.toLocaleString()}\n`);

        // Test new endpoints
        console.log('4. Testing /users');
        const users = await axios.get(`${baseURL}/users`);
        console.log(`   ✅ Found ${users.data.length} users\n`);

        console.log('5. Testing /categories');
        const categories = await axios.get(`${baseURL}/categories`);
        console.log(`   ✅ Found ${categories.data.length} categories\n`);

        console.log('6. Testing /addresses');
        const addresses = await axios.get(`${baseURL}/addresses`);
        console.log(`   ✅ Found ${addresses.data.length} addresses\n`);

        console.log('7. Testing /products');
        const allProducts = await axios.get(`${baseURL}/products`);
        console.log(`   ✅ Found ${allProducts.data.length} products\n`);

        console.log('8. Testing /orders');
        const orders = await axios.get(`${baseURL}/orders`);
        console.log(`   ✅ Found ${orders.data.length} orders\n`);

        console.log('🎉 All API endpoints are working correctly!');

    } catch (error) {
        console.error('❌ API test failed:', error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        }
    }
}

testAPI();