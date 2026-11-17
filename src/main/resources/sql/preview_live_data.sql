-- Run against MySQL to inspect current rows. This file does not change data.
USE travel_mate_db;
SELECT DATABASE() AS current_database, CURRENT_USER() AS authenticated_user;
SELECT id, full_name, email, role, created_at FROM users;
SELECT * FROM categories;
SELECT * FROM attractions;
SELECT * FROM itinerary;
SELECT * FROM itinerary_items;
SELECT * FROM contact_messages;
SELECT * FROM favorites;
SELECT * FROM reviews;
