import { useState } from "react";

function Controls({ onRoute }) {
  const [from, setFrom] = useState("Connaught Place, Delhi");
  const [to, setTo] = useState("India Gate, Delhi");
  const [mode, setMode] = useState("walk");
  const [loading, setLoading] = useState(false);

  const handleFindRoute = () => {
    setLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      // Generate fake route coordinates
      const fakeRoute = [
        [28.6139, 77.2090], // Delhi
        [28.6145, 77.2120],
        [28.6155, 77.2150],
        [28.6165, 77.2180],
        [28.6175, 77.2210],
        [28.6185, 77.2240],
      ];
      
      // Generate random safety score
      const safetyScore = Math.floor(Math.random() * 30) + 70; // 70-100
      
      // Random alerts
      const alerts = [
        "⚠️ Avoided low-lighting street near Kashmere Gate",
        "⚠️ Higher crime frequency reported at night in this area",
        "✅ Route passes through well-lit main roads",
        "✅ Police station within 500m",
        "✅ CCTV surveillance available",
        "✅ Streetlights functional in this route",
        "⚠️ Fewer pedestrians during evening hours",
        "✅ Emergency SOS poles available along route"
      ];
      
      // Randomly select 3 alerts
      const selectedAlerts = [];
      while (selectedAlerts.length < 3) {
        const randomAlert = alerts[Math.floor(Math.random() * alerts.length)];
        if (!selectedAlerts.includes(randomAlert)) {
          selectedAlerts.push(randomAlert);
        }
      }
      
      // Pass data to parent
      onRoute({
        from,
        to,
        mode,
        route: fakeRoute,
        safetyScore,
        alerts: selectedAlerts,
        distance: `${(Math.random() * 3 + 2).toFixed(1)} km`,
        duration: `${Math.floor(Math.random() * 20 + 15)} mins`,
        eta: new Date(Date.now() + (Math.random() * 20 + 15) * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      
      setLoading(false);
    }, 1500);
  };

  return (
    <div style={{ 
      padding: "20px", 
      background: "linear-gradient(135deg, #ffffff, #f9f9f9)",
      borderRadius: "12px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.05)"
    }}>
      <h3 style={{ 
        margin: "0 0 20px 0", 
        color: "#93C572",
        fontSize: "22px",
        display: "flex",
        alignItems: "center",
        gap: "10px"
      }}>
        <span>🔍</span> Find Safe Route
      </h3>
      
      <div style={{ marginBottom: "15px" }}>
        <label style={{ 
          display: "block", 
          marginBottom: "5px", 
          fontWeight: "bold",
          color: "#555"
        }}>Start Location:</label>
        <input 
          placeholder="From" 
          value={from} 
          onChange={e => setFrom(e.target.value)} 
          style={{ 
            width: "100%", 
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ddd",
            fontSize: "16px"
          }}
        />
      </div>
      
      <div style={{ marginBottom: "15px" }}>
        <label style={{ 
          display: "block", 
          marginBottom: "5px", 
          fontWeight: "bold",
          color: "#555"
        }}>Destination:</label>
        <input 
          placeholder="To" 
          value={to} 
          onChange={e => setTo(e.target.value)} 
          style={{ 
            width: "100%", 
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ddd",
            fontSize: "16px"
          }}
        />
      </div>
      
      <div style={{ marginBottom: "20px" }}>
        <label style={{ 
          display: "block", 
          marginBottom: "5px", 
          fontWeight: "bold",
          color: "#555"
        }}>Travel Mode:</label>
        <select 
          value={mode} 
          onChange={e => setMode(e.target.value)}
          style={{ 
            width: "100%", 
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ddd",
            fontSize: "16px",
            background: "white"
          }}
        >
          <option value="walk">🚶 Walking</option>
          <option value="bike">🚲 Cycling</option>
          <option value="car">🚗 Driving</option>
          <option value="public">🚌 Public Transport</option>
        </select>
      </div>

      <button 
        onClick={handleFindRoute}
        disabled={loading}
        style={{
          background: loading 
            ? "linear-gradient(135deg, #cccccc, #aaaaaa)" 
            : "linear-gradient(135deg, #93C572, #7BB661)",
          color: "white",
          padding: "14px 20px",
          fontWeight: "bold",
          borderRadius: "8px",
          border: "none",
          cursor: loading ? "not-allowed" : "pointer",
          width: "100%",
          fontSize: "16px",
          transition: "all 0.3s ease",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px"
        }}
      >
        {loading ? (
          <>
            <span>⏳</span> Finding Safest Route...
          </>
        ) : (
          <>
            <span>🔍</span> Find Safe Route (AI-Powered)
          </>
        )}
      </button>
      
      <div style={{
        marginTop: "20px",
        padding: "15px",
        background: "linear-gradient(135deg, #f0f8ff, #e6f3ff)",
        borderRadius: "8px",
        fontSize: "14px",
        border: "1px solid #cce5ff"
      }}>
        <strong style={{ color: "#0077cc", display: "flex", alignItems: "center", gap: "5px" }}>
          <span>💡</span> Demo Features:
        </strong>
        <ul style={{ margin: "10px 0 0 0", paddingLeft: "20px" }}>
          <li>AI-powered safety scoring</li>
          <li>Real-time crime data analysis</li>
          <li>Route optimization for safety</li>
          <li>Emergency points identification</li>
        </ul>
      </div>
    </div>
  );
}

export default Controls;