import mysql.connector
from mysql.connector import pooling
import os
from dotenv import load_dotenv

load_dotenv()

class DatabaseConfig:
    """Database configuration for RoadSoS AI"""
    
    def __init__(self):
        self.db_config = {
            'host': os.getenv('DB_HOST', 'localhost'),
            'port': int(os.getenv('DB_PORT', 3306)),
            'database': os.getenv('DB_NAME', 'roadsos_ai_db'),
            'user': os.getenv('DB_USER', 'root'),
            'password': os.getenv('DB_PASSWORD', ''),
            'pool_name': 'roadsos_pool',
            'pool_size': 10
        }
        self.pool = None
        
    def get_connection_pool(self):
        """Create or return connection pool"""
        if not self.pool:
            self.pool = mysql.connector.pooling.MySQLConnectionPool(**self.db_config)
        return self.pool
    
    def get_connection(self):
        """Get a connection from the pool"""
        pool = self.get_connection_pool()
        return pool.get_connection()
    
    def execute_query(self, query, params=None):
        """Execute a SELECT query and return results"""
        connection = self.get_connection()
        cursor = connection.cursor(dictionary=True)
        try:
            cursor.execute(query, params or ())
            return cursor.fetchall()
        finally:
            cursor.close()
            connection.close()
    
    def execute_insert(self, query, params=None):
        """Execute INSERT and return last inserted ID"""
        connection = self.get_connection()
        cursor = connection.cursor()
        try:
            cursor.execute(query, params or ())
            connection.commit()
            return cursor.lastrowid
        finally:
            cursor.close()
            connection.close()
    
    def execute_update(self, query, params=None):
        """Execute UPDATE and return affected rows"""
        connection = self.get_connection()
        cursor = connection.cursor()
        try:
            cursor.execute(query, params or ())
            connection.commit()
            return cursor.rowcount
        finally:
            cursor.close()
            connection.close()

# Create global instance
db = DatabaseConfig()