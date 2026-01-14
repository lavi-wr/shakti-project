from fastapi import APIRouter, Depends, HTTPException
from typing import List
import requests
from app.models import RouteRequest, RouteResponse
from app.database import db
from app.utils.safety_scoring import scorer
from app.utils.map_utils import get_route_from_osrm
from datetime import datetime
import random

router = APIRouter()

# Mock crime data (replace with real database queries)
MOCK_CRIME_DATA = [
    {"lat": 28.6139, "lng": 77.2090, "crime_type": "theft", "severity": 2},
    {"lat": 28.6145, "lng": 77.2100, "crime_type": "harassment", "severity": 3},
    {"lat": 28.6150, "lng": 77.2120, "crime_type": "other", "severity": 1},
    {"lat": 28.6200, "lng": 77.2200, "crime_type": "assault", "severity": 4},
]

@router.post("/calculate", response_model=RouteResponse)
async def calculate_safe_route(route_request: RouteRequest):
    """
    Calculate safe route between source and destination
    """
    
    # Get route from OSRM (Open Source Routing Machine)
    try:
        route_result = await get_route_from_osrm(
            route_request.source_lat,
            route_request.source_lng,
            route_request.dest_lat,
            route_request.dest_lng,
            route_request.mode
        )
        
        if not route_result:
            raise HTTPException(status_code=400, detail="Could not find route")
        
        # Calculate safety score
        safety_score, warnings = scorer.calculate_safety_score(
            route_coords=route_result["coordinates"],
            crime_data=MOCK_CRIME_DATA,  # Replace with actual crime data query
            time_of_day=route_request.time_of_day or self._get_time_of_day(),
            route_type=route_request.mode
        )
        
        # Generate alternative routes (simplified)
        alternatives = self._generate_alternatives(
            route_request.source_lat,
            route_request.source_lng,
            route_request.dest_lat,
            route_request.dest_lng,
            route_request.mode
        )
        
        return RouteResponse(
            route_id=f"route_{datetime.now().timestamp()}",
            safety_score=safety_score,
            distance=route_result["distance"],
            duration=route_result["duration"],
            coordinates=route_result["coordinates"],
            warnings=warnings,
            alternatives=alternatives[:2]  # Return top 2 alternatives
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/crime-hotspots")
async def get_crime_hotspots(
    ne_lat: float, ne_lng: float,
    sw_lat: float, sw_lng: float
):
    """
    Get crime hotspots in a bounding box
    """
    # Query crime data in the bounding box
    crimes = await db.db.crime_data.find({
        "lat": {"$gte": sw_lat, "$lte": ne_lat},
        "lng": {"$gte": sw_lng, "$lte": ne_lng}
    }).to_list(100)
    
    return {
        "count": len(crimes),
        "hotspots": [
            {
                "lat": crime["lat"],
                "lng": crime["lng"],
                "severity": crime.get("severity", 1),
                "type": crime.get("crime_type", "unknown")
            }
            for crime in crimes
        ]
    }

def _get_time_of_day(self):
    hour = datetime.now().hour
    if 6 <= hour < 12:
        return "day"
    elif 12 <= hour < 18:
        return "afternoon"
    elif 18 <= hour < 22:
        return "evening"
    else:
        return "night"

def _generate_alternatives(self, src_lat, src_lng, dest_lat, dest_lng, mode):
    """Generate alternative routes (simplified mock)"""
    alternatives = []
    
    # Alternative 1: Safer but longer
    alternatives.append({
        "safety_score": 92,
        "distance": 3500,  # meters
        "duration": 1800,  # seconds
        "coordinates": [
            [src_lat, src_lng],
            [src_lat + 0.002, src_lng + 0.001],
            [dest_lat, dest_lng]
        ],
        "description": "Uses main roads, well-lit areas"
    })
    
    # Alternative 2: Balanced
    alternatives.append({
        "safety_score": 78,
        "distance": 2800,
        "duration": 1500,
        "coordinates": [
            [src_lat, src_lng],
            [src_lat + 0.001, src_lng],
            [dest_lat, dest_lng]
        ],
        "description": "Mix of main and residential roads"
    })
    
    return alternatives