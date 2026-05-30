import mysql.connector
import hashlib
from datetime import datetime
import json

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

# Your data from localStorage - REPLACE WITH YOUR ACTUAL DATA
# To get this data, run the JavaScript in browser console and copy here
YOUR_DATA = {
    "name": "Abhishek Kumar",  # Replace with your actual name
    "email": "abhishek@example.com",  # Replace with your actual email
    "phone": "9876543210",  # Replace with your actual phone
    "password": "123456"  # Replace with your actual password
}

# MySQL connection
conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",  # Your MySQL password
    database="roadsos_ai_db"
)

cursor = conn.cursor()

print("\n" + "="*60)
print("📝 MIGRATING LOCALSTORAGE DATA TO MYSQL")
print("="*60)

# Check if user already exists
cursor.execute("SELECT email FROM users WHERE email = %s", (YOUR_DATA['email'],))
existing = cursor.fetchone()

if existing:
    print(f"⚠️ User {YOUR_DATA['email']} already exists in MySQL!")
else:
    # Generate user_id
    user_id = f"USR_ABHISHEK_{datetime.now().strftime('%Y%m%d%H%M%S')}"
    
    # Insert user
    cursor.execute("""
        INSERT INTO users (user_id, name, email, phone, password_hash, role, created_at)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
    """, (user_id, YOUR_DATA['name'], YOUR_DATA['email'], YOUR_DATA['phone'], 
          hash_password(YOUR_DATA['password']), 'citizen', datetime.now()))
    
    conn.commit()
    
    print(f"\n✅ USER MIGRATED TO MYSQL SUCCESSFULLY!")
    print(f"   User ID: {user_id}")
    print(f"   Name: {YOUR_DATA['name']}")
    print(f"   Email: {YOUR_DATA['email']}")
    print(f"   Phone: {YOUR_DATA['phone']}")

# Verify
cursor.execute("SELECT user_id, name, email, phone, role FROM users WHERE email = %s", (YOUR_DATA['email'],))
user = cursor.fetchone()
if user:
    print(f"\n✅ Verification successful!")
    print(f"   User exists in MySQL now!")

cursor.close()
conn.commit()
conn.close()