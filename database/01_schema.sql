-- ============================================
-- DATABASE: roadsos_ai_db
-- DESCRIPTION: Complete database for RoadSoS AI emergency response platform
-- AUTHOR: RoadSoS AI Team
-- ============================================

CREATE DATABASE IF NOT EXISTS roadsos_ai_db;
USE roadsos_ai_db;

-- ============================================
-- TABLE 1: users - Store all registered users
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(15) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('citizen', 'responder', 'admin') DEFAULT 'citizen',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    INDEX idx_name (name)
    INDEX idx_email (email),
    INDEX idx_phone (phone),
    INDEX idx_role (role)
);

-- ============================================
-- TABLE 2: user_profiles - Complete medical & personal details
-- ============================================
CREATE TABLE IF NOT EXISTS user_profiles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id VARCHAR(50) NOT NULL,
    age INT,
    blood_group ENUM('A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-') NULL,
    weight DECIMAL(5,2),
    height DECIMAL(5,2),
    blood_pressure VARCHAR(20),
    diseases TEXT,
    allergies TEXT,
    medications TEXT,
    medical_history TEXT,
    emergency_contact_name VARCHAR(100),
    emergency_contact_phone VARCHAR(15),
    address TEXT,
    organ_donor BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_blood_group (blood_group)
);

-- ============================================
-- TABLE 3: sos_alerts - Store all emergency alerts
-- ============================================
CREATE TABLE IF NOT EXISTS sos_alerts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    alert_id VARCHAR(50) UNIQUE NOT NULL,
    user_id VARCHAR(50) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    location_address TEXT,
    alert_status ENUM('active', 'responding', 'resolved', 'cancelled') DEFAULT 'active',
    priority_level ENUM('critical', 'high', 'medium', 'low') DEFAULT 'high',
    responder_id VARCHAR(50) NULL,
    responded_at TIMESTAMP NULL,
    resolved_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_status (alert_status),
    INDEX idx_priority (priority_level),
    INDEX idx_created (created_at)
);

-- ============================================
-- TABLE 4: emergency_contacts - User's emergency contacts
-- ============================================
CREATE TABLE IF NOT EXISTS emergency_contacts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id VARCHAR(50) NOT NULL,
    contact_name VARCHAR(100) NOT NULL,
    contact_phone VARCHAR(15) NOT NULL,
    contact_email VARCHAR(100),
    relationship VARCHAR(50),
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_primary (is_primary)
);

-- ============================================
-- TABLE 5: responder_assignments - Track responder assignments
-- ============================================
CREATE TABLE IF NOT EXISTS responder_assignments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    alert_id VARCHAR(50) NOT NULL,
    responder_id VARCHAR(50) NOT NULL,
    assignment_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    response_time INT, -- in seconds
    arrival_time TIMESTAMP NULL,
    status ENUM('assigned', 'en_route', 'arrived', 'completed') DEFAULT 'assigned',
    notes TEXT,
    FOREIGN KEY (alert_id) REFERENCES sos_alerts(alert_id) ON DELETE CASCADE,
    FOREIGN KEY (responder_id) REFERENCES users(user_id),
    INDEX idx_alert (alert_id),
    INDEX idx_responder (responder_id),
    INDEX idx_status (status)
);

-- ============================================
-- TABLE 6: accident_reports - AI-detected accident reports
-- ============================================
CREATE TABLE IF NOT EXISTS accident_reports (
    id INT PRIMARY KEY AUTO_INCREMENT,
    report_id VARCHAR(50) UNIQUE NOT NULL,
    location_lat DECIMAL(10, 8),
    location_lon DECIMAL(11, 8),
    severity_score DECIMAL(5, 2),
    risk_level ENUM('critical', 'high', 'medium', 'low'),
    vehicle_type VARCHAR(50),
    weather_condition VARCHAR(50),
    road_condition VARCHAR(100),
    detected_by VARCHAR(50), -- AI model identifier
    confidence_score DECIMAL(5, 2),
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_location (location_lat, location_lon),
    INDEX idx_severity (severity_score),
    INDEX idx_created (created_at)
);

-- ============================================
-- TABLE 7: ai_predictions - Store AI risk predictions
-- ============================================
CREATE TABLE IF NOT EXISTS ai_predictions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id VARCHAR(50) NOT NULL,
    prediction_type ENUM('triage', 'risk', 'monitor') NOT NULL,
    input_data JSON,
    output_score DECIMAL(5, 2),
    priority_level VARCHAR(20),
    recommendation TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_type (prediction_type),
    INDEX idx_created (created_at)
);

-- ============================================
-- TABLE 8: nearby_help - Hospitals, police, emergency services
-- ============================================
CREATE TABLE IF NOT EXISTS nearby_help (
    id INT PRIMARY KEY AUTO_INCREMENT,
    service_name VARCHAR(100) NOT NULL,
    service_type ENUM('hospital', 'police', 'fire_station', 'pharmacy', 'ambulance') NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    address TEXT,
    phone_number VARCHAR(15),
    emergency_phone VARCHAR(15),
    operating_hours TEXT,
    rating DECIMAL(3, 2),
    is_24x7 BOOLEAN DEFAULT FALSE,
    INDEX idx_location (latitude, longitude),
    INDEX idx_type (service_type),
    FULLTEXT INDEX idx_search (service_name, address)
);

-- ============================================
-- TABLE 9: driver_monitoring_logs - Store driver behavior data
-- ============================================
CREATE TABLE IF NOT EXISTS driver_monitoring_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id VARCHAR(50) NOT NULL,
    speed DECIMAL(5, 2),
    acceleration DECIMAL(5, 2),
    braking DECIMAL(5, 2),
    steering_angle DECIMAL(5, 2),
    vibration DECIMAL(5, 2),
    driver_condition_score DECIMAL(5, 2),
    alert_triggered BOOLEAN DEFAULT FALSE,
    alert_type VARCHAR(50),
    session_id VARCHAR(100),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_timestamp (timestamp),
    INDEX idx_alert (alert_triggered)
);

-- ============================================
-- TABLE 10: sessions - User login sessions
-- ============================================
CREATE TABLE IF NOT EXISTS sessions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    user_id VARCHAR(50) NOT NULL,
    device_info TEXT,
    ip_address VARCHAR(45),
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_token (session_token),
    INDEX idx_user_id (user_id),
    INDEX idx_expires (expires_at)
);

-- ============================================
-- TABLE 11: notifications - Push notifications
-- ============================================
CREATE TABLE IF NOT EXISTS notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    notification_id VARCHAR(50) UNIQUE NOT NULL,
    user_id VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    notification_type ENUM('sos', 'alert', 'info', 'reminder') DEFAULT 'info',
    is_read BOOLEAN DEFAULT FALSE,
    action_link TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_is_read (is_read),
    INDEX idx_created (created_at)
);

-- ============================================
-- TABLE 12: system_logs - Admin audit logs
-- ============================================
CREATE TABLE IF NOT EXISTS system_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    log_id VARCHAR(50) UNIQUE NOT NULL,
    admin_id VARCHAR(50),
    action VARCHAR(100),
    entity_type VARCHAR(50),
    entity_id VARCHAR(50),
    old_value JSON,
    new_value JSON,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_admin (admin_id),
    INDEX idx_entity (entity_type, entity_id),
    INDEX idx_created (created_at)
);