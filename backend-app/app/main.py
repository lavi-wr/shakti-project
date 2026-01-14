from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from app.database import db
from app.routes import auth, routes, sos, crime_data
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="SHAKTI Safety Navigation API",
    description="AI-powered safety-first navigation system for women and night commuters",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

@app.on_event("startup")
async def startup_db_client():
    await db.connect()

@app.on_event("shutdown")
async def shutdown_db_client():
    await db.disconnect()

# Include routers
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(routes.router, prefix="/routes", tags=["Routes"])
app.include_router(sos.router, prefix="/sos", tags=["SOS"])
app.include_router(crime_data.router, prefix="/crime", tags=["Crime Data"])

@app.get("/")
async def root():
    return {
        "message": "Welcome to SHAKTI Safety Navigation API",
        "docs": "/docs",
        "version": "1.0.0"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "shakti-backend"}