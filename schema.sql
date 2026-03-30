CREATE TABLE regions (
    region_id SERIAL PRIMARY KEY,
    region_name VARCHAR(100) NOT NULL
);

CREATE TABLE countries (
    country_id SERIAL PRIMARY KEY,
    country_name VARCHAR(100) NOT NULL,
    region_id INT REFERENCES regions(region_id)
);

CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,
    item_type VARCHAR(100) NOT NULL,
    unit_price NUMERIC(10,2),
    unit_cost NUMERIC(10,2)
);

CREATE TABLE orders (
    order_id BIGINT PRIMARY KEY,
    country_id INT REFERENCES countries(country_id),
    sales_channel VARCHAR(20),
    order_priority CHAR(1),
    order_date DATE,
    ship_date DATE
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