from pydantic import BaseModel, EmailStr
from typing import Optional, List

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: Optional[str] = None
    phone: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class ContactCreate(BaseModel):
    name: str
    phone: str
    relationship: Optional[str] = "family"

class SOSCreate(BaseModel):
    lat: float
    lng: float
    message: Optional[str] = ""