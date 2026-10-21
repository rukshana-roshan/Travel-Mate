-- Cleanup tables before inserting test seed data
DELETE FROM contact_messages;
DELETE FROM itinerary_items;
DELETE FROM itinerary;
DELETE FROM favorites;
DELETE FROM reviews;
DELETE FROM attractions;
DELETE FROM categories;
DELETE FROM users;

-- 1. Users
INSERT INTO users (id, full_name, email, password, role) VALUES
(1, 'System Administrator', 'admin@travelmate.lk', '$2a$10$KQjacgcuyO3xzoGoWlODQu159L5ZdmBpmIlmgns95CfmBSIUc3yfS', 'ADMIN'),
(2, 'Rukshana Roshan', 'tourist@travelmate.lk', '$2a$10$KQjacgcuyO3xzoGoWlODQu159L5ZdmBpmIlmgns95CfmBSIUc3yfS', 'TOURIST');

-- 2. Categories
INSERT INTO categories (id, name, icon, description) VALUES
(1, 'Recreation', 'bi-controller', 'Theme parks, water parks, and leisure family zones'),
(2, 'Adventure', 'bi-speedometer2', 'Motorsports, go-karting, and high-energy sports'),
(3, 'Nature', 'bi-tree', 'Serene freshwater lakes, lush waterfalls, and nature trails'),
(4, 'Beaches', 'bi-water', 'Golden sandy coasts, sunset viewing, and ocean breezes'),
(5, 'Religious Places', 'bi-bank', 'Sacred Buddhist shrines, iconic stupas, and spiritual landmarks'),
(6, 'Historical Attractions', 'bi-compass', 'Colonial heritage, Edwardian architecture, and historical mansions');

-- 3. All 10 Approved Attractions
INSERT INTO attractions (id, name, category_id, description, location, distance_km, duration_minutes, opening_hours, entrance_fee, latitude, longitude, image_url, google_maps_url, average_rating) VALUES
(1, 'Pearl Bay, Bandaragama', 1, 'Premier water theme park with slides and pools.', 'Bandaragama, Kalutara District', 8.5, 180, '09:30 AM - 05:30 PM (Wed-Sun)', 3500.00, 6.7135, 79.9897, 'https://example.com/pearl-bay.jpg', 'https://maps.google.com/?q=6.7135,79.9897', 4.8),
(2, 'Sri Lanka Karting Circuit, Bandaragama', 2, 'South Asia premier go-karting circuit.', 'Bandaragama, Kalutara District', 8.8, 90, '10:00 AM - 08:00 PM (Tue-Sun)', 2500.00, 6.7144, 79.9880, 'https://example.com/karting.jpg', 'https://maps.google.com/?q=6.7144,79.9880', 4.7),
(3, 'Bolgoda Lake', 3, 'Sri Lanka largest freshwater lake complex with mangrove safaris.', 'Bolgoda, Bandaragama / Moratuwa', 14.0, 120, '06:00 AM - 06:00 PM', 500.00, 6.7458, 79.9325, 'https://example.com/bolgoda.jpg', 'https://maps.google.com/?q=6.7458,79.9325', 4.6),
(4, 'Wadduwa Beach', 4, 'Picturesque golden coastline lined with coconut palms.', 'Wadduwa, Kalutara District', 18.5, 90, 'Open 24 Hours', 0.00, 6.6660, 79.9298, 'https://example.com/wadduwa.jpg', 'https://maps.google.com/?q=6.6660,79.9298', 4.5),
(5, 'Pothupitiya Beach', 4, 'Calm, tranquil coastal sanctuary.', 'Pothupitiya, Wadduwa', 19.0, 60, 'Open 24 Hours', 0.00, 6.6410, 79.9450, 'https://example.com/pothupitiya.jpg', 'https://maps.google.com/?q=6.6410,79.9450', 4.4),
(6, 'Kalutara Bodhiya', 5, 'One of the most sacred Buddhist shrines in Sri Lanka.', 'Kalutara North, Kalutara District', 22.0, 75, '04:30 AM - 09:30 PM Daily', 0.00, 6.5828, 79.9599, 'https://example.com/bodhiya.jpg', 'https://maps.google.com/?q=6.5828,79.9599', 4.9),
(7, 'Gangatilaka Viharaya', 5, 'World-famous hollow Buddhist Chaitya rising above Kalutara Bridge.', 'Kalutara South, Kalutara District', 22.1, 60, '05:00 AM - 09:00 PM Daily', 0.00, 6.5822, 79.9605, 'https://example.com/gangatilaka.jpg', 'https://maps.google.com/?q=6.5822,79.9605', 4.8),
(8, 'Richmond Castle', 6, 'Magnificent Edwardian-era mansion completed in 1910.', 'Palatota, Kalutara', 21.5, 90, '08:30 AM - 04:30 PM Daily', 300.00, 6.5750, 79.9820, 'https://example.com/richmond.jpg', 'https://maps.google.com/?q=6.5750,79.9820', 4.6),
(9, 'Calido Beach', 4, 'Scenic peninsula wedged between Indian Ocean and Kalu Ganga.', 'Kalutara Town', 23.0, 75, '06:00 AM - 07:00 PM Daily', 0.00, 6.5785, 79.9545, 'https://example.com/calido.jpg', 'https://maps.google.com/?q=6.5785,79.9545', 4.5),
(10, 'Thudugala Ella', 3, 'Natural waterfall tucked inside forest with swimming pools.', 'Thudugala, Dodangoda, Kalutara', 17.5, 120, '07:00 AM - 05:30 PM Daily', 100.00, 6.6028, 80.0410, 'https://example.com/thudugala.jpg', 'https://maps.google.com/?q=6.6028,80.0410', 4.7);

-- 4. Sample Contact Message
INSERT INTO contact_messages (id, name, email, subject, message, is_read) VALUES
(1, 'David Miller', 'david.miller@example.com', 'Inquiry regarding family trip to Pearl Bay', 'Can you confirm opening hours for Pearl Bay?', FALSE);
