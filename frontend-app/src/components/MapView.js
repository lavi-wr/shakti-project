import { Polyline } from "react-leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useState, useEffect } from "react";

function MapView({ routeData }) {
  const [selectedDestination, setSelectedDestination] = useState("indiaGate");
  const [selectedRoute, setSelectedRoute] = useState(1); // 1, 2, or 3

  // Destination options
  const destinations = {
    indiaGate: {
      name: "India Gate",
      position: [28.6200, 77.2200],
      routes: [
        {
          id: 1,
          name: "Safest Route",
          color: "#2ecc71",
          safetyScore: 92,
          distance: "4.2 km",
          duration: "22 mins",
          positions: [
            [28.6139, 77.2090], // Start
            [28.6155, 77.2120],
            [28.6170, 77.2150],
            [28.6185, 77.2180],
            [28.6200, 77.2200]
          ]
        },
        {
          id: 2,
          name: "Balanced Route",
          color: "#f39c12",
          safetyScore: 78,
          distance: "3.8 km",
          duration: "18 mins",
          positions: [
            [28.6139, 77.2090],
            [28.6145, 77.2135],
            [28.6160, 77.2170],
            [28.6190, 77.2195],
            [28.6200, 77.2200]
          ]
        },
        {
          id: 3,
          name: "Fastest Route",
          color: "#e74c3c",
          safetyScore: 65,
          distance: "3.2 km",
          duration: "14 mins",
          positions: [
            [28.6139, 77.2090],
            [28.6150, 77.2140],
            [28.6180, 77.2180],
            [28.6200, 77.2200]
          ]
        }
      ]
    },
    lotusTemple: {
      name: "Lotus Temple",
      position: [28.6100, 77.2300],
      routes: [
        {
          id: 1,
          name: "Safest Route",
          color: "#2ecc71",
          safetyScore: 88,
          distance: "5.1 km",
          duration: "25 mins",
          positions: [
            [28.6139, 77.2090],
            [28.6120, 77.2150],
            [28.6110, 77.2200],
            [28.6105, 77.2250],
            [28.6100, 77.2300]
          ]
        },
        {
          id: 2,
          name: "Balanced Route",
          color: "#f39c12",
          safetyScore: 75,
          distance: "4.5 km",
          duration: "20 mins",
          positions: [
            [28.6139, 77.2090],
            [28.6125, 77.2170],
            [28.6115, 77.2230],
            [28.6100, 77.2300]
          ]
        },
        {
          id: 3,
          name: "Fastest Route",
          color: "#e74c3c",
          safetyScore: 62,
          distance: "4.0 km",
          duration: "16 mins",
          positions: [
            [28.6139, 77.2090],
            [28.6120, 77.2190],
            [28.6100, 77.2300]
          ]
        }
      ]
    },
    akshardham: {
      name: "Akshardham",
      position: [28.6300, 77.2400],
      routes: [
        {
          id: 1,
          name: "Safest Route",
          color: "#2ecc71",
          safetyScore: 85,
          distance: "6.3 km",
          duration: "28 mins",
          positions: [
            [28.6139, 77.2090],
            [28.6180, 77.2150],
            [28.6220, 77.2220],
            [28.6260, 77.2300],
            [28.6300, 77.2400]
          ]
        },
        {
          id: 2,
          name: "Balanced Route",
          color: "#f39c12",
          safetyScore: 72,
          distance: "5.7 km",
          duration: "24 mins",
          positions: [
            [28.6139, 77.2090],
            [28.6170, 77.2180],
            [28.6230, 77.2280],
            [28.6300, 77.2400]
          ]
        },
        {
          id: 3,
          name: "Fastest Route",
          color: "#e74c3c",
          safetyScore: 60,
          distance: "5.2 km",
          duration: "20 mins",
          positions: [
            [28.6139, 77.2090],
            [28.6200, 77.2250],
            [28.6300, 77.2400]
          ]
        }
      ]
    },
    qutubMinar: {
      name: "Qutub Minar",
      position: [28.5900, 77.2100],
      routes: [
        {
          id: 1,
          name: "Safest Route",
          color: "#2ecc71",
          safetyScore: 90,
          distance: "3.5 km",
          duration: "20 mins",
          positions: [
            [28.6139, 77.2090],
            [28.6100, 77.2090],
            [28.6050, 77.2095],
            [28.6000, 77.2100],
            [28.5900, 77.2100]
          ]
        },
        {
          id: 2,
          name: "Balanced Route",
          color: "#f39c12",
          safetyScore: 80,
          distance: "3.1 km",
          duration: "17 mins",
          positions: [
            [28.6139, 77.2090],
            [28.6080, 77.2095],
            [28.5980, 77.2100],
            [28.5900, 77.2100]
          ]
        },
        {
          id: 3,
          name: "Fastest Route",
          color: "#e74c3c",
          safetyScore: 68,
          distance: "2.8 km",
          duration: "14 mins",
          positions: [
            [28.6139, 77.2090],
            [28.6020, 77.2095],
            [28.5900, 77.2100]
          ]
        }
      ]
    }
  };

  const currentDest = destinations[selectedDestination];
  const currentRoute = currentDest.routes.find(r => r.id === selectedRoute) || currentDest.routes[0];

  useEffect(() => {
    // Default to safest route when destination changes
    setSelectedRoute(1);
  }, [selectedDestination]);

  return (
    <div style={{ 
      width: "100%",
      background: "white",
      borderRadius: "12px",
      overflow: "hidden",
      boxShadow: "0 2px 12px rgba(0,0,0,0.1)"
    }}>
      {/* MAP CONTAINER */}
      <div style={{ height: "400px", width: "100%" }}>
        <MapContainer
          center={[28.6139, 77.2090]}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          {/* Your working tile layer - DON'T CHANGE */}
          <TileLayer
            url="https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"
            attribution="© OpenStreetMap contributors © CARTO"
          />
          
          {/* Draw all 3 routes for current destination */}
          {currentDest.routes.map(route => (
            <Polyline
              key={route.id}
              positions={route.positions}
              color={route.color}
              weight={selectedRoute === route.id ? 5 : 3}
              opacity={selectedRoute === route.id ? 0.9 : 0.3}
              dashArray={selectedRoute === route.id ? "none" : "5, 5"}
            />
          ))}
          
          {/* Start Marker */}
          <Marker position={[28.6139, 77.2090]}>
            <Popup>
              <div style={{ padding: "8px", textAlign: "center" }}>
                <strong style={{ color: "#2ecc71" }}>📍 START</strong><br/>
                Connaught Place, Delhi
              </div>
            </Popup>
          </Marker>
          
          {/* Destination Marker */}
          <Marker position={currentDest.position}>
            <Popup>
              <div style={{ padding: "8px", textAlign: "center" }}>
                <strong style={{ color: "#e74c3c" }}>🎯 DESTINATION</strong><br/>
                {currentDest.name}
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>

      {/* DESTINATION SELECTION */}
      <div style={{
        padding: "15px",
        background: "linear-gradient(135deg, #f0f7ff, #e6f2ff)",
        borderBottom: "2px solid #cce5ff"
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "15px",
          flexWrap: "wrap"
        }}>
          <div style={{ flex: 1, minWidth: "200px" }}>
            <label style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "bold",
              color: "#0077cc",
              fontSize: "14px"
            }}>
              🎯 Select Destination:
            </label>
            <select
              value={selectedDestination}
              onChange={(e) => setSelectedDestination(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "2px solid #0077cc",
                fontSize: "14px",
                background: "white",
                cursor: "pointer"
              }}
            >
              <option value="indiaGate">India Gate</option>
              <option value="lotusTemple">Lotus Temple</option>
              <option value="akshardham">Akshardham</option>
              <option value="qutubMinar">Qutub Minar</option>
            </select>
          </div>
          
          <div style={{
            background: "white",
            padding: "12px 20px",
            borderRadius: "10px",
            border: "2px solid #e91e63",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "12px", color: "#666", marginBottom: "4px" }}>
              SELECTED ROUTE
            </div>
            <div style={{ fontSize: "18px", fontWeight: "bold", color: currentRoute.color }}>
              {currentRoute.name}
            </div>
          </div>
        </div>
        
        <div style={{
          marginTop: "10px",
          padding: "10px",
          background: "white",
          borderRadius: "8px",
          border: "1px dashed #0077cc",
          fontSize: "13px",
          color: "#0077cc",
          textAlign: "center"
        }}>
          <strong>From:</strong> Connaught Place, Delhi &nbsp; • &nbsp;
          <strong>To:</strong> {currentDest.name} &nbsp; • &nbsp;
          <strong>Distance:</strong> {currentRoute.distance} &nbsp; • &nbsp;
          <strong>Duration:</strong> {currentRoute.duration}
        </div>
      </div>

      {/* ROUTE SELECTION */}
      <div style={{ padding: "20px" }}>
        <h3 style={{ 
          margin: "0 0 20px 0", 
          color: "#5a2ca0",
          textAlign: "center",
          fontSize: "20px"
        }}>
          🛣️ Choose Your Route
        </h3>
        
        {/* 3 Route Cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "15px",
          marginBottom: "25px"
        }}>
          {currentDest.routes.map(route => (
            <div
              key={route.id}
              onClick={() => setSelectedRoute(route.id)}
              style={{
                padding: "20px",
                background: selectedRoute === route.id ? route.color : "white",
                borderRadius: "12px",
                border: `3px solid ${route.color}`,
                boxShadow: selectedRoute === route.id 
                  ? `0 6px 15px ${route.color}40` 
                  : "0 4px 8px rgba(0,0,0,0.08)",
                cursor: "pointer",
                transition: "all 0.3s ease",
                textAlign: "center",
                transform: selectedRoute === route.id ? "translateY(-5px)" : "none"
              }}
            >
              <div style={{ 
                fontSize: "32px", 
                marginBottom: "15px",
                color: selectedRoute === route.id ? "white" : route.color
              }}>
                {route.id === 1 ? "🛡️" : route.id === 2 ? "⚖️" : "⚡"}
              </div>
              <div style={{ 
                fontSize: "16px", 
                fontWeight: "bold",
                color: selectedRoute === route.id ? "white" : route.color,
                marginBottom: "8px"
              }}>
                {route.name}
              </div>
              <div style={{ 
                fontSize: "36px", 
                fontWeight: "bold",
                color: selectedRoute === route.id ? "white" : route.color,
                margin: "10px 0"
              }}>
                {route.safetyScore}
                <span style={{ 
                  fontSize: "16px", 
                  color: selectedRoute === route.id ? "rgba(255,255,255,0.8)" : "#666",
                  marginLeft: "2px"
                }}>/100</span>
              </div>
              <div style={{ 
                fontSize: "13px", 
                color: selectedRoute === route.id ? "rgba(255,255,255,0.9)" : "#666",
                background: selectedRoute === route.id ? "rgba(255,255,255,0.2)" : "#f8f9fa",
                padding: "6px 10px",
                borderRadius: "6px",
                marginTop: "10px"
              }}>
                {route.distance} • {route.duration}
              </div>
              {selectedRoute === route.id && (
                <div style={{
                  marginTop: "15px",
                  padding: "8px",
                  background: "rgba(255,255,255,0.2)",
                  borderRadius: "6px",
                  fontSize: "12px",
                  color: "white",
                  fontWeight: "bold"
                }}>
                  ✅ SELECTED
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Route Details */}
        <div style={{
          background: "white",
          padding: "20px",
          borderRadius: "12px",
          border: `3px solid ${currentRoute.color}`,
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
        }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
            paddingBottom: "15px",
            borderBottom: "2px solid #f0f0f0"
          }}>
            <div>
              <h4 style={{ 
                margin: "0 0 8px 0", 
                color: currentRoute.color,
                fontSize: "18px",
                display: "flex",
                alignItems: "center",
                gap: "10px"
              }}>
                <span style={{
                  background: currentRoute.color,
                  color: "white",
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "18px"
                }}>
                  {currentRoute.id}
                </span>
                {currentRoute.name} • Safety Score: {currentRoute.safetyScore}/100
              </h4>
              <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>
                From <strong>Connaught Place</strong> to <strong>{currentDest.name}</strong>
              </p>
            </div>
            
            <div style={{ 
              background: "#f8f9fa", 
              padding: "12px 20px",
              borderRadius: "10px",
              textAlign: "center"
            }}>
              <div style={{ fontSize: "12px", color: "#666", marginBottom: "4px" }}>
                TOTAL DISTANCE
              </div>
              <div style={{ fontSize: "22px", fontWeight: "bold", color: currentRoute.color }}>
                {currentRoute.distance}
              </div>
            </div>
          </div>

          {/* Safety Insights */}
          <div>
            <h5 style={{ 
              margin: "0 0 12px 0", 
              color: "#e91e63",
              fontSize: "16px"
            }}>
              ⚠️ Safety Insights for this Route
            </h5>
            <div style={{ 
              background: currentRoute.color === "#2ecc71" ? "#f0fff4" : 
                         currentRoute.color === "#f39c12" ? "#fff9e6" : "#fff5f5",
              padding: "15px",
              borderRadius: "8px",
              borderLeft: `4px solid ${currentRoute.color}`
            }}>
              {currentRoute.id === 1 && (
                <ul style={{ margin: 0, paddingLeft: "20px" }}>
                  <li>✅ Well-lit main roads with proper street lighting</li>
                  <li>✅ Police stations within 500m along the route</li>
                  <li>✅ High pedestrian and vehicle traffic for visibility</li>
                  <li>✅ CCTV surveillance available throughout</li>
                  <li>✅ Avoids isolated areas and poorly lit streets</li>
                </ul>
              )}
              {currentRoute.id === 2 && (
                <ul style={{ margin: 0, paddingLeft: "20px" }}>
                  <li>⚠️ Some stretches with moderate lighting</li>
                  <li>✅ Passes through commercial areas with shops open till late</li>
                  <li>⚠️ Few isolated sections but generally safe</li>
                  <li>✅ Regular traffic flow throughout the day</li>
                  <li>⚡ 4 minutes faster than safest route</li>
                </ul>
              )}
              {currentRoute.id === 3 && (
                <ul style={{ margin: 0, paddingLeft: "20px" }}>
                  <li>🔴 Several poorly lit areas after dark</li>
                  <li>⚠️ Low pedestrian traffic during evening hours</li>
                  <li>🔴 Limited emergency access points</li>
                  <li>⚡ Shortest distance and fastest travel time</li>
                  <li>⚠️ Recommended only for daytime travel</li>
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Demo Info */}
        <div style={{
          marginTop: "20px",
          padding: "15px",
          background: "#fff8e1",
          borderRadius: "10px",
          border: "1px solid #ffeaa7",
          textAlign: "center"
        }}>
          <strong style={{ color: "#b7950b", fontSize: "14px" }}>
            💡 DEMO FEATURES:
          </strong>
          <p style={{ 
            margin: "10px 0 0 0", 
            fontSize: "13px", 
            color: "#856404" 
          }}>
            • Select any destination from dropdown • 3 AI-powered route options for each • 
            Different safety scores based on lighting, traffic, crime data • 
            Real-time safety insights • Route optimization for women's safety
          </p>
        </div>
      </div>
    </div>
  );
}

export default MapView;