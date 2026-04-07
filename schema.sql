CREATE TABLE regions (
    region_id SERIAL PRIMARY KEY,
    region_name VARCHAR(100) NOT NULL
);

CREATE TABLE countries (
    country_id SERIAL PRIMARY KEY, 
    country_name VARCHAR(100) NOT NULL,
    region_id INT REFERENCES regions(region_id)
);

CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL,
    description TEXT
);

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(25),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE addresses (
    address_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    country_id INT REFERENCES countries(country_id),
    street VARCHAR(150),
    city VARCHAR(100),
    postal_code VARCHAR(20),
    address_type VARCHAR(20) DEFAULT 'shipping'
);

CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,
    item_type VARCHAR(100) NOT NULL,
    category_id INT REFERENCES categories(category_id),
    unit_price NUMERIC(10,2),
    unit_cost NUMERIC(10,2)
);

CREATE TABLE orders (
    order_id BIGINT PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    country_id INT REFERENCES countries(country_id),
    shipping_address_id INT REFERENCES addresses(address_id),
    billing_address_id INT REFERENCES addresses(address_id),
    sales_channel VARCHAR(20),
    order_priority CHAR(1),
    order_date DATE,
    ship_date DATE,
    payment_method VARCHAR(50),
    order_status VARCHAR(20)
);

CREATE TABLE order_items (
    item_id SERIAL PRIMARY KEY,
    order_id BIGINT REFERENCES orders(order_id),
    product_id INT REFERENCES products(product_id),
    units_sold INT,
    unit_price NUMERIC(10,2),
    unit_cost NUMERIC(10,2),
    total_revenue NUMERIC(12,2),
    total_cost NUMERIC(12,2),
    total_profit NUMERIC(12,2)
);