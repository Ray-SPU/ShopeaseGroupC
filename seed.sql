BEGIN;

-- Regions
INSERT INTO regions (region_name) VALUES
('North America'),
('South America'),
('Europe'),
('Asia'),
('Africa'),
('Oceania'),
('Antarctica'),
('Central America'),
('Caribbean'),
('Middle East');

-- Countries
INSERT INTO countries (country_name, region_id) VALUES
('United States', 1),
('Canada', 1),
('Mexico', 8),
('Brazil', 2),
('Argentina', 2),
('Chile', 2),
('Colombia', 2),
('Peru', 2),
('United Kingdom', 3),
('Germany', 3),
('France', 3),
('Italy', 3),
('Spain', 3),
('Norway', 3),
('Sweden', 3),
('Russia', 3),
('Iceland', 3),
('China', 4),
('India', 4),
('Japan', 4),
('South Korea', 4),
('Singapore', 4),
('Malaysia', 4),
('Thailand', 4),
('Vietnam', 4),
('Nigeria', 5),
('South Africa', 5),
('Egypt', 5),
('Kenya', 5),
('Morocco', 5),
('Ghana', 5),
('Australia', 6),
('New Zealand', 6),
('Fiji', 6),
('Costa Rica', 8),
('Panama', 8),
('Jamaica', 9),
('Trinidad and Tobago', 9),
('United Arab Emirates', 10),
('Saudi Arabia', 10),
('Israel', 10),
('Qatar', 10);

-- Categories
INSERT INTO categories (category_name, description) VALUES
('Electronics', 'Phones, laptops, accessories and consumer electronics'),
('Home Appliances', 'Kitchen and home electrical appliances'),
('Fashion', 'Clothing, shoes and accessories'),
('Beauty', 'Health, beauty, and personal care items'),
('Sports', 'Sports equipment and outdoor gear'),
('Toys', 'Toys, games and hobbies'),
('Books', 'Books, stationery and educational materials'),
('Furniture', 'Home and office furniture items'),
('Groceries', 'Packaged food and everyday groceries'),
('Automotive', 'Car accessories and automotive supplies');

-- Users
INSERT INTO users (first_name, last_name, email, phone, created_at)
SELECT
    'User' || g AS first_name,
    'Demo' || g AS last_name,
    format('user%03s@example.com', g) AS email,
    format('0700%04s', (floor(random() * 9000 + 1000))::int) AS phone,
    (current_date - ((100 - g) * INTERVAL '1 day'))::timestamp
FROM generate_series(1, 100) AS g;

-- Addresses
INSERT INTO addresses (user_id, country_id, street, city, postal_code, address_type)
SELECT
    u.user_id,
    c.country_id,
    'Street ' || (((u.user_id - 1) * 3) + gs) AS street,
    'City ' || (((u.user_id + gs) % 50) + 1) AS city,
    lpad(((floor(random() * 90000) + 10000)::int)::text, 5, '0') AS postal_code,
    CASE WHEN gs = 1 THEN 'shipping' WHEN gs = 2 THEN 'billing' ELSE 'other' END AS address_type
FROM users u
CROSS JOIN generate_series(1, 3) AS gs
JOIN LATERAL (
    SELECT country_id FROM countries ORDER BY random() LIMIT 1
) AS c ON TRUE;

-- Products
INSERT INTO products (item_type, unit_price, unit_cost, category_id)
SELECT
    'Product ' || lpad(g::text, 5, '0') AS item_type,
    price AS unit_price,
    round((price * (0.35 + random() * 0.45))::numeric, 2) AS unit_cost,
    ((g - 1) % 10) + 1 AS category_id
FROM (
    SELECT
        g,
        round((5 + random() * 495)::numeric, 2) AS price
    FROM generate_series(1, 10000) AS g
) AS product_prices;

-- Orders
INSERT INTO orders (order_id, user_id, country_id, shipping_address_id, billing_address_id, sales_channel, order_priority, order_date, ship_date, payment_method, order_status)
SELECT
    100000 + g AS order_id,
    ((g - 1) % 100) + 1 AS user_id,
    c.country_id AS country_id,
    s.address_id AS shipping_address_id,
    b.address_id AS billing_address_id,
    (ARRAY['Online', 'Retail', 'Mobile'])[(floor(random() * 3) + 1)::int] AS sales_channel,
    (ARRAY['L', 'M', 'H', 'C'])[(floor(random() * 4) + 1)::int] AS order_priority,
    d.order_date,
    (d.order_date + (floor(random() * 10) + 1) * INTERVAL '1 day')::date AS ship_date,
    (ARRAY['Credit Card', 'PayPal', 'Bank Transfer', 'Mobile Money'])[(floor(random() * 4) + 1)::int] AS payment_method,
    (ARRAY['Processing', 'Shipped', 'Delivered', 'Cancelled'])[(floor(random() * 4) + 1)::int] AS order_status
FROM generate_series(1, 700) AS g
CROSS JOIN LATERAL (
    SELECT (current_date - ((floor(random() * 365))::int) * INTERVAL '1 day')::date AS order_date
) AS d
CROSS JOIN LATERAL (
    SELECT country_id FROM countries ORDER BY random() LIMIT 1
) AS c
CROSS JOIN LATERAL (
    SELECT address_id FROM addresses WHERE user_id = ((g - 1) % 100) + 1 ORDER BY random() LIMIT 1
) AS s
CROSS JOIN LATERAL (
    SELECT address_id FROM addresses WHERE user_id = ((g - 1) % 100) + 1 ORDER BY random() LIMIT 1
) AS b;

-- Order items
INSERT INTO order_items (order_id, product_id, units_sold, unit_price, unit_cost, total_revenue, total_cost, total_profit)
SELECT
    o.order_id,
    p.product_id,
    q.units_sold,
    p.unit_price,
    p.unit_cost,
    round(q.units_sold * p.unit_price, 2) AS total_revenue,
    round(q.units_sold * p.unit_cost, 2) AS total_cost,
    round(q.units_sold * (p.unit_price - p.unit_cost), 2) AS total_profit
FROM orders o
CROSS JOIN generate_series(1, 3) AS item_num
CROSS JOIN LATERAL (
    SELECT product_id, unit_price, unit_cost FROM products ORDER BY random() LIMIT 1
) AS p
CROSS JOIN LATERAL (
    SELECT (floor(random() * 10) + 1)::int AS units_sold
) AS q;

COMMIT;