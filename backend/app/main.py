# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import Base, engine
from .api import auth, users, devices, incidents

# Ensure SQLAlchemy models are imported so they're registered on Base.metadata
from . import models

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api")
app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(devices.router, prefix="/api/devices", tags=["devices"])
app.include_router(incidents.router, prefix="/api/incidents", tags=["incidents"])

@app.get("/")
async def root():
    return {"message": "Smart Home Monitoring API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)