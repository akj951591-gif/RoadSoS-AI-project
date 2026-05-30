-- ============================================
-- VIEW 1: Active SOS Alerts Dashboard
-- ============================================
CREATE VIEW active_sos_dashboard AS
SELECT 
    sa.alert_id,
    u.name AS user_name,
    u.phone AS user_phone,
    up.blood_group,
    up.allergies,
    up.medications,
    up.emergency_contact_name,
    up.emergency_contact_phone,
    sa.latitude,
    sa.longitude,
    sa.location_address,
    sa.priority_level,
    sa.alert_status,
    TIMESTAMPDIFF(MINUTE, sa.created_at, NOW()) AS minutes_active,
    r.name AS responder_name
FROM sos_alerts sa
JOIN users u ON sa.user_id = u.user_id
LEFT JOIN user_profiles up ON u.user_id = up.user_id
LEFT JOIN responder_assignments ra ON sa.alert_id = ra.alert_id
LEFT JOIN users r ON ra.responder_id = r.user_id
WHERE sa.alert_status IN ('active', 'responding')
ORDER BY sa.priority_level DESC, sa.created_at ASC;

-- ============================================
-- VIEW 2: User Medical Summary for Emergency Response
-- ============================================
CREATE VIEW user_medical_summary AS
SELECT 
    u.user_id,
    u.name,
    u.phone,
    u.email,
    up.age,
    up.blood_group,
    up.weight,
    up.height,
    up.blood_pressure,
    up.diseases,
    up.allergies,
    up.medications,
    up.medical_history,
    up.emergency_contact_name,
    up.emergency_contact_phone,
    up.address,
    up.organ_donor
FROM users u
LEFT JOIN user_profiles up ON u.user_id = up.user_id
WHERE u.is_active = TRUE;

-- ============================================
-- VIEW 3: AI Performance Analytics
-- ============================================
CREATE VIEW ai_performance_analytics AS
SELECT 
    DATE(created_at) AS prediction_date,
    prediction_type,
    COUNT(*) AS total_predictions,
    AVG(output_score) AS avg_score,
    priority_level,
    COUNT(DISTINCT user_id) AS unique_users
FROM ai_predictions
GROUP BY DATE(created_at), prediction_type, priority_level
ORDER BY prediction_date DESC;