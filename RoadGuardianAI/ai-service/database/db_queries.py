from database.db_config import db
from datetime import datetime

class UserQueries:
    """User related database operations"""
    
    @staticmethod
    def create_user(user_id, name, email, phone, password_hash, role='citizen'):
        query = """
            INSERT INTO users (user_id, name, email, phone, password_hash, role)
            VALUES (%s, %s, %s, %s, %s, %s)
        """
        return db.execute_insert(query, (user_id, name, email, phone, password_hash, role))
    
    @staticmethod
    def get_user_by_email(email):
        query = "SELECT * FROM users WHERE email = %s"
        result = db.execute_query(query, (email,))
        return result[0] if result else None
    
    @staticmethod
    def get_user_by_id(user_id):
        query = "SELECT * FROM users WHERE user_id = %s"
        result = db.execute_query(query, (user_id,))
        return result[0] if result else None
    
    @staticmethod
    def update_user_profile(user_id, profile_data):
        query = """
            UPDATE user_profiles 
            SET age = %s, blood_group = %s, weight = %s, height = %s,
                diseases = %s, allergies = %s, medications = %s,
                medical_history = %s, emergency_contact_name = %s,
                emergency_contact_phone = %s, address = %s, organ_donor = %s
            WHERE user_id = %s
        """
        return db.execute_update(query, (
            profile_data.get('age'), profile_data.get('blood_group'),
            profile_data.get('weight'), profile_data.get('height'),
            profile_data.get('diseases'), profile_data.get('allergies'),
            profile_data.get('medications'), profile_data.get('medical_history'),
            profile_data.get('emergency_contact_name'),
            profile_data.get('emergency_contact_phone'),
            profile_data.get('address'), profile_data.get('organ_donor', False),
            user_id
        ))

class SOSQueries:
    """SOS alert related database operations"""
    
    @staticmethod
    def create_sos_alert(alert_id, user_id, latitude, longitude, location_address, priority='high'):
        query = """
            INSERT INTO sos_alerts (alert_id, user_id, latitude, longitude, location_address, priority_level)
            VALUES (%s, %s, %s, %s, %s, %s)
        """
        return db.execute_insert(query, (alert_id, user_id, latitude, longitude, location_address, priority))
    
    @staticmethod
    def get_active_alerts():
        query = """
            SELECT * FROM active_sos_dashboard 
            ORDER BY priority_level DESC, minutes_active DESC
        """
        return db.execute_query(query)
    
    @staticmethod
    def update_alert_status(alert_id, status, responder_id=None):
        query = """
            UPDATE sos_alerts 
            SET alert_status = %s, responder_id = %s, 
                responded_at = CASE WHEN %s = 'responding' THEN NOW() ELSE responded_at END,
                resolved_at = CASE WHEN %s = 'resolved' THEN NOW() ELSE resolved_at END
            WHERE alert_id = %s
        """
        return db.execute_update(query, (status, responder_id, status, status, alert_id))

class AIQueries:
    """AI prediction related database operations"""
    
    @staticmethod
    def save_prediction(user_id, prediction_type, input_data, output_score, priority, recommendation):
        query = """
            INSERT INTO ai_predictions (user_id, prediction_type, input_data, output_score, priority_level, recommendation)
            VALUES (%s, %s, %s, %s, %s, %s)
        """
        return db.execute_insert(query, (
            user_id, prediction_type, 
            json.dumps(input_data), output_score, 
            priority, recommendation
        ))
    
    @staticmethod
    def get_user_predictions(user_id, limit=10):
        query = """
            SELECT * FROM ai_predictions 
            WHERE user_id = %s 
            ORDER BY created_at DESC 
            LIMIT %s
        """
        return db.execute_query(query, (user_id, limit))

class DriverMonitoringQueries:
    """Driver monitoring database operations"""
    
    @staticmethod
    def log_driver_data(user_id, speed, acceleration, braking, steering_angle, 
                        vibration, driver_condition_score, alert_triggered=False, alert_type=None):
        query = """
            INSERT INTO driver_monitoring_logs 
            (user_id, speed, acceleration, braking, steering_angle, vibration, 
             driver_condition_score, alert_triggered, alert_type)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        return db.execute_insert(query, (
            user_id, speed, acceleration, braking, steering_angle, 
            vibration, driver_condition_score, alert_triggered, alert_type
        ))
    
    @staticmethod
    def get_user_driver_history(user_id, limit=50):
        query = """
            SELECT * FROM driver_monitoring_logs 
            WHERE user_id = %s 
            ORDER BY timestamp DESC 
            LIMIT %s
        """
        return db.execute_query(query, (user_id, limit))

class NotificationQueries:
    """Notification database operations"""
    
    @staticmethod
    def create_notification(notification_id, user_id, title, message, notification_type='info'):
        query = """
            INSERT INTO notifications (notification_id, user_id, title, message, notification_type)
            VALUES (%s, %s, %s, %s, %s)
        """
        return db.execute_insert(query, (notification_id, user_id, title, message, notification_type))
    
    @staticmethod
    def get_unread_notifications(user_id):
        query = """
            SELECT * FROM notifications 
            WHERE user_id = %s AND is_read = FALSE 
            ORDER BY created_at DESC
        """
        return db.execute_query(query, (user_id,))
    
    @staticmethod
    def mark_as_read(notification_id):
        query = "UPDATE notifications SET is_read = TRUE WHERE notification_id = %s"
        return db.execute_update(query, (notification_id,))