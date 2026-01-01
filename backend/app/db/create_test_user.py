from app.db.session import get_db_connection

def create_test_user():
    connection = get_db_connection()
    if not connection:
        print("Failed to connect to DB")
        return

    try:
        cursor = connection.cursor()
        # Check if user already exists
        cursor.execute("SELECT id FROM users WHERE email = %s", ("test@example.com",))
        result = cursor.fetchone()
        
        if result:
            print(f"Test user already exists with ID: {result[0]}")
        else:
            query = "INSERT INTO users (name, email) VALUES (%s, %s)"
            cursor.execute(query, ("Test Recruiter", "test@example.com"))
            connection.commit()
            print(f"Test user created with ID: {cursor.lastrowid}")
            
        cursor.close()
        connection.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    create_test_user()
