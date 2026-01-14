import { useState } from "react";

function SOSButton() {
  const [contacts, setContacts] = useState([
    { name: "Mom", phone: "+91 9876543210" },
    { name: "Dad", phone: "+91 9876543211" },
    { name: "Emergency", phone: "112" }
  ]);

  const handleSOS = () => {
    const confirmSOS = window.confirm(
      "Are you sure you want to send SOS alert with live location?"
    );

    if (!confirmSOS) return;

    // Simulate loading
    const sosButton = document.querySelector('.sos-button');
    const originalText = sosButton.innerHTML;
    sosButton.innerHTML = "🚨 SENDING SOS...";
    sosButton.style.background = "linear-gradient(135deg, #ff3333, #ff0000)";
    sosButton.disabled = true;

    // Simulate location fetch
    setTimeout(() => {
      const fakeLat = 28.6139 + (Math.random() * 0.01 - 0.005);
      const fakeLng = 77.2090 + (Math.random() * 0.01 - 0.005);
      
      const mapLink = `https://maps.google.com/?q=${fakeLat.toFixed(6)},${fakeLng.toFixed(6)}`;

      let message = "🚨 SOS Alert Sent!\n\n";
      message += "Message sent to:\n";

      contacts.forEach((c) => {
        message += `${c.name} (${c.phone})\n`;
      });

      message += `\nMessage content:\n`;
      message += `"I am in danger. My live location is: ${mapLink}"\n\n`;
      message += `📍 Fake Location: ${fakeLat.toFixed(6)}, ${fakeLng.toFixed(6)}`;
      
      // Reset button
      sosButton.innerHTML = originalText;
      sosButton.style.background = "linear-gradient(135deg, #ff0000, #ff4444)";
      sosButton.disabled = false;
      
      // Show success message
      alert("✅ SOS alerts sent successfully!\n\n• Police notified\n• Emergency contacts alerted\n• Location shared with authorities");
      
      // Simulate flashing effect
      let flashCount = 0;
      const flashInterval = setInterval(() => {
        sosButton.style.opacity = sosButton.style.opacity === "0.7" ? "1" : "0.7";
        flashCount++;
        if (flashCount > 6) {
          clearInterval(flashInterval);
          sosButton.style.opacity = "1";
        }
      }, 200);
      
    }, 2000);
  };

  return (
    <div style={{ padding: "10px" }}>
      <button
        onClick={handleSOS}
        className="sos-button"
        style={{
          background: "linear-gradient(135deg, #ff0000, #ff4444)",
          color: "white",
          padding: "15px 20px",
          borderRadius: "12px",
          width: "100%",
          fontWeight: "bold",
          fontSize: "18px",
          border: "none",
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(255, 0, 0, 0.3)",
          transition: "all 0.3s ease"
        }}
      >
        🚨 SEND SOS ALERT (DEMO)
      </button>
      
      <div style={{
        marginTop: "15px",
        padding: "15px",
        background: "linear-gradient(135deg, #fff5f5, #ffe6e6)",
        borderRadius: "10px",
        border: "1px solid #ffcccc"
      }}>
        <h4 style={{ margin: "0 0 10px 0", color: "#cc0000" }}>Emergency Contacts:</h4>
        <ul style={{ margin: "0", paddingLeft: "20px" }}>
          {contacts.map((c, i) => (
            <li key={i} style={{ marginBottom: "8px", padding: "5px", background: "white", borderRadius: "5px" }}>
              <strong>{c.name}</strong>: {c.phone}
            </li>
          ))}
        </ul>
        <p style={{ marginTop: "10px", fontSize: "12px", color: "#666" }}>
          💡 Demo: Clicking SOS will simulate sending alerts to these contacts with your live location
        </p>
      </div>
    </div>
  );
}

export default SOSButton;