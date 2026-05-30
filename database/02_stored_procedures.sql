-- ============================================
-- STORED PROCEDURE: Quick SOS Alert Creation
-- ============================================
DELIMITER //

CREATE PROCEDURE CreateSOSAlert(
    IN p_user_id VARCHAR(50),
    IN p_latitude DECIMAL(10,8),
    IN p_longitude DECIMAL(11,8),
    IN p_location_address TEXT
)
BEGIN
    DECLARE v_alert_id VARCHAR(50);
    DECLARE v_priority ENUM('critical', 'high', 'medium', 'low');
    
    -- Generate unique alert ID
    SET v_alert_id = CONCAT('SOS', UNIX_TIMESTAMP(), FLOOR(RAND() * 1000));
    
    -- Set priority based on user medical conditions
    SELECT 
        CASE 
            WHEN EXISTS(SELECT 1 FROM user_profiles WHERE user_id = p_user_id AND (diseases IS NOT NULL OR medical_history IS NOT NULL))
                THEN 'critical'
            ELSE 'high'
        END INTO v_priority;
    
    -- Insert SOS alert
    INSERT INTO sos_alerts (alert_id, user_id, latitude, longitude, location_address, priority_level)
    VALUES (v_alert_id, p_user_id, p_latitude, p_longitude, p_location_address, v_priority);
    
    -- Return alert ID
    SELECT v_alert_id AS alert_id;
    
    -- Auto-assign nearest responder (simplified)
    CALL AssignNearestResponder(v_alert_id);
END //

DELIMITER ;

-- ============================================
-- STORED PROCEDURE: Assign Nearest Responder
-- ============================================
DELIMITER //

CREATE PROCEDURE AssignNearestResponder(
    IN p_alert_id VARCHAR(50)
)
BEGIN
    DECLARE v_responder_id VARCHAR(50);
    DECLARE v_lat DECIMAL(10,8);
    DECLARE v_lon DECIMAL(11,8);
    
    -- Get alert location
    SELECT latitude, longitude INTO v_lat, v_lon 
    FROM sos_alerts WHERE alert_id = p_alert_id;
    
    -- Find nearest active responder (simplified - would use GIS in production)
    SELECT user_id INTO v_responder_id
    FROM users 
    WHERE role = 'responder' AND is_active = TRUE
    LIMIT 1;
    
    -- Update alert with responder
    IF v_responder_id IS NOT NULL THEN
        UPDATE sos_alerts 
        SET responder_id = v_responder_id, 
            alert_status = 'responding',
            responded_at = NOW()
        WHERE alert_id = p_alert_id;
        
        -- Create assignment record
        INSERT INTO responder_assignments (alert_id, responder_id, assignment_time)
        VALUES (p_alert_id, v_responder_id, NOW());
    END IF;
END //

DELIMITER ;