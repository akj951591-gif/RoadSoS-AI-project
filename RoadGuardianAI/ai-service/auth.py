from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import hashlib
import re
from datetime import datetime
import uuid
import mysql.connector
from mysql.connector import Error

# ============================================
# DATABASE CONFIGURATION
# ============================================

DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': 'Abhi@1729',  # ⚠️ PUT YOUR MYSQL PASSWORD HERE (e.g., 'root123' or 'password')
    'database': 'roadsos_ai_db'
}

def get_db_connection():
    """Create database connection"""
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        return conn
    except Error as e:
        print(f"❌ Database connection error: {e}")
        return None

def init_database():
    """Initialize database tables if not exists"""
    conn = get_db_connection()
    if not conn:
        print("❌ Cannot initialize database - connection failed")
        return
    
    try:
        cursor = conn.cursor()
        
        # Create users table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INT PRIMARY KEY AUTO_INCREMENT,
                user_id VARCHAR(50) UNIQUE NOT NULL,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                phone VARCHAR(15) NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                role VARCHAR(20) DEFAULT 'citizen',
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        """)
        
        # Create user_profiles table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS user_profiles (
                id INT PRIMARY KEY AUTO_INCREMENT,
                user_id VARCHAR(50) NOT NULL,
                age INT,
                blood_group VARCHAR(5),
                diseases TEXT,
                allergies TEXT,
                medications TEXT,
                emergency_contact_name VARCHAR(100),
                emergency_contact_phone VARCHAR(15),
                address TEXT,
                FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
            )
        """)
        
        conn.commit()
        print("✅ Database tables initialized successfully!")
        cursor.close()
        conn.close()
    except Error as e:
        print(f"❌ Database init error: {e}")

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

def is_valid_email_or_phone(contact):
    email_pattern = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
    phone_pattern = r'^[0-9]{10}$'
    return re.match(email_pattern, contact) or re.match(phone_pattern, contact)

class SignupRequest(BaseModel):
    name: str
    contact: str
    password: str

class LoginRequest(BaseModel):
    contact: str
    password: str

def register_auth_routes(app: FastAPI):
    
    # Initialize database on startup
    init_database()
    
    @app.post("/api/signup")
    async def signup(request: SignupRequest):
        print(f"\n" + "="*50)
        print(f"📝 SIGNUP REQUEST RECEIVED")
        print(f"="*50)
        print(f"   Name: {request.name}")
        print(f"   Email: {request.contact}")
        print(f"   Password: {request.password[:3]}***")
        
        name = request.name
        contact = request.contact
        password = request.password
        
        # Validation
        if not all([name, contact, password]):
            raise HTTPException(status_code=400, detail="All fields required")
        
        if not is_valid_email_or_phone(contact):
            raise HTTPException(status_code=400, detail="Invalid email or phone number")
        
        # Save to database
        conn = get_db_connection()
        if not conn:
            raise HTTPException(status_code=500, detail="Database connection failed")
        
        try:
            cursor = conn.cursor(dictionary=True)
            
            # Check if user exists
            cursor.execute("SELECT email FROM users WHERE email = %s", (contact,))
            if cursor.fetchone():
                cursor.close()
                conn.close()
                raise HTTPException(status_code=400, detail="User already exists")
            
            # Generate unique user_id
            user_id = f"USR{datetime.now().strftime('%Y%m%d%H%M%S')}{uuid.uuid4().hex[:4]}"
            
            # Insert user
            cursor.execute("""
                INSERT INTO users (user_id, name, email, phone, password_hash, role, created_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """, (user_id, name, contact, contact, hash_password(password), 'citizen', datetime.now()))
            
            conn.commit()
            
            print(f"\n✅ USER SAVED TO MYSQL DATABASE!")
            print(f"   User ID: {user_id}")
            print(f"   Name: {name}")
            print(f"   Email: {contact}")
            print(f"   Time: {datetime.now()}")
            
            cursor.close()
            conn.close()
            
            return {
                "success": True,
                "message": "Signup successful - Data saved to MySQL",
                "user_id": user_id,
                "name": name,
                "email": contact
            }
            
        except HTTPException:
            raise
        except Exception as e:
            print(f"❌ Database error: {e}")
            raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    
    @app.post("/api/login")
    async def login(request: LoginRequest):
        print(f"\n" + "="*50)
        print(f"🔐 LOGIN REQUEST RECEIVED")
        print(f"="*50)
        print(f"   Contact: {request.contact}")
        
        contact = request.contact
        password = request.password
        
        conn = get_db_connection()
        if not conn:
            raise HTTPException(status_code=500, detail="Database connection failed")
        
        try:
            cursor = conn.cursor(dictionary=True)
            
            cursor.execute("""
                SELECT user_id, name, email, phone, password_hash, role 
                FROM users 
                WHERE email = %s OR phone = %s
            """, (contact, contact))
            
            user = cursor.fetchone()
            cursor.close()
            conn.close()
            
            if not user:
                print(f"⚠️ User not found: {contact}")
                raise HTTPException(status_code=404, detail="User not found")
            
            if user['password_hash'] != hash_password(password):
                print(f"⚠️ Invalid password for: {contact}")
                raise HTTPException(status_code=401, detail="Invalid password")
            
            print(f"\n✅ USER LOGGED IN SUCCESSFULLY!")
            print(f"   Name: {user['name']}")
            print(f"   Email: {user['email']}")
            
            return {
                "success": True,
                "message": "Login successful",
                "name": user['name'],
                "email": user['email'],
                "user_id": user['user_id']
            }
            
        except HTTPException:
            raise
        except Exception as e:
            print(f"❌ Database error: {e}")
            raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    
    @app.get("/api/users")
    async def get_all_users():
        """Get all registered users"""
        print(f"\n📊 FETCHING ALL USERS FROM DATABASE")
        
        conn = get_db_connection()
        if not conn:
            return {"success": False, "error": "Database connection failed"}
        
        try:
            cursor = conn.cursor(dictionary=True)
            cursor.execute("""
                SELECT user_id, name, email, phone, role, created_at 
                FROM users 
                ORDER BY created_at DESC
            """)
            users = cursor.fetchall()
            cursor.close()
            conn.close()
            
            print(f"✅ Found {len(users)} users in database")
            
            return {
                "success": True,
                "count": len(users),
                "users": users
            }
            
        except Exception as e:
            print(f"❌ Error: {e}")
            return {"success": False, "error": str(e)}
    
    @app.get("/api/check-db")
    async def check_database():
        """Check database status"""
        conn = get_db_connection()
        if not conn:
            return {
                "connected": False,
                "message": "Database connection failed. Please check MySQL is running.",
                "config": DB_CONFIG
            }
        
        try:
            cursor = conn.cursor()
            cursor.execute("SELECT COUNT(*) as count FROM users")
            count = cursor.fetchone()[0]
            cursor.close()
            conn.close()
            
            return {
                "connected": True,
                "database": DB_CONFIG['database'],
                "user_count": count,
                "status": "healthy",
                "message": "Database is working correctly!"
            }
        except Exception as e:
            return {"connected": False, "error": str(e)}