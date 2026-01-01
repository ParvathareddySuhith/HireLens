from fastapi import FastAPI, HTTPException
from app.db.session import get_db_connection

from app.api.endpoints import router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="HireLens Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

@app.get("/")
def read_root():
    return {"message": "Welcome to HireLens API"}

@app.get("/health")
def health_check():
    connection = get_db_connection()
    if connection and connection.is_connected():
        connection.close()
        return {"status": "success", "message": "Database connection successful"}
    else:
        raise HTTPException(status_code=500, detail="Database connection failed")

