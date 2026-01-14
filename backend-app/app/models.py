from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field
from bson import ObjectId

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate
    
    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)
    
    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")

class User(BaseModel):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    email: str
    phone: Optional[str] = None
    name: Optional[str] = None
    emergency_contacts: List[dict] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class RouteRequest(BaseModel):
    source_lat: float
    source_lng: float
    dest_lat: float
    dest_lng: float
    mode: str = "walk"  # walk, bike, car
    time_of_day: Optional[str] = None

class RouteResponse(BaseModel):
    route_id: str
    safety_score: int
    distance: float
    duration: float
    coordinates: List[List[float]]
    warnings: List[str]
    alternatives: List[dict]

class CrimeData(BaseModel):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    lat: float
    lng: float
    crime_type: str
    severity: int  # 1-5
    reported_at: datetime
    location_type: Optional[str]  # street, park, etc.
    
    class Config:
        arbitrary_types_allowed = True

class SOSAlert(BaseModel):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    user_id: str
    lat: float
    lng: float
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    status: str = "active"  # active, resolved
    contacted_authorities: bool = False
    
    class Config:
        arbitrary_types_allowed = True