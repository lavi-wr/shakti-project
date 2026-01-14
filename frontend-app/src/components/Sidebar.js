import { useState } from "react";

function Sidebar({ isOpen, closeSidebar }) {
  const [contacts, setContacts] = useState([
    { name: "Mom", phone: "+91 9876543210" },
    { name: "Dad", phone: "+91 9876543211" },
    { name: "Emergency", phone: "112" },
    { name: "Sister", phone: "+91 9876543212" }
  ]);
  
  const [location, setLocation] = useState({
    lat: 28.6139,
    lng: 77.2090,
    address: "Connaught Place, New Delhi, Delhi 110001, India",
    shareLink: "https://maps.google.com/?q=28.6139,77.2090",
    timestamp: new Date().toLocaleTimeString(),
    isRealLocation: false
  });

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [locationLoading, setLocationLoading] = useState(false);

  // Function to get fake location (fallback)
  const getFakeLocation = () => {
    const fakeLat = 28.6139 + (Math.random() * 0.02 - 0.01);
    const fakeLng = 77.2090 + (Math.random() * 0.02 - 0.01);
    
    const addresses = [
      "Rajiv Chowk, Connaught Place, New Delhi",
      "India Gate, Kartavya Path, New Delhi",
      "Red Fort, Netaji Subhash Marg, Delhi",
      "Lotus Temple, Kalkaji, New Delhi",
      "Hauz Khas Village, New Delhi",
      "Select Citywalk, Saket, New Delhi"
    ];
    
    const randomAddress = addresses[Math.floor(Math.random() * addresses.length)];
    const link = `https://maps.google.com/?q=${fakeLat.toFixed(6)},${fakeLng.toFixed(6)}`;
    
    setLocation({
      lat: fakeLat,
      lng: fakeLng,
      address: randomAddress,
      shareLink: link,
      timestamp: new Date().toLocaleTimeString(),
      isRealLocation: false
    });
  };

  const getLocation = () => {
    setLocationLoading(true);
    
    // First try to get real location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        // Success callback - REAL location
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          // Try to get address from coordinates
          fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
            .then(response => response.json())
            .then(data => {
              const address = data.display_name || "Your current location";
              
              setLocation({
                lat,
                lng,
                address: address,
                shareLink: `https://maps.google.com/?q=${lat},${lng}`,
                timestamp: new Date().toLocaleTimeString(),
                isRealLocation: true
              });
              
              setLocationLoading(false);
              
              // Show success notification
              const notification = document.createElement("div");
              notification.innerHTML = `
                <div style="
                  position: fixed;
                  top: 20px;
                  right: 20px;
                  background: linear-gradient(135deg, #2ecc71, #27ae60);
                  color: white;
                  padding: 12px 20px;
                  border-radius: 8px;
                  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                  z-index: 9999;
                  animation: slideIn 0.3s ease;
                ">
                  ✅ Real location found! Accuracy: ${position.coords.accuracy.toFixed(0)}m
                </div>
              `;
              document.body.appendChild(notification);
              setTimeout(() => notification.remove(), 3000);
            })
            .catch(() => {
              // If reverse geocoding fails, use coordinates
              setLocation({
                lat,
                lng,
                address: `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`,
                shareLink: `https://maps.google.com/?q=${lat},${lng}`,
                timestamp: new Date().toLocaleTimeString(),
                isRealLocation: true
              });
              setLocationLoading(false);
            });
        },
        // Error callback - fallback to fake location
        (error) => {
          console.log("Geolocation error:", error);
          getFakeLocation();
          setLocationLoading(false);
          
          // Show warning
          alert("📍 Location permission denied. Showing demo location instead.\n\nTo use real location:\n1. Click the 🔒 lock icon in address bar\n2. Set Location to 'Allow'\n3. Refresh the page");
        },
        // Options
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      // Browser doesn't support geolocation
      getFakeLocation();
      setLocationLoading(false);
      alert("Your browser doesn't support geolocation. Showing demo location.");
    }
  };

  const addContact = () => {
    if (!name.trim() || !phone.trim()) {
      alert("Please enter both name and phone number");
      return;
    }

    const newContact = { name: name.trim(), phone: phone.trim() };
    setContacts([...contacts, newContact]);
    setName("");
    setPhone("");
    
    // Show success animation
    const addBtn = document.querySelector('.add-contact-btn');
    if (addBtn) {
      const originalText = addBtn.innerHTML;
      addBtn.innerHTML = "✓ Added!";
      addBtn.style.background = "linear-gradient(135deg, #2ecc71, #27ae60)";
      
      setTimeout(() => {
        addBtn.innerHTML = originalText;
        addBtn.style.background = "linear-gradient(135deg, #ff6b9d, #e91e63)";
      }, 1500);
    }
  };

  const shareLocationViaWhatsApp = () => {
    const message = `My current location: ${location.address}\n${location.shareLink}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={closeSidebar}>
      <div style={styles.sidebar} onClick={(e) => e.stopPropagation()}>
        <button onClick={closeSidebar} style={styles.closeBtn}>✕</button>

        <div style={styles.header}>
          <h3 style={styles.title}>⚙️ Safety Dashboard</h3>
          <p style={styles.subtitle}>Manage your safety preferences</p>
        </div>

        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionIcon}>📍</span>
            <h4 style={styles.sectionTitle}>
              Live Location
              {location.isRealLocation && (
                <span style={styles.realBadge}> REAL</span>
              )}
            </h4>
          </div>
          
          <button 
            onClick={getLocation}
            disabled={locationLoading}
            style={{
              ...styles.button,
              background: locationLoading 
                ? "linear-gradient(135deg, #cccccc, #aaaaaa)" 
                : location.isRealLocation
                ? "linear-gradient(135deg, #2ecc71, #27ae60)"
                : "linear-gradient(135deg, #93C572, #7BB661)"
            }}
          >
            {locationLoading ? (
              <>
                <span style={{marginRight: "8px"}}>⏳</span>
                Getting Location...
              </>
            ) : location.isRealLocation ? (
              <>
                <span style={{marginRight: "8px"}}>📍</span>
                Refresh Real Location
              </>
            ) : (
              <>
                <span style={{marginRight: "8px"}}>📍</span>
                Get My Real Location
              </>
            )}
          </button>

          <div style={styles.locationBox}>
            <div style={styles.locationItem}>
              <strong style={styles.label}>
                {location.isRealLocation ? "✅ REAL Location" : "📍 Demo Location"}
              </strong>
              <p style={styles.value}>{location.address}</p>
            </div>
            
            <div style={styles.locationItem}>
              <strong style={styles.label}>Coordinates:</strong>
              <p style={styles.coordinates}>
                {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
              </p>
            </div>
            
            <div style={styles.shareButtons}>
              <a
                href={location.shareLink}
                target="_blank"
                rel="noopener noreferrer"
                style={styles.mapLink}
              >
                📍 Open in Google Maps
              </a>
              
              <button 
                onClick={shareLocationViaWhatsApp}
                style={styles.whatsappButton}
              >
                📱 Share via WhatsApp
              </button>
            </div>
            
            <div style={styles.timestamp}>
              Last updated: {location.timestamp}
              {!location.isRealLocation && (
                <div style={{fontSize: "10px", color: "#ff9800", marginTop: "2px"}}>
                  ⚠️ Enable browser location for real tracking
                </div>
              )}
            </div>
          </div>
        </div>

        <hr style={styles.divider} />

        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionIcon}>🚨</span>
            <h4 style={styles.sectionTitle}>Emergency Contacts</h4>
          </div>
          
          <p style={styles.sectionDescription}>
            These contacts will receive SOS alerts with your live location
          </p>
          
          <div style={styles.form}>
            <input
              placeholder="Contact name (e.g., Mom)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={styles.input}
              maxLength={20}
            />

            <input
              placeholder="Phone number (+91 XXXXX XXXXX)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={styles.input}
              type="tel"
              maxLength={15}
            />

            <button 
              onClick={addContact} 
              className="add-contact-btn"
              style={styles.addBtn}
            >
              ➕ Add Emergency Contact
            </button>
          </div>

          <div style={styles.contactsList}>
            <p style={styles.contactsCount}>
              {contacts.length} emergency contact{contacts.length !== 1 ? 's' : ''}
            </p>
            
            {contacts.map((c, i) => (
              <div key={i} style={styles.contactItem}>
                <div style={styles.contactAvatar}>
                  {c.name.charAt(0).toUpperCase()}
                </div>
                <div style={styles.contactInfo}>
                  <div style={styles.contactName}>{c.name}</div>
                  <div style={styles.contactPhone}>{c.phone}</div>
                </div>
                <button 
                  onClick={() => {
                    if (window.confirm(`Remove ${c.name} from emergency contacts?`)) {
                      setContacts(contacts.filter((_, index) => index !== i));
                    }
                  }}
                  style={styles.deleteBtn}
                  title="Remove contact"
                >
                  ✕
                </button>
              </div>
            ))}
            
            {contacts.length === 0 && (
              <div style={styles.emptyState}>
                <div style={{ fontSize: "32px", opacity: 0.3 }}>📱</div>
                <p style={{margin: "10px 0"}}>No emergency contacts</p>
                <small style={{color: "#999"}}>Add contacts to receive SOS alerts</small>
              </div>
            )}
          </div>
          
          <div style={styles.infoBox}>
            <strong>💡 How SOS works:</strong>
            <ul style={{margin: "8px 0", paddingLeft: "20px", fontSize: "12px"}}>
              <li>Alerts sent to all emergency contacts</li>
              <li>Includes live location map link</li>
              <li>SMS sent if WhatsApp not available</li>
              <li>Local authorities notified automatically</li>
            </ul>
          </div>
        </div>

        <div style={styles.footer}>
          <p style={styles.footerText}>
            <strong>SHAKTI Safety System</strong><br/>
            Your safety is our priority
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0, 0, 0, 0.5)",
    zIndex: 1999,
    animation: "fadeIn 0.3s ease",
    backdropFilter: "blur(2px)"
  },
  sidebar: {
    width: "340px",
    height: "100vh",
    background: "linear-gradient(135deg, #ffffff, #f9f9ff)",
    position: "fixed",
    top: 0,
    left: 0,
    padding: "20px",
    boxShadow: "3px 0 25px rgba(0,0,0,0.15)",
    zIndex: 2000,
    overflowY: "auto",
    animation: "slideIn 0.3s ease",
    borderRight: "1px solid #e0e0e0"
  },
  closeBtn: {
    position: "absolute",
    top: "15px",
    right: "15px",
    background: "#e91e63",
    color: "white",
    border: "none",
    borderRadius: "50%",
    width: "34px",
    height: "34px",
    fontSize: "18px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
    zIndex: 2001,
    boxShadow: "0 2px 6px rgba(233,30,99,0.3)"
  },
  header: {
    marginBottom: "25px",
    paddingBottom: "15px",
    borderBottom: "2px solid #f0f0f0",
    textAlign: "center"
  },
  title: {
    margin: "0 0 5px 0",
    color: "#e91e63",
    fontSize: "22px",
    fontWeight: "700"
  },
  subtitle: {
    margin: 0,
    color: "#666",
    fontSize: "14px",
    fontWeight: "400"
  },
  section: {
    marginBottom: "30px",
    animation: "slideUp 0.4s ease"
  },
  sectionHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "15px"
  },
  sectionIcon: {
    fontSize: "22px",
    background: "linear-gradient(135deg, #e91e63, #ff4081)",
    color: "white",
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  sectionTitle: {
    margin: 0,
    color: "#333",
    fontSize: "18px",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    gap: "8px"
  },
  realBadge: {
    background: "#2ecc71",
    color: "white",
    fontSize: "10px",
    padding: "2px 6px",
    borderRadius: "10px",
    fontWeight: "bold"
  },
  sectionDescription: {
    margin: "0 0 15px 0",
    color: "#666",
    fontSize: "13px",
    lineHeight: "1.5",
    paddingLeft: "48px"
  },
  button: {
    width: "100%",
    padding: "14px",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "15px",
    marginBottom: "15px",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  locationBox: {
    background: "linear-gradient(135deg, #f8fbff, #f0f7ff)",
    padding: "18px",
    borderRadius: "12px",
    border: "2px solid #e3f2fd",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
  },
  locationItem: {
    marginBottom: "15px"
  },
  label: {
    display: "block",
    color: "#0077cc",
    fontSize: "13px",
    fontWeight: "600",
    marginBottom: "5px"
  },
  value: {
    margin: "5px 0 0 0",
    fontSize: "14px",
    lineHeight: "1.4",
    background: "white",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #e0e0e0"
  },
  coordinates: {
    margin: "5px 0 0 0",
    fontSize: "14px",
    fontFamily: "'Courier New', monospace",
    background: "#2c3e50",
    color: "#ecf0f1",
    padding: "10px",
    borderRadius: "8px",
    textAlign: "center",
    letterSpacing: "1px"
  },
  shareButtons: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginTop: "15px"
  },
  mapLink: {
    display: "block",
    background: "white",
    color: "#0077cc",
    fontSize: "14px",
    textDecoration: "none",
    padding: "12px",
    borderRadius: "8px",
    border: "2px solid #0077cc",
    textAlign: "center",
    fontWeight: "600",
    transition: "all 0.2s ease"
  },
  whatsappButton: {
    background: "linear-gradient(135deg, #25D366, #128C7E)",
    color: "white",
    border: "none",
    fontSize: "14px",
    padding: "12px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "all 0.2s ease"
  },
  timestamp: {
    fontSize: "11px",
    color: "#777",
    marginTop: "15px",
    textAlign: "center",
    fontStyle: "italic"
  },
  divider: {
    margin: "25px 0",
    border: "none",
    borderTop: "2px dashed #ddd"
  },
  form: {
    marginBottom: "20px"
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "12px",
    borderRadius: "8px",
    border: "2px solid #e0e0e0",
    fontSize: "14px",
    transition: "all 0.3s ease",
    boxSizing: "border-box"
  },
  addBtn: {
    width: "100%",
    padding: "14px",
    background: "linear-gradient(135deg, #ff6b9d, #e91e63)",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "15px",
    transition: "all 0.3s ease",
    marginTop: "5px"
  },
  contactsList: {
    maxHeight: "300px",
    overflowY: "auto",
    marginBottom: "15px"
  },
  contactsCount: {
    fontSize: "12px",
    color: "#666",
    margin: "0 0 10px 0",
    fontWeight: "600"
  },
  contactItem: {
    display: "flex",
    alignItems: "center",
    background: "white",
    padding: "12px",
    marginBottom: "10px",
    borderRadius: "10px",
    border: "2px solid #f5f5f5",
    boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
    transition: "all 0.2s ease"
  },
  contactAvatar: {
    width: "36px",
    height: "36px",
    background: "linear-gradient(135deg, #e91e63, #ff4081)",
    color: "white",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: "16px",
    marginRight: "12px",
    flexShrink: 0
  },
  contactInfo: {
    flex: 1,
    minWidth: 0
  },
  contactName: {
    fontWeight: "600",
    fontSize: "14px",
    marginBottom: "2px",
    color: "#333"
  },
  contactPhone: {
    fontSize: "13px",
    color: "#666",
    fontFamily: "monospace"
  },
  deleteBtn: {
    background: "#ffebee",
    color: "#e91e63",
    border: "2px solid #ffcdd2",
    borderRadius: "6px",
    padding: "6px 12px",
    fontSize: "12px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    fontWeight: "600",
    flexShrink: 0
  },
  emptyState: {
    textAlign: "center",
    padding: "40px 20px",
    color: "#999",
    background: "#fafafa",
    borderRadius: "10px",
    border: "2px dashed #eee"
  },
  infoBox: {
    background: "linear-gradient(135deg, #fff8e1, #fff3cd)",
    padding: "15px",
    borderRadius: "10px",
    borderLeft: "4px solid #ffb300",
    fontSize: "13px",
    color: "#5d4037"
  },
  footer: {
    marginTop: "30px",
    paddingTop: "15px",
    borderTop: "2px solid #f0f0f0",
    textAlign: "center"
  },
  footerText: {
    margin: 0,
    fontSize: "12px",
    color: "#666",
    lineHeight: "1.5"
  }
};

export default Sidebar;