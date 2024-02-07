CREATE TABLE zomato_restaurant_metrics (
    restaurant_id VARCHAR(255),
    restaurant_name VARCHAR(255),
    created_at timestamp,
    updated_at timestamp,
    area_name VARCHAR(255),
    city VARCHAR(25),
    address VARCHAR(255),
    latitude VARCHAR(50),
    longitude VARCHAR(50),
    active_since VARCHAR(50),
    delivery_rating FLOAT,
    delivery_reviews_count INTEGER,
    dining_rating FLOAT,
    dining_reviews_count INTEGER,
    cuisines TEXT[],
    current_status VARCHAR(10)
);

CREATE TABLE zomato_restaurant_metrics_logs (
    restaurant_id VARCHAR(255),
    restaurant_name VARCHAR(255),
    created_at timestamp,
    updated_at timestamp,
    area_name VARCHAR(255),
    city VARCHAR(25),
    address VARCHAR(255),
    latitude VARCHAR(50),
    longitude VARCHAR(50),
    active_since VARCHAR(50),
    delivery_rating FLOAT,
    delivery_reviews_count INTEGER,
    dining_rating FLOAT,
    dining_reviews_count INTEGER,
    cuisines TEXT[],
    current_status VARCHAR(10)
);

CREATE TABLE zomato_restaurant_reviews (
    id SERIAL not null PRIMARY KEY,
    order_id VARCHAR(25),
    restaurant_id VARCHAR(25),
    created_at timestamp,
    updated_at timestamp,
    review_date VARCHAR(20),
    review_type VARCHAR(10),
    rating INTEGER,
    review_text VARCHAR(2000),
    tags TEXT[],
    is_responded BOOLEAN
);

CREATE TABLE zomato_item_reviews(
    id SERIAL not null PRIMARY KEY,
    order_id VARCHAR(25),
    restaurant_id VARCHAR(25),
    created_at timestamp,
    updated_at timestamp,
    item_name VARCHAR(20),
    review_date VARCHAR(20),
    review_type VARCHAR(20),
    item_rating INTEGER,
    item_review VARCHAR(2000)
);

CREATE TABLE zomato_order_item_metrics(
    id SERIAL not null PRIMARY KEY,
    order_id VARCHAR(25),
    restaurant_id VARCHAR(50),
    created_at timestamp,
    updated_at timestamp,  
    item TEXT,
    quantity INTEGER,
    price FLOAT
);

CREATE TABLE zomato_order_metrics (
    order_id BIGINT,	
	restaurant_id BIGINT,
	created_at timestamp,
	updated_at timestamp,
    order_placed_at timestamp,
    order_status VARCHAR(50),
    order_type VARCHAR(50),
    payment_method VARCHAR(50),
    bill_amount DECIMAL(10, 2),
    rejection_details VARCHAR(500),
    order_ready_marked VARCHAR(50),
    rating DECIMAL(3, 1),
    customer_id VARCHAR(255),
    customer_phone_number DECIMAL(10, 2),
    time_placed VARCHAR(30),
    time_accepted VARCHAR(30),
    time_delivery_partner_arrived VARCHAR(30),
    time_ready VARCHAR(30),
    time_picked_up VARCHAR(30),
    time_delivered VARCHAR(30),
    customer_name VARCHAR(50),
    orders_placed_till_date INT,
    locality VARCHAR(255),
    locality_distance_km INT,
    locality_travel_time_min INT,
    item_total INT,
    taxes DECIMAL(10, 2),
	promo DECIMAL(10, 2)
);

CREATE TABLE zomato_restaurant_timings (
    restaurant_id VARCHAR(25),
    created_at timestamp,
    updated_at timestamp,
    day_of_the_week VARCHAR(25),
    start_time VARCHAR(25),
    end_time VARCHAR(25),
    status BOOLEAN
);

CREATE TABLE zomato_daily_metrics (
    id SERIAL not null PRIMARY KEY,
	restaurant_id VARCHAR(50),
    created_at VARCHAR(50),
    updated_at VARCHAR(50),
    business_date DATE,
    offline_hours FLOAT,
    impressions INT,
    menu_opens INT,
    cart_builds INT,
    placed_orders INT,
    repeat_customers FLOAT,
    new_customers FLOAT,
    sales_from_offers FLOAT,
    impressions_from_ads INT,
    customer_complaints FLOAT
);

create table zomato_orders_month_track (
	restaurant_id BIGINT,
	month INT,
	year INT
);