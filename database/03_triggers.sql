-- ============================================
-- TRIGGER: Update user last login timestamp
-- ============================================
DELIMITER //

CREATE TRIGGER update_last_login
AFTER INSERT ON sessions
FOR EACH ROW
BEGIN
    UPDATE users 
    SET last_login = NOW() 
    WHERE user_id = NEW.user_id;
END //

DELIMITER ;