import os
import mysql.connector
from dotenv import load_dotenv

load_dotenv()

def get_db_connection():
    try:
        connection = mysql.connector.connect(
            host=os.getenv("DB_HOST", "localhost"),
            user=os.getenv("DB_USER", "root"),
            password=os.getenv("DB_PASSWORD", ""),
            database=os.getenv("DB_NAME", "hirelens_db")
        )
        return connection
    except mysql.connector.Error as err:
        print(f"Error: {err}")
        import traceback
        traceback.print_exc()
        return None
