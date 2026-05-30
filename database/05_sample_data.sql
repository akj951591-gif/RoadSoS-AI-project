-- -- ============================================
-- -- SAMPLE DATA FOR COMPETITION DEMO
-- -- ============================================

-- -- Insert test user
INSERT INTO users (user_id, name, email, phone, password_hash, role) VALUES
-- ('USR001', 'John Doe', 'john@example.com', '9876543210', 'hashed_password_here', 'citizen'),
-- ('USR002', 'Jane Smith', 'jane@example.com', '9876543211', 'hashed_password_here', 'responder'),
-- ('USR003', 'Admin User', 'admin@roadsos.com', '9876543212', 'hashed_password_here', 'admin');

-- -- Insert user profile with medical details
INSERT INTO user_profiles (user_id, age, blood_group, weight, height, diseases, allergies, medications, emergency_contact_name, emergency_contact_phone, address) VALUES
-- ('USR001', 28, 'O+', 70.5, 175.0, 'None', 'Penicillin', 'None', 'Sarah Doe', '9876543213', '123 Main Street, City');

-- -- Insert emergency contact
INSERT INTO emergency_contacts (user_id, contact_name, contact_phone, relationship, is_primary) VALUES
-- ('USR001', 'Sarah Doe', '9876543213', 'Spouse', TRUE);

-- -- Insert nearby hospitals
INSERT INTO nearby_help (service_name, service_type, latitude, longitude, address, phone_number, is_24x7) VALUES
-- ('City General Hospital', 'hospital', 28.6139, 77.2090, 'Central District', '011-12345678', TRUE),
-- ('Downtown Medical Center', 'hospital', 28.7041, 77.1025, 'Downtown Area', '011-87654321', TRUE);