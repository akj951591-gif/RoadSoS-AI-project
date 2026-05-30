import mysql.connector
import hashlib
from datetime import datetime
import uuid

# ============================================
# CONFIGURATION - UPDATE THIS WITH YOUR PASSWORD
# ============================================
MYSQL_PASSWORD = "Abhi@1729"  # ⚠️ PUT YOUR MYSQL PASSWORD HERE (e.g., "root123" or "password")

# ============================================

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

def test_mysql_connection():
    print("\n" + "="*60)
    print("🔍 TESTING MYSQL CONNECTION")
    print("="*60)
    
    try:
        conn = mysql.connector.connect(
            host="localhost",
            user="root",
            password=MYSQL_PASSWORD,
            database="roadsos_ai_db"
        )
        
        cursor = conn.cursor()
        print("✅ Successfully connected to MySQL!")
        
        # Check if users table exists
        cursor.execute("SHOW TABLES")
        tables = cursor.fetchall()
        print(f"\n📊 Tables found: {len(tables)}")
        for table in tables:
            print(f"   - {table[0]}")
        
        cursor.close()
        conn.close()
        return True
        
    except mysql.connector.Error as err:
        print(f"❌ MySQL Error: {err}")
        print("\n💡 Possible solutions:")
        print("1. Make sure MySQL is installed and running")
        print("2. Check your password in MYSQL_PASSWORD variable")
        print("3. Run: net start MySQL80 (Windows) or sudo service mysql start (Linux)")
        return False

def test_insert_user():
    print("\n" + "="*60)
    print("📝 TESTING USER INSERT")
    print("="*60)
    
    try:
        conn = mysql.connector.connect(
            host="localhost",
            user="root",
            password=MYSQL_PASSWORD,
            database="roadsos_ai_db"
        )
        
        cursor = conn.cursor()
        
        # Generate test user data
        test_email = f"test_{datetime.now().strftime('%Y%m%d%H%M%S')}@example.com"
        user_id = f"USR{datetime.now().strftime('%Y%m%d%H%M%S')}{uuid.uuid4().hex[:4]}"
        
        # Insert test user
        cursor.execute("""
            INSERT INTO users (user_id, name, email, phone, password_hash, role, created_at)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """, (user_id, "Test User", test_email, "9876543210", hash_password("test123"), "citizen", datetime.now()))
        
        conn.commit()
        
        print(f"✅ Test user inserted successfully!")
        print(f"   User ID: {user_id}")
        print(f"   Email: {test_email}")
        
        # Verify insertion
        cursor.execute("SELECT user_id, name, email FROM users WHERE email = %s", (test_email,))
        user = cursor.fetchone()
        if user:
            print(f"✅ Verified! User exists in database: {user[1]} ({user[2]})")
        
        cursor.close()
        conn.close()
        return True
        
    except mysql.connector.Error as err:
        print(f"❌ Insert failed: {err}")
        return False

def view_all_users():
    print("\n" + "="*60)
    print("👥 ALL USERS IN DATABASE")
    print("="*60)
    
    try:
        conn = mysql.connector.connect(
            host="localhost",
            user="root",
            password=MYSQL_PASSWORD,
            database="roadsos_ai_db"
        )
        
        cursor = conn.cursor()
        cursor.execute("SELECT user_id, name, email, phone, role, created_at FROM users ORDER BY created_at DESC")
        users = cursor.fetchall()
        
        if users:
            print(f"\nFound {len(users)} user(s):\n")
            for user in users:
                print(f"  👤 {user[1]}")
                print(f"     📧 {user[2]}")
                print(f"     📞 {user[3]}")
                print(f"     🎭 Role: {user[4]}")
                print(f"     📅 Joined: {user[5]}")
                print()
        else:
            print("No users found in database!")
        
        cursor.close()
        conn.close()
        
    except mysql.connector.Error as err:
        print(f"❌ Error: {err}")

def main():
    print("\n" + "="*60)
    print("🚗 ROADSOS AI DATABASE TEST")
    print("="*60)
    
    # Test connection
    if not test_mysql_connection():
        print("\n⚠️ Please fix MySQL connection issues first!")
        return
    
    # Test insert
    test_insert_user()
    
    # View all users
    view_all_users()
    
    print("\n" + "="*60)
    print("✅ Database test complete!")
    print("="*60)

if __name__ == "__main__":
    main()