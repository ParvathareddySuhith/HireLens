import os
import mysql.connector
from dotenv import load_dotenv

# Load env from parent directory (as this script is in app/db)
# Adjust path based on where we run it. Assuming running from backend/
load_dotenv()

def init_db():
    try:
        # Connect without database to create it
        connection = mysql.connector.connect(
            host=os.getenv("DB_HOST", "localhost"),
            user=os.getenv("DB_USER", "root"),
            password=os.getenv("DB_PASSWORD", "")
        )
        cursor = connection.cursor()
        
        # Read schema.sql
        schema_path = os.path.join(os.path.dirname(__file__), "..", "schema.sql")
        with open(schema_path, "r") as f:
            schema_sql = f.read()
        
        # Execute statements
        # split by ; to handle multiple statements
        statements = schema_sql.split(';')
        for stmt in statements:
            if stmt.strip():
                cursor.execute(stmt)
        
        connection.commit()
        print("Database initialized successfully.")
        
        cursor.close()
        connection.close()
        
    except mysql.connector.Error as err:
        print(f"Error: {err}")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    init_db()
