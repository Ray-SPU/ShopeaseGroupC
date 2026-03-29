const swaggerJsDoc = require('swagger-Jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'ShopEase API',
            version: '1.0.0',
            description: 'ShopEase E-commerce API Documentation',
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Local Development Server',
            },
        ],
    },
    apis:['./routes/*.js', './server.js'],
};

const specs = swaggerJsDoc(options);

module.exports = { specs, swaggerUi};