import numpy as np
from geopy.distance import geodesic
from datetime import datetime
from typing import List, Dict, Tuple
import math

class SafetyScorer:
    def __init__(self):
        # Crime severity weights
        self.crime_weights = {
            "theft": 0.3,
            "harassment": 0.8,
            "assault": 1.0,
            "robbery": 0.9,
            "other": 0.2
        }
        
        # Time-based risk multipliers
        self.time_risk = {
            "day": 0.3,
            "evening": 0.6,
            "night": 1.0,
            "late_night": 1.2
        }
        
        # Road type safety scores
        self.road_safety = {
            "main_road": 0.9,
            "residential": 0.8,
            "market": 0.7,
            "isolated": 0.2,
            "park": 0.4
        }
    
    def calculate_safety_score(
        self,
        route_coords: List[List[float]],
        crime_data: List[Dict],
        time_of_day: str = "day",
        route_type: str = "walk"
    ) -> Tuple[int, List[str]]:
        """
        Calculate safety score for a route (0-100)
        """
        if not route_coords:
            return 50, ["No route data available"]
        
        warnings = []
        base_score = 100
        
        # 1. Crime density analysis
        crime_score = self._analyze_crime_density(route_coords, crime_data)
        if crime_score < 70:
            warnings.append("⚠ High crime density in this area")
        base_score = min(base_score, crime_score)
        
        # 2. Time-based adjustment
        time_factor = self.time_risk.get(time_of_day, 0.5)
        time_adjusted_score = base_score * (1 - (time_factor * 0.3))
        
        # 3. Route isolation factor
        isolation_factor = self._calculate_isolation(route_coords)
        if isolation_factor > 0.7:
            warnings.append("⚠ Route passes through isolated areas")
        
        # 4. Lighting and crowd estimation (simulated)
        lighting_score = self._estimate_lighting(route_coords, time_of_day)
        if lighting_score < 40:
            warnings.append("⚠ Poor lighting conditions expected")
        
        # Final score calculation
        final_score = (
            time_adjusted_score * 0.4 +
            crime_score * 0.3 +
            (100 - isolation_factor * 100) * 0.2 +
            lighting_score * 0.1
        )
        
        # Mode-specific adjustments
        if route_type == "walk":
            final_score *= 0.9  # Walking is riskier
        elif route_type == "bike":
            final_score *= 0.95
        
        final_score = max(0, min(100, int(final_score)))
        
        # Add positive notes for safe routes
        if final_score >= 80:
            warnings.append("✅ Route uses well-lit main roads")
        if final_score >= 70:
            warnings.append("✅ Lower crime density reported")
        
        return final_score, warnings
    
    def _analyze_crime_density(self, route_coords, crime_data) -> float:
        """Analyze crime density along the route"""
        if not crime_data:
            return 85  # Default score if no crime data
        
        crime_count = 0
        route_length = len(route_coords)
        
        for crime in crime_data:
            crime_lat = crime.get("lat")
            crime_lng = crime.get("lng")
            
            # Check proximity to route
            for coord in route_coords:
                distance = geodesic((crime_lat, crime_lng), (coord[0], coord[1])).meters
                if distance < 200:  # Within 200 meters
                    crime_count += crime.get("severity", 1)
                    break
        
        # Normalize crime density
        density = crime_count / max(route_length, 1)
        score = max(0, 100 - (density * 50))
        return score
    
    def _calculate_isolation(self, route_coords) -> float:
        """Calculate how isolated the route is"""
        if len(route_coords) < 2:
            return 0
        
        # Simple heuristic: longer distances between points might indicate isolation
        total_distance = 0
        for i in range(len(route_coords) - 1):
            dist = geodesic(route_coords[i], route_coords[i + 1]).meters
            total_distance += dist
        
        avg_distance = total_distance / (len(route_coords) - 1)
        
        # Normalize isolation factor (0-1)
        isolation = min(1.0, avg_distance / 1000)
        return isolation
    
    def _estimate_lighting(self, route_coords, time_of_day) -> float:
        """Estimate lighting conditions (simulated)"""
        if time_of_day in ["day", "evening"]:
            return 80
        
        # Night time
        # Simulate based on coordinate patterns (this would use real data in production)
        score = 60
        
        # Add randomness for simulation
        import random
        score += random.uniform(-20, 20)
        
        return max(10, min(100, score))

scorer = SafetyScorer()