import mysql.connector
from tabulate import tabulate
import pandas as pd

# Database connection
def get_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="Abhi@1729",  # Your MySQL password
        database="roadsos_ai_db"
    )

def view_all_users():
    """View all registered users"""
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    
    cursor.execute("""
        SELECT user_id, name, email, phone, role, is_active, created_at 
        FROM users 
        ORDER BY created_at DESC
    """)
    
    users = cursor.fetchall()
    
    if users:
        print("\n" + "="*80)
        print("📊 ALL REGISTERED USERS")
        print("="*80)
        
        # Convert to DataFrame for better display
        df = pd.DataFrame(users)
        print(tabulate(df, headers='keys', tablefmt='grid', showindex=False))
    else:
        print("No users found!")
    
    cursor.close()
    conn.close()
    return users

def view_user_profiles():
    """View all user medical profiles"""
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    
    cursor.execute("""
        SELECT 
            u.name,
            u.email,
            up.age,
            up.blood_group,
            up.weight,
            up.height,
            up.diseases,
            up.allergies,
            up.medications,
            up.emergency_contact_name,
            up.emergency_contact_phone,
            up.address
        FROM user_profiles up
        JOIN users u ON up.user_id = u.user_id
    """)
    
    profiles = cursor.fetchall()
    
    if profiles:
        print("\n" + "="*80)
        print("🏥 USER MEDICAL PROFILES")
        print("="*80)
        
        df = pd.DataFrame(profiles)
        print(tabulate(df, headers='keys', tablefmt='grid', showindex=False))
    else:
        print("No profiles found!")
    
    cursor.close()
    conn.close()
    return profiles

def view_active_sos_alerts():
    """View active SOS alerts"""
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    
    cursor.execute("SELECT * FROM active_sos_dashboard")
    
    alerts = cursor.fetchall()
    
    if alerts:
        print("\n" + "="*80)
        print("🚨 ACTIVE SOS ALERTS")
        print("="*80)
        
        df = pd.DataFrame(alerts)
        print(tabulate(df, headers='keys', tablefmt='grid', showindex=False))
    else:
        print("No active SOS alerts!")
    
    cursor.close()
    conn.close()
    return alerts

def view_ai_predictions():
    """View AI predictions"""
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    
    cursor.execute("""
        SELECT 
            u.name,
            ap.prediction_type,
            ap.output_score,
            ap.priority_level,
            ap.recommendation,
            ap.created_at
        FROM ai_predictions ap
        JOIN users u ON ap.user_id = u.user_id
        ORDER BY ap.created_at DESC
        LIMIT 10
    """)
    
    predictions = cursor.fetchall()
    
    if predictions:
        print("\n" + "="*80)
        print("🤖 AI PREDICTIONS (Last 10)")
        print("="*80)
        
        df = pd.DataFrame(predictions)
        print(tabulate(df, headers='keys', tablefmt='grid', showindex=False))
    else:
        print("No AI predictions found!")
    
    cursor.close()
    conn.close()
    return predictions

def view_driver_monitoring():
    """View driver monitoring logs"""
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    
    cursor.execute("""
        SELECT 
            u.name,
            dml.speed,
            dml.driver_condition_score,
            dml.alert_triggered,
            dml.alert_type,
            dml.timestamp
        FROM driver_monitoring_logs dml
        JOIN users u ON dml.user_id = u.user_id
        ORDER BY dml.timestamp DESC
        LIMIT 10
    """)
    
    logs = cursor.fetchall()
    
    if logs:
        print("\n" + "="*80)
        print("📊 DRIVER MONITORING LOGS (Last 10)")
        print("="*80)
        
        df = pd.DataFrame(logs)
        print(tabulate(df, headers='keys', tablefmt='grid', showindex=False))
    else:
        print("No driver monitoring data found!")
    
    cursor.close()
    conn.close()
    return logs

def view_nearby_help():
    """View nearby help locations"""
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    
    cursor.execute("""
        SELECT service_name, service_type, address, phone_number, is_24x7, rating
        FROM nearby_help
        ORDER BY service_type
    """)
    
    locations = cursor.fetchall()
    
    if locations:
        print("\n" + "="*80)
        print("📍 NEARBY HELP LOCATIONS")
        print("="*80)
        
        df = pd.DataFrame(locations)
        print(tabulate(df, headers='keys', tablefmt='grid', showindex=False))
    else:
        print("No nearby help locations found!")
    
    cursor.close()
    conn.close()
    return locations

def view_database_stats():
    """View database statistics"""
    conn = get_connection()
    cursor = conn.cursor()
    
    stats = {}
    
    # Get counts from each table
    tables = ['users', 'user_profiles', 'sos_alerts', 'ai_predictions', 'driver_monitoring_logs', 'nearby_help']
    
    for table in tables:
        cursor.execute(f"SELECT COUNT(*) FROM {table}")
        stats[table] = cursor.fetchone()[0]
    
    print("\n" + "="*80)
    print("📈 DATABASE STATISTICS")
    print("="*80)
    
    for table, count in stats.items():
        print(f"📌 {table.upper()}: {count} records")
    
    cursor.close()
    conn.close()

def main_menu():
    """Main menu to view different data"""
    while True:
        print("\n" + "="*50)
        print("🔍 ROADSOS AI DATABASE VIEWER")
        print("="*50)
        print("1. View All Users")
        print("2. View User Medical Profiles")
        print("3. View Active SOS Alerts")
        print("4. View AI Predictions")
        print("5. View Driver Monitoring Logs")
        print("6. View Nearby Help Locations")
        print("7. View Database Statistics")
        print("8. View All Data")
        print("0. Exit")
        
        choice = input("\nSelect an option (0-8): ")
        
        if choice == '1':
            view_all_users()
        elif choice == '2':
            view_user_profiles()
        elif choice == '3':
            view_active_sos_alerts()
        elif choice == '4':
            view_ai_predictions()
        elif choice == '5':
            view_driver_monitoring()
        elif choice == '6':
            view_nearby_help()
        elif choice == '7':
            view_database_stats()
        elif choice == '8':
            view_all_users()
            view_user_profiles()
            view_active_sos_alerts()
            view_ai_predictions()
            view_driver_monitoring()
            view_nearby_help()
            view_database_stats()
        elif choice == '0':
            print("\n👋 Goodbye!")
            break
        else:
            print("\n❌ Invalid option! Please try again.")
        
        input("\nPress Enter to continue...")

if __name__ == "__main__":
    # Install required packages first:
    # pip install mysql-connector-python tabulate pandas
    
    main_menu()