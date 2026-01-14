import requests
from typing import Optional, Dict, List
import aiohttp
import asyncio

async def get_route_from_osrm(
    src_lat: float, 
    src_lng: float, 
    dest_lat: float, 
    dest_lng: float, 
    mode: str = "walk"
) -> Optional[Dict]:
    """
    Get route from OSRM API
    """
    # Map mode to OSRM profile
    profile_map = {
        "walk": "foot",
        "bike": "bike",
        "car": "car"
    }
    
    profile = profile_map.get(mode, "foot")
    
    try:
        url = f"http://router.project-osrm.org/route/v1/{profile}/{src_lng},{src_lat};{dest_lng},{dest_lat}"
        params = {
            "overview": "full",
            "geometries": "geojson",
            "steps": "true"
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.get(url, params=params) as response:
                if response.status == 200:
                    data = await response.json()
                    
                    if data.get("code") == "Ok" and data.get("routes"):
                        route = data["routes"][0]
                        geometry = route.get("geometry", {})
                        
                        # Extract coordinates
                        coordinates = []
                        if geometry.get("type") == "LineString":
                            coordinates = [
                                [coord[1], coord[0]]  # Convert from [lng, lat] to [lat, lng]
                                for coord in geometry.get("coordinates", [])
                            ]
                        
                        return {
                            "distance": route.get("distance", 0),  # meters
                            "duration": route.get("duration", 0),  # seconds
                            "coordinates": coordinates
                        }
    
    except Exception as e:
        print(f"OSRM API error: {e}")
    
    # Fallback: Generate mock route
    return generate_mock_route(src_lat, src_lng, dest_lat, dest_lng)

def generate_mock_route(
    src_lat: float, 
    src_lng: float, 
    dest_lat: float, 
    dest_lng: float
) -> Dict:
    """Generate a mock route for testing"""
    # Simple linear interpolation
    steps = 10
    coordinates = []
    
    for i in range(steps + 1):
        ratio = i / steps
        lat = src_lat + (dest_lat - src_lat) * ratio
        lng = src_lng + (dest_lng - src_lng) * ratio
        coordinates.append([lat, lng])
    
    # Calculate approximate distance
    from geopy.distance import geodesic
    distance = geodesic((src_lat, src_lng), (dest_lat, dest_lng)).meters
    
    return {
        "distance": distance,
        "duration": distance / 1.4,  # Assume 1.4 m/s walking speed
        "coordinates": coordinates
    }