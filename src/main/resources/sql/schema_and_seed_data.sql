-- =====================================================================
-- TravelMate – Smart Tourist Day-Visit Planner
-- University of Moratuwa - ITE2953 Final Project
-- Student: Rukshana Roshan (E2410132)
-- Database: travel_mate_db (MySQL 8.0)
-- =====================================================================

CREATE DATABASE IF NOT EXISTS travel_mate_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE travel_mate_db;

-- ---------------------------------------------------------------------
-- 1. users
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'TOURIST',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------------------
-- 2. categories
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    icon VARCHAR(255),
    description VARCHAR(500),
    image_url TEXT,
    color VARCHAR(30) DEFAULT '#f2542d',
    is_featured BOOLEAN DEFAULT FALSE
);

-- ---------------------------------------------------------------------
-- 3. attractions
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS attractions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    category_id BIGINT NOT NULL,
    description VARCHAR(2000),
    location VARCHAR(200),
    distance_km DOUBLE NOT NULL,
    duration_minutes INT,
    opening_hours VARCHAR(100),
    entrance_fee DECIMAL(10,2) DEFAULT 0.00,
    latitude DOUBLE NOT NULL,
    longitude DOUBLE NOT NULL,
    image_url VARCHAR(500),
    google_maps_url VARCHAR(500),
    average_rating DOUBLE DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_attraction_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- ---------------------------------------------------------------------
-- 4. itinerary
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS itinerary (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NULL,
    plan_name VARCHAR(150),
    visit_date DATE,
    start_time VARCHAR(20) DEFAULT '09:00 AM',
    end_time VARCHAR(20) DEFAULT '06:00 PM',
    travel_mode VARCHAR(20) DEFAULT 'car',
    total_distance_km DOUBLE DEFAULT 0,
    total_duration_minutes INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_itinerary_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- ---------------------------------------------------------------------
-- 5. itinerary_items
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS itinerary_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    itinerary_id BIGINT NOT NULL,
    attraction_id BIGINT NOT NULL,
    visit_order INT NOT NULL,
    planned_start_time VARCHAR(20),
    planned_end_time VARCHAR(20),
    travel_time_minutes INT DEFAULT 0,
    distance_km DOUBLE DEFAULT 0,
    CONSTRAINT fk_item_itinerary FOREIGN KEY (itinerary_id) REFERENCES itinerary(id) ON DELETE CASCADE,
    CONSTRAINT fk_item_attraction FOREIGN KEY (attraction_id) REFERENCES attractions(id) ON DELETE CASCADE
);

-- ---------------------------------------------------------------------
-- 6. contact_messages
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS contact_messages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    subject VARCHAR(200) NOT NULL,
    message VARCHAR(2000) NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------------------
-- 7. favorites
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS favorites (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    attraction_id BIGINT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_fav_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_fav_attraction FOREIGN KEY (attraction_id) REFERENCES attractions(id) ON DELETE CASCADE,
    CONSTRAINT uq_user_attraction UNIQUE (user_id, attraction_id)
);

-- ---------------------------------------------------------------------
-- 8. reviews
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS reviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    attraction_id BIGINT NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment VARCHAR(1000),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_review_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_review_attraction FOREIGN KEY (attraction_id) REFERENCES attractions(id) ON DELETE CASCADE
);

-- =====================================================================
-- SEED DATA
-- =====================================================================

-- Default Administrator (admin@travelmate.lk / admin123 - BCrypt encoded)
INSERT INTO users (id, full_name, email, password, role) VALUES
(1, 'System Administrator', 'admin@travelmate.lk', '$2a$10$KQjacgcuyO3xzoGoWlODQu159L5ZdmBpmIlmgns95CfmBSIUc3yfS', 'ADMIN')
ON DUPLICATE KEY UPDATE email=email;

-- Tourist User demo account (tourist@travelmate.lk / tourist123)
INSERT INTO users (id, full_name, email, password, role) VALUES
(2, 'Rukshana Roshan', 'tourist@travelmate.lk', '$2a$10$KQjacgcuyO3xzoGoWlODQu159L5ZdmBpmIlmgns95CfmBSIUc3yfS', 'TOURIST')
ON DUPLICATE KEY UPDATE email=email;

-- Approved Categories
INSERT INTO categories (id, name, icon, description, image_url, color, is_featured) VALUES
(1, 'Recreation', 'bi-controller', 'Theme parks, water parks, and leisure family zones', 'https://images.unsplash.com/photo-1582650625119-3a31f8418399?auto=format&fit=crop&w=900&q=80', '#f2542d', TRUE),
(2, 'Adventure', 'bi-speedometer2', 'Motorsports, go-karting, and high-energy sports', 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=900&q=80', '#0f5c5c', TRUE),
(3, 'Nature', 'bi-tree', 'Serene freshwater lakes, lush waterfalls, and nature trails', 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80', '#10b981', TRUE),
(4, 'Beaches', 'bi-water', 'Golden sandy coasts, sunset viewing, and ocean breezes', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80', '#0284c7', TRUE),
(5, 'Religious Places', 'bi-bank', 'Sacred Buddhist shrines, iconic stupas, and spiritual landmarks', 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=900&q=80', '#e8a33d', TRUE),
(6, 'Historical Attractions', 'bi-compass', 'Colonial heritage, Edwardian architecture, and historical mansions', 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=900&q=80', '#8b5cf6', TRUE)
ON DUPLICATE KEY UPDATE name=name, image_url=VALUES(image_url), color=VALUES(color), is_featured=VALUES(is_featured);

-- 10 Approved Attractions (Within 25km of Atulugama)
INSERT INTO attractions (id, name, category_id, description, location, distance_km, duration_minutes, opening_hours, entrance_fee, latitude, longitude, image_url, google_maps_url, average_rating) VALUES
(1, 'Pearl Bay, Bandaragama', 1, 'Sri Lanka''s premier international-standard water theme park featuring multi-level waterslides, splash pads, and recreational family attractions.', 'Bandaragama, Kalutara District', 8.5, 180, '09:30 AM - 05:30 PM (Wed-Sun)', 3500.00, 6.7135, 79.9897, 'https://images.unsplash.com/photo-1582650625119-3a31f8418399?auto=format&fit=crop&w=800&q=80', 'https://www.google.com/maps/search/?api=1&query=6.7135,79.9897', 4.8),

(2, 'Sri Lanka Karting Circuit, Bandaragama', 2, 'The finest go-karting track in South Asia offering FIA-standard circuit racing, high-performance rental karts, and racing excitement for adventure enthusiasts.', 'Bandaragama, Kalutara District', 8.8, 90, '10:00 AM - 08:00 PM (Tue-Sun)', 2500.00, 6.7144, 79.9880, 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80', 'https://www.google.com/maps/search/?api=1&query=6.7144,79.9880', 4.7),

(3, 'Bolgoda Lake', 3, 'Sri Lanka''s largest natural freshwater lake complex, celebrated for scenic mangrove waterways, peaceful boat safaris, birdwatching, and angling.', 'Bolgoda, Bandaragama / Moratuwa Border', 14.0, 120, 'Open daylight hours (06:00 AM - 06:00 PM)', 500.00, 6.7458, 79.9325, 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80', 'https://www.google.com/maps/search/?api=1&query=6.7458,79.9325', 4.6),

(4, 'Wadduwa Beach', 4, 'A picturesque golden coastline lined with coconut palms, offering warm sea breezes, traditional fishing catamarans, and breathtaking sunset panoramas.', 'Wadduwa, Kalutara District', 18.5, 90, 'Open 24 Hours', 0.00, 6.6660, 79.9298, 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80', 'https://www.google.com/maps/search/?api=1&query=6.6660,79.9298', 4.5),

(5, 'Pothupitiya Beach', 4, 'A calm, tranquil coastal sanctuary slightly south of Wadduwa, ideal for peaceful coastal walks, beach photography, and quiet seaside meditation.', 'Pothupitiya, Wadduwa', 19.0, 60, 'Open 24 Hours', 0.00, 6.6410, 79.9450, 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=800&q=80', 'https://www.google.com/maps/search/?api=1&query=6.6410,79.9450', 4.4),

(6, 'Kalutara Bodhiya', 5, 'One of the most sacred and venerated Buddhist shrines in Sri Lanka, situated near Kalu Ganga and marked by a sacred Bodhi tree with centuries of devotion.', 'Kalutara North, Kalutara District', 22.0, 75, '04:30 AM - 09:30 PM Daily', 0.00, 6.5828, 79.9599, 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80', 'https://www.google.com/maps/search/?api=1&query=6.5828,79.9599', 4.9),

(7, 'Gangatilaka Viharaya', 5, 'The world-famous hollow Buddhist Chaitya (Stupa) rising proudly above the Kalutara Bridge, decorated with 74 intricate murals depicting the Jataka tales.', 'Kalutara South, Kalutara District', 22.1, 60, '05:00 AM - 09:00 PM Daily', 0.00, 6.5822, 79.9605, 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80', 'https://www.google.com/maps/search/?api=1&query=6.5822,79.9605', 4.8),

(8, 'Richmond Castle', 6, 'A magnificent Edwardian-era mansion completed in 1910 by Mudaliyar Don Arthur de Silva Wijesinghe, surrounded by sprawling orchards and Italian marble.', 'Palatota, Kalutara', 21.5, 90, '08:30 AM - 04:30 PM Daily', 300.00, 6.5750, 79.9820, 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80', 'https://www.google.com/maps/search/?api=1&query=6.5750,79.9820', 4.6),

(9, 'Calido Beach', 4, 'A narrow, natural peninsula of golden sand wedged between the roaring Indian Ocean and the tranquil estuary of the Kalu Ganga river.', 'Kalutara Town', 23.0, 75, '06:00 AM - 07:00 PM Daily', 0.00, 6.5785, 79.9545, 'https://images.unsplash.com/photo-1520454974749-611b7248ffdb?auto=format&fit=crop&w=800&q=80', 'https://www.google.com/maps/search/?api=1&query=6.5785,79.9545', 4.5),

(10, 'Thudugala Ella', 3, 'A stunning 8-meter natural cascade tucked inside rubber and rainforest canopies in Dodangoda, featuring soothing natural plunge pools for swimming.', 'Thudugala, Dodangoda, Kalutara', 17.5, 120, '07:00 AM - 05:30 PM Daily', 100.00, 6.6028, 80.0410, 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=800&q=80', 'https://www.google.com/maps/search/?api=1&query=6.6028,80.0410', 4.7)
ON DUPLICATE KEY UPDATE name=name;

-- Sample Contact Message
INSERT INTO contact_messages (id, name, email, subject, message, is_read) VALUES
(1, 'David Miller', 'david.miller@example.com', 'Inquiry regarding family trip to Pearl Bay', 'Hello TravelMate team, I am planning a one-day trip from Atulugama with my family next Saturday. Can you confirm if Pearl Bay has food stalls inside?', FALSE)
ON DUPLICATE KEY UPDATE name=name;
